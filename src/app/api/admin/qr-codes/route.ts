import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

// GET - Generate QR codes for users, sessions, or events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'user', 'session', 'event'
    const id = searchParams.get('id');
    const format = searchParams.get('format') || 'svg'; // 'svg', 'png', 'data'
    const size = parseInt(searchParams.get('size') || '200');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    let qrData: any = {};
    let entity: any = null;

    switch (type) {
      case 'user':
        entity = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        });
        if (!entity) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        qrData = {
          type: 'user_checkin',
          userId: entity.id,
          userName: entity.name,
          userEmail: entity.email,
          timestamp: new Date().toISOString()
        };
        break;

      case 'session':
        entity = await prisma.session.findUnique({
          where: { id },
          include: {
            event: { select: { id: true, name: true } }
          }
        });
        if (!entity) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        qrData = {
          type: 'session_checkin',
          sessionId: entity.id,
          sessionTitle: entity.title,
          eventId: entity.event.id,
          eventName: entity.event.name,
          timestamp: new Date().toISOString()
        };
        break;

      case 'event':
        entity = await prisma.event.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            startAt: true,
            endAt: true,
            venue: true
          }
        });
        if (!entity) {
          return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        qrData = {
          type: 'event_checkin',
          eventId: entity.id,
          eventName: entity.name,
          venue: entity.venue,
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be user, session, or event' },
          { status: 400 }
        );
    }

    // Generate QR code
    const qrString = JSON.stringify(qrData);
    
    let qrCode: string;
    if (format === 'svg') {
      qrCode = await QRCode.toString(qrString, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } else if (format === 'png') {
      qrCode = await QRCode.toDataURL(qrString, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } else {
      // Return raw data
      return NextResponse.json({
        qrData,
        qrString,
        entity
      });
    }

    if (format === 'svg') {
      return new NextResponse(qrCode, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } else if (format === 'png') {
      // Extract base64 data from data URL
      const base64Data = qrCode.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    return NextResponse.json({ qrCode, qrData, entity });

  } catch (error) {
    console.error('QR Code Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Bulk generate QR codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ids, format = 'data' } = body;

    if (!type || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Type and IDs array are required' },
        { status: 400 }
      );
    }

    const qrCodes = [];

    for (const id of ids) {
      try {
        let entity: any = null;
        let qrData: any = {};

        switch (type) {
          case 'user':
            entity = await prisma.user.findUnique({
              where: { id },
              select: { id: true, name: true, email: true, company: true }
            });
            if (entity) {
              qrData = {
                type: 'user_checkin',
                userId: entity.id,
                userName: entity.name,
                userEmail: entity.email,
                timestamp: new Date().toISOString()
              };
            }
            break;

          case 'session':
            entity = await prisma.session.findUnique({
              where: { id },
              include: { event: { select: { id: true, name: true } } }
            });
            if (entity) {
              qrData = {
                type: 'session_checkin',
                sessionId: entity.id,
                sessionTitle: entity.title,
                eventId: entity.event.id,
                eventName: entity.event.name,
                timestamp: new Date().toISOString()
              };
            }
            break;
        }

        if (entity) {
          const qrString = JSON.stringify(qrData);
          let qrCode = '';

          if (format === 'svg' || format === 'png') {
            qrCode = await QRCode.toDataURL(qrString, {
              width: 200,
              margin: 2
            });
          }

          qrCodes.push({
            id,
            entity,
            qrData,
            qrString,
            qrCode: format === 'data' ? null : qrCode
          });
        }
      } catch (error) {
        console.error(`Error generating QR for ${id}:`, error);
      }
    }

    return NextResponse.json({
      qrCodes,
      total: qrCodes.length,
      requested: ids.length
    });

  } catch (error) {
    console.error('Bulk QR Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR codes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Validate and process QR code scan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrData, scannedBy, location } = body;

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR data is required' },
        { status: 400 }
      );
    }

    let parsedData: any;
    try {
      parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid QR code data' },
        { status: 400 }
      );
    }

    // Validate QR code age (optional - prevent old QR codes)
    const qrTimestamp = new Date(parsedData.timestamp);
    const now = new Date();
    const ageInHours = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60);
    
    if (ageInHours > 24) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 400 }
      );
    }

    // Process based on QR type
    let result: any = {};

    switch (parsedData.type) {
      case 'user_checkin':
        // For user QR codes, we need a session to check into
        return NextResponse.json({
          type: 'user_identified',
          user: {
            id: parsedData.userId,
            name: parsedData.userName,
            email: parsedData.userEmail
          },
          message: 'User identified. Please select a session for check-in.'
        });

      case 'session_checkin':
        // For session QR codes, we need a user to check in
        return NextResponse.json({
          type: 'session_identified',
          session: {
            id: parsedData.sessionId,
            title: parsedData.sessionTitle,
            eventId: parsedData.eventId,
            eventName: parsedData.eventName
          },
          message: 'Session identified. Please scan user QR code or enter user details.'
        });

      case 'event_checkin':
        return NextResponse.json({
          type: 'event_identified',
          event: {
            id: parsedData.eventId,
            name: parsedData.eventName,
            venue: parsedData.venue
          },
          message: 'Event identified. Please scan user QR code or select session.'
        });

      default:
        return NextResponse.json(
          { error: 'Unknown QR code type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('QR Validation Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate QR code' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
