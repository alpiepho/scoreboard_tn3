// Team color configurations for scoreboard display

// Version tracking to force updates in development
export const COLORS_CONFIG_VERSION = Date.now(); // This will change every time the file is saved

// Define available color presets for teams
export interface TeamColorPreset {
  id: string;           // Unique identifier for the preset
  name: string;         // Display name of the preset
  backgroundColor: string; // Background color (hex or CSS color)
  textColor: string;    // Text color for team name and score (hex or CSS color)
  textShadow: string;   // Optional text shadow for better contrast
}

// Define the complete team color configuration
export interface TeamColorConfig {
  home: TeamColorPreset;
  away: TeamColorPreset;
  swapTeamColors: boolean; // Whether colors should be swapped between teams
}

// List of predefined color presets
export const colorPresets: TeamColorPreset[] = [
  {
    id: 'blue',
    name: 'Blue',
    backgroundColor: '#2196f3', // Material Blue
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'red',
    name: 'Red',
    backgroundColor: '#f44336', // Material Red
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'green',
    name: 'Green',
    backgroundColor: '#4caf50', // Material Green
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'orange',
    name: 'Orange',
    backgroundColor: '#ff9800', // Material Orange
    textColor: '#ffffff', 
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'purple',
    name: 'Purple',
    backgroundColor: '#9c27b0', // Material Purple
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'teal',
    name: 'Teal',
    backgroundColor: '#009688', // Material Teal
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    backgroundColor: '#ffeb3b', // Material Yellow
    textColor: '#000000', // Black text for better contrast
    textShadow: '0 1px 3px rgba(255, 255, 255, 0.4)'
  },
  {
    id: 'black',
    name: 'Black',
    backgroundColor: '#212121', // Nearly black
    textColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  {
    id: 'white',
    name: 'White',
    backgroundColor: '#f5f5f5', // Nearly white
    textColor: '#000000',
    textShadow: '0 1px 3px rgba(255, 255, 255, 0.4)'
  }
];

// Default team color configuration
export const defaultTeamColors: TeamColorConfig = {
  home: colorPresets.find(preset => preset.id === 'blue')!,
  away: colorPresets.find(preset => preset.id === 'red')!,
  swapTeamColors: false
};

/**
 * Gets the current team color configuration, with support for swapping
 * @param homeColorId The ID of the home team color preset
 * @param awayColorId The ID of the away team color preset
 * @param swapped Whether colors should be swapped
 * @returns The final team color configuration
 */
export function getTeamColors(
  homeColorId: string = 'blue',
  awayColorId: string = 'red',
  swapped: boolean = false
): TeamColorConfig {
  // Find the selected color presets or use defaults
  const homePreset = colorPresets.find(preset => preset.id === homeColorId) || defaultTeamColors.home;
  const awayPreset = colorPresets.find(preset => preset.id === awayColorId) || defaultTeamColors.away;
  
  // Return the configuration with colors swapped if needed
  return {
    home: swapped ? awayPreset : homePreset,
    away: swapped ? homePreset : awayPreset,
    swapTeamColors: swapped
  };
}

/**
 * Applies the team colors to the document root as CSS variables
 * @param config The team color configuration to apply
 */
export function applyTeamColors(config: TeamColorConfig): void {
  // Apply home team colors
  document.documentElement.style.setProperty('--home-team-color', config.home.backgroundColor);
  document.documentElement.style.setProperty('--home-team-text-color', config.home.textColor);
  document.documentElement.style.setProperty('--home-team-text-shadow', config.home.textShadow);
  
  // Apply away team colors
  document.documentElement.style.setProperty('--away-team-color', config.away.backgroundColor);
  document.documentElement.style.setProperty('--away-team-text-color', config.away.textColor);
  document.documentElement.style.setProperty('--away-team-text-shadow', config.away.textShadow);
  
  console.log(`TEAM COLORS APPLIED - Home: ${config.home.name}, Away: ${config.away.name}, Swapped: ${config.swapTeamColors}, version: ${COLORS_CONFIG_VERSION}`);
}

/**
 * Applies the team text colors from settings to CSS variables for home and away teams
 * @param homeTextColor The text color for the home team
 * @param awayTextColor The text color for the away team
 */
export function applyTeamTextColors(homeTextColor: string, awayTextColor: string): void {
  console.log('Applying team text colors:', { homeTextColor, awayTextColor });
  document.documentElement.style.setProperty('--home-team-text-color', homeTextColor);
  document.documentElement.style.setProperty('--away-team-text-color', awayTextColor);
}
