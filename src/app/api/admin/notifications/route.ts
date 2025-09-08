import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNotificationEmail, emailService } from '@/lib/email-service';

const prisma = new PrismaClient();

// GET - Fetch notifications and communication history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'email', 'sms', 'push', 'announcement'
    const status = searchParams.get('status') || 'all'; // 'sent', 'pending', 'failed'
    const eventId = searchParams.get('eventId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const whereClause: any = {};

    if (type !== 'all') {
      whereClause.type = type.toUpperCase();
    }

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (eventId) {
      whereClause.eventId = eventId;
    }

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get statistics
    const stats = await Promise.all([
      prisma.notification.count({ where: { status: 'SENT' } }),
      prisma.notification.count({ where: { status: 'PENDING' } }),
      prisma.notification.count({ where: { status: 'FAILED' } }),
      prisma.notification.count({ where: { type: 'EMAIL' } }),
      prisma.notification.count({ where: { type: 'SMS' } }),
      prisma.notification.count({ where: { type: 'PUSH' } }),
      prisma.notification.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    const [sent, pending, failed, email, sms, push, today] = stats;

    return NextResponse.json({
      notifications,
      stats: {
        total: notifications.length,
        sent,
        pending,
        failed,
        byType: { email, sms, push },
        sentToday: today
      }
    });

  } catch (error) {
    console.error('Notifications API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notifications',
        notifications: [],
        stats: { total: 0, sent: 0, pending: 0, failed: 0, byType: { email: 0, sms: 0, push: 0 }, sentToday: 0 }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Send mass notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type, // 'EMAIL', 'SMS', 'PUSH', 'ANNOUNCEMENT'
      title,
      message,
      recipients, // 'all', 'staff', 'attendees', 'speakers', 'exhibitors', or array of user IDs
      eventId,
      priority = 'NORMAL', // 'LOW', 'NORMAL', 'HIGH', 'URGENT'
      scheduledFor, // Optional: schedule for later
      metadata = {}
    } = body;

    // Validation
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    // Determine recipient list
    let recipientUsers: any[] = [];

    if (Array.isArray(recipients)) {
      // Specific user IDs provided
      recipientUsers = await prisma.user.findMany({
        where: { id: { in: recipients } },
        select: { id: true, name: true, email: true, phone: true, role: true }
      });
    } else {
      // Predefined groups
      const whereClause: any = { isActive: true };

      switch (recipients) {
        case 'staff':
          whereClause.role = { in: ['STAFF', 'ADMIN', 'MANAGER'] };
          break;
        case 'attendees':
          whereClause.role = 'ATTENDEE';
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

      if (eventId && recipients !== 'all') {
        // Filter by event participation if eventId is provided
        whereClause.OR = [
          { orders: { some: { eventId } } }, // Has tickets for event
          { speakerProfile: { eventId } }, // Is speaker for event
          { exhibitorProfile: { eventId } } // Is exhibitor for event
        ];
      }

      recipientUsers = await prisma.user.findMany({
        where: whereClause,
        select: { id: true, name: true, email: true, phone: true, role: true }
      });
    }

    if (recipientUsers.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      );
    }

    // Create notification records
    const notifications = await Promise.all(
      recipientUsers.map(user =>
        prisma.notification.create({
          data: {
            userId: user.id,
            type: type.toUpperCase(),
            title,
            message,
            priority: priority.toUpperCase(),
            status: scheduledFor ? 'SCHEDULED' : 'PENDING',
            scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            eventId,
            metadata: JSON.stringify(metadata)
          }
        })
      )
    );

    // If not scheduled, process immediately
    if (!scheduledFor) {
      await processNotifications(notifications, type);
    }

    return NextResponse.json({
      message: `${notifications.length} notifications ${scheduledFor ? 'scheduled' : 'sent'} successfully`,
      notificationIds: notifications.map(n => n.id),
      recipientCount: recipientUsers.length,
      type: type.toUpperCase(),
      scheduledFor
    }, { status: 201 });

  } catch (error) {
    console.error('Send Notification Error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update notification status or resend failed notifications
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationIds } = body;

    if (!action || !notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Action and notification IDs are required' },
        { status: 400 }
      );
    }

    let result: any = {};

    switch (action) {
      case 'resend':
        // Resend failed notifications
        const failedNotifications = await prisma.notification.findMany({
          where: {
            id: { in: notificationIds },
            status: 'FAILED'
          }
        });

        await Promise.all(
          failedNotifications.map(notification =>
            prisma.notification.update({
              where: { id: notification.id },
              data: { status: 'PENDING', sentAt: null }
            })
          )
        );

        // Process the resend
        await processNotifications(failedNotifications, failedNotifications[0]?.type || 'EMAIL');

        result = {
          message: `${failedNotifications.length} notifications resent`,
          resent: failedNotifications.length
        };
        break;

      case 'cancel':
        // Cancel scheduled notifications
        const cancelledCount = await prisma.notification.updateMany({
          where: {
            id: { in: notificationIds },
            status: 'SCHEDULED'
          },
          data: { status: 'CANCELLED' }
        });

        result = {
          message: `${cancelledCount.count} notifications cancelled`,
          cancelled: cancelledCount.count
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "resend" or "cancel"' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Update Notification Error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to process notifications
async function processNotifications(notifications: any[], type: string) {
  for (const notification of notifications) {
    try {
      let success = false;

      switch (type.toUpperCase()) {
        case 'EMAIL':
          success = await sendEmail(notification);
          break;
        case 'SMS':
          success = await sendSMS(notification);
          break;
        case 'PUSH':
          success = await sendPushNotification(notification);
          break;
        case 'ANNOUNCEMENT':
          success = true; // Announcements are just stored in DB
          break;
      }

      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: success ? 'SENT' : 'FAILED',
          sentAt: success ? new Date() : null,
          errorMessage: success ? null : 'Failed to send'
        }
      });

    } catch (error) {
      console.error(`Failed to process notification ${notification.id}:`, error);
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}

// Real email sending function
async function sendEmail(notification: any): Promise<boolean> {
  try {
    // Get user details for the notification
    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
      select: { email: true, name: true }
    });

    if (!user || !user.email) {
      console.error(`No email found for user ${notification.userId}`);
      return false;
    }

    // Get event details if eventId is provided
    let event = null;
    if (notification.eventId) {
      event = await prisma.event.findUnique({
        where: { id: notification.eventId },
        select: { name: true }
      });
    }

    // Send email using the email service
    const result = await sendNotificationEmail(
      { email: user.email, name: user.name },
      { title: notification.title, message: notification.message },
      event ? { name: event.name } : undefined
    );

    if (result.success) {
      console.log(`Email sent successfully to ${user.email} via ${result.provider}`);
      return true;
    } else {
      console.error(`Failed to send email to ${user.email}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Real SMS sending function
async function sendSMS(notification: any): Promise<boolean> {
  try {
    // Get user details for the notification
    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
      select: { phone: true, name: true }
    });

    if (!user || !user.phone) {
      console.error(`No phone number found for user ${notification.userId}`);
      return false;
    }

    // Check if SMS service is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('SMS service not configured (missing Twilio credentials)');
      return false;
    }

    // Prepare SMS message (keep it short for SMS)
    const message = `${notification.title}\n\n${notification.message.substring(0, 140)}${notification.message.length > 140 ? '...' : ''}`;

    // Send SMS using Twilio API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        To: user.phone,
        Body: message
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`SMS sent successfully to ${user.phone}:`, result.sid);
      return true;
    } else {
      const error = await response.text();
      console.error(`Failed to send SMS to ${user.phone}:`, error);
      return false;
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

// Mock push notification function (replace with actual push service)
async function sendPushNotification(notification: any): Promise<boolean> {
  // TODO: Integrate with push service (Firebase, OneSignal, etc.)
  console.log(`Sending push: ${notification.title} to ${notification.userId}`);
  return true; // Mock success
}
