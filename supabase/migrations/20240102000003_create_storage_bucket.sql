-- ============================================================================
-- Storage Bucket and Policies for Organization Logos
-- ============================================================================
-- This migration creates a public storage bucket for organization logos
-- with appropriate RLS policies for secure file management.
--
-- Bucket: organization-logos
-- Access: Public read, Authenticated write (with permissions)
-- Max size: 5MB per file
-- ============================================================================

-- Create the storage bucket for organization logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-logos',
  'organization-logos',
  true, -- Public bucket for reading
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

-- ============================================================================
-- Storage Policies
-- ============================================================================

-- Policy: Anyone can view organization logos (public read)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'organization-logos');

-- Policy: Authenticated users can upload logos to their organization folder
CREATE POLICY "Authenticated users can upload organization logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'organization-logos'
    AND (storage.foldername(name))[1] IN (
      SELECT o.id::text
      FROM organizations o
      INNER JOIN organization_members om ON om.organization_id = o.id
      WHERE om.user_id = auth.uid()
        AND om.role IN ('Owner', 'Admin')
        AND om.status = 'active'
        AND om.deleted_at IS NULL
    )
  );

-- Policy: Organization owners and admins can update logos
CREATE POLICY "Organization owners and admins can update logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'organization-logos'
    AND (storage.foldername(name))[1] IN (
      SELECT o.id::text
      FROM organizations o
      INNER JOIN organization_members om ON om.organization_id = o.id
      WHERE om.user_id = auth.uid()
        AND om.role IN ('Owner', 'Admin')
        AND om.status = 'active'
        AND om.deleted_at IS NULL
    )
  );

-- Policy: Organization owners and admins can delete logos
CREATE POLICY "Organization owners and admins can delete logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'organization-logos'
    AND (storage.foldername(name))[1] IN (
      SELECT o.id::text
      FROM organizations o
      INNER JOIN organization_members om ON om.organization_id = o.id
      WHERE om.user_id = auth.uid()
        AND om.role IN ('Owner', 'Admin')
        AND om.status = 'active'
        AND om.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Comments (inline above each policy for documentation)
-- Note: COMMENT ON POLICY not used as it requires table ownership
-- ============================================================================
