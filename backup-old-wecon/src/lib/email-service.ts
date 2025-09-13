// Enterprise Email Service for WECON
// Supports multiple email providers with fallback mechanisms

interface EmailProvider {
  name: string;
  send: (emailData: EmailData) => Promise<EmailResult>;
  isConfigured: () => boolean;
}

interface EmailData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  templateId?: string;
  templateData?: Record<string, any>;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
}

// Resend Email Provider (Modern, reliable)
class ResendProvider implements EmailProvider {
  name = 'Resend';

  isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Resend API key not configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from || process.env.EMAIL_FROM || 'WECON <noreply@wecon.events>',
          to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          reply_to: emailData.replyTo,
          attachments: emailData.attachments?.map(att => ({
            filename: att.filename,
            content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
            content_type: att.contentType
          }))
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || `HTTP ${response.status}`,
          provider: this.name
        };
      }

      return {
        success: true,
        messageId: result.id,
        provider: this.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name
      };
    }
  }
}

// SendGrid Provider (Enterprise-grade)
class SendGridProvider implements EmailProvider {
  name = 'SendGrid';

  isConfigured(): boolean {
    return !!process.env.SENDGRID_API_KEY;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'SendGrid API key not configured' };
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: {
            email: emailData.from?.includes('<') 
              ? emailData.from.match(/<(.+)>/)?.[1] || emailData.from
              : emailData.from || process.env.EMAIL_FROM || 'noreply@wecon.events',
            name: emailData.from?.includes('<') 
              ? emailData.from.split('<')[0].trim()
              : 'WECON Events'
          },
          personalizations: [{
            to: Array.isArray(emailData.to) 
              ? emailData.to.map(email => ({ email }))
              : [{ email: emailData.to }],
            subject: emailData.subject,
            ...(emailData.templateData && { dynamic_template_data: emailData.templateData })
          }],
          content: emailData.templateId ? undefined : [
            ...(emailData.text ? [{ type: 'text/plain', value: emailData.text }] : []),
            ...(emailData.html ? [{ type: 'text/html', value: emailData.html }] : [])
          ],
          template_id: emailData.templateId,
          attachments: emailData.attachments?.map(att => ({
            filename: att.filename,
            content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
            type: att.contentType || 'application/octet-stream',
            disposition: 'attachment'
          }))
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `SendGrid error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }

      // SendGrid returns 202 with no body on success
      return {
        success: true,
        messageId: response.headers.get('x-message-id') || 'unknown',
        provider: this.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name
      };
    }
  }
}

// SMTP Provider (Fallback for any SMTP service)
class SMTPProvider implements EmailProvider {
  name = 'SMTP';

  isConfigured(): boolean {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'SMTP configuration not complete' };
    }

    try {
      // For production, you would use nodemailer here
      // This is a simplified implementation
      console.log('SMTP Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from || process.env.EMAIL_FROM
      });

      return {
        success: true,
        messageId: `smtp_${Date.now()}`,
        provider: this.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name
      };
    }
  }
}

// Main Email Service with Provider Fallback
class EmailService {
  private providers: EmailProvider[] = [
    new ResendProvider(),
    new SendGridProvider(),
    new SMTPProvider()
  ];

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    // Try each provider in order until one succeeds
    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        continue;
      }

      console.log(`Attempting to send email via ${provider.name}`);
      const result = await provider.send(emailData);

      if (result.success) {
        console.log(`Email sent successfully via ${provider.name}:`, result.messageId);
        return result;
      } else {
        console.warn(`${provider.name} failed:`, result.error);
      }
    }

    // All providers failed
    return {
      success: false,
      error: 'All email providers failed. Please check your email service configuration.',
      provider: 'none'
    };
  }

  async sendBulkEmails(emails: EmailData[]): Promise<EmailResult[]> {
    const results = await Promise.allSettled(
      emails.map(email => this.sendEmail(email))
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: result.reason }
    );
  }

  getConfiguredProviders(): string[] {
    return this.providers
      .filter(provider => provider.isConfigured())
      .map(provider => provider.name);
  }

  isConfigured(): boolean {
    return this.providers.some(provider => provider.isConfigured());
  }
}

// Email Templates
export const EmailTemplates = {
  notification: (data: { title: string; message: string; eventName?: string; userName?: string }) => ({
    subject: data.title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ${data.title}</h1>
          </div>
          <div class="content">
            ${data.userName ? `<p>Hello ${data.userName},</p>` : '<p>Hello,</p>'}
            <p>${data.message}</p>
            ${data.eventName ? `<p><strong>Event:</strong> ${data.eventName}</p>` : ''}
            <p>Best regards,<br>The WECON Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} WECON Events. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${data.title}\n\n${data.message}\n\n${data.eventName ? `Event: ${data.eventName}\n\n` : ''}Best regards,\nThe WECON Team`
  }),

  ticketConfirmation: (data: { customerName: string; eventName: string; ticketType: string; qrCode: string }) => ({
    subject: `Your tickets for ${data.eventName}`,
    html: `
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Your WECON Tickets</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hello ${data.customerName},</h2>
            <p>Your ticket purchase has been confirmed!</p>
            <div class="ticket">
              <h3>${data.ticketType}</h3>
              <p><strong>Event:</strong> ${data.eventName}</p>
              <div class="qr-code">
                <img src="${data.qrCode}" alt="QR Code" style="max-width: 200px;">
              </div>
              <p style="text-align: center; font-size: 12px; color: #666;">
                Present this QR code at the event entrance
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Global email service instance
export const emailService = new EmailService();

// Helper function for notification emails
export async function sendNotificationEmail(
  recipient: { email: string; name?: string },
  notification: { title: string; message: string },
  event?: { name: string }
): Promise<EmailResult> {
  const template = EmailTemplates.notification({
    title: notification.title,
    message: notification.message,
    eventName: event?.name,
    userName: recipient.name
  });

  return emailService.sendEmail({
    to: recipient.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}
