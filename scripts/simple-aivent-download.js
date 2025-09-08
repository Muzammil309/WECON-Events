const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Download file function
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    ensureDir(dir);
    
    const file = fs.createWriteStream(outputPath);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
          resolve(outputPath);
        });
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

// Main function
async function downloadAssets() {
  console.log('🎯 Starting AIvent asset download...\n');
  
  const baseDir = 'public/assets/aivent';
  
  // Key assets to download
  const assets = [
    // Background images
    'https://madebydesignesia.com/themes/aivent/images/background/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/2.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/3.webp',
    
    // Speaker photos
    'https://madebydesignesia.com/themes/aivent/images/team/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/2.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/3.webp',
    
    // Logo
    'https://madebydesignesia.com/themes/aivent/images/logo.png',
    'https://madebydesignesia.com/themes/aivent/images/logo-light.png'
  ];
  
  let success = 0;
  let failed = 0;
  
  for (const url of assets) {
    try {
      const filename = path.basename(new URL(url).pathname);
      const category = url.includes('/team/') ? 'speakers' : 
                     url.includes('/background/') ? 'backgrounds' : 'logos';
      const outputPath = path.join(baseDir, category, filename);
      
      await downloadFile(url, outputPath);
      success++;
    } catch (error) {
      console.error(`❌ Failed: ${path.basename(url)} - ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Summary: ${success} success, ${failed} failed`);
  console.log(`📁 Assets saved to: ${baseDir}/`);
}

downloadAssets().catch(console.error);
