#!/usr/bin/env node

/**
 * Upload AIvent Assets to Supabase Storage
 * Uploads all extracted images to Supabase and generates URL mappings
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class SupabaseAssetUploader {
  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabase = null;
    this.bucketName = 'aivent-assets';
    this.assetDir = './public/assets/aivent-extracted';
    this.uploadedAssets = {
      images: {},
      backgrounds: {},
      speakers: {},
      icons: {},
      logos: {}
    };
  }

  async init() {
    console.log('🚀 Starting Supabase Asset Upload...');
    
    // Initialize Supabase client
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      return;
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Create storage bucket if it doesn't exist
    await this.createBucket();
    
    // Upload all images
    await this.uploadAllImages();
    
    // Generate asset mapping file
    await this.generateAssetMapping();
    
    console.log('✅ Asset upload completed successfully!');
  }

  async createBucket() {
    console.log(`📦 Creating/checking bucket: ${this.bucketName}`);
    
    try {
      const { data, error } = await this.supabase.storage.createBucket(this.bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log('✅ Bucket ready');
      }
    } catch (error) {
      console.error('❌ Bucket creation error:', error);
    }
  }

  async uploadAllImages() {
    console.log('⬇️ Starting image uploads...');
    
    // Upload main images
    await this.uploadImagesFromDirectory('images', '');
    
    // Upload backgrounds
    await this.uploadImagesFromDirectory('images/backgrounds', 'backgrounds');
    
    // Upload speakers
    await this.uploadImagesFromDirectory('images/speakers', 'speakers');
    
    // Upload icons
    await this.uploadImagesFromDirectory('images/icons', 'icons');
    
    // Upload logos
    await this.uploadImagesFromDirectory('images/logos', 'logos');
  }

  async uploadImagesFromDirectory(localDir, category) {
    const fullPath = path.join(this.assetDir, localDir);
    
    try {
      const files = await fs.readdir(fullPath);
      const imageFiles = files.filter(file => this.isImageFile(file));
      
      console.log(`📁 Uploading ${imageFiles.length} images from ${localDir}...`);
      
      for (const file of imageFiles) {
        await this.uploadImage(fullPath, file, category);
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${localDir}:`, error.message);
    }
  }

  async uploadImage(dirPath, filename, category) {
    try {
      const filePath = path.join(dirPath, filename);
      const fileBuffer = await fs.readFile(filePath);
      
      // Create storage path
      const storagePath = category ? `${category}/${filename}` : filename;
      
      console.log(`⬆️ Uploading: ${storagePath}`);
      
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: this.getMimeType(filename),
          upsert: true
        });
      
      if (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.message);
        return;
      }
      
      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);
      
      // Store mapping
      const categoryKey = category || 'images';
      if (!this.uploadedAssets[categoryKey]) {
        this.uploadedAssets[categoryKey] = {};
      }
      
      this.uploadedAssets[categoryKey][filename] = {
        originalPath: filePath,
        storagePath: storagePath,
        publicUrl: urlData.publicUrl,
        size: fileBuffer.length
      };
      
      console.log(`✅ Uploaded: ${filename} -> ${urlData.publicUrl}`);
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }

  isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  async generateAssetMapping() {
    console.log('📋 Generating asset mapping...');
    
    const mappingPath = path.join(this.assetDir, 'supabase-asset-mapping.json');
    await fs.writeFile(mappingPath, JSON.stringify(this.uploadedAssets, null, 2));
    
    // Also create a TypeScript constants file
    const constantsContent = this.generateConstantsFile();
    const constantsPath = './src/constants/aivent-assets.ts';
    await fs.writeFile(constantsPath, constantsContent);
    
    console.log('✅ Asset mapping generated');
    console.log(`📁 Mapping saved to: ${mappingPath}`);
    console.log(`📁 Constants saved to: ${constantsPath}`);
  }

  generateConstantsFile() {
    return `// Auto-generated AIvent Asset URLs from Supabase
// Generated on: ${new Date().toISOString()}

export const AIVENT_ASSETS = {
  // Background Images
  backgrounds: {
${Object.entries(this.uploadedAssets.backgrounds || {}).map(([key, value]) => 
  `    '${key.replace('.webp', '')}': '${value.publicUrl}',`
).join('\n')}
  },
  
  // Speaker Images
  speakers: {
${Object.entries(this.uploadedAssets.speakers || {}).map(([key, value]) => 
  `    '${key.replace('.webp', '')}': '${value.publicUrl}',`
).join('\n')}
  },
  
  // Icon Images
  icons: {
${Object.entries(this.uploadedAssets.icons || {}).map(([key, value]) => 
  `    '${key.replace('.webp', '')}': '${value.publicUrl}',`
).join('\n')}
  },
  
  // Logo Images
  logos: {
${Object.entries(this.uploadedAssets.logos || {}).map(([key, value]) => 
  `    '${key.replace('.webp', '')}': '${value.publicUrl}',`
).join('\n')}
  },
  
  // Other Images
  images: {
${Object.entries(this.uploadedAssets.images || {}).map(([key, value]) => 
  `    '${key.replace(/\.(webp|png|jpg|jpeg|svg)$/, '')}': '${value.publicUrl}',`
).join('\n')}
  }
};

// Helper function to get asset URL
export function getAiventAsset(category: keyof typeof AIVENT_ASSETS, name: string): string {
  return AIVENT_ASSETS[category][name] || '';
}
`;
  }
}

// Execute if run directly
if (require.main === module) {
  const uploader = new SupabaseAssetUploader();
  uploader.init().catch(console.error);
}

module.exports = SupabaseAssetUploader;
