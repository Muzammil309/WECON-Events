import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthTokenFromRequest } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/attendees/profile - Get attendee profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await prisma.attendeeProfile.findUnique({
      where: { userId: authResult.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
            avatarUrl: true,
            company: true,
            jobTitle: true,
            linkedinUrl: true,
            twitterUrl: true,
            website: true
          }
        }
      }
    });

    if (!profile) {
      // Create default profile if it doesn't exist
      const newProfile = await prisma.attendeeProfile.create({
        data: {
          userId: authResult.userId,
          interests: [],
          networkingOptIn: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bio: true,
              avatarUrl: true,
              company: true,
              jobTitle: true,
              linkedinUrl: true,
              twitterUrl: true,
              website: true
            }
          }
        }
      });
      return NextResponse.json({ ok: true, profile: newProfile });
    }

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    console.error('Failed to fetch attendee profile:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/attendees/profile - Update attendee profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuthTokenFromRequest(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      interests,
      dietaryReqs,
      accessibilityReqs,
      emergencyContact,
      tshirtSize,
      networkingOptIn,
      // User fields
      name,
      phone,
      bio,
      company,
      jobTitle,
      linkedinUrl,
      twitterUrl,
      website
    } = body;

    // Update user information
    const userUpdateData: any = {};
    if (name !== undefined) userUpdateData.name = name;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (company !== undefined) userUpdateData.company = company;
    if (jobTitle !== undefined) userUpdateData.jobTitle = jobTitle;
    if (linkedinUrl !== undefined) userUpdateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) userUpdateData.twitterUrl = twitterUrl;
    if (website !== undefined) userUpdateData.website = website;

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: authResult.userId },
        data: userUpdateData
      });
    }

    // Update attendee profile
    const profileUpdateData: any = {};
    if (interests !== undefined) profileUpdateData.interests = interests;
    if (dietaryReqs !== undefined) profileUpdateData.dietaryReqs = dietaryReqs;
    if (accessibilityReqs !== undefined) profileUpdateData.accessibilityReqs = accessibilityReqs;
    if (emergencyContact !== undefined) profileUpdateData.emergencyContact = emergencyContact;
    if (tshirtSize !== undefined) profileUpdateData.tshirtSize = tshirtSize;
    if (networkingOptIn !== undefined) profileUpdateData.networkingOptIn = networkingOptIn;

    const updatedProfile = await prisma.attendeeProfile.upsert({
      where: { userId: authResult.userId },
      update: profileUpdateData,
      create: {
        userId: authResult.userId,
        interests: interests || [],
        dietaryReqs,
        accessibilityReqs,
        emergencyContact,
        tshirtSize,
        networkingOptIn: networkingOptIn !== undefined ? networkingOptIn : true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
            avatarUrl: true,
            company: true,
            jobTitle: true,
            linkedinUrl: true,
            twitterUrl: true,
            website: true
          }
        }
      }
    });

    return NextResponse.json({ ok: true, profile: updatedProfile });
  } catch (error) {
    console.error('Failed to update attendee profile:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
