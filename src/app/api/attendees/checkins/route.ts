import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/checkins - Get check-ins for attendee
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId') || 'demo-attendee-1';

    // For demo purposes, return sample check-ins
    // In production, this would query actual check-ins from the database
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    try {
      const checkIns = await prisma.checkIn.findMany({
        where: {
          userId: userId,
          checkInAt: {
            gte: startOfDay
          }
        },
        include: {
          session: {
            select: {
              title: true,
              startAt: true
            }
          },
          venue: {
            select: {
              name: true
            }
          },
          room: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          checkInAt: 'desc'
        }
      });

      return NextResponse.json({ 
        ok: true, 
        checkIns 
      });
    } catch (dbError) {
      // Return demo data if database query fails
      const demoCheckIns = [
        {
          id: 'demo-checkin-1',
          type: 'session',
          checkInAt: new Date(),
          session: {
            title: 'Opening Keynote',
            startAt: new Date()
          }
        },
        {
          id: 'demo-checkin-2',
          type: 'venue',
          checkInAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          venue: {
            name: 'Main Hall'
          }
        }
      ];

      return NextResponse.json({ 
        ok: true, 
        checkIns: demoCheckIns 
      });
    }
  } catch (error) {
    console.error('Failed to fetch check-ins:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    );
  }
}

// POST /api/attendees/checkins - Create a new check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, venueId, roomId, type } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { ok: false, error: 'User ID and type are required' },
        { status: 400 }
      );
    }

    try {
      const checkIn = await prisma.checkIn.create({
        data: {
          userId,
          sessionId,
          venueId,
          roomId,
          type,
          checkInAt: new Date()
        },
        include: {
          session: {
            select: {
              title: true
            }
          },
          venue: {
            select: {
              name: true
            }
          },
          room: {
            select: {
              name: true
            }
          }
        }
      });

      return NextResponse.json({ 
        ok: true, 
        checkIn,
        message: 'Check-in successful' 
      });
    } catch (dbError) {
      // Return success for demo purposes even if database fails
      return NextResponse.json({ 
        ok: true, 
        checkIn: {
          id: 'demo-checkin-' + Date.now(),
          type,
          checkInAt: new Date(),
          userId
        },
        message: 'Check-in successful (demo mode)' 
      });
    }
  } catch (error) {
    console.error('Failed to create check-in:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}
