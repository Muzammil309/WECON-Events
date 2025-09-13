import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group') || 'all';
    const eventId = searchParams.get('eventId');

    // Build where clause based on group
    let whereClause: any = { isActive: true };

    switch (group) {
      case 'attendees':
        whereClause.role = 'ATTENDEE';
        break;
      case 'staff':
        whereClause.role = { in: ['STAFF', 'ADMIN', 'MANAGER'] };
        break;
      case 'speakers':
        whereClause.speakerProfile = { isNot: null };
        break;
      case 'exhibitors':
        whereClause.exhibitorProfile = { isNot: null };
        break;
      case 'all':
      default:
        // No additional filter for 'all'
        break;
    }

    // Add event filter if specified
    if (eventId && group !== 'all') {
      whereClause.OR = [
        { orders: { some: { eventId } } }, // Has tickets for event
        { speakerProfile: { eventId } }, // Is speaker for event
        { exhibitorProfile: { eventId } } // Is exhibitor for event
      ];
    }

    // Count users
    const count = await prisma.user.count({
      where: whereClause
    });

    return NextResponse.json({
      count,
      group,
      eventId
    });

  } catch (error) {
    console.error('User Count API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to count users',
        count: 0
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
