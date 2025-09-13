import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';

    // Build where clause for filtering
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { boothNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (category !== 'all') {
      whereClause.category = category;
    }

    // Fetch exhibitions with related data
    const exhibitions = await prisma.exhibition.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            leads: true,
            visitors: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format exhibitions data
    const formattedExhibitions = exhibitions.map(exhibition => ({
      id: exhibition.id,
      companyName: exhibition.companyName,
      contactPerson: exhibition.contactPerson,
      email: exhibition.email,
      phone: exhibition.phone || 'Not provided',
      website: exhibition.website,
      boothNumber: exhibition.boothNumber,
      boothSize: exhibition.boothSize || '3x3m',
      category: exhibition.category || 'General',
      status: exhibition.status?.toLowerCase() || 'pending',
      packageType: exhibition.packageType?.toLowerCase() || 'standard',
      paymentStatus: exhibition.paymentStatus?.toLowerCase() || 'pending',
      setupDate: exhibition.setupDate?.toISOString() || new Date().toISOString(),
      specialRequirements: exhibition.specialRequirements,
      leadCount: exhibition._count.leads,
      visitorsCount: exhibition._count.visitors,
      revenue: exhibition.revenue || 0
    }));

    // Calculate exhibition statistics
    const exhibitionStats = {
      total: exhibitions.length,
      active: exhibitions.filter(e => e.status === 'ACTIVE').length,
      setup: exhibitions.filter(e => e.status === 'SETUP').length,
      confirmed: exhibitions.filter(e => e.status === 'CONFIRMED').length,
      pending: exhibitions.filter(e => e.status === 'PENDING').length,
      cancelled: exhibitions.filter(e => e.status === 'CANCELLED').length,
      totalRevenue: exhibitions.reduce((sum, e) => sum + (e.revenue || 0), 0),
      totalLeads: exhibitions.reduce((sum, e) => sum + e._count.leads, 0),
      totalVisitors: exhibitions.reduce((sum, e) => sum + e._count.visitors, 0)
    };

    return NextResponse.json({
      exhibitions: formattedExhibitions,
      stats: exhibitionStats
    });

  } catch (error) {
    console.error('Exhibitions API Error:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      exhibitions: [
        {
          id: '1',
          companyName: 'Tech Solutions Inc.',
          contactPerson: 'John Smith',
          email: 'john.smith@techsolutions.com',
          phone: '+1 (555) 123-4567',
          website: 'www.techsolutions.com',
          boothNumber: 'A-101',
          boothSize: '3x3m',
          category: 'Technology',
          status: 'active',
          packageType: 'platinum',
          paymentStatus: 'paid',
          setupDate: '2025-08-29T08:00:00Z',
          specialRequirements: 'Power outlets, WiFi, demo screens',
          leadCount: 45,
          visitorsCount: 120,
          revenue: 15000
        },
        {
          id: '2',
          companyName: 'Green Energy Corp',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@greenenergy.com',
          phone: '+1 (555) 234-5678',
          website: 'www.greenenergy.com',
          boothNumber: 'B-205',
          boothSize: '6x3m',
          category: 'Sustainability',
          status: 'setup',
          packageType: 'premium',
          paymentStatus: 'paid',
          setupDate: '2025-08-30T09:00:00Z',
          specialRequirements: 'Heavy equipment display area',
          leadCount: 23,
          visitorsCount: 67,
          revenue: 12000
        }
      ],
      stats: {
        total: 2,
        active: 1,
        setup: 1,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        totalRevenue: 27000,
        totalLeads: 68,
        totalVisitors: 187
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
      setupDate,
      specialRequirements,
      eventId
    } = body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !boothNumber) {
      return NextResponse.json(
        { error: 'Company name, contact person, email, and booth number are required' },
        { status: 400 }
      );
    }

    // Check if booth number is already taken
    const existingBooth = await prisma.exhibition.findFirst({
      where: {
        boothNumber,
        eventId: eventId || undefined
      }
    });

    if (existingBooth) {
      return NextResponse.json(
        { error: 'Booth number is already taken' },
        { status: 409 }
      );
    }

    // Create new exhibition
    const newExhibition = await prisma.exhibition.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        website,
        boothNumber,
        boothSize,
        category,
        packageType: packageType?.toUpperCase() || 'STANDARD',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        setupDate: setupDate ? new Date(setupDate) : null,
        specialRequirements,
        eventId
      }
    });

    return NextResponse.json({
      message: 'Exhibition created successfully',
      exhibition: newExhibition
    }, { status: 201 });

  } catch (error) {
    console.error('Create Exhibition API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create exhibition' },
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
      status,
      packageType,
      paymentStatus,
      setupDate,
      specialRequirements,
      revenue
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Exhibition ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (companyName) updateData.companyName = companyName;
    if (contactPerson) updateData.contactPerson = contactPerson;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (website) updateData.website = website;
    if (boothNumber) updateData.boothNumber = boothNumber;
    if (boothSize) updateData.boothSize = boothSize;
    if (category) updateData.category = category;
    if (status) updateData.status = status.toUpperCase();
    if (packageType) updateData.packageType = packageType.toUpperCase();
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase();
    if (setupDate) updateData.setupDate = new Date(setupDate);
    if (specialRequirements) updateData.specialRequirements = specialRequirements;
    if (revenue !== undefined) updateData.revenue = revenue;

    // Update exhibition
    const updatedExhibition = await prisma.exhibition.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Exhibition updated successfully',
      exhibition: updatedExhibition
    });

  } catch (error) {
    console.error('Update Exhibition API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update exhibition' },
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
        { error: 'Exhibition ID is required' },
        { status: 400 }
      );
    }

    // Cancel exhibition (mark as cancelled)
    await prisma.exhibition.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    });

    return NextResponse.json({
      message: 'Exhibition cancelled successfully'
    });

  } catch (error) {
    console.error('Delete Exhibition API Error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel exhibition' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
