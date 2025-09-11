const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class AIventAssetExtractor {
  constructor() {
    this.baseUrl = 'https://madebydesignesia.com/themes/aivent/';
    this.outputDir = './extracted-assets';
    this.assets = {
      images: [],
      videos: [],
      css: [],
      js: [],
      fonts: [],
      audio: [],
      other: []
    };
    this.downloadedAssets = new Set();
  }

  async initialize() {
    // Create output directories
    await this.createDirectories();
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Enable request interception to capture all network requests
    await this.page.setRequestInterception(true);
    
    this.page.on('request', (request) => {
      this.captureAssetRequest(request);
      request.continue();
    });
    
    this.page.on('response', (response) => {
      this.captureAssetResponse(response);
    });
  }

  async createDirectories() {
    const dirs = [
      this.outputDir,
      `${this.outputDir}/images`,
      `${this.outputDir}/videos`,
      `${this.outputDir}/css`,
      `${this.outputDir}/js`,
      `${this.outputDir}/fonts`,
      `${this.outputDir}/audio`,
      `${this.outputDir}/other`
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${dir} already exists or error:`, error.message);
      }
    }
  }

  captureAssetRequest(request) {
    const url = request.url();
    const resourceType = request.resourceType();
    
    console.log(`📥 Request: ${resourceType} - ${url}`);
    
    // Categorize assets based on URL and resource type
    if (resourceType === 'image' || this.isImageUrl(url)) {
      this.assets.images.push(url);
    } else if (resourceType === 'media' || this.isVideoUrl(url)) {
      this.assets.videos.push(url);
    } else if (resourceType === 'stylesheet' || url.includes('.css')) {
      this.assets.css.push(url);
    } else if (resourceType === 'script' || url.includes('.js')) {
      this.assets.js.push(url);
    } else if (this.isFontUrl(url)) {
      this.assets.fonts.push(url);
    } else if (this.isAudioUrl(url)) {
      this.assets.audio.push(url);
    } else {
      this.assets.other.push(url);
    }
  }

  captureAssetResponse(response) {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';
    
    if (status === 200) {
      console.log(`✅ Response: ${status} - ${contentType} - ${url}`);
    } else {
      console.log(`❌ Response: ${status} - ${url}`);
    }
  }

  isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp)(\?.*)?$/i.test(url);
  }

  isVideoUrl(url) {
    return /\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)(\?.*)?$/i.test(url);
  }

  isFontUrl(url) {
    return /\.(woff|woff2|ttf|otf|eot)(\?.*)?$/i.test(url);
  }

  isAudioUrl(url) {
    return /\.(mp3|wav|ogg|aac|flac|m4a)(\?.*)?$/i.test(url);
  }

  async extractPageAssets() {
    console.log('🚀 Starting comprehensive asset extraction...');
    
    // Navigate to the main page
    await this.page.goto(this.baseUrl + 'index.html', { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });

    // Wait for page to fully load
    await this.page.waitForTimeout(5000);

    // Scroll through the entire page to trigger lazy loading
    await this.scrollThroughPage();

    // Extract inline styles and scripts
    await this.extractInlineAssets();

    // Extract background images from CSS
    await this.extractBackgroundImages();

    // Extract data URLs and base64 assets
    await this.extractDataUrls();

    // Check for additional asset references in JavaScript
    await this.extractJavaScriptAssets();

    console.log('📊 Asset extraction summary:');
    console.log(`Images: ${this.assets.images.length}`);
    console.log(`Videos: ${this.assets.videos.length}`);
    console.log(`CSS: ${this.assets.css.length}`);
    console.log(`JS: ${this.assets.js.length}`);
    console.log(`Fonts: ${this.assets.fonts.length}`);
    console.log(`Audio: ${this.assets.audio.length}`);
    console.log(`Other: ${this.assets.other.length}`);
  }

  async scrollThroughPage() {
    console.log('📜 Scrolling through page to trigger lazy loading...');
    
    const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await this.page.evaluate(() => window.innerHeight);
    
    for (let currentPosition = 0; currentPosition < pageHeight; currentPosition += viewportHeight / 2) {
      await this.page.evaluate((position) => {
        window.scrollTo(0, position);
      }, currentPosition);
      
      await this.page.waitForTimeout(1000); // Wait for lazy loading
    }
    
    // Scroll back to top
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(2000);
  }

  async extractInlineAssets() {
    console.log('🔍 Extracting inline styles and scripts...');
    
    // Extract inline CSS
    const inlineStyles = await this.page.evaluate(() => {
      const styles = [];
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach((style, index) => {
        styles.push({
          index,
          content: style.textContent
        });
      });
      return styles;
    });

    // Save inline styles
    for (const style of inlineStyles) {
      const filename = `inline-style-${style.index}.css`;
      await fs.writeFile(
        path.join(this.outputDir, 'css', filename),
        style.content
      );
    }

    // Extract inline scripts
    const inlineScripts = await this.page.evaluate(() => {
      const scripts = [];
      const scriptElements = document.querySelectorAll('script:not([src])');
      scriptElements.forEach((script, index) => {
        if (script.textContent.trim()) {
          scripts.push({
            index,
            content: script.textContent
          });
        }
      });
      return scripts;
    });

    // Save inline scripts
    for (const script of inlineScripts) {
      const filename = `inline-script-${script.index}.js`;
      await fs.writeFile(
        path.join(this.outputDir, 'js', filename),
        script.content
      );
    }
  }

  async extractBackgroundImages() {
    console.log('🖼️ Extracting background images from CSS...');
    
    const backgroundImages = await this.page.evaluate(() => {
      const images = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/g);
          if (matches) {
            matches.forEach(match => {
              const url = match.replace(/url\(['"]?/, '').replace(/['"]?\)$/, '');
              if (url && !url.startsWith('data:')) {
                images.push(url);
              }
            });
          }
        }
      });
      
      return [...new Set(images)];
    });

    backgroundImages.forEach(url => {
      if (!this.assets.images.includes(url)) {
        this.assets.images.push(url);
      }
    });
  }

  async extractDataUrls() {
    console.log('📊 Extracting data URLs and base64 assets...');
    
    const dataUrls = await this.page.evaluate(() => {
      const dataUrls = [];
      
      // Check all img src attributes
      document.querySelectorAll('img[src^="data:"]').forEach(img => {
        dataUrls.push({
          type: 'image',
          data: img.src,
          element: 'img'
        });
      });
      
      // Check CSS background images
      document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.backgroundImage.includes('data:')) {
          dataUrls.push({
            type: 'background',
            data: style.backgroundImage,
            element: element.tagName
          });
        }
      });
      
      return dataUrls;
    });

    // Save data URLs as separate files
    for (let i = 0; i < dataUrls.length; i++) {
      const dataUrl = dataUrls[i];
      try {
        const matches = dataUrl.data.match(/data:([^;]+);base64,(.+)/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const extension = mimeType.split('/')[1] || 'bin';
          const filename = `data-url-${i}.${extension}`;
          
          const buffer = Buffer.from(base64Data, 'base64');
          await fs.writeFile(
            path.join(this.outputDir, 'other', filename),
            buffer
          );
        }
      } catch (error) {
        console.error(`Error saving data URL ${i}:`, error.message);
      }
    }
  }

  async extractJavaScriptAssets() {
    console.log('🔧 Extracting assets referenced in JavaScript...');
    
    // Look for asset references in JavaScript variables and functions
    const jsAssets = await this.page.evaluate(() => {
      const assets = [];
      
      // Check for common asset patterns in scripts
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.textContent) {
          const content = script.textContent;
          
          // Look for image references
          const imageMatches = content.match(/['"`]([^'"`]*\.(jpg|jpeg|png|gif|svg|webp))[^'"`]*['"`]/gi);
          if (imageMatches) {
            imageMatches.forEach(match => {
              const url = match.replace(/['"`]/g, '');
              assets.push(url);
            });
          }
          
          // Look for video references
          const videoMatches = content.match(/['"`]([^'"`]*\.(mp4|webm|ogg|avi|mov))[^'"`]*['"`]/gi);
          if (videoMatches) {
            videoMatches.forEach(match => {
              const url = match.replace(/['"`]/g, '');
              assets.push(url);
            });
          }
        }
      });
      
      return [...new Set(assets)];
    });

    jsAssets.forEach(url => {
      if (this.isImageUrl(url) && !this.assets.images.includes(url)) {
        this.assets.images.push(url);
      } else if (this.isVideoUrl(url) && !this.assets.videos.includes(url)) {
        this.assets.videos.push(url);
      }
    });
  }

  async downloadAssets() {
    console.log('⬇️ Starting asset downloads...');
    
    const allAssets = [
      ...this.assets.images.map(url => ({ url, type: 'images' })),
      ...this.assets.videos.map(url => ({ url, type: 'videos' })),
      ...this.assets.css.map(url => ({ url, type: 'css' })),
      ...this.assets.js.map(url => ({ url, type: 'js' })),
      ...this.assets.fonts.map(url => ({ url, type: 'fonts' })),
      ...this.assets.audio.map(url => ({ url, type: 'audio' }))
    ];

    console.log(`📦 Total assets to download: ${allAssets.length}`);

    for (let i = 0; i < allAssets.length; i++) {
      const asset = allAssets[i];
      try {
        await this.downloadAsset(asset.url, asset.type);
        console.log(`✅ Downloaded (${i + 1}/${allAssets.length}): ${asset.url}`);
      } catch (error) {
        console.error(`❌ Failed to download ${asset.url}:`, error.message);
      }
    }
  }

  async downloadAsset(url, type) {
    if (this.downloadedAssets.has(url)) {
      return; // Already downloaded
    }

    // Convert relative URLs to absolute
    const absoluteUrl = url.startsWith('http') ? url : new URL(url, this.baseUrl).href;
    
    const filename = this.getFilenameFromUrl(absoluteUrl);
    const filepath = path.join(this.outputDir, type, filename);

    return new Promise((resolve, reject) => {
      const protocol = absoluteUrl.startsWith('https:') ? https : http;
      
      protocol.get(absoluteUrl, (response) => {
        if (response.statusCode === 200) {
          const fileStream = require('fs').createWriteStream(filepath);
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            this.downloadedAssets.add(url);
            resolve();
          });
          
          fileStream.on('error', reject);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  getFilenameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      let filename = path.basename(urlObj.pathname);
      
      // If no filename, generate one
      if (!filename || filename === '/') {
        const hash = require('crypto').createHash('md5').update(url).digest('hex');
        filename = `asset-${hash.substring(0, 8)}`;
      }
      
      // Remove query parameters from filename
      filename = filename.split('?')[0];
      
      return filename;
    } catch (error) {
      const hash = require('crypto').createHash('md5').update(url).digest('hex');
      return `asset-${hash.substring(0, 8)}`;
    }
  }

  async generateAssetManifest() {
    console.log('📋 Generating asset manifest...');
    
    const manifest = {
      extractedAt: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalAssets: Object.values(this.assets).reduce((sum, arr) => sum + arr.length, 0),
      assets: this.assets,
      downloadedCount: this.downloadedAssets.size
    };

    await fs.writeFile(
      path.join(this.outputDir, 'asset-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Generate TypeScript constants file
    await this.generateTypeScriptConstants();
  }

  async generateTypeScriptConstants() {
    console.log('📝 Generating TypeScript constants...');
    
    const tsContent = `// Auto-generated AIvent asset constants
// Generated at: ${new Date().toISOString()}

export const AIVENT_ASSETS = {
  images: [
${this.assets.images.map(url => `    '${url}'`).join(',\n')}
  ],
  videos: [
${this.assets.videos.map(url => `    '${url}'`).join(',\n')}
  ],
  css: [
${this.assets.css.map(url => `    '${url}'`).join(',\n')}
  ],
  js: [
${this.assets.js.map(url => `    '${url}'`).join(',\n')}
  ],
  fonts: [
${this.assets.fonts.map(url => `    '${url}'`).join(',\n')}
  ],
  audio: [
${this.assets.audio.map(url => `    '${url}'`).join(',\n')}
  ]
} as const;

export const getAssetUrl = (filename: string, type: keyof typeof AIVENT_ASSETS) => {
  const asset = AIVENT_ASSETS[type].find(url => url.includes(filename));
  return asset || '';
};

export const AIVENT_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: '#0f0f23',
  surface: '#1a1a2e',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)'
} as const;
`;

    await fs.writeFile(
      path.join(this.outputDir, 'aivent-assets.ts'),
      tsContent
    );
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.extractPageAssets();
      await this.downloadAssets();
      await this.generateAssetManifest();
      
      console.log('🎉 Asset extraction completed successfully!');
      console.log(`📁 Assets saved to: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Asset extraction failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the extractor
if (require.main === module) {
  const extractor = new AIventAssetExtractor();
  extractor.run();
}

module.exports = AIventAssetExtractor;
