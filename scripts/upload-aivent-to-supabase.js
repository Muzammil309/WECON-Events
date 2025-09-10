/**
 * Upload AIvent Assets to Supabase Storage
 * Uploads all extracted AIvent assets to Supabase and generates TypeScript constants
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'aivent-assets';
const ASSETS_DIR = path.join(__dirname, '../public/assets/aivent-extracted');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'manifest.json');

class SupabaseUploader {
  constructor() {
    this.uploadedAssets = [];
    this.failedUploads = [];
    this.totalAssets = 0;
    this.uploadedCount = 0;
  }

  async uploadAllAssets() {
    console.log('🚀 Starting Supabase upload process...\n');

    // Ensure bucket exists
    await this.ensureBucket();

    // Load manifest
    const manifest = await this.loadManifest();
    if (!manifest) {
      console.error('❌ No manifest found. Please run asset extraction first.');
      return;
    }

    this.totalAssets = manifest.downloadedAssets.length;
    console.log(`📊 Total assets to upload: ${this.totalAssets}\n`);

    // Upload assets by category
    await this.uploadAssetsByCategory(manifest.downloadedAssets);

    // Generate TypeScript constants
    await this.generateTypeScriptConstants();

    // Generate final manifest
    await this.generateSupabaseManifest();

    // Print summary
    this.printSummary();
  }

  async ensureBucket() {
    try {
      console.log('🪣 Ensuring Supabase bucket exists...');
      
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) {
        throw listError;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        console.log(`  Creating bucket: ${BUCKET_NAME}`);
        
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*', 'text/*', 'application/*', 'font/*'],
          fileSizeLimit: 1024 * 1024 * 1024 // 1GB
        });

        if (createError) {
          throw createError;
        }

        console.log('  ✅ Bucket created successfully');
      } else {
        console.log('  ✅ Bucket already exists');
      }
    } catch (error) {
      console.error('❌ Error ensuring bucket:', error.message);
      throw error;
    }
  }

  async loadManifest() {
    try {
      if (!fs.existsSync(MANIFEST_PATH)) {
        // If no manifest exists, scan the directory structure
        console.log('📁 No manifest found, scanning directory structure...');
        return this.scanDirectoryStructure();
      }

      const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
      return JSON.parse(manifestContent);
    } catch (error) {
      console.error('❌ Error loading manifest:', error.message);
      return this.scanDirectoryStructure();
    }
  }

  async scanDirectoryStructure() {
    const assets = [];

    const scanDirectory = (dir, category) => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          assets.push({
            name: file,
            path: path.relative(ASSETS_DIR, filePath).replace(/\\/g, '/'),
            localPath: filePath,
            category: category,
            type: this.getAssetType(file),
            size: stats.size
          });
        } else if (stats.isDirectory()) {
          scanDirectory(filePath, file);
        }
      });
    };

    // Scan main categories
    ['css', 'js', 'images', 'fonts', 'videos', 'other'].forEach(category => {
      const categoryDir = path.join(ASSETS_DIR, category);
      scanDirectory(categoryDir, category);
    });

    return {
      downloadedAssets: assets
    };
  }

  getAssetType(fileName) {
    const ext = path.extname(fileName).toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) return 'image';
    if (['.mp4', '.webm', '.avi', '.mov'].includes(ext)) return 'video';
    if (ext === '.css') return 'css';
    if (ext === '.js') return 'js';
    if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) return 'font';

    return 'other';
  }

  async uploadAssetsByCategory(assets) {
    const categories = [...new Set(assets.map(asset => asset.category))];
    
    for (const category of categories) {
      console.log(`📁 Uploading ${category} assets...`);
      
      const categoryAssets = assets.filter(asset => asset.category === category);
      
      for (const asset of categoryAssets) {
        await this.uploadAsset(asset);
      }
    }
  }

  async uploadAsset(asset) {
    try {
      console.log(`  ⬆️  ${asset.name}`);

      // Read file
      const filePath = asset.localPath;
      if (!fs.existsSync(filePath)) {
        throw new Error('Local file not found');
      }

      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(asset.path);
      const supabasePath = `${asset.category}/${asset.type}/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(supabasePath, fileBuffer, {
          cacheControl: '31536000', // 1 year
          upsert: true,
          contentType: this.getMimeType(fileName)
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(supabasePath);

      const uploadedAsset = {
        ...asset,
        supabasePath,
        supabaseUrl: urlData.publicUrl,
        uploadedAt: new Date().toISOString()
      };

      this.uploadedAssets.push(uploadedAsset);
      this.uploadedCount++;

      const progress = ((this.uploadedCount / this.totalAssets) * 100).toFixed(1);
      console.log(`    ✅ Uploaded (${progress}% complete)`);

    } catch (error) {
      console.log(`    ❌ Failed: ${error.message}`);
      
      this.failedUploads.push({
        ...asset,
        error: error.message,
        attemptedAt: new Date().toISOString()
      });
    }
  }

  getMimeType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.otf': 'font/otf'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  async generateTypeScriptConstants() {
    console.log('\n📝 Generating TypeScript constants...');

    const assetsByCategory = this.groupAssetsByCategory();
    
    let tsContent = `/**
 * AIvent Assets - Supabase URLs
 * Auto-generated from comprehensive asset extraction
 * Generated at: ${new Date().toISOString()}
 */

export const AIVENT_SUPABASE_ASSETS = {\n`;

    // Generate assets by category
    for (const [category, assets] of Object.entries(assetsByCategory)) {
      tsContent += `  ${category}: {\n`;
      
      assets.forEach(asset => {
        const key = this.generateAssetKey(asset.name);
        tsContent += `    '${key}': '${asset.supabaseUrl}',\n`;
      });
      
      tsContent += `  },\n\n`;
    }

    tsContent += `};\n\n`;

    // Generate helper functions
    tsContent += `// Helper functions for easy asset access\n`;
    for (const category of Object.keys(assetsByCategory)) {
      const functionName = `get${category.charAt(0).toUpperCase() + category.slice(1)}Asset`;
      tsContent += `export const ${functionName} = (key: string) => AIVENT_SUPABASE_ASSETS.${category}[key];\n`;
    }

    tsContent += `\n// Get any asset by category and key\n`;
    tsContent += `export const getAiventAsset = (category: keyof typeof AIVENT_SUPABASE_ASSETS, key: string) => {\n`;
    tsContent += `  return AIVENT_SUPABASE_ASSETS[category]?.[key] || '';\n`;
    tsContent += `};\n\n`;

    tsContent += `export default AIVENT_SUPABASE_ASSETS;\n`;

    // Write to file
    const outputPath = path.join(__dirname, '../src/constants/aivent-supabase-assets.ts');
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`  ✅ TypeScript constants generated: ${outputPath}`);
  }

  generateAssetKey(fileName) {
    return fileName
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  }

  groupAssetsByCategory() {
    const grouped = {};
    this.uploadedAssets.forEach(asset => {
      if (!grouped[asset.category]) {
        grouped[asset.category] = [];
      }
      grouped[asset.category].push(asset);
    });
    return grouped;
  }

  async generateSupabaseManifest() {
    const manifest = {
      uploadInfo: {
        timestamp: new Date().toISOString(),
        bucketName: BUCKET_NAME,
        totalAssets: this.totalAssets,
        uploadedCount: this.uploadedCount,
        failedCount: this.failedUploads.length,
        successRate: ((this.uploadedCount / this.totalAssets) * 100).toFixed(2) + '%'
      },
      uploadedAssets: this.uploadedAssets,
      failedUploads: this.failedUploads,
      assetsByCategory: this.groupAssetsByCategory()
    };

    const manifestPath = path.join(__dirname, '../src/constants/aivent-supabase-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`\n📋 Supabase manifest generated: ${manifestPath}`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUPABASE UPLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully uploaded: ${this.uploadedCount}/${this.totalAssets} assets`);
    console.log(`❌ Failed uploads: ${this.failedUploads.length}`);
    console.log(`📈 Success rate: ${((this.uploadedCount / this.totalAssets) * 100).toFixed(2)}%`);
    console.log(`🪣 Bucket: ${BUCKET_NAME}`);
    
    if (this.failedUploads.length > 0) {
      console.log('\n❌ Failed uploads:');
      this.failedUploads.forEach(asset => {
        console.log(`  - ${asset.name}: ${asset.error}`);
      });
    }
    
    console.log('\n🎯 Assets are now available in Supabase Storage!');
    console.log('📝 TypeScript constants generated for easy integration');
  }
}

// Run the upload
async function main() {
  const uploader = new SupabaseUploader();
  await uploader.uploadAllAssets();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SupabaseUploader;
