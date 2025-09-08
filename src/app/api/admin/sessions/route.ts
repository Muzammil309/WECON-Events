import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch sessions with comprehensive data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const speakerId = searchParams.get('speakerId');

    // Build where clause
    const whereClause: any = {};

    if (eventId) {
      whereClause.eventId = eventId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      const now = new Date();
      switch (status) {
        case 'upcoming':
          whereClause.startAt = { gt: now };
          break;
        case 'ongoing':
          whereClause.AND = [
            { startAt: { lte: now } },
            { endAt: { gte: now } }
          ];
          break;
        case 'completed':
          whereClause.endAt = { lt: now };
          break;
      }
    }

    if (speakerId) {
      whereClause.speakers = {
        some: { userId: speakerId }
      };
    }

    // Fetch sessions with related data
    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true,
            endAt: true
          }
        },
        speakers: {
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
            }
          }
        },
        _count: {
          select: {
            checkIns: true,
            bookmarks: true,
            feedback: true
          }
        },
        feedback: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { startAt: 'asc' }
    });

    // Calculate additional metrics for each session
    const enhancedSessions = sessions.map(session => {
      const now = new Date();
      const startTime = new Date(session.startAt);
      const endTime = new Date(session.endAt);
      
      let sessionStatus = 'upcoming';
      if (now >= startTime && now <= endTime) {
        sessionStatus = 'ongoing';
      } else if (now > endTime) {
        sessionStatus = 'completed';
      }

      const averageRating = session.feedback.length > 0
        ? session.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / session.feedback.length
        : 0;

      const capacityUtilization = session.capacity > 0
        ? (session._count.checkIns / session.capacity) * 100
        : 0;

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        startAt: session.startAt,
        endAt: session.endAt,
        venue: session.venue,
        capacity: session.capacity,
        type: session.type,
        status: sessionStatus,
        event: session.event,
        speakers: session.speakers.map(speaker => ({
          id: speaker.id,
          role: speaker.role,
          user: speaker.user
        })),
        metrics: {
          checkIns: session._count.checkIns,
          bookmarks: session._count.bookmarks,
          feedbackCount: session._count.feedback,
          averageRating: Math.round(averageRating * 10) / 10,
          capacityUtilization: Math.round(capacityUtilization * 10) / 10
        }
      };
    });

    // Get overall statistics
    const stats = {
      total: sessions.length,
      upcoming: enhancedSessions.filter(s => s.status === 'upcoming').length,
      ongoing: enhancedSessions.filter(s => s.status === 'ongoing').length,
      completed: enhancedSessions.filter(s => s.status === 'completed').length,
      totalCheckIns: enhancedSessions.reduce((sum, s) => sum + s.metrics.checkIns, 0),
      averageRating: enhancedSessions.length > 0
        ? enhancedSessions.reduce((sum, s) => sum + s.metrics.averageRating, 0) / enhancedSessions.length
        : 0
    };

    return NextResponse.json({
      sessions: enhancedSessions,
      stats
    });

  } catch (error) {
    console.error('Sessions API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sessions',
        sessions: [],
        stats: { total: 0, upcoming: 0, ongoing: 0, completed: 0, totalCheckIns: 0, averageRating: 0 }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      startAt,
      endAt,
      venue,
      capacity,
      type = 'TALK',
      eventId,
      speakers = [], // Array of { userId, role }
      tags = []
    } = body;

    // Validation
    if (!title || !startAt || !endAt || !eventId) {
      return NextResponse.json(
        { error: 'Title, start time, end time, and event are required' },
        { status: 400 }
      );
    }

    if (new Date(startAt) >= new Date(endAt)) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check for venue conflicts
    if (venue) {
      const conflictingSessions = await prisma.session.findMany({
        where: {
          venue,
          eventId,
          OR: [
            {
              AND: [
                { startAt: { lte: new Date(startAt) } },
                { endAt: { gt: new Date(startAt) } }
              ]
            },
            {
              AND: [
                { startAt: { lt: new Date(endAt) } },
                { endAt: { gte: new Date(endAt) } }
              ]
            }
          ]
        }
      });

      if (conflictingSessions.length > 0) {
        return NextResponse.json(
          { error: 'Venue is already booked for this time slot' },
          { status: 409 }
        );
      }
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        title,
        description,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        venue,
        capacity: capacity || null,
        type: type.toUpperCase(),
        eventId
      }
    });

    // Add speakers if provided
    if (speakers.length > 0) {
      await Promise.all(
        speakers.map((speaker: any) =>
          prisma.sessionSpeaker.create({
            data: {
              sessionId: session.id,
              userId: speaker.userId,
              role: speaker.role || 'SPEAKER'
            }
          })
        )
      );
    }

    // Fetch the created session with speakers
    const createdSession = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        speakers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true
              }
            }
          }
        },
        event: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Session created successfully',
      session: createdSession
    }, { status: 201 });

  } catch (error) {
    console.error('Create Session Error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      startAt,
      endAt,
      venue,
      capacity,
      type,
      speakers = []
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id }
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update session
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startAt) updateData.startAt = new Date(startAt);
    if (endAt) updateData.endAt = new Date(endAt);
    if (venue) updateData.venue = venue;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (type) updateData.type = type.toUpperCase();

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData
    });

    // Update speakers if provided
    if (speakers.length >= 0) {
      // Remove existing speakers
      await prisma.sessionSpeaker.deleteMany({
        where: { sessionId: id }
      });

      // Add new speakers
      if (speakers.length > 0) {
        await Promise.all(
          speakers.map((speaker: any) =>
            prisma.sessionSpeaker.create({
              data: {
                sessionId: id,
                userId: speaker.userId,
                role: speaker.role || 'SPEAKER'
              }
            })
          )
        );
      }
    }

    return NextResponse.json({
      message: 'Session updated successfully',
      session: updatedSession
    });

  } catch (error) {
    console.error('Update Session Error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if session has check-ins
    const checkInCount = await prisma.checkIn.count({
      where: { sessionId: id }
    });

    if (checkInCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete session with existing check-ins' },
        { status: 409 }
      );
    }

    // Delete session (cascade will handle speakers)
    await prisma.session.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Delete Session Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
