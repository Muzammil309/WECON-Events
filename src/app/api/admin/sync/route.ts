import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Check synchronization status across all modules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module') || 'all';

    // Get comprehensive sync status
    const [
      userStats,
      orderStats,
      checkInStats,
      ticketStats,
      eventStats,
      notificationStats
    ] = await Promise.all([
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
        where: { isActive: true }
      }),
      
      // Order statistics
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      
      // Check-in statistics
      prisma.checkIn.aggregate({
        _count: { id: true },
        where: {
          checkedInAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      }),
      
      // Ticket statistics
      prisma.ticketType.aggregate({
        _sum: { quantitySold: true, quantityTotal: true },
        _count: { id: true }
      }),
      
      // Event statistics
      prisma.event.count(),
      
      // Notification statistics
      prisma.notification.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ]);

    // Check for data inconsistencies
    const inconsistencies = [];

    // Check if users with orders can check in
    const usersWithOrders = await prisma.user.count({
      where: {
        orders: { some: {} }
      }
    });

    const usersWithCheckIns = await prisma.user.count({
      where: {
        checkIns: { some: {} }
      }
    });

    if (usersWithOrders > 0 && usersWithCheckIns === 0) {
      inconsistencies.push({
        type: 'CHECK_IN_SYNC',
        message: 'Users have purchased tickets but no check-ins recorded',
        severity: 'WARNING'
      });
    }

    // Check for orphaned orders
    const orphanedOrders = await prisma.order.count({
      where: {
        user: null
      }
    });

    if (orphanedOrders > 0) {
      inconsistencies.push({
        type: 'ORPHANED_ORDERS',
        message: `${orphanedOrders} orders without associated users`,
        severity: 'ERROR'
      });
    }

    // Check for events without tickets
    const eventsWithoutTickets = await prisma.event.count({
      where: {
        ticketTypes: { none: {} }
      }
    });

    if (eventsWithoutTickets > 0) {
      inconsistencies.push({
        type: 'EVENTS_NO_TICKETS',
        message: `${eventsWithoutTickets} events have no ticket types`,
        severity: 'WARNING'
      });
    }

    const syncStatus = {
      timestamp: new Date().toISOString(),
      overall: inconsistencies.length === 0 ? 'HEALTHY' : 'ISSUES_FOUND',
      modules: {
        users: {
          total: userStats.reduce((sum, stat) => sum + stat._count.id, 0),
          byRole: userStats.reduce((acc, stat) => {
            acc[stat.role] = stat._count.id;
            return acc;
          }, {} as Record<string, number>),
          status: 'HEALTHY'
        },
        orders: {
          total: orderStats.reduce((sum, stat) => sum + stat._count.id, 0),
          byStatus: orderStats.reduce((acc, stat) => {
            acc[stat.status] = stat._count.id;
            return acc;
          }, {} as Record<string, number>),
          status: orphanedOrders > 0 ? 'ISSUES' : 'HEALTHY'
        },
        checkIns: {
          total: checkInStats._count.id,
          last24Hours: checkInStats._count.id,
          status: 'HEALTHY'
        },
        tickets: {
          totalTypes: ticketStats._count.id,
          totalSold: ticketStats._sum.quantitySold || 0,
          totalAvailable: ticketStats._sum.quantityTotal || 0,
          status: 'HEALTHY'
        },
        events: {
          total: eventStats,
          status: eventsWithoutTickets > 0 ? 'WARNING' : 'HEALTHY'
        },
        notifications: {
          total: notificationStats.reduce((sum, stat) => sum + stat._count.id, 0),
          byStatus: notificationStats.reduce((acc, stat) => {
            acc[stat.status] = stat._count.id;
            return acc;
          }, {} as Record<string, number>),
          status: 'HEALTHY'
        }
      },
      inconsistencies,
      recommendations: generateRecommendations(inconsistencies)
    };

    return NextResponse.json(syncStatus);

  } catch (error) {
    console.error('Sync Status API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check sync status',
        timestamp: new Date().toISOString(),
        overall: 'ERROR'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Force synchronization of specific modules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, module } = body;

    const results = [];

    switch (action) {
      case 'SYNC_USER_ORDERS':
        // Ensure all users with orders can check in
        const usersWithOrders = await prisma.user.findMany({
          where: {
            orders: { some: { status: 'COMPLETED' } }
          },
          include: {
            orders: {
              where: { status: 'COMPLETED' },
              include: { ticketType: { include: { event: true } } }
            }
          }
        });

        for (const user of usersWithOrders) {
          // Ensure user has attendee role
          if (user.role !== 'ATTENDEE') {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: 'ATTENDEE' }
            });
          }
        }

        results.push({
          action: 'SYNC_USER_ORDERS',
          processed: usersWithOrders.length,
          message: `Synchronized ${usersWithOrders.length} users with orders`
        });
        break;

      case 'FIX_ORPHANED_ORDERS':
        // Handle orphaned orders
        const orphanedOrders = await prisma.order.findMany({
          where: { userId: null }
        });

        for (const order of orphanedOrders) {
          // Try to find user by email
          let user = await prisma.user.findUnique({
            where: { email: order.customerEmail }
          });

          if (!user) {
            // Create user from order data
            user = await prisma.user.create({
              data: {
                name: order.customerName,
                email: order.customerEmail,
                phone: order.customerPhone,
                role: 'ATTENDEE',
                isActive: true,
                emailVerified: false
              }
            });
          }

          // Link order to user
          await prisma.order.update({
            where: { id: order.id },
            data: { userId: user.id }
          });
        }

        results.push({
          action: 'FIX_ORPHANED_ORDERS',
          processed: orphanedOrders.length,
          message: `Fixed ${orphanedOrders.length} orphaned orders`
        });
        break;

      case 'REFRESH_STATS':
        // Recalculate ticket sold counts
        const ticketTypes = await prisma.ticketType.findMany({
          include: {
            orders: {
              where: { status: 'COMPLETED' }
            }
          }
        });

        for (const ticketType of ticketTypes) {
          const actualSold = ticketType.orders.reduce((sum, order) => sum + order.quantity, 0);
          
          if (actualSold !== ticketType.quantitySold) {
            await prisma.ticketType.update({
              where: { id: ticketType.id },
              data: { quantitySold: actualSold }
            });
          }
        }

        results.push({
          action: 'REFRESH_STATS',
          processed: ticketTypes.length,
          message: `Refreshed statistics for ${ticketTypes.length} ticket types`
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync Action API Error:', error);
    return NextResponse.json(
      { error: 'Failed to perform sync action' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generateRecommendations(inconsistencies: any[]) {
  const recommendations = [];

  for (const issue of inconsistencies) {
    switch (issue.type) {
      case 'CHECK_IN_SYNC':
        recommendations.push({
          action: 'SYNC_USER_ORDERS',
          description: 'Synchronize user orders with check-in system',
          priority: 'HIGH'
        });
        break;
      case 'ORPHANED_ORDERS':
        recommendations.push({
          action: 'FIX_ORPHANED_ORDERS',
          description: 'Link orphaned orders to users',
          priority: 'CRITICAL'
        });
        break;
      case 'EVENTS_NO_TICKETS':
        recommendations.push({
          action: 'CREATE_TICKET_TYPES',
          description: 'Create ticket types for events without tickets',
          priority: 'MEDIUM'
        });
        break;
    }
  }

  return recommendations;
}
