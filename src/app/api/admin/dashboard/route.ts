import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch data from all modules for real-time dashboard
    const [staff, tasks, tickets, exhibitors] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            in: ['STAFF', 'STAFF_MANAGER', 'SUPER_ADMIN', 'VOLUNTEER']
          }
        },
        select: {
          id: true,
          name: true,
          status: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.task.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          assignedTo: {
            select: {
              name: true
            }
          },
          createdAt: true
        }
      }),
      prisma.ticketType.findMany({
        include: {
          _count: {
            select: {
              tickets: true
            }
          }
        }
      }),
      prisma.exhibitor.findMany({
        select: {
          id: true,
          companyName: true,
          status: true,
          packageType: true,
          createdAt: true
        }
      })
    ]);

    // Calculate real statistics
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === 'ACTIVE').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket._count.tickets * ticket.price), 0);
    const totalExhibitors = exhibitors.length;
    const confirmedExhibitors = exhibitors.filter(e => e.status === 'CONFIRMED').length;
    const eventProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent activity based on real data
    const recentActivity = [
      {
        id: 1,
        type: 'staff',
        message: `${totalStaff} staff members registered`,
        time: 'Live data'
      },
      {
        id: 2,
        type: 'task',
        message: `${completedTasks} of ${totalTasks} tasks completed`,
        time: 'Live data'
      },
      {
        id: 3,
        type: 'revenue',
        message: `$${totalRevenue.toLocaleString()} revenue generated`,
        time: 'Live data'
      },
      {
        id: 4,
        type: 'exhibitor',
        message: `${confirmedExhibitors} exhibitors confirmed`,
        time: 'Live data'
      }
    ];

    // Upcoming tasks
    const upcomingTasks = tasks
      .filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
      .map(task => ({
        id: task.id,
        title: task.title,
        due: new Date(task.dueDate).toLocaleDateString(),
        priority: task.priority.toLowerCase()
      }));

    // System alerts
    const systemAlerts = [
      {
        id: 1,
        type: activeStaff === totalStaff ? 'success' : 'warning',
        message: `${activeStaff}/${totalStaff} staff members active`,
        action: 'View'
      },
      {
        id: 2,
        type: 'info',
        message: `${totalExhibitors - confirmedExhibitors} exhibitor applications pending`,
        action: 'Review'
      },
      {
        id: 3,
        type: completedTasks === totalTasks && totalTasks > 0 ? 'success' : 'info',
        message: `${completedTasks}/${totalTasks} tasks completed`,
        action: 'View'
      }
    ];

    return NextResponse.json({
      totalStaff,
      activeStaff,
      totalTasks,
      completedTasks,
      totalRevenue,
      totalExhibitors,
      confirmedExhibitors,
      eventProgress,
      recentActivity,
      upcomingTasks,
      systemAlerts
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);

    // Return fallback data if database fails
    return NextResponse.json({
      totalStaff: 0,
      activeStaff: 0,
      totalTasks: 0,
      completedTasks: 0,
      totalRevenue: 0,
      totalExhibitors: 0,
      confirmedExhibitors: 0,
      eventProgress: 0,
      recentActivity: [
        { id: 1, type: 'info', message: 'Dashboard ready - Start by adding staff members and creating tasks', time: 'System' }
      ],
      upcomingTasks: [],
      systemAlerts: [
        { id: 1, type: 'info', message: 'No data available - Add staff, tasks, and exhibitors to see live statistics', action: 'Setup' }
      ]
    });
  } finally {
    await prisma.$disconnect();
  }
}
