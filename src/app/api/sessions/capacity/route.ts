import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { realTimeUpdates, UPDATE_TYPES, MODULES } from '@/lib/realtime-updates';

const prisma = new PrismaClient();

// GET - Get session capacity and waitlist information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const eventId = searchParams.get('eventId');

    if (sessionId) {
      // Get specific session capacity info
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          bookmarks: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          waitlist: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            },
            orderBy: { joinedAt: 'asc' }
          },
          checkIns: {
            where: { type: 'session' }
          }
        }
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      const registeredCount = session.bookmarks.length;
      const checkedInCount = session.checkIns.length;
      const waitlistCount = session.waitlist.length;
      const availableSpots = Math.max(0, (session.maxAttendees || 0) - registeredCount);
      const isWaitlistActive = availableSpots === 0 && session.allowWaitlist;

      return NextResponse.json({
        session: {
          id: session.id,
          title: session.title,
          maxAttendees: session.maxAttendees,
          allowWaitlist: session.allowWaitlist,
          registeredCount,
          checkedInCount,
          waitlistCount,
          availableSpots,
          isWaitlistActive,
          status: session.status
        },
        registrations: session.bookmarks.map(bookmark => ({
          id: bookmark.id,
          user: bookmark.user,
          registeredAt: bookmark.createdAt,
          status: 'REGISTERED'
        })),
        waitlist: session.waitlist.map(waitlistEntry => ({
          id: waitlistEntry.id,
          user: waitlistEntry.user,
          joinedAt: waitlistEntry.joinedAt,
          position: session.waitlist.findIndex(w => w.id === waitlistEntry.id) + 1,
          status: waitlistEntry.status
        })),
        checkIns: session.checkIns.map(checkIn => ({
          id: checkIn.id,
          userId: checkIn.userId,
          checkedInAt: checkIn.checkedInAt
        }))
      });

    } else if (eventId) {
      // Get capacity overview for all sessions in an event
      const sessions = await prisma.session.findMany({
        where: { eventId },
        include: {
          _count: {
            select: {
              bookmarks: true,
              waitlist: true,
              checkIns: {
                where: { type: 'session' }
              }
            }
          }
        },
        orderBy: { startAt: 'asc' }
      });

      const capacityOverview = sessions.map(session => {
        const registeredCount = session._count.bookmarks;
        const checkedInCount = session._count.checkIns;
        const waitlistCount = session._count.waitlist;
        const availableSpots = Math.max(0, (session.maxAttendees || 0) - registeredCount);
        const utilizationRate = session.maxAttendees ? (registeredCount / session.maxAttendees) * 100 : 0;

        return {
          id: session.id,
          title: session.title,
          startAt: session.startAt,
          maxAttendees: session.maxAttendees,
          registeredCount,
          checkedInCount,
          waitlistCount,
          availableSpots,
          utilizationRate: Math.round(utilizationRate),
          status: session.status,
          isOverbooked: registeredCount > (session.maxAttendees || 0),
          hasWaitlist: waitlistCount > 0
        };
      });

      return NextResponse.json({
        eventId,
        sessions: capacityOverview,
        summary: {
          totalSessions: sessions.length,
          fullSessions: capacityOverview.filter(s => s.availableSpots === 0).length,
          overbookedSessions: capacityOverview.filter(s => s.isOverbooked).length,
          sessionsWithWaitlist: capacityOverview.filter(s => s.hasWaitlist).length,
          averageUtilization: Math.round(
            capacityOverview.reduce((sum, s) => sum + s.utilizationRate, 0) / capacityOverview.length
          )
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Either sessionId or eventId is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Session Capacity API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session capacity data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Register for session or join waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, userId } = body;

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        _count: {
          select: { bookmarks: true }
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'register':
        return await registerForSession(sessionId, userId, session);
      case 'join_waitlist':
        return await joinWaitlist(sessionId, userId, session);
      case 'cancel_registration':
        return await cancelRegistration(sessionId, userId);
      case 'leave_waitlist':
        return await leaveWaitlist(sessionId, userId);
      case 'process_waitlist':
        return await processWaitlist(sessionId);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Session Registration Error:', error);
    return NextResponse.json(
      { error: 'Failed to process session registration' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to register for session
async function registerForSession(sessionId: string, userId: string, session: any) {
  const currentRegistrations = session._count.bookmarks;
  const availableSpots = Math.max(0, (session.maxAttendees || 0) - currentRegistrations);

  // Check if user is already registered
  const existingBookmark = await prisma.sessionBookmark.findUnique({
    where: {
      userId_sessionId: { userId, sessionId }
    }
  });

  if (existingBookmark) {
    return NextResponse.json(
      { error: 'User is already registered for this session' },
      { status: 409 }
    );
  }

  // Check if session is full
  if (availableSpots === 0) {
    if (session.allowWaitlist) {
      return NextResponse.json(
        { 
          error: 'Session is full. Please join the waitlist instead.',
          action: 'join_waitlist_suggested'
        },
        { status: 409 }
      );
    } else {
      return NextResponse.json(
        { error: 'Session is full and waitlist is not available' },
        { status: 409 }
      );
    }
  }

  // Register user for session
  const bookmark = await prisma.sessionBookmark.create({
    data: {
      userId,
      sessionId,
      status: 'CONFIRMED'
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      session: {
        select: { id: true, title: true, startAt: true }
      }
    }
  });

  // Send confirmation notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'SESSION_REGISTRATION',
      title: 'Session Registration Confirmed',
      message: `You have successfully registered for "${session.title}"`,
      metadata: JSON.stringify({ sessionId, bookmarkId: bookmark.id })
    }
  });

  // Broadcast real-time update
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.SESSION_REGISTRATION,
    module: MODULES.SESSIONS,
    data: {
      sessionId,
      userId,
      action: 'registered',
      availableSpots: availableSpots - 1
    }
  });

  return NextResponse.json({
    message: 'Successfully registered for session',
    registration: bookmark,
    availableSpots: availableSpots - 1
  });
}

// Helper function to join waitlist
async function joinWaitlist(sessionId: string, userId: string, session: any) {
  if (!session.allowWaitlist) {
    return NextResponse.json(
      { error: 'Waitlist is not available for this session' },
      { status: 400 }
    );
  }

  // Check if user is already on waitlist
  const existingWaitlist = await prisma.sessionWaitlist.findUnique({
    where: {
      userId_sessionId: { userId, sessionId }
    }
  });

  if (existingWaitlist) {
    return NextResponse.json(
      { error: 'User is already on the waitlist' },
      { status: 409 }
    );
  }

  // Get current waitlist position
  const waitlistCount = await prisma.sessionWaitlist.count({
    where: { sessionId }
  });

  const waitlistEntry = await prisma.sessionWaitlist.create({
    data: {
      userId,
      sessionId,
      position: waitlistCount + 1,
      status: 'WAITING'
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  // Send waitlist confirmation
  await prisma.notification.create({
    data: {
      userId,
      type: 'WAITLIST_JOINED',
      title: 'Added to Session Waitlist',
      message: `You have been added to the waitlist for "${session.title}". Position: ${waitlistEntry.position}`,
      metadata: JSON.stringify({ sessionId, waitlistId: waitlistEntry.id, position: waitlistEntry.position })
    }
  });

  // Broadcast real-time update
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.WAITLIST_JOINED,
    module: MODULES.SESSIONS,
    data: {
      sessionId,
      userId,
      position: waitlistEntry.position
    }
  });

  return NextResponse.json({
    message: 'Successfully joined waitlist',
    waitlistEntry,
    position: waitlistEntry.position
  });
}

// Helper function to cancel registration
async function cancelRegistration(sessionId: string, userId: string) {
  const bookmark = await prisma.sessionBookmark.findUnique({
    where: {
      userId_sessionId: { userId, sessionId }
    }
  });

  if (!bookmark) {
    return NextResponse.json(
      { error: 'Registration not found' },
      { status: 404 }
    );
  }

  // Delete the registration
  await prisma.sessionBookmark.delete({
    where: { id: bookmark.id }
  });

  // Process waitlist to move someone up
  await processWaitlist(sessionId);

  // Broadcast real-time update
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.SESSION_CANCELLED,
    module: MODULES.SESSIONS,
    data: {
      sessionId,
      userId,
      action: 'cancelled'
    }
  });

  return NextResponse.json({
    message: 'Registration cancelled successfully'
  });
}

// Helper function to leave waitlist
async function leaveWaitlist(sessionId: string, userId: string) {
  const waitlistEntry = await prisma.sessionWaitlist.findUnique({
    where: {
      userId_sessionId: { userId, sessionId }
    }
  });

  if (!waitlistEntry) {
    return NextResponse.json(
      { error: 'Waitlist entry not found' },
      { status: 404 }
    );
  }

  // Delete waitlist entry
  await prisma.sessionWaitlist.delete({
    where: { id: waitlistEntry.id }
  });

  // Update positions for remaining waitlist entries
  await prisma.sessionWaitlist.updateMany({
    where: {
      sessionId,
      position: { gt: waitlistEntry.position }
    },
    data: {
      position: { decrement: 1 }
    }
  });

  return NextResponse.json({
    message: 'Left waitlist successfully'
  });
}

// Helper function to process waitlist (move people from waitlist to registered)
async function processWaitlist(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      _count: { select: { bookmarks: true } }
    }
  });

  if (!session) return;

  const availableSpots = Math.max(0, (session.maxAttendees || 0) - session._count.bookmarks);
  
  if (availableSpots > 0) {
    // Get next person on waitlist
    const nextInLine = await prisma.sessionWaitlist.findFirst({
      where: { sessionId, status: 'WAITING' },
      orderBy: { position: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (nextInLine) {
      // Move from waitlist to registered
      await prisma.$transaction([
        // Create registration
        prisma.sessionBookmark.create({
          data: {
            userId: nextInLine.userId,
            sessionId,
            status: 'CONFIRMED'
          }
        }),
        // Remove from waitlist
        prisma.sessionWaitlist.delete({
          where: { id: nextInLine.id }
        }),
        // Update remaining waitlist positions
        prisma.sessionWaitlist.updateMany({
          where: {
            sessionId,
            position: { gt: nextInLine.position }
          },
          data: {
            position: { decrement: 1 }
          }
        })
      ]);

      // Send notification
      await prisma.notification.create({
        data: {
          userId: nextInLine.userId,
          type: 'WAITLIST_PROMOTED',
          title: 'Moved from Waitlist to Registered',
          message: `Great news! You have been moved from the waitlist to registered for "${session.title}"`,
          metadata: JSON.stringify({ sessionId })
        }
      });

      // Broadcast real-time update
      realTimeUpdates.broadcast({
        type: UPDATE_TYPES.WAITLIST_PROMOTED,
        module: MODULES.SESSIONS,
        data: {
          sessionId,
          userId: nextInLine.userId,
          userName: nextInLine.user.name
        }
      });
    }
  }
}
