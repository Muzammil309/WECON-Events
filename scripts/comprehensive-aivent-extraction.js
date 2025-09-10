/**
 * Comprehensive AIvent Asset Extraction Script
 * Downloads ALL assets from the original AIvent website and uploads to Supabase
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Asset categories and their expected patterns
const ASSET_PATTERNS = {
  images: {
    backgrounds: [
      'images/backgrounds/1.webp',
      'images/backgrounds/2.webp',
      'images/backgrounds/3.webp',
      'images/backgrounds/4.webp',
      'images/backgrounds/5.webp',
      'images/backgrounds/6.webp',
      'images/backgrounds/7.webp',
      'images/backgrounds/8.webp'
    ],
    speakers: [
      'images/speakers/1.webp',
      'images/speakers/2.webp',
      'images/speakers/3.webp',
      'images/speakers/4.webp',
      'images/speakers/5.webp',
      'images/speakers/6.webp',
      'images/speakers/7.webp',
      'images/speakers/8.webp',
      'images/speakers/9.webp',
      'images/speakers/10.webp',
      'images/speakers/11.webp',
      'images/speakers/12.webp',
      'images/speakers/13.webp',
      'images/speakers/14.webp',
      'images/speakers/15.webp',
      'images/speakers/16.webp',
      'images/speakers/17.webp',
      'images/speakers/18.webp',
      'images/speakers/19.webp',
      'images/speakers/20.webp'
    ],
    icons: [
      'images/icons/1.webp',
      'images/icons/2.webp',
      'images/icons/3.webp',
      'images/icons/4.webp',
      'images/icons/5.webp',
      'images/icons/6.webp',
      'images/icons/7.webp',
      'images/icons/8.webp',
      'images/icons/9.webp',
      'images/icons/10.webp',
      'images/icons/11.webp',
      'images/icons/12.webp'
    ],
    logos: [
      'images/logo.webp',
      'images/logo-big.webp',
      'images/logo-big-white.webp',
      'images/logo-white.webp',
      'images/logo-light.webp',
      'images/logo-dark.webp'
    ],
    ui: [
      'images/arrow-down.png',
      'images/arrow-up.png',
      'images/arrow-down-light.png',
      'images/arrow-up-light.png',
      'images/arrow-right-white.svg',
      'images/arrow-top-right-white.svg',
      'images/misc/barcode.webp',
      'images/c1.webp',
      'images/s1.webp',
      'images/s2.webp',
      'images/s3.webp',
      'images/s4.webp',
      'images/s5.webp',
      'images/s6.webp',
      'images/s7.webp',
      'images/s8.webp',
      'images/s9.webp',
      'images/l1.webp',
      'images/l2.webp',
      'images/l3.webp',
      'images/l4.webp',
      'images/l5.webp',
      'images/homepage-1.webp',
      'images/homepage-2.webp',
      'images/homepage-3.webp',
      'images/homepage-4.webp',
      'images/homepage-5.webp'
    ]
  },
  videos: [
    'video/1.mp4',
    'video/2.mp4',
    'video/3.mp4',
    'video/hero-bg.mp4',
    'video/background.mp4'
  ],
  styles: [
    'css/bootstrap.min.css',
    'css/vendors.css',
    'css/style.css',
    'css/scheme-01.css',
    'css/scheme-02.css',
    'css/scheme-03.css',
    'css/scheme-04.css',
    'css/scheme-05.css'
  ],
  scripts: [
    'js/vendors.js',
    'js/designesia.js',
    'js/countdown-custom.js',
    'js/custom-marquee.js',
    'js/custom-swiper.js',
    'js/custom-carousel.js'
  ],
  fonts: [
    'fonts/fontawesome4/css/font-awesome.css',
    'fonts/fontawesome6/css/fontawesome.css',
    'fonts/fontawesome6/css/brands.css',
    'fonts/fontawesome6/css/solid.css',
    'fonts/elegant_font/HTML_CSS/style.css',
    'fonts/et-line-font/style.css',
    'fonts/icofont/icofont.min.css',
    'fonts/fontawesome4/fonts/fontawesome-webfont.woff2',
    'fonts/fontawesome6/webfonts/fa-solid-900.woff2',
    'fonts/fontawesome6/webfonts/fa-brands-400.woff2',
    'fonts/fontawesome6/webfonts/fa-regular-400.woff2'
  ]
};

const BASE_URL = 'https://madebydesignesia.com/themes/aivent/';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/aivent-complete');

class AIventAssetExtractor {
  constructor() {
    this.downloadedAssets = [];
    this.failedAssets = [];
    this.totalAssets = 0;
    this.downloadedCount = 0;
  }

  async extractAllAssets() {
    console.log('🚀 Starting comprehensive AIvent asset extraction...\n');

    // Ensure output directory exists
    this.ensureDirectoryExists(OUTPUT_DIR);

    // Count total assets
    this.totalAssets = this.countTotalAssets();
    console.log(`📊 Total assets to download: ${this.totalAssets}\n`);

    // Download all asset categories
    await this.downloadImageAssets();
    await this.downloadVideoAssets();
    await this.downloadStyleAssets();
    await this.downloadScriptAssets();
    await this.downloadFontAssets();

    // Generate comprehensive manifest
    await this.generateManifest();

    // Print summary
    this.printSummary();
  }

  countTotalAssets() {
    let total = 0;
    
    // Count images
    Object.values(ASSET_PATTERNS.images).forEach(category => {
      total += category.length;
    });
    
    // Count other assets
    total += ASSET_PATTERNS.videos.length;
    total += ASSET_PATTERNS.styles.length;
    total += ASSET_PATTERNS.scripts.length;
    total += ASSET_PATTERNS.fonts.length;
    
    return total;
  }

  async downloadImageAssets() {
    console.log('🖼️  Downloading image assets...');
    
    for (const [category, assets] of Object.entries(ASSET_PATTERNS.images)) {
      console.log(`  📁 Category: ${category}`);
      
      const categoryDir = path.join(OUTPUT_DIR, 'images', category);
      this.ensureDirectoryExists(categoryDir);
      
      for (const asset of assets) {
        await this.downloadAsset(asset, 'image', category);
      }
    }
  }

  async downloadVideoAssets() {
    console.log('\n🎥 Downloading video assets...');
    
    const videoDir = path.join(OUTPUT_DIR, 'video');
    this.ensureDirectoryExists(videoDir);
    
    for (const asset of ASSET_PATTERNS.videos) {
      await this.downloadAsset(asset, 'video', 'video');
    }
  }

  async downloadStyleAssets() {
    console.log('\n🎨 Downloading CSS assets...');
    
    const cssDir = path.join(OUTPUT_DIR, 'css');
    this.ensureDirectoryExists(cssDir);
    
    for (const asset of ASSET_PATTERNS.styles) {
      await this.downloadAsset(asset, 'css', 'style');
    }
  }

  async downloadScriptAssets() {
    console.log('\n📜 Downloading JavaScript assets...');
    
    const jsDir = path.join(OUTPUT_DIR, 'js');
    this.ensureDirectoryExists(jsDir);
    
    for (const asset of ASSET_PATTERNS.scripts) {
      await this.downloadAsset(asset, 'js', 'script');
    }
  }

  async downloadFontAssets() {
    console.log('\n🔤 Downloading font assets...');
    
    const fontDir = path.join(OUTPUT_DIR, 'fonts');
    this.ensureDirectoryExists(fontDir);
    
    for (const asset of ASSET_PATTERNS.fonts) {
      await this.downloadAsset(asset, 'font', 'font');
    }
  }

  async downloadAsset(assetPath, type, category) {
    const url = BASE_URL + assetPath;
    const fileName = path.basename(assetPath);
    const outputPath = path.join(OUTPUT_DIR, assetPath);
    
    // Ensure directory exists
    this.ensureDirectoryExists(path.dirname(outputPath));
    
    try {
      console.log(`  ⬇️  ${fileName}`);
      
      await this.downloadFile(url, outputPath);
      
      this.downloadedAssets.push({
        name: fileName,
        path: assetPath,
        url: url,
        localPath: outputPath,
        type: type,
        category: category,
        size: this.getFileSize(outputPath),
        downloadedAt: new Date().toISOString()
      });
      
      this.downloadedCount++;
      
      // Progress indicator
      const progress = ((this.downloadedCount / this.totalAssets) * 100).toFixed(1);
      console.log(`    ✅ Downloaded (${progress}% complete)`);
      
    } catch (error) {
      console.log(`    ❌ Failed: ${error.message}`);
      
      this.failedAssets.push({
        name: fileName,
        path: assetPath,
        url: url,
        type: type,
        category: category,
        error: error.message,
        attemptedAt: new Date().toISOString()
      });
    }
  }

  downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const request = protocol.get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(outputPath);
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
          
          fileStream.on('error', (error) => {
            fs.unlink(outputPath, () => {}); // Delete partial file
            reject(error);
          });
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
      
      request.on('error', (error) => {
        reject(error);
      });
      
      request.setTimeout(30000, () => {
        request.abort();
        reject(new Error('Download timeout'));
      });
    });
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  async generateManifest() {
    const manifest = {
      extractionInfo: {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        totalAssets: this.totalAssets,
        downloadedCount: this.downloadedCount,
        failedCount: this.failedAssets.length,
        successRate: ((this.downloadedCount / this.totalAssets) * 100).toFixed(2) + '%'
      },
      downloadedAssets: this.downloadedAssets,
      failedAssets: this.failedAssets,
      assetsByCategory: this.groupAssetsByCategory(),
      assetsByType: this.groupAssetsByType()
    };

    const manifestPath = path.join(OUTPUT_DIR, 'aivent-complete-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`\n📋 Manifest generated: ${manifestPath}`);
  }

  groupAssetsByCategory() {
    const grouped = {};
    this.downloadedAssets.forEach(asset => {
      if (!grouped[asset.category]) {
        grouped[asset.category] = [];
      }
      grouped[asset.category].push(asset);
    });
    return grouped;
  }

  groupAssetsByType() {
    const grouped = {};
    this.downloadedAssets.forEach(asset => {
      if (!grouped[asset.type]) {
        grouped[asset.type] = [];
      }
      grouped[asset.type].push(asset);
    });
    return grouped;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 AIVENT ASSET EXTRACTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully downloaded: ${this.downloadedCount}/${this.totalAssets} assets`);
    console.log(`❌ Failed downloads: ${this.failedAssets.length}`);
    console.log(`📈 Success rate: ${((this.downloadedCount / this.totalAssets) * 100).toFixed(2)}%`);
    
    if (this.failedAssets.length > 0) {
      console.log('\n❌ Failed assets:');
      this.failedAssets.forEach(asset => {
        console.log(`  - ${asset.name}: ${asset.error}`);
      });
    }
    
    console.log(`\n📁 Assets saved to: ${OUTPUT_DIR}`);
    console.log('🎯 Ready for Supabase upload and integration!');
  }
}

// Run the extraction
async function main() {
  const extractor = new AIventAssetExtractor();
  await extractor.extractAllAssets();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AIventAssetExtractor;
