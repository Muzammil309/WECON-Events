const fs = require('fs');
const path = require('path');
const { downloadAllAssets } = require('./download-aivent-assets.js');
const { updateHtmlAssets, verifyLocalAssets } = require('./update-html-assets.js');

// Main setup function
async function setupWeconAssets(useSupabase = false) {
    console.log('🚀 WECON MASAWAT 2025 - Asset Setup Process\n');
    console.log('This script will:');
    console.log('1. Download all AIvent assets locally');
    console.log('2. Update HTML file to use local assets');
    console.log('3. Verify everything works properly');
    if (useSupabase) {
        console.log('4. Upload assets to Supabase (optional)');
    }
    console.log('\n' + '='.repeat(50) + '\n');
    
    try {
        // Step 1: Download assets
        console.log('📥 STEP 1: Downloading AIvent Assets');
        console.log('-'.repeat(40));
        
        const downloadResult = await downloadAllAssets();
        
        if (downloadResult.errorCount > 0) {
            console.log(`\n⚠️  Warning: ${downloadResult.errorCount} assets failed to download`);
            console.log('Continuing with available assets...\n');
        }
        
        // Step 2: Update HTML file
        console.log('🔄 STEP 2: Updating HTML File');
        console.log('-'.repeat(40));
        
        const htmlFilePath = path.join(process.cwd(), 'wecon-masawat-2025.html');
        
        if (!fs.existsSync(htmlFilePath)) {
            throw new Error(`HTML file not found: ${htmlFilePath}`);
        }
        
        // Create backup
        const backupPath = htmlFilePath.replace('.html', '-backup.html');
        fs.copyFileSync(htmlFilePath, backupPath);
        console.log(`💾 Backup created: ${backupPath}`);
        
        // Update HTML with local assets
        const updateSuccess = updateHtmlAssets(htmlFilePath);
        
        if (!updateSuccess) {
            throw new Error('Failed to update HTML file');
        }
        
        // Step 3: Verify setup
        console.log('\n🔍 STEP 3: Verifying Setup');
        console.log('-'.repeat(40));
        
        const allAssetsExist = verifyLocalAssets();
        
        if (allAssetsExist) {
            console.log('✅ All assets verified successfully!');
        } else {
            console.log('⚠️  Some assets are missing, but setup will continue');
        }
        
        // Step 4: Supabase upload (optional)
        if (useSupabase) {
            console.log('\n☁️  STEP 4: Uploading to Supabase');
            console.log('-'.repeat(40));
            
            try {
                const { uploadAllAssets: uploadToSupabase } = require('./upload-to-supabase.js');
                await uploadToSupabase();
                console.log('✅ Supabase upload completed!');
            } catch (error) {
                console.log(`⚠️  Supabase upload failed: ${error.message}`);
                console.log('Local assets are still available');
            }
        }
        
        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('🎉 WECON MASAWAT 2025 Setup Complete!');
        console.log('='.repeat(50));
        
        console.log('\n📊 Setup Summary:');
        console.log(`✅ Downloaded: ${downloadResult.downloadCount} assets`);
        console.log(`❌ Failed: ${downloadResult.errorCount} assets`);
        console.log(`📁 Assets location: ./assets/aivent/`);
        console.log(`📄 Updated HTML: wecon-masawat-2025.html`);
        console.log(`💾 Backup: ${path.basename(backupPath)}`);
        
        console.log('\n🚀 Next Steps:');
        console.log('1. Open wecon-masawat-2025.html in your browser');
        console.log('2. Verify all images and videos load properly');
        console.log('3. Test offline functionality');
        console.log('4. Deploy to your hosting platform');
        
        if (!useSupabase) {
            console.log('\n💡 Pro Tip:');
            console.log('Run with --supabase flag to upload assets to Supabase CDN:');
            console.log('node scripts/setup-wecon-assets.js --supabase');
        }
        
        return true;
        
    } catch (error) {
        console.error('\n💥 Setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your internet connection');
        console.log('2. Ensure you have write permissions');
        console.log('3. Verify the HTML file exists');
        console.log('4. Try running individual scripts manually');
        
        return false;
    }
}

// Function to test the website
function testWebsite() {
    console.log('🧪 Testing WECON MASAWAT 2025 Website\n');
    
    const htmlFilePath = path.join(process.cwd(), 'wecon-masawat-2025.html');
    
    if (!fs.existsSync(htmlFilePath)) {
        console.error('❌ HTML file not found');
        return false;
    }
    
    // Read HTML content
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Check for external AIvent URLs (should be none)
    const aiventUrls = htmlContent.match(/https:\/\/madebydesignesia\.com\/themes\/aivent\//g);
    
    if (aiventUrls) {
        console.log(`⚠️  Found ${aiventUrls.length} remaining AIvent URLs`);
        console.log('Some assets may not have been replaced properly');
        return false;
    } else {
        console.log('✅ No external AIvent URLs found');
    }
    
    // Check for local asset references
    const localAssets = htmlContent.match(/\.\/assets\/aivent\//g);
    
    if (localAssets) {
        console.log(`✅ Found ${localAssets.length} local asset references`);
    } else {
        console.log('⚠️  No local asset references found');
    }
    
    // Verify critical assets exist
    const criticalAssets = [
        './assets/aivent/video/2.mp4',
        './assets/aivent/images/team/1.webp',
        './assets/aivent/images/misc/c1.webp'
    ];
    
    let missingCritical = 0;
    criticalAssets.forEach(asset => {
        if (!fs.existsSync(asset)) {
            console.log(`❌ Missing critical asset: ${asset}`);
            missingCritical++;
        } else {
            console.log(`✅ Found critical asset: ${asset}`);
        }
    });
    
    if (missingCritical === 0) {
        console.log('\n🎉 Website test passed! All critical assets are available.');
        return true;
    } else {
        console.log(`\n⚠️  Website test failed: ${missingCritical} critical assets missing`);
        return false;
    }
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    const useSupabase = args.includes('--supabase');
    const testOnly = args.includes('--test');
    
    if (testOnly) {
        testWebsite();
    } else {
        setupWeconAssets(useSupabase);
    }
}

// Export functions
module.exports = {
    setupWeconAssets,
    testWebsite
};

// Run if called directly
if (require.main === module) {
    main();
}
