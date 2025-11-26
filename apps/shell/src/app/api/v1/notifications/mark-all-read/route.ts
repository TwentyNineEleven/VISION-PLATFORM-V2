/**
 * Mark All Notifications Read API Route
 *
 * POST /api/v1/notifications/mark-all-read - Mark all notifications as read
 */

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark all as read using RPC function
    const { data: count, error } = await supabase.rpc('mark_all_notifications_read', {
      p_user_id: user.id
    });

    if (error) {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'markAllRead' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: count || 0 });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'markAllRead' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
