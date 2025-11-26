/**
 * VisionFlow TypeScript Types
 * Following VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md patterns
 */

// ============================================================================
// PLANS
// ============================================================================

export interface Plan {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date?: string;
  end_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  projects?: Project[];
  shares?: PlanShare[];
}

export interface CreatePlanRequest {
  title: string;
  description?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility?: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date?: string;
  end_date?: string;
}

export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility?: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date?: string;
  end_date?: string;
}

export interface PlanShare {
  id: string;
  plan_id: string;
  shared_with_user_id?: string;
  shared_with_org_id?: string;
  access_level: 'VIEW' | 'COMMENT' | 'EDIT';
  shared_by: string;
  created_at: string;
  shared_with_user?: {
    id: string;
    name: string;
    email: string;
  };
  shared_with_org?: {
    id: string;
    name: string;
  };
}

export interface SharePlanRequest {
  shared_with_user_id?: string;
  shared_with_org_id?: string;
  access_level: 'VIEW' | 'COMMENT' | 'EDIT';
}

export interface PlanFilters {
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility?: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  limit?: number;
  offset?: number;
}

// ============================================================================
// PROJECTS
// ============================================================================

export interface Project {
  id: string;
  organization_id: string;
  plan_id?: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'BLOCKED' | 'ON_HOLD';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  plan?: {
    id: string;
    title: string;
  };
  milestones?: Milestone[];
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  plan_id?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'BLOCKED' | 'ON_HOLD';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  start_date?: string;
  due_date?: string;
  progress_percentage?: number;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'BLOCKED' | 'ON_HOLD';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  start_date?: string;
  due_date?: string;
  progress_percentage?: number;
}

export interface ProjectFilters {
  plan_id?: string;
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// MILESTONES
// ============================================================================

export interface Milestone {
  id: string;
  project_id: string;
  organization_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completion_date?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export interface Workflow {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  estimated_days: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  steps?: WorkflowStep[];
  created_by_user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  title: string;
  description?: string;
  sort_order: number;
  duration_days: number;
  assignee_role: 'ORG_STAFF' | 'CONSULTANT' | 'FUNDER' | 'PROJECT_LEAD';
  created_at: string;
  updated_at: string;
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  steps: Array<{
    title: string;
    description?: string;
    sort_order?: number;
    duration_days: number;
    assignee_role: 'ORG_STAFF' | 'CONSULTANT' | 'FUNDER' | 'PROJECT_LEAD';
  }>;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  estimated_days?: number;
}

export interface WorkflowFilters {
  is_public?: boolean;
  limit?: number;
  offset?: number;
}

export interface WorkflowInstance {
  id: string;
  workflow_id: string;
  project_id?: string;
  organization_id: string;
  status: 'ACTIVE' | 'COMPLETE' | 'CANCELLED';
  current_step_id?: string;
  started_by: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CALENDAR
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'TASK' | 'PROJECT' | 'MILESTONE';
  status: string;
  priority?: string;
  color: string;
  allDay: boolean;
  resource: {
    id: string;
    type: string;
    projectId?: string;
  };
}

export interface CalendarFilters {
  start: string;
  end: string;
  include_tasks?: boolean;
  include_projects?: boolean;
  include_milestones?: boolean;
}

