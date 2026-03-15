/**
 * Perlin Noise Engine
 * Classic gradient noise with octave layering and advanced dynamics.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/perlin.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 4.0, min: 0.5, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_octaves', label: 'Octaves', type: 'range', defaultValue: 5, min: 1, max: 8, step: 1 },
  { key: 'u_persistence', label: 'Persistence', type: 'range', defaultValue: 0.5, min: 0.1, max: 0.9, step: 0.01 },
  { key: 'u_lacunarity', label: 'Lacunarity', type: 'range', defaultValue: 2.0, min: 1.5, max: 4.0, step: 0.1 },
  { key: 'u_warp', label: 'Domain Warp', type: 'range', defaultValue: 0.0, min: 0.0, max: 2.0, step: 0.01 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_glow', label: 'Glow Intensity', type: 'range', defaultValue: 0.0, min: 0.0, max: 1.0, step: 0.05 },
  { key: 'u_color1', label: 'Base Color', type: 'color', defaultValue: '#0d1117' },
  { key: 'u_color2', label: 'Peak Color', type: 'color', defaultValue: '#58a6ff' },
];

export function createPerlinEngine(): PatternEngine {
  return {
    id: 'perlin', 
    name: 'Perlin Noise', 
    category: 'procedural', 
    subcategory: 'noise',
    fragmentShader: shader, 
    parameters, 
    init() {}, 
    update() {}, 
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.3);
      renderer.setUniform1f('u_octaves', (params['u_octaves'] as number) ?? 5);
      renderer.setUniform1f('u_persistence', (params['u_persistence'] as number) ?? 0.5);
      renderer.setUniform1f('u_lacunarity', (params['u_lacunarity'] as number) ?? 2.0);
      renderer.setUniform1f('u_warp', (params['u_warp'] as number) ?? 0.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      renderer.setUniform1f('u_glow', (params['u_glow'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0d1117');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#58a6ff');
    },
  };
}
