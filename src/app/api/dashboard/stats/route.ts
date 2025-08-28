import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/stats - Get dashboard statistics
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

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Build where clause based on user role
    let eventFilter: any = {};
    if (!['SUPER_ADMIN', 'ADMIN'].includes(authResult.payload?.role?.toUpperCase())) {
      // Non-admin users only see events they manage or are involved with
      eventFilter = {
        OR: [
          { managerId: authResult.payload?.sub },
          { staff: { some: { staffId: authResult.payload?.sub } } },
          { sessions: { some: { speakers: { some: { speaker: { userId: authResult.payload?.sub } } } } } }
        ]
      };
    }

    // Fetch comprehensive statistics
    const [
      totalEvents,
      activeEvents,
      completedEvents,
      totalSessions,
      activeSessions,
      totalTasks,
      pendingTasks,
      completedTasks,
      totalAttendees,
      todayRegistrations,
      weeklyRegistrations,
      totalStaff,
      activeStaff,
      totalVenues,
      totalSponsors,
      upcomingSessions,
      recentTasks,
      recentNotifications
    ] = await Promise.all([
      // Event statistics
      prisma.event.count({ where: eventFilter }),
      prisma.event.count({ 
        where: { 
          ...eventFilter,
          status: 'LIVE'
        }
      }),
      prisma.event.count({ 
        where: { 
          ...eventFilter,
          status: 'COMPLETED'
        }
      }),

      // Session statistics
      prisma.session.count({
        where: {
          event: eventFilter
        }
      }),
      prisma.session.count({
        where: {
          event: eventFilter,
          startAt: { lte: now },
          endAt: { gte: now }
        }
      }),

      // Task statistics
      prisma.task.count({
        where: {
          event: eventFilter
        }
      }),
      prisma.task.count({
        where: {
          event: eventFilter,
          status: { in: ['TODO', 'IN_PROGRESS'] }
        }
      }),
      prisma.task.count({
        where: {
          event: eventFilter,
          status: 'COMPLETED'
        }
      }),

      // Attendee statistics
      prisma.order.count({
        where: {
          event: eventFilter
        }
      }),
      prisma.order.count({
        where: {
          event: eventFilter,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      prisma.order.count({
        where: {
          event: eventFilter,
          createdAt: {
            gte: startOfWeek,
            lt: endOfDay
          }
        }
      }),

      // Staff statistics
      prisma.user.count({
        where: {
          role: { in: ['STAFF', 'VOLUNTEER', 'STAFF_MANAGER', 'ORGANIZER'] }
        }
      }),
      prisma.staffShift.count({
        where: {
          event: eventFilter,
          startTime: { lte: now },
          endTime: { gte: now },
          status: 'CHECKED_IN'
        }
      }),

      // Venue and sponsor statistics
      prisma.venue.count({
        where: {
          event: eventFilter
        }
      }),
      prisma.sponsor.count({
        where: {
          event: eventFilter
        }
      }),

      // Upcoming sessions (next 24 hours)
      prisma.session.findMany({
        where: {
          event: eventFilter,
          startAt: {
            gte: now,
            lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        include: {
          room: {
            select: {
              name: true,
              venue: {
                select: {
                  name: true
                }
              }
            }
          },
          event: {
            select: {
              name: true
            }
          }
        },
        orderBy: { startAt: 'asc' },
        take: 5
      }),

      // Recent tasks
      prisma.task.findMany({
        where: {
          event: eventFilter,
          status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] }
        },
        include: {
          assignee: {
            select: {
              name: true
            }
          },
          event: {
            select: {
              name: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 5
      }),

      // Recent notifications
      prisma.notification.findMany({
        where: {
          userId: authResult.userId
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Calculate performance metrics
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const eventCompletionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    const stats = {
      overview: {
        totalEvents,
        activeEvents,
        completedEvents,
        totalSessions,
        activeSessions,
        totalTasks,
        pendingTasks,
        completedTasks,
        totalAttendees,
        todayRegistrations,
        weeklyRegistrations,
        totalStaff,
        activeStaff,
        totalVenues,
        totalSponsors
      },
      performance: {
        taskCompletionRate: Math.round(taskCompletionRate),
        eventCompletionRate: Math.round(eventCompletionRate),
        averageSessionsPerEvent: totalEvents > 0 ? Math.round(totalSessions / totalEvents) : 0,
        averageAttendeesPerEvent: totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0
      },
      upcoming: {
        sessions: upcomingSessions.map(session => ({
          id: session.id,
          title: session.title,
          startAt: session.startAt,
          eventName: session.event.name,
          roomName: session.room?.name,
          venueName: session.room?.venue?.name
        }))
      },
      recent: {
        tasks: recentTasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          assigneeName: task.assignee?.name,
          eventName: task.event.name
        })),
        notifications: recentNotifications.map(notif => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          createdAt: notif.createdAt,
          isRead: notif.isRead
        }))
      }
    };

    return NextResponse.json({
      ok: true,
      stats,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
