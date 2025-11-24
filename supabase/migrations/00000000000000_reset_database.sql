-- Reset Database - Clean out all existing tables
-- This migration removes any existing tables to start fresh with Phase 1

-- Drop all custom tables (if they exist)
-- We're using CASCADE to also drop any dependent objects like foreign keys

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any other tables that might exist
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS apps CASCADE;
DROP TABLE IF EXISTS app_installations CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS search_history CASCADE;

-- Drop any custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;

-- Drop any custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database reset complete. All custom tables dropped.';
  RAISE NOTICE 'Ready for Phase 1 implementation.';
END $$;
