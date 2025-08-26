#!/usr/bin/env node

/**
 * WECON Masawat - New Supabase Account Setup Script
 * Helps configure environment variables for new Supabase account
 */

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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function main() {
  log('\n🚀 WECON Masawat - New Supabase Setup', 'bright');
  log('=====================================', 'bright');
  log('Setting up new Supabase account configuration\n');

  logStep(1, 'Gathering Supabase Project Information');
  
  log('\n📋 Please gather the following information from your NEW Supabase project:', 'yellow');
  log('   Go to: https://supabase.com/dashboard/projects', 'blue');
  log('   Select your NEW project, then:', 'blue');
  log('');
  log('   1. Project URL (from Settings > General):', 'yellow');
  log('      Example: https://abcdefghijklmnop.supabase.co', 'blue');
  log('');
  log('   2. Database Password (from Settings > Database):', 'yellow');
  log('      Look for "Connection string" section', 'blue');
  log('');
  log('   3. API Keys (from Settings > API):', 'yellow');
  log('      - anon/public key', 'blue');
  log('      - service_role key (keep this secret!)', 'blue');
  log('');

  logStep(2, 'Environment Variables Template');
  
  const envTemplate = `# WECON Masawat - New Supabase Configuration
# Replace the placeholder values with your actual Supabase project details

# ===== DATABASE CONNECTION =====
# Get from: Settings > Database > Connection string
DATABASE_URL=postgresql://postgres:[YOUR-NEW-SUPABASE-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# ===== APPLICATION URLS =====
# Updated domain (avoiding conflict)
NEXTAUTH_URL=https://wecon-masawat.vercel.app

# ===== AUTHENTICATION SECRETS =====
NEXTAUTH_SECRET=d48a7fac2990b9cca4a08ed6457203ee06b2b16f1a396ff47094712b9fa91239
JWT_SECRET=86f164addc398e6da202c8f62fa8155dacdead8cf9fbf7189e5356e1a12a87c8

# ===== ADMIN CREDENTIALS =====
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# ===== SUPABASE DIRECT ACCESS =====
# Get from: Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# ===== SITE CONFIGURATION =====
NEXT_PUBLIC_SITE_NAME=WECON Masawat

# ===== OPTIONAL INTEGRATIONS =====
INDICO_BASE_URL=
INDICO_API_KEY=
ATTENDIZE_BASE_URL=
ATTENDIZE_API_KEY=
NEXTCLOUD_BASE_URL=
NEXTCLOUD_USERNAME=
NEXTCLOUD_PASSWORD=
METABASE_SITE_URL=
METABASE_EMBED_SECRET_KEY=

# ===== SECURITY HEADERS =====
ALLOWED_FRAME_ANCESTORS=*
WORDPRESS_EMBED_ALLOWED_ORIGINS=*
`;

  // Write template to file
  const envPath = path.join(process.cwd(), '.env.new-supabase');
  fs.writeFileSync(envPath, envTemplate);
  
  logSuccess('Environment template created: .env.new-supabase');

  logStep(3, 'Vercel Environment Variables');
  
  log('\n📋 For Vercel deployment, set these environment variables:', 'yellow');
  log('   Go to: https://vercel.com/[your-username]/[project-name]/settings/environment-variables', 'blue');
  log('');
  log('   Required variables:', 'yellow');
  log('   ├── DATABASE_URL', 'blue');
  log('   ├── NEXTAUTH_URL', 'blue');
  log('   ├── NEXTAUTH_SECRET', 'blue');
  log('   ├── JWT_SECRET', 'blue');
  log('   ├── ADMIN_USERNAME', 'blue');
  log('   ├── ADMIN_PASSWORD', 'blue');
  log('   ├── NEXT_PUBLIC_SUPABASE_URL', 'blue');
  log('   └── NEXT_PUBLIC_SUPABASE_ANON_KEY', 'blue');

  logStep(4, 'Domain Configuration');
  
  log('\n📋 Domain setup options:', 'yellow');
  log('   Option A: Use wecon-masawat.vercel.app (recommended)', 'blue');
  log('   Option B: Use wecon-events-platform.vercel.app', 'blue');
  log('   Option C: Use masawat-events.vercel.app', 'blue');
  log('');
  log('   To set up domain in Vercel:', 'yellow');
  log('   1. Go to Project Settings > Domains', 'blue');
  log('   2. Add your chosen domain', 'blue');
  log('   3. Set as primary domain', 'blue');

  logStep(5, 'Database Schema Setup');
  
  log('\n📋 After updating environment variables:', 'yellow');
  log('   1. Copy .env.new-supabase to .env', 'blue');
  log('   2. Update placeholder values with your actual Supabase details', 'blue');
  log('   3. Run: npx prisma generate', 'blue');
  log('   4. Run: npx prisma db push', 'blue');
  log('   5. Verify: npx prisma studio', 'blue');

  logStep(6, 'Testing Checklist');
  
  log('\n📋 Test these after migration:', 'yellow');
  log('   ├── Database connection: npx prisma db pull', 'blue');
  log('   ├── Homepage: https://wecon-masawat.vercel.app', 'blue');
  log('   ├── Admin login: https://wecon-masawat.vercel.app/login', 'blue');
  log('   ├── User registration: https://wecon-masawat.vercel.app/signup', 'blue');
  log('   └── API endpoints: https://wecon-masawat.vercel.app/api/auth/login', 'blue');

  log('\n🎉 Setup Guide Complete!', 'green');
  log('=====================================', 'green');
  log('\n📁 Files created:', 'bright');
  log('   └── .env.new-supabase (environment template)', 'blue');
  log('\n📋 Next actions:', 'bright');
  log('   1. Get your new Supabase project details', 'blue');
  log('   2. Update .env.new-supabase with actual values', 'blue');
  log('   3. Copy to .env for local development', 'blue');
  log('   4. Update Vercel environment variables', 'blue');
  log('   5. Run database migration', 'blue');
  log('   6. Test the deployment', 'blue');
}

// Run the setup
main().catch(console.error);
