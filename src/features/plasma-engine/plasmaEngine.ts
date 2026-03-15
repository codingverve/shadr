/**
 * Plasma Engine
 * Procedural interference patterns with interactive palettes and saturation control.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import shader from '../../shaders/plasma.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 4.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_frequency', label: 'Frequency', type: 'range', defaultValue: 2.0, min: 0.5, max: 10.0, step: 0.1 },
  { key: 'u_complexity', label: 'Pattern Layers', type: 'range', defaultValue: 1.5, min: 1.0, max: 3.0, step: 0.1 },
  { key: 'u_paletteMode', label: 'Color Palette', type: 'range', defaultValue: 0, min: 0, max: 3, step: 1 },
  { key: 'u_saturation', label: 'Saturation', type: 'range', defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_phase', label: 'Palette Phase', type: 'range', defaultValue: 0.0, min: 0.0, max: 1.0, step: 0.01 },
];

export function createPlasmaEngine(): PatternEngine {
  return {
    id: 'plasma',
    name: 'Plasma',
    category: 'textures',
    subcategory: 'plasma',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_frequency', (params['u_frequency'] as number) ?? 2.0);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 1.5);
      renderer.setUniform1f('u_paletteMode', (params['u_paletteMode'] as number) ?? 0);
      renderer.setUniform1f('u_saturation', (params['u_saturation'] as number) ?? 1.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      renderer.setUniform1f('u_phase', (params['u_phase'] as number) ?? 0.0);
    },
  };
}
