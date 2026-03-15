#version 300 es
/**
 * SDF Shapes Shader
 * Primitive shapes with boolean operations (Union, Intersect, Subtract).
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_roundness;
uniform float u_sides; // 0 for circle, 4 for box, etc.
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_repeat;
uniform float u_glowIntensity;
uniform float u_lineWidth;

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv.x *= aspect;

    float t = u_time * 0.5;
    
    // Pattern repetition
    if (u_repeat > 0.0) {
        uv = mod(uv + u_repeat * 0.5, u_repeat) - u_repeat * 0.5;
    }

    // Multiple shapes moving
    vec2 p1 = uv + vec2(sin(t), cos(t)) * 0.3;
    vec2 p2 = uv + vec2(cos(t * 0.7), sin(t * 1.1)) * 0.5;
    
    float d1 = sdCircle(p1, 0.4);
    float d2 = sdBox(p2, vec2(0.35));
    
    // Smooth Union
    float k = u_roundness;
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    float d = mix(d2, d1, h) - k * h * (1.0 - h);
    
    // Visualizing the distance field with stylized lines
    vec3 color = mix(u_color1 * 0.2, u_color2 * 0.2, step(0.0, d));
    
    // Contour lines
    float dist = abs(d);
    float lines = sin(dist * 60.0 - u_time * 2.0);
    lines = smoothstep(0.9, 1.0, lines);
    color = mix(color, u_color2, lines * 0.3);

    // Shape edge
    float edge = 1.0 - smoothstep(0.0, u_lineWidth, dist);
    color = mix(color, u_color2, edge);

    // Glow
    if (u_glowIntensity > 0.0) {
        float glow = exp(-4.0 * dist) * u_glowIntensity;
        color += u_color2 * glow;
    }

    fragColor = vec4(color, 1.0);
}
