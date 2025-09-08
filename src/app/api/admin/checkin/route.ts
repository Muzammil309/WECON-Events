import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch check-in data and statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const sessionId = searchParams.get('sessionId');
    const timeRange = searchParams.get('timeRange') || '24h';

    // Calculate time range
    const now = new Date();
    const startTime = new Date();
    switch (timeRange) {
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        startTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
      default:
        startTime.setDate(now.getDate() - 1);
    }

    // Build where clause
    const whereClause: any = {
      checkedInAt: { gte: startTime }
    };

    if (eventId) {
      whereClause.session = { eventId };
    }

    if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    // Fetch check-ins with user and session data
    const checkIns = await prisma.checkIn.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            jobTitle: true,
            avatarUrl: true
          }
        },
        session: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
            venue: true,
            event: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { checkedInAt: 'desc' }
    });

    // Get statistics
    const stats = await Promise.all([
      // Total check-ins today
      prisma.checkIn.count({
        where: {
          checkedInAt: { gte: new Date(now.setHours(0, 0, 0, 0)) }
        }
      }),
      // Unique attendees today
      prisma.checkIn.groupBy({
        by: ['userId'],
        where: {
          checkedInAt: { gte: new Date(now.setHours(0, 0, 0, 0)) }
        }
      }),
      // Most popular sessions
      prisma.checkIn.groupBy({
        by: ['sessionId'],
        _count: { sessionId: true },
        orderBy: { _count: { sessionId: 'desc' } },
        take: 5
      }),
      // Check-ins by hour (last 24 hours)
      prisma.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM checked_in_at) as hour,
          COUNT(*) as count
        FROM "CheckIn"
        WHERE checked_in_at >= ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
        GROUP BY EXTRACT(HOUR FROM checked_in_at)
        ORDER BY hour
      `
    ]);

    const [totalToday, uniqueAttendeesToday, popularSessions, hourlyStats] = stats;

    // Format response
    const formattedCheckIns = checkIns.map(checkIn => ({
      id: checkIn.id,
      checkedInAt: checkIn.checkedInAt,
      method: checkIn.method,
      location: checkIn.location,
      user: checkIn.user,
      session: checkIn.session
    }));

    return NextResponse.json({
      checkIns: formattedCheckIns,
      stats: {
        totalToday,
        uniqueAttendeesToday: uniqueAttendeesToday.length,
        popularSessions,
        hourlyStats,
        totalInRange: checkIns.length
      }
    });

  } catch (error) {
    console.error('Check-in API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch check-in data',
        checkIns: [],
        stats: { totalToday: 0, uniqueAttendeesToday: 0, popularSessions: [], hourlyStats: [], totalInRange: 0 }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Process a new check-in (QR code scan or manual)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      sessionId,
      method = 'QR_CODE', // QR_CODE, MANUAL, NFC
      location,
      qrData,
      staffId
    } = body;

    // Validation
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and Session ID are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify session exists and is active
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        event: { select: { id: true, name: true } }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user is already checked in to this session
    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        sessionId
      }
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { 
          error: 'User already checked in to this session',
          checkIn: existingCheckIn
        },
        { status: 409 }
      );
    }

    // Create check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        userId,
        sessionId,
        method,
        location,
        checkedInAt: new Date(),
        ...(staffId && { staffId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        },
        session: {
          select: {
            id: true,
            title: true,
            startAt: true,
            venue: true,
            event: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Check-in successful',
      checkIn: {
        id: checkIn.id,
        checkedInAt: checkIn.checkedInAt,
        method: checkIn.method,
        user: checkIn.user,
        session: checkIn.session
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Check-in Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update check-in (for corrections)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, location, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Check-in ID is required' },
        { status: 400 }
      );
    }

    const updatedCheckIn = await prisma.checkIn.update({
      where: { id },
      data: {
        ...(location && { location }),
        ...(notes && { notes })
      },
      include: {
        user: { select: { name: true, email: true } },
        session: { select: { title: true } }
      }
    });

    return NextResponse.json({
      message: 'Check-in updated successfully',
      checkIn: updatedCheckIn
    });

  } catch (error) {
    console.error('Check-in Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update check-in' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
