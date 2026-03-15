/**
 * Simplex Noise Engine
 * Smooth 3D simplex noise with FBM layering and domain warping.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/simplex-noise.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Noise Scale', type: 'range', defaultValue: 3.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Drift Speed', type: 'range', defaultValue: 0.2, min: 0.0, max: 1.0, step: 0.05 },
  { key: 'u_octaves', label: 'Detail Layers', type: 'range', defaultValue: 4, min: 1, max: 8, step: 1 },
  { key: 'u_persistence', label: 'Graininess', type: 'range', defaultValue: 0.5, min: 0.1, max: 1.0, step: 0.05 },
  { key: 'u_lacunarity', label: 'Complexity', type: 'range', defaultValue: 2.0, min: 1.0, max: 4.0, step: 0.1 },
  { key: 'u_warp', label: 'Warp Intensity', type: 'range', defaultValue: 1.0, min: 0.0, max: 5.0, step: 0.1 },
  { key: 'u_contrast', label: 'Intensity Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness Offset', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Core Color', type: 'color', defaultValue: '#0f172a' },
  { key: 'u_color2', label: 'Peak Color', type: 'color', defaultValue: '#38bdf8' },
];

export function createSimplexNoiseEngine(): PatternEngine {
  return {
    id: 'simplex-noise',
    name: 'Simplex Noise',
    category: 'procedural',
    subcategory: 'noise',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.2);
      renderer.setUniform1i('u_octaves', (params['u_octaves'] as number) ?? 4);
      renderer.setUniform1f('u_persistence', (params['u_persistence'] as number) ?? 0.5);
      renderer.setUniform1f('u_lacunarity', (params['u_lacunarity'] as number) ?? 2.0);
      renderer.setUniform1f('u_warp', (params['u_warp'] as number) ?? 1.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0f172a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#38bdf8');
    },
  };
}
