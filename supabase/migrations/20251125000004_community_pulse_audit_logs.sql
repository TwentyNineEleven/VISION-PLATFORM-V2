-- ============================================================================
-- CommunityPulse Audit Logs Table
-- Track user actions for compliance and debugging
-- ============================================================================

-- Create audit logs table
CREATE TABLE IF NOT EXISTS community_pulse_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Action details
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',

    -- Client info
    ip_address INET,
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON community_pulse_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON community_pulse_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON community_pulse_audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON community_pulse_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON community_pulse_audit_logs(created_at DESC);

-- Composite index for filtered queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON community_pulse_audit_logs(organization_id, created_at DESC);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE community_pulse_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view audit logs for their organizations
CREATE POLICY "Users can view org audit logs"
    ON community_pulse_audit_logs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
    );

-- Users can create audit logs for their organizations
CREATE POLICY "Users can create audit logs"
    ON community_pulse_audit_logs
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
        AND user_id = auth.uid()
    );

-- Only admins can delete audit logs (for compliance)
CREATE POLICY "Admins can delete audit logs"
    ON community_pulse_audit_logs
    FOR DELETE
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE community_pulse_audit_logs IS 'Audit trail for CommunityPulse user actions';
COMMENT ON COLUMN community_pulse_audit_logs.action IS 'Action type (e.g., engagement.created, material.downloaded)';
COMMENT ON COLUMN community_pulse_audit_logs.resource_type IS 'Type of resource (engagement, material, template, method)';
COMMENT ON COLUMN community_pulse_audit_logs.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN community_pulse_audit_logs.metadata IS 'Additional context about the action';
