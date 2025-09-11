const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Base URL for AIvent assets
const BASE_URL = 'https://madebydesignesia.com/themes/aivent/';

// Asset categories and their file paths
const ASSETS = {
    images: {
        speakers: [
            'images/team/1.webp',
            'images/team/2.webp', 
            'images/team/3.webp'
        ],
        logos: [
            'images/logo.webp',
            'images/logo-big-white.webp'
        ],
        backgrounds: [
            'images/background/1.webp',
            'images/background/2.webp'
        ],
        partners: [
            'images/logo-light/1.webp',
            'images/logo-light/2.webp',
            'images/logo-light/3.webp',
            'images/logo-light/4.webp',
            'images/logo-light/5.webp'
        ],
        misc: [
            'images/misc/c1.webp'
        ]
    },
    videos: [
        'video/2.mp4'
    ]
};

// Create directory structure
function createDirectories() {
    const baseDir = path.join(process.cwd(), 'assets', 'aivent');
    
    // Create main directories
    const dirs = [
        'images/team',
        'images/logo-light', 
        'images/background',
        'images/misc',
        'video'
    ];
    
    dirs.forEach(dir => {
        const fullPath = path.join(baseDir, dir);
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
    });
    
    return baseDir;
}

// Download a single file
function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        console.log(`Downloading: ${url}`);
        
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
                    resolve();
                });
                
                file.on('error', (err) => {
                    fs.unlink(filepath, () => {}); // Delete partial file
                    reject(err);
                });
            } else {
                file.close();
                fs.unlink(filepath, () => {}); // Delete empty file
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
            }
        }).on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => {}); // Delete partial file
            reject(err);
        });
    });
}

// Download all assets
async function downloadAllAssets() {
    console.log('🚀 Starting AIvent asset download...\n');
    
    const baseDir = createDirectories();
    let downloadCount = 0;
    let errorCount = 0;
    
    // Download images
    for (const [category, files] of Object.entries(ASSETS.images)) {
        console.log(`\n📁 Downloading ${category} images...`);
        
        for (const file of files) {
            try {
                const url = BASE_URL + file;
                const filepath = path.join(baseDir, file);
                await downloadFile(url, filepath);
                downloadCount++;
                
                // Add small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`❌ Failed to download ${file}: ${error.message}`);
                errorCount++;
            }
        }
    }
    
    // Download videos
    console.log(`\n🎥 Downloading videos...`);
    for (const file of ASSETS.videos) {
        try {
            const url = BASE_URL + file;
            const filepath = path.join(baseDir, file);
            await downloadFile(url, filepath);
            downloadCount++;
            
            // Longer delay for video files
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ Failed to download ${file}: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log(`\n📊 Download Summary:`);
    console.log(`✅ Successfully downloaded: ${downloadCount} files`);
    console.log(`❌ Failed downloads: ${errorCount} files`);
    console.log(`📁 Assets saved to: ${baseDir}`);
    
    return { downloadCount, errorCount, baseDir };
}

// Generate asset mapping for HTML updates
function generateAssetMapping(baseDir) {
    const mapping = {};
    
    // Map all asset URLs to local paths
    for (const [category, files] of Object.entries(ASSETS.images)) {
        for (const file of files) {
            const originalUrl = BASE_URL + file;
            const localPath = `./assets/aivent/${file}`;
            mapping[originalUrl] = localPath;
        }
    }
    
    // Map video URLs
    for (const file of ASSETS.videos) {
        const originalUrl = BASE_URL + file;
        const localPath = `./assets/aivent/${file}`;
        mapping[originalUrl] = localPath;
    }
    
    // Save mapping to JSON file for reference
    const mappingPath = path.join(process.cwd(), 'asset-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`\n📋 Asset mapping saved to: ${mappingPath}`);
    
    return mapping;
}

// Main execution
async function main() {
    try {
        const result = await downloadAllAssets();
        const mapping = generateAssetMapping(result.baseDir);
        
        console.log('\n🎉 Asset download completed!');
        console.log('\nNext steps:');
        console.log('1. Run the HTML update script to replace URLs');
        console.log('2. Test the website with local assets');
        console.log('3. Optionally upload to Supabase for CDN hosting');
        
    } catch (error) {
        console.error('💥 Download failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { downloadAllAssets, generateAssetMapping, ASSETS, BASE_URL };
