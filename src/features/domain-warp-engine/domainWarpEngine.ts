/**
 * Domain Warp Engine
 * Multi-level domain distortion.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/domain-warp.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 3.0, min: 0.5, max: 10.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_warpStrength', label: 'Warp Strength', type: 'range', defaultValue: 1.5, min: 0.0, max: 5.0, step: 0.1 },
  { key: 'u_warpLayers', label: 'Warp Layers', type: 'range', defaultValue: 2, min: 1, max: 3, step: 1 },
  { key: 'u_complexity', label: 'Complexity', type: 'range', defaultValue: 3.0, min: 1.0, max: 8.0, step: 0.1 },
  { key: 'u_color1', label: 'Color 1', type: 'color', defaultValue: '#0f172a' },
  { key: 'u_color2', label: 'Color 2', type: 'color', defaultValue: '#f97316' },
  { key: 'u_color3', label: 'Color 3', type: 'color', defaultValue: '#6366f1' },
];

export function createDomainWarpEngine(): PatternEngine {
  return {
    id: 'domain-warp', name: 'Domain Warp', category: 'procedural', subcategory: 'noise',
    fragmentShader: shader, parameters, init() {}, update() {}, dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.3);
      renderer.setUniform1f('u_warpStrength', (params['u_warpStrength'] as number) ?? 1.5);
      renderer.setUniform1f('u_warpLayers', (params['u_warpLayers'] as number) ?? 2);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 3.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0f172a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#f97316');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#6366f1');
    },
  };
}
