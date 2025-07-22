// Font options for the scoreboard
export const fontFamilies = [
  { value: 'Default', label: 'Default: ex. 0123456789', cssFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif', className: '' },
  { value: 'Lato', label: 'Lato: ex. 0123456789', cssFamily: '"Lato", sans-serif', className: 'font-lato' },
  { value: 'Merriweather', label: 'Merriweather: ex. 0123456789', cssFamily: '"Merriweather", serif', className: 'font-merriweather' },
  { value: 'Montserrat', label: 'Montserrat: ex. 0123456789', cssFamily: '"Montserrat", sans-serif', className: 'font-montserrat' },
  { value: 'OpenSans', label: 'OpenSans: ex. 0123456789', cssFamily: '"Open Sans", sans-serif', className: 'font-opensans' },
  { value: 'RobotoMono', label: 'RobotoMono: ex. 0123456789', cssFamily: '"Roboto Mono", monospace', className: 'font-robotomono' },
  { value: 'RockSalt', label: 'RockSalt: ex. 0123456789', cssFamily: '"Rock Salt", cursive', className: 'font-rocksalt' },
  { value: 'SpaceMono', label: 'SpaceMono: ex. 0123456789', cssFamily: '"Space Mono", monospace', className: 'font-spacemono' },
  { value: 'LeagueSpartan', label: 'League Spartan: ex. 0123456789', cssFamily: '"League Spartan", sans-serif', className: 'font-league-spartan' },
];

// Get CSS font-family string from our font option
export function getFontFamilyString(fontFamily: string): string {
  const font = fontFamilies.find(f => f.value === fontFamily);
  return font ? font.cssFamily : fontFamilies[0].cssFamily;
}
