import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/analytics - Get analytics data for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const timeRange = searchParams.get('timeRange') || '7d';

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get basic metrics
    const [
      totalRegistrations,
      checkedInCount,
      totalRevenue,
      averageRating,
      sessionCount,
      ticketTypes
    ] = await Promise.all([
      // Total registrations
      prisma.attendee.count({
        where: { eventId }
      }),
      
      // Check-in count
      prisma.attendee.count({
        where: { 
          eventId,
          checkedIn: true
        }
      }),
      
      // Total revenue
      prisma.order.aggregate({
        where: {
          attendees: {
            some: { eventId }
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Average rating (mock data for now)
      Promise.resolve({ _avg: { rating: 4.8 } }),
      
      // Session count
      prisma.session.count({
        where: { eventId }
      }),
      
      // Ticket types with sales
      prisma.ticket.findMany({
        where: { eventId },
        include: {
          _count: {
            select: {
              attendees: true
            }
          }
        }
      })
    ]);

    // Registration trend over time
    const registrationTrend = await prisma.attendee.groupBy({
      by: ['registrationDate'],
      where: {
        eventId,
        registrationDate: {
          gte: startDate
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        registrationDate: 'asc'
      }
    });

    // Session popularity
    const sessionPopularity = await prisma.session.findMany({
      where: { eventId },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      orderBy: {
        attendees: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Revenue by ticket type
    const revenueByTicketType = ticketTypes.map(ticket => ({
      ticketType: ticket.name,
      sold: ticket._count.attendees,
      total: ticket.quantity,
      revenue: ticket.price * ticket._count.attendees,
      percentage: ticket.quantity > 0 ? (ticket._count.attendees / ticket.quantity) * 100 : 0
    }));

    // Check-in rate by hour (for current day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkinsByHour = await prisma.attendee.groupBy({
      by: ['checkedInAt'],
      where: {
        eventId,
        checkedIn: true,
        checkedInAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: {
        id: true
      }
    });

    // Calculate metrics
    const checkInRate = totalRegistrations > 0 ? (checkedInCount / totalRegistrations) * 100 : 0;
    const sessionAttendanceRate = 92; // Mock data - would calculate from actual session attendance
    const avgSessionDuration = 45; // Mock data - would calculate from session data

    // Format response
    const analytics = {
      overview: {
        totalRegistrations,
        checkInRate: Math.round(checkInRate * 10) / 10,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        averageRating: averageRating._avg.rating || 0,
        sessionCount,
        sessionAttendanceRate,
        avgSessionDuration
      },
      trends: {
        registrations: registrationTrend.map(item => ({
          date: item.registrationDate,
          count: item._count.id
        })),
        revenue: revenueByTicketType.map((item, index) => ({
          period: `Week ${index + 1}`,
          amount: item.revenue
        }))
      },
      ticketSales: revenueByTicketType,
      sessionPopularity: sessionPopularity.map(session => ({
        name: session.title,
        attendees: session._count.attendees
      })),
      checkinsByHour: checkinsByHour.map(item => ({
        hour: item.checkedInAt ? new Date(item.checkedInAt).getHours() : 0,
        count: item._count.id
      }))
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// GET /api/analytics/export - Export analytics data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, format = 'csv', timeRange = '30d' } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Get comprehensive data for export
    const [attendees, sessions, orders] = await Promise.all([
      prisma.attendee.findMany({
        where: { eventId },
        include: {
          ticket: true,
          event: true
        }
      }),
      prisma.session.findMany({
        where: { eventId },
        include: {
          speakers: true,
          attendees: true
        }
      }),
      prisma.order.findMany({
        where: {
          attendees: {
            some: { eventId }
          }
        },
        include: {
          attendees: true
        }
      })
    ]);

    if (format === 'csv') {
      // Generate CSV data
      const csvData = {
        attendees: attendees.map(a => ({
          name: a.name,
          email: a.email,
          ticketType: a.ticket.name,
          registrationDate: a.registrationDate,
          checkedIn: a.checkedIn,
          checkedInAt: a.checkedInAt
        })),
        sessions: sessions.map(s => ({
          title: s.title,
          track: s.track,
          room: s.room,
          startAt: s.startAt,
          endAt: s.endAt,
          attendeeCount: s.attendees.length,
          speakers: s.speakers.map(sp => sp.name).join(', ')
        })),
        revenue: orders.map(o => ({
          orderDate: o.orderDate,
          buyerEmail: o.buyerEmail,
          totalAmount: o.totalAmount,
          ticketCount: o.attendees.length,
          status: o.status
        }))
      };

      return NextResponse.json({
        success: true,
        data: csvData,
        format: 'csv'
      });
    }

    // For other formats, return JSON
    return NextResponse.json({
      success: true,
      data: {
        attendees,
        sessions,
        orders
      },
      format: 'json'
    });

  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
