/**
 * SDF Shapes Engine
 * Smooth morphing primitives with pattern repetition.
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/sdf-shapes.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'View Scale', type: 'range', defaultValue: 4.0, min: 1.0, max: 10.0, step: 0.1 },
  { key: 'u_roundness', label: 'Morph Blending', type: 'range', defaultValue: 0.2, min: 0.01, max: 1.0, step: 0.01 },
  { key: 'u_repeat', label: 'Pattern Repeat', type: 'range', defaultValue: 0.0, min: 0.0, max: 5.0, step: 0.5 },
  { key: 'u_lineWidth', label: 'Outline Width', type: 'range', defaultValue: 0.02, min: 0.005, max: 0.1, step: 0.005 },
  { key: 'u_glowIntensity', label: 'Glow Intensity', type: 'range', defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_color1', label: 'Background Color', type: 'color', defaultValue: '#0f172a' },
  { key: 'u_color2', label: 'Shape Color', type: 'color', defaultValue: '#a5b4fc' },
];

export function createSDFShapesEngine(): PatternEngine {
  return {
    id: 'sdf-shapes',
    name: 'SDF Morph',
    category: 'mathematical',
    subcategory: 'sdf',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 4.0);
      renderer.setUniform1f('u_roundness', (params['u_roundness'] as number) ?? 0.2);
      renderer.setUniform1f('u_repeat', (params['u_repeat'] as number) ?? 0.0);
      renderer.setUniform1f('u_lineWidth', (params['u_lineWidth'] as number) ?? 0.02);
      renderer.setUniform1f('u_glowIntensity', (params['u_glowIntensity'] as number) ?? 0.5);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#0f172a');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#a5b4fc');
    },
  };
}
