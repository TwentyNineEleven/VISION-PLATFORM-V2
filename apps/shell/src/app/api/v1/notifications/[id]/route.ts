/**
 * Single Notification API Routes
 *
 * GET /api/v1/notifications/[id] - Get notification details
 * PATCH /api/v1/notifications/[id] - Mark as read
 * DELETE /api/v1/notifications/[id] - Soft delete notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'get' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'get' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { read } = body;

    // Update notification
    const updateData: Record<string, unknown> = {};
    if (read !== undefined) {
      updateData.read = read;
      updateData.read_at = read ? new Date().toISOString() : null;
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'update' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'update' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete notification
    const { error } = await supabase
      .from('notifications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (error) {
      Sentry.captureException(error, {
        tags: { api: 'notifications', operation: 'delete' }
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'notifications', operation: 'delete' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
