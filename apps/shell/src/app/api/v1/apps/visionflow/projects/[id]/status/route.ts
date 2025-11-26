/**
 * VisionFlow Project Status API
 * Handles project status updates (for Kanban drag-and-drop)
 *
 * @route PATCH /api/v1/apps/visionflow/projects/[id]/status - Update project status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

const VALID_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED', 'BLOCKED', 'ON_HOLD'];

/**
 * PATCH /api/v1/apps/visionflow/projects/[id]/status
 * Update project status (optimized for drag-and-drop)
 */
export async function PATCH(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // Update project status
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project status:', error);
      return NextResponse.json(
        { error: 'Failed to update project status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/v1/apps/visionflow/projects/[id]/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

