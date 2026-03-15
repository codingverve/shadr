/**
 * Engine Selector Component
 * 
 * Left-side panel with collapsible sub-category groups.
 * Scales to 50+ engines without becoming cluttered.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAppStore } from '../app/store';
import type { PatternEngine } from '../core/types';
import './EngineSelector.css';

/** Category display config */
const CATEGORY_CONFIG: Record<string, { label: string; order: number }> = {
  procedural: { label: 'Procedural', order: 0 },
  waves: { label: 'Waves', order: 1 },
  mathematical: { label: 'Mathematical', order: 2 },
  geometry: { label: 'Geometry', order: 3 },
  textures: { label: 'Textures', order: 4 },
  simulation: { label: 'Simulations', order: 5 },
  experimental: { label: 'Experimental', order: 6 },
  shader: { label: 'Shader', order: 7 },
};

/** Sub-category display labels */
const SUBCATEGORY_LABELS: Record<string, string> = {
  noise: 'Noise',
  cellular: 'Cellular',
  flow: 'Flow',
  surface: 'Surface',
  fractals: 'Fractals',
  curves: 'Curves',
  interference: 'Interference',
  symmetry: 'Symmetry',
  grids: 'Grids',
  tiles: 'Tiles',
  polar: 'Polar',
  sdf: 'SDF',
  natural: 'Natural',
  plasma: 'Plasma',
  optical: 'Optical',
  reaction: 'Reaction',
  artistic: 'Artistic',
};

interface SubGroup {
  subcategory: string;
  engines: PatternEngine[];
}

interface CategoryGroup {
  category: string;
  label: string;
  order: number;
  subgroups: SubGroup[];
  /** Engines without a subcategory */
  loose: PatternEngine[];
}

function buildGroups(engines: PatternEngine[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();

  for (const engine of engines) {
    const cat = engine.category;
    if (!map.has(cat)) {
      const conf = CATEGORY_CONFIG[cat] ?? { label: cat, order: 99 };
      map.set(cat, { category: cat, label: conf.label, order: conf.order, subgroups: [], loose: [] });
    }
    const group = map.get(cat)!;

    if (engine.subcategory) {
      let sub = group.subgroups.find((s) => s.subcategory === engine.subcategory);
      if (!sub) {
        sub = { subcategory: engine.subcategory, engines: [] };
        group.subgroups.push(sub);
      }
      sub.engines.push(engine);
    } else {
      group.loose.push(engine);
    }
  }

  return [...map.values()].sort((a, b) => a.order - b.order);
}

export function EngineSelector() {
  const engines = useAppStore((s) => s.engines);
  const activeEngine = useAppStore((s) => s.activeEngine);
  const setEngine = useAppStore((s) => s.setEngine);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = buildGroups(engines);

  const toggleCategory = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="engine-selector">
      <div className="engine-selector-header">
        <h2 className="engine-selector-title">Patterns</h2>
        <span className="engine-selector-count">{engines.length}</span>
      </div>

      <div className="engine-selector-list">
        {groups.map((group) => {
          const isCollapsed = collapsed[group.category] ?? false;
          const hasActive = [...group.loose, ...group.subgroups.flatMap((s) => s.engines)]
            .some((e) => e.id === activeEngine?.id);

          return (
            <div key={group.category} className="engine-selector-group">
              <button
                className={`engine-selector-category ${hasActive ? 'has-active' : ''}`}
                onClick={() => toggleCategory(group.category)}
              >
                <span className="category-chevron">
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </span>
                {group.label}
              </button>

              {!isCollapsed && (
                <>
                  {group.subgroups.map((sub) => (
                    <div key={sub.subcategory} className="engine-selector-subgroup">
                      <span className="engine-selector-subcategory">
                        {SUBCATEGORY_LABELS[sub.subcategory] ?? sub.subcategory}
                      </span>
                      {sub.engines.map((engine) => (
                        <button
                          key={engine.id}
                          className={`engine-selector-item ${activeEngine?.id === engine.id ? 'active' : ''}`}
                          onClick={() => setEngine(engine)}
                        >
                          <span className="engine-selector-dot" />
                          <span className="engine-selector-name">{engine.name}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                  {group.loose.map((engine) => (
                    <button
                      key={engine.id}
                      className={`engine-selector-item ${activeEngine?.id === engine.id ? 'active' : ''}`}
                      onClick={() => setEngine(engine)}
                    >
                      <span className="engine-selector-dot" />
                      <span className="engine-selector-name">{engine.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
