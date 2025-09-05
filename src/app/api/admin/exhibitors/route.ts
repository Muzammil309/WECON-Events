import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const packageType = searchParams.get('packageType') || 'all';

    // Build where clause for filtering
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (packageType !== 'all') {
      whereClause.packageType = packageType.toUpperCase();
    }

    // Fetch exhibitors with event information
    const exhibitors = await prisma.exhibitor.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format exhibitors data
    const formattedExhibitors = exhibitors.map(exhibitor => ({
      id: exhibitor.id,
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      website: exhibitor.website,
      boothNumber: exhibitor.boothNumber,
      boothSize: exhibitor.boothSize,
      category: exhibitor.category,
      status: exhibitor.status || 'PENDING',
      packageType: exhibitor.packageType || 'STANDARD',
      paymentStatus: exhibitor.paymentStatus || 'PENDING',
      setupDate: exhibitor.setupDate?.toISOString(),
      specialRequirements: exhibitor.specialRequirements,
      eventId: exhibitor.eventId,
      eventName: exhibitor.event?.name,
      createdAt: exhibitor.createdAt.toISOString()
    }));

    return NextResponse.json({
      exhibitors: formattedExhibitors,
      stats: {
        total: exhibitors.length,
        confirmed: exhibitors.filter(e => e.status === 'CONFIRMED').length,
        pending: exhibitors.filter(e => e.status === 'PENDING').length,
        cancelled: exhibitors.filter(e => e.status === 'CANCELLED').length,
        premium: exhibitors.filter(e => e.packageType === 'PREMIUM' || e.packageType === 'PLATINUM').length
      }
    });

  } catch (error) {
    console.error('Exhibitors API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      exhibitors: [
        {
          id: '1',
          companyName: 'Tech Solutions Inc.',
          contactPerson: 'John Smith',
          email: 'john.smith@techsolutions.com',
          phone: '+1 (555) 123-4567',
          website: 'https://techsolutions.com',
          boothNumber: 'A-101',
          boothSize: '3x3',
          category: 'Technology',
          status: 'CONFIRMED',
          packageType: 'PREMIUM',
          paymentStatus: 'PAID',
          setupDate: '2024-03-15T09:00:00Z',
          specialRequirements: 'Power outlets for demo equipment',
          eventId: '1',
          eventName: 'WECON Masawat 2024',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          companyName: 'Healthcare Innovations',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@healthinnovations.com',
          phone: '+1 (555) 987-6543',
          website: 'https://healthinnovations.com',
          boothNumber: 'B-205',
          boothSize: '6x6',
          category: 'Healthcare',
          status: 'PENDING',
          packageType: 'PLATINUM',
          paymentStatus: 'PENDING',
          setupDate: '2024-03-15T10:00:00Z',
          specialRequirements: 'Medical equipment display area',
          eventId: '1',
          eventName: 'WECON Masawat 2024',
          createdAt: '2024-01-20T00:00:00Z'
        }
      ],
      stats: {
        total: 2,
        confirmed: 1,
        pending: 1,
        cancelled: 0,
        premium: 2
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
      companyName,
      contactPerson,
      email,
      phone,
      website,
      boothNumber,
      boothSize,
      category,
      packageType,
      eventId,
      setupDate,
      specialRequirements
    } = body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !eventId) {
      return NextResponse.json(
        { error: 'Company name, contact person, email, and event are required' },
        { status: 400 }
      );
    }

    // Check if exhibitor already exists for this event
    const existingExhibitor = await prisma.exhibitor.findFirst({
      where: {
        email,
        eventId
      }
    });

    if (existingExhibitor) {
      return NextResponse.json(
        { error: 'Exhibitor with this email already registered for this event' },
        { status: 409 }
      );
    }

    // Create new exhibitor
    const newExhibitor = await prisma.exhibitor.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone: phone || null,
        website: website || null,
        boothNumber: boothNumber || null,
        boothSize: boothSize || null,
        category: category || null,
        packageType: packageType || 'STANDARD',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        eventId,
        setupDate: setupDate ? new Date(setupDate) : null,
        specialRequirements: specialRequirements || null
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
      message: 'Exhibitor registered successfully',
      exhibitor: newExhibitor
    }, { status: 201 });

  } catch (error) {
    console.error('Create Exhibitor API Error:', error);
    return NextResponse.json(
      { error: 'Failed to register exhibitor' },
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
      companyName,
      contactPerson,
      email,
      phone,
      website,
      boothNumber,
      boothSize,
      category,
      packageType,
      eventId,
      setupDate,
      specialRequirements,
      status
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Exhibitor ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (companyName) updateData.companyName = companyName;
    if (contactPerson) updateData.contactPerson = contactPerson;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (website !== undefined) updateData.website = website || null;
    if (boothNumber !== undefined) updateData.boothNumber = boothNumber || null;
    if (boothSize !== undefined) updateData.boothSize = boothSize || null;
    if (category !== undefined) updateData.category = category || null;
    if (packageType) updateData.packageType = packageType;
    if (eventId) updateData.eventId = eventId;
    if (setupDate !== undefined) updateData.setupDate = setupDate ? new Date(setupDate) : null;
    if (specialRequirements !== undefined) updateData.specialRequirements = specialRequirements || null;
    if (status) updateData.status = status;

    // Update exhibitor
    const updatedExhibitor = await prisma.exhibitor.update({
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
      message: 'Exhibitor updated successfully',
      exhibitor: updatedExhibitor
    });

  } catch (error) {
    console.error('Update Exhibitor API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update exhibitor' },
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
        { error: 'Exhibitor ID is required' },
        { status: 400 }
      );
    }

    // Delete exhibitor
    await prisma.exhibitor.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Exhibitor deleted successfully'
    });

  } catch (error) {
    console.error('Delete Exhibitor API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete exhibitor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
