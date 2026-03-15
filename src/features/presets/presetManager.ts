/**
 * Preset Manager
 * Save/load pattern presets to localStorage.
 */

export interface Preset {
  id: string;
  name: string;
  engineId: string;
  parameters: Record<string, number | string | boolean>;
  createdAt: number;
}

const STORAGE_KEY = 'shader-pattern-generator-presets';

/** Load all presets from localStorage */
export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Preset[];
  } catch {
    console.warn('[PresetManager] Failed to load presets');
    return [];
  }
}

/** Save a preset to localStorage */
export function savePreset(preset: Preset): Preset[] {
  const presets = loadPresets();
  presets.push(preset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

/** Delete a preset by ID */
export function deletePreset(id: string): Preset[] {
  const presets = loadPresets().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

/** Generate a unique ID */
export function generatePresetId(): string {
  return `preset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
