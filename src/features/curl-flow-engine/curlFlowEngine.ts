/**
 * Curl Flow Engine
 */
import type { PatternEngine, ParameterDefinition } from '../../core/types';
import type { Renderer } from '../../core/renderer';
import { setColorUniform } from '../../utils/colorUtils';
import shader from '../../shaders/curl-flow.frag?raw';

const parameters: ParameterDefinition[] = [
  { key: 'u_scale', label: 'Field Scale', type: 'range', defaultValue: 5.0, min: 1.0, max: 20.0, step: 0.1 },
  { key: 'u_speed', label: 'Field Speed', type: 'range', defaultValue: 0.3, min: 0.0, max: 2.0, step: 0.05 },
  { key: 'u_complexity', label: 'Intensity', type: 'range', defaultValue: 1.0, min: 0.1, max: 5.0, step: 0.1 },
  { key: 'u_color1', label: 'Field', type: 'color', defaultValue: '#1e1b4b' },
  { key: 'u_color2', label: 'Flow', type: 'color', defaultValue: '#fb7185' },
];

export function createCurlFlowEngine(): PatternEngine {
  return {
    id: 'curl-flow',
    name: 'Curl Flow',
    category: 'simulation',
    subcategory: 'flow',
    fragmentShader: shader,
    parameters,
    init() {},
    update() {},
    dispose() {},
    updateUniforms(renderer: Renderer, params: Record<string, number | string | boolean>) {
      renderer.setUniform1f('u_scale', (params['u_scale'] as number) ?? 5.0);
      renderer.setUniform1f('u_speed', (params['u_speed'] as number) ?? 0.3);
      renderer.setUniform1f('u_complexity', (params['u_complexity'] as number) ?? 1.0);
      setColorUniform(renderer, 'u_color1', (params['u_color1'] as string) ?? '#1e1b4b');
      setColorUniform(renderer, 'u_color2', (params['u_color2'] as string) ?? '#fb7185');
    },
  };
}
