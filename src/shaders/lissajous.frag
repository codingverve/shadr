#version 300 es
/**
 * Lissajous Curve Pattern Shader
 * Animated parametric curves (sin/cos combinations) with trails.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_freqX;
uniform float u_freqY;
uniform float u_phase;
uniform float u_trailLength;
uniform float u_lineWidth;
uniform float u_speed;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_curveScale;
uniform float u_glowIntensity;

void main() {
  vec2 uv = v_uv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * u_speed;
  float minDist = 100.0;
  float closestT = 0.0;

  // Sample points along the Lissajous curve
  int samples = int(u_trailLength);
  for (int i = 0; i < 400; i++) {
    if (i >= samples) break;

    float fi = float(i) / u_trailLength;
    float curveT = t - fi * 4.0;

    // Lissajous: x = sin(a*t + phase), y = sin(b*t)
    vec2 point = vec2(
      sin(u_freqX * curveT + u_phase) * u_curveScale,
      sin(u_freqY * curveT) * u_curveScale
    );

    float d = length(uv - point);
    if (d < minDist) {
      minDist = d;
      closestT = fi;
    }
  }

  // Line intensity with width control
  float lineWidth = u_lineWidth * 0.01;
  float intensity = smoothstep(lineWidth * 2.0, lineWidth * 0.3, minDist);

  // Trail fade — older parts are dimmer
  float trailFade = 1.0 - closestT * 0.7;
  intensity *= trailFade;

  // Color based on position along the trail
  vec3 lineColor = mix(u_color2, u_color1, closestT);
  
  // Apply saturation
  vec3 gray = vec3(dot(lineColor, vec3(0.299, 0.587, 0.114)));
  lineColor = mix(gray, lineColor, u_saturation);

  // Background with subtle gradient
  vec3 bgColor = u_color1 * 0.08;
  float bgGrad = length(uv) * 0.3;
  bgColor += u_color2 * 0.02 * (1.0 - bgGrad);

  vec3 color = mix(bgColor, lineColor, intensity);

  // Glow around the curve
  float glow = exp(-minDist * 30.0) * u_glowIntensity * trailFade;
  color += u_color2 * glow;

  // Bright head of the curve
  float headDist = length(uv - vec2(sin(u_freqX * t + u_phase) * u_curveScale, sin(u_freqY * t) * u_curveScale));
  float headGlow = exp(-headDist * 25.0) * 0.8 * u_glowIntensity;
  color += (u_color2 + vec3(0.3)) * headGlow;

  fragColor = vec4(color, 1.0);
}
