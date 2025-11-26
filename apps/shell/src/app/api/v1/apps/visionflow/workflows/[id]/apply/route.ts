/**
 * VisionFlow Apply Workflow API
 * Applies a workflow to a project
 *
 * @route POST /api/v1/apps/visionflow/workflows/[id]/apply - Apply workflow to project
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * POST /api/v1/apps/visionflow/workflows/[id]/apply
 * Apply workflow to a project (creates workflow instance and tasks)
 */
export async function POST(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id: workflowId } = await params;

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

    if (!body.project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      );
    }

    // Verify workflow exists
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select(
        `
        *,
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
      .eq('id', workflowId)
      .is('deleted_at', null)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', body.project_id)
      .is('deleted_at', null)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create workflow instance
    const { data: instance, error: instanceError } = await supabase
      .from('workflow_instances')
      .insert({
        workflow_id: workflowId,
        project_id: body.project_id,
        organization_id: organizationId,
        status: 'ACTIVE',
        started_by: user.id,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (instanceError) {
      console.error('Error creating workflow instance:', instanceError);
      return NextResponse.json(
        { error: 'Failed to create workflow instance' },
        { status: 500 }
      );
    }

    // Create tasks from workflow steps
    const sortedSteps = Array.isArray(workflow.steps) 
      ? [...workflow.steps].sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      : [];
    const tasks = sortedSteps.map((step: any, index: number) => {
      const dueDate = new Date();
      // Calculate due date based on cumulative duration
      const cumulativeDays = sortedSteps
        .slice(0, index + 1)
        .reduce((sum: number, s: any) => sum + (s.duration_days || 0), 0);
      dueDate.setDate(dueDate.getDate() + cumulativeDays);

      return {
        project_id: body.project_id,
        organization_id: organizationId,
        title: step.title,
        description: step.description,
        status: index === 0 ? 'NOT_STARTED' : 'NOT_STARTED',
        due_date: dueDate.toISOString(),
        created_by: user.id,
        metadata: {
          workflow_step_id: step.id,
          workflow_instance_id: instance.id,
          assignee_role: step.assignee_role,
        },
      };
    });

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(tasks);

    if (tasksError) {
      console.error('Error creating tasks:', tasksError);
      // Rollback instance creation
      await supabase.from('workflow_instances').delete().eq('id', instance.id);
      return NextResponse.json(
        { error: 'Failed to create tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        instance,
        message: `Workflow applied successfully. ${tasks.length} tasks created.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/workflows/[id]/apply:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

