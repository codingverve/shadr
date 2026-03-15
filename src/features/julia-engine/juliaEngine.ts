/**
 * Julia Set Engine
 * Dynamic complex fractals with variable power and rich coloring.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/julia.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 3.0, min: 0.1, max: 10.0, step: 0.1 },
  { key: 'u_power', label: 'Fractal Power', type: 'range', defaultValue: 2.0, min: 1.0, max: 8.0, step: 0.1 },
  { key: 'u_cReal', label: 'C-Real', type: 'range', defaultValue: 0.0, min: -2.0, max: 2.0, step: 0.001 },
  { key: 'u_cImag', label: 'C-Imag', type: 'range', defaultValue: 0.0, min: -2.0, max: 2.0, step: 0.001 },
  { key: 'u_maxIters', label: 'Iterations', type: 'range', defaultValue: 100, min: 10, max: 500, step: 1 },
  { key: 'u_glowIntensity', label: 'Glow Strength', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { key: 'u_saturation', label: 'Saturation', type: 'range', defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_color1', label: 'Fractal Core', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Mesa Color', type: 'color', defaultValue: '#3b82f6' },
  { key: 'u_color3', label: 'Edge Color', type: 'color', defaultValue: '#93c5fd' },
];

export function createJuliaEngine(): PatternEngine {
  return {
    id: 'julia',
    name: 'Julia Set',
    category: 'mathematical',
    subcategory: 'fractals',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_power', (params['u_power'] as number) ?? 2.0);
      renderer.setUniform1f('u_cReal', (params['u_cReal'] as number) ?? 0.0);
      renderer.setUniform1f('u_cImag', (params['u_cImag'] as number) ?? 0.0);
      renderer.setUniform1f('u_maxIters', (params['u_maxIters'] as number) ?? 100);
      renderer.setUniform1f('u_glowIntensity', (params['u_glowIntensity'] as number) ?? 0.5);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_saturation', (params['u_saturation'] as number) ?? 1.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#3b82f6');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#93c5fd');
    },
  };
}
