import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { broadcastOrderComplete, broadcastUserUpdate } from '@/lib/realtime-updates';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ticketTypeId,
      quantity = 1,
      customerInfo: {
        name,
        email,
        phone,
        company,
        jobTitle
      },
      paymentInfo: {
        method = 'STRIPE', // STRIPE, PAYPAL, BANK_TRANSFER
        paymentIntentId, // For Stripe
        transactionId // For other payment methods
      }
    } = body;

    // Validation
    if (!ticketTypeId || !name || !email || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Ticket type, customer info, and payment details are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get ticket type details
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true,
            endAt: true,
            venue: true,
            description: true
          }
        }
      }
    });

    if (!ticketType) {
      return NextResponse.json(
        { error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    // Check availability
    const availableQuantity = ticketType.quantityTotal - ticketType.quantitySold;
    if (quantity > availableQuantity) {
      return NextResponse.json(
        { error: `Only ${availableQuantity} tickets available` },
        { status: 400 }
      );
    }

    // Check if sales period is active
    const now = new Date();
    if (ticketType.salesStart && now < ticketType.salesStart) {
      return NextResponse.json(
        { error: 'Ticket sales have not started yet' },
        { status: 400 }
      );
    }
    if (ticketType.salesEnd && now > ticketType.salesEnd) {
      return NextResponse.json(
        { error: 'Ticket sales have ended' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalCents = ticketType.priceCents * quantity;

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          company,
          jobTitle,
          role: 'ATTENDEE',
          isActive: true,
          emailVerified: false
        }
      });
    } else {
      // Update existing user info if provided
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(company && { company }),
          ...(jobTitle && { jobTitle })
        }
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        eventId: ticketType.eventId,
        ticketTypeId,
        quantity,
        totalCents,
        currency: ticketType.currency,
        status: 'COMPLETED', // Assuming payment is already processed
        paymentMethod: method,
        paymentIntentId,
        transactionId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        metadata: JSON.stringify({
          company,
          jobTitle,
          purchaseTimestamp: new Date().toISOString()
        })
      },
      include: {
        user: true,
        ticketType: {
          include: {
            event: true
          }
        }
      }
    });

    // Update ticket sold count
    await prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        quantitySold: {
          increment: quantity
        }
      }
    });

    // Generate QR codes for each ticket
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticketData = {
        orderId: order.id,
        userId: user.id,
        ticketTypeId,
        eventId: ticketType.eventId,
        ticketNumber: i + 1,
        customerName: name,
        customerEmail: email,
        eventName: ticketType.event.name,
        ticketTypeName: ticketType.name,
        issuedAt: new Date().toISOString()
      };

      // Generate QR code
      const qrCodeData = JSON.stringify(ticketData);
      const qrCodeSVG = await QRCode.toString(qrCodeData, {
        type: 'svg',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2
      });

      tickets.push({
        ticketNumber: i + 1,
        qrCode: qrCodeSVG,
        qrCodeDataURL,
        ticketData
      });
    }

    // Send confirmation email with QR codes
    try {
      await sendTicketConfirmationEmail({
        order,
        user,
        tickets,
        ticketType,
        event: ticketType.event
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the purchase if email fails
    }

    // Broadcast real-time updates
    try {
      // Broadcast order completion
      broadcastOrderComplete({
        orderId: order.id,
        userId: user.id,
        eventId: ticketType.eventId,
        ticketType: ticketType.name,
        quantity: order.quantity,
        totalAmount: totalCents / 100,
        customerName: name,
        customerEmail: email
      });

      // Broadcast user update (new user or updated user)
      broadcastUserUpdate(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasTickets: true
      });
    } catch (broadcastError) {
      console.error('Failed to broadcast updates:', broadcastError);
      // Don't fail the purchase if broadcast fails
    }

    return NextResponse.json({
      message: 'Ticket purchase successful',
      order: {
        id: order.id,
        quantity: order.quantity,
        totalAmount: totalCents / 100,
        currency: order.currency,
        status: order.status,
        customerEmail: order.customerEmail,
        event: ticketType.event.name,
        ticketType: ticketType.name
      },
      tickets: tickets.map(t => ({
        ticketNumber: t.ticketNumber,
        qrCodeDataURL: t.qrCodeDataURL
      })),
      emailSent: true
    }, { status: 201 });

  } catch (error) {
    console.error('Ticket Purchase Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process ticket purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Email sending function
async function sendTicketConfirmationEmail({
  order,
  user,
  tickets,
  ticketType,
  event
}: any) {
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  // For now, we'll log the email content and simulate sending
  
  const emailContent = {
    to: user.email,
    subject: `Your tickets for ${event.name}`,
    html: generateTicketEmailHTML({
      customerName: user.name,
      event,
      ticketType,
      order,
      tickets
    })
  };

  console.log('Sending ticket confirmation email:', emailContent);
  
  // TODO: Replace with actual email service
  // await emailService.send(emailContent);
  
  return true;
}

// Email template generator
function generateTicketEmailHTML({ customerName, event, ticketType, order, tickets }: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your WECON Tickets</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .ticket { border: 2px solid #e5e7eb; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 Your WECON Tickets</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${customerName},</h2>
          <p>Your ticket purchase has been confirmed! Here are your details:</p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${event.name}</p>
            <p><strong>Date:</strong> ${new Date(event.startAt).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.startAt).toLocaleTimeString()}</p>
            <p><strong>Venue:</strong> ${event.venue || 'TBA'}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Ticket Type:</strong> ${ticketType.name}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Total:</strong> ${(order.totalCents / 100).toFixed(2)} ${order.currency}</p>
          </div>
          
          ${tickets.map((ticket: any, index: number) => `
            <div class="ticket">
              <h3>Ticket ${ticket.ticketNumber}</h3>
              <div class="qr-code">
                <img src="${ticket.qrCodeDataURL}" alt="QR Code" style="max-width: 200px;">
              </div>
              <p style="text-align: center; font-size: 12px; color: #666;">
                Present this QR code at the event entrance
              </p>
            </div>
          `).join('')}
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Important Information</h3>
            <ul>
              <li>Please arrive 30 minutes before the event starts</li>
              <li>Present your QR code at the entrance for quick check-in</li>
              <li>Keep this email for your records</li>
              <li>Contact support if you have any questions</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing WECON!</p>
          <p>For support, contact us at support@wecon.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
