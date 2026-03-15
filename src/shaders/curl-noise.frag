#version 300 es
/**
 * Curl Noise Shader
 * Divergence-free noise field for smoke/fluid-like visuals.
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
uniform float u_layers;
uniform float u_advection;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_contrast;
uniform float u_brightness;

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

// Compute curl from 2D noise field
vec2 curl(vec2 p) {
  float eps = 0.01;
  float n1 = noise(p + vec2(eps, 0.0));
  float n2 = noise(p - vec2(eps, 0.0));
  float n3 = noise(p + vec2(0.0, eps));
  float n4 = noise(p - vec2(0.0, eps));
  
  float dndx = (n1 - n2) / (2.0 * eps);
  float dndy = (n3 - n4) / (2.0 * eps);
  
  // Curl is the perpendicular of the gradient
  return vec2(dndy, -dndx) * u_curlStrength;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= u_layers) break;
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  
  float t = u_time * u_speed;
  vec2 p = uv * u_scale;
  
  // Advect position along curl field
  vec2 pos = p;
  for (int i = 0; i < 6; i++) {
    vec2 c = curl(pos + t * 0.1);
    pos += c * u_advection * 0.1;
  }
  
  // Sample noise at advected position
  float n = fbm(pos + vec2(t * 0.1, t * 0.08));
  float n2 = fbm(pos * 1.5 + vec2(-t * 0.05, t * 0.12));
  
  // Curl magnitude visualization
  vec2 c = curl(p + t * 0.1);
  float curlMag = length(c) * 0.3;
  
  // Combine
  float combined = n * 0.6 + n2 * 0.3 + curlMag * 0.1;
  combined = combined * 0.5 + 0.5;
  
  // Apply brightness and contrast
  combined = (combined - 0.5) * u_contrast + 0.5 + u_brightness;
  combined = clamp(combined, 0.0, 1.0);
  
  // Color with smooth gradient
  vec3 color = mix(u_color1, u_color2, smoothstep(0.2, 0.8, combined));
  
  // Wispy streaks from curl flow
  float streaks = abs(sin(pos.x * 20.0 + pos.y * 15.0)) * 0.15;
  color += streaks * u_color2;
  
  // Soft glow in high-curl regions
  color += curlMag * u_color2 * 0.3;
  
  fragColor = vec4(color, 1.0);
}
