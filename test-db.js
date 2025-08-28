// Quick test to verify database connection and user data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing database connection and user data...');
  
  try {
    // Test database connection
    console.log('\n1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if users exist
    console.log('\n2. Checking users in database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true // We'll check if passwords are hashed
      }
    });
    
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Password length: ${user.password?.length || 0}`);
    });
    
    // Test specific admin user
    console.log('\n3. Testing admin user lookup...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@wecon-masawat.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        passwordHashed: adminUser.password?.startsWith('$2') ? 'Yes' : 'No',
        passwordLength: adminUser.password?.length
      });
    } else {
      console.log('❌ Admin user not found!');
    }
    
    // Test attendee user
    console.log('\n4. Testing attendee user lookup...');
    const attendeeUser = await prisma.user.findUnique({
      where: { email: 'attendee@wecon-masawat.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    if (attendeeUser) {
      console.log('✅ Attendee user found:', {
        id: attendeeUser.id,
        email: attendeeUser.email,
        name: attendeeUser.name,
        role: attendeeUser.role,
        passwordHashed: attendeeUser.password?.startsWith('$2') ? 'Yes' : 'No',
        passwordLength: attendeeUser.password?.length
      });
    } else {
      console.log('❌ Attendee user not found!');
    }
    
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase().catch(console.error);
