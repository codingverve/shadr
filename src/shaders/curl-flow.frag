#version 300 es
/**
 * Curl Flow Shader
 * Visualizing Curl Noise vector fields.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_complexity;
uniform vec3 u_color1;
uniform vec3 u_color2;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), f.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), f.x), f.y);
}

vec2 curl(vec2 p) {
    const float e = 0.01;
    float dx = (noise(p + vec2(e, 0.0)) - noise(p - vec2(e, 0.0))) / (2.0 * e);
    float dy = (noise(p + vec2(0.0, e)) - noise(p - vec2(0.0, e))) / (2.0 * e);
    return vec2(dy, -dx);
}

void main() {
    vec2 uv = v_uv;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec2 p = uv * u_scale;
    float t = u_time * u_speed;
    
    // Primary field
    vec2 v = curl(p + t * 0.1);
    
    // Add multi-scale complexity
    for(int i = 0; i < 2; i++) {
        p *= 2.0;
        v += curl(p - t * 0.05) * pow(0.5, float(i+1));
    }
    
    float intensity = length(v) * u_complexity;
    vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 1.0, intensity));
    
    // Highlight velocity lines
    float flow = sin(intensity * 10.0 - t * 2.0);
    color += flow * 0.1 * u_color2;

    fragColor = vec4(color, 1.0);
}
