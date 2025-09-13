import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/sessions - Get all sessions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const track = searchParams.get('track') || '';
    const roomId = searchParams.get('roomId') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (eventId) {
      where.eventId = eventId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (track) {
      where.track = track;
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (startDate && endDate) {
      where.startAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          room: true,
          speakers: {
            include: {
              speaker: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      avatarUrl: true
                    }
                  }
                }
              }
            }
          },
          resources: true,
          feedback: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              feedback: true
            }
          }
        },
        orderBy: { startAt: 'asc' },
        skip,
        take: limit
      }),
      prisma.session.count({ where })
    ]);

    // Calculate average rating for each session
    const sessionsWithRating = sessions.map(session => ({
      ...session,
      averageRating: session.feedback.length > 0 
        ? session.feedback.reduce((sum, f) => sum + f.rating, 0) / session.feedback.length 
        : null
    }));

    return NextResponse.json({
      ok: true,
      sessions: sessionsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      eventId,
      title,
      abstract,
      track,
      startAt,
      endAt,
      roomId,
      speakerIds = [],
      maxAttendees,
      sessionType,
      requirements,
      materials
    } = body;

    // Validate required fields
    if (!eventId || !title || !startAt || !endAt) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start >= end) {
      return NextResponse.json(
        { ok: false, error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check for room conflicts
    if (roomId) {
      const conflictingSessions = await prisma.session.findMany({
        where: {
          roomId,
          OR: [
            {
              startAt: { lte: start },
              endAt: { gt: start }
            },
            {
              startAt: { lt: end },
              endAt: { gte: end }
            },
            {
              startAt: { gte: start },
              endAt: { lte: end }
            }
          ]
        }
      });

      if (conflictingSessions.length > 0) {
        return NextResponse.json(
          { ok: false, error: 'Room is already booked for this time slot' },
          { status: 409 }
        );
      }
    }

    const session = await prisma.session.create({
      data: {
        eventId,
        title,
        abstract,
        track,
        startAt: start,
        endAt: end,
        roomId: roomId || null,
        speakers: {
          create: speakerIds.map((speakerId: string) => ({
            speakerId
          }))
        }
      },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            feedback: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      session
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
