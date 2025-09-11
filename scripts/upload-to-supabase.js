const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://pkxtnjyarbcqbkhwbjpp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Set this in environment variables
const BUCKET_NAME = 'aivent-assets';

// Initialize Supabase client
let supabase;

function initializeSupabase() {
    if (!SUPABASE_SERVICE_KEY) {
        console.error('❌ SUPABASE_SERVICE_KEY environment variable not set');
        console.log('Please set your Supabase service key:');
        console.log('export SUPABASE_SERVICE_KEY="your-service-key-here"');
        process.exit(1);
    }
    
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Supabase client initialized');
}

// Create storage bucket if it doesn't exist
async function createBucket() {
    try {
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'video/mp4'],
            fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
        });
        
        if (error && error.message !== 'Bucket already exists') {
            throw error;
        }
        
        console.log(`✅ Storage bucket "${BUCKET_NAME}" ready`);
        return true;
    } catch (error) {
        console.error(`❌ Error creating bucket: ${error.message}`);
        return false;
    }
}

// Upload a single file to Supabase Storage
async function uploadFile(localFilePath, supabaseFilePath) {
    try {
        console.log(`📤 Uploading: ${path.basename(localFilePath)}`);
        
        const fileBuffer = fs.readFileSync(localFilePath);
        const fileExt = path.extname(localFilePath).toLowerCase();
        
        // Determine content type
        let contentType = 'application/octet-stream';
        if (fileExt === '.webp') contentType = 'image/webp';
        else if (fileExt === '.jpg' || fileExt === '.jpeg') contentType = 'image/jpeg';
        else if (fileExt === '.png') contentType = 'image/png';
        else if (fileExt === '.mp4') contentType = 'video/mp4';
        
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(supabaseFilePath, fileBuffer, {
                contentType,
                upsert: true // Overwrite if exists
            });
        
        if (error) {
            throw error;
        }
        
        console.log(`✅ Uploaded: ${supabaseFilePath}`);
        return data;
    } catch (error) {
        console.error(`❌ Upload failed for ${localFilePath}: ${error.message}`);
        return null;
    }
}

// Upload all assets to Supabase
async function uploadAllAssets() {
    console.log('🚀 Starting Supabase upload...\n');
    
    const assetsDir = path.join(process.cwd(), 'assets', 'aivent');
    
    if (!fs.existsSync(assetsDir)) {
        console.error(`❌ Assets directory not found: ${assetsDir}`);
        console.log('Please run the download script first: node scripts/download-aivent-assets.js');
        return false;
    }
    
    // Create bucket
    const bucketCreated = await createBucket();
    if (!bucketCreated) {
        return false;
    }
    
    let uploadCount = 0;
    let errorCount = 0;
    
    // Function to recursively upload files
    async function uploadDirectory(dirPath, relativePath = '') {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const relativeFilePath = path.join(relativePath, item).replace(/\\/g, '/');
            
            if (fs.statSync(fullPath).isDirectory()) {
                // Recursively upload subdirectory
                await uploadDirectory(fullPath, relativeFilePath);
            } else {
                // Upload file
                const result = await uploadFile(fullPath, relativeFilePath);
                if (result) {
                    uploadCount++;
                } else {
                    errorCount++;
                }
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    
    await uploadDirectory(assetsDir);
    
    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successfully uploaded: ${uploadCount} files`);
    console.log(`❌ Failed uploads: ${errorCount} files`);
    console.log(`🌐 Supabase Storage URL: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`);
    
    return uploadCount > 0;
}

// Get public URL for an asset
function getPublicUrl(filePath) {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
    
    return data.publicUrl;
}

// List all uploaded assets
async function listAssets() {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list('', {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' }
            });
        
        if (error) {
            throw error;
        }
        
        console.log('\n📋 Uploaded Assets:');
        data.forEach(file => {
            const publicUrl = getPublicUrl(file.name);
            console.log(`📄 ${file.name} - ${publicUrl}`);
        });
        
        return data;
    } catch (error) {
        console.error(`❌ Error listing assets: ${error.message}`);
        return [];
    }
}

// Main function
async function main() {
    try {
        initializeSupabase();
        
        const success = await uploadAllAssets();
        
        if (success) {
            console.log('\n🎉 Supabase upload completed!');
            
            // List uploaded assets
            await listAssets();
            
            console.log('\nNext steps:');
            console.log('1. Update HTML file with Supabase URLs');
            console.log('2. Test the website with Supabase-hosted assets');
            console.log('3. Verify CDN performance and accessibility');
            
            // Generate update command
            console.log(`\nTo update HTML with Supabase URLs, run:`);
            console.log(`node -e "const {updateHtmlWithSupabaseUrls} = require('./scripts/update-html-assets.js'); updateHtmlWithSupabaseUrls('wecon-masawat-2025.html', '${SUPABASE_URL}');"`);
        } else {
            console.log('\n💥 Supabase upload failed!');
            process.exit(1);
        }
    } catch (error) {
        console.error('💥 Upload process failed:', error);
        process.exit(1);
    }
}

// Export functions
module.exports = {
    uploadAllAssets,
    uploadFile,
    createBucket,
    getPublicUrl,
    listAssets,
    SUPABASE_URL,
    BUCKET_NAME
};

// Run if called directly
if (require.main === module) {
    main();
}
