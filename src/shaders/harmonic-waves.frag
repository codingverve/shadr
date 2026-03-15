#version 300 es
/**
 * Harmonic Waves Shader
 * Superposition of multiple high-frequency sine waves.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_harmonics;
uniform float u_complexity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_saturation;
uniform float u_phase;

void main() {
    vec2 uv = v_uv * u_scale;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    float t = u_time * u_speed;
    float v = 0.0;
    
    int numHarmonics = int(u_harmonics);
    float weightSum = 0.0;

    for (int i = 1; i <= 8; i++) {
        if (i > numHarmonics) break;
        
        float freq = pow(2.0, float(i-1));
        float amp = pow(u_complexity, float(i-1));
        
        // Directional wave sum
        float angle = float(i) * 0.785; // 45 degree steps
        vec2 dir = vec2(cos(angle), sin(angle));
        
        v += amp * sin(dot(uv, dir) * freq + t * freq);
        weightSum += amp;
    }

    v = (v / weightSum) * 0.5 + 0.5;
    
    // Apply contrast and brightness
    v = (v - 0.5) * u_contrast + 0.5 + u_brightness;
    v = clamp(v, 0.0, 1.0);
    
    vec3 color = mix(u_color1, u_color2, v);
    color = mix(color, u_color3, pow(v, 3.0));

    // Apply saturation
    vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
    color = mix(gray, color, u_saturation);

    fragColor = vec4(color, 1.0);
}
