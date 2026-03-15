/**
 * Hexagonal Grid Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/hex-grid.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Grid Scale', type: 'range', defaultValue: 10.0, min: 1.0, max: 40.0, step: 0.1 },
  { key: 'u_thickness', label: 'Border Size', type: 'range', defaultValue: 0.05, min: 0.01, max: 0.3, step: 0.01 },
  { key: 'u_pulseSpeed', label: 'Pulse Speed', type: 'range', defaultValue: 1.0, min: 0.0, max: 5.0, step: 0.1 },
  { key: 'u_glow', label: 'Inner Glow', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.1 },
  { key: 'u_color1', label: 'Border Color', type: 'color', defaultValue: '#38bdf8' },
  { key: 'u_color2', label: 'Core Color', type: 'color', defaultValue: '#0f172a' },
];

export function createHexGridEngine(): PatternEngine {
  return {
    id: 'hex-grid',
    name: 'Hexagonal Grid',
    category: 'geometry',
    subcategory: 'grids',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 10.0);
      renderer.setUniform1f('u_thickness', (params['u_thickness'] as number) ?? 0.05);
      renderer.setUniform1f('u_pulseSpeed', (params['u_pulseSpeed'] as number) ?? 1.0);
      renderer.setUniform1f('u_glow', (params['u_glow'] as number) ?? 0.5);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#38bdf8');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#0f172a');
    },
  };
}
