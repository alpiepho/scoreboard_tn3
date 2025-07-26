import React from 'react';
import { textColorPresets, TextColorPreset } from '../utils/textColors';
import './TextColorPicker.css';

interface TextColorPickerProps {
  teamType: 'home' | 'away';
  selectedColorId: string;
  customColors: string[];
  onAddCustomColor: (color: string) => void;
  onRemoveCustomColor: (index: number) => void;
  onChange: (colorId: string) => void;
}


const TextColorPicker: React.FC<TextColorPickerProps> = ({
  teamType,
  selectedColorId,
  customColors,
  onAddCustomColor,
  onRemoveCustomColor,
  onChange
}) => {
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  const handleColorSelect = (colorId: string) => {
    onChange(colorId);
  };

  const selectedPreset = textColorPresets.find(color => color.id === selectedColorId);
  const selectedCustom = !selectedPreset && customColors.includes(selectedColorId) ? selectedColorId : null;

  return (
    <div className="text-color-picker">
      <div className="selected-text-color" style={{ backgroundColor: '#222', color: selectedPreset ? selectedPreset.color : selectedCustom || '#fff' }}>
        <span>{selectedPreset ? selectedPreset.name : selectedCustom || ''}</span>
      </div>
      <div className="text-color-options">
        {textColorPresets.map((color: TextColorPreset) => (
          <button
            key={color.id}
            className={`text-color-option ${color.id === selectedColorId ? 'selected' : ''}`}
            style={{ color: color.color, borderColor: color.id === selectedColorId ? color.color : '#ccc' }}
            onClick={() => handleColorSelect(color.id)}
            title={color.name}
          >
            <span className="text-color-preview">{teamType === 'home' ? 'H' : 'A'}</span>
          </button>
        ))}
        {/* + button for custom color */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            className="text-color-option add-custom-color"
            type="button"
            title="Add custom color"
            style={{ background: '#1976d2', color: '#fff', borderColor: '#1976d2', borderRadius: '50%' }}
          >
            +
            <input
              ref={colorInputRef}
              type="color"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                margin: 0
              }}
              tabIndex={-1}
              aria-label="Pick custom color"
              onChange={e => {
                onAddCustomColor(e.target.value);
              }}
            />
          </button>
        </div>
        {/* - button for removing oldest custom color (handled in parent) */}
        <button
          className="text-color-option remove-custom-color"
          type="button"
          title="Remove oldest custom color"
          style={{ background: '#1976d2', color: '#fff', borderColor: '#1976d2', borderRadius: '50%' }}
          disabled={customColors.length === 0}
          onClick={() => onRemoveCustomColor(0)}
        >
          -
        </button>
        {/* Custom colors */}
        {customColors.map((color, idx) => (
          <button
            key={color + idx}
            className={`text-color-option custom ${color === selectedColorId ? 'selected' : ''}`}
            style={{ color: color, borderColor: color === selectedColorId ? color : '#ccc', background: '#fff' }}
            onClick={() => handleColorSelect(color)}
            title={`Custom color ${color}`}
          >
            <span className="text-color-preview">{teamType === 'home' ? 'H' : 'A'}</span>
          </button>
        ))}
      </div>
      {/* No popup needed, color input is triggered directly */}
    </div>
  );
};

export default TextColorPicker;
