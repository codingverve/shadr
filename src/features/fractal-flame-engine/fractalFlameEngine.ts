/**
 * Fractal Flame Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/fractal-flame.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 4.0, min: 0.5, max: 15.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_iterations', label: 'Iterations', type: 'range', defaultValue: 10, min: 1, max: 16, step: 1 },
  { key: 'u_variation', label: 'Variation', type: 'select', defaultValue: 'Linear', options: ['Linear', 'Sinusoidal', 'Swirl', 'Horseshoe'] },
  { key: 'u_color1', label: 'Color 1', type: 'color', defaultValue: '#450a0a' },
  { key: 'u_color2', label: 'Color 2', type: 'color', defaultValue: '#dc2626' },
  { key: 'u_color3', label: 'Color 3', type: 'color', defaultValue: '#fef3c7' },
];

const variationMap: Record<string, number> = {
  'Linear': 0,
  'Sinusoidal': 1,
  'Swirl': 2,
  'Horseshoe': 3
};

export function createFractalFlameEngine(): PatternEngine {
  return {
    id: 'fractal-flame',
    name: 'Fractal Flame',
    category: 'mathematical',
    subcategory: 'fractals',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.3);
      renderer.setUniform1f('u_iterations', (params['u_iterations'] as number) ?? 10);
      
      const varName = (params['u_variation'] as string) ?? 'Linear';
      renderer.setUniform1f('u_variation', variationMap[varName] ?? 0);
      
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#450a0a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#dc2626');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#fef3c7');
    },
  };
}
