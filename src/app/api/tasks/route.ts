import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/tasks - Get all tasks with filtering
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
    const eventId = searchParams.get('eventId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (eventId) {
      where.eventId = eventId;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          comments: {
            include: {
              task: false
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
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
      eventId,
      title,
      description,
      priority = 'MEDIUM',
      dueDate,
      estimatedHours,
      assigneeId,
      tags = [],
      dependencies = [],
      attachments = []
    } = body;

    // Validate required fields
    if (!eventId || !title) {
      return NextResponse.json(
        { ok: false, error: 'Event ID and title are required' },
        { status: 400 }
      );
    }

    // Validate due date
    if (dueDate && new Date(dueDate) < new Date()) {
      return NextResponse.json(
        { ok: false, error: 'Due date cannot be in the past' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        eventId,
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours,
        assigneeId,
        creatorId: authResult.userId,
        tags,
        dependencies,
        attachments
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      task
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks - Bulk update tasks
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
    const { taskIds, updates } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Task IDs are required' },
        { status: 400 }
      );
    }

    // Update tasks
    const updatedTasks = await prisma.task.updateMany({
      where: {
        id: { in: taskIds }
      },
      data: updates
    });

    return NextResponse.json({
      ok: true,
      message: `Updated ${updatedTasks.count} tasks`,
      count: updatedTasks.count
    });
  } catch (error) {
    console.error('Failed to update tasks:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
}
