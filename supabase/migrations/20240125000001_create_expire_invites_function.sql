-- Function to expire old invites
-- This is called by getPendingInvites to clean up expired invitations

CREATE OR REPLACE FUNCTION expire_old_invites()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE organization_invites
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW()
    AND deleted_at IS NULL;
END;
$$;

