/**
 * Preset Panel Component
 * 
 * UI to save current settings as presets, browse, load, and delete.
 */

import { useState, useEffect } from 'react';
import { Save, Trash2, Bookmark } from 'lucide-react';
import { useAppStore } from '../app/store';
import {
  loadPresets,
  savePreset,
  deletePreset,
  generatePresetId,
  type Preset,
} from '../features/presets/presetManager';
import { Button } from './Button';
import './PresetPanel.css';

export function PresetPanel() {
  const activeEngine = useAppStore((s) => s.activeEngine);
  const parameters = useAppStore((s) => s.parameters);
  const setParameter = useAppStore((s) => s.setParameter);
  const engines = useAppStore((s) => s.engines);
  const setEngine = useAppStore((s) => s.setEngine);

  const [presets, setPresets] = useState<Preset[]>([]);
  const [saveName, setSaveName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Load presets on mount
  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const handleSave = () => {
    if (!activeEngine || !saveName.trim()) return;

    const preset: Preset = {
      id: generatePresetId(),
      name: saveName.trim(),
      engineId: activeEngine.id,
      parameters: { ...parameters },
      createdAt: Date.now(),
    };

    const updated = savePreset(preset);
    setPresets(updated);
    setSaveName('');
  };

  const handleLoad = (preset: Preset) => {
    const engine = engines.find((e) => e.id === preset.engineId);
    if (engine) {
      setEngine(engine);
      setTimeout(() => {
        Object.entries(preset.parameters).forEach(([key, value]) => {
          setParameter(key, value);
        });
      }, 50);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deletePreset(id);
    setPresets(updated);
  };

  const currentPresets = presets.filter(
    (p) => !activeEngine || p.engineId === activeEngine.id
  );
  const otherPresets = presets.filter(
    (p) => activeEngine && p.engineId !== activeEngine.id
  );

  return (
    <div className="preset-panel">
      <Button
        variant={isOpen ? 'accent' : 'secondary'}
        onClick={() => setIsOpen(!isOpen)}
        title="Presets and Collections"
        icon={<Bookmark size={18} fill={presets.length > 0 ? "var(--accent-primary)" : "none"} />}
      >
        {presets.length > 0 && <span>{presets.length}</span>}
      </Button>

      {isOpen && (
        <div className="preset-panel-dropdown">
          <div className="preset-panel-save-row">
            <input
              type="text"
              className="preset-panel-input"
              placeholder="Preset name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button
              variant="accent"
              size="sm"
              onClick={handleSave}
              disabled={!saveName.trim()}
              title="Save current state"
              icon={<Save size={14} />}
            >
              Save
            </Button>
          </div>

          {currentPresets.length > 0 && (
            <div className="preset-panel-section">
              <span className="preset-panel-section-label">
                {activeEngine?.name ?? 'Current'}
              </span>
              {currentPresets.map((preset) => (
                <div key={preset.id} className="preset-panel-item">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="preset-panel-load-btn"
                    onClick={() => handleLoad(preset)}
                  >
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="preset-panel-delete-btn"
                    onClick={() => handleDelete(preset.id)}
                    title="Delete"
                    icon={<Trash2 size={12} />}
                  />
                </div>
              ))}
            </div>
          )}

          {otherPresets.length > 0 && (
            <div className="preset-panel-section">
              <span className="preset-panel-section-label">Other engines</span>
              {otherPresets.map((preset) => (
                <div key={preset.id} className="preset-panel-item">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="preset-panel-load-btn"
                    onClick={() => handleLoad(preset)}
                  >
                    <span className="preset-engine-tag">
                      {engines.find((e) => e.id === preset.engineId)?.name ?? preset.engineId}
                    </span>
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="preset-panel-delete-btn"
                    onClick={() => handleDelete(preset.id)}
                    title="Delete"
                    icon={<Trash2 size={12} />}
                  />
                </div>
              ))}
            </div>
          )}

          {presets.length === 0 && (
            <div className="preset-panel-empty">No presets saved yet</div>
          )}
        </div>
      )}
    </div>
  );
}
