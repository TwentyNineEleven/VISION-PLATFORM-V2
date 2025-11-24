# Execute Database Reset

The Supabase CLI doesn't support direct SQL execution on remote databases for security reasons.

## ✅ Use Supabase Dashboard (Recommended - 2 minutes)

### Quick Steps:

1. **Open SQL Editor:**
   👉 https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/sql/new

2. **Copy this SQL:**
   ```sql
   -- Complete Database Reset
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
   END $$;

   -- Clean migration history
   TRUNCATE TABLE supabase_migrations.schema_migrations;

   SELECT '✅ Database completely reset. Ready for Phase 1!' as status;
   ```

3. **Click "Run"** (or press Cmd/Ctrl + Enter)

4. **Verify:**
   - You should see NOTICE messages for each dropped item
   - Final status: "✅ Database completely reset. Ready for Phase 1!"

---

## Why Dashboard Only?

Supabase CLI doesn't allow arbitrary SQL execution for security:
- ❌ `supabase db execute` doesn't exist
- ❌ REST API doesn't expose SQL execution
- ✅ Dashboard SQL Editor is the secure method

---

## After Reset

Once complete, start Phase 1 with Cline using this prompt:

```
Let's begin Phase 1: Foundation & Authentication for VISION Platform V2.

Context:
- Supabase project: https://qhibeqcsixitokxllhom.supabase.co
- Database status: ✅ Clean and ready (just reset)
- Environment: ✅ API keys configured
- MCP: ✅ Enabled

Task: Create Phase 1 migration for users tables following documentation/CLINE_BACKEND_DEVELOPMENT_PROMPT.md
```
