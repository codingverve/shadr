#version 300 es
/**
 * Kaleidoscope Pattern Shader
 * N-fold symmetric mirroring with animated base pattern.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_segments;
uniform float u_rotation;
uniform float u_zoom;
uniform float u_speed;
uniform float u_complexity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_glowIntensity;

// Noise
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
  vec2 uv = v_uv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * u_speed;

  // Apply rotation
  float rot = u_rotation + t * 0.1;
  float cs = cos(rot), sn = sin(rot);
  uv = mat2(cs, -sn, sn, cs) * uv;

  // Convert to polar
  float angle = atan(uv.y, uv.x);
  float radius = length(uv) * u_zoom;

  // Mirror into segments
  float segAngle = 6.2831 / u_segments;
  angle = mod(angle, segAngle);
  angle = abs(angle - segAngle * 0.5);

  // Back to cartesian
  vec2 p = vec2(cos(angle), sin(angle)) * radius;

  // Generate base pattern
  float n1 = fbm(p * u_complexity + t * 0.2);
  float n2 = fbm(p * u_complexity * 1.5 + vec2(5.0, 3.0) - t * 0.15);

  // Color mapping
  float blend1 = smoothstep(-0.2, 0.8, n1);
  float blend2 = smoothstep(-0.1, 0.6, n2);

  // Apply brightness and contrast to blends
  blend1 = (blend1 - 0.5) * u_contrast + 0.5 + u_brightness;
  blend2 = (blend2 - 0.5) * u_contrast + 0.5 + u_brightness;
  blend1 = clamp(blend1, 0.0, 1.0);
  blend2 = clamp(blend2, 0.0, 1.0);

  vec3 color = mix(u_color1, u_color2, blend1);
  color = mix(color, u_color3, blend2 * 0.6);

  // Add radial glow
  float glow = exp(-radius * 1.5) * u_glowIntensity;
  color += u_color2 * glow;

  // Bright highlights at symmetry lines
  float lineDist = abs(sin(angle * u_segments));
  float lineGlow = pow(lineDist, 8.0) * 0.3 * u_glowIntensity;
  color += lineGlow;

  // Vignette
  float vignette = 1.0 - dot(v_uv - 0.5, v_uv - 0.5) * 0.6;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
