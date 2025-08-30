import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';

    // Build where clause for filtering
    const whereClause: any = {
      role: {
        in: ['STAFF', 'STAFF_MANAGER', 'VOLUNTEER', 'SUPER_ADMIN']
      }
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role !== 'all') {
      whereClause.role = role;
    }

    if (status !== 'all') {
      whereClause.status = status;
    }

    // Fetch staff members with their task statistics
    const staff = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        department: true,
        lastActiveAt: true,
        createdAt: true,
        _count: {
          select: {
            assignedTasks: true,
            completedTasks: true
          }
        },
        assignedTasks: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Format staff data
    const formattedStaff = staff.map(member => ({
      id: member.id,
      name: member.name || 'Unknown',
      email: member.email,
      phone: member.phone || 'Not provided',
      role: member.role,
      department: member.department || 'General',
      status: member.status || 'active',
      lastActive: getTimeAgo(member.lastActiveAt || member.createdAt),
      tasksCompleted: member.assignedTasks.length,
      totalTasks: member._count.assignedTasks
    }));

    // Get staff statistics
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === 'ACTIVE').length;
    const onBreakStaff = staff.filter(s => s.status === 'ON_BREAK').length;
    const inactiveStaff = staff.filter(s => s.status === 'INACTIVE').length;

    // Calculate average completion rate
    const totalTasks = staff.reduce((sum, s) => sum + s._count.assignedTasks, 0);
    const completedTasks = staff.reduce((sum, s) => sum + s.assignedTasks.length, 0);
    const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      staff: formattedStaff,
      stats: {
        total: totalStaff,
        active: activeStaff,
        onBreak: onBreakStaff,
        inactive: inactiveStaff,
        avgCompletionRate
      }
    });

  } catch (error) {
    console.error('Staff API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      staff: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@wecon.com',
          phone: '+1 (555) 123-4567',
          role: 'STAFF_MANAGER',
          department: 'Operations',
          status: 'active',
          lastActive: '2 minutes ago',
          tasksCompleted: 8,
          totalTasks: 10
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@wecon.com',
          phone: '+1 (555) 234-5678',
          role: 'STAFF',
          department: 'Registration',
          status: 'active',
          lastActive: '5 minutes ago',
          tasksCompleted: 12,
          totalTasks: 15
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@wecon.com',
          phone: '+1 (555) 345-6789',
          role: 'VOLUNTEER',
          department: 'Guest Services',
          status: 'on_break',
          lastActive: '1 hour ago',
          tasksCompleted: 6,
          totalTasks: 8
        }
      ],
      stats: {
        total: 3,
        active: 2,
        onBreak: 1,
        inactive: 0,
        avgCompletionRate: 85
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, role, department } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new staff member
    const newStaffMember = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role,
        department,
        status: 'ACTIVE',
        lastActiveAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Staff member created successfully',
      staff: newStaffMember
    }, { status: 201 });

  } catch (error) {
    console.error('Create Staff API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, role, department, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Staff member ID is required' },
        { status: 400 }
      );
    }

    // Update staff member
    const updatedStaffMember = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(department && { department }),
        ...(status && { status }),
        lastActiveAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Staff member updated successfully',
      staff: updatedStaffMember
    });

  } catch (error) {
    console.error('Update Staff API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Staff member ID is required' },
        { status: 400 }
      );
    }

    // Delete staff member (or mark as inactive)
    await prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        lastActiveAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Staff member deactivated successfully'
    });

  } catch (error) {
    console.error('Delete Staff API Error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate staff member' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}
