/**
 * Flow Field Pattern Engine
 * Dynamic flow field visualization with curl noise.
 */

import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import flowShader from '../../shaders/flow-field.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Field Scale', type: 'range', defaultValue: 3.0, min: 1.0, max: 10.0, step: 0.1 },
  { key: 'u_speed', label: 'Flow Speed', type: 'range', defaultValue: 0.4, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_curlStrength', label: 'Curl Intensity', type: 'range', defaultValue: 1.0, min: 0.1, max: 5.0, step: 0.1 },
  { key: 'u_complexity', label: 'Flow Complexity', type: 'range', defaultValue: 8.0, min: 1.0, max: 16.0, step: 1.0 },
  { key: 'u_density', label: 'Line Density', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.05 },
  { key: 'u_lineWidth', label: 'Line Sharpness', type: 'range', defaultValue: 8.0, min: 1.0, max: 20.0, step: 0.5 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Background', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Flow Accent', type: 'color', defaultValue: '#38bdf8' },
];

export function createFlowEngine(): PatternEngine {
  return {
    id: 'flow-field',
    name: 'Flow Field',
    category: 'procedural',
    subcategory: 'flow',
    fragmentShader: flowShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.4);
      renderer.setUniform1f('u_curlStrength', (params['u_curlStrength'] as number) ?? 1.0);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 8.0);
      renderer.setUniform1f('u_density', (params['u_density'] as number) ?? 1.0);
      renderer.setUniform1f('u_lineWidth', (params['u_lineWidth'] as number) ?? 8.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#38bdf8');
    },
    dispose() {},
  };
}
