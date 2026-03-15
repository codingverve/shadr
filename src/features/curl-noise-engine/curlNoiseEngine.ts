/**
 * Curl Noise Engine
 * Divergence-free noise field for smoke/fluid-like visuals.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/curl-noise.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 3.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Flow Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_curlStrength', label: 'Curl Strength', type: 'range', defaultValue: 1.0, min: 0.1, max: 5.0, step: 0.1 },
  { key: 'u_layers', label: 'Noise Layers', type: 'range', defaultValue: 4, min: 1, max: 6, step: 1 },
  { key: 'u_advection', label: 'Warp Flow', type: 'range', defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Flow Background', type: 'color', defaultValue: '#020617' },
  { key: 'u_color2', label: 'Flow Accent', type: 'color', defaultValue: '#38bdf8' },
];

export function createCurlNoiseEngine(): PatternEngine {
  return {
    id: 'curl-noise',
    name: 'Curl Noise',
    category: 'procedural',
    subcategory: 'noise',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_curlStrength', (params['u_curlStrength'] as number) ?? 1.0);
      renderer.setUniform1f('u_layers', (params['u_layers'] as number) ?? 4);
      renderer.setUniform1f('u_advection', (params['u_advection'] as number) ?? 1.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#020617');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#38bdf8');
    },
  };
}
