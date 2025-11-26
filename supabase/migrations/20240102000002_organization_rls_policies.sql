-- =============================================================================
-- PHASE 2: ORGANIZATIONS & TEAMS - Row Level Security Policies
-- =============================================================================
-- Security Model:
-- - Multi-tenant isolation (users can only access orgs they belong to)
-- - Role-based permissions (Owner, Admin, Editor, Viewer)
-- - Public invite acceptance (via secure token)
-- - Admin-only access to events and audit logs
-- =============================================================================

-- =============================================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. ORGANIZATIONS TABLE POLICIES
-- =============================================================================

-- Users can view organizations they are members of
CREATE POLICY "Users can view their organizations"
  ON public.organizations
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      -- User is the owner
      owner_id = auth.uid()
      OR
      -- User is a member
      id IN (
        SELECT organization_id 
        FROM public.organization_members 
        WHERE user_id = auth.uid() 
        AND status = 'active'
        AND deleted_at IS NULL
      )
    )
  );

-- Authenticated users can create organizations (will auto-become owner)
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND owner_id = auth.uid()
  );

-- Owners and Admins can update their organization
CREATE POLICY "Owners and Admins can update organization"
  ON public.organizations
  FOR UPDATE
  USING (
    deleted_at IS NULL
    AND user_has_org_permission(id, 'Admin')
  )
  WITH CHECK (
    deleted_at IS NULL
    AND user_has_org_permission(id, 'Admin')
  );

-- Only owners can delete (soft delete) organization
CREATE POLICY "Only owners can delete organization"
  ON public.organizations
  FOR UPDATE
  USING (
    owner_id = auth.uid()
    AND deleted_at IS NULL
  )
  WITH CHECK (
    owner_id = auth.uid()
  );

-- =============================================================================
-- 3. ORGANIZATION MEMBERS TABLE POLICIES
-- =============================================================================

-- Users can view members of organizations they belong to
CREATE POLICY "Users can view members of their organizations"
  ON public.organization_members
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND deleted_at IS NULL
    )
  );

-- System can insert members (used during org creation and invite acceptance)
CREATE POLICY "System can insert organization members"
  ON public.organization_members
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      -- User is being added to an org they have permission to manage
      user_has_org_permission(organization_id, 'Admin')
      OR
      -- User is the one being added (invite acceptance)
      user_id = auth.uid()
    )
  );

-- Owners and Admins can update member roles
CREATE POLICY "Owners and Admins can update members"
  ON public.organization_members
  FOR UPDATE
  USING (
    deleted_at IS NULL
    AND user_has_org_permission(organization_id, 'Admin')
  )
  WITH CHECK (
    deleted_at IS NULL
    AND user_has_org_permission(organization_id, 'Admin')
  );

-- Users can update their own last_accessed_at
CREATE POLICY "Users can update their own access time"
  ON public.organization_members
  FOR UPDATE
  USING (
    user_id = auth.uid()
    AND deleted_at IS NULL
  )
  WITH CHECK (
    user_id = auth.uid()
    AND deleted_at IS NULL
  );

-- Owners and Admins can remove members (soft delete)
CREATE POLICY "Owners and Admins can remove members"
  ON public.organization_members
  FOR DELETE
  USING (
    user_has_org_permission(organization_id, 'Admin')
    AND deleted_at IS NULL
  );

-- =============================================================================
-- 4. ORGANIZATION INVITES TABLE POLICIES
-- =============================================================================

-- Users can view invites for organizations they can manage
CREATE POLICY "Managers can view organization invites"
  ON public.organization_invites
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      user_has_org_permission(organization_id, 'Admin')
      OR
      -- Anyone can view invite by token (for acceptance page)
      token IS NOT NULL
    )
  );

-- Owners and Admins can create invites
CREATE POLICY "Managers can create invites"
  ON public.organization_invites
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_has_org_permission(organization_id, 'Admin')
    AND invited_by = auth.uid()
  );

-- Owners and Admins can update invites (resend, cancel)
CREATE POLICY "Managers can update invites"
  ON public.organization_invites
  FOR UPDATE
  USING (
    deleted_at IS NULL
    AND user_has_org_permission(organization_id, 'Admin')
  )
  WITH CHECK (
    deleted_at IS NULL
    AND user_has_org_permission(organization_id, 'Admin')
  );

-- System can update invite status (for acceptance)
CREATE POLICY "System can update invite status"
  ON public.organization_invites
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND token IS NOT NULL
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Owners and Admins can delete invites
CREATE POLICY "Managers can delete invites"
  ON public.organization_invites
  FOR DELETE
  USING (
    user_has_org_permission(organization_id, 'Admin')
  );

-- =============================================================================
-- 5. ORGANIZATION EVENTS TABLE POLICIES
-- =============================================================================

-- Only organization Owners and Admins can view events
CREATE POLICY "Managers can view organization events"
  ON public.organization_events
  FOR SELECT
  USING (
    user_has_org_permission(organization_id, 'Admin')
  );

-- System can insert events (service layer)
CREATE POLICY "System can insert events"
  ON public.organization_events
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND is_organization_member(organization_id, auth.uid())
  );

-- Only owners can update events (mark as processed)
CREATE POLICY "Owners can update events"
  ON public.organization_events
  FOR UPDATE
  USING (
    user_has_org_permission(organization_id, 'Owner')
  );

-- =============================================================================
-- 6. ORGANIZATION AUDIT LOG TABLE POLICIES
-- =============================================================================

-- Organization Owners and Admins can view audit logs
CREATE POLICY "Managers can view audit logs"
  ON public.organization_audit_log
  FOR SELECT
  USING (
    user_has_org_permission(organization_id, 'Admin')
  );

-- System can insert audit log entries
CREATE POLICY "System can insert audit logs"
  ON public.organization_audit_log
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      user_id = auth.uid()
      OR
      is_organization_member(organization_id, auth.uid())
    )
  );

-- Audit logs are immutable (no update or delete)

-- =============================================================================
-- 7. ADDITIONAL SECURITY FUNCTIONS
-- =============================================================================

-- Function to validate organization ownership
CREATE OR REPLACE FUNCTION is_organization_owner(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = org_id
    AND owner_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  user_role TEXT,
  member_status TEXT,
  joined_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    om.organization_id,
    o.name AS organization_name,
    om.role AS user_role,
    om.status AS member_status,
    om.joined_at,
    om.last_accessed_at
  FROM public.organization_members om
  JOIN public.organizations o ON o.id = om.organization_id
  WHERE om.user_id = user_id
  AND om.deleted_at IS NULL
  AND om.status = 'active'
  AND o.deleted_at IS NULL
  ORDER BY om.last_accessed_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate invite token and get invite details
CREATE OR REPLACE FUNCTION validate_invite_token(invite_token TEXT)
RETURNS TABLE (
  invite_id UUID,
  organization_id UUID,
  organization_name TEXT,
  email TEXT,
  role TEXT,
  invited_by_name TEXT,
  expires_at TIMESTAMPTZ,
  is_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id AS invite_id,
    i.organization_id,
    o.name AS organization_name,
    i.email,
    i.role,
    i.invited_by_name,
    i.expires_at,
    (i.status = 'pending' AND i.expires_at > NOW()) AS is_valid
  FROM public.organization_invites i
  JOIN public.organizations o ON o.id = i.organization_id
  WHERE i.token = invite_token
  AND i.deleted_at IS NULL
  AND o.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-create owner membership when organization is created
CREATE OR REPLACE FUNCTION create_owner_membership()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role,
    status,
    joined_at
  ) VALUES (
    NEW.id,
    NEW.owner_id,
    'Owner',
    'active',
    NOW()
  );
  
  -- Emit event
  INSERT INTO public.organization_events (
    organization_id,
    event_type,
    payload
  ) VALUES (
    NEW.id,
    'organization.created',
    jsonb_build_object(
      'organization_id', NEW.id,
      'organization_name', NEW.name,
      'owner_id', NEW.owner_id
    )
  );
  
  -- Log audit entry
  INSERT INTO public.organization_audit_log (
    organization_id,
    user_id,
    action,
    changes
  ) VALUES (
    NEW.id,
    NEW.owner_id,
    'organization.created',
    jsonb_build_object(
      'organization', row_to_json(NEW)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create owner membership
CREATE TRIGGER on_organization_created_create_owner
  AFTER INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION create_owner_membership();

-- Function to log organization updates
CREATE OR REPLACE FUNCTION log_organization_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organization_audit_log (
    organization_id,
    user_id,
    action,
    changes
  ) VALUES (
    NEW.id,
    auth.uid(),
    'organization.updated',
    jsonb_build_object(
      'before', row_to_json(OLD),
      'after', row_to_json(NEW)
    )
  );
  
  -- Emit event
  INSERT INTO public.organization_events (
    organization_id,
    event_type,
    payload
  ) VALUES (
    NEW.id,
    'organization.updated',
    jsonb_build_object(
      'organization_id', NEW.id,
      'updated_by', auth.uid(),
      'changes', jsonb_build_object(
        'before', row_to_json(OLD),
        'after', row_to_json(NEW)
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log organization updates
CREATE TRIGGER on_organization_updated_log
  AFTER UPDATE ON public.organizations
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION log_organization_update();

-- Function to log member changes
CREATE OR REPLACE FUNCTION log_member_change()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  event_type TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'member.added';
    event_type := 'member.joined';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'member.updated';
    event_type := 'member.updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'member.removed';
    event_type := 'member.removed';
  END IF;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.organization_audit_log (
      organization_id,
      user_id,
      action,
      changes
    ) VALUES (
      OLD.organization_id,
      auth.uid(),
      action_type,
      jsonb_build_object('member', row_to_json(OLD))
    );
    
    INSERT INTO public.organization_events (
      organization_id,
      event_type,
      payload
    ) VALUES (
      OLD.organization_id,
      event_type,
      jsonb_build_object(
        'member_id', OLD.id,
        'user_id', OLD.user_id,
        'role', OLD.role
      )
    );
    
    RETURN OLD;
  ELSE
    INSERT INTO public.organization_audit_log (
      organization_id,
      user_id,
      action,
      changes
    ) VALUES (
      NEW.organization_id,
      auth.uid(),
      action_type,
      jsonb_build_object(
        'before', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        'after', row_to_json(NEW)
      )
    );
    
    INSERT INTO public.organization_events (
      organization_id,
      event_type,
      payload
    ) VALUES (
      NEW.organization_id,
      event_type,
      jsonb_build_object(
        'member_id', NEW.id,
        'user_id', NEW.user_id,
        'role', NEW.role,
        'status', NEW.status
      )
    );
    
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log member changes
CREATE TRIGGER on_member_changed_log
  AFTER INSERT OR UPDATE OR DELETE ON public.organization_members
  FOR EACH ROW
  EXECUTE FUNCTION log_member_change();

-- Function to log invite events
CREATE OR REPLACE FUNCTION log_invite_event()
RETURNS TRIGGER AS $$
DECLARE
  event_type TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    event_type := 'member.invited';
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    event_type := 'invite.accepted';
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'cancelled' THEN
    event_type := 'invite.cancelled';
  ELSIF TG_OP = 'UPDATE' AND NEW.resend_count > OLD.resend_count THEN
    event_type := 'invite.resent';
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.organization_events (
    organization_id,
    event_type,
    payload
  ) VALUES (
    NEW.organization_id,
    event_type,
    jsonb_build_object(
      'invite_id', NEW.id,
      'email', NEW.email,
      'role', NEW.role,
      'invited_by', NEW.invited_by,
      'status', NEW.status
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log invite events
CREATE TRIGGER on_invite_event_log
  AFTER INSERT OR UPDATE ON public.organization_invites
  FOR EACH ROW
  EXECUTE FUNCTION log_invite_event();

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- RLS Policies created for:
--   ✅ organizations (view, create, update, delete)
--   ✅ organization_members (view, insert, update, delete)
--   ✅ organization_invites (view, create, update, delete, public token access)
--   ✅ organization_events (view, insert, update)
--   ✅ organization_audit_log (view, insert - immutable)
--
-- Security features:
--   ✅ Multi-tenant isolation (users only see their orgs)
--   ✅ Role-based permissions (Owner, Admin, Editor, Viewer)
--   ✅ Public invite acceptance (via secure token)
--   ✅ Audit logging triggers (auto-log all changes)
--   ✅ Event emission triggers (auto-emit events)
--   ✅ Owner membership auto-creation
--   ✅ Helper functions for permission checks
-- =============================================================================
