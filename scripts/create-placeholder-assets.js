const fs = require('fs');
const path = require('path');

// Create placeholder images for missing assets
const createPlaceholderAssets = () => {
    console.log('🎨 Creating placeholder assets for missing files...\n');
    
    const placeholders = [
        // Logo files
        {
            source: 'assets/aivent-complete/images/logo.webp',
            target: 'assets/aivent-complete/images/logo/logo-big-w.webp'
        },
        
        // News images (copy team images as placeholders)
        {
            source: 'assets/aivent-complete/images/team/1.webp',
            target: 'assets/aivent-complete/images/news/1.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/2.webp',
            target: 'assets/aivent-complete/images/news/2.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/3.webp',
            target: 'assets/aivent-complete/images/news/3.webp'
        },
        
        // Partner logos (copy team images as placeholders)
        {
            source: 'assets/aivent-complete/images/team/1.webp',
            target: 'assets/aivent-complete/images/logo/partner-1.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/2.webp',
            target: 'assets/aivent-complete/images/logo/partner-2.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/3.webp',
            target: 'assets/aivent-complete/images/logo/partner-3.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/4.webp',
            target: 'assets/aivent-complete/images/logo/partner-4.webp'
        },
        {
            source: 'assets/aivent-complete/images/team/5.webp',
            target: 'assets/aivent-complete/images/logo/partner-5.webp'
        },
        
        // Misc images (copy background images as placeholders)
        {
            source: 'assets/aivent-complete/images/background/1.webp',
            target: 'assets/aivent-complete/images/misc-1.webp'
        },
        {
            source: 'assets/aivent-complete/images/background/2.webp',
            target: 'assets/aivent-complete/images/misc-2.webp'
        }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    placeholders.forEach(placeholder => {
        try {
            if (fs.existsSync(placeholder.source)) {
                // Create target directory if it doesn't exist
                const targetDir = path.dirname(placeholder.target);
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                
                // Copy source to target
                fs.copyFileSync(placeholder.source, placeholder.target);
                console.log(`✅ Created placeholder: ${path.basename(placeholder.target)}`);
                successCount++;
            } else {
                console.log(`⚠️ Source not found: ${placeholder.source}`);
                failCount++;
            }
        } catch (error) {
            console.error(`❌ Failed to create ${placeholder.target}:`, error.message);
            failCount++;
        }
    });
    
    console.log('\n📊 Placeholder Creation Summary:');
    console.log(`✅ Successful placeholders: ${successCount}`);
    console.log(`❌ Failed placeholders: ${failCount}`);
    console.log(`📁 Total placeholders: ${placeholders.length}`);
    
    if (successCount > 0) {
        console.log('\n🎉 Placeholder assets created! Website should now display properly.');
    }
};

// Run the placeholder creation
if (require.main === module) {
    createPlaceholderAssets();
}

module.exports = { createPlaceholderAssets };
