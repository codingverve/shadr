/**
 * Waves & Ripples Pattern Engine
 * Concentric wave interference pattern with caustic effects.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import wavesShader from '../../shaders/waves.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 2.0, min: 0.5, max: 10.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.6, min: 0.0, max: 3.0, step: 0.05 },
  { key: 'u_waveCount', label: 'Wave Sources', type: 'range', defaultValue: 5, min: 1, max: 8, step: 1 },
  { key: 'u_frequency', label: 'Wave Frequency', type: 'range', defaultValue: 8.0, min: 1.0, max: 40.0, step: 0.5 },
  { key: 'u_amplitude', label: 'Wave Strength', type: 'range', defaultValue: 1.0, min: 0.1, max: 5.0, step: 0.05 },
  { key: 'u_decay', label: 'Distance Decay', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_causticIntensity', label: 'Caustic Brightness', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.1 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Deep Water', type: 'color', defaultValue: '#0c1445' },
  { key: 'u_color2', label: 'Shallow Glow', type: 'color', defaultValue: '#22d3ee' },
];

export function createWavesEngine(): PatternEngine {
  return {
    id: 'waves',
    name: 'Waves',
    category: 'waves',
    subcategory: 'interference',
    fragmentShader: wavesShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 2.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.6);
      renderer.setUniform1f('u_waveCount', (params['u_waveCount'] as number) ?? 5);
      renderer.setUniform1f('u_frequency', (params['u_frequency'] as number) ?? 8.0);
      renderer.setUniform1f('u_amplitude', (params['u_amplitude'] as number) ?? 1.0);
      renderer.setUniform1f('u_decay', (params['u_decay'] as number) ?? 0.5);
      renderer.setUniform1f('u_causticIntensity', (params['u_causticIntensity'] as number) ?? 0.5);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0c1445');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#22d3ee');
    },
    dispose() {},
  };
}
