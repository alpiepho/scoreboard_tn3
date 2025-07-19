const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, pngPath, width, height) {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with a background color
    ctx.fillStyle = '#2A52BE';
    ctx.fillRect(0, 0, width, height);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${width / 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STN3', width / 2, height / 2);
    
    // Draw circle
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.75, width / 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Convert canvas to PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);
    console.log(`Created ${pngPath}`);
  } catch (error) {
    console.error(`Error converting SVG to PNG: ${error.message}`);
  }
}

// Create the icons
(async () => {
  await convertSvgToPng(
    path.join(__dirname, 'pwa-512x512.svg'),
    path.join(__dirname, 'pwa-512x512.png'),
    512, 
    512
  );
  
  await convertSvgToPng(
    path.join(__dirname, 'pwa-512x512.svg'),
    path.join(__dirname, 'pwa-192x192.png'),
    192, 
    192
  );
})();
