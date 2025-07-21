// Script to copy and convert icons from ScoreboardTN2 to ScoresTN3
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the higher quality 1024.png image instead of favicon.png
const sourcePath = '/Users/alpiepho/Projects/flutter/scoreboard_tn2/icons/1024.png';
const targetDir = '/Users/alpiepho/Projects/scoretn/scoreboard_tn3/ScoresTN3/public';
const targetIconsDir = path.join(targetDir, 'icons');

// Ensure the target directories exist
if (!fs.existsSync(targetIconsDir)) {
  fs.mkdirSync(targetIconsDir, { recursive: true });
}

// Copy the original favicon
fs.copyFileSync(sourcePath, path.join(targetIconsDir, 'favicon.png'));

// Define the icon sizes needed for PWA
const iconSizes = [
  48, 72, 96, 128, 192, 256, 384, 512
];

// Generate PWA icons
async function generateIcons() {
  try {
    const sourceBuffer = fs.readFileSync(sourcePath);
    
    // Create PWA icons in different sizes with high quality settings
    for (const size of iconSizes) {
      await sharp(sourceBuffer)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3, // Use high quality resampling
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({ quality: 100 }) // Use maximum quality for PNG
        .toFile(path.join(targetIconsDir, `icon-${size}x${size}.png`));
      
      console.log(`Created icon-${size}x${size}.png`);
    }
    
    // Create main PWA icons in the public folder with high quality
    await sharp(sourceBuffer)
      .resize(192, 192, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(path.join(targetDir, 'pwa-192x192.png'));
    
    await sharp(sourceBuffer)
      .resize(512, 512, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(path.join(targetDir, 'pwa-512x512.png'));
    
    // Also create a high-quality favicon.ico
    await sharp(sourceBuffer)
      .resize(32, 32, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(path.join(targetDir, 'favicon.ico'));
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
