import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tickets - Get all ticket types for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        eventId: eventId
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: {
        price: 'asc'
      }
    });

    // Calculate availability for each ticket type
    const ticketsWithAvailability = await Promise.all(
      tickets.map(async (ticket) => {
        const soldCount = await prisma.attendee.count({
          where: {
            ticketId: ticket.id
          }
        });

        return {
          ...ticket,
          available: ticket.quantity - soldCount,
          sold: soldCount,
          percentageSold: ticket.quantity > 0 ? (soldCount / ticket.quantity) * 100 : 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ticketsWithAvailability
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      name,
      description,
      price,
      currency,
      quantity,
      type,
      features,
      saleStartDate,
      saleEndDate,
      isActive
    } = body;

    // Validate required fields
    if (!eventId || !name || price === undefined || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, name, price, quantity' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        name,
        description,
        price: parseFloat(price),
        currency: currency || 'USD',
        quantity: parseInt(quantity),
        type: type || 'general',
        features: features || [],
        saleStartDate: saleStartDate ? new Date(saleStartDate) : new Date(),
        saleEndDate: saleEndDate ? new Date(saleEndDate) : event.startDate,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: ticket
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets - Update a ticket type
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateFields: any = {};
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.price !== undefined) updateFields.price = parseFloat(updateData.price);
    if (updateData.currency) updateFields.currency = updateData.currency;
    if (updateData.quantity !== undefined) updateFields.quantity = parseInt(updateData.quantity);
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.features) updateFields.features = updateData.features;
    if (updateData.saleStartDate) updateFields.saleStartDate = new Date(updateData.saleStartDate);
    if (updateData.saleEndDate) updateFields.saleEndDate = new Date(updateData.saleEndDate);
    if (updateData.isActive !== undefined) updateFields.isActive = updateData.isActive;

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateFields,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets - Delete a ticket type
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if there are any attendees with this ticket
    const attendeeCount = await prisma.attendee.count({
      where: { ticketId: id }
    });

    if (attendeeCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete ticket type with existing attendees' },
        { status: 400 }
      );
    }

    await prisma.ticket.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
