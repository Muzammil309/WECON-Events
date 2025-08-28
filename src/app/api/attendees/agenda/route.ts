import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/agenda - Get personalized agenda
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const date = searchParams.get('date'); // YYYY-MM-DD format

    if (!eventId) {
      return NextResponse.json(
        { ok: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get user's bookmarked sessions
    const bookmarkedSessions = await prisma.sessionBookmark.findMany({
      where: {
        userId: authResult.userId,
        session: {
          eventId: eventId
        }
      },
      include: {
        session: {
          include: {
            room: {
              include: {
                venue: {
                  select: {
                    name: true,
                    address: true
                  }
                }
              }
            },
            speakers: {
              include: {
                speaker: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        avatarUrl: true,
                        company: true,
                        jobTitle: true
                      }
                    }
                  }
                }
              }
            },
            resources: true,
            feedback: {
              where: {
                giverId: authResult.userId
              },
              select: {
                rating: true,
                comment: true
              }
            },
            _count: {
              select: {
                feedback: true
              }
            }
          }
        }
      },
      orderBy: {
        session: {
          startAt: 'asc'
        }
      }
    });

    // Filter by date if provided
    let filteredSessions = bookmarkedSessions;
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filteredSessions = bookmarkedSessions.filter(bookmark => {
        const sessionDate = new Date(bookmark.session.startAt);
        return sessionDate >= targetDate && sessionDate < nextDay;
      });
    }

    // Calculate average rating for each session
    const sessionsWithRating = filteredSessions.map(bookmark => ({
      ...bookmark,
      session: {
        ...bookmark.session,
        averageRating: bookmark.session.feedback.length > 0 
          ? bookmark.session.feedback.reduce((sum, f) => sum + f.rating, 0) / bookmark.session.feedback.length 
          : null,
        userFeedback: bookmark.session.feedback[0] || null
      }
    }));

    // Get user's interests for recommendations
    const userProfile = await prisma.attendeeProfile.findUnique({
      where: { userId: authResult.userId },
      select: { interests: true }
    });

    // Get recommended sessions based on interests
    const recommendedSessions = await prisma.session.findMany({
      where: {
        eventId: eventId,
        OR: [
          {
            track: {
              in: userProfile?.interests || []
            }
          },
          {
            title: {
              contains: userProfile?.interests?.join('|') || '',
              mode: 'insensitive'
            }
          }
        ],
        NOT: {
          id: {
            in: bookmarkedSessions.map(b => b.session.id)
          }
        }
      },
      include: {
        room: {
          include: {
            venue: {
              select: {
                name: true
              }
            }
          }
        },
        speakers: {
          include: {
            speaker: {
              include: {
                user: {
                  select: {
                    name: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            feedback: true
          }
        }
      },
      take: 5,
      orderBy: {
        startAt: 'asc'
      }
    });

    return NextResponse.json({
      ok: true,
      agenda: {
        bookmarkedSessions: sessionsWithRating,
        recommendedSessions,
        totalBookmarked: bookmarkedSessions.length,
        userInterests: userProfile?.interests || []
      }
    });
  } catch (error) {
    console.error('Failed to fetch agenda:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch agenda' },
      { status: 500 }
    );
  }
}

// POST /api/attendees/agenda - Bookmark/unbookmark session
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, action } = body; // action: 'bookmark' or 'unbookmark'

    if (!sessionId || !action) {
      return NextResponse.json(
        { ok: false, error: 'Session ID and action are required' },
        { status: 400 }
      );
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, title: true, startAt: true }
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    if (action === 'bookmark') {
      // Check for existing bookmark
      const existingBookmark = await prisma.sessionBookmark.findUnique({
        where: {
          userId_sessionId: {
            userId: authResult.userId,
            sessionId: sessionId
          }
        }
      });

      if (existingBookmark) {
        return NextResponse.json(
          { ok: false, error: 'Session already bookmarked' },
          { status: 409 }
        );
      }

      // Create bookmark
      await prisma.sessionBookmark.create({
        data: {
          userId: authResult.userId,
          sessionId: sessionId
        }
      });

      return NextResponse.json({
        ok: true,
        message: 'Session bookmarked successfully'
      });
    } else if (action === 'unbookmark') {
      // Remove bookmark
      await prisma.sessionBookmark.delete({
        where: {
          userId_sessionId: {
            userId: authResult.userId,
            sessionId: sessionId
          }
        }
      });

      return NextResponse.json({
        ok: true,
        message: 'Session unbookmarked successfully'
      });
    } else {
      return NextResponse.json(
        { ok: false, error: 'Invalid action. Use "bookmark" or "unbookmark"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}
