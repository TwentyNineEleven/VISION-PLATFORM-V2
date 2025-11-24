-- ============================================================================
-- Documents Management System - Core Tables
-- ============================================================================
-- This migration creates the complete document management system with:
-- - Hierarchical folder structure
-- - Document storage with versioning
-- - Sharing and permissions
-- - Activity tracking for notifications
-- - AI-ready fields (optional, nullable)
-- ============================================================================

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

-- Enable pgvector for future semantic search (optional)
-- Note: This requires pgvector extension to be available in your Supabase project
-- CREATE EXTENSION IF NOT EXISTS vector; -- DISABLED: vector extension not available in project

-- ============================================================================
-- FOLDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  
  -- Folder info
  name TEXT NOT NULL,
  description TEXT,
  color TEXT, -- Hex color for UI
  icon TEXT, -- Icon identifier
  
  -- Materialized path for efficient hierarchy queries
  -- Format: /parent-id/child-id/grandchild-id/
  path TEXT,
  depth INTEGER DEFAULT 0,
  
  -- Metadata
  is_system BOOLEAN DEFAULT false, -- System folders (e.g., "Shared with me")
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT unique_folder_name_per_parent 
    UNIQUE (organization_id, parent_folder_id, name, deleted_at),
  CONSTRAINT folder_name_not_empty 
    CHECK (length(trim(name)) > 0)
);

-- Indexes for folders
CREATE INDEX IF NOT EXISTS idx_folders_organization 
  ON folders(organization_id) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_folders_parent 
  ON folders(parent_folder_id) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_folders_path 
  ON folders USING gin(string_to_array(path, '/'));
  
CREATE INDEX IF NOT EXISTS idx_folders_created_by 
  ON folders(created_by) WHERE deleted_at IS NULL;

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  -- Document info
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Storage path
  file_size BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 15728640), -- 15MB max
  mime_type TEXT NOT NULL,
  extension TEXT,
  
  -- Versioning
  version_number INTEGER DEFAULT 1 CHECK (version_number > 0),
  current_version_id UUID, -- FK to document_versions (added after table creation)
  
  -- Organization & discovery
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Text extraction (always performed, no AI needed)
  extracted_text TEXT,
  extracted_text_length INTEGER,
  text_extracted_at TIMESTAMPTZ,
  
  -- AI fields (optional, only populated if AI is enabled)
  ai_summary TEXT,
  ai_keywords TEXT[],
  ai_topics TEXT[],
  ai_entities JSONB, -- { people: [], organizations: [], dates: [], locations: [] }
  ai_sentiment TEXT, -- positive, negative, neutral
  ai_language TEXT, -- ISO 639-1 code (en, es, fr, etc.)
  ai_metadata JSONB DEFAULT '{}'::jsonb, -- Provider-specific data
  -- content_embeddings VECTOR(1536), -- For semantic search (if AI enabled) - DISABLED: vector extension not available
  
  -- AI processing status
  ai_provider TEXT, -- openai, anthropic, local, none
  ai_enabled BOOLEAN DEFAULT false,
  ai_processing_status TEXT CHECK (ai_processing_status IN ('pending', 'processing', 'completed', 'failed', 'disabled')),
  ai_processed_at TIMESTAMPTZ,
  ai_error TEXT,
  
  -- Access tracking
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  last_downloaded_at TIMESTAMPTZ,
  
  -- Audit fields
  uploaded_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT document_name_not_empty 
    CHECK (length(trim(name)) > 0)
);

-- Indexes for documents
CREATE INDEX IF NOT EXISTS idx_documents_organization 
  ON documents(organization_id) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_documents_folder 
  ON documents(folder_id) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by 
  ON documents(uploaded_by) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_documents_created_at 
  ON documents(created_at DESC) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_documents_mime_type 
  ON documents(mime_type) WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_documents_tags 
  ON documents USING gin(tags);

-- Full-text search index on extracted text
CREATE INDEX IF NOT EXISTS idx_documents_text_search 
  ON documents USING gin(to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(extracted_text, '')
  )) WHERE deleted_at IS NULL;

-- Vector similarity index (only used if AI is enabled)
-- CREATE INDEX IF NOT EXISTS idx_documents_embeddings
--   ON documents USING ivfflat (content_embeddings vector_cosine_ops)
--   WHERE deleted_at IS NULL AND content_embeddings IS NOT NULL;
-- DISABLED: vector extension not available in project

-- ============================================================================
-- DOCUMENT VERSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  
  -- Version info
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  
  -- Change tracking
  change_notes TEXT,
  changes_summary JSONB, -- What changed from previous version
  
  -- Version metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_version_per_document 
    UNIQUE (document_id, version_number)
);

-- Indexes for versions
CREATE INDEX IF NOT EXISTS idx_document_versions_document 
  ON document_versions(document_id);
  
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at 
  ON document_versions(created_at DESC);

-- ============================================================================
-- DOCUMENT SHARES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Share target (document or folder)
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  
  -- Share recipient (user or role)
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_role TEXT, -- Alternative: 'Owner', 'Admin', 'Member', 'Viewer'
  
  -- Permission level
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit', 'admin')),
  
  -- Share options
  expires_at TIMESTAMPTZ,
  allow_download BOOLEAN DEFAULT true,
  allow_reshare BOOLEAN DEFAULT false,
  require_password BOOLEAN DEFAULT false,
  password_hash TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT share_target_check CHECK (
    (document_id IS NOT NULL AND folder_id IS NULL) OR
    (document_id IS NULL AND folder_id IS NOT NULL)
  ),
  CONSTRAINT share_recipient_check CHECK (
    (shared_with_user_id IS NOT NULL AND shared_with_role IS NULL) OR
    (shared_with_user_id IS NULL AND shared_with_role IS NOT NULL)
  ),
  CONSTRAINT unique_share_per_target_recipient UNIQUE (
    document_id, folder_id, shared_with_user_id, shared_with_role
  )
);

-- Indexes for shares
CREATE INDEX IF NOT EXISTS idx_document_shares_document 
  ON document_shares(document_id) WHERE revoked_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_document_shares_folder 
  ON document_shares(folder_id) WHERE revoked_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_document_shares_user 
  ON document_shares(shared_with_user_id) WHERE revoked_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_document_shares_expires 
  ON document_shares(expires_at) WHERE revoked_at IS NULL AND expires_at IS NOT NULL;

-- ============================================================================
-- DOCUMENT ACTIVITY TABLE (for notifications)
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Activity target
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  version_id UUID REFERENCES document_versions(id) ON DELETE SET NULL,
  
  -- Activity details
  action TEXT NOT NULL CHECK (action IN (
    'created', 'updated', 'deleted', 'restored',
    'uploaded', 'downloaded', 'viewed',
    'shared', 'unshared', 'permission_changed',
    'moved', 'renamed', 'tagged',
    'version_created', 'version_restored',
    'commented', 'mentioned',
    'ai_processed', 'ai_failed'
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
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT activity_target_check CHECK (
    document_id IS NOT NULL OR folder_id IS NOT NULL
  )
);

-- Indexes for activity
CREATE INDEX IF NOT EXISTS idx_document_activity_organization 
  ON document_activity(organization_id);
  
CREATE INDEX IF NOT EXISTS idx_document_activity_document 
  ON document_activity(document_id);
  
CREATE INDEX IF NOT EXISTS idx_document_activity_folder 
  ON document_activity(folder_id);
  
CREATE INDEX IF NOT EXISTS idx_document_activity_actor 
  ON document_activity(actor_id);
  
CREATE INDEX IF NOT EXISTS idx_document_activity_created_at 
  ON document_activity(created_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_document_activity_action 
  ON document_activity(action);

-- ============================================================================
-- ADD FOREIGN KEY FOR CURRENT VERSION
-- ============================================================================

ALTER TABLE documents 
  ADD CONSTRAINT fk_documents_current_version 
  FOREIGN KEY (current_version_id) 
  REFERENCES document_versions(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_shares_updated_at
  BEFORE UPDATE ON document_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update folder path on insert/update
CREATE OR REPLACE FUNCTION update_folder_path()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folder_path_trigger
  BEFORE INSERT OR UPDATE OF parent_folder_id ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_folder_path();

-- Track version count and enforce 3-version limit
CREATE OR REPLACE FUNCTION manage_document_versions()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_versions_trigger
  BEFORE INSERT ON document_versions
  FOR EACH ROW
  EXECUTE FUNCTION manage_document_versions();

-- Log activity on document changes
CREATE OR REPLACE FUNCTION log_document_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_document_activity_trigger
  AFTER INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION log_document_activity();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE folders IS 'Hierarchical folder structure for organizing documents';
COMMENT ON TABLE documents IS 'Core documents table with AI-ready optional fields';
COMMENT ON TABLE document_versions IS 'Version history for documents (max 3 versions kept)';
COMMENT ON TABLE document_shares IS 'Sharing permissions for documents and folders';
COMMENT ON TABLE document_activity IS 'Activity log for notifications and audit trail';

COMMENT ON COLUMN documents.file_size IS 'File size in bytes (max 15MB = 15728640 bytes)';
COMMENT ON COLUMN documents.extracted_text IS 'Extracted text content (no AI required)';
COMMENT ON COLUMN documents.ai_summary IS 'AI-generated summary (optional, requires AI provider)';
-- COMMENT ON COLUMN documents.content_embeddings IS 'Vector embeddings for semantic search (optional)'; -- DISABLED: vector extension not available
COMMENT ON COLUMN documents.ai_provider IS 'AI provider used: openai, anthropic, local, or none';
