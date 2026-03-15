#version 300 es
/**
 * fBm / Turbulence Noise Shader
 * Fractal Brownian Motion with turbulence toggle (abs value noise).
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_octaves;
uniform float u_gain;
uniform float u_turbulence; // 0 = smooth fBm, 1 = turbulence
uniform float u_warp;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_contrast;
uniform float u_brightness;
uniform vec3 u_color3;

// Hash-based noise
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// fBm with optional turbulence
float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 8; i++) {
    if (i >= int(u_octaves)) break;
    float n = noise(p * frequency);
    // Mix between smooth fBm and turbulence (absolute value)
    n = mix(n, abs(n), u_turbulence);
    total += n * amplitude;
    frequency *= 2.0;
    amplitude *= u_gain;
  }
  
  return total;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  
  float t = u_time * u_speed;
  vec2 p = uv * u_scale;
  
  // Domain warping
  if (u_warp > 0.01) {
    vec2 q = vec2(
      fbm(p + vec2(t * 0.2, 0.0)),
      fbm(p + vec2(0.0, t * 0.15))
    );
    p += q * u_warp;
  }
  
  float n = fbm(p + vec2(t * 0.1));
  
  // Triple color gradient
  float n01 = n * 0.5 + 0.5;
  
  // Apply brightness and contrast
  n01 = (n01 - 0.5) * u_contrast + 0.5 + u_brightness;
  n01 = clamp(n01, 0.0, 1.0);

  vec3 color;
  if (n01 < 0.4) {
    color = mix(u_color1, u_color2, n01 / 0.4);
  } else {
    color = mix(u_color2, u_color3, (n01 - 0.4) / 0.6);
  }
  
  // Turbulence highlights
  float tHigh = pow(max(n, 0.0), 3.0) * u_turbulence * 0.5;
  color += tHigh;
  
  fragColor = vec4(color, 1.0);
}
