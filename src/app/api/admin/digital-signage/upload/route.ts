import { NextRequest, NextResponse } from 'next/server';
import { MediaStorage } from '@/lib/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'content';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type - expanded support
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime',
      // Text/Documents (for text-based signage)
      'text/plain', 'text/html', 'application/json'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Supported formats: Images (JPEG, PNG, GIF, WebP, SVG), Videos (MP4, WebM, OGG, AVI, MOV), Text files.',
          supportedTypes: allowedTypes
        },
        { status: 400 }
      );
    }

    // Enhanced file size validation - different limits for different types
    let maxSize: number;
    if (file.type.startsWith('video/')) {
      maxSize = 500 * 1024 * 1024; // 500MB for videos
    } else if (file.type.startsWith('image/')) {
      maxSize = 100 * 1024 * 1024; // 100MB for images
    } else {
      maxSize = 10 * 1024 * 1024; // 10MB for text files
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          error: `File too large. Maximum size for ${file.type.split('/')[0]} files is ${maxSizeMB}MB.`,
          maxSize: maxSizeMB,
          currentSize: Math.round(file.size / (1024 * 1024))
        },
        { status: 400 }
      );
    }

    // Additional validation for video files
    if (file.type.startsWith('video/')) {
      // Check if it's a reasonable video file (basic validation)
      if (file.size < 1024) { // Less than 1KB is suspicious for a video
        return NextResponse.json(
          { error: 'Video file appears to be corrupted or invalid.' },
          { status: 400 }
        );
      }
    }

    // Upload file
    const result = await MediaStorage.uploadFile(file, folder);

    if (result.error) {
      console.error('Storage upload error:', result.error);
      return NextResponse.json(
        {
          error: result.error,
          details: 'Failed to upload to storage service'
        },
        { status: 500 }
      );
    }

    // Validate upload result
    if (!result.url || !result.path) {
      return NextResponse.json(
        {
          error: 'Upload completed but response is invalid',
          details: 'Storage service returned incomplete data'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      metadata: {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        sizeMB: Math.round((file.size / (1024 * 1024)) * 100) / 100
      }
    });

  } catch (error: any) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    let errorMessage = 'Upload failed';
    let statusCode = 500;

    if (error.message?.includes('network')) {
      errorMessage = 'Network error during upload. Please check your connection.';
      statusCode = 503;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Upload timeout. File may be too large or connection too slow.';
      statusCode = 408;
    } else if (error.message?.includes('storage')) {
      errorMessage = 'Storage service error. Please try again later.';
      statusCode = 503;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    const result = await MediaStorage.deleteFile(path);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Delete failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
