# ScoresTN3

This is a TypeScript PWA version of ScoresTN2, a Flutter-based scoreboard application.

## Features

- Progressive Web App (PWA) that can be installed on any device
- Scoreboard functionality for sports events
- Score incrementation controls with long-press support
- Timer functionality (count up or down)
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

- Use the "+" and "-" buttons to adjust scores
- Long-press the buttons for continuous score incrementation/decrementation
- Use the timer controls to start, pause, and reset the timer
- Navigate to Settings to customize the application

### Settings

- Customize team names
- Set initial scores
- Configure timer duration and direction
- Choose between light and dark themes
- Enable/disable vibration on button press

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
