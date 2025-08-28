import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/staff - Get all staff members with filtering
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for users
    const where: any = {
      role: {
        in: ['STAFF', 'VOLUNTEER', 'STAFF_MANAGER', 'ORGANIZER']
      }
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    const [staff, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          company: true,
          jobTitle: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          staffShifts: eventId ? {
            where: { eventId },
            include: {
              event: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: { startTime: 'asc' }
          } : false,
          assignedTasks: eventId ? {
            where: { eventId },
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
              dueDate: true
            },
            orderBy: { dueDate: 'asc' }
          } : false,
          _count: {
            select: {
              assignedTasks: eventId ? { where: { eventId } } : true,
              staffShifts: eventId ? { where: { eventId } } : true
            }
          }
        },
        orderBy: [
          { role: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      staff,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST /api/staff - Create staff shift
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
      staffId,
      role,
      startTime,
      endTime,
      location,
      notes
    } = body;

    // Validate required fields
    if (!eventId || !staffId || !role || !startTime || !endTime) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return NextResponse.json(
        { ok: false, error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const conflictingShifts = await prisma.staffShift.findMany({
      where: {
        staffId,
        OR: [
          {
            startTime: { lte: start },
            endTime: { gt: start }
          },
          {
            startTime: { lt: end },
            endTime: { gte: end }
          },
          {
            startTime: { gte: start },
            endTime: { lte: end }
          }
        ]
      }
    });

    if (conflictingShifts.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Staff member already has a shift during this time' },
        { status: 409 }
      );
    }

    const shift = await prisma.staffShift.create({
      data: {
        eventId,
        staffId,
        role,
        startTime: start,
        endTime: end,
        location,
        notes
      },
      include: {
        event: {
          select: {
            id: true,
            name: true
          }
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      shift
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create staff shift:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create staff shift' },
      { status: 500 }
    );
  }
}
