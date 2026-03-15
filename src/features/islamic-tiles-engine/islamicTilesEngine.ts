/**
 * Islamic Tiles Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/islamic-tiles.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 5.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_symmetry', label: 'Symmetry', type: 'range', defaultValue: 8, min: 3, max: 16, step: 1 },
  { key: 'u_offset', label: 'Star Size', type: 'range', defaultValue: 0.3, min: 0.05, max: 0.8, step: 0.01 },
  { key: 'u_color1', label: 'Pattern', type: 'color', defaultValue: '#fbbf24' },
  { key: 'u_color2', label: 'Background', type: 'color', defaultValue: '#451a03' },
];

export function createIslamicTilesEngine(): PatternEngine {
  return {
    id: 'islamic-tiles',
    name: 'Islamic Tiles',
    category: 'geometry',
    subcategory: 'tiles',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 5.0);
      renderer.setUniform1f('u_symmetry', (params['u_symmetry'] as number) ?? 8);
      renderer.setUniform1f('u_offset', (params['u_offset'] as number) ?? 0.3);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#fbbf24');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#451a03');
    },
  };
}
