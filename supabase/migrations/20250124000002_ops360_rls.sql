-- =====================================================
-- OPS360 ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: Phase 0 - Foundation
-- =====================================================

-- ─────────────────────────────────────────────────────
-- RLS HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────

-- Check if user is a member of an organization
CREATE OR REPLACE FUNCTION user_is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND status = 'ACTIVE'
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific role in org
CREATE OR REPLACE FUNCTION user_has_role_in_org(org_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
      AND organization_id = org_id
      AND role = required_role
      AND status = 'ACTIVE'
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has access to a plan
CREATE OR REPLACE FUNCTION user_can_view_plan(plan_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  plan_record RECORD;
BEGIN
  SELECT * INTO plan_record FROM plans WHERE id = plan_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Owner can always view
  IF plan_record.owner_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;

  -- ORG visibility: any org member can view
  IF plan_record.visibility = 'ORG' AND user_is_org_member(plan_record.owner_org_id) THEN
    RETURN TRUE;
  END IF;

  -- SHARED visibility: check plan_shares
  IF plan_record.visibility = 'SHARED' THEN
    RETURN EXISTS (
      SELECT 1 FROM plan_shares ps
      WHERE ps.plan_id = plan_id
        AND ps.deleted_at IS NULL
        AND (
          ps.shared_with_user_id = auth.uid()
          OR (ps.shared_with_org_id IS NOT NULL AND user_is_org_member(ps.shared_with_org_id))
        )
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can edit a plan
CREATE OR REPLACE FUNCTION user_can_edit_plan(plan_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  plan_record RECORD;
BEGIN
  SELECT * INTO plan_record FROM plans WHERE id = plan_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Owner can always edit
  IF plan_record.owner_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;

  -- ORG visibility: any org member with staff role can edit
  IF plan_record.visibility = 'ORG' AND user_has_role_in_org(plan_record.owner_org_id, 'ORG_STAFF') THEN
    RETURN TRUE;
  END IF;

  -- SHARED visibility: check for EDIT access level
  IF plan_record.visibility = 'SHARED' THEN
    RETURN EXISTS (
      SELECT 1 FROM plan_shares ps
      WHERE ps.plan_id = plan_id
        AND ps.deleted_at IS NULL
        AND ps.access_level = 'EDIT'
        AND (
          ps.shared_with_user_id = auth.uid()
          OR (ps.shared_with_org_id IS NOT NULL AND user_is_org_member(ps.shared_with_org_id))
        )
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────
-- RLS POLICIES
-- ─────────────────────────────────────────────────────

-- ORGANIZATIONS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organizations they belong to"
  ON organizations FOR SELECT
  USING (user_is_org_member(id));

CREATE POLICY "Org staff can update their organization"
  ON organizations FOR UPDATE
  USING (user_has_role_in_org(id, 'ORG_STAFF'));

-- MEMBERSHIPS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid() OR user_is_org_member(organization_id));

CREATE POLICY "Org staff can manage memberships in their org"
  ON memberships FOR ALL
  USING (user_has_role_in_org(organization_id, 'ORG_STAFF'));

-- PLANS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view plans they have access to"
  ON plans FOR SELECT
  USING (user_can_view_plan(id));

CREATE POLICY "Users can create plans in their orgs"
  ON plans FOR INSERT
  WITH CHECK (
    owner_user_id = auth.uid()
    AND (owner_org_id IS NULL OR user_is_org_member(owner_org_id))
  );

CREATE POLICY "Users can edit plans they have access to"
  ON plans FOR UPDATE
  USING (user_can_edit_plan(id));

CREATE POLICY "Plan owners can delete their plans"
  ON plans FOR DELETE
  USING (owner_user_id = auth.uid());

-- PLAN_SHARES
ALTER TABLE plan_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shares for plans they can access"
  ON plan_shares FOR SELECT
  USING (user_can_view_plan(plan_id));

CREATE POLICY "Users can create shares for plans they own or edit"
  ON plan_shares FOR INSERT
  WITH CHECK (
    shared_by = auth.uid()
    AND user_can_edit_plan(plan_id)
  );

CREATE POLICY "Share creators can delete their shares"
  ON plan_shares FOR DELETE
  USING (shared_by = auth.uid());

-- PROJECTS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects in plans they access"
  ON projects FOR SELECT
  USING (user_can_view_plan(plan_id));

CREATE POLICY "Users can create projects in plans they can edit"
  ON projects FOR INSERT
  WITH CHECK (
    user_can_edit_plan(plan_id)
    AND user_is_org_member(organization_id)
  );

CREATE POLICY "Users can edit projects in plans they can edit"
  ON projects FOR UPDATE
  USING (user_can_edit_plan(plan_id));

CREATE POLICY "Users can delete projects in plans they can edit"
  ON projects FOR DELETE
  USING (user_can_edit_plan(plan_id));

-- MILESTONES
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milestones if they can view the project"
  ON milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
        AND user_can_view_plan(p.plan_id)
    )
  );

CREATE POLICY "Users can manage milestones if they can edit the project"
  ON milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
        AND user_can_edit_plan(p.plan_id)
    )
  );

-- TASKS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their org or assigned to them"
  ON tasks FOR SELECT
  USING (
    user_is_org_member(organization_id)
    OR EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = tasks.id
        AND ta.assigned_to = auth.uid()
        AND ta.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can create tasks in their org"
  ON tasks FOR INSERT
  WITH CHECK (
    user_is_org_member(organization_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update tasks in their org or assigned to them"
  ON tasks FOR UPDATE
  USING (
    user_is_org_member(organization_id)
    OR EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = tasks.id
        AND ta.assigned_to = auth.uid()
        AND ta.deleted_at IS NULL
    )
  );

CREATE POLICY "Task creators can delete tasks"
  ON tasks FOR DELETE
  USING (created_by = auth.uid());

-- TASK_ASSIGNMENTS
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignments for tasks they can see"
  ON task_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND (
          user_is_org_member(t.organization_id)
          OR assigned_to = auth.uid()
        )
    )
  );

CREATE POLICY "Users can create assignments for tasks in their org"
  ON task_assignments FOR INSERT
  WITH CHECK (
    assigned_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND user_is_org_member(t.organization_id)
    )
  );

-- TASK_COMMENTS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on tasks they can see"
  ON task_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND (
          user_is_org_member(t.organization_id)
          OR EXISTS (
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = t.id AND ta.assigned_to = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Users can create comments on tasks they can see"
  ON task_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND (
          user_is_org_member(t.organization_id)
          OR EXISTS (
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = t.id AND ta.assigned_to = auth.uid()
          )
        )
    )
  );

-- TASK_ACTIVITY
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity for tasks they can see"
  ON task_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND (
          user_is_org_member(t.organization_id)
          OR EXISTS (
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = t.id AND ta.assigned_to = auth.uid()
          )
        )
    )
  );

-- WORKFLOWS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows in their org or public templates"
  ON workflows FOR SELECT
  USING (
    user_is_org_member(organization_id)
    OR (is_template = TRUE AND visibility = 'PUBLIC')
  );

CREATE POLICY "Users can create workflows in their org"
  ON workflows FOR INSERT
  WITH CHECK (
    user_is_org_member(organization_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "Workflow creators can update their workflows"
  ON workflows FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Workflow creators can delete their workflows"
  ON workflows FOR DELETE
  USING (created_by = auth.uid());

-- WORKFLOW_STEPS
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow steps if they can view the workflow"
  ON workflow_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workflows w
      WHERE w.id = workflow_id
        AND (
          user_is_org_member(w.organization_id)
          OR (w.is_template = TRUE AND w.visibility = 'PUBLIC')
        )
    )
  );

CREATE POLICY "Users can manage workflow steps if they own the workflow"
  ON workflow_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workflows w
      WHERE w.id = workflow_id
        AND w.created_by = auth.uid()
    )
  );

-- WORKFLOW_INSTANCES
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow instances in their org"
  ON workflow_instances FOR SELECT
  USING (user_is_org_member(organization_id));

CREATE POLICY "Users can create workflow instances in their org"
  ON workflow_instances FOR INSERT
  WITH CHECK (
    user_is_org_member(organization_id)
    AND started_by = auth.uid()
  );

CREATE POLICY "Users can update workflow instances in their org"
  ON workflow_instances FOR UPDATE
  USING (user_is_org_member(organization_id));

-- APP_SOURCES
ALTER TABLE app_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view app sources"
  ON app_sources FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- TASK_INGESTION_LOG
ALTER TABLE task_ingestion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ingestion logs for their org"
  ON task_ingestion_log FOR SELECT
  USING (user_is_org_member(organization_id));

-- AI_CONTEXT_CACHE
ALTER TABLE ai_context_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own AI context"
  ON ai_context_cache FOR ALL
  USING (
    user_id = auth.uid()
    AND user_is_org_member(organization_id)
  );

-- TASK_ATTACHMENTS
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments for tasks they can see"
  ON task_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND (
          user_is_org_member(t.organization_id)
          OR EXISTS (
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = t.id AND ta.assigned_to = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Users can upload attachments to tasks in their org"
  ON task_attachments FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
        AND user_is_org_member(t.organization_id)
    )
  );

-- ─────────────────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────────────────

COMMENT ON FUNCTION user_is_org_member IS 'Check if current user is an active member of the specified organization';
COMMENT ON FUNCTION user_has_role_in_org IS 'Check if current user has a specific role in the specified organization';
COMMENT ON FUNCTION user_can_view_plan IS 'Check if current user can view the specified plan based on ownership, org membership, or sharing';
COMMENT ON FUNCTION user_can_edit_plan IS 'Check if current user can edit the specified plan based on ownership or EDIT access level';
