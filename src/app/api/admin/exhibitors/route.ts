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
    const whereClause: any = {
      role: 'EXHIBITOR'
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch exhibitors (users with EXHIBITOR role)
    const exhibitors = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format exhibitors data (simplified for current schema)
    const formattedExhibitors = exhibitors.map(exhibitor => ({
      id: exhibitor.id,
      companyName: exhibitor.name, // Using name as company name
      contactPerson: exhibitor.name,
      email: exhibitor.email,
      phone: exhibitor.phone || 'Not provided',
      website: '',
      boothNumber: 'TBD',
      boothSize: 'Standard',
      category: 'General',
      status: 'CONFIRMED',
      packageType: 'STANDARD',
      paymentStatus: 'PENDING',
      setupDate: null,
      specialRequirements: 'None',
      eventId: null,
      eventName: '',
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
    if (!companyName || !contactPerson || !email) {
      return NextResponse.json(
        { error: 'Company name, contact person, and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new exhibitor (as user with EXHIBITOR role)
    const newExhibitor = await prisma.user.create({
      data: {
        name: companyName,
        email,
        phone: phone || null,
        role: 'EXHIBITOR',
        password: 'temp123', // Temporary password - should be changed
        emailVerified: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
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
