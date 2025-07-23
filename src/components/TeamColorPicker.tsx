import React from 'react';
import { colorPresets, TeamColorPreset } from '../utils/teamColors';
import './TeamColorPicker.css';

interface TeamColorPickerProps {
  teamType: 'home' | 'away';
  selectedColorId: string;
  onChange: (colorId: string) => void;
}

const TeamColorPicker: React.FC<TeamColorPickerProps> = ({ 
  teamType, 
  selectedColorId, 
  onChange 
}) => {
  const handleColorSelect = (colorId: string) => {
    onChange(colorId);
  };

  // Find the currently selected color
  const selectedColor = colorPresets.find(color => color.id === selectedColorId) || colorPresets[0];
  
  return (
    <div className="team-color-picker">
      <div className="selected-color" style={{ backgroundColor: selectedColor.backgroundColor }}>
        <span style={{ color: selectedColor.textColor }}>{selectedColor.name}</span>
      </div>
      
      <div className="color-options">
        {colorPresets.map((color: TeamColorPreset) => (
          <button
            key={color.id}
            className={`color-option ${color.id === selectedColorId ? 'selected' : ''}`}
            style={{ backgroundColor: color.backgroundColor }}
            onClick={() => handleColorSelect(color.id)}
            title={color.name}
          >
            <span className="color-preview-text" style={{ color: color.textColor }}>
              {teamType === 'home' ? 'H' : 'A'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamColorPicker;
