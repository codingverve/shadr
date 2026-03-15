#version 300 es
/**
 * Reaction-Diffusion Shader (Procedural Approximation)
 * Simulates Gray-Scott look using multi-scale noise thresholds.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_growth; // Reaction strength
uniform float u_decay;  // Diffusion spread
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = dot(hash(i), f);
    float b = dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= aspect;

    float t = u_time * u_speed;
    
    // Procedural RD approximation using two layered noise fields with high-pass filtering
    float n1 = noise(uv + t * 0.1);
    float n2 = noise(uv * 2.1 - t * 0.05 + n1 * 0.5);
    
    // The "reaction" - sharp thresholding of noise interference
    float v = abs(n1 - n2);
    v = smoothstep(u_decay, u_decay + 0.1 * u_growth, v);
    
    // Add some "spotting" typical of RD
    float spots = smoothstep(0.4, 0.41, noise(uv * 5.0 + t * 0.2));
    v = mix(v, 1.0 - v, spots * u_growth);

    vec3 color = mix(u_color1, u_color2, v);
    color = mix(color, u_color3, pow(v, 2.0));

    fragColor = vec4(color, 1.0);
}
