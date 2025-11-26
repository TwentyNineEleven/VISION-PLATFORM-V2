-- =====================================================
-- VISIONFLOW DATABASE SCHEMA
-- Supabase PostgreSQL 15
-- Multi-Tenant | RLS-Enforced | Audit-Ready
-- Migration: Phase 0 - Foundation
-- =====================================================

-- ─────────────────────────────────────────────────────
-- ORGANIZATIONS & MEMBERSHIP
-- ─────────────────────────────────────────────────────

-- Organizations table already exists - skip creation
-- Only create index if slug column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'organizations' AND column_name = 'slug'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug) WHERE deleted_at IS NULL;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ORG_STAFF', 'CONSULTANT', 'FUNDER', 'ADMIN')),
  permissions JSONB DEFAULT '{}',
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, organization_id, deleted_at)
);

CREATE INDEX idx_memberships_user ON memberships(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_memberships_org ON memberships(organization_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- PLANS
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  owner_org_id UUID REFERENCES organizations(id),
  visibility TEXT NOT NULL DEFAULT 'ORG' CHECK (visibility IN ('USER_PRIVATE', 'ORG', 'SHARED')),
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETE', 'ARCHIVED')),
  start_date DATE,
  end_date DATE,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_context JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_plans_owner_user ON plans(owner_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_plans_owner_org ON plans(owner_org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_plans_visibility ON plans(visibility) WHERE deleted_at IS NULL;
CREATE INDEX idx_plans_status ON plans(status) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plan_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  shared_with_org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'VIEW' CHECK (access_level IN ('VIEW', 'COMMENT', 'EDIT')),
  shared_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT share_target_check CHECK (
    (shared_with_org_id IS NOT NULL AND shared_with_user_id IS NULL) OR
    (shared_with_org_id IS NULL AND shared_with_user_id IS NOT NULL)
  )
);

CREATE INDEX idx_plan_shares_plan ON plan_shares(plan_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_plan_shares_org ON plan_shares(shared_with_org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_plan_shares_user ON plan_shares(shared_with_user_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'ON_HOLD')),
  priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_plan ON projects(plan_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_org ON projects(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- MILESTONES
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completion_date DATE,
  status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE')),
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_milestones_project ON milestones(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_milestones_org ON milestones(organization_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'CANCELLED')),
  priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  due_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  source_app TEXT, -- 'CapacityIQ', 'FundingFramer', etc.
  source_context JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_tasks_project ON tasks(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_milestone ON tasks(milestone_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_org ON tasks(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_status ON tasks(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_source_app ON tasks(source_app) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id),
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('OWNER', 'COLLABORATOR', 'REVIEWER')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(task_id, assigned_to, deleted_at)
);

CREATE INDEX idx_task_assignments_task ON task_assignments(task_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_assignments_user ON task_assignments(assigned_to) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- COMMENTS & ACTIVITY
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_task_comments_task ON task_comments(task_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'CREATED', 'UPDATED', 'ASSIGNED', 'COMPLETED', 'COMMENTED'
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_activity_task ON task_activity(task_id);
CREATE INDEX idx_task_activity_created ON task_activity(created_at);

-- ─────────────────────────────────────────────────────
-- WORKFLOWS
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'ONBOARDING', 'GRANT_MANAGEMENT', 'PROGRAM_DELIVERY'
  is_template BOOLEAN DEFAULT FALSE,
  visibility TEXT DEFAULT 'ORG' CHECK (visibility IN ('PRIVATE', 'ORG', 'PUBLIC')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_workflows_org ON workflows(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workflows_template ON workflows(is_template) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  duration_days INTEGER,
  assignee_role TEXT, -- 'ORG_STAFF', 'CONSULTANT', etc.
  automation_rules JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_workflow_steps_workflow ON workflow_steps(workflow_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETE', 'CANCELLED')),
  current_step_id UUID REFERENCES workflow_steps(id),
  started_by UUID NOT NULL REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_instances_workflow ON workflow_instances(workflow_id);
CREATE INDEX idx_workflow_instances_project ON workflow_instances(project_id);
CREATE INDEX idx_workflow_instances_org ON workflow_instances(organization_id);

-- ─────────────────────────────────────────────────────
-- CROSS-APP INTEGRATION
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS app_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  icon_url TEXT,
  webhook_url TEXT,
  api_key_hash TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with VISION apps
INSERT INTO app_sources (app_name, display_name) VALUES
  ('CapacityIQ', 'CapacityIQ'),
  ('LaunchPath', 'LaunchPath'),
  ('FundingFramer', 'FundingFramer'),
  ('FundGrid', 'FundGrid'),
  ('MetricMap', 'MetricMap'),
  ('Stakeholdr', 'Stakeholdr'),
  ('Architex', 'Architex'),
  ('PathwayPro', 'PathwayPro'),
  ('CommunityCompass', 'Community Compass')
ON CONFLICT (app_name) DO NOTHING;

-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_ingestion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app TEXT NOT NULL,
  source_record_id TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  task_id UUID REFERENCES tasks(id),
  status TEXT CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED')),
  payload JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingestion_log_app ON task_ingestion_log(source_app);
CREATE INDEX idx_ingestion_log_org ON task_ingestion_log(organization_id);
CREATE INDEX idx_ingestion_log_created ON task_ingestion_log(created_at);

-- ─────────────────────────────────────────────────────
-- AI CONTEXT CACHE
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_context_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  context_type TEXT NOT NULL, -- 'PLAN_GENERATION', 'TASK_BREAKDOWN'
  context_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_context_user_org ON ai_context_cache(user_id, organization_id);
CREATE INDEX idx_ai_context_expires ON ai_context_cache(expires_at);

-- ─────────────────────────────────────────────────────
-- ATTACHMENTS
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_task_attachments_task ON task_attachments(task_id) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────
-- TRIGGERS FOR UPDATED_AT
-- ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create triggers if they don't exist
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_memberships_updated_at ON memberships;
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at BEFORE UPDATE ON workflow_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at BEFORE UPDATE ON workflow_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────────────────

COMMENT ON TABLE plans IS 'High-level strategic execution plans';
COMMENT ON TABLE plan_shares IS 'Sharing relationships for plans (org-to-org, user-to-user, etc.)';
COMMENT ON TABLE projects IS 'Structured units of work within plans';
COMMENT ON TABLE milestones IS 'Major checkpoints within projects';
COMMENT ON TABLE tasks IS 'Atomic units of work';
COMMENT ON TABLE task_assignments IS 'User assignments for tasks';
COMMENT ON TABLE workflows IS 'Reusable process templates';
COMMENT ON TABLE workflow_instances IS 'Applied workflows to projects';
COMMENT ON TABLE task_ingestion_log IS 'Audit log for cross-app task imports';
COMMENT ON TABLE ai_context_cache IS 'Cached organizational context for AI plan generation';
