/**
 * Color Picker Component
 * 
 * Simple color input with preview swatch and hex value display.
 */

import { useCallback } from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="color-picker-container">
      <label className="color-picker-label">{label}</label>
      <div className="color-picker-input-group">
        <div className="color-picker-swatch-wrapper">
          <input
            type="color"
            className="color-picker-input"
            value={value}
            onChange={handleChange}
          />
          <div
            className="color-picker-swatch"
            style={{ backgroundColor: value }}
          />
        </div>
        <span className="color-picker-hex">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}
