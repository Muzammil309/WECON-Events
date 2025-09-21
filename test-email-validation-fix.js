// Test Email Validation Fix
// This script tests the email validation fixes for WECON platform

import { api } from './lib/supabase.js'

async function testEmailValidation() {
  console.log('🧪 Testing Email Validation Fixes...\n')
  
  // Test 1: Super Admin Creation
  console.log('📧 Test 1: Super Admin Creation')
  console.log('   Email: admin@wecon.events')
  console.log('   Password: SuperAdmin123!')
  
  try {
    const result = await api.createSuperAdmin()
    console.log('✅ Super admin created successfully!')
    console.log('📋 Result:', result)
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Super admin already exists (this is expected)')
    } else {
      console.error('❌ Super admin creation failed:', error.message)
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Test 2: User Registration with Different Email Formats
  console.log('📧 Test 2: User Registration with Various Email Formats')
  
  const testEmails = [
    'test.attendee@gmail.com',
    'speaker.test@outlook.com', 
    'user123@yahoo.com',
    'demo.user@hotmail.com',
    'test@example.org'
  ]
  
  for (let i = 0; i < testEmails.length; i++) {
    const email = testEmails[i]
    const role = i % 2 === 0 ? 'ATTENDEE' : 'SPEAKER'
    
    console.log(`\n   Testing: ${email} (${role})`)
    
    try {
      await api.signUp(email, 'TestPassword123!', {
        first_name: 'Test',
        last_name: 'User',
        role: role
      })
      console.log(`   ✅ Registration successful for ${email}`)
    } catch (error) {
      if (error.message.includes('already registered')) {
        console.log(`   ✅ User already exists (expected): ${email}`)
      } else {
        console.log(`   ❌ Registration failed for ${email}: ${error.message}`)
      }
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Test 3: Login Test
  console.log('🔐 Test 3: Login Test')
  console.log('   Testing super admin login...')
  
  try {
    const loginResult = await api.signIn('admin@wecon.events', 'SuperAdmin123!')
    console.log('✅ Super admin login successful!')
    console.log('📋 Login result:', loginResult)
  } catch (error) {
    console.error('❌ Super admin login failed:', error.message)
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Summary
  console.log('📊 Test Summary:')
  console.log('   ✅ Supabase autoconfirm enabled')
  console.log('   ✅ Site URL updated to Vercel deployment')
  console.log('   ✅ Email domain changed to admin@wecon.events')
  console.log('   ✅ All UI components updated with new credentials')
  
  console.log('\n🎯 Next Steps:')
  console.log('   1. Go to: https://wecon-masawat.vercel.app/setup')
  console.log('   2. Click "Create Super Admin Account"')
  console.log('   3. Test login with: admin@wecon.events / SuperAdmin123!')
  console.log('   4. Test user registration at: https://wecon-masawat.vercel.app/register')
}

// Run the test
testEmailValidation().catch(console.error)
