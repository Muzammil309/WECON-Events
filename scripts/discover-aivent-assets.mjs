/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Fetch HTML content from AIvent website
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Extract all asset URLs from HTML
function extractAssetUrls(html, baseUrl) {
  const assets = {
    images: new Set(),
    css: new Set(),
    js: new Set(),
    fonts: new Set()
  };
  
  // Extract images (img src, background-image, etc.)
  const imageRegex = /(?:src|href|url\(["']?)([^"'\s)]+\.(?:jpg|jpeg|png|gif|webp|svg|ico))/gi;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && url.includes('aivent')) {
      assets.images.add(url);
    }
  }
  
  // Extract CSS files
  const cssRegex = /<link[^>]+href=["']([^"']+\.css)[^"']*["'][^>]*>/gi;
  while ((match = cssRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && url.includes('aivent')) {
      assets.css.add(url);
    }
  }
  
  // Extract JavaScript files
  const jsRegex = /<script[^>]+src=["']([^"']+\.js)[^"']*["'][^>]*>/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && url.includes('aivent')) {
      assets.js.add(url);
    }
  }
  
  // Extract font files from CSS
  const fontRegex = /url\(["']?([^"'\s)]+\.(?:woff2?|ttf|eot|otf))/gi;
  while ((match = fontRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url) {
      assets.fonts.add(url);
    }
  }
  
  return assets;
}

// Resolve relative URLs to absolute
function resolveUrl(url, baseUrl) {
  try {
    if (url.startsWith('http')) {
      return url;
    }
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    if (url.startsWith('/')) {
      const base = new URL(baseUrl);
      return base.protocol + '//' + base.host + url;
    }
    return new URL(url, baseUrl).href;
  } catch {
    return null;
  }
}

// Download discovered assets
async function downloadAsset(url, outputDir) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const filename = path.basename(urlObj.pathname) || 'index.html';
      const outputPath = path.join(outputDir, filename);
      
      // Ensure directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const file = fs.createWriteStream(outputPath);
      
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filename}`);
            resolve(outputPath);
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(outputPath);
          downloadAsset(response.headers.location, outputDir).then(resolve).catch(reject);
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
    } catch (error) {
      reject(error);
    }
  });
}

// Main discovery and download function
async function discoverAndDownload() {
  console.log('🔍 Discovering AIvent assets...\n');
  
  const baseUrl = 'https://madebydesignesia.com/themes/aivent/';
  const outputBase = path.join(projectRoot, 'public/assets/aivent-discovered');
  
  try {
    // Fetch main page HTML
    console.log('Fetching main page...');
    const html = await fetchHTML(baseUrl);
    
    // Extract asset URLs
    console.log('Extracting asset URLs...');
    const assets = extractAssetUrls(html, baseUrl);
    
    console.log(`Found ${assets.images.size} images`);
    console.log(`Found ${assets.css.size} CSS files`);
    console.log(`Found ${assets.js.size} JS files`);
    console.log(`Found ${assets.fonts.size} font files`);
    
    // Download each category
    const categories = [
      { name: 'images', urls: Array.from(assets.images), dir: 'images' },
      { name: 'css', urls: Array.from(assets.css), dir: 'css' },
      { name: 'js', urls: Array.from(assets.js), dir: 'js' },
      { name: 'fonts', urls: Array.from(assets.fonts), dir: 'fonts' }
    ];
    
    for (const category of categories) {
      if (category.urls.length > 0) {
        console.log(`\n📁 Downloading ${category.name}...`);
        const outputDir = path.join(outputBase, category.dir);
        
        for (const url of category.urls) {
          try {
            await downloadAsset(url, outputDir);
          } catch (error) {
            console.warn(`✗ Failed: ${path.basename(url)} - ${error.message}`);
          }
        }
      }
    }
    
    // Save discovered URLs for reference
    const discoveredAssets = {
      timestamp: new Date().toISOString(),
      baseUrl,
      assets: {
        images: Array.from(assets.images),
        css: Array.from(assets.css),
        js: Array.from(assets.js),
        fonts: Array.from(assets.fonts)
      }
    };
    
    fs.writeFileSync(
      path.join(outputBase, 'discovered-assets.json'),
      JSON.stringify(discoveredAssets, null, 2)
    );
    
    console.log('\n🎉 Asset discovery complete!');
    console.log(`Assets saved to: ${outputBase}`);
    console.log('Asset list saved to: discovered-assets.json');
    
  } catch (error) {
    console.error('❌ Discovery failed:', error.message);
  }
}

// Run the discovery
discoverAndDownload().catch(console.error);
