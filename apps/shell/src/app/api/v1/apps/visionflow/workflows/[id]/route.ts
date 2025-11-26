/**
 * VisionFlow Workflow Detail API
 * Handles individual workflow operations
 *
 * @route GET    /api/v1/apps/visionflow/workflows/[id] - Get workflow details
 * @route PUT    /api/v1/apps/visionflow/workflows/[id] - Update workflow
 * @route DELETE /api/v1/apps/visionflow/workflows/[id] - Delete workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * GET /api/v1/apps/visionflow/workflows/[id]
 * Get workflow details with steps
 */
export async function GET(
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

    // Fetch workflow with steps
    const { data: workflow, error } = await supabase
      .from('workflows')
      .select(
        `
        *,
        created_by_user:users!workflows_created_by_fkey(id, name, email, avatar_url),
        steps:workflow_steps(
          id,
          title,
          description,
          sort_order,
          duration_days,
          assignee_role
        )
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }
      console.error('Error fetching workflow:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/workflows/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/apps/visionflow/workflows/[id]
 * Update workflow
 */
export async function PUT(
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

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      updates.name = body.name;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (body.estimated_days !== undefined) {
      updates.estimated_days = body.estimated_days;
    }

    // Update workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workflow:', error);
      return NextResponse.json(
        { error: 'Failed to update workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Unexpected error in PUT /api/v1/apps/visionflow/workflows/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/visionflow/workflows/[id]
 * Soft delete workflow
 */
export async function DELETE(
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

    // Soft delete workflow
    const { error } = await supabase
      .from('workflows')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting workflow:', error);
      return NextResponse.json(
        { error: 'Failed to delete workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/apps/visionflow/workflows/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

