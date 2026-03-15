/**
 * Header Component
 * 
 * App toolbar: branding, engine status, presets, export, record, play/pause.
 */

import { useState } from 'react';
import { useAppStore } from '../app/store';
import { exportCanvasAsPNG } from '../exports/imageExporter';
import { Download, Video, VideoOff, Stars, Zap, Gift } from 'lucide-react';
import { videoExporter } from '../exports/videoExporter';
import { PresetPanel } from './PresetPanel';
import { getRandomBeautifulPalette, getRandomValue } from '../utils/surpriseUtils';
import { Button } from './Button';
import './Header.css';

export function Header() {
  const activeEngine = useAppStore((s) => s.activeEngine);
  const setRecordingCountdown = useAppStore((s) => s.setRecordingCountdown);
  const setShowCard = useAppStore((s) => s.setShowCard);
  const [isRecording, setIsRecording] = useState(false);

  const handleExport = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.shader-canvas');
    if (canvas) {
      exportCanvasAsPNG(canvas, `${activeEngine?.id ?? 'pattern'}-${Date.now()}.png`);
    }
  };

  const handleSurprise = () => {
    const engines = useAppStore.getState().engines;
    if (engines.length === 0) return;
    const randomEngine = engines[Math.floor(Math.random() * engines.length)];
    useAppStore.getState().setEngine(randomEngine);
    
    // Randomize parameters with better logic
    const state = useAppStore.getState();
    const palette = getRandomBeautifulPalette();
    let colorIdx = 0;

    randomEngine.parameters.forEach(p => {
      if (p.type === 'range') {
        const val = getRandomValue(p.min ?? 0, p.max ?? 1, 'centric');
        state.setParameter(p.key, val);
      } else if (p.type === 'color') {
        const colors = [palette.c1, palette.c2, palette.c3];
        state.setParameter(p.key, colors[colorIdx % 3]);
        colorIdx++;
      }
    });
  };

  const handleRecord = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.shader-canvas');
    if (!canvas) return;

    if (isRecording) {
      videoExporter.stop();
      setIsRecording(false);
    } else {
      // Start 3-2-1 countdown
      let count = 3;
      setRecordingCountdown(count);
      
      const timer = setInterval(() => {
        count -= 1;
        setRecordingCountdown(count);
        
        if (count === 0) {
          clearInterval(timer);
          videoExporter.start(canvas, 30);
          setIsRecording(true);
        }
      }, 1000);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <Zap size={20} fill="var(--accent-primary)" />
        </div>
        <h1 className="header-title">Shadr</h1>
        {activeEngine && (
          <>
            <span className="header-divider">|</span>
            <span className="header-engine-status">
              <span className="header-status-dot" />
              {activeEngine.name}
            </span>
          </>
        )}
      </div>

      <div className="header-right">
        <Button
          variant="secondary"
          onClick={handleSurprise}
          title="Surprise Me!"
          icon={<Stars size={16} />}
        >
          Surprise
        </Button>

        <PresetPanel />

        <Button
          variant="secondary"
          onClick={() => setShowCard(true)}
          title="Create Appreciation Card"
          icon={<Gift size={16} />}
        >
          Card
        </Button>

        <Button
          variant="secondary"
          onClick={handleExport}
          title="Export as PNG"
          icon={<Download size={16} />}
        >
          PNG
        </Button>

        <Button
          variant="danger"
          isActive={isRecording}
          onClick={handleRecord}
          title={isRecording ? 'Stop recording' : 'Record video'}
          icon={isRecording ? <VideoOff size={16} /> : <Video size={16} />}
        >
          {isRecording ? 'Stop' : 'Record'}
        </Button>
      </div>
    </header>
  );
}
