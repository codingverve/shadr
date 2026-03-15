/**
 * Truchet Tiles Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/truchet-tiles.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Grid Scale', type: 'range', defaultValue: 8.0, min: 2.0, max: 30.0, step: 0.1 },
  { key: 'u_thickness', label: 'Line Width', type: 'range', defaultValue: 0.05, min: 0.01, max: 0.2, step: 0.01 },
  { key: 'u_color1', label: 'Background', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Arcs', type: 'color', defaultValue: '#f472b6' },
];

export function createTruchetTilesEngine(): PatternEngine {
  return {
    id: 'truchet-tiles',
    name: 'Truchet Tiles',
    category: 'geometry',
    subcategory: 'tiles',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 8.0);
      renderer.setUniform1f('u_thickness', (params['u_thickness'] as number) ?? 0.05);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#f472b6');
    },
  };
}
