/**
 * Resend Email Service
 *
 * Handles email delivery for notifications using Resend.
 * Includes email templates and preference checking.
 */

import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';

// Lazy-initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Default sender
const FROM_EMAIL = 'VISION Platform <notifications@visionplatform.app>';
const FROM_EMAIL_NOREPLY = 'VISION Platform <noreply@visionplatform.app>';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface NotificationEmailData {
  recipientName: string;
  recipientEmail: string;
  notificationType: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  organizationName?: string;
  actorName?: string;
}

export interface InviteEmailData {
  recipientEmail: string;
  recipientName?: string;
  organizationName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
  expiresAt?: string;
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      tags: options.tags,
    });

    if (error) {
      Sentry.captureException(error, {
        tags: { service: 'email', operation: 'sendEmail' },
        extra: { to: options.to, subject: options.subject }
      });
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    Sentry.captureException(error, {
      tags: { service: 'email', operation: 'sendEmail' },
      extra: { to: options.to, subject: options.subject }
    });
    return { success: false, error: errorMessage };
  }
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(data: NotificationEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  const html = generateNotificationEmailHtml(data);
  const text = generateNotificationEmailText(data);

  return sendEmail({
    to: data.recipientEmail,
    subject: data.title,
    html,
    text,
    tags: [
      { name: 'type', value: 'notification' },
      { name: 'notification_type', value: data.notificationType }
    ]
  });
}

/**
 * Send organization invite email
 */
export async function sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  const html = generateInviteEmailHtml(data);
  const text = generateInviteEmailText(data);

  return sendEmail({
    to: data.recipientEmail,
    subject: `You've been invited to join ${data.organizationName} on VISION Platform`,
    html,
    text,
    tags: [
      { name: 'type', value: 'invite' },
      { name: 'organization', value: data.organizationName }
    ]
  });
}

/**
 * Generate notification email HTML
 */
function generateNotificationEmailHtml(data: NotificationEmailData): string {
  const actionButton = data.actionUrl && data.actionLabel
    ? `<a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0047AB; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 16px;">${data.actionLabel}</a>`
    : '';

  const orgInfo = data.organizationName
    ? `<p style="color: #64748B; font-size: 14px; margin-bottom: 16px;">Organization: ${data.organizationName}</p>`
    : '';

  const actorInfo = data.actorName
    ? `<p style="color: #64748B; font-size: 14px; margin-bottom: 8px;">From: ${data.actorName}</p>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; background-color: #0047AB; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">VISION Platform</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 16px 0; color: #1E293B; font-size: 20px; font-weight: 600;">${data.title}</h2>
              ${actorInfo}
              ${orgInfo}
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">${data.message}</p>
              ${actionButton}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0;">
                You're receiving this email because you have notifications enabled for ${data.notificationType.replace(/_/g, ' ')} events.
              </p>
              <p style="color: #94A3B8; font-size: 12px; margin: 8px 0 0 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications" style="color: #0047AB;">Manage notification preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate notification email plain text
 */
function generateNotificationEmailText(data: NotificationEmailData): string {
  let text = `${data.title}\n\n`;

  if (data.actorName) {
    text += `From: ${data.actorName}\n`;
  }

  if (data.organizationName) {
    text += `Organization: ${data.organizationName}\n`;
  }

  text += `\n${data.message}\n`;

  if (data.actionUrl && data.actionLabel) {
    text += `\n${data.actionLabel}: ${data.actionUrl}\n`;
  }

  text += `\n---\nManage notification preferences: ${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications`;

  return text;
}

/**
 * Generate invite email HTML
 */
function generateInviteEmailHtml(data: InviteEmailData): string {
  const greeting = data.recipientName
    ? `Hi ${data.recipientName},`
    : 'Hi there,';

  const expiryInfo = data.expiresAt
    ? `<p style="color: #94A3B8; font-size: 14px; margin-top: 16px;">This invitation expires on ${new Date(data.expiresAt).toLocaleDateString()}.</p>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to ${data.organizationName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; background-color: #0047AB; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">VISION Platform</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">${greeting}</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                <strong>${data.inviterName}</strong> has invited you to join <strong>${data.organizationName}</strong> as a <strong>${data.role}</strong> on VISION Platform.
              </p>
              <a href="${data.inviteUrl}" style="display: inline-block; padding: 14px 28px; background-color: #0047AB; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Accept Invitation</a>
              ${expiryInfo}
              <p style="color: #64748B; font-size: 14px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0;">
                VISION Platform - Empowering nonprofits with modern tools
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate invite email plain text
 */
function generateInviteEmailText(data: InviteEmailData): string {
  const greeting = data.recipientName
    ? `Hi ${data.recipientName},`
    : 'Hi there,';

  let text = `${greeting}\n\n`;
  text += `${data.inviterName} has invited you to join ${data.organizationName} as a ${data.role} on VISION Platform.\n\n`;
  text += `Accept the invitation: ${data.inviteUrl}\n`;

  if (data.expiresAt) {
    text += `\nThis invitation expires on ${new Date(data.expiresAt).toLocaleDateString()}.\n`;
  }

  text += `\n---\nIf you didn't expect this invitation, you can safely ignore this email.`;

  return text;
}

const resendService = {
  sendEmail,
  sendNotificationEmail,
  sendInviteEmail,
};

export default resendService;
