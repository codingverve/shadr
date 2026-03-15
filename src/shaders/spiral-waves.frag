#version 300 es
/**
 * Spiral Waves Shader
 * Polar coordinate wave interference.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_spirals;
uniform float u_thickness;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

void main() {
    vec2 uv = (v_uv - 0.5) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float r = length(uv) * u_scale;
    float a = atan(uv.y, uv.x);

    // Multiple spiral interference
    float wave = sin(r - u_time * u_speed + a * u_spirals);
    wave += sin(r * 1.5 - u_time * u_speed * 0.8 - a * u_spirals * 0.5);
    
    float v = wave * 0.5 + 0.5;
    
    // Sharpen waves
    v = smoothstep(0.5 - u_thickness, 0.5 + u_thickness, v);

    vec3 color;
    if (v < 0.4) {
        color = mix(u_color1, u_color2, v / 0.4);
    } else {
        color = mix(u_color2, u_color3, (v - 0.4) / 0.6);
    }

    // Add depth based on radius
    color *= mix(1.0, 0.4, clamp(r / u_scale, 0.0, 1.0));

    fragColor = vec4(color, 1.0);
}
