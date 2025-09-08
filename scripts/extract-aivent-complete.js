const fs = require('fs');
const path = require('path');
const https = require('https');

// Comprehensive AIvent asset extraction
const assetUrls = {
  // Background images and textures
  backgrounds: [
    'https://madebydesignesia.com/themes/aivent/images/background/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/2.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/3.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/4.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/5.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/6.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/7.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/8.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/9.webp',
    'https://madebydesignesia.com/themes/aivent/images/background/10.webp'
  ],
  
  // Speaker photos - exact from reference
  speakers: [
    'https://madebydesignesia.com/themes/aivent/images/team/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/2.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/3.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/4.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/5.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/6.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/7.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/8.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/9.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/10.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/11.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/12.webp'
  ],
  
  // Logos and branding
  logos: [
    'https://madebydesignesia.com/themes/aivent/images/logo.png',
    'https://madebydesignesia.com/themes/aivent/images/logo-light.png',
    'https://madebydesignesia.com/themes/aivent/images/logo-2.png'
  ],
  
  // Miscellaneous graphics and elements
  misc: [
    'https://madebydesignesia.com/themes/aivent/images/misc/l1.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l2.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l3.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l4.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l5.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l6.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/arrow-right.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/circle.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/gradient.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/pattern-1.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/pattern-2.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/dots.png'
  ],
  
  // CSS files for exact styling reference
  styles: [
    'https://madebydesignesia.com/themes/aivent/css/style.css',
    'https://madebydesignesia.com/themes/aivent/css/coloring.css',
    'https://madebydesignesia.com/themes/aivent/css/colors/scheme-01.css',
    'https://madebydesignesia.com/themes/aivent/css/bootstrap.css'
  ],
  
  // JavaScript files for animations
  scripts: [
    'https://madebydesignesia.com/themes/aivent/js/plugins.js',
    'https://madebydesignesia.com/themes/aivent/js/designesia.js'
  ]
};

// Create directory structure
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Download file with retry logic
function downloadFile(url, outputPath, retries = 3) {
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
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(outputPath);
        downloadFile(response.headers.location, outputPath, retries).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        if (retries > 0) {
          console.log(`⚠️ Retrying: ${path.basename(outputPath)} (${retries} attempts left)`);
          setTimeout(() => {
            downloadFile(url, outputPath, retries - 1).then(resolve).catch(reject);
          }, 1000);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        }
      }
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      if (retries > 0) {
        console.log(`⚠️ Retrying: ${path.basename(outputPath)} (${retries} attempts left)`);
        setTimeout(() => {
          downloadFile(url, outputPath, retries - 1).then(resolve).catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });
  });
}

// Download all assets in a category
async function downloadCategory(categoryName, urls, outputDir) {
  console.log(`\n🚀 Downloading ${categoryName}...`);
  const results = { success: 0, failed: 0, errors: [] };
  
  for (const url of urls) {
    try {
      const filename = path.basename(new URL(url).pathname);
      const outputPath = path.join(outputDir, filename);
      await downloadFile(url, outputPath);
      results.success++;
    } catch (error) {
      console.error(`❌ Failed: ${path.basename(url)} - ${error.message}`);
      results.failed++;
      results.errors.push({ url, error: error.message });
    }
  }
  
  console.log(`📊 ${categoryName}: ${results.success} success, ${results.failed} failed`);
  return results;
}

// Main extraction function
async function extractAllAssets() {
  console.log('🎯 Starting comprehensive AIvent asset extraction...\n');
  
  const baseDir = 'public/assets/aivent';
  const totalResults = { success: 0, failed: 0, errors: [] };
  
  // Create base directory
  ensureDir(baseDir);
  
  // Download each category
  for (const [category, urls] of Object.entries(assetUrls)) {
    const outputDir = path.join(baseDir, category);
    const results = await downloadCategory(category, urls, outputDir);
    totalResults.success += results.success;
    totalResults.failed += results.failed;
    totalResults.errors.push(...results.errors);
  }
  
  // Generate asset manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    totalAssets: totalResults.success + totalResults.failed,
    successfulDownloads: totalResults.success,
    failedDownloads: totalResults.failed,
    categories: Object.keys(assetUrls),
    errors: totalResults.errors
  };
  
  fs.writeFileSync(
    path.join(baseDir, 'asset-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\n📋 EXTRACTION SUMMARY:');
  console.log(`✅ Successfully downloaded: ${totalResults.success} files`);
  console.log(`❌ Failed downloads: ${totalResults.failed} files`);
  console.log(`📄 Asset manifest created: ${baseDir}/asset-manifest.json`);
  
  if (totalResults.errors.length > 0) {
    console.log('\n⚠️ Failed downloads:');
    totalResults.errors.forEach(({ url, error }) => {
      console.log(`  - ${path.basename(url)}: ${error}`);
    });
  }
  
  console.log('\n🎉 Asset extraction complete!');
  console.log(`📁 Assets saved to: ${baseDir}/`);
}

// Run extraction
extractAllAssets().catch(console.error);
