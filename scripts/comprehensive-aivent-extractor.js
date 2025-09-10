#!/usr/bin/env node

/**
 * Comprehensive AIvent Asset Extractor
 * Downloads ALL resources from the AIvent template for exact replication
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class AIventAssetExtractor {
  constructor() {
    this.baseUrl = 'https://madebydesignesia.com/themes/aivent/';
    this.targetUrl = 'https://madebydesignesia.com/themes/aivent/index.html';
    this.outputDir = './public/assets/aivent-extracted';
    this.downloadedAssets = new Map();
    this.assetManifest = {
      css: [],
      js: [],
      images: [],
      fonts: [],
      videos: [],
      other: []
    };
  }

  async init() {
    console.log('🚀 Starting Comprehensive AIvent Asset Extraction...');
    
    // Create output directories
    await this.createDirectories();
    
    // Fetch and parse main HTML
    const html = await this.fetchHTML(this.targetUrl);
    
    // Extract all asset URLs
    const assets = await this.extractAssetUrls(html);
    
    // Download all assets
    await this.downloadAllAssets(assets);
    
    // Generate asset manifest
    await this.generateManifest();
    
    console.log('✅ Asset extraction completed successfully!');
    console.log(`📁 Assets saved to: ${this.outputDir}`);
    console.log(`📋 Manifest saved to: ${this.outputDir}/manifest.json`);
  }

  async createDirectories() {
    const dirs = [
      this.outputDir,
      `${this.outputDir}/css`,
      `${this.outputDir}/js`,
      `${this.outputDir}/images`,
      `${this.outputDir}/images/backgrounds`,
      `${this.outputDir}/images/speakers`,
      `${this.outputDir}/images/icons`,
      `${this.outputDir}/images/logos`,
      `${this.outputDir}/fonts`,
      `${this.outputDir}/videos`,
      `${this.outputDir}/other`
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async fetchHTML(url) {
    console.log(`📄 Fetching HTML from: ${url}`);
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  async extractAssetUrls(html) {
    console.log('🔍 Extracting asset URLs from HTML...');
    
    const assets = {
      css: [],
      js: [],
      images: [],
      fonts: [],
      videos: [],
      other: []
    };

    // Extract CSS files
    const cssMatches = html.match(/<link[^>]*href=["']([^"']*\.css[^"']*)["'][^>]*>/gi) || [];
    cssMatches.forEach(match => {
      const href = match.match(/href=["']([^"']*)["']/)?.[1];
      if (href) assets.css.push(this.resolveUrl(href));
    });

    // Extract JavaScript files
    const jsMatches = html.match(/<script[^>]*src=["']([^"']*\.js[^"']*)["'][^>]*>/gi) || [];
    jsMatches.forEach(match => {
      const src = match.match(/src=["']([^"']*)["']/)?.[1];
      if (src) assets.js.push(this.resolveUrl(src));
    });

    // Extract images (comprehensive patterns)
    const imagePatterns = [
      /<img[^>]*src=["']([^"']*)["'][^>]*>/gi,
      /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
      /background:\s*url\(["']?([^"')]+)["']?\)/gi,
      /<source[^>]*src=["']([^"']*)["'][^>]*>/gi
    ];

    imagePatterns.forEach(pattern => {
      const matches = html.match(pattern) || [];
      matches.forEach(match => {
        const urlMatch = match.match(/(?:src|url\()=?["']?([^"')]+)["']?/);
        if (urlMatch && urlMatch[1]) {
          const url = urlMatch[1];
          if (this.isImageUrl(url)) {
            assets.images.push(this.resolveUrl(url));
          }
        }
      });
    });

    // Extract font files
    const fontMatches = html.match(/<link[^>]*href=["']([^"']*\.(woff2?|ttf|otf|eot)[^"']*)["'][^>]*>/gi) || [];
    fontMatches.forEach(match => {
      const href = match.match(/href=["']([^"']*)["']/)?.[1];
      if (href) assets.fonts.push(this.resolveUrl(href));
    });

    // Extract video files
    const videoMatches = html.match(/<(?:video|source)[^>]*src=["']([^"']*\.(mp4|webm|ogg)[^"']*)["'][^>]*>/gi) || [];
    videoMatches.forEach(match => {
      const src = match.match(/src=["']([^"']*)["']/)?.[1];
      if (src) assets.videos.push(this.resolveUrl(src));
    });

    console.log(`📊 Found assets:
    - CSS: ${assets.css.length}
    - JS: ${assets.js.length}
    - Images: ${assets.images.length}
    - Fonts: ${assets.fonts.length}
    - Videos: ${assets.videos.length}`);

    return assets;
  }

  resolveUrl(url) {
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return 'https://madebydesignesia.com' + url;
    return this.baseUrl + url;
  }

  isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  async downloadAllAssets(assets) {
    console.log('⬇️ Starting asset downloads...');

    const downloadPromises = [];

    // Download CSS files and analyze them
    for (const url of assets.css) {
      downloadPromises.push(this.downloadAndAnalyzeCSS(url));
    }

    // Download JS files
    for (const url of assets.js) {
      downloadPromises.push(this.downloadAsset(url, 'js'));
    }

    // Download images with categorization
    for (const url of assets.images) {
      downloadPromises.push(this.downloadAndCategorizeImage(url));
    }

    // Download fonts
    for (const url of assets.fonts) {
      downloadPromises.push(this.downloadAsset(url, 'fonts'));
    }

    // Download videos
    for (const url of assets.videos) {
      downloadPromises.push(this.downloadAsset(url, 'videos'));
    }

    await Promise.allSettled(downloadPromises);

    // Extract additional assets from CSS files
    await this.extractAssetsFromCSS();
  }

  async downloadAndAnalyzeCSS(url) {
    try {
      const filename = this.getFilename(url);
      const filepath = path.join(this.outputDir, 'css', filename);

      console.log(`⬇️ Downloading CSS: ${filename}`);

      const data = await this.fetchBinary(url);
      await fs.writeFile(filepath, data);

      // Analyze CSS content for additional assets
      const cssContent = data.toString();
      const additionalAssets = this.extractAssetsFromCSSContent(cssContent);

      this.assetManifest.css.push({
        originalUrl: url,
        filename: filename,
        localPath: filepath,
        size: data.length,
        additionalAssets: additionalAssets
      });

      console.log(`✅ Downloaded CSS: ${filename} (${data.length} bytes, ${additionalAssets.length} additional assets)`);
    } catch (error) {
      console.error(`❌ Failed to download CSS ${url}:`, error.message);
    }
  }

  async downloadAndCategorizeImage(url) {
    try {
      const filename = this.getFilename(url);

      // Categorize images based on URL patterns
      let category = 'images';
      if (url.includes('speaker') || url.includes('team')) {
        category = 'images/speakers';
      } else if (url.includes('background') || url.includes('bg')) {
        category = 'images/backgrounds';
      } else if (url.includes('icon') || url.includes('logo')) {
        category = 'images/icons';
      }

      const filepath = path.join(this.outputDir, category, filename);

      console.log(`⬇️ Downloading image: ${filename} -> ${category}`);

      const data = await this.fetchBinary(url);
      await fs.writeFile(filepath, data);

      this.assetManifest.images.push({
        originalUrl: url,
        filename: filename,
        localPath: filepath,
        category: category,
        size: data.length
      });

      console.log(`✅ Downloaded image: ${filename} (${data.length} bytes)`);
    } catch (error) {
      console.error(`❌ Failed to download image ${url}:`, error.message);
    }
  }

  extractAssetsFromCSSContent(cssContent) {
    const assets = [];

    // Extract URLs from CSS
    const urlMatches = cssContent.match(/url\(["']?([^"')]+)["']?\)/gi) || [];
    urlMatches.forEach(match => {
      const url = match.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      if (url && !url.startsWith('data:')) {
        assets.push(this.resolveUrl(url));
      }
    });

    return assets;
  }

  async extractAssetsFromCSS() {
    console.log('🔍 Extracting additional assets from CSS files...');

    const additionalAssets = [];

    for (const cssAsset of this.assetManifest.css) {
      if (cssAsset.additionalAssets) {
        additionalAssets.push(...cssAsset.additionalAssets);
      }
    }

    // Remove duplicates
    const uniqueAssets = [...new Set(additionalAssets)];

    // Download additional assets
    for (const url of uniqueAssets) {
      if (this.isImageUrl(url)) {
        await this.downloadAndCategorizeImage(url);
      } else {
        await this.downloadAsset(url, 'other');
      }
    }
  }

  async downloadAsset(url, category) {
    try {
      const filename = this.getFilename(url);
      const filepath = path.join(this.outputDir, category, filename);
      
      console.log(`⬇️ Downloading: ${filename}`);
      
      const data = await this.fetchBinary(url);
      await fs.writeFile(filepath, data);
      
      this.assetManifest[category].push({
        originalUrl: url,
        filename: filename,
        localPath: filepath,
        size: data.length
      });
      
      console.log(`✅ Downloaded: ${filename} (${data.length} bytes)`);
    } catch (error) {
      console.error(`❌ Failed to download ${url}:`, error.message);
    }
  }

  getFilename(url) {
    const urlObj = new URL(url);
    let filename = path.basename(urlObj.pathname);
    
    if (!filename || filename === '/') {
      filename = 'index.html';
    }
    
    // Handle query parameters
    if (urlObj.search) {
      const hash = require('crypto').createHash('md5').update(url).digest('hex').substring(0, 8);
      const ext = path.extname(filename);
      const name = path.basename(filename, ext);
      filename = `${name}_${hash}${ext}`;
    }
    
    return filename;
  }

  async fetchBinary(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return this.fetchBinary(res.headers.location).then(resolve).catch(reject);
        }
        
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    });
  }

  async generateManifest() {
    const manifestPath = path.join(this.outputDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(this.assetManifest, null, 2));
    console.log('📋 Asset manifest generated');
  }
}

// Execute if run directly
if (require.main === module) {
  const extractor = new AIventAssetExtractor();
  extractor.init().catch(console.error);
}

module.exports = AIventAssetExtractor;
