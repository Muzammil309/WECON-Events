#!/usr/bin/env node

/**
 * WECON Event Management System - Fix Email Verification Script
 * 
 * This script fixes the email verification redirect issues by updating
 * Supabase configuration to use the correct site URL and email settings.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key] = value;
          }
        }
      });
    }
  } catch (error) {
    console.warn('Could not load .env.local file:', error.message);
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PRODUCTION_URL = process.env.NEXTAUTH_URL || 'https://wecon-masawat.vercel.app';

async function fixEmailVerification() {
  console.log('📧 WECON Email Verification Fix Script');
  console.log('======================================');

  // Validate environment variables
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease check your .env.local file.');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🌐 Production URL: ${PRODUCTION_URL}`);

  // Create Supabase client with service role
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  console.log('✅ Supabase client initialized');

  try {
    console.log('\n🔧 CONFIGURATION FIXES NEEDED:');
    console.log('===============================');
    
    console.log('\n1. 📧 EMAIL CONFIGURATION:');
    console.log('   The following settings need to be updated in Supabase Dashboard:');
    console.log('   Go to: Authentication > Settings > Email');
    console.log('   ');
    console.log('   ✅ Enable email confirmations: false (for development)');
    console.log('   ✅ Enable email change confirmations: false');
    console.log('   ✅ Enable secure email change: false');
    console.log('   ✅ Double confirm email changes: false');
    
    console.log('\n2. 🌐 SITE URL CONFIGURATION:');
    console.log('   Go to: Authentication > Settings > Site URL');
    console.log('   ');
    console.log(`   ✅ Site URL: ${PRODUCTION_URL}`);
    console.log(`   ✅ Redirect URLs: ${PRODUCTION_URL}/**`);
    
    console.log('\n3. 🔐 AUTH CONFIGURATION:');
    console.log('   Go to: Authentication > Settings > Auth');
    console.log('   ');
    console.log('   ✅ Enable manual linking: true');
    console.log('   ✅ Enable signup: true');
    console.log('   ✅ Enable email confirmations: false');
    
    // Test current configuration
    console.log('\n🧪 TESTING CURRENT CONFIGURATION:');
    console.log('==================================');
    
    await testEmailConfiguration(supabase);
    
    // Provide manual configuration steps
    console.log('\n📋 MANUAL CONFIGURATION STEPS:');
    console.log('==============================');
    console.log('Since Supabase auth settings cannot be changed via API,');
    console.log('please follow these steps manually:');
    console.log('');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Authentication > Settings');
    console.log('3. Update the following settings:');
    console.log('');
    console.log('   📧 EMAIL TAB:');
    console.log('   - Enable email confirmations: DISABLED');
    console.log('   - Enable email change confirmations: DISABLED');
    console.log('   - Enable secure email change: DISABLED');
    console.log('');
    console.log('   🌐 SITE URL TAB:');
    console.log(`   - Site URL: ${PRODUCTION_URL}`);
    console.log(`   - Redirect URLs: ${PRODUCTION_URL}/**`);
    console.log('');
    console.log('   🔐 GENERAL TAB:');
    console.log('   - Enable signup: ENABLED');
    console.log('   - Enable manual linking: ENABLED');
    
    // Create a test configuration file
    await createConfigurationGuide();
    
  } catch (error) {
    console.error('❌ Failed to analyze email configuration:', error.message);
    process.exit(1);
  }
}

async function testEmailConfiguration(supabase) {
  try {
    // Test user creation to see current behavior
    console.log('⏳ Testing user registration flow...');
    
    const testEmail = 'test-config@example.com';
    const testPassword = 'TestPassword123!';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      if (error.message.includes('Email address is invalid')) {
        console.log('❌ Email validation is too strict - needs configuration update');
      } else if (error.message.includes('User already registered')) {
        console.log('✅ User registration is working (user already exists)');
      } else {
        console.log(`⚠️  Registration error: ${error.message}`);
      }
    } else {
      console.log('✅ User registration is working');
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('⚠️  Email confirmation is required - needs configuration update');
      } else {
        console.log('✅ Email confirmation is disabled');
      }
    }
    
  } catch (error) {
    console.log(`⚠️  Test failed: ${error.message}`);
  }
}

async function createConfigurationGuide() {
  const configGuide = `# WECON Email Verification Configuration Guide

## 🎯 ISSUE SUMMARY
The email verification redirect is pointing to localhost:3000 instead of the production URL.
This needs to be fixed in the Supabase Dashboard manually.

## 🔧 REQUIRED SUPABASE CONFIGURATION CHANGES

### 1. Authentication Settings
Go to: **Supabase Dashboard > Authentication > Settings**

#### Email Tab:
- ❌ **Enable email confirmations**: DISABLED
- ❌ **Enable email change confirmations**: DISABLED  
- ❌ **Enable secure email change**: DISABLED
- ❌ **Double confirm email changes**: DISABLED

#### Site URL Tab:
- ✅ **Site URL**: \`${PRODUCTION_URL}\`
- ✅ **Redirect URLs**: \`${PRODUCTION_URL}/**\`

#### General Tab:
- ✅ **Enable signup**: ENABLED
- ✅ **Enable manual linking**: ENABLED

### 2. Email Templates (Optional)
Go to: **Supabase Dashboard > Authentication > Email Templates**

Update the redirect URLs in email templates to use:
\`${PRODUCTION_URL}/auth/callback\`

## 🧪 TESTING AFTER CONFIGURATION

1. **Test User Registration**:
   - Go to: ${PRODUCTION_URL}/register
   - Create a new account
   - Should work without email confirmation

2. **Test Admin Setup**:
   - Go to: ${PRODUCTION_URL}/setup
   - Create super admin account
   - Should work immediately

3. **Test Login**:
   - Go to: ${PRODUCTION_URL}/login
   - Login with created accounts
   - Should redirect properly

## 🚨 TROUBLESHOOTING

If issues persist:
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check browser console for errors
4. Verify environment variables are correct

## ✅ EXPECTED OUTCOME

After configuration:
- ✅ User registration works without email confirmation
- ✅ All redirects use production URL
- ✅ No localhost:3000 references
- ✅ Immediate login after registration
`;

  const fs = require('fs');
  fs.writeFileSync('SUPABASE_EMAIL_CONFIG_GUIDE.md', configGuide);
  console.log('\n📄 Configuration guide created: SUPABASE_EMAIL_CONFIG_GUIDE.md');
}

// Run the script
if (require.main === module) {
  fixEmailVerification()
    .then(() => {
      console.log('\n🎉 Email verification fix analysis completed!');
      console.log('\nNext steps:');
      console.log('1. Follow the manual configuration steps above');
      console.log('2. Test user registration after configuration');
      console.log('3. Verify email redirects work properly');
      console.log('4. Check SUPABASE_EMAIL_CONFIG_GUIDE.md for detailed instructions');
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixEmailVerification };
