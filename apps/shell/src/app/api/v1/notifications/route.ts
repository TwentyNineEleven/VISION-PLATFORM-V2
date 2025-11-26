/**
 * Notifications API Routes
 *
 * GET /api/v1/notifications - List user notifications
 * POST /api/v1/notifications - Create notification (service role only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendNotificationEmail } from '@/lib/resend';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const organizationId = searchParams.get('organizationId');

    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'list' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications: data });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'list' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      user_id,
      organization_id,
      type,
      priority = 'medium',
      title,
      message,
      action_url,
      action_label,
      related_entity_type,
      related_entity_id,
      send_email = true
    } = body;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, title, message' },
        { status: 400 }
      );
    }

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        organization_id,
        type,
        priority,
        title,
        message,
        action_url,
        action_label,
        related_entity_type,
        related_entity_id,
        actor_id: user.id
      })
      .select()
      .single();

    if (error) {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'create' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification if enabled
    if (send_email) {
      // Get recipient user and preferences
      const { data: recipient } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', user_id)
        .single();

      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user_id)
        .single();

      // Check if email is enabled for this notification type
      const emailEnabledKey = `${type}_email` as keyof typeof preferences;
      const shouldSendEmail = preferences?.email_enabled !== false &&
        (preferences?.[emailEnabledKey] !== false);

      if (shouldSendEmail && recipient?.email) {
        // Get organization name if applicable
        let organizationName: string | undefined;
        if (organization_id) {
          const { data: org } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', organization_id)
            .single();
          organizationName = org?.name;
        }

        // Get actor name
        const { data: actor } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        // Send email
        const emailResult = await sendNotificationEmail({
          recipientName: recipient.name || 'User',
          recipientEmail: recipient.email,
          notificationType: type,
          title,
          message,
          actionUrl: action_url,
          actionLabel: action_label,
          organizationName,
          actorName: actor?.name
        });

        // Update notification with email status
        await supabase
          .from('notifications')
          .update({
            email_sent: emailResult.success,
            email_sent_at: emailResult.success ? new Date().toISOString() : null,
            email_error: emailResult.error || null
          })
          .eq('id', notification.id);
      }
    }

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'create' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
