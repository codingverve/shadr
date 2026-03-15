#version 300 es
/**
 * Particle Flow Shader
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_density;
uniform float u_length;
uniform vec3 u_color1;
uniform vec3 u_color2;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec2 p = uv * u_scale;
    float t = u_time * u_speed;
    
    float accum = 0.0;
    
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 id = ip + g;
            vec2 h = hash(id);
            
            // Movement vector
            vec2 dir = vec2(cos(h.x * 6.28), sin(h.x * 6.28));
            float phase = fract(h.y + t);
            
            // Streak path
            vec2 origin = 0.5 + 0.4 * sin(h * 10.0);
            vec2 currentPos = origin + dir * phase * u_length;
            
            float d = length(fp - (g + currentPos));
            float brightness = (1.0 - smoothstep(0.0, 0.05 * u_density, d)) * (1.0 - phase);
            accum += brightness;
        }
    }

    vec3 color = mix(u_color1, u_color2, clamp(accum, 0.0, 1.0));
    fragColor = vec4(color, 1.0);
}
