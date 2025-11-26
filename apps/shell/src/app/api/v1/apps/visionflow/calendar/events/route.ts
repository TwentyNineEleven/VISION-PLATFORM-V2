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

      // Fix: Combine date range filters properly
      // Since calling .or() twice replaces the first filter, we need to combine conditions
      // For projects to be in range, at least one of their dates must be >= startDate
      // AND at least one must be <= endDate
      if (startDate && endDate) {
        // Both dates: fetch projects that could overlap, then filter precisely
        // Use OR to get projects where either date might be in range
        // We'll do precise overlap filtering in JavaScript
        projectsQuery = projectsQuery.or(
          `start_date.gte.${startDate},due_date.gte.${startDate},start_date.lte.${endDate},due_date.lte.${endDate}`
        );
      } else if (startDate) {
        // Only start date: projects that start or end after this date
        projectsQuery = projectsQuery.or(`due_date.gte.${startDate},start_date.gte.${startDate}`);
      } else if (endDate) {
        // Only end date: projects that start or end before this date
        projectsQuery = projectsQuery.or(`due_date.lte.${endDate},start_date.lte.${endDate}`);
      }

      let { data: projects } = await projectsQuery;

      // If both dates provided, filter for precise overlap
      if (startDate && endDate && projects) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        projects = projects.filter((project) => {
          if (!project.start_date && !project.due_date) return false;
          const projectStart = project.start_date ? new Date(project.start_date) : null;
          const projectEnd = project.due_date ? new Date(project.due_date) : null;
          // Project overlaps range if: projectStart <= end AND projectEnd >= start
          // Or if either date is within the range
          const startInRange = projectStart && projectStart >= start && projectStart <= end;
          const endInRange = projectEnd && projectEnd >= start && projectEnd <= end;
          const spansRange = projectStart && projectEnd && projectStart <= start && projectEnd >= end;
          return startInRange || endInRange || spansRange;
        });
      }

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

