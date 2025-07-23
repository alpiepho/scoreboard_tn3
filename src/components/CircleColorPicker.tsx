import React from 'react';
import { circleColorPresets, CircleColorPreset } from '../utils/circleColors';
import './CircleColorPicker.css';

interface CircleColorPickerProps {
  selectedColorId: string;
  onChange: (colorId: string) => void;
}

const CircleColorPicker: React.FC<CircleColorPickerProps> = ({ 
  selectedColorId, 
  onChange 
}) => {
  const handleColorSelect = (colorId: string) => {
    onChange(colorId);
  };

  // Find the currently selected color
  const selectedColor = circleColorPresets.find(color => color.id === selectedColorId) || circleColorPresets[0];
  
  return (
    <div className="circle-color-picker">
      <div 
        className="selected-circle-color" 
        style={{ borderColor: selectedColor.borderColor }}
      >
        <div 
          className="selected-circle-preview active" 
          style={{ 
            backgroundColor: selectedColor.activeBgColor,
            borderColor: selectedColor.activeBorderColor
          }}
        ></div>
        <div 
          className="selected-circle-preview inactive" 
          style={{ 
            backgroundColor: selectedColor.inactiveBgColor,
            borderColor: selectedColor.borderColor
          }}
        ></div>
        <span>{selectedColor.name}</span>
      </div>
      
      <div className="circle-color-options">
        {circleColorPresets.map((color: CircleColorPreset) => (
          <button
            key={color.id}
            className={`circle-color-option ${color.id === selectedColorId ? 'selected' : ''}`}
            onClick={() => handleColorSelect(color.id)}
            title={color.name}
          >
            <div 
              className="circle-preview" 
              style={{ 
                backgroundColor: color.activeBgColor,
                borderColor: color.borderColor
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CircleColorPicker;
