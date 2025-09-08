/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Comprehensive list of AIvent assets to download
const assetCategories = {
  // CSS Files for reference
  css: [
    'https://madebydesignesia.com/themes/aivent/css/style.css',
    'https://madebydesignesia.com/themes/aivent/css/coloring.css',
    'https://madebydesignesia.com/themes/aivent/css/colors/scheme-01.css',
    'https://madebydesignesia.com/themes/aivent/css/bootstrap.css',
    'https://madebydesignesia.com/themes/aivent/css/animate.css'
  ],
  
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
  
  // Miscellaneous images and decorative elements
  misc: [
    'https://madebydesignesia.com/themes/aivent/images/misc/l1.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l2.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l3.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l4.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l5.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/l6.webp',
    'https://madebydesignesia.com/themes/aivent/images/misc/arrow-right.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/circle.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/gradient.png'
  ],
  
  // Speaker photos
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
  
  // Icons and logos
  icons: [
    'https://madebydesignesia.com/themes/aivent/images/logo.png',
    'https://madebydesignesia.com/themes/aivent/images/logo-light.png',
    'https://madebydesignesia.com/themes/aivent/images/logo-2.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/1.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/2.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/3.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/4.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/5.png',
    'https://madebydesignesia.com/themes/aivent/images/icon/6.png'
  ],
  
  // Additional decorative elements
  elements: [
    'https://madebydesignesia.com/themes/aivent/images/misc/pattern-1.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/pattern-2.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/dots.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/shape-1.png',
    'https://madebydesignesia.com/themes/aivent/images/misc/shape-2.png'
  ]
};

// Create directory structure
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
        // Handle redirects
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

// Get file extension from URL
function getFileExtension(url) {
  const pathname = new URL(url).pathname;
  return path.extname(pathname) || '.webp';
}

// Generate output path for asset
function getOutputPath(url, category) {
  const filename = path.basename(new URL(url).pathname);
  const extension = getFileExtension(url);
  const baseName = path.basename(filename, extension);
  
  const categoryPaths = {
    css: 'public/assets/aivent/css',
    backgrounds: 'public/assets/aivent/images/backgrounds',
    misc: 'public/assets/aivent/images/misc',
    speakers: 'public/assets/aivent/images/speakers',
    icons: 'public/assets/aivent/images/icons',
    elements: 'public/assets/aivent/images/elements'
  };
  
  return path.join(projectRoot, categoryPaths[category], filename);
}

// Download all assets in a category
async function downloadCategory(category, urls) {
  console.log(`\n📁 Downloading ${category} assets...`);
  const results = { success: 0, failed: 0, errors: [] };
  
  for (const url of urls) {
    try {
      const outputPath = getOutputPath(url, category);
      await downloadFile(url, outputPath);
      results.success++;
    } catch (error) {
      console.warn(`✗ Failed: ${path.basename(url)} - ${error.message}`);
      results.failed++;
      results.errors.push({ url, error: error.message });
    }
  }
  
  console.log(`${category}: ${results.success} success, ${results.failed} failed`);
  return results;
}

// Main download function
async function downloadAllAssets() {
  console.log('🚀 Starting comprehensive AIvent asset download...\n');
  
  const totalResults = { success: 0, failed: 0, errors: [] };
  
  // Create base directories
  ensureDir(path.join(projectRoot, 'public/assets/aivent'));
  
  // Download each category
  for (const [category, urls] of Object.entries(assetCategories)) {
    const results = await downloadCategory(category, urls);
    totalResults.success += results.success;
    totalResults.failed += results.failed;
    totalResults.errors.push(...results.errors);
  }
  
  // Summary
  console.log('\n📊 Download Summary:');
  console.log(`✓ Successfully downloaded: ${totalResults.success} files`);
  console.log(`✗ Failed downloads: ${totalResults.failed} files`);
  
  if (totalResults.errors.length > 0) {
    console.log('\n❌ Failed downloads:');
    totalResults.errors.forEach(({ url, error }) => {
      console.log(`  - ${path.basename(url)}: ${error}`);
    });
  }
  
  console.log('\n🎉 Asset download complete!');
  console.log('Assets organized in: public/assets/aivent/');
}

// Run the download
downloadAllAssets().catch(console.error);
