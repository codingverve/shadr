#version 300 es
/**
 * Islamic Tiles Shader
 * Star patterns using multi-fold symmetry and geometry.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_symmetry;
uniform float u_offset;
uniform vec3 u_color1;
uniform vec3 u_color2;

#define PI 3.14159265359

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= aspect;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Multi-fold symmetry
    float n = u_symmetry;
    float sector = floor(a / (2.0 * PI) * n + 0.5);
    float sa = a - (2.0 * PI / n) * sector;
    
    vec2 sv = vec2(cos(sa), abs(sin(sa))) * r;
    
    // Pattern generation via line distance
    float d = abs(sv.x - u_offset);
    d = min(d, abs(sv.y - u_offset));
    
    // Interlacing effect approximation
    float v = smoothstep(0.02, 0.0, d - 0.05);
    
    vec3 color = mix(u_color1, u_color2, v);
    
    // Add periodic rings
    color = mix(color, u_color2, smoothstep(0.02, 0.0, abs(fract(r * 2.0 - u_time * 0.1) - 0.5) - 0.01));

    fragColor = vec4(color, 1.0);
}
