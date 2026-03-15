/**
 * Lissajous Curve Pattern Engine
 * Parametric curves with glowing trails and advanced color dynamics.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import lissajousShader from '../../shaders/lissajous.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_freqX', label: 'X Frequency', type: 'range', defaultValue: 3.0, min: 1.0, max: 10.0, step: 0.1 },
  { key: 'u_freqY', label: 'Y Frequency', type: 'range', defaultValue: 2.0, min: 1.0, max: 10.0, step: 0.1 },
  { key: 'u_phase', label: 'Pattern Phase', type: 'range', defaultValue: 1.57, min: 0.0, max: 6.28, step: 0.01 },
  { key: 'u_curveScale', label: 'Curve Scale', type: 'range', defaultValue: 0.4, min: 0.1, max: 1.0, step: 0.01 },
  { key: 'u_trailLength', label: 'Trail Duration', type: 'range', defaultValue: 200, min: 50, max: 400, step: 10 },
  { key: 'u_lineWidth', label: 'Trace Width', type: 'range', defaultValue: 1.5, min: 0.5, max: 5.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.5, min: 0.1, max: 3.0, step: 0.05 },
  { key: 'u_glowIntensity', label: 'Glow Strength', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_saturation', label: 'Saturation', type: 'range', defaultValue: 1.2, min: 0.0, max: 3.0, step: 0.1 },
  { key: 'u_color1', label: 'Background', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Trace Color', type: 'color', defaultValue: '#a78bfa' },
];

export function createLissajousEngine(): PatternEngine {
  return {
    id: 'lissajous',
    name: 'Lissajous',
    category: 'mathematical',
    subcategory: 'curves',
    fragmentShader: lissajousShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_freqX', (params['u_freqX'] as number) ?? 3.0);
      renderer.setUniform1f('u_freqY', (params['u_freqY'] as number) ?? 2.0);
      renderer.setUniform1f('u_phase', (params['u_phase'] as number) ?? 1.57);
      renderer.setUniform1f('u_curveScale', (params['u_curveScale'] as number) ?? 0.4);
      renderer.setUniform1f('u_trailLength', (params['u_trailLength'] as number) ?? 200);
      renderer.setUniform1f('u_lineWidth', (params['u_lineWidth'] as number) ?? 1.5);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_glowIntensity', (params['u_glowIntensity'] as number) ?? 0.5);
      renderer.setUniform1f('u_saturation', (params['u_saturation'] as number) ?? 1.2);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#a78bfa');
    },
    dispose() {},
  };
}
