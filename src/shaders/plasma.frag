#version 300 es
/**
 * Procedural Plasma / Cosine Palette Shader
 * Rich gradients using multi-frequency interference and IQ cosine palettes.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_frequency;
uniform float u_complexity;
uniform float u_paletteMode;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_saturation;
uniform float u_phase;

// Cosine based palette (Inigo Quilez)
// color(t) = a + b * cos(2pi * (c*t + d))
vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    vec3 col = a + b * cos(6.28318 * (c * t + d + u_phase));
    // Apply saturation
    vec3 grayscale = vec3(dot(col, vec3(0.299, 0.587, 0.114)));
    return mix(grayscale, col, u_saturation);
}

// Get standard palette based on mode
vec3 getPalette(float t, int mode) {
    vec3 a, b, c, d;
    
    if (mode == 0) {
        // Rainbow
        a = vec3(0.5, 0.5, 0.5);
        b = vec3(0.5, 0.5, 0.5);
        c = vec3(1.0, 1.0, 1.0);
        d = vec3(0.00, 0.33, 0.67);
    } else if (mode == 1) {
        // Cyberpunk Pink/Cyan
        a = vec3(0.5, 0.5, 0.5);
        b = vec3(0.5, 0.5, 0.5);
        c = vec3(1.0, 1.0, 0.5);
        d = vec3(0.80, 0.90, 0.30);
    } else if (mode == 2) {
        // Lava / Heat
        a = vec3(0.5, 0.2, 0.1);
        b = vec3(0.5, 0.4, 0.1);
        c = vec3(1.0, 1.0, 1.0);
        d = vec3(0.00, 0.15, 0.20);
    } else {
        // Ocean / Bioluminescence
        a = vec3(0.0, 0.2, 0.4);
        b = vec3(0.0, 0.5, 0.5);
        c = vec3(0.5, 1.0, 1.0);
        d = vec3(0.50, 0.20, 0.25);
    }
    
    return cosPalette(t, a, b, c, d);
}

void main() {
    vec2 uv = v_uv - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    float t = u_time * u_speed;
    vec2 p = uv * u_scale;
    
    float v = 0.0;
    
    // Combine multiple sine waves on different axes and frequencies
    v += sin((p.x + t) * u_frequency);
    v += sin((p.y + t) * u_frequency);
    v += sin((p.x + p.y + t) * u_frequency * 0.7);
    v += sin(sqrt(p.x*p.x + p.y*p.y + 1.0) * u_frequency * 1.5 - t);
    
    // Add complexity layers if requested
    if (u_complexity > 1.0) {
        v += sin(p.x * sin(t*0.5) * u_frequency * 2.0) * 0.5;
        v += sin(p.y * cos(t*0.3) * u_frequency * 2.0) * 0.5;
    }
    if (u_complexity > 2.0) {
        v += cos(length(p - vec2(sin(t), cos(t))) * u_frequency * 3.0) * 0.5;
    }
    
    // Normalize to roughly 0-1 range
    float maxAmp = 4.0 + (u_complexity > 1.0 ? 1.0 : 0.0) + (u_complexity > 2.0 ? 0.5 : 0.0);
    v = v / maxAmp + 0.5;
    
    // Apply sine distortion to output value for tighter bands
    float bands = sin(v * 10.0 * (u_complexity * 0.5 + 0.5)) * 0.5 + 0.5;
    
    // Mix the raw value with the banded value
    float finalValue = mix(v, bands, 0.3);
    
    // Apply brightness and contrast
    finalValue = (finalValue - 0.5) * u_contrast + 0.5 + u_brightness;
    finalValue = clamp(finalValue, 0.0, 1.0);
    
    // Map to color palette
    vec3 color = getPalette(finalValue + t * 0.1, int(u_paletteMode));
    
    // Add bright highlights to peaks
    color += pow(bands, 12.0 - u_complexity * 2.0) * vec3(0.3) * u_saturation;

    fragColor = vec4(color, 1.0);
}
