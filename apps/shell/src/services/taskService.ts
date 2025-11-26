/**
 * Task Service
 *
 * Handles CRUD operations for tasks, deadlines, and approvals.
 * Integrates with the dashboard to replace mock data.
 *
 * NOTE: This service uses explicit type definitions since the database
 * tables are created by migration 20251126000001_create_tasks_system.sql
 * which may not yet be reflected in the generated Supabase types.
 * Once the migration is applied and types regenerated, the eslint-disable
 * comments can be removed.
 */

import { createClient } from '@/lib/supabase/client';

// Dashboard-compatible types
export type TaskStatus = 'overdue' | 'due-today' | 'upcoming';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DeadlineType = 'report' | 'grant' | 'compliance' | 'review' | 'other';
export type ApprovalType = 'review' | 'budget' | 'document' | 'access' | 'other';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Database row types (matches migration schema)
interface TaskRow {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  app_id: string | null;
  context: string | null;
  assigned_to: string | null;
  created_by: string;
  status: string;
  priority: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface DeadlineRow {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  app_id: string | null;
  deadline_type: string;
  due_date: string;
  reminder_date: string | null;
  status: string;
  completed_at: string | null;
  owner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApprovalRow {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  app_id: string | null;
  approval_type: string;
  requested_by: string;
  requested_at: string;
  assigned_to: string | null;
  status: string;
  decision_at: string | null;
  decision_notes: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Public interfaces
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  appId?: string | null;
  context?: string | null;
  assignedTo?: string | null;
  createdBy: string;
  status: string;
  priority: TaskPriority;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed field for dashboard
  statusLabel?: TaskStatus;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string | null;
  appId?: string | null;
  deadlineType: DeadlineType;
  dueDate: string;
  reminderDate?: string | null;
  status: string;
  completedAt?: string | null;
  ownerId?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  title: string;
  description?: string | null;
  appId?: string | null;
  approvalType: ApprovalType;
  requestedBy: string;
  requestedAt: string;
  assignedTo?: string | null;
  status: ApprovalStatus;
  decisionAt?: string | null;
  decisionNotes?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  requestedByName?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  appId?: string;
  context?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface CreateDeadlineInput {
  title: string;
  description?: string;
  appId?: string;
  deadlineType?: DeadlineType;
  dueDate: string;
  reminderDate?: string;
  ownerId?: string;
}

export interface CreateApprovalInput {
  title: string;
  description?: string;
  appId?: string;
  approvalType?: ApprovalType;
  assignedTo?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

// Helper to compute task status label based on due date
function computeTaskStatusLabel(dueDate: string | null, status: string): TaskStatus | undefined {
  if (status === 'completed' || status === 'cancelled' || !dueDate) {
    return undefined;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) {
    return 'overdue';
  } else if (due.getTime() === today.getTime()) {
    return 'due-today';
  } else {
    return 'upcoming';
  }
}

// Transform database row to Task interface
function transformTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    appId: row.app_id,
    context: row.context,
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    status: row.status,
    priority: row.priority as TaskPriority,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusLabel: computeTaskStatusLabel(row.due_date, row.status),
  };
}

// Transform database row to Deadline interface
function transformDeadline(row: DeadlineRow): Deadline {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    appId: row.app_id,
    deadlineType: row.deadline_type as DeadlineType,
    dueDate: row.due_date,
    reminderDate: row.reminder_date,
    status: row.status,
    completedAt: row.completed_at,
    ownerId: row.owner_id,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Transform database row to Approval interface
function transformApproval(row: ApprovalRow & { users?: { full_name?: string } }): Approval {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    appId: row.app_id,
    approvalType: row.approval_type as ApprovalType,
    requestedBy: row.requested_by,
    requestedAt: row.requested_at,
    assignedTo: row.assigned_to,
    status: row.status as ApprovalStatus,
    decisionAt: row.decision_at,
    decisionNotes: row.decision_notes,
    relatedEntityType: row.related_entity_type,
    relatedEntityId: row.related_entity_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    requestedByName: row.users?.full_name,
  };
}

export const taskService = {
  // =========================================================================
  // TASKS
  // =========================================================================

  /**
   * Get tasks for the current user in an organization
   */
  async getTasks(organizationId: string, options?: {
    assignedTo?: string;
    status?: string;
    statusLabel?: TaskStatus;
    limit?: number;
  }): Promise<Task[]> {
    const supabase = createClient();


    let query = (supabase as any)
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (options?.assignedTo) {
      query = query.eq('assigned_to', options.assignedTo);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(error.message);
    }

    let tasks = ((data || []) as TaskRow[]).map(transformTask);

    // Filter by status label if specified
    if (options?.statusLabel) {
      tasks = tasks.filter(t => t.statusLabel === options.statusLabel);
    }

    return tasks;
  },

  /**
   * Get tasks for dashboard display (grouped by status)
   */
  async getDashboardTasks(organizationId: string, userId: string): Promise<{
    overdue: Task[];
    dueToday: Task[];
    upcoming: Task[];
  }> {
    const tasks = await this.getTasks(organizationId, {
      assignedTo: userId,
      status: 'pending',
    });

    return {
      overdue: tasks.filter(t => t.statusLabel === 'overdue'),
      dueToday: tasks.filter(t => t.statusLabel === 'due-today'),
      upcoming: tasks.filter(t => t.statusLabel === 'upcoming'),
    };
  },

  /**
   * Get a single task by ID
   */
  async getTask(taskId: string): Promise<Task | null> {
    const supabase = createClient();


    const { data, error } = await (supabase as any)
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? transformTask(data as TaskRow) : null;
  },

  /**
   * Create a new task
   */
  async createTask(organizationId: string, userId: string, input: CreateTaskInput): Promise<Task> {
    const supabase = createClient();

    const insertData = {
      organization_id: organizationId,
      title: input.title,
      description: input.description || null,
      app_id: input.appId || null,
      context: input.context || null,
      assigned_to: input.assignedTo || userId,
      created_by: userId,
      priority: input.priority || 'medium',
      due_date: input.dueDate || null,
    };


    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error(error.message);
    }

    return transformTask(data as TaskRow);
  },

  /**
   * Update a task
   */
  async updateTask(taskId: string, input: Partial<CreateTaskInput> & { status?: string }): Promise<Task> {
    const supabase = createClient();

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.appId !== undefined) updateData.app_id = input.appId;
    if (input.context !== undefined) updateData.context = input.context;
    if (input.assignedTo !== undefined) updateData.assigned_to = input.assignedTo;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.dueDate !== undefined) updateData.due_date = input.dueDate;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
    }


    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error(error.message);
    }

    return transformTask(data as TaskRow);
  },

  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<Task> {
    return this.updateTask(taskId, { status: 'completed' });
  },

  /**
   * Delete a task (soft delete)
   */
  async deleteTask(taskId: string): Promise<void> {
    const supabase = createClient();


    const { error } = await (supabase as any)
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error(error.message);
    }
  },

  // =========================================================================
  // DEADLINES
  // =========================================================================

  /**
   * Get deadlines for an organization
   */
  async getDeadlines(organizationId: string, options?: {
    status?: string;
    deadlineType?: DeadlineType;
    limit?: number;
    upcoming?: boolean;
  }): Promise<Deadline[]> {
    const supabase = createClient();


    let query = (supabase as any)
      .from('deadlines')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('due_date', { ascending: true });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.deadlineType) {
      query = query.eq('deadline_type', options.deadlineType);
    }

    if (options?.upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('due_date', today);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching deadlines:', error);
      throw new Error(error.message);
    }

    return ((data || []) as DeadlineRow[]).map(transformDeadline);
  },

  /**
   * Get upcoming deadlines for dashboard
   */
  async getUpcomingDeadlines(organizationId: string, limit = 5): Promise<Deadline[]> {
    return this.getDeadlines(organizationId, {
      status: 'upcoming',
      upcoming: true,
      limit,
    });
  },

  /**
   * Create a new deadline
   */
  async createDeadline(organizationId: string, userId: string, input: CreateDeadlineInput): Promise<Deadline> {
    const supabase = createClient();

    const insertData = {
      organization_id: organizationId,
      title: input.title,
      description: input.description || null,
      app_id: input.appId || null,
      deadline_type: input.deadlineType || 'other',
      due_date: input.dueDate,
      reminder_date: input.reminderDate || null,
      owner_id: input.ownerId || userId,
      created_by: userId,
    };


    const { data, error } = await (supabase as any)
      .from('deadlines')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating deadline:', error);
      throw new Error(error.message);
    }

    return transformDeadline(data as DeadlineRow);
  },

  /**
   * Update a deadline
   */
  async updateDeadline(deadlineId: string, input: Partial<CreateDeadlineInput> & { status?: string }): Promise<Deadline> {
    const supabase = createClient();

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.appId !== undefined) updateData.app_id = input.appId;
    if (input.deadlineType !== undefined) updateData.deadline_type = input.deadlineType;
    if (input.dueDate !== undefined) updateData.due_date = input.dueDate;
    if (input.reminderDate !== undefined) updateData.reminder_date = input.reminderDate;
    if (input.ownerId !== undefined) updateData.owner_id = input.ownerId;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
    }


    const { data, error } = await (supabase as any)
      .from('deadlines')
      .update(updateData)
      .eq('id', deadlineId)
      .select()
      .single();

    if (error) {
      console.error('Error updating deadline:', error);
      throw new Error(error.message);
    }

    return transformDeadline(data as DeadlineRow);
  },

  /**
   * Delete a deadline (soft delete)
   */
  async deleteDeadline(deadlineId: string): Promise<void> {
    const supabase = createClient();


    const { error } = await (supabase as any)
      .from('deadlines')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', deadlineId);

    if (error) {
      console.error('Error deleting deadline:', error);
      throw new Error(error.message);
    }
  },

  // =========================================================================
  // APPROVALS
  // =========================================================================

  /**
   * Get approvals for an organization
   */
  async getApprovals(organizationId: string, options?: {
    assignedTo?: string;
    requestedBy?: string;
    status?: ApprovalStatus;
    limit?: number;
  }): Promise<Approval[]> {
    const supabase = createClient();


    let query = (supabase as any)
      .from('approvals')
      .select(`
        *,
        users:requested_by (full_name)
      `)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('requested_at', { ascending: false });

    if (options?.assignedTo) {
      query = query.eq('assigned_to', options.assignedTo);
    }

    if (options?.requestedBy) {
      query = query.eq('requested_by', options.requestedBy);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching approvals:', error);
      throw new Error(error.message);
    }

    return ((data || []) as (ApprovalRow & { users?: { full_name?: string } })[]).map(transformApproval);
  },

  /**
   * Get pending approvals for dashboard
   */
  async getPendingApprovals(organizationId: string, userId: string, limit = 5): Promise<Approval[]> {
    return this.getApprovals(organizationId, {
      assignedTo: userId,
      status: 'pending',
      limit,
    });
  },

  /**
   * Create a new approval request
   */
  async createApproval(organizationId: string, userId: string, input: CreateApprovalInput): Promise<Approval> {
    const supabase = createClient();

    const insertData = {
      organization_id: organizationId,
      title: input.title,
      description: input.description || null,
      app_id: input.appId || null,
      approval_type: input.approvalType || 'review',
      requested_by: userId,
      assigned_to: input.assignedTo || null,
      related_entity_type: input.relatedEntityType || null,
      related_entity_id: input.relatedEntityId || null,
    };


    const { data, error } = await (supabase as any)
      .from('approvals')
      .insert(insertData)
      .select(`
        *,
        users:requested_by (full_name)
      `)
      .single();

    if (error) {
      console.error('Error creating approval:', error);
      throw new Error(error.message);
    }

    return transformApproval(data as ApprovalRow & { users?: { full_name?: string } });
  },

  /**
   * Approve or reject an approval request
   */
  async decideApproval(approvalId: string, decision: 'approved' | 'rejected', notes?: string): Promise<Approval> {
    const supabase = createClient();

    const updateData = {
      status: decision,
      decision_at: new Date().toISOString(),
      decision_notes: notes || null,
    };


    const { data, error } = await (supabase as any)
      .from('approvals')
      .update(updateData)
      .eq('id', approvalId)
      .select(`
        *,
        users:requested_by (full_name)
      `)
      .single();

    if (error) {
      console.error('Error updating approval:', error);
      throw new Error(error.message);
    }

    return transformApproval(data as ApprovalRow & { users?: { full_name?: string } });
  },

  /**
   * Delete an approval (soft delete)
   */
  async deleteApproval(approvalId: string): Promise<void> {
    const supabase = createClient();


    const { error } = await (supabase as any)
      .from('approvals')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', approvalId);

    if (error) {
      console.error('Error deleting approval:', error);
      throw new Error(error.message);
    }
  },
};

export default taskService;
