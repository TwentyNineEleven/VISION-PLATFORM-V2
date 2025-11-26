import { createServerSupabaseClient } from '@/lib/supabase/server';

interface SendInviteEmailParams {
  email: string;
  token: string;
  organizationName: string;
  invitedByName: string;
  role: string;
}

/**
 * Send organization invite email using Supabase Auth
 */
export async function sendInviteEmail(params: SendInviteEmailParams): Promise<void> {
  'use server';

  const { email, token, organizationName, invitedByName, role } = params;

  try {
    const supabase = await createServerSupabaseClient();

    // Construct the invite acceptance URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

    // Use Supabase Auth to send email
    // Note: You'll need to configure email templates in Supabase Dashboard
    // Go to Authentication > Email Templates and customize the "Invite User" template
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        // Custom metadata that can be used in email template
        organization_name: organizationName,
        invited_by: invitedByName,
        role: role,
        invite_url: inviteUrl,
      },
      redirectTo: inviteUrl,
    });

    if (error) {
      console.error('Error sending invite email:', error);
      throw new Error(`Failed to send invite email: ${error.message}`);
    }

    console.log(`Invite email sent to ${email} for organization ${organizationName}`);
  } catch (error) {
    console.error('Error in sendInviteEmail:', error);
    throw error;
  }
}

/**
 * Send a simple notification email (for resends or other notifications)
 * Uses Supabase Auth's magic link functionality
 */
export async function sendNotificationEmail(
  email: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  'use server';

  try {
    // For now, we'll use the invite function for all emails
    // In production, you might want to use a dedicated email service
    // or Supabase Edge Functions for more complex email scenarios

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        custom_email: true,
        subject: subject,
        html_content: htmlContent,
      },
    });

    if (error) {
      console.error('Error sending notification email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in sendNotificationEmail:', error);
    throw error;
  }
}

/**
 * Email template helpers for consistent formatting
 */
export const emailTemplates = {
  /**
   * Generate HTML for organization invite email
   */
  organizationInvite(params: {
    organizationName: string;
    invitedByName: string;
    role: string;
    inviteUrl: string;
  }): string {
    const { organizationName, invitedByName, role, inviteUrl } = params;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Join ${organizationName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">You've Been Invited!</h1>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${invitedByName}</strong> has invited you to join <strong>${organizationName}</strong> as a <strong>${role}</strong>.
            </p>

            <p style="margin-bottom: 30px;">
              Click the button below to accept this invitation and get started:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        display: inline-block;">
                Accept Invitation
              </a>
            </div>

            <p style="font-size: 14px; color: inherit; margin-top: 30px;">
              Or copy and paste this link into your browser:<br>
              <a href="${inviteUrl}" style="color: #667eea; word-break: break-all;">
                ${inviteUrl}
              </a>
            </p>

            <p style="font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;
  },

  /**
   * Generate HTML for invite resend notification
   */
  inviteResend(params: {
    organizationName: string;
    inviteUrl: string;
  }): string {
    const { organizationName, inviteUrl } = params;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reminder: Join ${organizationName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Reminder: You're Invited!</h1>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              This is a reminder that you've been invited to join <strong>${organizationName}</strong>.
            </p>

            <p style="margin-bottom: 30px;">
              Click the button below to accept this invitation:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        display: inline-block;">
                Accept Invitation
              </a>
            </div>

            <p style="font-size: 14px; color: inherit; margin-top: 30px;">
              Or copy and paste this link into your browser:<br>
              <a href="${inviteUrl}" style="color: #667eea; word-break: break-all;">
                ${inviteUrl}
              </a>
            </p>
          </div>
        </body>
      </html>
    `;
  },
};
