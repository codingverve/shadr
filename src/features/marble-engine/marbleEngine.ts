/**
 * Marble / Liquid Pattern Engine
 * Rich veined marble texture with polished stone sheen and advanced color dynamics.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import marbleShader from '../../shaders/marble.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 2.0, min: 0.5, max: 10.0, step: 0.1 },
  { key: 'u_speed', label: 'Flow Speed', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_veinSharpness', label: 'Vein Sharpness', type: 'range', defaultValue: 2.0, min: 0.5, max: 6.0, step: 1 },
  { key: 'u_veinIntensity', label: 'Vein Strength', type: 'range', defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_turbulence', label: 'Warp Turbulence', type: 'range', defaultValue: 1.5, min: 0.0, max: 4.0, step: 0.1 },
  { key: 'u_layers', label: 'FBM Octaves', type: 'range', defaultValue: 5, min: 1, max: 8, step: 1 },
  { key: 'u_glowIntensity', label: 'Polished Shine', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Base Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Base Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Dark Marble', type: 'color', defaultValue: '#1a1a2e' },
  { key: 'u_color2', label: 'Deep Accent', type: 'color', defaultValue: '#2d2d5e' },
  { key: 'u_veinColor', label: 'Vein Tint', type: 'color', defaultValue: '#c4b5fd' },
];

export function createMarbleEngine(): PatternEngine {
  return {
    id: 'marble',
    name: 'Marble',
    category: 'procedural',
    subcategory: 'surface',
    fragmentShader: marbleShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 2.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.3);
      renderer.setUniform1f('u_veinSharpness', (params['u_veinSharpness'] as number) ?? 2.0);
      renderer.setUniform1f('u_veinIntensity', (params['u_veinIntensity'] as number) ?? 1.0);
      renderer.setUniform1f('u_turbulence', (params['u_turbulence'] as number) ?? 1.5);
      renderer.setUniform1f('u_layers', (params['u_layers'] as number) ?? 5);
      renderer.setUniform1f('u_glowIntensity', (params['u_glowIntensity'] as number) ?? 0.5);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#1a1a2e');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#2d2d5e');
      setColorUniform(renderer, 'u_veinColor', (params['u_veinColor'] as string) ?? '#c4b5fd');
    },
    dispose() {},
  };
}
