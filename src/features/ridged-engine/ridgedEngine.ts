/**
 * Ridged Noise Engine
 * Sharp ridge/vein structures through inverted absolute noise.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/ridged.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Ridge Scale', type: 'range', defaultValue: 3.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Flow Speed', type: 'range', defaultValue: 0.2, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_octaves', label: 'Layer Depth', type: 'range', defaultValue: 5, min: 1, max: 8, step: 1 },
  { key: 'u_sharpness', label: 'Ridge Sharpness', type: 'range', defaultValue: 2.0, min: 1.0, max: 5.0, step: 0.1 },
  { key: 'u_ridgeOffset', label: 'Ridge Profile', type: 'range', defaultValue: 1.0, min: 0.5, max: 1.5, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Valley Color', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Slope Color', type: 'color', defaultValue: '#1e40af' },
  { key: 'u_color3', label: 'Ridge Color', type: 'color', defaultValue: '#60a5fa' },
];

export function createRidgedEngine(): PatternEngine {
  return {
    id: 'ridged-noise',
    name: 'Ridged Noise',
    category: 'procedural',
    subcategory: 'noise',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.2);
      renderer.setUniform1f('u_octaves', (params['u_octaves'] as number) ?? 5);
      renderer.setUniform1f('u_sharpness', (params['u_sharpness'] as number) ?? 2.0);
      renderer.setUniform1f('u_ridgeOffset', (params['u_ridgeOffset'] as number) ?? 1.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#1e40af');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#60a5fa');
    },
  };
}
