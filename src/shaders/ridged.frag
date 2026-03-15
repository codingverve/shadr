#version 300 es
/**
 * Ridged Multifractal Noise Shader
 * Sharp ridge/vein structures through inverted absolute noise.
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
uniform float u_sharpness;
uniform float u_ridgeOffset;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
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

// Ridged noise: 1 - abs(noise), raised to power for sharpness
float ridgedNoise(vec2 p) {
  float n = noise(p);
  n = u_ridgeOffset - abs(n);
  return pow(max(n, 0.0), u_sharpness);
}

float ridgedFBM(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float prev = 1.0;
  
  for (int i = 0; i < 8; i++) {
    if (i >= int(u_octaves)) break;
    float n = ridgedNoise(p * frequency);
    // Weight by previous octave for sharper ridges
    total += n * amplitude * prev;
    prev = n;
    frequency *= 2.1;
    amplitude *= 0.5;
  }
  
  return total;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  
  float t = u_time * u_speed;
  float n = ridgedFBM(p);
  
  // Apply brightness and contrast
  n = (n - 0.5) * u_contrast + 0.5 + u_brightness;
  n = clamp(n, 0.0, 1.0);
  
  // Tri-color gradient: dark valleys → mid tones → bright ridges
  vec3 color;
  if (n < 0.3) {
    color = mix(u_color1, u_color2, n / 0.3);
  } else {
    color = mix(u_color2, u_color3, (n - 0.3) / 0.7);
  }
  
  // Bright glow on ridge peaks
  float ridge = pow(n, 4.0) * 0.8;
  color += ridge * u_color3;
  
  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.4;
  color *= vignette;
  
  fragColor = vec4(color, 1.0);
}
