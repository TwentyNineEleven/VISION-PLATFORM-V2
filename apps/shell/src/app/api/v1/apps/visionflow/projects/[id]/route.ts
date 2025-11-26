/**
 * VisionFlow Project Detail API
 * Handles individual project operations
 *
 * @route GET    /api/v1/apps/visionflow/projects/[id] - Get project details
 * @route PUT    /api/v1/apps/visionflow/projects/[id] - Update project
 * @route DELETE /api/v1/apps/visionflow/projects/[id] - Delete project
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * GET /api/v1/apps/visionflow/projects/[id]
 * Get project details with milestones
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

    // Fetch project with related data
    const { data: project, error } = await supabase
      .from('projects')
      .select(
        `
        *,
        plan:plans(id, title, status),
        milestones:milestones(
          id,
          title,
          description,
          due_date,
          status,
          sort_order
        )
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project:', error);
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/apps/visionflow/projects/[id]
 * Update project
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

    if (body.title !== undefined) {
      updates.title = body.title;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.priority !== undefined) {
      updates.priority = body.priority;
    }

    if (body.start_date !== undefined) {
      updates.start_date = body.start_date;
    }

    if (body.due_date !== undefined) {
      updates.due_date = body.due_date;
    }

    if (body.progress_percentage !== undefined) {
      updates.progress_percentage = body.progress_percentage;
    }

    if (body.metadata !== undefined) {
      updates.metadata = body.metadata;
    }

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Unexpected error in PUT /api/v1/apps/visionflow/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/visionflow/projects/[id]
 * Soft delete project
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

    // Soft delete project
    const { error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/apps/visionflow/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

