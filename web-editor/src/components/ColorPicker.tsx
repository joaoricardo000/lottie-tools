import { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  projectColors: string[];
  label: string;
}

export function ColorPicker({ value, onChange, projectColors, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const displayColor = value === 'none' ? 'transparent' : value;
  const displayText = value === 'none' ? 'none' : value;

  return (
    <div className="color-picker-container" ref={pickerRef}>
      <button
        className="color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${label} color picker`}
        type="button"
      >
        <span
          className="color-preview"
          style={{
            backgroundColor: displayColor,
            backgroundImage: displayColor === 'transparent'
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
              : undefined,
            backgroundSize: displayColor === 'transparent' ? '8px 8px' : undefined,
            backgroundPosition: displayColor === 'transparent' ? '0 0, 4px 4px' : undefined,
          }}
        />
        <span className="color-value">{displayText}</span>
      </button>

      {isOpen && (
        <div className="color-picker-dropdown">
          <div className="color-picker-section">
            <label>Color</label>
            <input
              type="color"
              value={value === 'none' ? '#000000' : value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>

          {projectColors.length > 0 && (
            <div className="color-picker-section">
              <label>Project Colors</label>
              <div className="color-picker-swatches">
                {projectColors.map((color) => (
                  <button
                    key={color}
                    className="color-picker-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    title={color}
                    type="button"
                    aria-label={`Apply color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="color-picker-section">
            <button
              className="color-picker-none-btn"
              onClick={() => {
                onChange('none');
                setIsOpen(false);
              }}
              type="button"
            >
              Set to None
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
