/**
 * Spiral Waves Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/spiral-waves.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 10.0, min: 1.0, max: 50.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 2.0, min: 0.0, max: 10.0, step: 0.1 },
  { key: 'u_spirals', label: 'Spiral Count', type: 'range', defaultValue: 3.0, min: 1.0, max: 12.0, step: 1 },
  { key: 'u_thickness', label: 'Wave Sharpness', type: 'range', defaultValue: 0.1, min: 0.01, max: 0.4, step: 0.01 },
  { key: 'u_color1', label: 'Base', type: 'color', defaultValue: '#0f172a' },
  { key: 'u_color2', label: 'Wave', type: 'color', defaultValue: '#38bdf8' },
  { key: 'u_color3', label: 'Glow', type: 'color', defaultValue: '#f0f9ff' },
];

export function createSpiralWavesEngine(): PatternEngine {
  return {
    id: 'spiral-waves',
    name: 'Spiral Waves',
    category: 'waves',
    subcategory: 'interference',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 10.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 2.0);
      renderer.setUniform1f('u_spirals', (params['u_spirals'] as number) ?? 3.0);
      renderer.setUniform1f('u_thickness', (params['u_thickness'] as number) ?? 0.1);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0f172a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#38bdf8');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#f0f9ff');
    },
  };
}
