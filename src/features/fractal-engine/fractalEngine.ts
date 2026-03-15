/**
 * Fractal Pattern Engine (Mandelbrot / Julia)
 * Interactive fractal explorer with smooth coloring and dynamic power.
 */

import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import fractalShader from '../../shaders/fractal.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_zoom', label: 'Zoom Level', type: 'range', defaultValue: 1.0, min: 0.3, max: 200.0, step: 0.1 },
  { key: 'u_centerX', label: 'Center X', type: 'range', defaultValue: -0.5, min: -2.5, max: 1.5, step: 0.01 },
  { key: 'u_centerY', label: 'Center Y', type: 'range', defaultValue: 0.0, min: -1.5, max: 1.5, step: 0.01 },
  { key: 'u_power', label: 'Fractal Power', type: 'range', defaultValue: 2.0, min: 1.0, max: 8.0, step: 0.1 },
  { key: 'u_iterations', label: 'Iterations', type: 'range', defaultValue: 100, min: 20, max: 500, step: 1 },
  { key: 'u_juliaMode', label: 'Julia Mode', type: 'range', defaultValue: 0, min: 0, max: 1, step: 1 },
  { key: 'u_juliaX', label: 'Julia X', type: 'range', defaultValue: -0.7, min: -2.0, max: 2.0, step: 0.01 },
  { key: 'u_juliaY', label: 'Julia Y', type: 'range', defaultValue: 0.27, min: -2.0, max: 2.0, step: 0.01 },
  { key: 'u_colorCycle', label: 'Color Cycle', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Color Contrast', type: 'range', defaultValue: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { key: 'u_color1', label: 'Core Color', type: 'color', defaultValue: '#0a0a2e' },
  { key: 'u_color2', label: 'Mid Color', type: 'color', defaultValue: '#6366f1' },
  { key: 'u_color3', label: 'Edge Color', type: 'color', defaultValue: '#f59e0b' },
];

export function createFractalEngine(): PatternEngine {
  return {
    id: 'fractal',
    name: 'Fractal',
    category: 'mathematical',
    subcategory: 'fractals',
    fragmentShader: fractalShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_zoom', (params['u_zoom'] as number) ?? 1.0);
      renderer.setUniform1f('u_centerX', (params['u_centerX'] as number) ?? -0.5);
      renderer.setUniform1f('u_centerY', (params['u_centerY'] as number) ?? 0.0);
      renderer.setUniform1f('u_power', (params['u_power'] as number) ?? 2.0);
      renderer.setUniform1i('u_iterations', (params['u_iterations'] as number) ?? 100);
      renderer.setUniform1f('u_juliaMode', (params['u_juliaMode'] as number) ?? 0);
      renderer.setUniform1f('u_juliaX', (params['u_juliaX'] as number) ?? -0.7);
      renderer.setUniform1f('u_juliaY', (params['u_juliaY'] as number) ?? 0.27);
      renderer.setUniform1f('u_colorCycle', (params['u_colorCycle'] as number) ?? 0.3);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0a0a2e');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#6366f1');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#f59e0b');
    },
    dispose() {},
  };
}
