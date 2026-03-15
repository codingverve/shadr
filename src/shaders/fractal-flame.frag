#version 300 es
/**
 * Fractal Flame Shader
 * Simplified real-time Iterated Function System (IFS) visualization.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_iterations;
uniform float u_variation; // 0: Linear, 1: Sinusoidal, 2: Swirl, 3: Horseshoe
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

// Helper for rotation
vec2 rotate(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Variation functions
vec2 getVariation(vec2 p, int type) {
    if (type == 1) return sin(p); // Sinusoidal
    if (type == 2) { // Swirl
        float r2 = dot(p, p);
        return vec2(p.x * sin(r2) - p.y * cos(r2), p.x * cos(r2) + p.y * sin(r2));
    }
    if (type == 3) { // Horseshoe
        float r = length(p);
        return vec2((p.x - p.y) * (p.x + p.y), 2.0 * p.x * p.y) / r;
    }
    return p; // Linear
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * u_speed;
    vec2 p = uv;
    float accum = 0.0;
    
    int iters = int(u_iterations);
    int varType = int(u_variation);

    // Iterative feedback loop
    for (int i = 0; i < 16; i++) {
        if (i >= iters) break;
        
        // Apply transform
        p = rotate(p, t * 0.1 + float(i) * 0.5);
        p = abs(p) / dot(p, p) - 0.5;
        p = getVariation(p, varType);
        
        accum += exp(-length(p));
    }

    // Color mapping based on density accumulation
    float d = accum / float(iters);
    vec3 color;
    
    if (d < 0.4) {
        color = mix(u_color1, u_color2, d / 0.4);
    } else {
        color = mix(u_color2, u_color3, (d - 0.4) / 0.6);
    }
    
    // Bloom-like effect from iteration density
    color += pow(d, 3.0) * u_color2;

    fragColor = vec4(color, 1.0);
}
