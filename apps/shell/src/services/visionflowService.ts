/**
 * VisionFlow Service
 * Business logic and data access for VisionFlow (Tasks, Plans, Projects, Workflows)
 */

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

type Plan = Database['public']['Tables']['plans']['Row'];
type PlanInsert = Database['public']['Tables']['plans']['Insert'];
type PlanUpdate = Database['public']['Tables']['plans']['Update'];

type Project = Database['public']['Tables']['projects']['Row'];

/**
 * Task Management
 */
export const visionflowService = {
  // ============================================================================
  // TASKS
  // ============================================================================

  /**
   * Get all tasks for the current user's organization
   */
  async getTasks(options?: {
    status?: string;
    priority?: string;
    projectId?: string;
    assignedToMe?: boolean;
    dueBefore?: string;
    limit?: number;
    offset?: number;
  }) {
    const supabase = createClient();

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
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Apply filters
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.priority) {
      query = query.eq('priority', options.priority);
    }

    if (options?.projectId) {
      query = query.eq('project_id', options.projectId);
    }

    if (options?.dueBefore) {
      query = query.lte('due_date', options.dueBefore);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }

    return data as Task[];
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
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
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }

    return data as Task;
  },

  /**
   * Create a new task
   */
  async createTask(task: TaskInsert) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }

    return data as Task;
  },

  /**
   * Update a task
   */
  async updateTask(id: string, updates: TaskUpdate) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }

    return data as Task;
  },

  /**
   * Delete a task (soft delete)
   */
  async deleteTask(id: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }

    return true;
  },

  /**
   * Assign a task to a user
   */
  async assignTask(taskId: string, userId: string, assignedBy: string, role?: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('task_assignments')
      .insert({
        task_id: taskId,
        assigned_to: userId,
        assigned_by: assignedBy,
        role: role || 'COLLABORATOR',
      })
      .select()
      .single();

    if (error) {
      console.error('Error assigning task:', error);
      throw new Error('Failed to assign task');
    }

    return data;
  },

  /**
   * Add a comment to a task
   */
  async addComment(taskId: string, userId: string, content: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: userId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }

    return data;
  },

  // ============================================================================
  // PLANS
  // ============================================================================

  /**
   * Get all plans accessible to the current user
   */
  async getPlans(options?: {
    status?: string;
    visibility?: string;
    limit?: number;
    offset?: number;
  }) {
    const supabase = createClient();

    let query = supabase
      .from('plans')
      .select(
        `
        *,
        owner:users!plans_owner_user_id_fkey(id, name, email, avatar_url),
        organization:organizations(id, name),
        projects:projects(
          id,
          title,
          status,
          progress_percentage
        )
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.visibility) {
      query = query.eq('visibility', options.visibility);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching plans:', error);
      throw new Error('Failed to fetch plans');
    }

    return data as Plan[];
  },

  /**
   * Get a single plan by ID
   */
  async getPlan(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('plans')
      .select(
        `
        *,
        owner:users!plans_owner_user_id_fkey(id, name, email, avatar_url),
        organization:organizations(id, name),
        projects:projects(
          id,
          title,
          description,
          status,
          progress_percentage,
          start_date,
          due_date
        ),
        shares:plan_shares(
          id,
          access_level,
          shared_with_user:users(id, name, email),
          shared_with_organization:organizations(id, name)
        )
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching plan:', error);
      throw new Error('Failed to fetch plan');
    }

    return data as Plan;
  },

  /**
   * Create a new plan
   */
  async createPlan(plan: PlanInsert) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('plans')
      .insert(plan)
      .select()
      .single();

    if (error) {
      console.error('Error creating plan:', error);
      throw new Error('Failed to create plan');
    }

    return data as Plan;
  },

  /**
   * Update a plan
   */
  async updatePlan(id: string, updates: PlanUpdate) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating plan:', error);
      throw new Error('Failed to update plan');
    }

    return data as Plan;
  },

  /**
   * Delete a plan (soft delete)
   */
  async deletePlan(id: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('plans')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting plan:', error);
      throw new Error('Failed to delete plan');
    }

    return true;
  },

  // ============================================================================
  // PROJECTS
  // ============================================================================

  /**
   * Get projects for a plan
   */
  async getProjects(planId?: string) {
    const supabase = createClient();

    let query = supabase
      .from('projects')
      .select(
        `
        *,
        plan:plans(id, title),
        milestones:milestones(
          id,
          title,
          status,
          due_date
        )
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (planId) {
      query = query.eq('plan_id', planId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }

    return data as Project[];
  },

  /**
   * Get dashboard summary data
   */
  async getDashboardSummary() {
    const supabase = createClient();

    // Get task counts by status
    const { data: taskCounts, error: taskError } = await supabase
      .from('tasks')
      .select('status')
      .is('deleted_at', null);

    if (taskError) {
      console.error('Error fetching dashboard summary:', taskError);
      throw new Error('Failed to fetch dashboard data');
    }

    const today = new Date().toISOString().split('T')[0];

    const summary = {
      tasksToday: taskCounts?.filter((t) => t.status !== 'COMPLETE' && t.due_date?.startsWith(today)).length || 0,
      inProgress: taskCounts?.filter((t) => t.status === 'IN_PROGRESS').length || 0,
      overdue: taskCounts?.filter((t) => t.status !== 'COMPLETE' && t.due_date && t.due_date < today).length || 0,
      completedThisWeek: 0, // TODO: Calculate based on completion_date
    };

    return summary;
  },
};
