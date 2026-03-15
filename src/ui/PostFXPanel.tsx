/**
 * PostFX Panel Component
 * 
 * Collapsible section for post-processing effect controls.
 */

import { useState } from 'react';
import { useAppStore } from '../app/store';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { Slider } from './Slider';
import './PostFXPanel.css';

export function PostFXPanel() {
  const postFx = useAppStore((s) => s.postFx);
  const setPostFx = useAppStore((s) => s.setPostFx);
  const setPostFxBool = useAppStore((s) => s.setPostFxBool);
  const resetPostFx = useAppStore((s) => s.resetPostFx);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="postfx-panel">
      <div className="postfx-panel-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="postfx-panel-chevron">{isOpen ? '▾' : '▸'}</span>
        <h3 className="postfx-panel-title">Effects</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); resetPostFx(); }}
          title="Reset effects"
          icon={<RotateCcw size={12} />}
        />
      </div>

      {isOpen && (
        <div className="postfx-panel-controls">
          <Slider
            label="Bloom"
            value={postFx.bloom}
            min={0}
            max={2}
            step={0.01}
            onChange={(v) => setPostFx('bloom', v)}
          />
          <Slider
            label="Film Grain"
            value={postFx.grain}
            min={0}
            max={3}
            step={0.05}
            onChange={(v) => setPostFx('grain', v)}
          />
          <Slider
            label="Chromatic Aberration"
            value={postFx.chromaticAberration}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => setPostFx('chromaticAberration', v)}
          />
          <Slider
            label="Vignette"
            value={postFx.vignette}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => setPostFx('vignette', v)}
          />

          {/* Kaleidoscope Symmetry */}
          <div className="postfx-toggle-row">
            <label className="postfx-toggle-label">Kaleidoscope</label>
            <Button
              variant={postFx.kaleidoscope ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setPostFxBool('kaleidoscope', !postFx.kaleidoscope)}
            >
              {postFx.kaleidoscope ? 'Active' : 'Enable'}
            </Button>
          </div>

          {postFx.kaleidoscope && (
            <Slider
              label="Segments"
              value={postFx.kaleidoscopeSegments}
              min={3}
              max={16}
              step={1}
              onChange={(v) => setPostFx('kaleidoscopeSegments', v)}
            />
          )}
        </div>
      )}
    </div>
  );
}
