#version 300 es
/**
 * Truchet Tiles Shader
 * Randomly oriented arc tiles.
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

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= aspect;

    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    
    float h = hash(id);
    if (h > 0.5) gv.x *= -1.0;
    
    // Circle arcs
    float d = length(gv - 0.5);
    float d2 = length(gv + 0.5);
    float dist = min(d, d2);
    
    float mask = smoothstep(u_thickness + 0.01, u_thickness, abs(dist - 0.5));
    
    vec3 color = mix(u_color1, u_color2, mask);
    
    // Add animation to the tiles
    float anim = sin(u_time + h * 6.28) * 0.5 + 0.5;
    color *= mix(0.9, 1.1, anim);

    fragColor = vec4(color, 1.0);
}
