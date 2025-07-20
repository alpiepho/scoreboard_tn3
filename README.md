# ScoresTN3

This is a TypeScript PWA version of ScoresTN2, a Flutter-based scoreboard application.

## Features

- Progressive Web App (PWA) that can be installed on any device
- Scoreboard functionality for sports events
- Score incrementation with tap and long-press auto-decrement
- Sets tracking with customizable number of sets (3 or 5)
- Score warning at multiples of 7 (optional)
- Settings page with customizable options
- Responsive design for various screen sizes
- Built with TypeScript and React

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Main application pages (Scoreboard, Settings)
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions
- `src/assets`: Static assets like images and icons

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Scoreboard

- Tap score buttons to increment scores
- Long-press score buttons to auto-decrement scores
- Use set indicators on the sides to track sets:
  - Tap "+" to add a set
  - Tap "-" to clear sets
  - Tap individual circles to toggle sets up to that point
- Access Settings via the gear icon

### Settings

- Customize team names
- Enable/disable score warning at multiples of 7
- Choose between 3 or 5 maximum sets
- Toggle sets visibility
- Toggle vibration on button press
- Switch between light and dark themes
- Reset scores only (preserves sets)
- Reset both scores and sets
- Reset all settings to defaults

## PWA Features

- Installable on mobile and desktop devices
- Works offline
- Automatic updates when new versions are available

## Deployment

This application can be deployed to GitHub Pages. After building, the contents of the `dist` folder can be served from any static hosting service.

For GitHub Pages deployment, you can add this to your package.json:

```json
"scripts": {
  "deploy": "gh-pages -d dist"
},
"devDependencies": {
  "gh-pages": "^5.0.0"
}
```

Then run:

```bash
npm run deploy
```

## Original Reference

- [ScoresTN2 on GitHub](https://github.com/alpiepho/scoreboard_tn2)

## License

This project is licensed under the MIT License.
