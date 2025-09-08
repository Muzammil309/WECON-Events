const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Download a single file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    ensureDir(dir);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
          resolve(outputPath);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(outputPath);
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

// Key AIvent assets to download
const assets = [
  // Background images
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/background/1.webp',
    path: 'public/assets/aivent/images/backgrounds/bg-1.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/background/2.webp',
    path: 'public/assets/aivent/images/backgrounds/bg-2.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/background/3.webp',
    path: 'public/assets/aivent/images/backgrounds/bg-3.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/background/4.webp',
    path: 'public/assets/aivent/images/backgrounds/bg-4.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/background/5.webp',
    path: 'public/assets/aivent/images/backgrounds/bg-5.webp'
  },
  
  // Speaker photos
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/1.webp',
    path: 'public/assets/aivent/images/speakers/speaker-1.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/2.webp',
    path: 'public/assets/aivent/images/speakers/speaker-2.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/3.webp',
    path: 'public/assets/aivent/images/speakers/speaker-3.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/4.webp',
    path: 'public/assets/aivent/images/speakers/speaker-4.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/5.webp',
    path: 'public/assets/aivent/images/speakers/speaker-5.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/team/6.webp',
    path: 'public/assets/aivent/images/speakers/speaker-6.webp'
  },
  
  // Logos and icons
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/logo.png',
    path: 'public/assets/aivent/images/logo.png'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/logo-light.png',
    path: 'public/assets/aivent/images/logo-light.png'
  },
  
  // Miscellaneous elements
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/misc/l1.webp',
    path: 'public/assets/aivent/images/misc/l1.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/misc/l2.webp',
    path: 'public/assets/aivent/images/misc/l2.webp'
  },
  {
    url: 'https://madebydesignesia.com/themes/aivent/images/misc/l3.webp',
    path: 'public/assets/aivent/images/misc/l3.webp'
  }
];

// Download all assets
async function downloadAllAssets() {
  console.log('🚀 Starting AIvent asset download...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const asset of assets) {
    try {
      await downloadFile(asset.url, asset.path);
      success++;
    } catch (error) {
      console.warn(`✗ Failed: ${path.basename(asset.path)} - ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`✓ Successfully downloaded: ${success} files`);
  console.log(`✗ Failed downloads: ${failed} files`);
  console.log('\n🎉 Asset download complete!');
}

// Run the download
downloadAllAssets().catch(console.error);
