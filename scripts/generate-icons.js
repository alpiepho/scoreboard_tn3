import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateScoreboardIcon(pngPath, width, height) {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background gradient - blue to darker blue
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2A52BE');  // Medium blue
    gradient.addColorStop(1, '#1A3299');  // Darker blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw outer circle/border
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.4;
    
    // Add subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = width * 0.05;
    ctx.shadowOffsetX = width * 0.01;
    ctx.shadowOffsetY = width * 0.01;
    
    // Draw inner circle - white with opacity
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw score numbers
    ctx.fillStyle = '#FF4136';  // Red
    ctx.font = `bold ${width * 0.2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('11', centerX - radius * 0.4, centerY);
    
    ctx.fillStyle = '#2196F3';  // Blue
    ctx.fillText('9', centerX + radius * 0.4, centerY);
    
    // Draw app name
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${width * 0.14}px Arial`;
    ctx.fillText('STN3', centerX, centerY - radius * 0.6);
    
    // Convert canvas to PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);
    console.log(`Created ${pngPath}`);
  } catch (error) {
    console.error(`Error generating icon: ${error.message}`);
  }
}

// Create directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create the icons
(async () => {
  // Generate icons for various sizes
  await generateScoreboardIcon(
    path.join(publicDir, 'pwa-512x512.png'),
    512, 
    512
  );
  
  await generateScoreboardIcon(
    path.join(publicDir, 'pwa-192x192.png'),
    192, 
    192
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-512x512.png'),
    512, 
    512
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-384x384.png'),
    384, 
    384
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-256x256.png'),
    256, 
    256
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-192x192.png'),
    192, 
    192
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-128x128.png'),
    128, 
    128
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-96x96.png'),
    96, 
    96
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-72x72.png'),
    72, 
    72
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'icon-48x48.png'),
    48, 
    48
  );
  
  await generateScoreboardIcon(
    path.join(iconsDir, 'favicon.png'),
    32, 
    32
  );
})();
