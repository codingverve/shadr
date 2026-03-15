/**
 * Kaleidoscope Pattern Engine
 * N-fold symmetric pattern with animated FBM base and advanced lighting.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import kaleidoscopeShader from '../../shaders/kaleidoscope.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_segments', label: 'Symmetry Fold', type: 'range', defaultValue: 6, min: 2, max: 24, step: 1 },
  { key: 'u_rotation', label: 'Initial Rotation', type: 'range', defaultValue: 0, min: 0, max: 6.28, step: 0.01 },
  { key: 'u_zoom', label: 'View Zoom', type: 'range', defaultValue: 3.0, min: 0.5, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_complexity', label: 'Pattern Density', type: 'range', defaultValue: 3.0, min: 1.0, max: 15.0, step: 0.1 },
  { key: 'u_glowIntensity', label: 'Glow Strength', type: 'range', defaultValue: 0.4, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Base Color', type: 'color', defaultValue: '#0a0a2e' },
  { key: 'u_color2', label: 'Primary Accent', type: 'color', defaultValue: '#6366f1' },
  { key: 'u_color3', label: 'Secondary Accent', type: 'color', defaultValue: '#f59e0b' },
];

export function createKaleidoscopeEngine(): PatternEngine {
  return {
    id: 'kaleidoscope',
    name: 'Kaleidoscope',
    category: 'geometry',
    subcategory: 'symmetry',
    fragmentShader: kaleidoscopeShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_segments', (params['u_segments'] as number) ?? 6);
      renderer.setUniform1f('u_rotation', (params['u_rotation'] as number) ?? 0);
      renderer.setUniform1f('u_zoom', (params['u_zoom'] as number) ?? 3.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 3.0);
      renderer.setUniform1f('u_glowIntensity', (params['u_glowIntensity'] as number) ?? 0.4);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0a0a2e');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#6366f1');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#f59e0b');
    },
    dispose() {},
  };
}
