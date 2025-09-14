const fs = require('fs');
const path = require('path');

// Source and destination paths
const SOURCE_DIR = 'aivent-ai-event-conference-meetup-webtemplate-2025-08-22-14-52-11-utc/AIvent/AIvent HTML';
const DEST_DIR = 'public/assets';

// Create destination directories
const createDirectories = () => {
  const dirs = [
    `${DEST_DIR}/images/background`,
    `${DEST_DIR}/images/demo`,
    `${DEST_DIR}/images/logo-light`,
    `${DEST_DIR}/images/misc`,
    `${DEST_DIR}/images/news`,
    `${DEST_DIR}/images/slider`,
    `${DEST_DIR}/images/team`,
    `${DEST_DIR}/images/ui`,
    `${DEST_DIR}/videos`,
    `${DEST_DIR}/css`,
    `${DEST_DIR}/js`,
    `${DEST_DIR}/fonts`
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Copy file function
const copyFile = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${src} -> ${dest}`);
      return true;
    } else {
      console.log(`Source file not found: ${src}`);
      return false;
    }
  } catch (error) {
    console.error(`Error copying ${src}:`, error.message);
    return false;
  }
};

// Copy directory recursively
const copyDirectory = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`Source directory not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
};

// Main extraction function
const extractAssets = () => {
  console.log('🚀 Starting Official AIvent Asset Extraction...');
  
  // Create directories
  createDirectories();
  
  // Copy all images
  console.log('\n📸 Copying Images...');
  copyDirectory(`${SOURCE_DIR}/images`, `${DEST_DIR}/images`);
  
  // Copy videos
  console.log('\n🎥 Copying Videos...');
  copyDirectory(`${SOURCE_DIR}/video`, `${DEST_DIR}/videos`);
  
  // Copy CSS files
  console.log('\n🎨 Copying CSS...');
  copyDirectory(`${SOURCE_DIR}/css`, `${DEST_DIR}/css`);
  
  // Copy JavaScript files
  console.log('\n⚡ Copying JavaScript...');
  copyDirectory(`${SOURCE_DIR}/js`, `${DEST_DIR}/js`);
  
  // Copy fonts
  console.log('\n🔤 Copying Fonts...');
  copyDirectory(`${SOURCE_DIR}/fonts`, `${DEST_DIR}/fonts`);
  
  // Copy main logo and icon
  console.log('\n🏷️ Copying Main Assets...');
  copyFile(`${SOURCE_DIR}/images/logo.webp`, `${DEST_DIR}/logo.webp`);
  copyFile(`${SOURCE_DIR}/images/icon.webp`, `${DEST_DIR}/icon.webp`);
  copyFile(`${SOURCE_DIR}/images/logo-big-white.webp`, `${DEST_DIR}/logo-big-white.webp`);
  
  console.log('\n✅ Asset extraction completed!');
  console.log('\n📋 Summary:');
  console.log('- All images copied to public/assets/images/');
  console.log('- All videos copied to public/assets/videos/');
  console.log('- All CSS files copied to public/assets/css/');
  console.log('- All JavaScript files copied to public/assets/js/');
  console.log('- All fonts copied to public/assets/fonts/');
};

// Run the extraction
extractAssets();
