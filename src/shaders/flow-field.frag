#version 300 es
/**
 * Flow Field Pattern Shader
 * Curl noise visualization creating smooth, flowing lines.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_curlStrength;
uniform float u_density;
uniform float u_lineWidth;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_complexity;
uniform float u_contrast;
uniform float u_brightness;

// Simple 2D noise
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Curl of noise for divergence-free flow
vec2 curlNoise(vec2 p) {
  float eps = 0.01;
  float n1 = noise(p + vec2(0.0, eps));
  float n2 = noise(p - vec2(0.0, eps));
  float n3 = noise(p + vec2(eps, 0.0));
  float n4 = noise(p - vec2(eps, 0.0));
  float dx = (n1 - n2) / (2.0 * eps);
  float dy = (n3 - n4) / (2.0 * eps);
  return vec2(dx, -dy) * u_curlStrength;
}

// FBM for layered noise
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  uv *= u_scale;

  float t = u_time * u_speed;

  // Advect position through the flow field
  vec2 pos = uv;
  int iters = clamp(int(u_complexity), 1, 16);
  for (int i = 0; i < iters; i++) {
    vec2 curl = curlNoise(pos + t * 0.1);
    pos += curl * 0.05;
  }

  // Create line pattern based on flow-aligned coordinates
  float flowNoise = fbm(pos * u_density);
  float lines = sin(flowNoise * (20.0 + 20.0 * u_density) + t * 2.0);
  lines = pow(abs(lines), u_lineWidth);

  // Secondary flow for depth
  float flowNoise2 = fbm(pos * u_density * 0.5 + vec2(5.0, 3.0));
  float lines2 = sin(flowNoise2 * (15.0 + 15.0 * u_density) - t * 1.5);
  lines2 = pow(abs(lines2), u_lineWidth * 1.5);

  float combined = max(lines, lines2 * 0.6);
  
  // Apply brightness and contrast
  combined = (combined - 0.5) * u_contrast + 0.5 + u_brightness;
  combined = clamp(combined, 0.0, 1.0);

  // Color mapping
  vec3 color = mix(u_color1, u_color2, combined);

  // Bright streaks
  float bright = pow(combined, 3.0) * 0.8;
  color += bright;

  // Add subtle glow at high flow areas
  float flowMag = length(curlNoise(uv + t * 0.05));
  color += u_color2 * flowMag * 0.15;

  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.4;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
