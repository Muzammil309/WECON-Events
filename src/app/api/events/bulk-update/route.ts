import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// PUT /api/events/bulk-update - Bulk update events
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventIds, updates } = body;

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Event IDs are required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Updates object is required' },
        { status: 400 }
      );
    }

    // Check user permissions - only allow certain roles to bulk update
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'STAFF_MANAGER'];
    if (!allowedRoles.includes(authResult.userRole)) {
      return NextResponse.json(
        { ok: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Validate updates object
    const allowedFields = ['status', 'isPublic', 'registrationOpen', 'category', 'tags'];
    const updateData: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No valid update fields provided' },
        { status: 400 }
      );
    }

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Perform bulk update
    const result = await prisma.event.updateMany({
      where: {
        id: { in: eventIds }
      },
      data: updateData
    });

    return NextResponse.json({
      ok: true,
      message: `Updated ${result.count} events`,
      count: result.count,
      updatedFields: Object.keys(updateData)
    });
  } catch (error) {
    console.error('Failed to bulk update events:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to bulk update events' },
      { status: 500 }
    );
  }
}
