#!/usr/bin/env node

/**
 * WECON Masawat Database Migration Script
 * Migrates from Neon to Supabase database
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n🔄 Step ${step}: ${message}`, 'cyan');
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

async function main() {
  log('\n🚀 WECON Masawat Database Migration', 'bright');
  log('=====================================', 'bright');
  log('Migrating from Neon to Supabase database\n');

  try {
    // Step 1: Check prerequisites
    logStep(1, 'Checking prerequisites');
    
    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      logWarning('.env file not found. Creating template...');
      const envTemplate = `# WECON Masawat Environment Variables
# Replace [YOUR-PASSWORD] with your actual Supabase database password

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres
NEXTAUTH_SECRET=d48a7fac2990b9cca4a08ed6457203ee06b2b16f1a396ff47094712b9fa91239
JWT_SECRET=86f164addc398e6da202c8f62fa8155dacdead8cf9fbf7189e5356e1a12a87c8
NEXTAUTH_URL=https://wecon-events.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
`;
      fs.writeFileSync(envPath, envTemplate);
      logError('Please update the DATABASE_URL in .env file with your Supabase password and run this script again.');
      process.exit(1);
    }

    // Check if DATABASE_URL contains placeholder
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('[YOUR-PASSWORD]')) {
      logError('Please replace [YOUR-PASSWORD] in .env file with your actual Supabase database password.');
      log('\nGet your password from: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr/settings/database', 'blue');
      process.exit(1);
    }

    logSuccess('Prerequisites checked');

    // Step 2: Generate Prisma client
    logStep(2, 'Generating Prisma client');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      logSuccess('Prisma client generated');
    } catch (error) {
      logError('Failed to generate Prisma client');
      throw error;
    }

    // Step 3: Test database connection
    logStep(3, 'Testing database connection');
    try {
      execSync('npx prisma db pull --force', { stdio: 'inherit' });
      logSuccess('Database connection successful');
    } catch (error) {
      logError('Database connection failed. Please check your DATABASE_URL.');
      throw error;
    }

    // Step 4: Push schema to Supabase
    logStep(4, 'Pushing schema to Supabase database');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      logSuccess('Schema pushed to Supabase');
    } catch (error) {
      logError('Failed to push schema to database');
      throw error;
    }

    // Step 5: Verify migration
    logStep(5, 'Verifying migration');
    try {
      log('Opening Prisma Studio to verify database...');
      log('Press Ctrl+C to close Prisma Studio when done verifying.', 'yellow');
      execSync('npx prisma studio', { stdio: 'inherit' });
    } catch (error) {
      // Prisma Studio was closed, this is expected
      logSuccess('Database verification completed');
    }

    // Success message
    log('\n🎉 Migration Completed Successfully!', 'green');
    log('=====================================', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('1. Update Vercel environment variables:', 'blue');
    log('   https://vercel.com/muzammil309s-projects/wecon-events/settings/environment-variables', 'blue');
    log('\n2. Set these variables in Vercel:', 'blue');
    log('   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres');
    log('   NEXTAUTH_URL=https://wecon-events.vercel.app');
    log('\n3. Deploy to Vercel and test the application', 'blue');
    log('\n4. Verify the new domain: https://wecon-events.vercel.app', 'blue');

  } catch (error) {
    logError(`Migration failed: ${error.message}`);
    log('\n🔄 Rollback Instructions:', 'yellow');
    log('1. Revert DATABASE_URL to your old Neon connection string');
    log('2. Revert NEXTAUTH_URL to https://wecon-events-five.vercel.app');
    log('3. Redeploy the application');
    process.exit(1);
  }
}

// Run the migration
main().catch(console.error);
