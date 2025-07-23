// Set circle color configurations

// Version tracking to force updates in development
export const CIRCLE_COLORS_VERSION = Date.now(); // This will change every time the file is saved

// Define available color presets for set circles
export interface CircleColorPreset {
  id: string;                  // Unique identifier for the preset
  name: string;                // Display name of the preset
  borderColor: string;         // Border color for inactive circles
  activeBgColor: string;       // Background color for active circles
  activeBorderColor: string;   // Border color for active circles
  inactiveBgColor: string;     // Background color for inactive circles
}

// Define the complete set circle configuration
export interface SetCircleConfig {
  colorPresetId: string;        // ID of the selected color preset
}

// List of predefined color presets for set circles
export const circleColorPresets: CircleColorPreset[] = [
  {
    id: 'black',
    name: 'Black',
    borderColor: '#000000',
    activeBgColor: '#000000',
    activeBorderColor: '#000000',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'white',
    name: 'White',
    borderColor: '#ffffff',
    activeBgColor: '#ffffff',
    activeBorderColor: '#ffffff',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'blue',
    name: 'Blue',
    borderColor: '#2196f3',
    activeBgColor: '#2196f3',
    activeBorderColor: '#2196f3',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'red',
    name: 'Red',
    borderColor: '#f44336',
    activeBgColor: '#f44336',
    activeBorderColor: '#f44336',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'green',
    name: 'Green',
    borderColor: '#4caf50',
    activeBgColor: '#4caf50',
    activeBorderColor: '#4caf50',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'gold',
    name: 'Gold',
    borderColor: '#ffd700',
    activeBgColor: '#ffd700',
    activeBorderColor: '#ffd700',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'purple',
    name: 'Purple',
    borderColor: '#9c27b0',
    activeBgColor: '#9c27b0',
    activeBorderColor: '#9c27b0',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'orange',
    name: 'Orange',
    borderColor: '#ff9800',
    activeBgColor: '#ff9800',
    activeBorderColor: '#ff9800',
    inactiveBgColor: 'transparent'
  },
  {
    id: 'teal',
    name: 'Teal',
    borderColor: '#009688',
    activeBgColor: '#009688',
    activeBorderColor: '#009688',
    inactiveBgColor: 'transparent'
  }
];

// Default circle color configuration
export const defaultCircleConfig: SetCircleConfig = {
  colorPresetId: 'black'
};

/**
 * Gets the color preset for set circles
 * @param presetId The ID of the color preset
 * @returns The circle color preset configuration
 */
export function getCircleColorPreset(presetId: string = 'black'): CircleColorPreset {
  // Find the selected color preset or use default
  const preset = circleColorPresets.find(preset => preset.id === presetId) || circleColorPresets[0];
  
  console.log(`CIRCLE COLOR PRESET - ID: ${presetId}, Name: ${preset.name}, version: ${CIRCLE_COLORS_VERSION}`);
  
  return preset;
}

/**
 * Applies the set circle colors to the document root as CSS variables
 * @param preset The circle color preset to apply
 */
export function applyCircleColors(preset: CircleColorPreset): void {
  // Apply the circle colors as CSS variables
  document.documentElement.style.setProperty('--set-circle-border-color', preset.borderColor);
  document.documentElement.style.setProperty('--set-circle-active-bg-color', preset.activeBgColor);
  document.documentElement.style.setProperty('--set-circle-active-border-color', preset.activeBorderColor);
  document.documentElement.style.setProperty('--set-circle-inactive-bg-color', preset.inactiveBgColor);
  
  console.log(`CIRCLE COLORS APPLIED - Name: ${preset.name}, version: ${CIRCLE_COLORS_VERSION}`);
}
