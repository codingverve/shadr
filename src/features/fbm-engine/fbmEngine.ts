/**
 * FBM Noise Engine
 * Classic Fractional Brownian Motion with adjustable octaves.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/fbm.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 3.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Flow Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_octaves', label: 'Detail Octaves', type: 'range', defaultValue: 5, min: 1, max: 8, step: 1 },
  { key: 'u_persistence', label: 'Persistence', type: 'range', defaultValue: 0.5, min: 0.1, max: 1.0, step: 0.05 },
  { key: 'u_lacunarity', label: 'Lacunarity', type: 'range', defaultValue: 2.0, min: 1.0, max: 4.0, step: 0.1 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Low Color', type: 'color', defaultValue: '#1e3a8a' },
  { key: 'u_color2', label: 'High Color', type: 'color', defaultValue: '#38bdf8' },
];

export function createFBMEngine(): PatternEngine {
  return {
    id: 'fbm-noise',
    name: 'FBM Noise',
    category: 'procedural',
    subcategory: 'noise',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_octaves', (params['u_octaves'] as number) ?? 5);
      renderer.setUniform1f('u_persistence', (params['u_persistence'] as number) ?? 0.5);
      renderer.setUniform1f('u_lacunarity', (params['u_lacunarity'] as number) ?? 2.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#1e3a8a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#38bdf8');
    },
  };
}
