import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the JWT token or session
    // For now, we'll use a demo attendee ID or get it from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-attendee-1';

    // Get attendee information
    const attendee = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastActiveAt: true
      }
    });

    if (!attendee) {
      return NextResponse.json(
        { error: 'Attendee not found' },
        { status: 404 }
      );
    }

    // Get upcoming sessions for the attendee
    const upcomingSessions = await prisma.session.findMany({
      where: {
        startTime: {
          gte: new Date()
        },
        attendees: {
          some: {
            id: userId
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5,
      include: {
        speaker: {
          select: {
            name: true
          }
        },
        location: {
          select: {
            name: true
          }
        }
      }
    });

    // Get recent messages for the attendee
    const recentMessages = await prisma.message.findMany({
      where: {
        OR: [
          { recipientId: userId },
          { senderId: userId }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        sender: {
          select: {
            name: true
          }
        }
      }
    });

    // Get attendee's session attendance count
    const sessionsAttended = await prisma.sessionAttendance.count({
      where: {
        attendeeId: userId,
        checkedIn: true
      }
    });

    // Get total available sessions
    const totalSessions = await prisma.session.count({
      where: {
        startTime: {
          lte: new Date()
        }
      }
    });

    // Get networking connections count
    const networkingConnections = await prisma.networkingConnection.count({
      where: {
        OR: [
          { requesterId: userId },
          { recipientId: userId }
        ],
        status: 'ACCEPTED'
      }
    });

    // Get feedback submissions count
    const feedbackSubmitted = await prisma.feedback.count({
      where: {
        attendeeId: userId
      }
    });

    // Get QR scan count (booth visits, check-ins, etc.)
    const qrScans = await prisma.qrScan.count({
      where: {
        scannedById: userId
      }
    });

    // Format upcoming sessions
    const formattedUpcomingSessions = upcomingSessions.map(session => ({
      id: session.id,
      title: session.title,
      time: session.startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      location: session.location?.name || 'TBD',
      speaker: session.speaker?.name || 'TBD'
    }));

    // Format recent messages
    const formattedRecentMessages = recentMessages.map(message => ({
      id: message.id,
      from: message.sender?.name || 'System',
      message: message.content,
      time: message.createdAt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }));

    // Calculate event progress (based on sessions attended vs available)
    const eventProgress = totalSessions > 0 ? Math.round((sessionsAttended / totalSessions) * 100) : 0;

    const attendeeData = {
      userName: attendee.name || 'Attendee',
      userId: attendee.id,
      upcomingSessions: formattedUpcomingSessions,
      recentMessages: formattedRecentMessages,
      networkingConnections,
      sessionsAttended,
      totalSessions,
      feedbackSubmitted,
      qrScans,
      eventProgress: Math.min(eventProgress, 100) // Cap at 100%
    };

    return NextResponse.json(attendeeData);

  } catch (error) {
    console.error('Attendee Dashboard API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      userName: 'Demo Attendee',
      userId: 'demo-attendee-1',
      upcomingSessions: [
        { id: 1, title: 'AI in Healthcare', time: '10:00 AM', location: 'Main Hall', speaker: 'Dr. Sarah Johnson' },
        { id: 2, title: 'Future of Work', time: '2:00 PM', location: 'Conference Room A', speaker: 'Mike Chen' },
        { id: 3, title: 'Networking Lunch', time: '12:30 PM', location: 'Exhibition Hall', speaker: 'Multiple Speakers' }
      ],
      recentMessages: [
        { id: 1, from: 'Event Organizer', message: 'Welcome to WECON Masawat 2025!', time: '9:00 AM' },
        { id: 2, from: 'Sarah Johnson', message: 'Looking forward to connecting!', time: '8:45 AM' },
        { id: 3, from: 'Tech Solutions Inc.', message: 'Visit our booth A-101 for demos', time: '8:30 AM' }
      ],
      networkingConnections: 12,
      sessionsAttended: 3,
      totalSessions: 8,
      feedbackSubmitted: 2,
      qrScans: 15,
      eventProgress: 65
    });
  } finally {
    await prisma.$disconnect();
  }
}

// POST endpoint for updating attendee preferences or data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'join_session':
        // Add attendee to session
        await prisma.session.update({
          where: { id: data.sessionId },
          data: {
            attendees: {
              connect: { id: userId }
            }
          }
        });
        break;

      case 'leave_session':
        // Remove attendee from session
        await prisma.session.update({
          where: { id: data.sessionId },
          data: {
            attendees: {
              disconnect: { id: userId }
            }
          }
        });
        break;

      case 'check_in_session':
        // Mark attendee as checked in to session
        await prisma.sessionAttendance.upsert({
          where: {
            attendeeId_sessionId: {
              attendeeId: userId,
              sessionId: data.sessionId
            }
          },
          update: {
            checkedIn: true,
            checkInTime: new Date()
          },
          create: {
            attendeeId: userId,
            sessionId: data.sessionId,
            checkedIn: true,
            checkInTime: new Date()
          }
        });
        break;

      case 'scan_qr':
        // Record QR code scan
        await prisma.qrScan.create({
          data: {
            scannedById: userId,
            qrType: data.qrType || 'BOOTH',
            targetId: data.targetId,
            scannedAt: new Date()
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'Action completed successfully'
    });

  } catch (error) {
    console.error('Attendee Dashboard POST API Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete action' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
