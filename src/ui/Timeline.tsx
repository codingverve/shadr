/**
 * Timeline Component
 * 
 * Bottom bar with playback controls, speed selector, and scrub bar.
 */

import { Play, Pause, Repeat, Clock } from 'lucide-react';
import { useAppStore } from '../app/store';
import { Button } from './Button';
import './Timeline.css';

export function Timeline() {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const togglePlay = useAppStore((s) => s.togglePlay);
  const timelineSpeed = useAppStore((s) => s.timelineSpeed);
  const setTimelineSpeed = useAppStore((s) => s.setTimelineSpeed);
  const timelineDuration = useAppStore((s) => s.timelineDuration);
  const setTimelineDuration = useAppStore((s) => s.setTimelineDuration);
  const isLooping = useAppStore((s) => s.isLooping);
  const toggleLooping = useAppStore((s) => s.toggleLooping);

  const speeds = [0.25, 0.5, 1, 1.5, 2, 3];

  return (
    <footer className="timeline">
      <div className="timeline-controls">
        {/* Play / Pause */}
        <Button
          variant="secondary"
          size="sm"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          icon={isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        />

        {/* Loop toggle */}
        <Button
          variant={isLooping ? 'accent' : 'secondary'}
          size="sm"
          onClick={toggleLooping}
          title={isLooping ? 'Looping on' : 'Looping off'}
          icon={<Repeat size={16} strokeWidth={isLooping ? 2.5 : 2} />}
        />
      </div>

      {/* Duration slider */}
      <div className="timeline-scrub">
        <label className="timeline-label">
          <Clock size={14} />
          Duration
        </label>
        <input
          type="range"
          className="timeline-range"
          min={5}
          max={120}
          step={5}
          value={timelineDuration}
          onChange={(e) => setTimelineDuration(Number(e.target.value))}
        />
        <span className="timeline-value">{timelineDuration}s</span>
      </div>

      {/* Speed selector */}
      <div className="timeline-speed">
        <label className="timeline-label">Speed</label>
        <div className="timeline-speed-buttons">
          {speeds.map((s) => (
            <Button
              key={s}
              variant={timelineSpeed === s ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setTimelineSpeed(s)}
              className="timeline-speed-btn-override"
            >
              {s}×
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
