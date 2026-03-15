/**
 * Harmonic Waves Engine
 * Superposition of multiple high-frequency sine waves with rich color dynamics.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/harmonic-waves.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 4.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 1.0, min: 0.0, max: 5.0, step: 0.1 },
  { key: 'u_harmonics', label: 'Octave Layers', type: 'range', defaultValue: 4, min: 1, max: 8, step: 1 },
  { key: 'u_complexity', label: 'Decay Ratio', type: 'range', defaultValue: 0.6, min: 0.1, max: 1.0, step: 0.05 },
  { key: 'u_saturation', label: 'Color Saturation', type: 'range', defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.1 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Dark Troughs', type: 'color', defaultValue: '#1e1b4b' },
  { key: 'u_color2', label: 'Soft Mids', type: 'color', defaultValue: '#4338ca' },
  { key: 'u_color3', label: 'Glow Peaks', type: 'color', defaultValue: '#818cf8' },
];

export function createHarmonicWavesEngine(): PatternEngine {
  return {
    id: 'harmonic-waves',
    name: 'Harmonic Waves',
    category: 'waves',
    subcategory: 'interference',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 1.0);
      renderer.setUniform1f('u_harmonics', (params['u_harmonics'] as number) ?? 4);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 0.6);
      renderer.setUniform1f('u_saturation', (params['u_saturation'] as number) ?? 1.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#1e1b4b');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#4338ca');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#818cf8');
    },
  };
}
