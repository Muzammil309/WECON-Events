import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role for server-side operations
// Only initialize if environment variables are available
let supabaseAdmin: any = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
}

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export class SupabaseStorage {
  private static bucketName = 'signage-media';

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
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 50 * 1024 * 1024 // 50MB
        });

        if (error) {
          console.error('Failed to create storage bucket:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  static async uploadFile(file: File, folder: string = 'content'): Promise<UploadResult> {
    if (!supabaseAdmin) {
      return { url: '', path: '', error: 'Supabase client not initialized' };
    }

    try {
      await this.ensureBucket();

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { url: '', path: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      return { url: '', path: '', error: error.message };
    }
  }

  static async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getSignedUrl(path: string, expiresIn: number = 3600): Promise<{ url?: string; error?: string }> {
    if (!supabaseAdmin) {
      return { error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .createSignedUrl(path, expiresIn);

      if (error) {
        return { error: error.message };
      }

      return { url: data.signedUrl };
    } catch (error: any) {
      return { error: error.message };
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
}

// Fallback storage for development/testing
export class LocalStorage {
  static async uploadFile(file: File, folder: string = 'content'): Promise<UploadResult> {
    // For development, we'll just return a mock URL
    // In production, this should not be used
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const mockUrl = `/uploads/${folder}/${fileName}`;
    
    return {
      url: mockUrl,
      path: `${folder}/${fileName}`,
    };
  }

  static async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    // Mock deletion for development
    return { success: true };
  }
}

// Export the appropriate storage based on environment
export const MediaStorage = (supabaseUrl && supabaseServiceKey) ? SupabaseStorage : LocalStorage;
