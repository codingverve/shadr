/**
 * Reaction-Diffusion Engine (Procedural)
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/reaction-diffusion.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 8.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_growth', label: 'Growth', type: 'range', defaultValue: 0.8, min: 0.1, max: 2.0, step: 0.1 },
  { key: 'u_decay', label: 'Diffusion', type: 'range', defaultValue: 0.2, min: 0.05, max: 0.5, step: 0.01 },
  { key: 'u_color1', label: 'Substrate', type: 'color', defaultValue: '#052e16' },
  { key: 'u_color2', label: 'Active', type: 'color', defaultValue: '#4ade80' },
  { key: 'u_color3', label: 'Reaction', type: 'color', defaultValue: '#bbf7d0' },
];

export function createReactionDiffusionEngine(): PatternEngine {
  return {
    id: 'reaction-diffusion',
    name: 'Reaction Diffusion',
    category: 'simulation',
    subcategory: 'reaction',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 8.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_growth', (params['u_growth'] as number) ?? 0.8);
      renderer.setUniform1f('u_decay', (params['u_decay'] as number) ?? 0.2);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#052e16');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#4ade80');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#bbf7d0');
    },
  };
}
