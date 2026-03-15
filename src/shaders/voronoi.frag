#version 300 es
/**
 * Voronoi Pattern Shader
 * Cellular pattern based on Voronoi distance fields.
 * Creates organic, crystal-like patterns with glowing edges.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_edgeWidth;
uniform float u_cellRound;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_edgeColor;
uniform float u_jitter;
uniform float u_glowStrength;
uniform float u_contrast;
uniform float u_brightness;

// Hash function for random cell points
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  uv *= u_scale;

  float t = u_time * u_speed;

  // Voronoi
  vec2 cellId = floor(uv);
  vec2 cellUv = fract(uv);

  float minDist = 10.0;
  float secondDist = 10.0;
  vec2 closestPoint = vec2(0.0);

  // Check 3x3 neighborhood
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash2(cellId + neighbor);
      // Animate points
      point = 0.5 + u_jitter * 0.5 * sin(t + 6.2831 * point);
      vec2 diff = neighbor + point - cellUv;
      float dist = length(diff);

      if (dist < minDist) {
        secondDist = minDist;
        minDist = dist;
        closestPoint = point;
      } else if (dist < secondDist) {
        secondDist = dist;
      }
    }
  }

  // Edge detection
  float edge = secondDist - minDist;
  float edgeMask = 1.0 - smoothstep(0.0, u_edgeWidth, edge);

  // Cell coloring based on distance
  float cellValue = smoothstep(0.0, u_cellRound, minDist);
  
  // Apply brightness and contrast to cell value
  cellValue = (cellValue - 0.5) * u_contrast + 0.5 + u_brightness;
  cellValue = clamp(cellValue, 0.0, 1.0);
  
  vec3 cellColor = mix(u_color1, u_color2, cellValue);

  // Blend edge glow
  vec3 color = mix(cellColor, u_edgeColor, edgeMask);

  // Add depth with inner glow
  color += u_color2 * exp(-3.0 * minDist) * u_glowStrength;

  // Vignette
  vec2 vigUv = v_uv - 0.5;
  float vignette = 1.0 - dot(vigUv, vigUv) * 0.4;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
