import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Advanced analytics with custom reporting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const reportType = searchParams.get('reportType') || 'overview';
    const timeRange = searchParams.get('timeRange') || '7d';
    const granularity = searchParams.get('granularity') || 'day';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    let analytics: any = {};

    switch (reportType) {
      case 'overview':
        analytics = await getOverviewAnalytics(eventId, startDate, endDate);
        break;
      case 'attendee_behavior':
        analytics = await getAttendeeBehaviorAnalytics(eventId, startDate, endDate, granularity);
        break;
      case 'session_performance':
        analytics = await getSessionPerformanceAnalytics(eventId, startDate, endDate);
        break;
      case 'networking_insights':
        analytics = await getNetworkingInsights(eventId, startDate, endDate);
        break;
      case 'revenue_analysis':
        analytics = await getRevenueAnalysis(eventId, startDate, endDate, granularity);
        break;
      case 'engagement_metrics':
        analytics = await getEngagementMetrics(eventId, startDate, endDate);
        break;
      case 'roi_tracking':
        analytics = await getROITracking(eventId, startDate, endDate);
        break;
      default:
        analytics = await getOverviewAnalytics(eventId, startDate, endDate);
    }

    return NextResponse.json({
      reportType,
      timeRange,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      analytics
    });

  } catch (error) {
    console.error('Advanced Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Overview analytics
async function getOverviewAnalytics(eventId: string | null, startDate: Date, endDate: Date) {
  const whereClause = {
    ...(eventId && { eventId }),
    createdAt: { gte: startDate, lte: endDate }
  };

  const [
    totalAttendees,
    totalRevenue,
    totalSessions,
    totalCheckIns,
    avgSessionRating,
    topSessions,
    recentActivity
  ] = await Promise.all([
    // Total attendees
    prisma.user.count({
      where: {
        role: 'ATTENDEE',
        isActive: true,
        ...(eventId && {
          orders: { some: { eventId } }
        })
      }
    }),

    // Total revenue
    prisma.order.aggregate({
      where: {
        ...whereClause,
        status: 'COMPLETED'
      },
      _sum: { totalCents: true }
    }),

    // Total sessions
    prisma.session.count({
      where: eventId ? { eventId } : {}
    }),

    // Total check-ins
    prisma.checkIn.count({
      where: {
        checkedInAt: { gte: startDate, lte: endDate },
        ...(eventId && {
          session: { eventId }
        })
      }
    }),

    // Average session rating
    prisma.feedback.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        ...(eventId && {
          session: { eventId }
        })
      },
      _avg: { rating: true }
    }),

    // Top performing sessions
    prisma.session.findMany({
      where: eventId ? { eventId } : {},
      include: {
        _count: {
          select: {
            bookmarks: true,
            checkIns: true,
            feedback: true
          }
        },
        feedback: {
          select: { rating: true }
        }
      },
      take: 5
    }),

    // Recent activity
    prisma.checkIn.findMany({
      where: {
        checkedInAt: { gte: startDate, lte: endDate },
        ...(eventId && {
          session: { eventId }
        })
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        session: {
          select: { id: true, title: true }
        }
      },
      orderBy: { checkedInAt: 'desc' },
      take: 10
    })
  ]);

  // Calculate top sessions with ratings
  const topSessionsWithMetrics = topSessions.map(session => {
    const avgRating = session.feedback.length > 0 
      ? session.feedback.reduce((sum, f) => sum + f.rating, 0) / session.feedback.length 
      : 0;
    
    return {
      id: session.id,
      title: session.title,
      registrations: session._count.bookmarks,
      checkIns: session._count.checkIns,
      feedbackCount: session._count.feedback,
      avgRating: Math.round(avgRating * 10) / 10,
      attendanceRate: session._count.bookmarks > 0 
        ? Math.round((session._count.checkIns / session._count.bookmarks) * 100) 
        : 0
    };
  }).sort((a, b) => b.attendanceRate - a.attendanceRate);

  return {
    summary: {
      totalAttendees,
      totalRevenue: (totalRevenue._sum.totalCents || 0) / 100,
      totalSessions,
      totalCheckIns,
      avgSessionRating: Math.round((avgSessionRating._avg.rating || 0) * 10) / 10
    },
    topSessions: topSessionsWithMetrics,
    recentActivity: recentActivity.map(activity => ({
      id: activity.id,
      type: 'check_in',
      user: activity.user,
      session: activity.session,
      timestamp: activity.checkedInAt
    }))
  };
}

// Attendee behavior analytics
async function getAttendeeBehaviorAnalytics(eventId: string | null, startDate: Date, endDate: Date, granularity: string) {
  // Check-in patterns by time
  const checkInPatterns = await prisma.checkIn.groupBy({
    by: ['checkedInAt'],
    where: {
      checkedInAt: { gte: startDate, lte: endDate },
      ...(eventId && {
        session: { eventId }
      })
    },
    _count: { id: true }
  });

  // Session attendance patterns
  const sessionAttendance = await prisma.session.findMany({
    where: eventId ? { eventId } : {},
    include: {
      _count: {
        select: {
          bookmarks: true,
          checkIns: true
        }
      }
    }
  });

  // User engagement metrics
  const userEngagement = await prisma.user.findMany({
    where: {
      role: 'ATTENDEE',
      ...(eventId && {
        orders: { some: { eventId } }
      })
    },
    include: {
      _count: {
        select: {
          checkIns: true,
          sessionBookmarks: true,
          sentNetworkingConnections: true,
          receivedNetworkingConnections: true
        }
      }
    },
    take: 100
  });

  // Process check-in patterns by hour
  const hourlyCheckIns = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0
  }));

  checkInPatterns.forEach(pattern => {
    const hour = new Date(pattern.checkedInAt).getHours();
    hourlyCheckIns[hour].count += pattern._count.id;
  });

  // Calculate engagement scores
  const engagementScores = userEngagement.map(user => {
    const totalSessions = user._count.sessionBookmarks;
    const attendedSessions = user._count.checkIns;
    const networkingConnections = user._count.sentNetworkingConnections + user._count.receivedNetworkingConnections;
    
    const attendanceRate = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
    const engagementScore = (attendanceRate * 0.6) + (networkingConnections * 10 * 0.4);
    
    return {
      userId: user.id,
      userName: user.name,
      totalSessions,
      attendedSessions,
      attendanceRate: Math.round(attendanceRate),
      networkingConnections,
      engagementScore: Math.round(engagementScore)
    };
  }).sort((a, b) => b.engagementScore - a.engagementScore);

  return {
    checkInPatterns: {
      hourly: hourlyCheckIns,
      peakHours: hourlyCheckIns
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(h => ({ hour: h.hour, count: h.count }))
    },
    sessionAttendance: sessionAttendance.map(session => ({
      id: session.id,
      title: session.title,
      registrations: session._count.bookmarks,
      checkIns: session._count.checkIns,
      attendanceRate: session._count.bookmarks > 0 
        ? Math.round((session._count.checkIns / session._count.bookmarks) * 100) 
        : 0
    })),
    userEngagement: {
      topEngaged: engagementScores.slice(0, 10),
      averageEngagement: Math.round(
        engagementScores.reduce((sum, user) => sum + user.engagementScore, 0) / engagementScores.length
      ),
      engagementDistribution: {
        high: engagementScores.filter(u => u.engagementScore >= 80).length,
        medium: engagementScores.filter(u => u.engagementScore >= 50 && u.engagementScore < 80).length,
        low: engagementScores.filter(u => u.engagementScore < 50).length
      }
    }
  };
}

// Session performance analytics
async function getSessionPerformanceAnalytics(eventId: string | null, startDate: Date, endDate: Date) {
  const sessions = await prisma.session.findMany({
    where: eventId ? { eventId } : {},
    include: {
      _count: {
        select: {
          bookmarks: true,
          checkIns: true,
          feedback: true,
          waitlist: true
        }
      },
      feedback: {
        select: { rating: true, comment: true }
      },
      speakers: {
        include: {
          speaker: {
            select: { user: { select: { name: true } } }
          }
        }
      }
    }
  });

  const sessionMetrics = sessions.map(session => {
    const avgRating = session.feedback.length > 0 
      ? session.feedback.reduce((sum, f) => sum + f.rating, 0) / session.feedback.length 
      : 0;
    
    const attendanceRate = session._count.bookmarks > 0 
      ? (session._count.checkIns / session._count.bookmarks) * 100 
      : 0;

    const demandScore = session._count.waitlist > 0 
      ? ((session._count.bookmarks + session._count.waitlist) / (session.maxAttendees || session._count.bookmarks)) * 100
      : attendanceRate;

    return {
      id: session.id,
      title: session.title,
      startAt: session.startAt,
      speakers: session.speakers.map(s => s.speaker.user.name),
      registrations: session._count.bookmarks,
      checkIns: session._count.checkIns,
      waitlistCount: session._count.waitlist,
      feedbackCount: session._count.feedback,
      avgRating: Math.round(avgRating * 10) / 10,
      attendanceRate: Math.round(attendanceRate),
      demandScore: Math.round(demandScore),
      capacity: session.maxAttendees,
      utilizationRate: session.maxAttendees 
        ? Math.round((session._count.bookmarks / session.maxAttendees) * 100)
        : 100
    };
  });

  // Sort by different metrics
  const topByAttendance = [...sessionMetrics].sort((a, b) => b.attendanceRate - a.attendanceRate).slice(0, 5);
  const topByRating = [...sessionMetrics].sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
  const topByDemand = [...sessionMetrics].sort((a, b) => b.demandScore - a.demandScore).slice(0, 5);

  return {
    overview: {
      totalSessions: sessions.length,
      avgAttendanceRate: Math.round(
        sessionMetrics.reduce((sum, s) => sum + s.attendanceRate, 0) / sessionMetrics.length
      ),
      avgRating: Math.round(
        sessionMetrics.reduce((sum, s) => sum + s.avgRating, 0) / sessionMetrics.length * 10
      ) / 10,
      totalFeedback: sessionMetrics.reduce((sum, s) => sum + s.feedbackCount, 0)
    },
    topPerformers: {
      byAttendance: topByAttendance,
      byRating: topByRating,
      byDemand: topByDemand
    },
    allSessions: sessionMetrics
  };
}

// Networking insights
async function getNetworkingInsights(eventId: string | null, startDate: Date, endDate: Date) {
  const [
    totalConnections,
    totalMeetings,
    businessCardExchanges,
    networkingActivity
  ] = await Promise.all([
    prisma.networkingConnection.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'ACCEPTED',
        ...(eventId && { eventId })
      }
    }),

    prisma.networkingMeeting.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        ...(eventId && { eventId })
      }
    }),

    prisma.businessCardExchange.count({
      where: {
        exchangedAt: { gte: startDate, lte: endDate },
        ...(eventId && { eventId })
      }
    }),

    prisma.networkingConnection.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        ...(eventId && { eventId })
      },
      _count: { id: true }
    })
  ]);

  // Most connected users
  const topNetworkers = await prisma.user.findMany({
    where: {
      role: 'ATTENDEE',
      ...(eventId && {
        orders: { some: { eventId } }
      })
    },
    include: {
      _count: {
        select: {
          sentNetworkingConnections: {
            where: { status: 'ACCEPTED' }
          },
          receivedNetworkingConnections: {
            where: { status: 'ACCEPTED' }
          }
        }
      }
    },
    take: 10
  });

  const networkerMetrics = topNetworkers.map(user => ({
    id: user.id,
    name: user.name,
    company: user.company,
    totalConnections: user._count.sentNetworkingConnections + user._count.receivedNetworkingConnections
  })).sort((a, b) => b.totalConnections - a.totalConnections);

  return {
    summary: {
      totalConnections,
      totalMeetings,
      businessCardExchanges,
      networkingRate: totalConnections > 0 ? Math.round((totalConnections / topNetworkers.length) * 100) / 100 : 0
    },
    topNetworkers: networkerMetrics.slice(0, 5),
    activityTimeline: networkingActivity.map(activity => ({
      date: activity.createdAt,
      connections: activity._count.id
    }))
  };
}

// Revenue analysis
async function getRevenueAnalysis(eventId: string | null, startDate: Date, endDate: Date, granularity: string) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: 'COMPLETED',
      ...(eventId && { eventId })
    },
    include: {
      ticketType: {
        select: { name: true, priceCents: true }
      }
    }
  });

  // Revenue by ticket type
  const revenueByTicketType = orders.reduce((acc, order) => {
    const ticketTypeName = order.ticketType?.name || 'Unknown';
    if (!acc[ticketTypeName]) {
      acc[ticketTypeName] = { revenue: 0, quantity: 0 };
    }
    acc[ticketTypeName].revenue += order.totalCents;
    acc[ticketTypeName].quantity += order.quantity;
    return acc;
  }, {} as Record<string, { revenue: number; quantity: number }>);

  // Revenue timeline
  const revenueTimeline = orders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.totalCents;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
  const totalTickets = orders.reduce((sum, order) => sum + order.quantity, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return {
    summary: {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      totalTickets,
      avgOrderValue: Math.round(avgOrderValue) / 100
    },
    revenueByTicketType: Object.entries(revenueByTicketType).map(([name, data]) => ({
      ticketType: name,
      revenue: data.revenue / 100,
      quantity: data.quantity,
      avgPrice: Math.round(data.revenue / data.quantity) / 100
    })),
    revenueTimeline: Object.entries(revenueTimeline).map(([date, revenue]) => ({
      date,
      revenue: revenue / 100
    })).sort((a, b) => a.date.localeCompare(b.date))
  };
}

// Engagement metrics
async function getEngagementMetrics(eventId: string | null, startDate: Date, endDate: Date) {
  // Implementation for engagement metrics
  return {
    summary: {
      totalEngagements: 0,
      avgEngagementTime: 0,
      engagementRate: 0
    },
    engagementByFeature: [],
    userJourney: []
  };
}

// ROI tracking
async function getROITracking(eventId: string | null, startDate: Date, endDate: Date) {
  // Implementation for ROI tracking
  return {
    summary: {
      totalInvestment: 0,
      totalReturn: 0,
      roi: 0
    },
    costBreakdown: [],
    revenueStreams: []
  };
}
