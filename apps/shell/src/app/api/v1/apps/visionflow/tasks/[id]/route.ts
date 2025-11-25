/**
 * VisionFlow Task Detail API
 * Handles individual task operations
 *
 * @route GET    /api/v1/apps/visionflow/tasks/[id] - Get task details
 * @route PUT    /api/v1/apps/visionflow/tasks/[id] - Update task
 * @route DELETE /api/v1/apps/visionflow/tasks/[id] - Delete task
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/tasks/[id]
 * Get task details with assignments, comments, and activity
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch task with related data
    const { data: task, error } = await supabase
      .from('tasks')
      .select(
        `
        *,
        project:projects(id, title, status),
        milestone:milestones(id, title, due_date),
        created_by_user:users!tasks_created_by_fkey(id, name, email, avatar_url),
        assignments:task_assignments(
          id,
          assigned_to,
          assigned_by,
          role,
          created_at,
          user:users(id, name, email, avatar_url)
        ),
        comments:task_comments(
          id,
          content,
          created_at,
          user:users(id, name, email, avatar_url)
        ),
        activity:task_activity(
          id,
          action,
          changes,
          created_at,
          user:users(id, name, email, avatar_url)
        ),
        attachments:task_attachments(
          id,
          file_name,
          file_size,
          file_type,
          storage_path,
          created_at,
          uploaded_by_user:users(id, name, email, avatar_url)
        ),
        subtasks:tasks!tasks_parent_task_id_fkey(
          id,
          title,
          status,
          priority,
          due_date
        )
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: 'Failed to fetch task' },
        { status: 500 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/apps/visionflow/tasks/[id]
 * Update task
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing task to track changes
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();

    // Build update object
    const updates: any = {};
    const changes: any = {};

    if (body.title !== undefined && body.title !== existingTask.title) {
      updates.title = body.title;
      changes.title = { from: existingTask.title, to: body.title };
    }

    if (body.description !== undefined && body.description !== existingTask.description) {
      updates.description = body.description;
      changes.description = { from: existingTask.description, to: body.description };
    }

    if (body.status !== undefined && body.status !== existingTask.status) {
      updates.status = body.status;
      changes.status = { from: existingTask.status, to: body.status };

      // Set completion_date when status changes to COMPLETE
      if (body.status === 'COMPLETE') {
        updates.completion_date = new Date().toISOString();
      }
    }

    if (body.priority !== undefined && body.priority !== existingTask.priority) {
      updates.priority = body.priority;
      changes.priority = { from: existingTask.priority, to: body.priority };
    }

    if (body.due_date !== undefined && body.due_date !== existingTask.due_date) {
      updates.due_date = body.due_date;
      changes.due_date = { from: existingTask.due_date, to: body.due_date };
    }

    if (body.estimated_hours !== undefined) {
      updates.estimated_hours = body.estimated_hours;
    }

    if (body.actual_hours !== undefined) {
      updates.actual_hours = body.actual_hours;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    // Update task
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('task_activity').insert({
      task_id: task.id,
      user_id: user.id,
      action: 'UPDATED',
      changes,
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Unexpected error in PUT /api/v1/apps/visionflow/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/visionflow/tasks/[id]
 * Soft delete task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete task
    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('task_activity').insert({
      task_id: id,
      user_id: user.id,
      action: 'DELETED',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/apps/visionflow/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
