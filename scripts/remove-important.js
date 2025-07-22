// Script to remove  declarations from CSS files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to remove  from CSS file
function removeImportant(filePath) {
  try {
    // Read the file
    const css = fs.readFileSync(filePath, 'utf8');
    
    // Replace  with empty string
    const updatedCss = css.replace(/\s*\s*/g, '');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedCss);
    
    console.log(`Successfully removed  declarations from ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// CSS files to process
const cssFiles = [
  path.join(__dirname, '..', 'src/pages/Scoreboard.css'),
  path.join(__dirname, '..', 'src/pages/ScoreboardTheme.css'),
  path.join(__dirname, '..', 'src/App.css')
];

// Process each file
let success = true;
for (const file of cssFiles) {
  if (!removeImportant(file)) {
    success = false;
  }
}

// Exit with appropriate code
process.exit(success ? 0 : 1);
