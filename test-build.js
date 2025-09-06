// Test script to verify build dependencies and configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build configuration...\n');

// Test 1: Check package.json dependencies
console.log('1. Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for Supabase dependency
  if (packageJson.dependencies['@supabase/supabase-js']) {
    console.log('✅ @supabase/supabase-js dependency found');
  } else {
    console.log('❌ @supabase/supabase-js dependency missing');
    process.exit(1);
  }
  
  // Check for Prisma dependency
  if (packageJson.dependencies['@prisma/client']) {
    console.log('✅ @prisma/client dependency found');
  } else {
    console.log('❌ @prisma/client dependency missing');
    process.exit(1);
  }
  
} catch (error) {
  console.log('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

// Test 2: Check environment configuration
console.log('\n2. Checking environment configuration...');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  
  if (envContent.includes('FIGMA_API_TOKEN')) {
    console.log('✅ FIGMA_API_TOKEN configured in .env');
  } else {
    console.log('⚠️  FIGMA_API_TOKEN not found in .env (may cause build issues)');
  }
  
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    console.log('✅ Supabase URL configured');
  } else {
    console.log('❌ Supabase URL not configured');
  }
  
} catch (error) {
  console.log('❌ Failed to read .env file:', error.message);
}

// Test 3: Check Vercel configuration
console.log('\n3. Checking Vercel configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.buildCommand) {
    console.log('✅ Build command configured:', vercelConfig.buildCommand);
  } else {
    console.log('❌ Build command not configured');
  }
  
  if (vercelConfig.env && vercelConfig.env.FIGMA_API_TOKEN) {
    console.log('✅ FIGMA_API_TOKEN configured in vercel.json');
  } else {
    console.log('⚠️  FIGMA_API_TOKEN not configured in vercel.json');
  }
  
} catch (error) {
  console.log('❌ Failed to read vercel.json:', error.message);
}

// Test 4: Check critical files exist
console.log('\n4. Checking critical files...');
const criticalFiles = [
  'src/lib/supabase-storage.ts',
  'src/app/api/signage/displays/route.ts',
  'src/app/signage/page.tsx',
  'prisma/schema.prisma'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 5: Check Prisma schema syntax
console.log('\n5. Checking Prisma schema...');
try {
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  // Check for digital signage models
  const requiredModels = ['SignageContent', 'DigitalDisplay', 'DigitalPlaylist', 'DisplayAssignment'];
  requiredModels.forEach(model => {
    if (schemaContent.includes(`model ${model}`)) {
      console.log(`✅ ${model} model found`);
    } else {
      console.log(`❌ ${model} model missing`);
    }
  });
  
  // Check for User relation to SignageContent
  if (schemaContent.includes('uploadedSignageContent SignageContent[]')) {
    console.log('✅ User -> SignageContent relation configured');
  } else {
    console.log('❌ User -> SignageContent relation missing');
  }
  
} catch (error) {
  console.log('❌ Failed to read Prisma schema:', error.message);
}

console.log('\n🎉 Build configuration test completed!');
console.log('\n📝 Next steps:');
console.log('1. Commit and push these changes to trigger Vercel deployment');
console.log('2. Set FIGMA_API_TOKEN in Vercel environment variables');
console.log('3. Ensure all Supabase environment variables are set in Vercel');
console.log('4. Monitor the deployment logs for any remaining issues');
