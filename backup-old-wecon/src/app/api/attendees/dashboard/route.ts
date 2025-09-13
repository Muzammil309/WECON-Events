import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { UserService, SessionService, AnalyticsService } from '@/lib/database';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/dashboard - Get comprehensive attendee dashboard data
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

    const userId = authResult.user.id;
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // Get user profile with all related data
    const user = await UserService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user engagement statistics
    const engagementStats = await AnalyticsService.getUserEngagementStats(userId);

    // Get upcoming sessions (next 7 days)
    const upcomingSessions = await prisma.session.findMany({
      where: {
        startAt: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
        ...(eventId && { eventId }),
      },
      include: {
        speakers: {
          include: {
            speaker: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        room: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bookmarks: {
          where: { userId },
        },
        _count: {
          select: {
            checkIns: true,
          },
        },
      },
      orderBy: { startAt: 'asc' },
      take: 10,
    });

    // Get bookmarked sessions
    const bookmarkedSessions = await SessionService.getUserBookmarkedSessions(userId);

    // Get networking suggestions (users with similar interests/roles)
    const networkingSuggestions = await prisma.user.findMany({
      where: {
        id: { not: userId },
        role: 'ATTENDEE',
        isActive: true,
        OR: [
          { company: user.company },
          { jobTitle: { contains: user.jobTitle || '' } },
        ],
      },
      select: {
        id: true,
        name: true,
        company: true,
        jobTitle: true,
        avatarUrl: true,
        lastLoginAt: true,
      },
      take: 5,
    });

    // Get recent activity
    const recentActivity = await prisma.checkIn.findMany({
      where: { userId },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            startAt: true,
          },
        },
      },
      orderBy: { checkedInAt: 'desc' },
      take: 5,
    });

    // Get exhibitors for current events
    const exhibitors = await prisma.exhibitorProfile.findMany({
      where: {
        ...(eventId && { eventId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            company: true,
            avatarUrl: true,
            website: true,
          },
        },
      },
      take: 20,
    });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get recommended sessions based on user interests and bookmarks
    const userBookmarkedSessionIds = bookmarkedSessions.map(b => b.session.id);
    const recommendedSessions = await prisma.session.findMany({
      where: {
        id: { notIn: userBookmarkedSessionIds },
        startAt: { gte: new Date() },
        ...(eventId && { eventId }),
      },
      include: {
        speakers: {
          include: {
            speaker: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        room: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      orderBy: [
        { bookmarks: { _count: 'desc' } }, // Popular sessions first
        { startAt: 'asc' },
      ],
      take: 5,
    });

    // Calculate compatibility scores for networking suggestions
    const networkingSuggestionsWithScores = networkingSuggestions.map(suggestion => ({
      ...suggestion,
      compatibilityScore: Math.floor(Math.random() * 30) + 70, // Mock compatibility score
      commonInterests: ['Technology', 'Innovation'], // Mock common interests
      isOnline: suggestion.lastLoginAt && 
        new Date(suggestion.lastLoginAt).getTime() > Date.now() - 30 * 60 * 1000, // Online if logged in within 30 minutes
    }));

    // Format recommended sessions with compatibility scores
    const recommendedSessionsWithScores = recommendedSessions.map(session => ({
      ...session,
      compatibilityScore: Math.floor(Math.random() * 30) + 70, // Mock compatibility score
    }));

    // Format recent activity
    const formattedRecentActivity = recentActivity.map(activity => ({
      id: activity.id,
      type: 'session_joined' as const,
      title: `Joined "${activity.session.title}"`,
      timestamp: activity.checkedInAt.toISOString(),
      details: `Session started at ${activity.session.startAt.toLocaleTimeString()}`,
    }));

    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
        avatarUrl: user.avatarUrl,
      },
      stats: {
        upcomingSessions: upcomingSessions.length,
        bookmarkedSessions: bookmarkedSessions.length,
        networkingConnections: engagementStats.connections,
        eventsAttending: 1, // Mock data
        checkInsToday: engagementStats.attendedSessions,
        totalSessions: upcomingSessions.length + engagementStats.attendedSessions,
        completedSessions: engagementStats.attendedSessions,
        engagementScore: engagementStats.engagementScore,
      },
      upcomingSessions: upcomingSessions.map(session => ({
        id: session.id,
        title: session.title,
        startAt: session.startAt.toISOString(),
        endAt: session.endAt.toISOString(),
        room: session.room ? {
          name: session.room.name,
          venue: session.room.venue ? { name: session.room.venue.name } : null,
        } : null,
        speakers: session.speakers.map(sp => ({
          speaker: {
            user: {
              name: sp.speaker.user.name,
              avatarUrl: sp.speaker.user.avatarUrl,
            },
          },
        })),
        track: session.track,
        isBookmarked: session.bookmarks.length > 0,
        attendeeCount: session._count.checkIns,
      })),
      bookmarkedSessions: bookmarkedSessions.map(bookmark => bookmark.session),
      recommendedSessions: recommendedSessionsWithScores,
      networkingSuggestions: networkingSuggestionsWithScores,
      recentActivity: formattedRecentActivity,
      exhibitors: exhibitors.map(exhibitor => ({
        id: exhibitor.id,
        name: exhibitor.user.name,
        booth: exhibitor.boothNumber || 'TBD',
        category: exhibitor.category || 'General',
        logoUrl: exhibitor.user.avatarUrl,
        description: exhibitor.description || '',
        isVisited: false, // Mock data
      })),
      notifications: notifications.map(notification => ({
        id: notification.id,
        type: notification.type.toLowerCase(),
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt.toISOString(),
        isRead: notification.isRead,
        actionUrl: notification.actionUrl,
      })),
    };

    return NextResponse.json({
      ok: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Failed to fetch attendee dashboard data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
