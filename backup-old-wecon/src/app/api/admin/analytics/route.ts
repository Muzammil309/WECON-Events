import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d'; // 7d, 30d, 90d, 1y
    const eventId = searchParams.get('eventId');

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Build where clause for event filtering
    const eventFilter = eventId ? { eventId } : {};

    // Parallel queries for better performance
    const [
      // Basic counts
      totalUsers,
      totalEvents,
      totalTicketTypes,
      totalOrders,
      totalRevenue,
      totalSessions,
      totalExhibitors,
      totalStaff,
      
      // Time-based analytics
      recentUsers,
      recentOrders,
      recentSessions,
      
      // Detailed analytics
      ticketSales,
      sessionAttendance,
      popularSessions,
      revenueByEvent,
      userGrowth,
      orderTrends,
      
      // Real-time metrics
      activeStaff,
      onlineDisplays,
      recentActivity
    ] = await Promise.all([
      // Basic counts
      prisma.user.count(),
      prisma.event.count(),
      prisma.ticketType.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalCents: true }
      }),
      prisma.session.count(),
      prisma.exhibitorProfile.count(),
      prisma.user.count({ where: { role: { in: ['STAFF', 'ADMIN'] } } }),
      
      // Time-based analytics
      prisma.user.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.count({
        where: { 
          createdAt: { gte: startDate },
          ...eventFilter
        }
      }),
      prisma.session.count({
        where: { 
          createdAt: { gte: startDate },
          ...eventFilter
        }
      }),
      
      // Detailed analytics
      prisma.ticketType.findMany({
        include: {
          _count: { select: { orders: true } },
          event: { select: { name: true } }
        },
        orderBy: { orders: { _count: 'desc' } },
        take: 10
      }),
      
      prisma.session.findMany({
        include: {
          _count: { 
            select: { 
              checkIns: true,
              bookmarks: true,
              feedback: true
            }
          },
          event: { select: { name: true } }
        },
        orderBy: { checkIns: { _count: 'desc' } },
        take: 10
      }),
      
      prisma.session.findMany({
        include: {
          _count: { select: { bookmarks: true } },
          event: { select: { name: true } }
        },
        orderBy: { bookmarks: { _count: 'desc' } },
        take: 5
      }),
      
      prisma.event.findMany({
        include: {
          _count: { select: { orders: true } },
          orders: {
            select: { totalAmount: true }
          }
        },
        orderBy: { orders: { _count: 'desc' } },
        take: 10
      }),
      
      // User growth by day for the last 30 days
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
      
      // Order trends by day
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total_cents) as revenue
        FROM "Order"
        WHERE created_at >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
      
      // Real-time metrics
      prisma.user.count({
        where: {
          role: { in: ['STAFF', 'ADMIN'] },
          lastLoginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Mock online displays count (replace with actual digital signage data)
      Promise.resolve(3),
      
      // Recent activity (last 10 activities)
      prisma.$queryRaw`
        SELECT 'user_registration' as type, 'New user registered' as description, created_at as timestamp, id
        FROM "User"
        WHERE created_at >= ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
        UNION ALL
        SELECT 'order_created' as type, 'New ticket order placed' as description, created_at as timestamp, id
        FROM "Order"
        WHERE created_at >= ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
        UNION ALL
        SELECT 'session_created' as type, 'New session scheduled' as description, created_at as timestamp, id
        FROM "Session"
        WHERE created_at >= ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
        ORDER BY timestamp DESC
        LIMIT 10
      `
    ]);

    // Calculate growth percentages
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (now.getTime() - startDate.getTime()));
    
    const [previousUsers, previousOrders] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: previousPeriodStart, lt: startDate }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: previousPeriodStart, lt: startDate },
          ...eventFilter
        }
      })
    ]);

    const userGrowthRate = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0;
    const orderGrowthRate = previousOrders > 0 ? ((recentOrders - previousOrders) / previousOrders) * 100 : 0;

    // Format response
    const analytics = {
      // Overview metrics
      totalUsers,
      totalEvents,
      totalTickets: totalTicketTypes,
      totalOrders,
      revenue: (totalRevenue._sum.totalCents || 0) / 100, // Convert cents to dollars
      totalSessions,
      totalExhibitors,
      totalStaff,
      
      // Growth metrics
      userGrowth: userGrowthRate,
      orderGrowth: orderGrowthRate,
      recentUsers,
      recentOrders,
      recentSessions,
      
      // Detailed analytics
      topTickets: ticketSales.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        eventName: ticket.event.name,
        sales: ticket._count.orders,
        revenue: ticket.priceCents * ticket._count.orders / 100
      })),
      
      topSessions: sessionAttendance.map(session => ({
        id: session.id,
        title: session.title,
        eventName: session.event.name,
        attendance: session._count.checkIns,
        bookmarks: session._count.bookmarks,
        feedback: session._count.feedback
      })),
      
      popularSessions: popularSessions.map(session => ({
        id: session.id,
        title: session.title,
        eventName: session.event.name,
        bookmarks: session._count.bookmarks
      })),
      
      revenueByEvent: revenueByEvent.map(event => ({
        id: event.id,
        name: event.name,
        orders: event._count.orders,
        revenue: event.orders.reduce((sum, order) => sum + order.totalCents, 0) / 100 // Convert to dollars
      })),
      
      // Trends
      userGrowthTrend: userGrowth,
      orderTrends,
      
      // Real-time metrics
      realTimeMetrics: {
        activeStaff,
        onlineDisplays,
        activeUsers: Math.floor(Math.random() * 100) + 50, // Mock for now
        liveStreams: 0 // Mock for now
      },
      
      // Recent activity
      recentActivity: (recentActivity as any[]).map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.timestamp
      })),
      
      // Metadata
      timeRange,
      generatedAt: new Date().toISOString(),
      eventId
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics API Error:', error);
    
    // Return fallback data
    return NextResponse.json({
      totalUsers: 0,
      totalEvents: 0,
      totalTickets: 0,
      totalOrders: 0,
      revenue: 0,
      totalSessions: 0,
      totalExhibitors: 0,
      totalStaff: 0,
      userGrowth: 0,
      orderGrowth: 0,
      recentUsers: 0,
      recentOrders: 0,
      recentSessions: 0,
      topTickets: [],
      topSessions: [],
      popularSessions: [],
      revenueByEvent: [],
      userGrowthTrend: [],
      orderTrends: [],
      realTimeMetrics: {
        activeStaff: 0,
        onlineDisplays: 0,
        activeUsers: 0,
        liveStreams: 0
      },
      recentActivity: [],
      timeRange: '30d',
      generatedAt: new Date().toISOString(),
      error: 'Failed to fetch analytics data'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
