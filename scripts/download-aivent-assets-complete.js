const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Create assets directory structure
const createDirectories = () => {
    const dirs = [
        'assets/aivent-complete',
        'assets/aivent-complete/images',
        'assets/aivent-complete/images/background',
        'assets/aivent-complete/images/team',
        'assets/aivent-complete/images/logo',
        'assets/aivent-complete/images/news',
        'assets/aivent-complete/videos',
        'assets/aivent-complete/css',
        'assets/aivent-complete/js',
        'assets/aivent-complete/fonts'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    });
};

// Download function with retry logic
const downloadFile = (url, filepath, retries = 3) => {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const attempt = (retriesLeft) => {
            console.log(`📥 Downloading: ${url}`);
            
            const file = fs.createWriteStream(filepath);
            const request = protocol.get(url, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
                        resolve(filepath);
                    });
                } else if (response.statusCode === 302 || response.statusCode === 301) {
                    // Handle redirects
                    file.close();
                    fs.unlinkSync(filepath);
                    downloadFile(response.headers.location, filepath, retriesLeft)
                        .then(resolve)
                        .catch(reject);
                } else {
                    file.close();
                    fs.unlinkSync(filepath);
                    if (retriesLeft > 0) {
                        console.log(`⚠️ Retrying download: ${url} (${retriesLeft} attempts left)`);
                        setTimeout(() => attempt(retriesLeft - 1), 1000);
                    } else {
                        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                    }
                }
            }).on('error', (err) => {
                file.close();
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
                if (retriesLeft > 0) {
                    console.log(`⚠️ Retrying download: ${url} (${retriesLeft} attempts left)`);
                    setTimeout(() => attempt(retriesLeft - 1), 1000);
                } else {
                    reject(err);
                }
            });
        };
        
        attempt(retries);
    });
};

// Complete asset list from AIvent website
const assets = [
    // Background images
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/background/1.webp',
        path: 'assets/aivent-complete/images/background/1.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/background/2.webp',
        path: 'assets/aivent-complete/images/background/2.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/background/3.webp',
        path: 'assets/aivent-complete/images/background/3.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/background/4.webp',
        path: 'assets/aivent-complete/images/background/4.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/background/5.webp',
        path: 'assets/aivent-complete/images/background/5.webp'
    },
    
    // Team/Speaker images
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/team/1.webp',
        path: 'assets/aivent-complete/images/team/1.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/team/2.webp',
        path: 'assets/aivent-complete/images/team/2.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/team/3.webp',
        path: 'assets/aivent-complete/images/team/3.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/team/4.webp',
        path: 'assets/aivent-complete/images/team/4.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/team/5.webp',
        path: 'assets/aivent-complete/images/team/5.webp'
    },
    
    // Logo files
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo.webp',
        path: 'assets/aivent-complete/images/logo/logo.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo-big-w.webp',
        path: 'assets/aivent-complete/images/logo/logo-big-w.webp'
    },
    
    // News images
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/news/1.webp',
        path: 'assets/aivent-complete/images/news/1.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/news/2.webp',
        path: 'assets/aivent-complete/images/news/2.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/news/3.webp',
        path: 'assets/aivent-complete/images/news/3.webp'
    },
    
    // Partner/Sponsor logos
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo/1.webp',
        path: 'assets/aivent-complete/images/logo/partner-1.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo/2.webp',
        path: 'assets/aivent-complete/images/logo/partner-2.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo/3.webp',
        path: 'assets/aivent-complete/images/logo/partner-3.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo/4.webp',
        path: 'assets/aivent-complete/images/logo/partner-4.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/logo/5.webp',
        path: 'assets/aivent-complete/images/logo/partner-5.webp'
    },
    
    // Video files
    {
        url: 'https://madebydesignesia.com/themes/aivent/video/1.mp4',
        path: 'assets/aivent-complete/videos/hero-background.mp4'
    },
    
    // Additional graphics
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/misc/1.webp',
        path: 'assets/aivent-complete/images/misc-1.webp'
    },
    {
        url: 'https://madebydesignesia.com/themes/aivent/images/misc/2.webp',
        path: 'assets/aivent-complete/images/misc-2.webp'
    }
];

// Download all assets
const downloadAllAssets = async () => {
    console.log('🚀 Starting AIvent Complete Asset Download...\n');
    
    createDirectories();
    
    let successCount = 0;
    let failCount = 0;
    
    for (const asset of assets) {
        try {
            await downloadFile(asset.url, asset.path);
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to download ${asset.url}:`, error.message);
            failCount++;
        }
    }
    
    console.log('\n📊 Download Summary:');
    console.log(`✅ Successful downloads: ${successCount}`);
    console.log(`❌ Failed downloads: ${failCount}`);
    console.log(`📁 Total assets: ${assets.length}`);
    
    if (successCount > 0) {
        console.log('\n🎉 Asset download completed! Ready to build pixel-perfect AIvent clone.');
    }
};

// Run the download
if (require.main === module) {
    downloadAllAssets().catch(console.error);
}

module.exports = { downloadAllAssets, assets };
