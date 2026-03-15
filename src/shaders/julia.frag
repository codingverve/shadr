#version 300 es
/**
 * Julia Set Fractal Shader
 * Classic complex dynamics fractal z = z^2 + c.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_cReal;
uniform float u_cImag;
uniform float u_maxIters;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_power;
uniform float u_glowIntensity;

// Complex multiplication
vec2 cMul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
  // Center coordinates and fix aspect ratio
  vec2 uv = v_uv - 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  
  // Apply zoom/scale
  vec2 z = uv * u_scale;
  
  // Allow animation of the C constant
  vec2 c = vec2(u_cReal, u_cImag);
  
  // If no manual C is set, auto-animate slightly for visual interest
  if (abs(u_cReal) < 0.01 && abs(u_cImag) < 0.01) {
    c = vec2(
      -0.8 + sin(u_time * 0.2) * 0.1,
      0.156 + cos(u_time * 0.15) * 0.05
    );
  }

  int i;
  int maxIters = int(u_maxIters);
  float smoothIter = 0.0;

  for(i = 0; i < maxIters; i++) {
    // z = z^power + c
    float r = length(z);
    float a = atan(z.y, z.x);
    z = pow(r, u_power) * vec2(cos(a * u_power), sin(a * u_power)) + c;
    
    if(dot(z, z) > 4.0) break;
  }

  // Smooth coloring algorithm
  if(i < maxIters) {
    float log_zn = log(dot(z, z)) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);
    smoothIter = float(i) + 1.0 - nu;
  } else {
    smoothIter = float(maxIters); // Inside set
  }

  // Map to color gradient
  float t = smoothIter / u_maxIters;
  vec3 color;
  
  if (i == maxIters) {
    // Inside the set
    color = vec3(0.0);
  } else {
    // Escaped
    t = sqrt(t); // Adjust curve for better gradient distribution
    
    // Apply contrast
    t = pow(t, 1.0 / max(0.1, u_contrast));
    
    if (t < 0.5) {
      color = mix(u_color1, u_color2, t * 2.0);
    } else {
      color = mix(u_color2, u_color3, (t - 0.5) * 2.0);
    }
    
    // Apply saturation
    vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
    color = mix(gray, color, u_saturation);
    
    // Add pulsing bands based on time
    float pulse = sin(smoothIter * 0.5 - u_time * 2.0) * 0.5 + 0.5;
    color += pulse * u_color2 * 0.3 * u_glowIntensity;
    
    // Glow
    color += u_color3 * exp(-3.0 * t) * 0.2 * u_glowIntensity;
  }

  fragColor = vec4(color, 1.0);
}
