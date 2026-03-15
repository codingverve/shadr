#version 300 es
/**
 * Hexagonal Grid Shader
 * Renders a perfectly tiled hexagonal grid with coordinate mapping.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_thickness;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_pulseSpeed;
uniform float u_glow;

vec4 hexCoords(vec2 uv) {
    vec2 r = vec2(1, 1.7320508);
    vec2 h = r * 0.5;
    
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    
    float x = atan(gv.x, gv.y);
    float y = 0.5 - max(abs(gv.x), dot(abs(gv), normalize(r)));
    vec2 id = uv - gv;
    return vec4(x, y, id.x, id.y);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= aspect;

    vec4 hc = hexCoords(uv);
    
    // Hexagonal lines
    float edge = smoothstep(0.0, u_thickness, hc.y);
    
    // Gradient coloring across the grid
    vec3 color = mix(u_color1, u_color2, edge);
    
    // Dynamic pulsing based on cell ID and time
    float pulse = sin(u_time * u_pulseSpeed + hc.z * 5.0 + hc.w * 3.0) * 0.5 + 0.5;
    color += u_color1 * pulse * 0.4 * u_glow;

    // Soft glow on edges
    float g = exp(-10.0 * hc.y) * u_glow;
    color += u_color1 * g;

    fragColor = vec4(color, 1.0);
}
