import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wecon-masawat.com' },
    update: {},
    create: {
      email: 'admin@wecon-masawat.com',
      password: 'admin123', // In production, this should be hashed
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      isActive: true,
      company: 'WECON Masawat',
      jobTitle: 'Event Administrator',
      bio: 'Event management administrator for WECON Masawat 2024'
    }
  });

  // Create demo attendee user
  const attendeeUser = await prisma.user.upsert({
    where: { email: 'attendee@wecon-masawat.com' },
    update: {},
    create: {
      email: 'attendee@wecon-masawat.com',
      password: 'attendee123', // In production, this should be hashed
      name: 'Demo Attendee',
      role: 'ATTENDEE',
      isActive: true,
      company: 'Tech Innovations Ltd',
      jobTitle: 'Senior Developer',
      bio: 'Passionate about technology and innovation. Looking forward to networking at WECON Masawat 2024.',
      phone: '+92 300 1234567',
      linkedinUrl: 'https://linkedin.com/in/demo-attendee',
      twitterUrl: 'https://twitter.com/demo_attendee',
      website: 'https://demo-attendee.com'
    }
  });

  // Create attendee profile
  await prisma.attendeeProfile.upsert({
    where: { userId: attendeeUser.id },
    update: {},
    create: {
      userId: attendeeUser.id,
      interests: JSON.stringify(['Technology', 'AI/ML', 'Web Development']),
      dietaryReqs: 'Vegetarian',
      emergencyContact: 'John Doe - +92 300 9876543',
      tshirtSize: 'L',
      networkingOptIn: true
    }
  });

  // Create main event first
  const event = await prisma.event.upsert({
    where: { slug: 'wecon-masawat-2024' },
    update: {},
    create: {
      name: 'WECON Masawat 2024',
      slug: 'wecon-masawat-2024',
      description: 'The premier technology and innovation conference in Pakistan, bringing together industry leaders, entrepreneurs, and tech enthusiasts.',
      startAt: new Date('2024-03-15T09:00:00Z'),
      endAt: new Date('2024-03-17T18:00:00Z'),
      venue: 'Karachi Expo Center, Pakistan',
      status: 'PUBLISHED',
      managerId: adminUser.id,
      maxAttendees: 2000,
      registrationDeadline: new Date('2024-03-10T23:59:59Z'),
      category: 'Technology',
      tags: JSON.stringify(['Technology', 'Innovation', 'Startups', 'AI', 'Blockchain']),
      website: 'https://wecon-masawat.com',
      isPublic: true,
      registrationOpen: true
    }
  });

  // Create main venue
  const venue = await prisma.venue.create({
    data: {
      eventId: event.id,
      name: 'Karachi Expo Center',
      address: 'University Road, Karachi, Pakistan',
      description: 'Premier exhibition and conference venue in Karachi',
      capacity: 5000,
      facilities: JSON.stringify(['WiFi', 'Parking', 'Food Court', 'Prayer Room', 'Accessibility']),
      isAccessible: true,
      coordinates: JSON.stringify({ lat: 24.9465, lng: 67.1139 })
    }
  });

  // Create rooms
  const mainAuditorium = await prisma.room.create({
    data: {
      eventId: event.id,
      venueId: venue.id,
      name: 'Main Auditorium',
      capacity: 1000,
      location: 'Ground Floor',
      equipment: JSON.stringify(['Projector', 'Sound System', 'Microphones', 'Stage Lighting']),
      isAccessible: true
    }
  });

  const conferenceRoomA = await prisma.room.create({
    data: {
      eventId: event.id,
      venueId: venue.id,
      name: 'Conference Room A',
      capacity: 200,
      location: 'First Floor',
      equipment: JSON.stringify(['Projector', 'Whiteboard', 'Video Conferencing']),
      isAccessible: true
    }
  });

  // Create speaker user
  const speakerUser = await prisma.user.upsert({
    where: { email: 'speaker@wecon-masawat.com' },
    update: {},
    create: {
      email: 'speaker@wecon-masawat.com',
      password: 'speaker123', // In production, this should be hashed
      name: 'Dr. Sarah Johnson',
      role: 'SPEAKER',
      isActive: true,
      company: 'Tech Innovations Institute',
      jobTitle: 'Chief Technology Officer',
      bio: 'Leading expert in AI and machine learning with over 15 years of experience in the tech industry.'
    }
  });

  // Create speaker profile
  const speakerProfile = await prisma.speakerProfile.upsert({
    where: { userId: speakerUser.id },
    update: {},
    create: {
      userId: speakerUser.id,
      bio: 'Dr. Sarah Johnson is a renowned technology leader and AI researcher.',
      expertise: JSON.stringify(['Artificial Intelligence', 'Machine Learning', 'Technology Strategy']),
      speakingTopics: JSON.stringify(['Future of AI', 'Tech Innovation', 'Digital Transformation']),
      pastEvents: JSON.stringify(['TechCrunch Disrupt', 'Web Summit', 'AI Conference 2023'])
    }
  });

  // Create sessions
  const openingKeynote = await prisma.session.create({
    data: {
      eventId: event.id,
      roomId: mainAuditorium.id,
      title: 'Opening Keynote: Future of Event Technology',
      abstract: 'Exploring how technology is revolutionizing the events industry and what the future holds for event management platforms.',
      startAt: new Date('2024-03-15T09:00:00Z'),
      endAt: new Date('2024-03-15T10:00:00Z'),
      track: 'Technology'
    }
  });

  const panelSession = await prisma.session.create({
    data: {
      eventId: event.id,
      roomId: conferenceRoomA.id,
      title: 'Panel: Digital Transformation in Events',
      abstract: 'Industry experts discuss the challenges and opportunities in digital transformation for the events industry.',
      startAt: new Date('2024-03-15T10:30:00Z'),
      endAt: new Date('2024-03-15T12:00:00Z'),
      track: 'Business'
    }
  });

  const workshop = await prisma.session.create({
    data: {
      eventId: event.id,
      roomId: conferenceRoomA.id,
      title: 'Workshop: Event Marketing Strategies',
      abstract: 'Hands-on workshop covering modern marketing strategies for successful event promotion.',
      startAt: new Date('2024-03-15T14:00:00Z'),
      endAt: new Date('2024-03-15T16:00:00Z'),
      track: 'Marketing'
    }
  });

  // Assign speaker to sessions
  await prisma.sessionSpeaker.create({
    data: {
      sessionId: openingKeynote.id,
      speakerId: speakerProfile.id
    }
  });

  // Create session bookmark for demo attendee
  await prisma.sessionBookmark.create({
    data: {
      userId: attendeeUser.id,
      sessionId: openingKeynote.id
    }
  });

  await prisma.sessionBookmark.create({
    data: {
      userId: attendeeUser.id,
      sessionId: workshop.id
    }
  });

  // Create some demo check-ins
  await prisma.checkIn.create({
    data: {
      userId: attendeeUser.id,
      sessionId: openingKeynote.id,
      type: 'session',
      checkInAt: new Date()
    }
  });

  await prisma.checkIn.create({
    data: {
      userId: attendeeUser.id,
      venueId: venue.id,
      type: 'venue',
      checkInAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`📧 Admin user: admin@wecon-masawat.com`);
  console.log(`📧 Demo attendee: attendee@wecon-masawat.com`);
  console.log(`🎪 Event: ${event.name}`);
  console.log(`🏢 Venue: ${venue.name}`);
  console.log(`📅 Sessions created: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
