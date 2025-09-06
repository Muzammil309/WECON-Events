// Simple test to validate Prisma schema without Figma interference
const { execSync } = require('child_process');

try {
  console.log('Testing Prisma schema validation...');
  
  // Set environment variable to bypass Figma
  process.env.FIGMA_API_TOKEN = 'figd_dummy_token_for_build_bypass_12345678901234567890123456789012345678901234567890';
  
  // Try to validate the schema
  const result = execSync('npx prisma validate', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Prisma schema validation passed!');
  console.log(result);
  
} catch (error) {
  console.log('❌ Prisma schema validation failed:');
  console.log(error.stdout || error.message);
  console.log(error.stderr);
}

try {
  console.log('\nTesting Prisma generate...');
  
  const generateResult = execSync('npx prisma generate', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Prisma generate completed successfully!');
  console.log(generateResult);
  
} catch (error) {
  console.log('❌ Prisma generate failed:');
  console.log(error.stdout || error.message);
  console.log(error.stderr);
}
