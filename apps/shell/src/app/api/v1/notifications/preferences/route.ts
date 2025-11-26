/**
 * Notification Preferences API Routes
 *
 * GET /api/v1/notifications/preferences - Get user preferences
 * PATCH /api/v1/notifications/preferences - Update user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get preferences
    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'getPreferences' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no preferences exist, return defaults
    if (!preferences) {
      return NextResponse.json({
        preferences: {
          user_id: user.id,
          in_app_enabled: true,
          email_enabled: true,
          push_enabled: false,
          invitation_in_app: true,
          invitation_email: true,
          member_added_in_app: true,
          member_added_email: false,
          member_removed_in_app: true,
          member_removed_email: false,
          role_changed_in_app: true,
          role_changed_email: true,
          organization_updated_in_app: true,
          organization_updated_email: false,
          task_assigned_in_app: true,
          task_assigned_email: true,
          task_completed_in_app: true,
          task_completed_email: false,
          file_shared_in_app: true,
          file_shared_email: true,
          comment_added_in_app: true,
          comment_added_email: false,
          mention_in_app: true,
          mention_email: true,
          system_in_app: true,
          system_email: true,
          email_digest_frequency: 'realtime',
          quiet_hours_enabled: false,
          quiet_hours_start: null,
          quiet_hours_end: null,
          quiet_hours_timezone: 'UTC'
        }
      });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'getPreferences' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    delete body.id;
    delete body.user_id;
    delete body.created_at;
    delete body.updated_at;

    // Upsert preferences
    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...body
      })
      .select()
      .single();

    if (error) {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'updatePreferences' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'updatePreferences' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
