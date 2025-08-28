import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/venues - Get all venues with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (eventId) {
      where.eventId = eventId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          rooms: {
            include: {
              sessions: {
                select: {
                  id: true,
                  title: true,
                  startAt: true,
                  endAt: true
                },
                orderBy: { startAt: 'asc' }
              }
            },
            orderBy: { name: 'asc' }
          },
          stalls: {
            include: {
              exhibitor: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            },
            orderBy: { stallNumber: 'asc' }
          },
          _count: {
            select: {
              rooms: true,
              stalls: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.venue.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      venues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

// POST /api/venues - Create new venue
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
      name,
      address,
      description,
      capacity,
      facilities = [],
      mapUrl,
      coordinates,
      isAccessible = false
    } = body;

    // Validate required fields
    if (!eventId || !name) {
      return NextResponse.json(
        { ok: false, error: 'Event ID and name are required' },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        eventId,
        name,
        address,
        description,
        capacity,
        facilities,
        mapUrl,
        coordinates,
        isAccessible
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            rooms: true,
            stalls: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      venue
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create venue:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}
