-- ============================================================================
-- Fix Security Linter Issues
-- ============================================================================
-- This migration addresses Supabase database linter warnings:
-- 1. Security definer views (v_table_sizes, v_rls_policy_summary)
-- 2. Function search_path mutable warnings
-- 3. Document leaked password protection (dashboard setting)
-- ============================================================================

-- ============================================================================
-- 1. FIX SECURITY DEFINER VIEWS
-- ============================================================================
-- These views may have been created by Supabase or other tools.
-- If they exist with SECURITY DEFINER, we'll recreate them without it
-- or drop them if they're not needed.

-- Drop and recreate v_table_sizes without SECURITY DEFINER (if it exists)
DROP VIEW IF EXISTS public.v_table_sizes CASCADE;

-- Recreate v_table_sizes as a regular view (if needed for monitoring)
-- Note: This is a utility view, so we'll make it accessible to authenticated users
CREATE OR REPLACE VIEW public.v_table_sizes AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Drop and recreate v_rls_policy_summary without SECURITY DEFINER (if it exists)
DROP VIEW IF EXISTS public.v_rls_policy_summary CASCADE;

-- Recreate v_rls_policy_summary as a regular view (if needed for monitoring)
CREATE OR REPLACE VIEW public.v_rls_policy_summary AS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Grant access to authenticated users (if these views are needed)
-- Note: These views expose metadata, not sensitive data
GRANT SELECT ON public.v_table_sizes TO authenticated;
GRANT SELECT ON public.v_rls_policy_summary TO authenticated;

-- ============================================================================
-- 2. FIX FUNCTION SEARCH_PATH MUTABLE WARNINGS
-- ============================================================================
-- All functions need SET search_path to prevent search_path injection attacks.
-- We'll set search_path to empty string or 'public' depending on the function.

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix is_organization_member function (from organizations migration)
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND organization_members.user_id = user_id
    AND status = 'active'
    AND deleted_at IS NULL
  );
END;
$$;

-- Fix get_user_org_role function
CREATE OR REPLACE FUNCTION get_user_org_role(org_id UUID, user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.organization_members
  WHERE organization_id = org_id
  AND organization_members.user_id = user_id
  AND status = 'active'
  AND deleted_at IS NULL;
  
  RETURN user_role;
END;
$$;

-- Fix user_has_org_permission function
CREATE OR REPLACE FUNCTION user_has_org_permission(
  org_id UUID,
  required_role TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_org_role(org_id, auth.uid());
  
  -- Owner and Admin have all permissions
  IF user_role IN ('Owner', 'Admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific role requirements
  CASE required_role
    WHEN 'Owner' THEN
      RETURN user_role = 'Owner';
    WHEN 'Admin' THEN
      RETURN user_role IN ('Owner', 'Admin');
    WHEN 'Editor' THEN
      RETURN user_role IN ('Owner', 'Admin', 'Editor');
    WHEN 'Viewer' THEN
      RETURN user_role IN ('Owner', 'Admin', 'Editor', 'Viewer');
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$;

-- Fix generate_invite_token function
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- Fix expire_old_invites function
CREATE OR REPLACE FUNCTION expire_old_invites()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.organization_invites
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$;

-- Fix is_organization_owner function
CREATE OR REPLACE FUNCTION is_organization_owner(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = org_id
    AND owner_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$;

-- Fix get_user_organizations function
CREATE OR REPLACE FUNCTION get_user_organizations(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  user_role TEXT,
  member_status TEXT,
  joined_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix validate_invite_token function
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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix create_owner_membership function
CREATE OR REPLACE FUNCTION create_owner_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix log_organization_update function
CREATE OR REPLACE FUNCTION log_organization_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix log_member_change function
CREATE OR REPLACE FUNCTION log_member_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix log_invite_event function
CREATE OR REPLACE FUNCTION log_invite_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix has_organization_role function (from documents migration)
CREATE OR REPLACE FUNCTION has_organization_role(org_id UUID, user_id UUID, required_role TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = org_id
      AND user_id = has_organization_role.user_id
      AND role = ANY(required_role)
      AND status = 'active'
      AND deleted_at IS NULL
  );
END;
$$;

-- Fix can_view_document function
CREATE OR REPLACE FUNCTION can_view_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  doc_org_id UUID;
  user_role TEXT;
BEGIN
  -- Get document's organization
  SELECT organization_id INTO doc_org_id
  FROM documents
  WHERE id = doc_id AND deleted_at IS NULL;
  
  IF doc_org_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user's role in organization
  SELECT role INTO user_role
  FROM organization_members
  WHERE organization_id = doc_org_id
    AND user_id = can_view_document.user_id
    AND status = 'active'
    AND deleted_at IS NULL;
  
  -- Owner and Admin can view all
  IF user_role IN ('Owner', 'Admin') THEN
    RETURN true;
  END IF;
  
  -- Check if document is shared with user
  IF EXISTS (
    SELECT 1
    FROM document_shares
    WHERE document_id = doc_id
      AND shared_with_user_id = can_view_document.user_id
      AND (expires_at IS NULL OR expires_at > NOW())
      AND revoked_at IS NULL
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if document is shared with user's role
  IF EXISTS (
    SELECT 1
    FROM document_shares
    WHERE document_id = doc_id
      AND shared_with_role = user_role
      AND (expires_at IS NULL OR expires_at > NOW())
      AND revoked_at IS NULL
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user uploaded the document
  IF EXISTS (
    SELECT 1
    FROM documents
    WHERE id = doc_id
      AND uploaded_by = can_view_document.user_id
      AND deleted_at IS NULL
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Fix can_edit_document function
CREATE OR REPLACE FUNCTION can_edit_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  doc_org_id UUID;
  user_role TEXT;
BEGIN
  -- Get document's organization
  SELECT organization_id INTO doc_org_id
  FROM documents
  WHERE id = doc_id AND deleted_at IS NULL;
  
  IF doc_org_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user's role in organization
  SELECT role INTO user_role
  FROM organization_members
  WHERE organization_id = doc_org_id
    AND user_id = can_edit_document.user_id
    AND status = 'active'
    AND deleted_at IS NULL;
  
  -- Owner and Admin can edit all
  IF user_role IN ('Owner', 'Admin') THEN
    RETURN true;
  END IF;
  
  -- Check if user uploaded the document
  IF EXISTS (
    SELECT 1
    FROM documents
    WHERE id = doc_id
      AND uploaded_by = can_edit_document.user_id
      AND deleted_at IS NULL
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if document is shared with edit permission
  IF EXISTS (
    SELECT 1
    FROM document_shares
    WHERE document_id = doc_id
      AND (
        shared_with_user_id = can_edit_document.user_id 
        OR shared_with_role = user_role
      )
      AND permission IN ('edit', 'admin')
      AND (expires_at IS NULL OR expires_at > NOW())
      AND revoked_at IS NULL
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Fix can_delete_document function
CREATE OR REPLACE FUNCTION can_delete_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  doc_org_id UUID;
BEGIN
  -- Get document's organization
  SELECT organization_id INTO doc_org_id
  FROM documents
  WHERE id = doc_id AND deleted_at IS NULL;
  
  IF doc_org_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Only Owner and Admin can delete
  RETURN has_organization_role(doc_org_id, user_id, ARRAY['Owner', 'Admin']);
END;
$$;

-- Fix update_folder_path function
CREATE OR REPLACE FUNCTION update_folder_path()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.parent_folder_id IS NULL THEN
    NEW.path = '/' || NEW.id::text || '/';
    NEW.depth = 0;
  ELSE
    SELECT path, depth INTO NEW.path, NEW.depth
    FROM folders
    WHERE id = NEW.parent_folder_id;
    
    NEW.path = NEW.path || NEW.id::text || '/';
    NEW.depth = NEW.depth + 1;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix manage_document_versions function
CREATE OR REPLACE FUNCTION manage_document_versions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  version_count INTEGER;
BEGIN
  -- Count existing versions
  SELECT COUNT(*) INTO version_count
  FROM document_versions
  WHERE document_id = NEW.document_id;
  
  -- If we have 3 or more versions, delete the oldest
  IF version_count >= 3 THEN
    DELETE FROM document_versions
    WHERE id IN (
      SELECT id
      FROM document_versions
      WHERE document_id = NEW.document_id
      ORDER BY version_number ASC
      LIMIT 1
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix log_document_activity function
CREATE OR REPLACE FUNCTION log_document_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  action_type TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type = 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      action_type = 'deleted';
    ELSIF NEW.name != OLD.name THEN
      action_type = 'renamed';
    ELSIF NEW.folder_id != OLD.folder_id THEN
      action_type = 'moved';
    ELSE
      action_type = 'updated';
    END IF;
  END IF;
  
  -- Insert activity record
  INSERT INTO document_activity (
    organization_id,
    document_id,
    action,
    actor_id,
    old_values,
    new_values
  ) VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    COALESCE(NEW.id, OLD.id),
    action_type,
    COALESCE(NEW.updated_by, NEW.uploaded_by),
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW)
  );
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON VIEW public.v_table_sizes IS 'Utility view for monitoring table sizes. Recreated without SECURITY DEFINER for security compliance.';
COMMENT ON VIEW public.v_rls_policy_summary IS 'Utility view for monitoring RLS policies. Recreated without SECURITY DEFINER for security compliance.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Fixed issues:
--   ✅ Security definer views (recreated without SECURITY DEFINER)
--   ✅ Function search_path mutable warnings (added SET search_path = public)
--   ✅ All 20+ functions updated with proper search_path setting
--
-- Note: Leaked password protection is a Supabase dashboard setting.
-- To enable it:
--   1. Go to Supabase Dashboard > Authentication > Settings
--   2. Enable "Leaked Password Protection"
--   3. This checks passwords against HaveIBeenPwned.org database
-- ============================================================================

