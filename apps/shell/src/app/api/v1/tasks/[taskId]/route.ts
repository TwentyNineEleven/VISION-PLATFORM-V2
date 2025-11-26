/**
 * Task Detail API Routes
 *
 * GET /api/v1/tasks/[taskId] - Get task details
 * PATCH /api/v1/tasks/[taskId] - Update task
 * DELETE /api/v1/tasks/[taskId] - Delete task
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  appId: z.string().optional(),
  context: z.string().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().nullable().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
});

interface RouteParams {
  params: Promise<{ taskId: string }>;
}

/**
 * GET /api/v1/tasks/[taskId]
 * Get task details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { taskId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await taskService.getTask(taskId);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/tasks/[taskId]
 * Update a task
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { taskId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Convert null values to undefined for service compatibility
    const updateInput = {
      ...validatedData,
      assignedTo: validatedData.assignedTo === null ? undefined : validatedData.assignedTo,
      dueDate: validatedData.dueDate === null ? undefined : validatedData.dueDate,
    };

    const task = await taskService.updateTask(taskId, updateInput);

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(error);
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update task' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/tasks/[taskId]
 * Delete a task (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { taskId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await taskService.deleteTask(taskId);

    return NextResponse.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete task' },
      { status: 500 }
    );
  }
}
