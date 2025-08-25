import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/agenda - Get all sessions for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const day = searchParams.get('day');
    const track = searchParams.get('track');
    const room = searchParams.get('room');
    const search = searchParams.get('search');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Build where clause for filtering
    const whereClause: any = {
      eventId: eventId
    };

    if (day && day !== 'All') {
      // Filter by day - assuming day is stored as date
      const dayDate = new Date(day);
      const nextDay = new Date(dayDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereClause.startAt = {
        gte: dayDate,
        lt: nextDay
      };
    }

    if (track && track !== 'All') {
      whereClause.track = track;
    }

    if (room && room !== 'All') {
      whereClause.room = room;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
        { speakers: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        speakers: {
          select: {
            id: true,
            name: true,
            bio: true,
            title: true,
            company: true,
            avatar: true
          }
        },
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: [
        { startAt: 'asc' },
        { title: 'asc' }
      ]
    });

    // Get unique values for filters
    const allSessions = await prisma.session.findMany({
      where: { eventId },
      select: {
        track: true,
        room: true,
        startAt: true
      }
    });

    const tracks = [...new Set(allSessions.map(s => s.track).filter(Boolean))];
    const rooms = [...new Set(allSessions.map(s => s.room).filter(Boolean))];
    const days = [...new Set(allSessions.map(s => s.startAt.toISOString().split('T')[0]))];

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        filters: {
          tracks,
          rooms,
          days
        }
      }
    });

  } catch (error) {
    console.error('Error fetching agenda:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agenda' },
      { status: 500 }
    );
  }
}

// POST /api/agenda - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      title,
      abstract,
      track,
      room,
      startAt,
      endAt,
      speakerIds,
      type,
      level,
      tags
    } = body;

    // Validate required fields
    if (!eventId || !title || !startAt || !endAt) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, title, startAt, endAt' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check for scheduling conflicts
    const conflictingSessions = await prisma.session.findMany({
      where: {
        eventId,
        room,
        OR: [
          {
            AND: [
              { startAt: { lte: startDate } },
              { endAt: { gt: startDate } }
            ]
          },
          {
            AND: [
              { startAt: { lt: endDate } },
              { endAt: { gte: endDate } }
            ]
          },
          {
            AND: [
              { startAt: { gte: startDate } },
              { endAt: { lte: endDate } }
            ]
          }
        ]
      }
    });

    if (conflictingSessions.length > 0) {
      return NextResponse.json(
        { error: 'Time slot conflict with existing session in the same room' },
        { status: 400 }
      );
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        eventId,
        title,
        abstract,
        track,
        room,
        startAt: startDate,
        endAt: endDate,
        type: type || 'talk',
        level: level || 'intermediate',
        tags: tags || []
      },
      include: {
        speakers: {
          select: {
            id: true,
            name: true,
            bio: true,
            title: true,
            company: true,
            avatar: true
          }
        }
      }
    });

    // Connect speakers if provided
    if (speakerIds && speakerIds.length > 0) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          speakers: {
            connect: speakerIds.map((id: string) => ({ id }))
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: session
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// PUT /api/agenda - Update a session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

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

    // Prepare update data
    const updateFields: any = {};
    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.abstract !== undefined) updateFields.abstract = updateData.abstract;
    if (updateData.track !== undefined) updateFields.track = updateData.track;
    if (updateData.room !== undefined) updateFields.room = updateData.room;
    if (updateData.startAt) updateFields.startAt = new Date(updateData.startAt);
    if (updateData.endAt) updateFields.endAt = new Date(updateData.endAt);
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.level) updateFields.level = updateData.level;
    if (updateData.tags) updateFields.tags = updateData.tags;

    // Validate dates if both are provided
    if (updateFields.startAt && updateFields.endAt && updateFields.startAt >= updateFields.endAt) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      );
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateFields,
      include: {
        speakers: {
          select: {
            id: true,
            name: true,
            bio: true,
            title: true,
            company: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSession
    });

  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/agenda - Delete a session
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

    await prisma.session.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
