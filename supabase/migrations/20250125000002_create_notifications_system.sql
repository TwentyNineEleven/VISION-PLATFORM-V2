-- ============================================================================
-- Notifications System Migration
-- ============================================================================
-- This migration creates the notifications system with support for:
-- - In-app notifications
-- - Email notifications via Resend
-- - Real-time updates via Supabase Realtime
-- - Notification preferences per user
-- - Multi-tenant isolation with RLS
-- ============================================================================

-- ============================================================================
-- Notification Types Enum
-- ============================================================================

CREATE TYPE notification_type AS ENUM (
  'invitation',           -- Organization invitation
  'member_added',         -- New member joined
  'member_removed',       -- Member left/removed
  'role_changed',         -- Role updated
  'organization_updated', -- Organization settings changed
  'task_assigned',        -- Task assigned to user
  'task_completed',       -- Task marked complete
  'file_shared',          -- File shared with user
  'comment_added',        -- Comment on user's item
  'mention',              -- User mentioned in comment
  'system'                -- System notifications
);

-- ============================================================================
-- Notification Priority Enum
-- ============================================================================

CREATE TYPE notification_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- ============================================================================
-- Notifications Table
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who receives the notification
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Organization context (nullable for system-wide notifications)
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Notification details
  type notification_type NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Action link (optional)
  action_url TEXT,
  action_label TEXT,

  -- Related entity (optional)
  related_entity_type TEXT, -- 'task', 'file', 'comment', etc.
  related_entity_id UUID,

  -- Actor who triggered the notification (nullable for system)
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Status
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Email delivery
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  email_error TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Indexes
  CONSTRAINT notifications_read_at_check CHECK (read_at IS NULL OR read = true)
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================================
-- Notification Preferences Table
-- ============================================================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Global toggles
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT false,

  -- Notification type preferences
  invitation_in_app BOOLEAN NOT NULL DEFAULT true,
  invitation_email BOOLEAN NOT NULL DEFAULT true,

  member_added_in_app BOOLEAN NOT NULL DEFAULT true,
  member_added_email BOOLEAN NOT NULL DEFAULT false,

  member_removed_in_app BOOLEAN NOT NULL DEFAULT true,
  member_removed_email BOOLEAN NOT NULL DEFAULT false,

  role_changed_in_app BOOLEAN NOT NULL DEFAULT true,
  role_changed_email BOOLEAN NOT NULL DEFAULT true,

  organization_updated_in_app BOOLEAN NOT NULL DEFAULT true,
  organization_updated_email BOOLEAN NOT NULL DEFAULT false,

  task_assigned_in_app BOOLEAN NOT NULL DEFAULT true,
  task_assigned_email BOOLEAN NOT NULL DEFAULT true,

  task_completed_in_app BOOLEAN NOT NULL DEFAULT true,
  task_completed_email BOOLEAN NOT NULL DEFAULT false,

  file_shared_in_app BOOLEAN NOT NULL DEFAULT true,
  file_shared_email BOOLEAN NOT NULL DEFAULT true,

  comment_added_in_app BOOLEAN NOT NULL DEFAULT true,
  comment_added_email BOOLEAN NOT NULL DEFAULT false,

  mention_in_app BOOLEAN NOT NULL DEFAULT true,
  mention_email BOOLEAN NOT NULL DEFAULT true,

  system_in_app BOOLEAN NOT NULL DEFAULT true,
  system_email BOOLEAN NOT NULL DEFAULT true,

  -- Digest settings
  email_digest_frequency TEXT NOT NULL DEFAULT 'realtime' CHECK (
    email_digest_frequency IN ('realtime', 'daily', 'weekly', 'never')
  ),

  -- Quiet hours
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  quiet_hours_timezone TEXT DEFAULT 'UTC',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One preference record per user
  UNIQUE(user_id)
);

-- Index
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- ============================================================================
-- Row Level Security Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Notifications: Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Notifications: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Notifications: System can insert notifications for any user
-- (This will be done via service role key in API routes)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Notification Preferences: Users can view their own preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Notification Preferences: Users can update their own preferences
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Notification Preferences: Users can insert their own preferences
CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Auto-create notification preferences for new users
CREATE OR REPLACE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences_for_user();

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications
  SET read = true,
      read_at = NOW()
  WHERE user_id = p_user_id
    AND read = false
    AND deleted_at IS NULL;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id
      AND read = false
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete old notifications
CREATE OR REPLACE FUNCTION delete_old_notifications(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE notifications
  SET deleted_at = NOW()
  WHERE created_at < NOW() - (days_old || ' days')::INTERVAL
    AND deleted_at IS NULL
    AND read = true;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Enable Realtime
-- ============================================================================

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE notifications IS 'Stores all user notifications with support for in-app, email, and push delivery';
COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery and types';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Marks all unread notifications as read for a given user';
COMMENT ON FUNCTION get_unread_notification_count IS 'Returns count of unread notifications for a user';
COMMENT ON FUNCTION delete_old_notifications IS 'Soft deletes read notifications older than specified days';
