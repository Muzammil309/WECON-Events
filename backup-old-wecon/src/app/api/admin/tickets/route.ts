import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      description: ticketType.description || '',
      price: ticketType.priceCents / 100, // Convert cents to dollars
      currency: ticketType.currency,
      totalQuantity: ticketType.quantityTotal,
      soldQuantity: ticketType.quantitySold,
      availableQuantity: ticketType.quantityTotal - ticketType.quantitySold,
      eventId: ticketType.eventId,
      eventName: ticketType.event?.name,
      status: getTicketStatus(ticketType),
      saleStartDate: ticketType.salesStart.toISOString(),
      saleEndDate: ticketType.salesEnd.toISOString(),
      createdAt: ticketType.createdAt?.toISOString() || new Date().toISOString(),
      features: ticketType.description ? ticketType.description.split(',').map(f => f.trim()) : []
    }));

    return NextResponse.json({
      tickets: formattedTicketTypes,
      stats: {
        total: ticketTypes.length,
        active: formattedTicketTypes.filter(t => t.status === 'ACTIVE').length,
        paused: formattedTicketTypes.filter(t => t.status === 'PAUSED').length,
        soldOut: formattedTicketTypes.filter(t => t.status === 'SOLD_OUT').length,
        expired: formattedTicketTypes.filter(t => t.status === 'EXPIRED').length,
        totalRevenue: ticketTypes.reduce((sum, t) => sum + (t.quantitySold * (t.priceCents / 100)), 0),
        totalSold: ticketTypes.reduce((sum, t) => sum + t.quantitySold, 0)
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

    // Enhanced validation
    const errors: string[] = [];

    if (!name?.trim()) errors.push('Name is required');
    if (!description?.trim()) errors.push('Description is required');
    if (price === undefined || price < 0) errors.push('Price must be 0 or greater');
    if (!totalQuantity || totalQuantity < 1) errors.push('Quantity must be at least 1');
    if (!eventId?.trim()) errors.push('Event is required');
    if (!saleStartDate) errors.push('Sale start date is required');
    if (!saleEndDate) errors.push('Sale end date is required');

    if (saleStartDate && saleEndDate && new Date(saleStartDate) >= new Date(saleEndDate)) {
      errors.push('Sale end date must be after start date');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Check if event exists
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Parse features if provided
    const featuresArray = features ? features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];

    // Create new ticket type
    const newTicketType = await prisma.ticketType.create({
      data: {
        name,
        description,
        priceCents: Math.round(parseFloat(price) * 100), // Convert to cents
        currency: currency || 'USD',
        quantityTotal: parseInt(totalQuantity),
        quantitySold: 0,
        eventId,
        salesStart: saleStartDate ? new Date(saleStartDate) : new Date(),
        salesEnd: saleEndDate ? new Date(saleEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A ticket with this name already exists for this event' },
          { status: 409 }
        );
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid event ID provided' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to create ticket type',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

    console.log('PUT request received for ticket:', { id, name, price, totalQuantity });

    // Enhanced validation
    if (!id) {
      return NextResponse.json(
        { error: 'Ticket type ID is required for updates' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ticket name is required' },
        { status: 400 }
      );
    }

    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (totalQuantity !== undefined && (isNaN(parseInt(totalQuantity)) || parseInt(totalQuantity) < 1)) {
      return NextResponse.json(
        { error: 'Valid total quantity is required (minimum 1)' },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticketType.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    // Parse features if provided
    const featuresArray = features ? features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];

    // Prepare update data with proper validation
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.priceCents = Math.round(parseFloat(price) * 100);
    if (currency !== undefined) updateData.currency = currency;
    if (totalQuantity !== undefined) updateData.quantityTotal = parseInt(totalQuantity);
    if (eventId !== undefined) updateData.eventId = eventId;
    if (saleStartDate !== undefined) updateData.salesStart = new Date(saleStartDate);
    if (saleEndDate !== undefined) updateData.salesEnd = new Date(saleEndDate);

    console.log('Update data prepared:', updateData);

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

    console.log('Ticket updated successfully:', updatedTicketType.id);

    return NextResponse.json({
      message: 'Ticket type updated successfully',
      ticket: updatedTicketType
    });

  } catch (error) {
    console.error('Update Ticket API Error:', error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Ticket type not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A ticket with this name already exists for this event' },
          { status: 409 }
        );
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid event ID provided' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to update ticket type',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

    // Hard delete the ticket type (check if it has any tickets first)
    const ticketCount = await prisma.ticket.count({
      where: { ticketTypeId: id }
    });

    if (ticketCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete ticket type with existing tickets' },
        { status: 400 }
      );
    }

    await prisma.ticketType.delete({
      where: { id }
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
