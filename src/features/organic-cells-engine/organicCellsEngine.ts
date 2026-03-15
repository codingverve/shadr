/**
 * Organic Cells Engine
 * Warped Voronoi for biological cell structures with advanced shading.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/organic-cells.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Cell Scale', type: 'range', defaultValue: 6.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Motion Speed', type: 'range', defaultValue: 0.4, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_warpStrength', label: 'Warp Intensity', type: 'range', defaultValue: 0.8, min: 0.0, max: 3.0, step: 0.1 },
  { key: 'u_cellSmoothness', label: 'Cell Blending', type: 'range', defaultValue: 0.4, min: 0.01, max: 1.0, step: 0.01 },
  { key: 'u_fluidity', label: 'Motion Fluidity', type: 'range', defaultValue: 1.0, min: 0.1, max: 5.0, step: 0.1 },
  { key: 'u_chromatic', label: 'Edge Aberration', type: 'range', defaultValue: 0.0, min: 0.0, max: 0.1, step: 0.001 },
  { key: 'u_contrast', label: 'Intensity Contrast', type: 'range', defaultValue: 1.0, min: 0.5, max: 3.0, step: 0.1 },
  { key: 'u_brightness', label: 'Brightness Offset', type: 'range', defaultValue: 0.0, min: -0.5, max: 0.5, step: 0.02 },
  { key: 'u_color1', label: 'Cytoplasm', type: 'color', defaultValue: '#14532d' },
  { key: 'u_color2', label: 'Organelles', type: 'color', defaultValue: '#22c55e' },
  { key: 'u_color3', label: 'Membrane', type: 'color', defaultValue: '#86efac' },
];

export function createOrganicCellsEngine(): PatternEngine {
  return {
    id: 'organic-cells',
    name: 'Organic Cells',
    category: 'procedural',
    subcategory: 'cellular',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 6.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.4);
      renderer.setUniform1f('u_warpStrength', (params['u_warpStrength'] as number) ?? 0.8);
      renderer.setUniform1f('u_cellSmoothness', (params['u_cellSmoothness'] as number) ?? 0.4);
      renderer.setUniform1f('u_fluidity', (params['u_fluidity'] as number) ?? 1.0);
      renderer.setUniform1f('u_chromatic', (params['u_chromatic'] as number) ?? 0.0);
      renderer.setUniform1f('u_contrast', (params['u_contrast'] as number) ?? 1.0);
      renderer.setUniform1f('u_brightness', (params['u_brightness'] as number) ?? 0.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#14532d');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#22c55e');
      setColorUniform(renderer, 'u_color3', (params['u_color3'] as string) ?? '#86efac');
    },
  };
}
