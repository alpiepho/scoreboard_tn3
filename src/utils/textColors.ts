// Text color presets for team text and set circles

export interface TextColorPreset {
  id: string;
  name: string;
  color: string;
}

export const textColorPresets: TextColorPreset[] = [
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'yellow', name: 'Yellow', color: '#ffeb3b' },
  { id: 'blue', name: 'Blue', color: '#2196f3' },
  { id: 'red', name: 'Red', color: '#f44336' },
  { id: 'green', name: 'Green', color: '#4caf50' },
  { id: 'orange', name: 'Orange', color: '#ff9800' },
  { id: 'purple', name: 'Purple', color: '#9c27b0' },
  { id: 'teal', name: 'Teal', color: '#009688' }
];
