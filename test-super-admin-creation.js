// Test Super Admin Creation with Correct Credentials
// This script tests the super admin creation with the updated email

import { api } from './lib/supabase.js'

async function testSuperAdminCreation() {
  console.log('🧪 Testing Super Admin Creation with Correct Credentials...\n')

  try {
    console.log('📧 Creating super admin with email: admin@wecon.events')
    const result = await api.createSuperAdmin()

    if (result) {
      console.log('✅ Super admin created successfully!')
      console.log('📋 Result:', result)
      console.log('\n🔑 Login Credentials:')
      console.log('   Email: admin@wecon.events')
      console.log('   Password: SuperAdmin123!')
      console.log('\n🌐 Next Steps:')
      console.log('   1. Go to: https://wecon-masawat.vercel.app/login')
      console.log('   2. Use the credentials above to login')
      console.log('   3. You should be redirected to the admin dashboard')
    }
  } catch (error) {
    console.error('❌ Super admin creation failed:', error.message)

    if (error.message.includes('already exists')) {
      console.log('\n✅ Super admin already exists! You can login with:')
      console.log('   Email: admin@wecon.events')
      console.log('   Password: SuperAdmin123!')
    } else {
      console.log('\n🔧 Troubleshooting:')
      console.log('   1. Check your Supabase connection')
      console.log('   2. Verify the database schema is applied')
      console.log('   3. Check the console for detailed error messages')
    }
  }
}

// Run the test
testSuperAdminCreation()
