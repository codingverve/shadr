/**
 * Moiré Pattern Engine
 * Overlapping periodic structures creating interference patterns.
 */

import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import moireShader from '../../shaders/moire.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_lineCount', label: 'Line Count', type: 'range', defaultValue: 30.0, min: 5.0, max: 100.0, step: 1 },
  { key: 'u_rotationOffset', label: 'Rotation Offset', type: 'range', defaultValue: 0.15, min: 0.0, max: 3.14, step: 0.01 },
  { key: 'u_spacing', label: 'Field Spacing', type: 'range', defaultValue: 3.0, min: 0.5, max: 10.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 3.0, step: 0.05 },
  { key: 'u_lineWidth', label: 'Line Sharpness', type: 'range', defaultValue: 0.4, min: 0.05, max: 0.9, step: 0.01 },
  { key: 'u_lineOpacity', label: 'Line Density', type: 'range', defaultValue: 1.0, min: 0.1, max: 2.0, step: 0.05 },
  { key: 'u_shimmer', label: 'Interference Shimmer', type: 'range', defaultValue: 0.5, min: 0.0, max: 1.0, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_color1', label: 'Main Background', type: 'color', defaultValue: '#05051a' },
  { key: 'u_color2', label: 'Interference Color', type: 'color', defaultValue: '#22d3ee' },
];

export function createMoireEngine(): PatternEngine {
  return {
    id: 'moire',
    name: 'Moiré',
    category: 'waves',
    subcategory: 'interference',
    fragmentShader: moireShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_lineCount', (params['u_lineCount'] as number) ?? 30.0);
      renderer.setUniform1f('u_rotationOffset', (params['u_rotationOffset'] as number) ?? 0.15);
      renderer.setUniform1f('u_spacing', (params['u_spacing'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_lineWidth', (params['u_lineWidth'] as number) ?? 0.4);
      renderer.setUniform1f('u_lineOpacity', (params['u_lineOpacity'] as number) ?? 1.0);
      renderer.setUniform1f('u_shimmer', (params['u_shimmer'] as number) ?? 0.5);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#05051a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#22d3ee');
    },
    dispose() {},
  };
}
