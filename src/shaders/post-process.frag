#version 300 es
/**
 * Post-Processing Fragment Shader
 * 
 * Composable visual effects:
 * - Bloom, Film Grain, Chromatic Aberration, Vignette
 * - Kaleidoscope symmetry (UV mirroring)
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_scene;
uniform vec2 u_resolution;
uniform float u_time;

// Effect intensities (0 = off)
uniform float u_bloom;
uniform float u_grain;
uniform float u_chromaticAberration;
uniform float u_vignette;
uniform float u_kaleidoscope;
uniform float u_kaleidoscopeSegments;

// --- Kaleidoscope UV transform ---
vec2 kaleidoscopeUV(vec2 uv, float segments) {
  vec2 centered = uv - 0.5;
  float angle = atan(centered.y, centered.x);
  float radius = length(centered);

  float segAngle = 6.2831 / segments;
  angle = mod(angle, segAngle);
  angle = abs(angle - segAngle * 0.5);

  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

// --- Bloom ---
vec3 sampleBloom(vec2 uv, vec2 texelSize) {
  vec3 bloom = vec3(0.0);
  float total = 0.0;
  const int SAMPLES = 6;
  for (int x = -SAMPLES; x <= SAMPLES; x++) {
    for (int y = -SAMPLES; y <= SAMPLES; y++) {
      vec2 offset = vec2(float(x), float(y)) * texelSize * 2.0;
      vec3 s = texture(u_scene, uv + offset).rgb;
      float brightness = dot(s, vec3(0.2126, 0.7152, 0.0722));
      float weight = max(brightness - 0.5, 0.0) * 2.0;
      float dist = length(vec2(float(x), float(y)));
      float gaussian = exp(-dist * dist / 18.0);
      bloom += s * weight * gaussian;
      total += gaussian;
    }
  }
  return bloom / max(total, 1.0);
}

// --- Film Grain ---
float grainNoise(vec2 uv, float t) {
  vec2 seed = uv * vec2(12.9898, 78.233) + t * 0.1;
  return fract(sin(dot(seed, vec2(127.1, 311.7))) * 43758.5453) * 2.0 - 1.0;
}

void main() {
  vec2 uv = v_uv;

  // --- Kaleidoscope (applied first, before sampling) ---
  if (u_kaleidoscope > 0.5) {
    uv = kaleidoscopeUV(uv, u_kaleidoscopeSegments);
  }

  vec2 texelSize = 1.0 / u_resolution;

  // --- Chromatic Aberration ---
  vec3 color;
  if (u_chromaticAberration > 0.001) {
    float offset = u_chromaticAberration * 0.01;
    vec2 dir = (uv - 0.5) * offset;
    color.r = texture(u_scene, uv + dir).r;
    color.g = texture(u_scene, uv).g;
    color.b = texture(u_scene, uv - dir).b;
  } else {
    color = texture(u_scene, uv).rgb;
  }

  // --- Bloom ---
  if (u_bloom > 0.001) {
    vec3 bloom = sampleBloom(uv, texelSize);
    color += bloom * u_bloom;
  }

  // --- Film Grain ---
  if (u_grain > 0.001) {
    float noise = grainNoise(uv, u_time);
    color += noise * u_grain * 0.15;
  }

  // --- Vignette ---
  if (u_vignette > 0.001) {
    vec2 vigUv = v_uv - 0.5;
    float vig = 1.0 - dot(vigUv, vigUv) * u_vignette * 2.0;
    vig = clamp(vig, 0.0, 1.0);
    color *= vig;
  }

  fragColor = vec4(color, 1.0);
}
