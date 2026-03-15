#version 300 es
/**
 * Moiré Pattern Shader
 * Overlapping periodic structures creating interference patterns.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_lineCount;
uniform float u_rotationOffset;
uniform float u_spacing;
uniform float u_speed;
uniform float u_lineWidth;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_shimmer;
uniform float u_contrast;
uniform float u_lineOpacity;

// Generate a line grid at a given angle
float lineGrid(vec2 uv, float angle, float freq, float width) {
  float cs = cos(angle), sn = sin(angle);
  vec2 rotUv = mat2(cs, -sn, sn, cs) * uv;
  return smoothstep(width, width * 0.5, abs(sin(rotUv.x * freq)));
}

// Generate concentric circles
float circleGrid(vec2 uv, vec2 center, float freq, float width) {
  float d = length(uv - center);
  return smoothstep(width, width * 0.5, abs(sin(d * freq)));
}

void main() {
  vec2 uv = v_uv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  uv *= u_spacing;

  float t = u_time * u_speed;

  // Layer 1: rotating line grid
  float angle1 = t * 0.1;
  float grid1 = lineGrid(uv, angle1, u_lineCount, u_lineWidth);

  // Layer 2: counter-rotating line grid
  float angle2 = -t * 0.08 + u_rotationOffset;
  float grid2 = lineGrid(uv, angle2, u_lineCount * 0.95, u_lineWidth);

  // Layer 3: concentric circles from center
  float circles1 = circleGrid(uv, vec2(0.0), u_lineCount * 0.8, u_lineWidth);

  // Layer 4: concentric circles offset
  vec2 offset = vec2(sin(t * 0.2) * 0.3, cos(t * 0.15) * 0.3);
  float circles2 = circleGrid(uv, offset, u_lineCount * 0.85, u_lineWidth);

  // Combine layers for moiré interference
  float moire = grid1 * grid2;
  float moire2 = circles1 * circles2;
  
  float combined = max(moire, moire2 * 0.8) * u_lineOpacity;
  
  // Apply brightness and contrast
  combined = (combined - 0.5) * u_contrast + 0.5;
  combined = clamp(combined, 0.0, 1.0);

  // Color blend
  vec3 color = mix(u_color1, u_color2, combined);

  // Add shimmer from interference beats
  if (u_shimmer > 0.0) {
    float beat = sin(combined * 15.0 + t * 2.0) * u_shimmer * 0.2;
    color += beat * u_color2;
  }

  // Bright interference nodes
  float nodes = pow(combined, 4.0) * 0.5;
  color += nodes * u_color2;

  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.5;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
