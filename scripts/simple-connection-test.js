#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 */

const { execSync } = require('child_process');

console.log('🔍 Testing Supabase Connection...\n');

// Test 1: Check if we can resolve the hostname
console.log('📡 Testing hostname resolution...');
try {
  execSync('nslookup db.negldflnvdjqoukvftyx.supabase.co', { stdio: 'inherit' });
  console.log('✅ Hostname resolves correctly\n');
} catch (error) {
  console.log('❌ Hostname resolution failed\n');
}

// Test 2: Try to connect with psql (if available)
console.log('🔌 Testing direct PostgreSQL connection...');
try {
  const connectionString = 'postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres';
  console.log(`Connection string: ${connectionString.replace(/:[^@]+@/, ':****@')}`);
  
  // Try a simple connection test
  execSync(`psql "${connectionString}" -c "SELECT version();" 2>&1 || echo "psql not available or connection failed"`, { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Direct connection test failed');
}

console.log('\n📋 Troubleshooting checklist:');
console.log('1. ✅ Project Reference ID: [YOUR-PROJECT-REF]');
console.log('2. ❓ Password: [YOUR-PASSWORD] (verify this is correct)');
console.log('3. ❓ Project Status: Check if project is active in Supabase dashboard');
console.log('4. ❓ Network: Check if your network allows connections to Supabase');

console.log('\n🔧 Next steps:');
console.log('1. Verify password in Supabase dashboard');
console.log('2. Check project status is "Active"');
console.log('3. Try copying the exact connection string from Supabase dashboard');
console.log('4. Ensure your Supabase project has been fully provisioned');
