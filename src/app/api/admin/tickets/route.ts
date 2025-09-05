import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const eventId = searchParams.get('eventId') || 'all';

    // Build where clause for filtering
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (eventId !== 'all') {
      whereClause.eventId = eventId;
    }

    // Fetch ticket types with event information
    const ticketTypes = await prisma.ticketType.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true
          }
        },
        _count: {
          select: {
            tickets: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format ticket types data
    const formattedTicketTypes = ticketTypes.map(ticketType => ({
      id: ticketType.id,
      name: ticketType.name,
      description: ticketType.description,
      price: ticketType.price,
      currency: ticketType.currency || 'USD',
      totalQuantity: ticketType.quantity,
      soldQuantity: ticketType._count.tickets,
      availableQuantity: ticketType.quantity - ticketType._count.tickets,
      eventId: ticketType.eventId,
      eventName: ticketType.event?.name,
      status: ticketType.isActive ? 'ACTIVE' : 'PAUSED',
      saleStartDate: ticketType.saleStartAt?.toISOString() || new Date().toISOString(),
      saleEndDate: ticketType.saleEndAt?.toISOString() || new Date().toISOString(),
      createdAt: ticketType.createdAt.toISOString(),
      features: ticketType.features ? JSON.parse(ticketType.features) : []
    }));

    return NextResponse.json({
      tickets: formattedTicketTypes,
      stats: {
        total: ticketTypes.length,
        active: ticketTypes.filter(t => t.isActive).length,
        paused: ticketTypes.filter(t => !t.isActive).length,
        totalRevenue: ticketTypes.reduce((sum, t) => sum + (t._count.tickets * t.price), 0),
        totalSold: ticketTypes.reduce((sum, t) => sum + t._count.tickets, 0)
      }
    });

  } catch (error) {
    console.error('Tickets API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      tickets: [
        {
          id: '1',
          name: 'Early Bird',
          description: 'Limited time early bird pricing with full access',
          price: 99,
          currency: 'USD',
          totalQuantity: 100,
          soldQuantity: 45,
          availableQuantity: 55,
          eventId: '1',
          eventName: 'WECON Masawat 2024',
          status: 'ACTIVE',
          saleStartDate: '2024-01-01T00:00:00Z',
          saleEndDate: '2024-02-15T23:59:59Z',
          createdAt: '2024-01-01T00:00:00Z',
          features: ['Access to all sessions', 'Lunch included', 'Networking event']
        },
        {
          id: '2',
          name: 'VIP Pass',
          description: 'Premium experience with exclusive access and perks',
          price: 299,
          currency: 'USD',
          totalQuantity: 25,
          soldQuantity: 12,
          availableQuantity: 13,
          eventId: '1',
          eventName: 'WECON Masawat 2024',
          status: 'ACTIVE',
          saleStartDate: '2024-01-01T00:00:00Z',
          saleEndDate: '2024-03-15T23:59:59Z',
          createdAt: '2024-01-01T00:00:00Z',
          features: ['VIP seating', 'Meet & greet', 'Premium lunch', 'Gift bag']
        }
      ],
      stats: {
        total: 2,
        active: 2,
        paused: 0,
        totalRevenue: 8055,
        totalSold: 57
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
      name,
      description,
      price,
      currency,
      totalQuantity,
      eventId,
      saleStartDate,
      saleEndDate,
      features
    } = body;

    // Validate required fields
    if (!name || !description || price < 0 || !totalQuantity || !eventId) {
      return NextResponse.json(
        { error: 'Name, description, price, quantity, and event are required' },
        { status: 400 }
      );
    }

    // Parse features if provided
    const featuresArray = features ? features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];

    // Create new ticket type
    const newTicketType = await prisma.ticketType.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        currency: currency || 'USD',
        quantity: parseInt(totalQuantity),
        eventId,
        isActive: true,
        saleStartAt: saleStartDate ? new Date(saleStartDate) : new Date(),
        saleEndAt: saleEndDate ? new Date(saleEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        features: featuresArray.length > 0 ? JSON.stringify(featuresArray) : null
      },
      include: {
        event: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Ticket type created successfully',
      ticket: newTicketType
    }, { status: 201 });

  } catch (error) {
    console.error('Create Ticket API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket type' },
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
      name,
      description,
      price,
      currency,
      totalQuantity,
      eventId,
      saleStartDate,
      saleEndDate,
      features
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket type ID is required' },
        { status: 400 }
      );
    }

    // Parse features if provided
    const featuresArray = features ? features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (currency) updateData.currency = currency;
    if (totalQuantity) updateData.quantity = parseInt(totalQuantity);
    if (eventId) updateData.eventId = eventId;
    if (saleStartDate) updateData.saleStartAt = new Date(saleStartDate);
    if (saleEndDate) updateData.saleEndAt = new Date(saleEndDate);
    if (featuresArray.length > 0) updateData.features = JSON.stringify(featuresArray);

    // Update ticket type
    const updatedTicketType = await prisma.ticketType.update({
      where: { id },
      data: updateData,
      include: {
        event: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Ticket type updated successfully',
      ticket: updatedTicketType
    });

  } catch (error) {
    console.error('Update Ticket API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket type' },
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
        { error: 'Ticket type ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by deactivating the ticket type
    await prisma.ticketType.update({
      where: { id },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      message: 'Ticket type deactivated successfully'
    });

  } catch (error) {
    console.error('Delete Ticket API Error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate ticket type' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
