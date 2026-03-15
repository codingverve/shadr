#version 300 es
/**
 * Simplex Noise Fragment Shader
 * 
 * A beautiful animated noise pattern using 3D simplex noise with FBM layering.
 * Produces organic, flowing, liquid-like patterns that look stunning by default.
 * 
 * Uniforms:
 *   u_time       - Animation time
 *   u_resolution - Canvas resolution
 *   u_mouse      - Mouse position (0-1)
 *   u_scale      - Pattern zoom level
 *   u_speed      - Animation speed multiplier
 *   u_octaves    - Number of FBM layers (1-8)
 *   u_persistence - Amplitude decay per octave
 *   u_lacunarity  - Frequency multiplier per octave
 *   u_color1     - Primary gradient color
 *   u_color2     - Secondary gradient color
 *   u_warp       - Domain warping strength
 * 
 * Author: Shader Pattern Generator
 * Date: 2026-03-15
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform int u_octaves;
uniform float u_persistence;
uniform float u_lacunarity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_warp;
uniform float u_contrast;
uniform float u_brightness;

// --- Simplex 3D Noise (Ashima Arts) ---
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// --- Fractal Brownian Motion ---
float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float maxValue = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return value / maxValue;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * u_speed;

  // Domain warping for organic feel
  vec3 pos = vec3(uv * u_scale, t * 0.3);

  float warpNoise1 = fbm(pos + vec3(0.0, 0.0, t * 0.1), u_octaves, u_persistence, u_lacunarity);
  float warpNoise2 = fbm(pos + vec3(5.2, 1.3, t * 0.15), u_octaves, u_persistence, u_lacunarity);

  vec3 warpedPos = pos + u_warp * vec3(warpNoise1, warpNoise2, 0.0);

  float noise = fbm(warpedPos, u_octaves, u_persistence, u_lacunarity);

  // Map noise to [0, 1] range
  float n = noise * 0.5 + 0.5;

  // Apply brightness and contrast
  n = (n - 0.5) * u_contrast + 0.5 + u_brightness;
  n = clamp(n, 0.0, 1.0);

  // Create a richer color blend with highlights
  vec3 color = mix(u_color1, u_color2, n);

  // Add subtle highlights at peaks
  float highlight = smoothstep(0.65, 0.9, n);
  color += highlight * 0.3;

  // Slight vignette for depth
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.5;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
