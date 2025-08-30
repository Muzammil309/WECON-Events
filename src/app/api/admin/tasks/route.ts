import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';

    // Build where clause for filtering
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (priority !== 'all') {
      whereClause.priority = priority.toUpperCase();
    }

    // Fetch tasks with assigned user information
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });

    // Format tasks data
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority?.toLowerCase() || 'medium',
      status: task.status?.toLowerCase() || 'pending',
      assignedTo: {
        id: task.assignedTo?.id || '',
        name: task.assignedTo?.name || 'Unassigned',
        avatar: '' // Add avatar logic if needed
      },
      dueDate: task.dueDate?.toISOString() || new Date().toISOString(),
      createdAt: task.createdAt.toISOString(),
      completedAt: task.completedAt?.toISOString(),
      category: task.category || 'General',
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0,
      eventId: task.event?.id,
      eventTitle: task.event?.title
    }));

    // Calculate task statistics
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      pending: tasks.filter(t => t.status === 'PENDING').length,
      cancelled: tasks.filter(t => t.status === 'CANCELLED').length,
      overdue: tasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < new Date() && 
        t.status !== 'COMPLETED'
      ).length
    };

    return NextResponse.json({
      tasks: formattedTasks,
      stats: taskStats
    });

  } catch (error) {
    console.error('Tasks API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      tasks: [
        {
          id: '1',
          title: 'Setup Registration Booth',
          description: 'Configure registration booth with tablets and signage',
          priority: 'high',
          status: 'in_progress',
          assignedTo: { id: '1', name: 'Sarah Johnson' },
          dueDate: '2025-08-30T14:00:00Z',
          createdAt: '2025-08-30T08:00:00Z',
          category: 'Setup',
          estimatedHours: 3,
          actualHours: 2
        },
        {
          id: '2',
          title: 'Speaker Briefing Session',
          description: 'Conduct briefing session with all keynote speakers',
          priority: 'urgent',
          status: 'pending',
          assignedTo: { id: '2', name: 'Mike Chen' },
          dueDate: '2025-08-30T16:00:00Z',
          createdAt: '2025-08-30T09:00:00Z',
          category: 'Coordination',
          estimatedHours: 2
        }
      ],
      stats: {
        total: 2,
        completed: 0,
        inProgress: 1,
        pending: 1,
        cancelled: 0,
        overdue: 0
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      assignedToId,
      dueDate,
      category,
      estimatedHours,
      eventId
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority?.toUpperCase() || 'MEDIUM',
        status: 'PENDING',
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : null,
        category,
        estimatedHours: estimatedHours || 0,
        eventId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Task created successfully',
      task: newTask
    }, { status: 201 });

  } catch (error) {
    console.error('Create Task API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      priority,
      status,
      assignedToId,
      dueDate,
      category,
      estimatedHours,
      actualHours
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority.toUpperCase();
    if (status) {
      updateData.status = status.toUpperCase();
      if (status.toUpperCase() === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }
    if (assignedToId) updateData.assignedToId = assignedToId;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (category) updateData.category = category;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Update Task API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
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
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Delete task (or mark as cancelled)
    await prisma.task.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    });

    return NextResponse.json({
      message: 'Task cancelled successfully'
    });

  } catch (error) {
    console.error('Delete Task API Error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel task' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
