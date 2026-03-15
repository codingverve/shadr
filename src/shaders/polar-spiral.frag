#version 300 es
/**
 * Polar Spiral Shader
 * Advanced logarithmic and Archimedean spirals.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_arms;
uniform float u_tightness;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * 2.0;
    uv.x *= aspect;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Combination of Archimedean and Logarithmic spiral
    float spiral = a * u_arms + r * u_tightness - u_time * u_speed;
    
    float v = sin(spiral);
    v = smoothstep(-0.1, 0.1, v);
    
    vec3 color = mix(u_color1, u_color2, v);
    
    // Vignette
    color *= smoothstep(2.0, 0.5, r);

    fragColor = vec4(color, 1.0);
}
