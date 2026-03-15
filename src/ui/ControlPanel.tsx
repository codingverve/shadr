/**
 * Control Panel Component
 * 
 * Right-side panel that renders controls for the active engine's parameters
 * and post-processing effects.
 */

import { Sliders, RefreshCw, Layers } from 'lucide-react';
import { useAppStore } from '../app/store';
import { Slider } from './Slider';
import { ColorPicker } from './ColorPicker';
import { PostFXPanel } from './PostFXPanel';
import { Button } from './Button';
import './ControlPanel.css';

export function ControlPanel() {
  const activeEngine = useAppStore((s) => s.activeEngine);
  const parameters = useAppStore((s) => s.parameters);
  const setParameter = useAppStore((s) => s.setParameter);
  const resetParameters = useAppStore((s) => s.resetParameters);

  if (!activeEngine) {
    return (
      <aside className="control-panel">
        <div className="control-panel-empty">
          <p>No pattern selected</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="control-panel">
      <div className="control-panel-header">
        <div className="control-panel-title-group">
          <h2 className="control-panel-title">
            <Sliders size={18} />
            {activeEngine.name}
          </h2>
          <span className="control-panel-badge">
            <Layers size={12} />
            {activeEngine.category}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={resetParameters}
          title="Reset to defaults"
          icon={<RefreshCw size={14} />}
        >
          Reset
        </Button>
      </div>

      <div className="control-panel-divider" />

      <div className="control-panel-controls">
        {activeEngine.parameters.map((param) => {
          if (param.type === 'color') {
            return (
              <ColorPicker
                key={param.key}
                label={param.label}
                value={(parameters[param.key] as string) ?? (param.defaultValue as string)}
                onChange={(value) => setParameter(param.key, value)}
              />
            );
          }

          if (param.type === 'range') {
            return (
              <Slider
                key={param.key}
                label={param.label}
                value={(parameters[param.key] as number) ?? (param.defaultValue as number)}
                min={param.min ?? 0}
                max={param.max ?? 1}
                step={param.step ?? 0.01}
                onChange={(value) => setParameter(param.key, value)}
              />
            );
          }

          return null;
        })}
      </div>

      <PostFXPanel />
    </aside>
  );
}
