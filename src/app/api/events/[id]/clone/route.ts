import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// POST /api/events/[id]/clone - Clone an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify authentication
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user permissions
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'STAFF_MANAGER', 'ORGANIZER'];
    if (!allowedRoles.includes(authResult.userRole)) {
      return NextResponse.json(
        { ok: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get the original event with all related data
    const originalEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: true,
        venues: {
          include: {
            rooms: true,
            stalls: true
          }
        },
        sessions: {
          include: {
            speakers: true,
            resources: true
          }
        },
        tasks: true,
        sponsors: true
      }
    });

    if (!originalEvent) {
      return NextResponse.json(
        { ok: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate unique slug for cloned event
    const baseSlug = `${originalEvent.slug}-copy`;
    let newSlug = baseSlug;
    let counter = 1;
    
    while (await prisma.event.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the cloned event
    const clonedEvent = await prisma.event.create({
      data: {
        name: `${originalEvent.name} (Copy)`,
        slug: newSlug,
        description: originalEvent.description,
        venue: originalEvent.venue,
        startAt: new Date(originalEvent.startAt.getTime() + 365 * 24 * 60 * 60 * 1000), // Add 1 year
        endAt: new Date(originalEvent.endAt.getTime() + 365 * 24 * 60 * 60 * 1000), // Add 1 year
        timezone: originalEvent.timezone,
        status: 'DRAFT', // Always start as draft
        maxAttendees: originalEvent.maxAttendees,
        category: originalEvent.category,
        tags: originalEvent.tags,
        website: originalEvent.website,
        contactEmail: originalEvent.contactEmail,
        logoUrl: originalEvent.logoUrl,
        bannerUrl: originalEvent.bannerUrl,
        isPublic: false, // Start as private
        registrationOpen: false, // Start with registration closed
        registrationDeadline: originalEvent.registrationDeadline 
          ? new Date(originalEvent.registrationDeadline.getTime() + 365 * 24 * 60 * 60 * 1000)
          : null,
        managerId: authResult.userId, // Assign to current user
        
        // Clone ticket types
        tickets: {
          create: originalEvent.tickets.map(ticket => ({
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            maxQuantity: ticket.maxQuantity,
            isActive: false, // Start inactive
            earlyBirdPrice: ticket.earlyBirdPrice,
            earlyBirdDeadline: ticket.earlyBirdDeadline 
              ? new Date(ticket.earlyBirdDeadline.getTime() + 365 * 24 * 60 * 60 * 1000)
              : null
          }))
        },

        // Clone venues and rooms
        venues: {
          create: originalEvent.venues.map(venue => ({
            name: venue.name,
            address: venue.address,
            description: venue.description,
            capacity: venue.capacity,
            facilities: venue.facilities,
            mapUrl: venue.mapUrl,
            coordinates: venue.coordinates,
            isAccessible: venue.isAccessible,
            rooms: {
              create: venue.rooms.map(room => ({
                name: room.name,
                capacity: room.capacity,
                location: room.location,
                equipment: room.equipment,
                isAccessible: room.isAccessible
              }))
            },
            stalls: {
              create: venue.stalls.map(stall => ({
                stallNumber: stall.stallNumber,
                size: stall.size,
                location: stall.location,
                powerOutlets: stall.powerOutlets,
                internetAccess: stall.internetAccess,
                isBooked: false // Reset booking status
              }))
            }
          }))
        },

        // Clone sponsors (without specific contracts)
        sponsors: {
          create: originalEvent.sponsors.map(sponsor => ({
            name: sponsor.name,
            tier: sponsor.tier,
            logoUrl: sponsor.logoUrl,
            website: sponsor.website,
            description: sponsor.description,
            contactName: sponsor.contactName,
            contactEmail: sponsor.contactEmail,
            contactPhone: sponsor.contactPhone,
            benefits: sponsor.benefits,
            status: 'pending' // Reset status
          }))
        }
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            tickets: true,
            sessions: true,
            venues: true,
            tasks: true,
            sponsors: true
          }
        }
      }
    });

    return NextResponse.json({
      ok: true,
      event: clonedEvent,
      message: 'Event cloned successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to clone event:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to clone event' },
      { status: 500 }
    );
  }
}
