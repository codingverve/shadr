/**
 * Voronoi Pattern Engine
 * Cellular Voronoi pattern with animated points and advanced controls.
 */

import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import voronoiShader from '../../shaders/voronoi.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Scale', type: 'range', defaultValue: 4.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Speed', type: 'range', defaultValue: 0.5, min: 0.0, max: 3.0, step: 0.05 },
  { key: 'u_jitter', label: 'Jitter', type: 'range', defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_edgeWidth', label: 'Edge Width', type: 'range', defaultValue: 0.08, min: 0.01, max: 0.5, step: 0.01 },
  { key: 'u_cellRound', label: 'Cell Roundness', type: 'range', defaultValue: 0.6, min: 0.1, max: 2.0, step: 0.05 },
  { key: 'u_glowStrength', label: 'Glow Intensity', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_contrast', label: 'Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Cell Color', type: 'color', defaultValue: '#0f0f2d' },
  { key: 'u_color2', label: 'Accent Color', type: 'color', defaultValue: '#6366f1' },
  { key: 'u_edgeColor', label: 'Edge Color', type: 'color', defaultValue: '#a5b4fc' },
];

export function createVoronoiEngine(): PatternEngine {
  return {
    id: 'voronoi',
    name: 'Voronoi',
    category: 'procedural',
    subcategory: 'cellular',
    fragmentShader: voronoiShader,
    parameters,
    init() {},
    update() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.5);
      renderer.setUniform1f('u_jitter', (params['u_jitter'] as number) ?? 1.0);
      renderer.setUniform1f('u_edgeWidth', (params['u_edgeWidth'] as number) ?? 0.08);
      renderer.setUniform1f('u_cellRound', (params['u_cellRound'] as number) ?? 0.6);
      renderer.setUniform1f('u_glowStrength', (params['u_glowStrength'] as number) ?? 0.3);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0f0f2d');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#6366f1');
      setColorUniform(renderer, 'u_edgeColor', (params['u_edgeColor'] as string) ?? '#a5b4fc');
    },
    dispose() {},
  };
}
