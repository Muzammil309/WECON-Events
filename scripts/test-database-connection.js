#!/usr/bin/env node

/**
 * WECON Masawat - Database Connection Test
 * Tests connection to new Supabase database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function main() {
  log('\n🔍 WECON Masawat - Database Connection Test', 'bright');
  log('==========================================', 'bright');

  // Step 1: Check .env file
  log('\n🔄 Step 1: Checking .env file', 'cyan');
  
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    logError('.env file not found!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const databaseUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  
  if (!databaseUrlMatch) {
    logError('DATABASE_URL not found in .env file');
    process.exit(1);
  }

  const databaseUrl = databaseUrlMatch[1].trim();
  logInfo(`Found DATABASE_URL: ${databaseUrl}`);

  // Step 2: Parse connection string
  log('\n🔄 Step 2: Parsing connection details', 'cyan');
  
  try {
    const url = new URL(databaseUrl);
    logInfo(`Protocol: ${url.protocol}`);
    logInfo(`Username: ${url.username}`);
    logInfo(`Password: ${url.password ? '[HIDDEN]' : 'NOT SET'}`);
    logInfo(`Host: ${url.hostname}`);
    logInfo(`Port: ${url.port}`);
    logInfo(`Database: ${url.pathname.substring(1)}`);

    // Check for common issues
    if (url.password.includes('[') || url.password.includes(']')) {
      logError('Password contains brackets - this will cause connection errors!');
      logWarning('Remove brackets from password in .env file');
    }

    if (url.hostname.includes('[') || url.hostname.includes(']')) {
      logError('Hostname contains brackets - this will cause connection errors!');
      logWarning('Remove brackets from hostname in .env file');
    }

  } catch (error) {
    logError(`Invalid DATABASE_URL format: ${error.message}`);
    logWarning('Expected format: postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres');
    process.exit(1);
  }

  // Step 3: Test basic connection
  log('\n🔄 Step 3: Testing database connection', 'cyan');
  
  try {
    logInfo('Running: npx prisma db pull --force');
    execSync('npx prisma db pull --force', { stdio: 'inherit' });
    logSuccess('Database connection successful!');
  } catch (error) {
    logError('Database connection failed');
    
    log('\n🔧 Troubleshooting Steps:', 'yellow');
    log('1. Verify your Supabase project is active', 'blue');
    log('2. Check database password is correct', 'blue');
    log('3. Ensure project reference ID is correct', 'blue');
    log('4. Verify your Supabase project URL:', 'blue');
    log('   https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr/settings/database', 'blue');
    
    process.exit(1);
  }

  // Step 4: Test schema push
  log('\n🔄 Step 4: Testing schema push', 'cyan');
  
  try {
    logInfo('Running: npx prisma db push');
    execSync('npx prisma db push', { stdio: 'inherit' });
    logSuccess('Schema pushed successfully!');
  } catch (error) {
    logError('Schema push failed');
    logWarning('This might be due to existing schema or permissions');
  }

  log('\n🎉 Database Connection Test Complete!', 'green');
  log('=====================================', 'green');
  
  log('\n📋 Next Steps:', 'bright');
  log('1. Update Vercel environment variables with the same DATABASE_URL', 'blue');
  log('2. Deploy to Vercel: git push origin main', 'blue');
  log('3. Test the live application: https://wecon-masawat.vercel.app', 'blue');
}

// Run the test
main().catch(console.error);
