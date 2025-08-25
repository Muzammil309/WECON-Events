import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              tickets: true,
              sessions: true
            }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/events - Create new event
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
      status = 'draft'
    } = body;

    // Validate required fields
    if (!name || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json(
        { ok: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        description,
        startAt: start,
        endAt: end,
        venue: location
      },
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
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
