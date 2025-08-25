import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// POST /api/tickets/purchase - Purchase tickets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      buyerName,
      buyerEmail,
      buyerPhone,
      tickets, // Array of { ticketId, quantity }
      paymentMethod,
      paymentDetails
    } = body;

    // Validate required fields
    if (!buyerName || !buyerEmail || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerName, buyerEmail, tickets' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const purchasedTickets = [];
      let totalAmount = 0;

      // Process each ticket type
      for (const ticketRequest of tickets) {
        const { ticketId, quantity } = ticketRequest;

        if (!ticketId || !quantity || quantity <= 0) {
          throw new Error('Invalid ticket request: ticketId and positive quantity required');
        }

        // Get ticket details
        const ticket = await tx.ticket.findUnique({
          where: { id: ticketId },
          include: { event: true }
        });

        if (!ticket) {
          throw new Error(`Ticket not found: ${ticketId}`);
        }

        if (!ticket.isActive) {
          throw new Error(`Ticket is not available for sale: ${ticket.name}`);
        }

        // Check sale dates
        const now = new Date();
        if (ticket.saleStartDate && now < ticket.saleStartDate) {
          throw new Error(`Ticket sale has not started yet: ${ticket.name}`);
        }
        if (ticket.saleEndDate && now > ticket.saleEndDate) {
          throw new Error(`Ticket sale has ended: ${ticket.name}`);
        }

        // Check availability
        const soldCount = await tx.attendee.count({
          where: { ticketId: ticket.id }
        });

        const available = ticket.quantity - soldCount;
        if (quantity > available) {
          throw new Error(`Not enough tickets available. Requested: ${quantity}, Available: ${available}`);
        }

        // Calculate amount
        const ticketTotal = ticket.price * quantity;
        totalAmount += ticketTotal;

        // Create attendee records
        for (let i = 0; i < quantity; i++) {
          const attendee = await tx.attendee.create({
            data: {
              eventId: ticket.eventId,
              ticketId: ticket.id,
              name: buyerName,
              email: buyerEmail,
              phone: buyerPhone,
              qrCode: randomUUID(),
              checkedIn: false,
              checkedInAt: null,
              registrationDate: new Date()
            }
          });

          purchasedTickets.push({
            attendeeId: attendee.id,
            ticketName: ticket.name,
            ticketPrice: ticket.price,
            qrCode: attendee.qrCode,
            eventName: ticket.event.name,
            eventDate: ticket.event.startDate
          });
        }
      }

      // Create order record
      const order = await tx.order.create({
        data: {
          buyerName,
          buyerEmail,
          buyerPhone,
          totalAmount,
          currency: 'USD', // Default currency
          status: 'completed', // In real app, this would be 'pending' until payment confirmation
          paymentMethod: paymentMethod || 'credit_card',
          paymentDetails: paymentDetails || {},
          orderDate: new Date()
        }
      });

      return {
        order,
        tickets: purchasedTickets,
        totalAmount
      };
    });

    // In a real application, you would:
    // 1. Process payment with payment provider
    // 2. Send confirmation email with QR codes
    // 3. Generate PDF tickets
    // 4. Update order status based on payment result

    return NextResponse.json({
      success: true,
      message: 'Tickets purchased successfully',
      data: {
        orderId: result.order.id,
        totalAmount: result.totalAmount,
        ticketCount: result.tickets.length,
        tickets: result.tickets
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error purchasing tickets:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to purchase tickets' },
      { status: 500 }
    );
  }
}

// GET /api/tickets/purchase - Get purchase history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderId = searchParams.get('orderId');

    if (!email && !orderId) {
      return NextResponse.json(
        { error: 'Email or Order ID is required' },
        { status: 400 }
      );
    }

    let orders;

    if (orderId) {
      // Get specific order
      orders = await prisma.order.findMany({
        where: { id: orderId },
        include: {
          attendees: {
            include: {
              ticket: {
                include: {
                  event: {
                    select: {
                      id: true,
                      name: true,
                      startDate: true,
                      endDate: true,
                      location: true
                    }
                  }
                }
              }
            }
          }
        }
      });
    } else {
      // Get orders by email
      orders = await prisma.order.findMany({
        where: { buyerEmail: email },
        include: {
          attendees: {
            include: {
              ticket: {
                include: {
                  event: {
                    select: {
                      id: true,
                      name: true,
                      startDate: true,
                      endDate: true,
                      location: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          orderDate: 'desc'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase history' },
      { status: 500 }
    );
  }
}
