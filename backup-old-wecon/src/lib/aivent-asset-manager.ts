import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role for server-side operations
let supabaseAdmin: any = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
}

export interface AIventAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'css' | 'js' | 'font' | 'svg' | 'other';
  category: 'background' | 'speaker' | 'icon' | 'logo' | 'ui' | 'style' | 'script' | 'font';
  originalUrl: string;
  supabaseUrl: string;
  supabasePath: string;
  fileSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  metadata?: Record<string, any>;
}

export interface AssetUploadResult {
  success: boolean;
  asset?: AIventAsset;
  error?: string;
}

export class AIventAssetManager {
  private static bucketName = 'aivent-assets';

  static async ensureBucket(): Promise<void> {
    if (!supabaseAdmin) {
      console.warn('Supabase client not initialized - skipping bucket creation');
      return;
    }

    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        const { error } = await supabaseAdmin.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*', 'text/*', 'application/*', 'font/*'],
          fileSizeLimit: 1024 * 1024 * 1024 // 1GB limit for large video files
        });

        if (error) {
          console.error('Failed to create AIvent assets bucket:', error);
        } else {
          console.log('✅ AIvent assets bucket created successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring AIvent bucket exists:', error);
    }
  }

  static async uploadAsset(
    file: File | Buffer,
    assetInfo: {
      name: string;
      type: AIventAsset['type'];
      category: AIventAsset['category'];
      originalUrl: string;
      metadata?: Record<string, any>;
    }
  ): Promise<AssetUploadResult> {
    if (!supabaseAdmin) {
      return { 
        success: false, 
        error: 'Supabase client not initialized. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      };
    }

    try {
      // Ensure bucket exists
      await this.ensureBucket();

      // Generate organized file path
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = assetInfo.name.split('.').pop()?.toLowerCase() || 'bin';
      const sanitizedName = assetInfo.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}-${randomString}-${sanitizedName}`;
      const filePath = `${assetInfo.category}/${assetInfo.type}/${fileName}`;

      // Convert file to buffer if needed
      let fileBuffer: Uint8Array;
      let fileSize: number;
      let mimeType: string;

      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = new Uint8Array(arrayBuffer);
        fileSize = file.size;
        mimeType = file.type || 'application/octet-stream';
      } else {
        fileBuffer = new Uint8Array(file);
        fileSize = file.length;
        mimeType = this.getMimeTypeFromExtension(fileExtension);
      }

      // Upload file to Supabase
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          cacheControl: '31536000', // 1 year cache
          upsert: false,
          contentType: mimeType
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      if (!data || !data.path) {
        return { 
          success: false, 
          error: 'Upload completed but no path returned from storage service' 
        };
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      if (!urlData || !urlData.publicUrl) {
        return { 
          success: false, 
          error: 'File uploaded but failed to generate public URL' 
        };
      }

      // Create asset record
      const asset: AIventAsset = {
        id: `${timestamp}-${randomString}`,
        name: assetInfo.name,
        type: assetInfo.type,
        category: assetInfo.category,
        originalUrl: assetInfo.originalUrl,
        supabaseUrl: urlData.publicUrl,
        supabasePath: data.path,
        fileSize,
        mimeType,
        uploadedAt: new Date().toISOString(),
        metadata: assetInfo.metadata
      };

      // If it's an image, try to get dimensions
      if (assetInfo.type === 'image') {
        try {
          const dimensions = await this.getImageDimensions(fileBuffer);
          if (dimensions) {
            asset.dimensions = dimensions;
          }
        } catch (error) {
          console.warn('Could not get image dimensions:', error);
        }
      }

      return {
        success: true,
        asset
      };
    } catch (error: any) {
      console.error('Asset upload error:', error);
      return {
        success: false,
        error: `Asset upload failed: ${error.message}`
      };
    }
  }

  static async downloadAndUploadAsset(
    url: string,
    assetInfo: {
      name: string;
      type: AIventAsset['type'];
      category: AIventAsset['category'];
      metadata?: Record<string, any>;
    }
  ): Promise<AssetUploadResult> {
    try {
      console.log(`📥 Downloading asset: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to download asset: ${response.status} ${response.statusText}`
        };
      }

      const buffer = await response.arrayBuffer();
      const file = Buffer.from(buffer);

      return await this.uploadAsset(file, {
        ...assetInfo,
        originalUrl: url
      });
    } catch (error: any) {
      console.error('Download and upload error:', error);
      return {
        success: false,
        error: `Download failed: ${error.message}`
      };
    }
  }

  static async listAssets(category?: AIventAsset['category']): Promise<AIventAsset[]> {
    if (!supabaseAdmin) {
      console.warn('Supabase client not initialized');
      return [];
    }

    try {
      const prefix = category ? `${category}/` : '';
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .list(prefix, {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing assets:', error);
        return [];
      }

      // Convert storage objects to AIvent assets
      // Note: This is a simplified version - in production you'd store metadata in a database
      return data.map((item: any) => ({
        id: item.name,
        name: item.name,
        type: this.getTypeFromPath(item.name),
        category: this.getCategoryFromPath(item.name),
        originalUrl: '',
        supabaseUrl: this.getPublicUrl(item.name),
        supabasePath: item.name,
        fileSize: item.metadata?.size || 0,
        mimeType: item.metadata?.mimetype || 'application/octet-stream',
        uploadedAt: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error listing assets:', error);
      return [];
    }
  }

  static getPublicUrl(path: string): string {
    if (!supabaseAdmin) {
      return '';
    }

    const { data } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  private static getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'css': 'text/css',
      'js': 'application/javascript',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'otf': 'font/otf'
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  private static getTypeFromPath(path: string): AIventAsset['type'] {
    const extension = path.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) return 'video';
    if (extension === 'css') return 'css';
    if (extension === 'js') return 'js';
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';
    if (extension === 'svg') return 'svg';
    
    return 'other';
  }

  private static getCategoryFromPath(path: string): AIventAsset['category'] {
    if (path.includes('background')) return 'background';
    if (path.includes('speaker')) return 'speaker';
    if (path.includes('icon')) return 'icon';
    if (path.includes('logo')) return 'logo';
    if (path.includes('style')) return 'style';
    if (path.includes('script')) return 'script';
    if (path.includes('font')) return 'font';
    
    return 'ui';
  }

  private static async getImageDimensions(buffer: Uint8Array): Promise<{ width: number; height: number } | null> {
    // This is a simplified implementation
    // In production, you'd use a proper image processing library
    try {
      // For now, return null - implement proper image dimension detection if needed
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default AIventAssetManager;
