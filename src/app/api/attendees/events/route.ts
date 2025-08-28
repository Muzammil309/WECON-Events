import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/events - Get events for attendee (demo data for now)
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return sample events
    // In production, this would filter by user's actual registrations
    const events = await prisma.event.findMany({
      where: {
        status: {
          in: ['PUBLISHED', 'LIVE']
        }
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true
      },
      orderBy: {
        startDate: 'asc'
      },
      take: 5
    });

    // If no events exist, create demo data
    if (events.length === 0) {
      const demoEvents = [
        {
          id: 'demo-event-1',
          name: 'WECON Masawat 2024',
          startDate: new Date('2024-03-15T09:00:00Z'),
          endDate: new Date('2024-03-17T18:00:00Z'),
          status: 'LIVE'
        }
      ];
      
      return NextResponse.json({ 
        ok: true, 
        events: demoEvents 
      });
    }

    return NextResponse.json({ 
      ok: true, 
      events 
    });
  } catch (error) {
    console.error('Failed to fetch attendee events:', error);
    
    // Return demo data as fallback
    const demoEvents = [
      {
        id: 'demo-event-1',
        name: 'WECON Masawat 2024',
        startDate: new Date('2024-03-15T09:00:00Z'),
        endDate: new Date('2024-03-17T18:00:00Z'),
        status: 'LIVE'
      }
    ];
    
    return NextResponse.json({ 
      ok: true, 
      events: demoEvents 
    });
  }
}
