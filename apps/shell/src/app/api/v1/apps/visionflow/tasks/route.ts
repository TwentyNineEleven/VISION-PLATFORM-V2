/**
 * VisionFlow Tasks API
 * Handles task CRUD operations
 *
 * @route POST /api/v1/apps/visionflow/tasks - Create task
 * @route GET  /api/v1/apps/visionflow/tasks - List tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/tasks
 * List tasks for the current user's organization
 *
 * Query params:
 * - status: Filter by status (NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE, CANCELLED)
 * - priority: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
 * - project_id: Filter by project
 * - assigned_to_me: Boolean, filter tasks assigned to current user
 * - due_before: ISO date string, filter tasks due before date
 * - limit: Number of tasks to return (default: 50)
 * - offset: Offset for pagination (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!preferences?.active_organization_id) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    const organizationId = preferences.active_organization_id;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const projectId = searchParams.get('project_id');
    const assignedToMe = searchParams.get('assigned_to_me') === 'true';
    const dueBefore = searchParams.get('due_before');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('tasks')
      .select(
        `
        *,
        project:projects(id, title),
        milestone:milestones(id, title),
        assignments:task_assignments(
          id,
          assigned_to,
          user:users(id, name, email, avatar_url)
        )
      `
      )
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (dueBefore) {
      query = query.lte('due_date', dueBefore);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    // Filter for assigned tasks if requested
    let filteredTasks = tasks;
    if (assignedToMe) {
      filteredTasks = tasks.filter((task) =>
        task.assignments?.some((a: any) => a.assigned_to === user.id)
      );
    }

    return NextResponse.json({
      tasks: filteredTasks,
      pagination: {
        limit,
        offset,
        total: filteredTasks.length,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/visionflow/tasks
 * Create a new task
 *
 * Body:
 * {
 *   title: string (required)
 *   description?: string
 *   status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE' | 'CANCELLED'
 *   priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
 *   project_id?: string
 *   milestone_id?: string
 *   parent_task_id?: string
 *   due_date?: string (ISO)
 *   estimated_hours?: number
 *   metadata?: object
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!preferences?.active_organization_id) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    const organizationId = preferences.active_organization_id;

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: body.title,
        description: body.description,
        status: body.status || 'NOT_STARTED',
        priority: body.priority,
        project_id: body.project_id,
        milestone_id: body.milestone_id,
        parent_task_id: body.parent_task_id,
        due_date: body.due_date,
        estimated_hours: body.estimated_hours,
        organization_id: organizationId,
        created_by: user.id,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('task_activity').insert({
      task_id: task.id,
      user_id: user.id,
      action: 'CREATED',
      changes: {
        title: task.title,
        status: task.status,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
