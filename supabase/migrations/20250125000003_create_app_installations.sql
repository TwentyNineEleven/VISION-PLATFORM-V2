-- ============================================================================
-- App Installations System
-- ============================================================================
-- This migration creates the app installation and configuration system:
-- - App installations per organization
-- - App-specific settings storage
-- - Installation history tracking
-- - Feature flag support
-- ============================================================================

-- ============================================================================
-- APP INSTALLATIONS TABLE
-- ============================================================================
-- Tracks which apps are installed for each organization

CREATE TABLE IF NOT EXISTS app_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- App reference (matches id from app-catalog-data.ts)
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,

  -- Installation status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'disabled', 'trial')),

  -- Installation details
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  installed_by UUID REFERENCES users(id),

  -- Trial/subscription info
  trial_ends_at TIMESTAMPTZ,
  subscription_tier TEXT, -- 'free', 'starter', 'professional', 'enterprise'

  -- App-specific settings (JSON blob)
  settings JSONB DEFAULT '{}'::jsonb,

  -- Feature flags for this installation
  feature_flags JSONB DEFAULT '{}'::jsonb,

  -- Usage tracking
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Audit fields
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  uninstalled_at TIMESTAMPTZ,
  uninstalled_by UUID REFERENCES users(id),

  -- Constraints
  CONSTRAINT unique_app_per_org UNIQUE (organization_id, app_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_installations_org
  ON app_installations(organization_id) WHERE uninstalled_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_app_installations_app
  ON app_installations(app_id) WHERE uninstalled_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_app_installations_status
  ON app_installations(status) WHERE uninstalled_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_app_installations_last_accessed
  ON app_installations(last_accessed_at DESC) WHERE uninstalled_at IS NULL;

-- ============================================================================
-- APP INSTALLATION ACTIVITY TABLE
-- ============================================================================
-- Tracks app installation events for analytics and audit

CREATE TABLE IF NOT EXISTS app_installation_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_installation_id UUID REFERENCES app_installations(id) ON DELETE SET NULL,

  -- Activity details
  app_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'installed', 'uninstalled', 'paused', 'resumed',
    'settings_changed', 'accessed', 'trial_started', 'trial_ended',
    'upgraded', 'downgraded', 'feature_enabled', 'feature_disabled'
  )),

  -- Activity metadata
  details JSONB DEFAULT '{}'::jsonb,
  old_values JSONB,
  new_values JSONB,

  -- Actor
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_email TEXT,

  -- Context
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_activity_org
  ON app_installation_activity(organization_id);

CREATE INDEX IF NOT EXISTS idx_app_activity_installation
  ON app_installation_activity(app_installation_id);

CREATE INDEX IF NOT EXISTS idx_app_activity_app
  ON app_installation_activity(app_id);

CREATE INDEX IF NOT EXISTS idx_app_activity_created
  ON app_installation_activity(created_at DESC);

-- ============================================================================
-- APP FAVORITES TABLE
-- ============================================================================
-- User-level app favorites (independent of org installations)

CREATE TABLE IF NOT EXISTS app_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,

  -- Order for display
  display_order INTEGER DEFAULT 0,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_favorite_per_user UNIQUE (user_id, app_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_favorites_user
  ON app_favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_app_favorites_order
  ON app_favorites(user_id, display_order);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE TRIGGER update_app_installations_updated_at
  BEFORE UPDATE ON app_installations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Log app installation activity
CREATE OR REPLACE FUNCTION log_app_installation_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type = 'installed';
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.uninstalled_at IS NOT NULL AND OLD.uninstalled_at IS NULL THEN
      action_type = 'uninstalled';
    ELSIF NEW.status = 'paused' AND OLD.status != 'paused' THEN
      action_type = 'paused';
    ELSIF NEW.status = 'active' AND OLD.status = 'paused' THEN
      action_type = 'resumed';
    ELSIF NEW.settings IS DISTINCT FROM OLD.settings THEN
      action_type = 'settings_changed';
    ELSE
      action_type = 'accessed';
    END IF;
  END IF;

  -- Insert activity record
  INSERT INTO app_installation_activity (
    organization_id,
    app_installation_id,
    app_id,
    action,
    actor_id,
    old_values,
    new_values
  ) VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.app_id, OLD.app_id),
    action_type,
    COALESCE(NEW.updated_by, NEW.installed_by),
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_app_installation_activity_trigger
  AFTER INSERT OR UPDATE ON app_installations
  FOR EACH ROW
  EXECUTE FUNCTION log_app_installation_activity();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE app_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_installation_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_favorites ENABLE ROW LEVEL SECURITY;

-- App Installations: Organization members can view
CREATE POLICY "Organization members can view app installations"
  ON app_installations FOR SELECT
  TO authenticated
  USING (
    is_organization_member(organization_id, auth.uid())
  );

-- App Installations: Admins can manage
CREATE POLICY "Admins can manage app installations"
  ON app_installations FOR INSERT
  TO authenticated
  WITH CHECK (
    has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
  );

CREATE POLICY "Admins can update app installations"
  ON app_installations FOR UPDATE
  TO authenticated
  USING (
    has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
  );

CREATE POLICY "Admins can delete app installations"
  ON app_installations FOR DELETE
  TO authenticated
  USING (
    has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
  );

-- App Installation Activity: Organization members can view
CREATE POLICY "Organization members can view app activity"
  ON app_installation_activity FOR SELECT
  TO authenticated
  USING (
    is_organization_member(organization_id, auth.uid())
  );

-- System can log activity (via triggers)
CREATE POLICY "System can log app activity"
  ON app_installation_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- App Favorites: Users manage their own
CREATE POLICY "Users can view own favorites"
  ON app_favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add own favorites"
  ON app_favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own favorites"
  ON app_favorites FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON app_favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if app is installed for organization
CREATE OR REPLACE FUNCTION is_app_installed(org_id UUID, app TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM app_installations
    WHERE organization_id = org_id
      AND app_id = app
      AND status = 'active'
      AND uninstalled_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get installed apps for organization
CREATE OR REPLACE FUNCTION get_installed_apps(org_id UUID)
RETURNS TABLE (
  app_id TEXT,
  app_name TEXT,
  status TEXT,
  installed_at TIMESTAMPTZ,
  settings JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai.app_id,
    ai.app_name,
    ai.status,
    ai.installed_at,
    ai.settings
  FROM app_installations ai
  WHERE ai.organization_id = org_id
    AND ai.uninstalled_at IS NULL
  ORDER BY ai.app_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record app access (updates last_accessed_at and increments counter)
CREATE OR REPLACE FUNCTION record_app_access(org_id UUID, app TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE app_installations
  SET
    last_accessed_at = NOW(),
    access_count = access_count + 1
  WHERE organization_id = org_id
    AND app_id = app
    AND uninstalled_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_app_installed TO authenticated;
GRANT EXECUTE ON FUNCTION get_installed_apps TO authenticated;
GRANT EXECUTE ON FUNCTION record_app_access TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE app_installations IS 'Tracks which apps are installed per organization';
COMMENT ON TABLE app_installation_activity IS 'Audit log for app installation events';
COMMENT ON TABLE app_favorites IS 'User-level app favorites for quick access';
COMMENT ON FUNCTION is_app_installed IS 'Check if an app is installed and active for an organization';
COMMENT ON FUNCTION get_installed_apps IS 'Get all installed apps for an organization';
COMMENT ON FUNCTION record_app_access IS 'Record app access for analytics';
