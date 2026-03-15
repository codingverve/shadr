#version 300 es
/**
 * Marble / Liquid Pattern Shader
 * Rich veined marble texture with turbulence distortion.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_veinSharpness;
uniform float u_turbulence;
uniform float u_layers;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_veinColor;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_veinIntensity;
uniform float u_glowIntensity;

// Simplex-like noise
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

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
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
  int layers = int(u_layers);

  // Turbulence distortion
  float turb = fbm(uv * 2.0 + t * 0.1, layers) * u_turbulence;
  float turb2 = fbm(uv * 1.5 + vec2(5.0, 3.0) + t * 0.08, layers) * u_turbulence;

  // Main marble vein pattern
  float vein1 = sin((uv.x + turb) * 8.0 + (uv.y + turb2) * 4.0 + t * 0.5);
  float vein2 = sin((uv.y + turb * 1.3) * 6.0 - (uv.x + turb2 * 0.8) * 3.0 + t * 0.3);

  // Sharpen veins
  vein1 = pow(abs(vein1), u_veinSharpness);
  vein2 = pow(abs(vein2), u_veinSharpness * 1.2);

  // Combine veins
  float veins = max(vein1, vein2 * 0.7);

  // Background marble texture
  float marble = fbm(uv * 3.0 + turb * 0.5 + t * 0.05, layers);
  marble = marble * 0.5 + 0.5;

  // Color composition
  vec3 baseColor = mix(u_color1, u_color2, marble);
  
  // Apply brightness and contrast
  baseColor = (baseColor - 0.5) * u_contrast + 0.5 + u_brightness;
  
  vec3 color = mix(baseColor, u_veinColor, veins * u_veinIntensity);

  // Subtle surface highlights (simulate polished stone)
  float highlight = pow(marble, 4.0) * 0.5 * u_glowIntensity;
  color += vec3(1.0) * highlight;

  // Depth and sheen
  float sheen = pow(max(0.0, 1.0 - veins), 3.0) * 0.2 * u_glowIntensity;
  color += u_veinColor * sheen;

  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.3;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
