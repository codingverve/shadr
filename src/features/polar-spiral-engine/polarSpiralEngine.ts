/**
 * Polar Spiral Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/polar-spiral.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 1.0, min: 0.5, max: 5.0, step: 0.1 },
  { key: 'u_speed', label: 'Rotation Speed', type: 'range', defaultValue: 2.0, min: 0.0, max: 10.0, step: 0.1 },
  { key: 'u_arms', label: 'Spiral Arms', type: 'range', defaultValue: 3, min: 1, max: 20, step: 1 },
  { key: 'u_tightness', label: 'Tightness', type: 'range', defaultValue: 10.0, min: 1.0, max: 100.0, step: 1.0 },
  { key: 'u_color1', label: 'Base', type: 'color', defaultValue: '#1e293b' },
  { key: 'u_color2', label: 'Spiral', type: 'color', defaultValue: '#facc15' },
];

export function createPolarSpiralEngine(): PatternEngine {
  return {
    id: 'polar-spiral',
    name: 'Polar Spiral',
    category: 'mathematical',
    subcategory: 'curves',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 1.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 2.0);
      renderer.setUniform1f('u_arms', (params['u_arms'] as number) ?? 3);
      renderer.setUniform1f('u_tightness', (params['u_tightness'] as number) ?? 10.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#1e293b');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#facc15');
    },
  };
}
