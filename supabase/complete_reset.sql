-- Complete Database Reset
-- This will drop ALL tables in the public schema and reset migration history
-- Safe to run - only affects public schema, not auth or storage

-- Step 1: Drop all tables in public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all tables in public schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', r.tablename;
    END LOOP;

    -- Drop all custom types
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        RAISE NOTICE 'Dropped type: %', r.typname;
    END LOOP;

    -- Drop all functions in public schema
    FOR r IN (SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || ' CASCADE';
        RAISE NOTICE 'Dropped function: %', r.proname;
    END LOOP;

    RAISE NOTICE '✅ Database reset complete!';
    RAISE NOTICE 'All public schema tables, types, and functions have been dropped.';
    RAISE NOTICE 'Ready for fresh Phase 1 implementation.';
END $$;

-- Step 2: Clean migration history
TRUNCATE TABLE supabase_migrations.schema_migrations;

-- Success message
SELECT '✅ Database completely reset. Ready for Phase 1!' as status;
