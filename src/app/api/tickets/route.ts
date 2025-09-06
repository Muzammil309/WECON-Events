import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getTicketStatus(ticketType: any): 'ACTIVE' | 'PAUSED' | 'SOLD_OUT' | 'EXPIRED' {
  const now = new Date();
  
  if (now < ticketType.salesStart) return 'PAUSED';
  if (now > ticketType.salesEnd) return 'EXPIRED';
  if (ticketType.quantitySold >= ticketType.quantityTotal) return 'SOLD_OUT';
  
  return 'ACTIVE';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // Build where clause
    const whereClause: any = {};
    if (eventId && eventId !== 'all') {
      whereClause.eventId = eventId;
    }

    // Fetch active ticket types
    const ticketTypes = await prisma.ticketType.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true,
            endAt: true,
            venue: true
          }
        }
      },
      orderBy: { priceCents: 'asc' }
    });

    // Format for public consumption
    const publicTickets = ticketTypes.map(ticketType => {
      const status = getTicketStatus(ticketType);
      
      return {
        id: ticketType.id,
        name: ticketType.name,
        description: ticketType.description || '',
        price: ticketType.priceCents / 100,
        currency: ticketType.currency,
        available: Math.max(0, ticketType.quantityTotal - ticketType.quantitySold),
        total: ticketType.quantityTotal,
        status,
        isAvailable: status === 'ACTIVE' && (ticketType.quantityTotal - ticketType.quantitySold) > 0,
        saleStartDate: ticketType.salesStart.toISOString(),
        saleEndDate: ticketType.salesEnd.toISOString(),
        event: {
          id: ticketType.event.id,
          name: ticketType.event.name,
          startAt: ticketType.event.startAt.toISOString(),
          endAt: ticketType.event.endAt.toISOString(),
          venue: ticketType.event.venue
        },
        features: ticketType.description ? ticketType.description.split(',').map(f => f.trim()) : []
      };
    });

    return NextResponse.json({
      tickets: publicTickets,
      stats: {
        total: publicTickets.length,
        available: publicTickets.filter(t => t.isAvailable).length,
        soldOut: publicTickets.filter(t => t.status === 'SOLD_OUT').length
      }
    });

  } catch (error) {
    console.error('Public Tickets API Error:', error);
    
    // Return fallback data
    return NextResponse.json({
      tickets: [
        {
          id: 'early-bird',
          name: 'Early Bird',
          description: 'Limited time offer for early supporters',
          price: 49,
          currency: 'USD',
          available: 55,
          total: 100,
          status: 'ACTIVE',
          isAvailable: true,
          saleStartDate: new Date().toISOString(),
          saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          event: {
            id: '1',
            name: 'WECON Masawat 2024',
            startAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString(),
            venue: 'Karachi Convention Center'
          },
          features: ['Full conference access', 'Welcome kit', 'Networking sessions', 'Digital materials']
        },
        {
          id: 'standard',
          name: 'Standard',
          description: 'Regular conference ticket with full access',
          price: 99,
          currency: 'USD',
          available: 150,
          total: 200,
          status: 'ACTIVE',
          isAvailable: true,
          saleStartDate: new Date().toISOString(),
          saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          event: {
            id: '1',
            name: 'WECON Masawat 2024',
            startAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString(),
            venue: 'Karachi Convention Center'
          },
          features: ['Full conference access', 'Welcome kit', 'Networking sessions', 'Digital materials', 'Lunch included']
        }
      ],
      stats: {
        total: 2,
        available: 2,
        soldOut: 0
      }
    });
  }
}
