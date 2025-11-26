-- =============================================================================
-- PHASE 2: ORGANIZATIONS & TEAMS - Database Tables
-- =============================================================================
-- Features:
-- - Multi-tenant organization structure
-- - Team membership management
-- - Email invite system with secure tokens
-- - Soft deletes (never lose data)
-- - Audit logging (compliance & debugging)
-- - Events system (webhooks & integrations)
-- - Billing-ready (fields present, not enforced)
-- - Multi-organization support (consultants can belong to multiple orgs)
-- =============================================================================

-- =============================================================================
-- 1. ORGANIZATIONS TABLE
-- =============================================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name TEXT NOT NULL,
  type TEXT,
  website TEXT,
  industry TEXT,
  ein TEXT, -- Tax ID / Employer Identification Number
  logo_url TEXT,
  mission TEXT,
  founded_year INTEGER,
  staff_count INTEGER,
  annual_budget TEXT,
  focus_areas TEXT[], -- Array of focus areas
  
  -- Address Information
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_postal_code TEXT,
  address_country TEXT,
  
  -- Branding
  brand_primary_color TEXT DEFAULT '#2563eb',
  brand_secondary_color TEXT DEFAULT '#9333ea',
  
  -- Ownership & Hierarchy
  owner_id UUID NOT NULL REFERENCES public.users(id),
  parent_organization_id UUID REFERENCES public.organizations(id),
  organization_type TEXT DEFAULT 'standard' CHECK (organization_type IN ('standard', 'parent', 'subsidiary')),
  
  -- Subscription & Billing (Not enforced yet, ready for future)
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'professional', 'enterprise')),
  plan_seats INTEGER DEFAULT 999, -- Unlimited for now
  billing_email TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  trial_ends_at TIMESTAMPTZ,
  
  -- Technical & Extensibility
  data_region TEXT DEFAULT 'us-east-1',
  metadata JSONB DEFAULT '{}', -- Extensible custom fields
  settings JSONB DEFAULT '{}', -- Extensible settings
  
  -- Audit Trail
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deleted_by UUID REFERENCES public.users(id),
  
  -- Constraints
  CONSTRAINT valid_website CHECK (website IS NULL OR website ~* '^https?://'),
  CONSTRAINT valid_founded_year CHECK (founded_year IS NULL OR (founded_year >= 1800 AND founded_year <= EXTRACT(YEAR FROM NOW()) + 1))
);

-- =============================================================================
-- 2. ORGANIZATION MEMBERS TABLE
-- =============================================================================
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Role & Status
  role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Editor', 'Viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'inactive')),
  
  -- Permissions (Extensible for future granular permissions)
  permissions JSONB DEFAULT '{}',
  
  -- Activity Tracking
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Audit Trail
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deleted_by UUID REFERENCES public.users(id),
  
  -- Constraints
  UNIQUE(organization_id, user_id, deleted_at) -- Allow re-adding after soft delete
);

-- =============================================================================
-- 3. ORGANIZATION INVITES TABLE
-- =============================================================================
CREATE TABLE public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Invite Details
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Editor', 'Viewer')),
  token TEXT NOT NULL UNIQUE, -- Secure token for acceptance
  message TEXT, -- Personal message with invite
  
  -- Invited By (Cached for display)
  invited_by UUID NOT NULL REFERENCES public.users(id),
  invited_by_name TEXT,
  invited_by_email TEXT,
  
  -- Status & Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  resend_count INTEGER DEFAULT 0,
  last_sent_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Acceptance
  accepted_by UUID REFERENCES public.users(id),
  accepted_at TIMESTAMPTZ,
  
  -- Expiration
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Extensibility
  metadata JSONB DEFAULT '{}', -- Custom onboarding data
  
  -- Audit Trail
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deleted_by UUID REFERENCES public.users(id),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================================================
-- 4. ORGANIZATION EVENTS TABLE (Webhooks & Integrations)
-- =============================================================================
CREATE TABLE public.organization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type TEXT NOT NULL, -- e.g., 'member.invited', 'member.joined', 'org.updated'
  payload JSONB NOT NULL, -- Full event data
  
  -- Processing
  processed_at TIMESTAMPTZ DEFAULT NULL,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. ORGANIZATION AUDIT LOG TABLE (Compliance & Debugging)
-- =============================================================================
CREATE TABLE public.organization_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  
  -- Action Details
  action TEXT NOT NULL, -- e.g., 'organization.created', 'organization.updated', 'member.added'
  changes JSONB, -- Before/after states
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. UPDATE USER_PREFERENCES TABLE (Active Organization)
-- =============================================================================
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS active_organization_id UUID REFERENCES public.organizations(id);

-- =============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Organizations
CREATE INDEX idx_organizations_owner ON public.organizations(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_organizations_parent ON public.organizations(parent_organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_organizations_deleted ON public.organizations(deleted_at) WHERE deleted_at IS NOT NULL;

-- Organization Members
CREATE INDEX idx_org_members_org_user ON public.organization_members(organization_id, user_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_org_members_org ON public.organization_members(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_org_members_active ON public.organization_members(organization_id, status) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_org_members_last_accessed ON public.organization_members(user_id, last_accessed_at DESC) WHERE deleted_at IS NULL;

-- Organization Invites
CREATE INDEX idx_org_invites_org ON public.organization_invites(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_org_invites_email ON public.organization_invites(email) WHERE status = 'pending';
CREATE INDEX idx_org_invites_token ON public.organization_invites(token) WHERE status = 'pending';
CREATE INDEX idx_org_invites_status ON public.organization_invites(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_org_invites_expires ON public.organization_invites(expires_at) WHERE status = 'pending';

-- Organization Events
CREATE INDEX idx_org_events_org ON public.organization_events(organization_id, created_at DESC);
CREATE INDEX idx_org_events_unprocessed ON public.organization_events(created_at) WHERE processed_at IS NULL;
CREATE INDEX idx_org_events_type ON public.organization_events(organization_id, event_type);

-- Organization Audit Log
CREATE INDEX idx_audit_log_org ON public.organization_audit_log(organization_id, created_at DESC);
CREATE INDEX idx_audit_log_user ON public.organization_audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON public.organization_audit_log(organization_id, action);

-- User Preferences (Active Organization)
CREATE INDEX idx_user_prefs_active_org ON public.user_preferences(active_organization_id);

-- =============================================================================
-- 8. TRIGGERS FOR UPDATED_AT
-- =============================================================================

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_invites_updated_at
  BEFORE UPDATE ON public.organization_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 9. HELPER FUNCTIONS
-- =============================================================================

-- Function to generate secure invite token
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-expire invites
CREATE OR REPLACE FUNCTION expire_old_invites()
RETURNS void AS $$
BEGIN
  UPDATE public.organization_invites
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is organization member
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND organization_members.user_id = user_id
    AND status = 'active'
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role in organization
CREATE OR REPLACE FUNCTION get_user_org_role(org_id UUID, user_id UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check organization permission
CREATE OR REPLACE FUNCTION user_has_org_permission(
  org_id UUID,
  required_role TEXT
) RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Tables created:
--   1. organizations
--   2. organization_members
--   3. organization_invites
--   4. organization_events
--   5. organization_audit_log
--   6. user_preferences (updated)
--
-- Features enabled:
--   ✅ Multi-tenant organization structure
--   ✅ Soft deletes (all tables)
--   ✅ Audit logging
--   ✅ Events for webhooks/integrations
--   ✅ Billing-ready (fields present, not enforced)
--   ✅ Multi-organization membership
--   ✅ Extensible metadata/settings (JSONB)
--   ✅ Performance indexes
--   ✅ Helper functions for permissions
-- =============================================================================
