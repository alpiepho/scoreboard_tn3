// Font-specific configurations for score display

// Version tracking to force updates in development
export const CONFIG_VERSION = Date.now(); // This will change every time the file is saved

// Base font sizes (without multipliers)
const baseSizes = {
  portrait: 'clamp(30rem, 105vw, 75rem)',
  landscape: 'clamp(32rem, 72vh, 64rem)'
};

export interface FontConfig {
  fontFamily: string;   // Font family value (matches the value in fontFamilies)
  multiplier: {         // Size multipliers for the font (1.0 = standard size)
    portrait: number;   // Multiplier for portrait mode
    landscape: number;  // Multiplier for landscape mode
  };
  scoreSize?: {         // Optional direct size override (if not using multiplier)
    portrait: string;   // clamp value for portrait mode
    landscape: string;  // clamp value for landscape mode
  };
  scorePadding: {
    portrait: string;   // padding value for portrait mode
    landscape: string;  // padding value for landscape mode
  };
  fontWeight: number;   // Font weight (400 = normal, 700 = bold, etc.)
  lineHeight: number;   // Line height as a multiplier (0.8, 1.0, etc.)
  letterSpacing: string; // Letter spacing (normal, -0.05em, etc.)
}

// Configuration for each font
export const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Default',
    multiplier: {
      portrait: 0.5,
      landscape: 0.5
    },
    // Remove scoreSize to let the multiplier be applied to the base sizes
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.8,
    letterSpacing: 'normal'
  },
  {
    fontFamily: 'Lato',
    multiplier: {
      portrait: 0.5,
      landscape: 0.5
    },
    scoreSize: {
      portrait: 'clamp(30rem, 105vw, 75rem)',  // Same as default, Lato is well-proportioned
      landscape: 'clamp(32rem, 72vh, 64rem)'
    },
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.8,
    letterSpacing: 'normal'
  },
  {
    fontFamily: 'Merriweather',
    multiplier: {
      portrait: 0.5,  // Slightly smaller than default in portrait
      landscape: 0.5  // Slightly smaller than default in landscape
    },
    scoreSize: {
      portrait: 'clamp(28rem, 100vw, 70rem)',  // Slightly smaller, Merriweather is wider
      landscape: 'clamp(30rem, 68vh, 60rem)'
    },
    scorePadding: {
      portrait: '0 0 0.1em 0',                 // Slight bottom padding for serif fonts
      landscape: '0 0 0.1em 0'
    },
    fontWeight: 700,
    lineHeight: 0.85,                          // Slightly taller line height for serif
    letterSpacing: 'normal'
  },
  {
    fontFamily: 'Montserrat',
    multiplier: {
      portrait: 0.6,
      landscape: 0.6
    },
    scoreSize: {
      portrait: 'clamp(30rem, 105vw, 75rem)',  // Standard sizing
      landscape: 'clamp(32rem, 72vh, 64rem)'
    },
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.8,
    letterSpacing: 'normal'
  },
  {
    fontFamily: 'OpenSans',
    multiplier: {
      portrait: 0.6,
      landscape: 0.6
    },
    scoreSize: {
      portrait: 'clamp(30rem, 105vw, 75rem)',  // Standard sizing
      landscape: 'clamp(32rem, 72vh, 64rem)'
    },
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.8,
    letterSpacing: 'normal'
  },
  {
    fontFamily: 'RobotoMono',
    multiplier: {
      portrait: 0.6,  // Smaller than default in portrait
      landscape: 0.6  // Smaller than default in landscape
    },
    scoreSize: {
      portrait: 'clamp(26rem, 95vw, 65rem)',   // Smaller size for monospace font
      landscape: 'clamp(28rem, 65vh, 58rem)'
    },
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.85,                          // Slightly taller for monospace
    letterSpacing: '-0.05em'                   // Tighter tracking for monospace
  },
  {
    fontFamily: 'RockSalt',
    multiplier: {
      portrait: 0.4,  // Much smaller than default in portrait
      landscape: 0.4  // Much smaller than default in landscape
    },
    scoreSize: {
      portrait: 'clamp(22rem, 80vw, 55rem)',   // Much smaller size for decorative font
      landscape: 'clamp(24rem, 55vh, 48rem)'
    },
    scorePadding: {
      portrait: '0.1em 0 0.1em 0',             // More padding for better readability
      landscape: '0.1em 0 0.1em 0'
    },
    fontWeight: 400,                           // Rock Salt only comes in 400 weight
    lineHeight: 1.0,                           // Taller line height for this decorative font
    letterSpacing: '0.02em'                    // Slightly wider tracking
  },
  {
    fontFamily: 'SpaceMono',
    multiplier: {
      portrait: 0.6,  // Smaller than default in portrait
      landscape: 0.6  // Smaller than default in landscape
    },
    scoreSize: {
      portrait: 'clamp(26rem, 95vw, 65rem)',   // Smaller size for monospace font
      landscape: 'clamp(28rem, 65vh, 58rem)'
    },
    scorePadding: {
      portrait: '0',
      landscape: '0'
    },
    fontWeight: 700,
    lineHeight: 0.85,                          // Slightly taller for monospace
    letterSpacing: '-0.05em'                   // Tighter tracking for monospace
  },
  {
    fontFamily: 'LeagueSpartan',
    multiplier: {
      portrait: 0.5, // Changed from 1.2 to 1.4 for testing
      landscape: 0.5 // Changed from 1.3 to 1.5 for testing
    },
    scoreSize: {
      portrait: 'clamp(30rem, 105vw, 75rem)',  // Standard sizing
      landscape: 'clamp(32rem, 72vh, 64rem)'
    },
    scorePadding: {
      portrait: '10px',
      landscape: '10px'
    },
    fontWeight: 700,
    lineHeight: 0.8,
    letterSpacing: 'normal'
  }
];

// Helper function to apply a multiplier to a clamp value
function applyMultiplier(clampValue: string, multiplier: number): string {
  // Parse the clamp function to extract the three values
  const match = clampValue.match(/clamp\((.*?),(.*?),(.*?)\)/);
  if (!match) return clampValue;
  
  const [, min, preferred, max] = match;
  
  // Extract numeric values and units
  const minMatch = min.trim().match(/^([\d.]+)(.*)$/);
  const preferredMatch = preferred.trim().match(/^([\d.]+)(.*)$/);
  const maxMatch = max.trim().match(/^([\d.]+)(.*)$/);
  
  if (!minMatch || !preferredMatch || !maxMatch) return clampValue;
  
  // Apply multiplier to numeric values
  const newMin = parseFloat(minMatch[1]) * multiplier;
  const newPreferred = parseFloat(preferredMatch[1]) * multiplier;
  const newMax = parseFloat(maxMatch[1]) * multiplier;
  
  // Reconstruct the clamp function with the new values
  return `clamp(${newMin}${minMatch[2]}, ${newPreferred}${preferredMatch[2]}, ${newMax}${maxMatch[2]})`;
}

// Function to get configuration for a specific font with multiplier applied
export function getFontConfig(fontFamily: string, sizeMultiplier: number = 1.0): FontConfig {
  // Find the base config for this font
  const baseConfig = fontConfigs.find(config => config.fontFamily === fontFamily) || fontConfigs[0];
  
  // Create a deep copy of the config to avoid modifying the original
  const config = JSON.parse(JSON.stringify(baseConfig));
  
  // Log the multipliers to check if changes are detected
  console.log(`FONT CONFIG LOOKUP - Font: ${fontFamily}, Portrait multiplier: ${config.multiplier.portrait}, Landscape multiplier: ${config.multiplier.landscape}, version: ${CONFIG_VERSION}`);
  
  // For testing, always use base sizes with the multiplier
  config.scoreSize = {
    portrait: applyMultiplier(baseSizes.portrait, sizeMultiplier * config.multiplier.portrait),
    landscape: applyMultiplier(baseSizes.landscape, sizeMultiplier * config.multiplier.landscape)
  };
  
  return config;
}
