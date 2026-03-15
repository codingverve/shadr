/**
 * Slider Component
 * 
 * Custom styled range slider with label, value display,
 * and smooth micro-interaction feedback.
 */

import { useCallback } from 'react';
import './Slider.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  // Calculate fill percentage for the track gradient
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        <span className="slider-value">{Number.isInteger(step) ? value : value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${fillPercent}%, var(--surface-2) ${fillPercent}%, var(--surface-2) 100%)`,
        }}
      />
    </div>
  );
}
