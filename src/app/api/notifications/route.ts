import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/notifications - Get user notifications
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: authResult.userId
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    if (type) {
      where.type = type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: authResult.userId,
          isRead: false
        }
      })
    ]);

    return NextResponse.json({
      ok: true,
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification
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
      userIds,
      type = 'INFO',
      title,
      message,
      actionUrl,
      metadata
    } = body;

    // Validate required fields
    if (!userIds || !Array.isArray(userIds) || !title || !message) {
      return NextResponse.json(
        { ok: false, error: 'User IDs, title, and message are required' },
        { status: 400 }
      );
    }

    // Create notifications for all specified users
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId: string) => ({
        userId,
        type,
        title,
        message,
        actionUrl,
        metadata
      }))
    });

    return NextResponse.json({
      ok: true,
      message: `Created ${notifications.count} notifications`,
      count: notifications.count
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create notifications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create notifications' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
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
    const { notificationIds, markAllAsRead = false } = body;

    let updatedCount = 0;

    if (markAllAsRead) {
      // Mark all user's notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          userId: authResult.userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      });
      updatedCount = result.count;
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: authResult.userId
        },
        data: {
          isRead: true
        }
      });
      updatedCount = result.count;
    } else {
      return NextResponse.json(
        { ok: false, error: 'Either notificationIds or markAllAsRead must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Marked ${updatedCount} notifications as read`,
      count: updatedCount
    });
  } catch (error) {
    console.error('Failed to update notifications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
