const fs = require('fs');
const path = require('path');

// Asset URL mappings from AIvent to local paths
const ASSET_MAPPINGS = {
    // Speaker images
    'https://madebydesignesia.com/themes/aivent/images/team/1.webp': './assets/aivent/images/team/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/team/2.webp': './assets/aivent/images/team/2.webp', 
    'https://madebydesignesia.com/themes/aivent/images/team/3.webp': './assets/aivent/images/team/3.webp',
    
    // Logo images
    'https://madebydesignesia.com/themes/aivent/images/logo.webp': './assets/aivent/images/logo.webp',
    'https://madebydesignesia.com/themes/aivent/images/logo-big-white.webp': './assets/aivent/images/logo-big-white.webp',
    
    // Partner logos
    'https://madebydesignesia.com/themes/aivent/images/logo-light/1.webp': './assets/aivent/images/logo-light/1.webp',
    'https://madebydesignesia.com/themes/aivent/images/logo-light/2.webp': './assets/aivent/images/logo-light/2.webp',
    'https://madebydesignesia.com/themes/aivent/images/logo-light/3.webp': './assets/aivent/images/logo-light/3.webp',
    'https://madebydesignesia.com/themes/aivent/images/logo-light/4.webp': './assets/aivent/images/logo-light/4.webp',
    'https://madebydesignesia.com/themes/aivent/images/logo-light/5.webp': './assets/aivent/images/logo-light/5.webp',
    
    // Misc graphics
    'https://madebydesignesia.com/themes/aivent/images/misc/c1.webp': './assets/aivent/images/misc/c1.webp',
    
    // Videos
    'https://madebydesignesia.com/themes/aivent/video/2.mp4': './assets/aivent/video/2.mp4'
};

// Function to update HTML file with local asset paths
function updateHtmlAssets(htmlFilePath, outputPath = null) {
    console.log(`🔄 Updating HTML file: ${htmlFilePath}`);
    
    // Read the HTML file
    let htmlContent;
    try {
        htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    } catch (error) {
        console.error(`❌ Error reading HTML file: ${error.message}`);
        return false;
    }
    
    let updateCount = 0;
    
    // Replace each asset URL with local path
    for (const [originalUrl, localPath] of Object.entries(ASSET_MAPPINGS)) {
        const regex = new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = htmlContent.match(regex);
        
        if (matches) {
            htmlContent = htmlContent.replace(regex, localPath);
            updateCount += matches.length;
            console.log(`✅ Replaced ${matches.length} occurrence(s) of: ${path.basename(originalUrl)}`);
        }
    }
    
    // Write updated HTML file
    const finalOutputPath = outputPath || htmlFilePath;
    try {
        fs.writeFileSync(finalOutputPath, htmlContent, 'utf8');
        console.log(`💾 Updated HTML saved to: ${finalOutputPath}`);
        console.log(`📊 Total replacements made: ${updateCount}`);
        return true;
    } catch (error) {
        console.error(`❌ Error writing HTML file: ${error.message}`);
        return false;
    }
}

// Function to create a backup of the original file
function createBackup(filePath) {
    const backupPath = filePath.replace('.html', '-backup.html');
    try {
        fs.copyFileSync(filePath, backupPath);
        console.log(`💾 Backup created: ${backupPath}`);
        return backupPath;
    } catch (error) {
        console.error(`❌ Error creating backup: ${error.message}`);
        return null;
    }
}

// Function to verify that local assets exist
function verifyLocalAssets() {
    console.log('🔍 Verifying local assets exist...');
    
    let missingCount = 0;
    let existingCount = 0;
    
    for (const [originalUrl, localPath] of Object.entries(ASSET_MAPPINGS)) {
        const fullPath = path.resolve(localPath);
        
        if (fs.existsSync(fullPath)) {
            console.log(`✅ Found: ${localPath}`);
            existingCount++;
        } else {
            console.log(`❌ Missing: ${localPath}`);
            missingCount++;
        }
    }
    
    console.log(`\n📊 Asset Verification Summary:`);
    console.log(`✅ Existing assets: ${existingCount}`);
    console.log(`❌ Missing assets: ${missingCount}`);
    
    return missingCount === 0;
}

// Main function
function main() {
    const htmlFilePath = path.join(process.cwd(), 'wecon-masawat-2025.html');
    
    console.log('🚀 Starting HTML asset update process...\n');
    
    // Check if HTML file exists
    if (!fs.existsSync(htmlFilePath)) {
        console.error(`❌ HTML file not found: ${htmlFilePath}`);
        process.exit(1);
    }
    
    // Verify local assets exist
    const allAssetsExist = verifyLocalAssets();
    if (!allAssetsExist) {
        console.log('\n⚠️  Some assets are missing. Please run the download script first.');
        console.log('Run: node scripts/download-aivent-assets.js');
        return;
    }
    
    // Create backup
    console.log('\n📋 Creating backup...');
    const backupPath = createBackup(htmlFilePath);
    
    // Update HTML file
    console.log('\n🔄 Updating asset URLs...');
    const success = updateHtmlAssets(htmlFilePath);
    
    if (success) {
        console.log('\n🎉 HTML asset update completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Open wecon-masawat-2025.html in browser to test');
        console.log('2. Verify all images and videos load properly');
        console.log('3. Check that the website works offline');
        
        if (backupPath) {
            console.log(`\n💾 Original file backed up to: ${backupPath}`);
        }
    } else {
        console.log('\n💥 HTML asset update failed!');
        process.exit(1);
    }
}

// Export functions for use in other scripts
module.exports = {
    updateHtmlAssets,
    updateHtmlWithSupabaseUrls,
    verifyLocalAssets,
    createBackup,
    ASSET_MAPPINGS
};

// Function to update HTML with Supabase URLs
function updateHtmlWithSupabaseUrls(htmlFilePath, supabaseUrl, bucketName = 'aivent-assets') {
    console.log(`🔄 Updating HTML file with Supabase URLs: ${htmlFilePath}`);

    let htmlContent;
    try {
        htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    } catch (error) {
        console.error(`❌ Error reading HTML file: ${error.message}`);
        return false;
    }

    let updateCount = 0;

    // Create Supabase URL mappings
    const supabaseBaseUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}`;

    for (const [originalUrl, localPath] of Object.entries(ASSET_MAPPINGS)) {
        // Convert local path to Supabase path
        const supabasePath = localPath.replace('./assets/aivent/', '');
        const supabaseFullUrl = `${supabaseBaseUrl}/${supabasePath}`;

        const regex = new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = htmlContent.match(regex);

        if (matches) {
            htmlContent = htmlContent.replace(regex, supabaseFullUrl);
            updateCount += matches.length;
            console.log(`✅ Replaced with Supabase URL: ${path.basename(originalUrl)}`);
        }
    }

    // Write updated HTML file
    try {
        fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
        console.log(`💾 Updated HTML with Supabase URLs saved to: ${htmlFilePath}`);
        console.log(`📊 Total Supabase URL replacements: ${updateCount}`);
        return true;
    } catch (error) {
        console.error(`❌ Error writing HTML file: ${error.message}`);
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    main();
}
