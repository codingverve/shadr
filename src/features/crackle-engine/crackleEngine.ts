/**
 * Voronoi Crackle Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/crackle.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 5.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.2, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_sharpness', label: 'Sharpness', type: 'range', defaultValue: 0.8, min: 0.0, max: 1.0, step: 0.01 },
  { key: 'u_crackWidth', label: 'Crack Width', type: 'range', defaultValue: 0.02, min: 0.005, max: 0.1, step: 0.001 },
  { key: 'u_rockColor', label: 'Rock Color', type: 'color', defaultValue: '#1c1917' },
  { key: 'u_glowColor', label: 'Glow Color', type: 'color', defaultValue: '#f97316' },
];

export function createCrackleEngine(): PatternEngine {
  return {
    id: 'crackle',
    name: 'Voronoi Crackle',
    category: 'procedural',
    subcategory: 'cellular',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 5.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.2);
      renderer.setUniform1f('u_sharpness', (params['u_sharpness'] as number) ?? 0.8);
      renderer.setUniform1f('u_crackWidth', (params['u_crackWidth'] as number) ?? 0.02);
      setColorUniform(renderer, 'u_rockColor', (params['u_rockColor'] as string) ?? '#1c1917');
      setColorUniform(renderer, 'u_glowColor', (params['u_glowColor'] as string) ?? '#f97316');
    },
  };
}
