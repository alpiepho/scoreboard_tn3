import React from 'react';
import { textColorPresets, TextColorPreset } from '../utils/textColors';
import './TextColorPicker.css';

interface TextColorPickerProps {
  teamType: 'home' | 'away';
  selectedColorId: string;
  onChange: (colorId: string) => void;
}

const TextColorPicker: React.FC<TextColorPickerProps> = ({ teamType, selectedColorId, onChange }) => {
  const handleColorSelect = (colorId: string) => {
    onChange(colorId);
  };

  const selectedColor = textColorPresets.find(color => color.id === selectedColorId) || textColorPresets[0];

  return (
    <div className="text-color-picker">
      <div className="selected-text-color" style={{ backgroundColor: '#222', color: selectedColor.color }}>
        <span>{selectedColor.name}</span>
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
      </div>
    </div>
  );
};

export default TextColorPicker;
