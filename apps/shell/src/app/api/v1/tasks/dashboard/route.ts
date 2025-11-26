/**
 * Dashboard Tasks API Route
 *
 * GET /api/v1/tasks/dashboard - Get tasks grouped by status for dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import * as Sentry from '@sentry/nextjs';

/**
 * GET /api/v1/tasks/dashboard
 * Get tasks grouped by status (overdue, due-today, upcoming)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    const dashboardTasks = await taskService.getDashboardTasks(organizationId, user.id);

    return NextResponse.json({
      success: true,
      data: dashboardTasks,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching dashboard tasks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch dashboard tasks' },
      { status: 500 }
    );
  }
}
