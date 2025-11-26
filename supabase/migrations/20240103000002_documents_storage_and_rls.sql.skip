-- ============================================================================
-- Documents Storage Bucket and RLS Policies
-- ============================================================================
-- This migration creates:
-- - Storage bucket for organization documents
-- - Row Level Security policies for all tables
-- - Helper functions for permission checks
-- ============================================================================

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

-- Create the storage bucket for organization documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-documents',
  'organization-documents',
  false, -- Private bucket, RLS controls access
  15728640, -- 15MB in bytes
  NULL -- Allow all file types
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = NULL;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Check if user is member of organization
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = org_id
      AND user_id = is_organization_member.user_id
      AND status = 'active'
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific role in organization
CREATE OR REPLACE FUNCTION has_organization_role(org_id UUID, user_id UUID, required_role TEXT[])
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can view document (ownership or sharing)
CREATE OR REPLACE FUNCTION can_view_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can edit document
CREATE OR REPLACE FUNCTION can_edit_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can delete document
CREATE OR REPLACE FUNCTION can_delete_document(doc_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES - FOLDERS
-- ============================================================================

ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- View: Organization members can view folders
CREATE POLICY "Organization members can view folders"
  ON folders FOR SELECT
  TO authenticated
  USING (
    is_organization_member(organization_id, auth.uid())
    AND deleted_at IS NULL
  );

-- Insert: Organization members can create folders
CREATE POLICY "Organization members can create folders"
  ON folders FOR INSERT
  TO authenticated
  WITH CHECK (
    is_organization_member(organization_id, auth.uid())
  );

-- Update: Owner/Admin/Creator can update folders
CREATE POLICY "Authorized users can update folders"
  ON folders FOR UPDATE
  TO authenticated
  USING (
    (
      has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
      OR created_by = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Delete: Owner/Admin can delete folders
CREATE POLICY "Owner and Admin can delete folders"
  ON folders FOR DELETE
  TO authenticated
  USING (
    has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
  );

-- ============================================================================
-- RLS POLICIES - DOCUMENTS
-- ============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- View: Users can view documents they have access to
CREATE POLICY "Users can view accessible documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    can_view_document(id, auth.uid())
    AND deleted_at IS NULL
  );

-- Insert: Organization members can upload documents
CREATE POLICY "Organization members can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    is_organization_member(organization_id, auth.uid())
  );

-- Update: Users can update documents they can edit
CREATE POLICY "Authorized users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    can_edit_document(id, auth.uid())
    AND deleted_at IS NULL
  );

-- Delete: Owner/Admin can delete documents
CREATE POLICY "Owner and Admin can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (
    can_delete_document(id, auth.uid())
  );

-- ============================================================================
-- RLS POLICIES - DOCUMENT VERSIONS
-- ============================================================================

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- View: Users can view versions of documents they can access
CREATE POLICY "Users can view versions of accessible documents"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM documents
      WHERE id = document_versions.document_id
        AND can_view_document(id, auth.uid())
        AND deleted_at IS NULL
    )
  );

-- Insert: Users can create versions for documents they can edit
CREATE POLICY "Authorized users can create versions"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM documents
      WHERE id = document_versions.document_id
        AND can_edit_document(id, auth.uid())
        AND deleted_at IS NULL
    )
  );

-- Update: No one can update versions (immutable)
-- Delete: Owner/Admin can delete versions
CREATE POLICY "Owner and Admin can delete versions"
  ON document_versions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM documents
      WHERE id = document_versions.document_id
        AND can_delete_document(id, auth.uid())
    )
  );

-- ============================================================================
-- RLS POLICIES - DOCUMENT SHARES
-- ============================================================================

ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- View: Users can view shares for documents/folders they can access
CREATE POLICY "Users can view shares for accessible documents"
  ON document_shares FOR SELECT
  TO authenticated
  USING (
    revoked_at IS NULL
    AND (
      (
        document_id IS NOT NULL
        AND can_view_document(document_id, auth.uid())
      )
      OR (
        folder_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM folders
          WHERE id = document_shares.folder_id
            AND is_organization_member(organization_id, auth.uid())
            AND deleted_at IS NULL
        )
      )
      OR shared_with_user_id = auth.uid()
    )
  );

-- Insert: Users can create shares for documents they can edit
CREATE POLICY "Authorized users can create shares"
  ON document_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      document_id IS NOT NULL
      AND can_edit_document(document_id, auth.uid())
    )
    OR (
      folder_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM folders
        WHERE id = document_shares.folder_id
          AND (
            has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
            OR created_by = auth.uid()
          )
          AND deleted_at IS NULL
      )
    )
  );

-- Update: Share creators can update their shares
CREATE POLICY "Share creators can update shares"
  ON document_shares FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND revoked_at IS NULL
  );

-- Delete: Share creators and Owner/Admin can revoke shares
CREATE POLICY "Authorized users can revoke shares"
  ON document_shares FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR (
      document_id IS NOT NULL
      AND can_delete_document(document_id, auth.uid())
    )
    OR (
      folder_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM folders
        WHERE id = document_shares.folder_id
          AND has_organization_role(organization_id, auth.uid(), ARRAY['Owner', 'Admin'])
      )
    )
  );

-- ============================================================================
-- RLS POLICIES - DOCUMENT ACTIVITY
-- ============================================================================

ALTER TABLE document_activity ENABLE ROW LEVEL SECURITY;

-- View: Organization members can view activity
CREATE POLICY "Organization members can view activity"
  ON document_activity FOR SELECT
  TO authenticated
  USING (
    is_organization_member(organization_id, auth.uid())
  );

-- Insert: System can log activity (via triggers)
CREATE POLICY "System can log activity"
  ON document_activity FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Controlled by triggers

-- No updates or deletes (audit log is immutable)

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- View: Users can view files for documents they have access to
CREATE POLICY "Users can view files for accessible documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'organization-documents'
    AND EXISTS (
      SELECT 1
      FROM documents
      WHERE file_path = storage.objects.name
        AND can_view_document(id, auth.uid())
        AND deleted_at IS NULL
    )
  );

-- Insert: Organization members can upload files
CREATE POLICY "Organization members can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'organization-documents'
    AND (storage.foldername(name))[1] IN (
      SELECT o.id::text
      FROM organizations o
      INNER JOIN organization_members om ON om.organization_id = o.id
      WHERE om.user_id = auth.uid()
        AND om.status = 'active'
        AND om.deleted_at IS NULL
    )
  );

-- Update: Users can update files for documents they can edit
CREATE POLICY "Authorized users can update files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'organization-documents'
    AND EXISTS (
      SELECT 1
      FROM documents
      WHERE file_path = storage.objects.name
        AND can_edit_document(id, auth.uid())
        AND deleted_at IS NULL
    )
  );

-- Delete: Owner/Admin can delete files
CREATE POLICY "Owner and Admin can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'organization-documents'
    AND EXISTS (
      SELECT 1
      FROM documents
      WHERE file_path = storage.objects.name
        AND can_delete_document(id, auth.uid())
    )
  );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on helper functions
GRANT EXECUTE ON FUNCTION is_organization_member TO authenticated;
GRANT EXECUTE ON FUNCTION has_organization_role TO authenticated;
GRANT EXECUTE ON FUNCTION can_view_document TO authenticated;
GRANT EXECUTE ON FUNCTION can_edit_document TO authenticated;
GRANT EXECUTE ON FUNCTION can_delete_document TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_organization_member IS 'Check if user is active member of organization';
COMMENT ON FUNCTION has_organization_role IS 'Check if user has specific role in organization';
COMMENT ON FUNCTION can_view_document IS 'Check if user can view document (via ownership or sharing)';
COMMENT ON FUNCTION can_edit_document IS 'Check if user can edit document';
COMMENT ON FUNCTION can_delete_document IS 'Check if user can delete document (Owner/Admin only)';
