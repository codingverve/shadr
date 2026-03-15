#version 300 es
/**
 * Organic Cells Shader
 * Warped Voronoi for biological cell structures.
 */
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_speed;
uniform float u_warpStrength;
uniform float u_cellSmoothness;
uniform float u_fluidity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_chromatic;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * (1.0 / 4.0);
}

// Smooth Voronoi
float smoothVoronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float res = 8.0;
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash(n + g);
            o = 0.5 + 0.5 * sin(u_time * u_speed + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            res = smin(res, d, u_cellSmoothness);
        }
    }
    return res;
}

// Simple noise for FBM
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

float fbm2(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    float t = u_time * u_speed * u_fluidity;
    vec2 p = uv * u_scale;
    
    // Domain warp for organic look
    vec2 warp = vec2(
        fbm2(p + vec2(t, 0.0)),
        fbm2(p + vec2(0.0, t))
    );
    p += warp * u_warpStrength;

    float v = smoothVoronoi(p);
    
    // Apply brightness and contrast
    v = (v - 0.2) * u_contrast + 0.2 + u_brightness;
    v = clamp(v, 0.0, 1.0);

    // Biological color mapping
    vec3 color;
    if (v < 0.2) {
        color = mix(u_color1, u_color2, v / 0.2);
    } else {
        color = mix(u_color2, u_color3, (v - 0.2) / 0.8);
    }
    
    // Cell membrane - highlight edges
    float membrane = smoothstep(0.05, 0.0, abs(v - 0.1));
    color = mix(color, u_color3, membrane * 0.6);
    
    // Chromatic aberration on membrane
    if (u_chromatic > 0.0) {
        float membraneR = smoothstep(0.05 + u_chromatic, 0.0, abs(v - 0.1));
        color.r += membraneR * 0.2;
    }

    fragColor = vec4(color, 1.0);
}
