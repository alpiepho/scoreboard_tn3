import React from 'react';
import { colorPresets, TeamColorPreset } from '../utils/teamColors';
import './TeamColorPicker.css';

interface TeamColorPickerProps {
  teamType: 'home' | 'away';
  selectedColorId: string;
  customColors: string[];
  onAddCustomColor: (color: string) => void;
  onRemoveCustomColor: (index: number) => void;
  onChange: (colorId: string) => void;
}


const TeamColorPicker: React.FC<TeamColorPickerProps> = ({
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

  // Find the currently selected color
  const selectedPreset = colorPresets.find(color => color.id === selectedColorId);
  const selectedCustom = !selectedPreset && customColors.includes(selectedColorId) ? selectedColorId : null;

  return (
    <div className="team-color-picker">
      <div className="selected-color" style={{ backgroundColor: selectedPreset ? selectedPreset.backgroundColor : selectedCustom || '#fff' }}>
        <span style={{ color: selectedPreset ? selectedPreset.textColor : '#000' }}>{selectedPreset ? selectedPreset.name : selectedCustom || ''}</span>
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
        {/* + button for custom color */}
        <button
          className="color-option add-custom-color"
          type="button"
          title="Add custom color"
          style={{ background: '#1976d2', color: '#fff', borderColor: '#1976d2', borderRadius: '50%' }}
          onClick={() => {
            colorInputRef.current?.click();
          }}
        >
          +
        </button>
        <input
          ref={colorInputRef}
          type="color"
          style={{ display: 'none' }}
          onChange={e => {
            onAddCustomColor(e.target.value);
          }}
        />
        {/* - button for removing oldest custom color (handled in parent) */}
        <button
          className="color-option remove-custom-color"
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
            className={`color-option custom ${color === selectedColorId ? 'selected' : ''}`}
            style={{ backgroundColor: color, border: color === selectedColorId ? '2px solid #333' : undefined }}
            onClick={() => handleColorSelect(color)}
            title={`Custom color ${color}`}
          >
            <span className="color-preview-text" style={{ color: '#fff' }}>{teamType === 'home' ? 'H' : 'A'}</span>
          </button>
        ))}
      </div>
      {/* No popup needed, color input is triggered directly */}
    </div>
  );
};

export default TeamColorPicker;
