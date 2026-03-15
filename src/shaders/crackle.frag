#version 300 es
/**
 * Voronoi Crackle Shader
 * Inverted cellular distance (d2 - d1) to create sharp lightning/cracked earth.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_sharpness;
uniform float u_crackWidth;
uniform vec3 u_rockColor;
// uniform vec3 u_crackColor;
uniform vec3 u_glowColor;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

// Compute standard Voronoi distances (closest and second closest)
vec3 voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // First pass: find closest point
    vec2 mg, mr;
    float md = 8.0;
    
    for(int j = -1; j <= 1; j++) {
        for(int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash(n + g);
            o = 0.5 + 0.5 * sin(u_time * u_speed + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if(d < md) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // Second pass: find second closest point
    md = 8.0;
    for(int j = -2; j <= 2; j++) {
        for(int i = -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = hash(n + g);
            o = 0.5 + 0.5 * sin(u_time * u_speed + 6.2831 * o);
            vec2 r = g + o - f;
            
            // Note: skipping the exact same cell
            if(dot(mr-r, mr-r) > 0.00001) {
                float d = dot(0.5*(mr+r), normalize(r-mr)); // Distance to border
                md = min(md, d);
            }
        }
    }
    
    return vec3(md, mr); // Returns border distance in x
}

void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    vec2 p = uv * u_scale;
    
    // Apply slight domain warp so cracks aren't perfectly straight
    p += vec2(sin(p.y*2.0), cos(p.x*2.0)) * 0.1;

    // Get border distance
    vec3 v = voronoi(p);
    float borderDist = v.x;
    
    // Crack logic: We want colors where borderDist is close to 0
    // u_crackWidth controls how thick the line is
    // u_sharpness controls how hard the edge is
    
    float crack = smoothstep(u_crackWidth, u_crackWidth * (1.0 - u_sharpness*0.9), borderDist);
    
    // Add pulsing glow to cracks
    float glow = smoothstep(u_crackWidth * 3.0, 0.0, borderDist) * 
                 (0.5 + 0.5 * sin(u_time * 3.0 + length(p)));
    
    // Combine colors: Rock (surface) -> Crack glow -> Hard crack center
    vec3 color = u_rockColor;
    
    // Multiply rock by border dist to make plates darker at edges
    color *= (0.3 + 0.7 * smoothstep(0.0, 0.4, borderDist));
    
    // Add crack emissions
    color = mix(color, u_glowColor, glow * 0.6);
    color = mix(color, vec3(1.0), crack); // Pure white core

    fragColor = vec4(color, 1.0);
}
