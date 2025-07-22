// Font-specific configurations for score display

export interface FontConfig {
  fontFamily: string;   // Font family value (matches the value in fontFamilies)
  scoreSize: {
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
    scoreSize: {
      portrait: 'clamp(30rem, 105vw, 75rem)',  // Default sizing
      landscape: 'clamp(32rem, 72vh, 64rem)'   // Default sizing
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
    fontFamily: 'Lato',
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
  }
];

// Function to get configuration for a specific font
export function getFontConfig(fontFamily: string): FontConfig {
  const config = fontConfigs.find(config => config.fontFamily === fontFamily);
  return config || fontConfigs[0]; // Return default config if not found
}
