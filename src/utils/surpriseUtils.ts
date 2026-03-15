/**
 * Surprise Logic Manager
 * 
 * Provides sophisticated randomization and predefined "beautiful" setups.
 */

const BEAUTIFUL_PALETTES = [
  { c1: '#0f172a', c2: '#38bdf8', c3: '#818cf8' }, // Cyber Blue
  { c1: '#4c0519', c2: '#fb7185', c3: '#f43f5e' }, // Rose Neon
  { c1: '#064e3b', c2: '#34d399', c3: '#10b981' }, // Emerald Deep
  { c1: '#1e1b4b', c2: '#6366f1', c3: '#a855f7' }, // Indigo Sunset
  { c1: '#451a03', c2: '#f59e0b', c3: '#d97706' }, // Amber Stone
  { c1: '#171717', c2: '#525252', c3: '#a3a3a3' }, // Monochrome Sleek
];

export function getRandomBeautifulPalette() {
  return BEAUTIFUL_PALETTES[Math.floor(Math.random() * BEAUTIFUL_PALETTES.length)];
}

export function getRandomValue(min: number, max: number, behavior: 'random' | 'centric' = 'random') {
  if (behavior === 'centric') {
    // Bias towards the middle
    const r1 = Math.random();
    const r2 = Math.random();
    return min + (r1 + r2) / 2 * (max - min);
  }
  return min + Math.random() * (max - min);
}
