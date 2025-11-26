/**
 * Tasks API Routes
 *
 * GET /api/v1/tasks - List tasks
 * POST /api/v1/tasks - Create a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  appId: z.string().optional(),
  context: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional(),
  organizationId: z.string().uuid(),
});

/**
 * GET /api/v1/tasks
 * List tasks for the current user's organization
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
    const status = searchParams.get('status');
    const statusLabel = searchParams.get('statusLabel') as 'overdue' | 'due-today' | 'upcoming' | null;
    const assignedTo = searchParams.get('assignedTo');
    const limit = searchParams.get('limit');

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

    const tasks = await taskService.getTasks(organizationId, {
      status: status || undefined,
      statusLabel: statusLabel || undefined,
      assignedTo: assignedTo || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', validatedData.organizationId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    const task = await taskService.createTask(validatedData.organizationId, user.id, {
      title: validatedData.title,
      description: validatedData.description,
      appId: validatedData.appId,
      context: validatedData.context,
      assignedTo: validatedData.assignedTo,
      priority: validatedData.priority,
      dueDate: validatedData.dueDate,
    });

    return NextResponse.json({
      success: true,
      data: task,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(error);
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create task' },
      { status: 500 }
    );
  }
}
