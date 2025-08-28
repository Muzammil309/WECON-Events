import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/sessions/[id] - Get single session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
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
                    avatarUrl: true,
                    bio: true
                  }
                }
              }
            }
          }
        },
        resources: true,
        feedback: {
          include: {
            giver: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            feedback: true
          }
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating = session.feedback.length > 0 
      ? session.feedback.reduce((sum, f) => sum + f.rating, 0) / session.feedback.length 
      : null;

    return NextResponse.json({
      ok: true,
      session: {
        ...session,
        averageRating
      }
    });
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// PUT /api/sessions/[id] - Update session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      title,
      abstract,
      track,
      startAt,
      endAt,
      roomId,
      speakerIds,
      maxAttendees,
      sessionType,
      requirements,
      materials
    } = body;

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id }
    });

    if (!existingSession) {
      return NextResponse.json(
        { ok: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (startAt && endAt) {
      const start = new Date(startAt);
      const end = new Date(endAt);
      if (start >= end) {
        return NextResponse.json(
          { ok: false, error: 'End time must be after start time' },
          { status: 400 }
        );
      }

      // Check for room conflicts (excluding current session)
      if (roomId) {
        const conflictingSessions = await prisma.session.findMany({
          where: {
            id: { not: id },
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
    }

    // Update session
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (abstract !== undefined) updateData.abstract = abstract;
    if (track !== undefined) updateData.track = track;
    if (startAt !== undefined) updateData.startAt = new Date(startAt);
    if (endAt !== undefined) updateData.endAt = new Date(endAt);
    if (roomId !== undefined) updateData.roomId = roomId;

    const session = await prisma.session.update({
      where: { id },
      data: updateData,
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

    // Update speakers if provided
    if (speakerIds !== undefined) {
      // Remove existing speakers
      await prisma.sessionSpeaker.deleteMany({
        where: { sessionId: id }
      });

      // Add new speakers
      if (speakerIds.length > 0) {
        await prisma.sessionSpeaker.createMany({
          data: speakerIds.map((speakerId: string) => ({
            sessionId: id,
            speakerId
          }))
        });
      }
    }

    return NextResponse.json({
      ok: true,
      session
    });
  } catch (error) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify authentication
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id }
    });

    if (!existingSession) {
      return NextResponse.json(
        { ok: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Delete session (cascade will handle related records)
    await prisma.session.delete({
      where: { id }
    });

    return NextResponse.json({
      ok: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete session:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
