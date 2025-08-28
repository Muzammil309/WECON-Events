#!/usr/bin/env node

/**
 * Production Database Setup Script for WECON Masawat
 * This script sets up the production database with initial data
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.xhkbbctbyyeoucwmdspr:Masawat2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    }
  }
});

async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up production database...');

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('✅ Database already has users, skipping initial setup');
      return;
    }

    console.log('👤 Creating initial users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@wecon-masawat.com',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
      }
    });

    // Create attendee user
    const attendeePassword = await bcrypt.hash('attendee123', 12);
    const attendee = await prisma.user.create({
      data: {
        name: 'John Attendee',
        email: 'attendee@wecon-masawat.com',
        password: attendeePassword,
        role: 'ATTENDEE',
        emailVerified: new Date(),
      }
    });

    // Create speaker user
    const speakerPassword = await bcrypt.hash('speaker123', 12);
    const speaker = await prisma.user.create({
      data: {
        name: 'Jane Speaker',
        email: 'speaker@wecon-masawat.com',
        password: speakerPassword,
        role: 'SPEAKER',
        emailVerified: new Date(),
      }
    });

    console.log('✅ Initial users created successfully');
    console.log('📊 Database setup completed');

    // Verify the setup
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    console.log('\n🎯 Production Database Setup Complete!');
    console.log('\n📋 Available Login Credentials:');
    console.log('🔐 Admin: admin@wecon-masawat.com / admin123');
    console.log('🔐 Attendee: attendee@wecon-masawat.com / attendee123');
    console.log('🔐 Speaker: speaker@wecon-masawat.com / speaker123');

  } catch (error) {
    console.error('❌ Error setting up production database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  setupProductionDatabase()
    .then(() => {
      console.log('✅ Production database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupProductionDatabase };
