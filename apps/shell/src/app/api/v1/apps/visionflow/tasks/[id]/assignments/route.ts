/**
 * Task Assignments API Route
 * Handles assigning and unassigning users to tasks
 * Phase 1: Task Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * POST /api/v1/apps/visionflow/tasks/[id]/assignments
 * Assign a user to a task
 */
export async function POST(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id: taskId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { user_id, role = 'COLLABORATOR' } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['OWNER', 'COLLABORATOR', 'REVIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be OWNER, COLLABORATOR, or REVIEWER' },
        { status: 400 }
      );
    }

    // Get active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    const organizationId = preferences?.active_organization_id;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    // Verify task exists and user has access
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, organization_id, title')
      .eq('id', taskId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Verify the user being assigned exists and is in the organization
    const { data: targetUser, error: userError } = await supabase
      .from('organization_members')
      .select('user_id, role, users(id, name, email, avatar_url)')
      .eq('organization_id', organizationId)
      .eq('user_id', user_id)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: 'User not found in organization' },
        { status: 404 }
      );
    }

    // Check if assignment already exists
    const { data: existingAssignment } = await supabase
      .from('task_assignments')
      .select('*')
      .eq('task_id', taskId)
      .eq('assigned_to', user_id)
      .maybeSingle();

    if (existingAssignment) {
      // Update existing assignment role if different
      if (existingAssignment.role !== role) {
        const { data: updated, error: updateError } = await supabase
          .from('task_assignments')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('id', existingAssignment.id)
          .select('*, user:users(id, name, email, avatar_url)')
          .single();

        if (updateError) {
          console.error('Error updating assignment:', updateError);
          return NextResponse.json(
            { error: 'Failed to update assignment' },
            { status: 500 }
          );
        }

        // Log activity
        await supabase.from('task_activity').insert({
          task_id: taskId,
          user_id: user.id,
          action: 'ASSIGNMENT_UPDATED',
          changes: {
            user: targetUser.users,
            role: { from: existingAssignment.role, to: role },
          },
        });

        return NextResponse.json({
          assignment: updated,
          message: 'Assignment role updated',
        });
      }

      // Assignment already exists with same role
      return NextResponse.json(
        {
          assignment: existingAssignment,
          message: 'User already assigned with this role',
        },
        { status: 200 }
      );
    }

    // Create new assignment
    const { data: assignment, error: assignError } = await supabase
      .from('task_assignments')
      .insert({
        task_id: taskId,
        assigned_to: user_id,
        role,
        assigned_by: user.id,
      })
      .select('*, user:users(id, name, email, avatar_url)')
      .single();

    if (assignError) {
      console.error('Error creating assignment:', assignError);
      return NextResponse.json(
        { error: 'Failed to create assignment' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('task_activity').insert({
      task_id: taskId,
      user_id: user.id,
      action: 'ASSIGNED',
      changes: {
        user: targetUser.users,
        role,
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error('Error in task assignments POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/visionflow/tasks/[id]/assignments?user_id=xxx
 * Unassign a user from a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id: taskId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user_id from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id query parameter is required' },
        { status: 400 }
      );
    }

    // Get active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    const organizationId = preferences?.active_organization_id;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    // Verify task exists and user has access
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, organization_id')
      .eq('id', taskId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get assignment to verify it exists
    const { data: assignment, error: assignError } = await supabase
      .from('task_assignments')
      .select('*, user:users(id, name, email)')
      .eq('task_id', taskId)
      .eq('assigned_to', userId)
      .maybeSingle();

    if (assignError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Delete assignment
    const { error: deleteError } = await supabase
      .from('task_assignments')
      .delete()
      .eq('id', assignment.id);

    if (deleteError) {
      console.error('Error deleting assignment:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete assignment' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('task_activity').insert({
      task_id: taskId,
      user_id: user.id,
      action: 'UNASSIGNED',
      changes: {
        user: assignment.user,
        role: assignment.role,
      },
    });

    return NextResponse.json({
      message: 'Assignment removed successfully',
    });
  } catch (error) {
    console.error('Error in task assignments DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
