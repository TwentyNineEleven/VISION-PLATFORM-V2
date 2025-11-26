/**
 * VisionFlow Calendar Events API
 * Aggregates tasks, projects, and milestones into calendar events
 *
 * @route GET /api/v1/apps/visionflow/calendar/events - Get calendar events
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/calendar/events
 * Get all calendar events (tasks, projects, milestones) for date range
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
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const includeTasks = searchParams.get('include_tasks') !== 'false';
    const includeProjects = searchParams.get('include_projects') !== 'false';
    const includeMilestones = searchParams.get('include_milestones') !== 'false';

    const events: any[] = [];

    // Fetch tasks
    if (includeTasks) {
      let tasksQuery = supabase
        .from('tasks')
        .select('id, title, due_date, status, priority, project_id')
        .eq('organization_id', organizationId)
        .is('deleted_at', null)
        .not('due_date', 'is', null);

      if (startDate) {
        tasksQuery = tasksQuery.gte('due_date', startDate);
      }
      if (endDate) {
        tasksQuery = tasksQuery.lte('due_date', endDate);
      }

      const { data: tasks } = await tasksQuery;

      if (tasks) {
        tasks.forEach((task) => {
          if (!task.due_date) return;
          events.push({
            id: `task-${task.id}`,
            title: task.title,
            start: new Date(task.due_date),
            end: new Date(task.due_date),
            type: 'TASK',
            status: task.status,
            priority: task.priority,
            color: '#0047AB', // Blue for tasks
            allDay: true,
            resource: {
              id: task.id,
              type: 'task',
              projectId: task.project_id,
            },
          });
        });
      }
    }

    // Fetch projects
    if (includeProjects) {
      let projectsQuery = supabase
        .from('projects')
        .select('id, title, due_date, start_date, status')
        .eq('organization_id', organizationId)
        .is('deleted_at', null);

      // Combine date range filters properly
      // For a date range, we want projects that overlap with [startDate, endDate]
      // Overlap condition: start_date <= endDate AND due_date >= startDate
      // Since Supabase .or() calls replace each other, we need to combine conditions in a single filter
      if (startDate && endDate) {
        // Both dates: projects that overlap the range
        // Use a single combined OR filter with all overlap conditions:
        // - start_date is in range, OR
        // - due_date is in range, OR  
        // - project spans the range (starts before and ends after)
        projectsQuery = projectsQuery.or(
          `start_date.gte.${startDate}.and.start_date.lte.${endDate},` +
          `due_date.gte.${startDate}.and.due_date.lte.${endDate},` +
          `start_date.lte.${startDate}.and.due_date.gte.${endDate}`
        );
      } else if (startDate) {
        // Only start date: projects that start or end after this date
        projectsQuery = projectsQuery.or(`due_date.gte.${startDate},start_date.gte.${startDate}`);
      } else if (endDate) {
        // Only end date: projects that start or end before this date
        projectsQuery = projectsQuery.or(`due_date.lte.${endDate},start_date.lte.${endDate}`);
      }

      const { data: projects } = await projectsQuery;

      if (projects) {
        projects.forEach((project) => {
          if (!project.due_date) return;
          events.push({
            id: `project-${project.id}`,
            title: project.title,
            start: new Date(project.due_date),
            end: new Date(project.due_date),
            type: 'PROJECT',
            status: project.status,
            color: '#047857', // Green for projects
            allDay: true,
            resource: {
              id: project.id,
              type: 'project',
            },
          });
        });
      }
    }

    // Fetch milestones
    if (includeMilestones) {
      let milestonesQuery = supabase
        .from('milestones')
        .select('id, title, due_date, status, project_id')
        .eq('organization_id', organizationId)
        .is('deleted_at', null)
        .not('due_date', 'is', null);

      if (startDate) {
        milestonesQuery = milestonesQuery.gte('due_date', startDate);
      }
      if (endDate) {
        milestonesQuery = milestonesQuery.lte('due_date', endDate);
      }

      const { data: milestones } = await milestonesQuery;

      if (milestones) {
        milestones.forEach((milestone) => {
          if (!milestone.due_date) return;
          events.push({
            id: `milestone-${milestone.id}`,
            title: milestone.title,
            start: new Date(milestone.due_date),
            end: new Date(milestone.due_date),
            type: 'MILESTONE',
            status: milestone.status,
            color: '#6D28D9', // Purple for milestones
            allDay: true,
            resource: {
              id: milestone.id,
              type: 'milestone',
              projectId: milestone.project_id,
            },
          });
        });
      }
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/calendar/events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

