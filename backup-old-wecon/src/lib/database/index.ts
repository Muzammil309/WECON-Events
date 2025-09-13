// Database service layer for WECON Event Management Platform
import { prisma } from '@/lib/prisma';
import { UserRole, EventStatus, TaskStatus, TaskPriority } from '@prisma/client';

// ==========================================
// USER MANAGEMENT SERVICES
// ==========================================

export class UserService {
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    company?: string;
    jobTitle?: string;
    phone?: string;
  }) {
    return await prisma.user.create({
      data: {
        ...data,
        role: data.role || UserRole.ATTENDEE,
      },
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        attendeeProfile: true,
        speakerProfile: true,
        exhibitorProfile: true,
        managedEvents: true,
        assignedTasks: true,
        staffShifts: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        attendeeProfile: true,
        speakerProfile: true,
        exhibitorProfile: true,
      },
    });
  }

  static async updateUserProfile(id: string, data: {
    name?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
    phone?: string;
    avatarUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    website?: string;
  }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async getStaffByRole(role: UserRole) {
    return await prisma.user.findMany({
      where: { role },
      include: {
        staffShifts: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: { startTime: 'asc' },
        },
        assignedTasks: {
          where: {
            status: {
              in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
            },
          },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
  }
}

// ==========================================
// EVENT MANAGEMENT SERVICES
// ==========================================

export class EventService {
  static async createEvent(data: {
    name: string;
    slug: string;
    description?: string;
    venue?: string;
    startAt: Date;
    endAt: Date;
    managerId?: string;
    maxAttendees?: number;
    category?: string;
    tags?: string[];
  }) {
    return await prisma.event.create({
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        status: EventStatus.DRAFT,
      },
      include: {
        manager: true,
        sessions: true,
        tickets: true,
      },
    });
  }

  static async getEventById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        manager: true,
        sessions: {
          include: {
            speakers: {
              include: {
                speaker: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            room: {
              include: {
                venue: true,
              },
            },
            bookmarks: true,
          },
          orderBy: { startAt: 'asc' },
        },
        tickets: true,
        rooms: {
          include: {
            venue: true,
          },
        },
        venues: true,
        exhibitors: {
          include: {
            user: true,
          },
        },
        sponsors: true,
        analytics: true,
      },
    });
  }

  static async getPublicEvents() {
    return await prisma.event.findMany({
      where: {
        isPublic: true,
        status: {
          in: [EventStatus.PUBLISHED, EventStatus.LIVE],
        },
      },
      include: {
        sessions: {
          take: 3,
          orderBy: { startAt: 'asc' },
          include: {
            speakers: {
              include: {
                speaker: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        tickets: true,
        _count: {
          select: {
            orders: true,
            sessions: true,
          },
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  static async updateEventStatus(id: string, status: EventStatus) {
    return await prisma.event.update({
      where: { id },
      data: { status },
    });
  }
}

// ==========================================
// SESSION MANAGEMENT SERVICES
// ==========================================

export class SessionService {
  static async createSession(data: {
    eventId: string;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    roomId?: string;
    maxAttendees?: number;
    sessionType?: string;
    track?: string;
  }) {
    return await prisma.session.create({
      data,
      include: {
        room: {
          include: {
            venue: true,
          },
        },
        speakers: {
          include: {
            speaker: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  static async getSessionsByEvent(eventId: string) {
    return await prisma.session.findMany({
      where: { eventId },
      include: {
        speakers: {
          include: {
            speaker: {
              include: {
                user: true,
              },
            },
          },
        },
        room: {
          include: {
            venue: true,
          },
        },
        bookmarks: true,
        checkIns: true,
        feedback: true,
      },
      orderBy: { startAt: 'asc' },
    });
  }

  static async bookmarkSession(userId: string, sessionId: string) {
    return await prisma.sessionBookmark.create({
      data: {
        userId,
        sessionId,
      },
    });
  }

  static async removeBookmark(userId: string, sessionId: string) {
    return await prisma.sessionBookmark.delete({
      where: {
        userId_sessionId: {
          userId,
          sessionId,
        },
      },
    });
  }

  static async getUserBookmarkedSessions(userId: string) {
    return await prisma.sessionBookmark.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            speakers: {
              include: {
                speaker: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            room: {
              include: {
                venue: true,
              },
            },
          },
        },
      },
      orderBy: {
        session: {
          startAt: 'asc',
        },
      },
    });
  }
}

// ==========================================
// TASK MANAGEMENT SERVICES
// ==========================================

export class TaskService {
  static async createTask(data: {
    title: string;
    description?: string;
    assigneeId?: string;
    creatorId: string;
    eventId?: string;
    priority: TaskPriority;
    dueDate?: Date;
    estimatedHours?: number;
  }) {
    return await prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.TODO,
      },
      include: {
        assignee: true,
        creator: true,
        event: true,
      },
    });
  }

  static async updateTaskStatus(id: string, status: TaskStatus) {
    return await prisma.task.update({
      where: { id },
      data: { 
        status,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
      },
      include: {
        assignee: true,
        creator: true,
        event: true,
      },
    });
  }

  static async getTasksByAssignee(assigneeId: string) {
    return await prisma.task.findMany({
      where: { assigneeId },
      include: {
        creator: true,
        event: true,
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });
  }

  static async getTasksByEvent(eventId: string) {
    return await prisma.task.findMany({
      where: { eventId },
      include: {
        assignee: true,
        creator: true,
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });
  }
}

// ==========================================
// ANALYTICS SERVICES
// ==========================================

export class AnalyticsService {
  static async getEventAnalytics(eventId: string) {
    const [
      totalRegistrations,
      totalCheckIns,
      sessionStats,
      feedbackStats,
      exhibitorStats,
    ] = await Promise.all([
      prisma.order.count({
        where: { eventId },
      }),
      prisma.checkIn.count({
        where: {
          session: {
            eventId,
          },
        },
      }),
      prisma.session.findMany({
        where: { eventId },
        include: {
          _count: {
            select: {
              checkIns: true,
              bookmarks: true,
              feedback: true,
            },
          },
        },
      }),
      prisma.feedback.aggregate({
        where: {
          session: {
            eventId,
          },
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),
      prisma.exhibitorProfile.count({
        where: { eventId },
      }),
    ]);

    return {
      totalRegistrations,
      totalCheckIns,
      sessionStats,
      averageRating: feedbackStats._avg.rating || 0,
      totalFeedback: feedbackStats._count.rating || 0,
      totalExhibitors: exhibitorStats,
    };
  }

  static async getUserEngagementStats(userId: string) {
    const [
      bookmarkedSessions,
      attendedSessions,
      feedbackGiven,
      connections,
    ] = await Promise.all([
      prisma.sessionBookmark.count({
        where: { userId },
      }),
      prisma.checkIn.count({
        where: { userId },
      }),
      prisma.feedback.count({
        where: { userId },
      }),
      prisma.connection.count({
        where: {
          OR: [
            { requesterId: userId },
            { recipientId: userId },
          ],
          status: 'ACCEPTED',
        },
      }),
    ]);

    return {
      bookmarkedSessions,
      attendedSessions,
      feedbackGiven,
      connections,
      engagementScore: Math.round(
        (bookmarkedSessions * 10 + attendedSessions * 20 + feedbackGiven * 15 + connections * 25) / 4
      ),
    };
  }
}
