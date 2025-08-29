#!/usr/bin/env node

/**
 * Production Data Migration Script for WECON Masawat
 * This script handles the migration of existing data to the new schema
 * Specifically handles the managerId and creatorId fields that were made optional
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.xhkbbctbyyeoucwmdspr:Masawat2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    }
  },
  log: ['query', 'info', 'warn', 'error']
});

async function migrateProductionData() {
  try {
    console.log('🔄 Starting production data migration...');

    // First, ensure we have a default admin user to assign as manager
    let adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@wecon-masawat.com' },
          { role: 'SUPER_ADMIN' }
        ]
      }
    });

    if (!adminUser) {
      console.log('👤 Creating default admin user for data migration...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@wecon-masawat.com',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          emailVerified: new Date(),
        }
      });
      console.log('✅ Default admin user created');
    }

    // Check for events without managerId
    const eventsWithoutManager = await prisma.event.findMany({
      where: {
        managerId: null
      }
    });

    if (eventsWithoutManager.length > 0) {
      console.log(`🔧 Found ${eventsWithoutManager.length} events without manager, assigning to admin...`);
      
      await prisma.event.updateMany({
        where: {
          managerId: null
        },
        data: {
          managerId: adminUser.id
        }
      });
      
      console.log('✅ All events now have a manager assigned');
    }

    // Check for tasks without creatorId
    const tasksWithoutCreator = await prisma.task.findMany({
      where: {
        creatorId: null
      }
    });

    if (tasksWithoutCreator.length > 0) {
      console.log(`🔧 Found ${tasksWithoutCreator.length} tasks without creator, assigning to admin...`);
      
      await prisma.task.updateMany({
        where: {
          creatorId: null
        },
        data: {
          creatorId: adminUser.id
        }
      });
      
      console.log('✅ All tasks now have a creator assigned');
    }

    // Verify migration
    const totalEvents = await prisma.event.count();
    const eventsWithManager = await prisma.event.count({
      where: {
        managerId: { not: null }
      }
    });

    const totalTasks = await prisma.task.count();
    const tasksWithCreator = await prisma.task.count({
      where: {
        creatorId: { not: null }
      }
    });

    console.log('\n📊 Migration Summary:');
    console.log(`Events: ${eventsWithManager}/${totalEvents} have managers`);
    console.log(`Tasks: ${tasksWithCreator}/${totalTasks} have creators`);

    if (eventsWithManager === totalEvents && tasksWithCreator === totalTasks) {
      console.log('✅ Data migration completed successfully!');
      return true;
    } else {
      console.log('⚠️  Some records still need attention');
      return false;
    }

  } catch (error) {
    console.error('❌ Data migration failed:', error);
    console.error('Error details:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  migrateProductionData()
    .then((success) => {
      if (success) {
        console.log('🎯 Production data migration completed successfully');
        process.exit(0);
      } else {
        console.log('🚨 Production data migration needs attention');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Critical migration error:', error);
      process.exit(1);
    });
}

module.exports = { migrateProductionData };
