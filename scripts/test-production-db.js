#!/usr/bin/env node

/**
 * Production Database Test Script for WECON Masawat
 * This script tests the production database connection and verifies users exist
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:Masawat2024!@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres"
    }
  },
  log: ['query', 'info', 'warn', 'error']
});

async function testProductionDatabase() {
  try {
    console.log('🔍 Testing production database connection...');
    console.log('📡 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Using default');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if users table exists and has data
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('⚠️  No users found in database - need to run setup script');
      return false;
    }

    // Check for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@wecon-masawat.com' },
      select: { id: true, email: true, role: true, name: true }
    });

    if (adminUser) {
      console.log('✅ Admin user found:', adminUser);
    } else {
      console.log('❌ Admin user not found');
      return false;
    }

    // List all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true, emailVerified: true }
    });

    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} - Verified: ${!!user.emailVerified}`);
    });

    console.log('\n✅ Production database test completed successfully');
    return true;

  } catch (error) {
    console.error('❌ Production database test failed:', error);
    console.error('Error details:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testProductionDatabase()
    .then((success) => {
      if (success) {
        console.log('🎯 Production database is ready for authentication');
        process.exit(0);
      } else {
        console.log('🚨 Production database needs setup - run setup-production-db.js');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Critical database error:', error);
      process.exit(1);
    });
}

module.exports = { testProductionDatabase };
