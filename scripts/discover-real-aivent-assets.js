/**
 * Real AIvent Asset Discovery Script
 * Uses browser automation to discover actual asset URLs from the live website
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const AIVENT_URL = 'https://madebydesignesia.com/themes/aivent/index.html';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/aivent-real');

class RealAssetDiscoverer {
  constructor() {
    this.discoveredAssets = [];
    this.downloadedAssets = [];
    this.failedAssets = [];
    this.browser = null;
    this.page = null;
  }

  async discoverAndDownloadAssets() {
    console.log('🚀 Starting real AIvent asset discovery...\n');

    try {
      // Launch browser
      await this.launchBrowser();

      // Navigate to AIvent website
      await this.navigateToWebsite();

      // Discover all assets
      await this.discoverAssets();

      // Download discovered assets
      await this.downloadAssets();

      // Generate manifest
      await this.generateManifest();

      // Print summary
      this.printSummary();

    } finally {
      await this.closeBrowser();
    }
  }

  async launchBrowser() {
    console.log('🌐 Launching browser...');
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();

    // Set user agent to avoid blocking
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
  }

  async navigateToWebsite() {
    console.log('📍 Navigating to AIvent website...');
    try {
      await this.page.goto(AIVENT_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      console.log('✅ Page loaded successfully');

      // Wait a bit more for dynamic content
      await this.page.waitForTimeout(5000);
    } catch (error) {
      console.log('⚠️  Page load timeout, but continuing with available content...');
    }
  }

  async discoverAssets() {
    console.log('\n🔍 Discovering assets from the website...');

    // Get all network requests
    const requests = [];
    this.page.on('request', request => {
      requests.push(request.url());
    });

    // Scroll through the page to trigger lazy loading
    await this.scrollThroughPage();

    // Wait for additional resources to load
    await this.page.waitForTimeout(3000);

    // Analyze page for assets
    const pageAssets = await this.page.evaluate(() => {
      const assets = [];

      // Get all images
      document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.startsWith('data:')) {
          assets.push({
            type: 'image',
            url: img.src,
            element: 'img',
            alt: img.alt || '',
            className: img.className || ''
          });
        }
      });

      // Get background images from CSS
      document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/g);
          if (matches) {
            matches.forEach(match => {
              const url = match.replace(/url\(['"]?/, '').replace(/['"]?\)$/, '');
              if (!url.startsWith('data:')) {
                assets.push({
                  type: 'background',
                  url: url,
                  element: element.tagName.toLowerCase(),
                  className: element.className || ''
                });
              }
            });
          }
        }
      });

      // Get CSS files
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        assets.push({
          type: 'css',
          url: link.href,
          element: 'link'
        });
      });

      // Get JavaScript files
      document.querySelectorAll('script[src]').forEach(script => {
        assets.push({
          type: 'js',
          url: script.src,
          element: 'script'
        });
      });

      // Get video sources
      document.querySelectorAll('video source, video').forEach(video => {
        if (video.src) {
          assets.push({
            type: 'video',
            url: video.src,
            element: 'video'
          });
        }
      });

      return assets;
    });

    // Combine and deduplicate assets
    const allAssets = [...pageAssets, ...requests.map(url => ({ type: 'request', url }))];
    const uniqueAssets = this.deduplicateAssets(allAssets);
    
    // Filter for AIvent-related assets
    this.discoveredAssets = uniqueAssets.filter(asset => 
      asset.url.includes('madebydesignesia.com') || 
      asset.url.includes('aivent') ||
      this.isRelevantAsset(asset.url)
    );

    console.log(`✅ Discovered ${this.discoveredAssets.length} unique assets`);
    
    // Log asset types
    const assetTypes = {};
    this.discoveredAssets.forEach(asset => {
      const type = this.categorizeAsset(asset);
      assetTypes[type] = (assetTypes[type] || 0) + 1;
    });
    
    console.log('📊 Asset breakdown:');
    Object.entries(assetTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }

  async scrollThroughPage() {
    console.log('📜 Scrolling through page to trigger lazy loading...');
    
    const scrollHeight = await this.page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await this.page.evaluate(() => window.innerHeight);
    
    for (let i = 0; i < scrollHeight; i += viewportHeight) {
      await this.page.evaluate((y) => window.scrollTo(0, y), i);
      await this.page.waitForTimeout(500);
    }
    
    // Scroll back to top
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  deduplicateAssets(assets) {
    const seen = new Set();
    return assets.filter(asset => {
      if (seen.has(asset.url)) {
        return false;
      }
      seen.add(asset.url);
      return true;
    });
  }

  isRelevantAsset(url) {
    const relevantExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.webm', '.css', '.js', '.woff', '.woff2', '.ttf'];
    return relevantExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  categorizeAsset(asset) {
    const url = asset.url.toLowerCase();
    
    if (url.includes('speaker') || url.includes('team')) return 'speakers';
    if (url.includes('background') || url.includes('bg')) return 'backgrounds';
    if (url.includes('icon')) return 'icons';
    if (url.includes('logo')) return 'logos';
    if (url.includes('video')) return 'videos';
    if (url.endsWith('.css')) return 'styles';
    if (url.endsWith('.js')) return 'scripts';
    if (url.includes('font') || url.endsWith('.woff') || url.endsWith('.woff2') || url.endsWith('.ttf')) return 'fonts';
    if (url.includes('image') || ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some(ext => url.includes(ext))) return 'images';
    
    return 'other';
  }

  async downloadAssets() {
    console.log('\n📥 Downloading discovered assets...');
    
    // Ensure output directory exists
    this.ensureDirectoryExists(OUTPUT_DIR);
    
    let downloadCount = 0;
    const totalAssets = this.discoveredAssets.length;
    
    for (const asset of this.discoveredAssets) {
      try {
        const category = this.categorizeAsset(asset);
        const fileName = this.generateFileName(asset.url);
        const categoryDir = path.join(OUTPUT_DIR, category);
        
        this.ensureDirectoryExists(categoryDir);
        
        const outputPath = path.join(categoryDir, fileName);
        
        console.log(`  ⬇️  ${fileName} (${category})`);
        
        await this.downloadFile(asset.url, outputPath);
        
        this.downloadedAssets.push({
          ...asset,
          category,
          fileName,
          localPath: outputPath,
          size: this.getFileSize(outputPath),
          downloadedAt: new Date().toISOString()
        });
        
        downloadCount++;
        const progress = ((downloadCount / totalAssets) * 100).toFixed(1);
        console.log(`    ✅ Downloaded (${progress}% complete)`);
        
      } catch (error) {
        console.log(`    ❌ Failed: ${error.message}`);
        
        this.failedAssets.push({
          ...asset,
          error: error.message,
          attemptedAt: new Date().toISOString()
        });
      }
    }
  }

  generateFileName(url) {
    try {
      const urlObj = new URL(url);
      let fileName = path.basename(urlObj.pathname);
      
      if (!fileName || fileName === '/') {
        fileName = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }
      
      // Ensure file has an extension
      if (!path.extname(fileName)) {
        const contentType = this.guessContentType(url);
        const extension = this.getExtensionFromContentType(contentType);
        fileName += extension;
      }
      
      return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    } catch (error) {
      return `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
  }

  guessContentType(url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'image/jpeg';
    if (urlLower.includes('.png')) return 'image/png';
    if (urlLower.includes('.webp')) return 'image/webp';
    if (urlLower.includes('.gif')) return 'image/gif';
    if (urlLower.includes('.svg')) return 'image/svg+xml';
    if (urlLower.includes('.mp4')) return 'video/mp4';
    if (urlLower.includes('.css')) return 'text/css';
    if (urlLower.includes('.js')) return 'application/javascript';
    return 'application/octet-stream';
  }

  getExtensionFromContentType(contentType) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
      'video/mp4': '.mp4',
      'text/css': '.css',
      'application/javascript': '.js'
    };
    return extensions[contentType] || '';
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
            fs.unlink(outputPath, () => {});
            reject(error);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            this.downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
          } else {
            reject(new Error(`Redirect without location header`));
          }
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
      discoveryInfo: {
        timestamp: new Date().toISOString(),
        sourceUrl: AIVENT_URL,
        totalDiscovered: this.discoveredAssets.length,
        totalDownloaded: this.downloadedAssets.length,
        totalFailed: this.failedAssets.length,
        successRate: ((this.downloadedAssets.length / this.discoveredAssets.length) * 100).toFixed(2) + '%'
      },
      downloadedAssets: this.downloadedAssets,
      failedAssets: this.failedAssets,
      assetsByCategory: this.groupAssetsByCategory()
    };

    const manifestPath = path.join(OUTPUT_DIR, 'real-aivent-manifest.json');
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

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REAL AIVENT ASSET DISCOVERY SUMMARY');
    console.log('='.repeat(60));
    console.log(`🔍 Assets discovered: ${this.discoveredAssets.length}`);
    console.log(`✅ Successfully downloaded: ${this.downloadedAssets.length}`);
    console.log(`❌ Failed downloads: ${this.failedAssets.length}`);
    console.log(`📈 Success rate: ${((this.downloadedAssets.length / this.discoveredAssets.length) * 100).toFixed(2)}%`);
    
    if (this.failedAssets.length > 0) {
      console.log('\n❌ Failed assets:');
      this.failedAssets.slice(0, 10).forEach(asset => {
        console.log(`  - ${asset.url}: ${asset.error}`);
      });
      if (this.failedAssets.length > 10) {
        console.log(`  ... and ${this.failedAssets.length - 10} more`);
      }
    }
    
    console.log(`\n📁 Assets saved to: ${OUTPUT_DIR}`);
    console.log('🎯 Ready for Supabase upload!');
  }
}

// Run the discovery
async function main() {
  const discoverer = new RealAssetDiscoverer();
  await discoverer.discoverAndDownloadAssets();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RealAssetDiscoverer;
