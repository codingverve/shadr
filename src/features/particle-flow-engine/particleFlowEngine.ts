/**
 * Particle Flow Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/particle-flow.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Density Scale', type: 'range', defaultValue: 10.0, min: 2.0, max: 30.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_density', label: 'Line Density', type: 'range', defaultValue: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { key: 'u_length', label: 'Streak Length', type: 'range', defaultValue: 1.5, min: 0.5, max: 5.0, step: 0.1 },
  { key: 'u_color1', label: 'Background', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Flow', type: 'color', defaultValue: '#22d3ee' },
];

export function createParticleFlowEngine(): PatternEngine {
  return {
    id: 'particle-flow',
    name: 'Particle Flow',
    category: 'simulation',
    subcategory: 'flow',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 10.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_density', (params['u_density'] as number) ?? 1.0);
      renderer.setUniform1f('u_length', (params['u_length'] as number) ?? 1.5);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#22d3ee');
    },
  };
}
