#version 300 es
/**
 * Domain Warp Shader
 * Multi-level domain distortion creating organic flowing shapes.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_warpStrength;
uniform float u_warpLayers;
uniform float u_complexity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
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
  
  // Multi-level domain warping
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.1),
    fbm(p + vec2(5.2, 1.3) + t * 0.08)
  );
  
  vec2 r = q;
  if (u_warpLayers >= 2.0) {
    r = vec2(
      fbm(p + u_warpStrength * q + vec2(1.7, 9.2) + t * 0.05),
      fbm(p + u_warpStrength * q + vec2(8.3, 2.8) - t * 0.06)
    );
  }
  
  vec2 s = r;
  if (u_warpLayers >= 3.0) {
    s = vec2(
      fbm(p + u_warpStrength * r + vec2(3.1, 7.4) + t * 0.03),
      fbm(p + u_warpStrength * r + vec2(6.5, 4.1) - t * 0.04)
    );
  }
  
  float f = fbm(p + u_warpStrength * s);
  
  // Map to colors using luminance bands
  float n = f * 0.5 + 0.5;
  vec3 color;
  float t1 = 0.35;
  float t2 = 0.65;
  if (n < t1) {
    color = mix(u_color1, u_color2, n / t1);
  } else if (n < t2) {
    color = mix(u_color2, u_color3, (n - t1) / (t2 - t1));
  } else {
    color = mix(u_color3, u_color1 + 0.3, (n - t2) / (1.0 - t2));
  }
  
  // Warp pattern highlights
  float warpVis = length(s) * 0.4;
  color += warpVis * u_color2 * 0.15;
  
  fragColor = vec4(color, 1.0);
}
