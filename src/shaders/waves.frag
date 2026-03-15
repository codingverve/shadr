#version 300 es
/**
 * Waves & Ripples Pattern Shader
 * Interference pattern from multiple concentric wave sources.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_waveCount;
uniform float u_frequency;
uniform float u_amplitude;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_decay;
uniform float u_causticIntensity;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  uv *= u_scale;

  float t = u_time * u_speed;
  float waves = 0.0;

  // Generate multiple wave sources
  int count = int(u_waveCount);
  for (int i = 0; i < 8; i++) {
    if (i >= count) break;

    float fi = float(i);
    // Distribute sources in interesting positions
    vec2 center = vec2(
      0.5 * aspect * u_scale + sin(fi * 2.399 + t * 0.3) * u_scale * 0.3,
      0.5 * u_scale + cos(fi * 1.871 + t * 0.2) * u_scale * 0.3
    );

    float dist = length(uv - center);
    float wave = sin(dist * u_frequency - t * 3.0 + fi * 1.047) * u_amplitude;
    waves += wave / (1.0 + dist * u_decay); // Attenuate with decay parameter
  }

  // Normalize and map to color
  waves = waves / u_waveCount;
  
  // Apply brightness and contrast
  waves = (waves * u_contrast) + u_brightness;
  
  float n = 0.5 + 0.5 * sin(waves * 6.2831);

  // Pearlescent color blend
  vec3 color = mix(u_color1, u_color2, n);

  // Add bright caustic highlights
  if (u_causticIntensity > 0.0) {
    float caustic = pow(max(0.0, sin(waves * 12.566)), 8.0) * u_causticIntensity;
    color = mix(color, vec3(1.0), caustic);
  }

  // Specular highlights
  float spec = pow(n, 6.0) * 0.4;
  color += u_color2 * spec;

  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.5;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
