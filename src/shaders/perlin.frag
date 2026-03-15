#version 300 es
/**
 * Perlin Noise Shader
 * Classic gradient noise with octave layering and smooth interpolation.
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
uniform float u_persistence;
uniform float u_lacunarity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_warp;
uniform float u_glow;

// Perlin gradient hash
vec2 grad(ivec2 p) {
  int h = ((p.x * 1619 + p.y * 31337 + 1013) * 13) & 7;
  float angle = float(h) * 0.7854; // pi/4
  return vec2(cos(angle), sin(angle));
}

// Classic Perlin noise
float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  // Quintic interpolation
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  
  ivec2 ip = ivec2(i);
  float g00 = dot(grad(ip), f);
  float g10 = dot(grad(ip + ivec2(1, 0)), f - vec2(1.0, 0.0));
  float g01 = dot(grad(ip + ivec2(0, 1)), f - vec2(0.0, 1.0));
  float g11 = dot(grad(ip + ivec2(1, 1)), f - vec2(1.0, 1.0));
  
  return mix(mix(g00, g10, u.x), mix(g01, g11, u.x), u.y);
}

// Layered Perlin with octaves
float layeredPerlin(vec2 p, int octaves, float persistence, float lacunarity) {
  float total = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maxVal = 0.0;
  
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    total += perlin(p * frequency) * amplitude;
    maxVal += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  
  return total / maxVal;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  
  float t = u_time * u_speed;
  vec2 p = uv * u_scale;
  
  // Domain warping
  if (u_warp > 0.0) {
    vec2 warp = vec2(
      perlin(p + vec2(0.0, t)),
      perlin(p + vec2(5.2, 1.3 + t))
    );
    p += warp * u_warp;
  }
  
  p += vec2(t * 0.3, t * 0.2);
  
  float n = layeredPerlin(p, int(u_octaves), u_persistence, u_lacunarity);
  n = n * 0.5 + 0.5; // Remap to 0-1
  
  // Apply brightness and contrast
  n = (n - 0.5) * u_contrast + 0.5 + u_brightness;
  n = clamp(n, 0.0, 1.0);
  
  // Color mapping
  vec3 color = mix(u_color1, u_color2, n);
  
  // Glow effect
  if (u_glow > 0.0) {
    float glow = smoothstep(0.4, 1.0, n);
    color += u_color2 * glow * u_glow;
  }
  
  fragColor = vec4(color, 1.0);
}
