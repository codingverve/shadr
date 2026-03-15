/**
 * Hex Color to RGB Conversion
 * Shared utility used by all pattern engines with color parameters.
 */

import { Renderer } from '../core/renderer';

/** Convert hex color string '#RRGGBB' to [r, g, b] floats (0-1) */
export function hexToRGB(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

/**
 * Set a color uniform from a hex string.
 * Convenience function used by all engines.
 */
export function setColorUniform(
  renderer: Renderer,
  name: string,
  hex: string
): void {
  const [r, g, b] = hexToRGB(hex);
  renderer.setUniform3f(name, r, g, b);
}
