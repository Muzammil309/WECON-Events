import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch networking opportunities and connections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    const type = searchParams.get('type') || 'all'; // 'connections', 'recommendations', 'meetings', 'all'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result: any = {};

    // Get user's connections
    if (type === 'connections' || type === 'all') {
      const connections = await prisma.networkingConnection.findMany({
        where: {
          OR: [
            { requesterId: userId },
            { recipientId: userId }
          ],
          status: 'ACCEPTED',
          ...(eventId && { eventId })
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              jobTitle: true,
              avatarUrl: true,
              networkingProfile: true
            }
          },
          recipient: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              jobTitle: true,
              avatarUrl: true,
              networkingProfile: true
            }
          },
          event: {
            select: { id: true, name: true }
          }
        }
      });

      result.connections = connections.map(conn => ({
        id: conn.id,
        connectedUser: conn.requesterId === userId ? conn.recipient : conn.requester,
        connectedAt: conn.createdAt,
        event: conn.event,
        notes: conn.notes
      }));
    }

    // Get networking recommendations
    if (type === 'recommendations' || type === 'all') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { networkingProfile: true }
      });

      if (user?.networkingProfile) {
        const recommendations = await findNetworkingRecommendations(userId, eventId);
        result.recommendations = recommendations;
      }
    }

    // Get scheduled meetings
    if (type === 'meetings' || type === 'all') {
      const meetings = await prisma.networkingMeeting.findMany({
        where: {
          OR: [
            { requesterId: userId },
            { attendeeId: userId }
          ],
          ...(eventId && { eventId }),
          scheduledAt: { gte: new Date() }
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              company: true,
              jobTitle: true,
              avatarUrl: true
            }
          },
          attendee: {
            select: {
              id: true,
              name: true,
              company: true,
              jobTitle: true,
              avatarUrl: true
            }
          },
          event: {
            select: { id: true, name: true }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      });

      result.meetings = meetings;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Networking API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch networking data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create networking connections, meetings, or update profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    switch (action) {
      case 'send_connection_request':
        return await sendConnectionRequest(userId, data);
      case 'respond_connection_request':
        return await respondToConnectionRequest(userId, data);
      case 'schedule_meeting':
        return await scheduleMeeting(userId, data);
      case 'update_networking_profile':
        return await updateNetworkingProfile(userId, data);
      case 'exchange_business_card':
        return await exchangeBusinessCard(userId, data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Networking POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to process networking request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to send connection request
async function sendConnectionRequest(userId: string, data: any) {
  const { recipientId, eventId, message } = data;

  // Check if connection already exists
  const existingConnection = await prisma.networkingConnection.findFirst({
    where: {
      OR: [
        { requesterId: userId, recipientId },
        { requesterId: recipientId, recipientId: userId }
      ]
    }
  });

  if (existingConnection) {
    return NextResponse.json(
      { error: 'Connection already exists or pending' },
      { status: 409 }
    );
  }

  const connection = await prisma.networkingConnection.create({
    data: {
      requesterId: userId,
      recipientId,
      eventId,
      message,
      status: 'PENDING'
    },
    include: {
      requester: {
        select: { id: true, name: true, company: true, jobTitle: true }
      },
      recipient: {
        select: { id: true, name: true, company: true, jobTitle: true }
      }
    }
  });

  // Send notification to recipient
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: 'NETWORKING',
      title: 'New Connection Request',
      message: `${connection.requester.name} wants to connect with you`,
      metadata: JSON.stringify({ connectionId: connection.id })
    }
  });

  return NextResponse.json({
    message: 'Connection request sent successfully',
    connection
  });
}

// Helper function to respond to connection request
async function respondToConnectionRequest(userId: string, data: any) {
  const { connectionId, response } = data; // response: 'ACCEPTED' or 'DECLINED'

  const connection = await prisma.networkingConnection.update({
    where: { id: connectionId },
    data: { 
      status: response,
      respondedAt: new Date()
    },
    include: {
      requester: {
        select: { id: true, name: true, company: true, jobTitle: true }
      },
      recipient: {
        select: { id: true, name: true, company: true, jobTitle: true }
      }
    }
  });

  // Notify the requester
  await prisma.notification.create({
    data: {
      userId: connection.requesterId,
      type: 'NETWORKING',
      title: `Connection ${response.toLowerCase()}`,
      message: `${connection.recipient.name} ${response.toLowerCase()} your connection request`,
      metadata: JSON.stringify({ connectionId: connection.id })
    }
  });

  return NextResponse.json({
    message: `Connection request ${response.toLowerCase()}`,
    connection
  });
}

// Helper function to schedule meeting
async function scheduleMeeting(userId: string, data: any) {
  const { attendeeId, eventId, scheduledAt, duration, location, agenda, type } = data;

  const meeting = await prisma.networkingMeeting.create({
    data: {
      requesterId: userId,
      attendeeId,
      eventId,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 30,
      location,
      agenda,
      type: type || 'ONE_ON_ONE',
      status: 'SCHEDULED'
    },
    include: {
      requester: {
        select: { id: true, name: true, company: true, jobTitle: true }
      },
      attendee: {
        select: { id: true, name: true, company: true, jobTitle: true }
      }
    }
  });

  // Send notification to attendee
  await prisma.notification.create({
    data: {
      userId: attendeeId,
      type: 'MEETING',
      title: 'New Meeting Scheduled',
      message: `${meeting.requester.name} scheduled a meeting with you`,
      metadata: JSON.stringify({ meetingId: meeting.id })
    }
  });

  return NextResponse.json({
    message: 'Meeting scheduled successfully',
    meeting
  });
}

// Helper function to update networking profile
async function updateNetworkingProfile(userId: string, data: any) {
  const {
    bio,
    interests,
    lookingFor,
    industries,
    skills,
    socialLinks,
    availableForMeetings,
    preferredMeetingTypes
  } = data;

  const profile = await prisma.networkingProfile.upsert({
    where: { userId },
    update: {
      bio,
      interests: interests ? JSON.stringify(interests) : undefined,
      lookingFor,
      industries: industries ? JSON.stringify(industries) : undefined,
      skills: skills ? JSON.stringify(skills) : undefined,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
      availableForMeetings,
      preferredMeetingTypes: preferredMeetingTypes ? JSON.stringify(preferredMeetingTypes) : undefined
    },
    create: {
      userId,
      bio,
      interests: interests ? JSON.stringify(interests) : '[]',
      lookingFor,
      industries: industries ? JSON.stringify(industries) : '[]',
      skills: skills ? JSON.stringify(skills) : '[]',
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : '{}',
      availableForMeetings: availableForMeetings ?? true,
      preferredMeetingTypes: preferredMeetingTypes ? JSON.stringify(preferredMeetingTypes) : '["ONE_ON_ONE"]'
    }
  });

  return NextResponse.json({
    message: 'Networking profile updated successfully',
    profile
  });
}

// Helper function to exchange business card
async function exchangeBusinessCard(userId: string, data: any) {
  const { recipientId, eventId } = data;

  const exchange = await prisma.businessCardExchange.create({
    data: {
      senderId: userId,
      recipientId,
      eventId,
      exchangedAt: new Date()
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          company: true,
          jobTitle: true,
          avatarUrl: true
        }
      }
    }
  });

  return NextResponse.json({
    message: 'Business card exchanged successfully',
    exchange
  });
}

// Helper function to find networking recommendations
async function findNetworkingRecommendations(userId: string, eventId?: string) {
  // Get user's profile and interests
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { networkingProfile: true }
  });

  if (!user?.networkingProfile) {
    return [];
  }

  const userInterests = JSON.parse(user.networkingProfile.interests || '[]');
  const userIndustries = JSON.parse(user.networkingProfile.industries || '[]');

  // Find similar users
  const potentialConnections = await prisma.user.findMany({
    where: {
      id: { not: userId },
      isActive: true,
      networkingProfile: { isNot: null },
      ...(eventId && {
        OR: [
          { orders: { some: { eventId } } },
          { speakerProfile: { eventId } },
          { exhibitorProfile: { eventId } }
        ]
      })
    },
    include: {
      networkingProfile: true
    },
    take: 20
  });

  // Score and rank recommendations
  const recommendations = potentialConnections
    .map(potentialConnection => {
      const theirInterests = JSON.parse(potentialConnection.networkingProfile?.interests || '[]');
      const theirIndustries = JSON.parse(potentialConnection.networkingProfile?.industries || '[]');

      let score = 0;

      // Interest matching
      const commonInterests = userInterests.filter((interest: string) => 
        theirInterests.includes(interest)
      );
      score += commonInterests.length * 3;

      // Industry matching
      const commonIndustries = userIndustries.filter((industry: string) => 
        theirIndustries.includes(industry)
      );
      score += commonIndustries.length * 2;

      // Company size similarity (if available)
      if (user.company && potentialConnection.company) {
        score += 1;
      }

      return {
        user: {
          id: potentialConnection.id,
          name: potentialConnection.name,
          company: potentialConnection.company,
          jobTitle: potentialConnection.jobTitle,
          avatarUrl: potentialConnection.avatarUrl,
          bio: potentialConnection.networkingProfile?.bio
        },
        score,
        commonInterests,
        commonIndustries,
        reason: generateRecommendationReason(commonInterests, commonIndustries)
      };
    })
    .filter(rec => rec.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return recommendations;
}

function generateRecommendationReason(commonInterests: string[], commonIndustries: string[]): string {
  const reasons = [];
  
  if (commonInterests.length > 0) {
    reasons.push(`Shared interests: ${commonInterests.slice(0, 2).join(', ')}`);
  }
  
  if (commonIndustries.length > 0) {
    reasons.push(`Same industry: ${commonIndustries[0]}`);
  }
  
  return reasons.join(' • ') || 'Potential networking opportunity';
}
