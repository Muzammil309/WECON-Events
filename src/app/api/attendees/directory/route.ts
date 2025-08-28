import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/directory - Get attendee directory with networking features
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const interests = searchParams.get('interests')?.split(',').filter(Boolean) || [];
    const company = searchParams.get('company') || '';
    const jobTitle = searchParams.get('jobTitle') || '';
    const eventId = searchParams.get('eventId') || '';

    const skip = (page - 1) * limit;

    // Build where clause for attendees who opted in for networking
    const where: any = {
      role: 'ATTENDEE',
      isActive: true,
      attendeeProfile: {
        networkingOptIn: true
      }
    };

    // Add search filters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }

    if (jobTitle) {
      where.jobTitle = { contains: jobTitle, mode: 'insensitive' };
    }

    if (interests.length > 0) {
      where.attendeeProfile = {
        ...where.attendeeProfile,
        interests: {
          hasSome: interests
        }
      };
    }

    // If eventId is provided, filter by event attendees
    if (eventId) {
      where.orders = {
        some: {
          eventId: eventId
        }
      };
    }

    const [attendees, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          jobTitle: true,
          bio: true,
          avatarUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          website: true,
          attendeeProfile: {
            select: {
              interests: true,
              networkingOptIn: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Calculate networking compatibility for each attendee
    const currentUserProfile = await prisma.attendeeProfile.findUnique({
      where: { userId: authResult.userId },
      select: { interests: true }
    });

    const currentUserInterests = currentUserProfile?.interests || [];

    const attendeesWithCompatibility = attendees.map(attendee => {
      const attendeeInterests = attendee.attendeeProfile?.interests || [];
      const commonInterests = attendeeInterests.filter(interest => 
        currentUserInterests.includes(interest)
      );
      const compatibilityScore = attendeeInterests.length > 0 
        ? (commonInterests.length / attendeeInterests.length) * 100 
        : 0;

      return {
        ...attendee,
        networkingCompatibility: {
          score: Math.round(compatibilityScore),
          commonInterests,
          totalCommonInterests: commonInterests.length
        }
      };
    });

    // Sort by compatibility score if no other sorting is specified
    if (!search && !company && !jobTitle) {
      attendeesWithCompatibility.sort((a, b) => 
        b.networkingCompatibility.score - a.networkingCompatibility.score
      );
    }

    return NextResponse.json({
      ok: true,
      attendees: attendeesWithCompatibility,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch attendee directory:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch attendee directory' },
      { status: 500 }
    );
  }
}

// POST /api/attendees/directory - Send connection request
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetUserId, message } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { ok: false, error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Check if target user exists and has networking enabled
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        attendeeProfile: {
          select: { networkingOptIn: true }
        }
      }
    });

    if (!targetUser || !targetUser.attendeeProfile?.networkingOptIn) {
      return NextResponse.json(
        { ok: false, error: 'User not available for networking' },
        { status: 404 }
      );
    }

    // Get sender information
    const senderUser = await prisma.user.findUnique({
      where: { id: authResult.userId },
      select: { name: true, company: true, jobTitle: true }
    });

    // Create connection request notification
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'INFO',
        title: 'New Connection Request',
        message: message || `${senderUser?.name} would like to connect with you.`,
        actionUrl: `/attendee/networking/requests`,
        metadata: {
          type: 'connection_request',
          senderId: authResult.userId,
          senderName: senderUser?.name,
          senderCompany: senderUser?.company,
          senderJobTitle: senderUser?.jobTitle,
          message: message
        }
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Connection request sent successfully',
      notificationId: notification.id
    });
  } catch (error) {
    console.error('Failed to send connection request:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to send connection request' },
      { status: 500 }
    );
  }
}
