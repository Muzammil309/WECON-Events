import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { startAt: 'asc' }
        },
        tickets: {
          orderBy: { salesStart: 'desc' }
        },
        _count: {
          select: {
            tickets: true,
            sessions: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { ok: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      event
    });
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/events/[id] - Update event
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
      name,
      description,
      startDate,
      endDate,
      location,
      maxAttendees,
      category,
      tags,
      website,
      contactEmail,
      ticketPrice,
      currency,
      status
    } = body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { ok: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return NextResponse.json(
          { ok: false, error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      // Update slug when name changes
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startAt = new Date(startDate);
    if (endDate !== undefined) updateData.endAt = new Date(endDate);
    if (location !== undefined) updateData.venue = location;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            tickets: true,
            sessions: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      event
    });
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/events/[id] - Delete event
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tickets: true,
            sessions: true
          }
        }
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { ok: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event has tickets or sessions
    if (existingEvent._count.tickets > 0) {
      return NextResponse.json(
        { ok: false, error: 'Cannot delete event with existing tickets' },
        { status: 400 }
      );
    }

    if (existingEvent._count.sessions > 0) {
      return NextResponse.json(
        { ok: false, error: 'Cannot delete event with existing sessions' },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({
      ok: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
