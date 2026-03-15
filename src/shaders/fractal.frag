#version 300 es
/**
 * Fractal Pattern Shader (Mandelbrot / Julia)
 * Interactive fractal explorer with smooth coloring.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_zoom;
uniform float u_centerX;
uniform float u_centerY;
uniform int u_iterations;
uniform float u_juliaMode;
uniform float u_juliaX;
uniform float u_juliaY;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_power;
uniform float u_colorCycle;
uniform float u_contrast;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;

  // Map UV to complex plane with zoom and center
  vec2 c;
  vec2 z;

  vec2 pos = (uv - 0.5) * vec2(aspect, 1.0) * (4.0 / u_zoom);
  pos += vec2(u_centerX, u_centerY);

  if (u_juliaMode > 0.5) {
    // Julia set mode
    z = pos;
    c = vec2(u_juliaX, u_juliaY);
  } else {
    // Mandelbrot mode
    z = vec2(0.0);
    c = pos;
  }

  // Iteration loop
  float iter = 0.0;
  float maxIter = float(u_iterations);
  float escape = 256.0;

  for (int i = 0; i < 500; i++) {
    if (i >= u_iterations) break;

    // z = z^power + c (Dynamic power)
    float r = length(z);
    float a = atan(z.y, z.x);
    z = pow(r, u_power) * vec2(cos(a * u_power), sin(a * u_power)) + c;

    if (dot(z, z) > escape) break;
    iter += 1.0;
  }

  // Smooth coloring using escape-time algorithm
  vec3 color;
  if (iter >= maxIter) {
    // Inside the set — deep black with subtle glow
    color = u_color1 * 0.1;
  } else {
    // Smooth iteration count
    float logZn = log(dot(z, z)) / 2.0;
    float nu = log(logZn / log(2.0)) / log(2.0);
    float smoothIter = iter + 1.0 - nu;

    // Tri-color gradient based on iteration
    float t = smoothIter / maxIter;
    
    // Apply contrast
    t = pow(t, 1.0 / max(0.1, u_contrast));
    
    float cycle = u_time * u_colorCycle;
    float wave = 0.5 + 0.5 * sin(t * 15.0 + cycle);
    float wave2 = 0.5 + 0.5 * cos(t * 10.0 + cycle * 0.7);

    color = mix(u_color1, u_color2, wave);
    color = mix(color, u_color3, wave2 * t);

    // Brighten edges
    color *= 1.0 + t * 0.5;
  }

  fragColor = vec4(color, 1.0);
}
