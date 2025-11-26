# 🗑️ Reset Database Now

**Quick Guide:** Follow these 3 steps to reset your database

---

## Step 1: Open Supabase SQL Editor

Click this link:
👉 **https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/sql/new**

---

## Step 2: Copy and Paste This SQL

**This will drop ALL tables in the public schema and reset migration history:**

```sql
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
```

---

## Step 3: Click "Run" or Press Cmd/Ctrl + Enter

You should see NOTICE messages for each dropped table, then:
```
status: "✅ Database completely reset. Ready for Phase 1!"
```

✅ **Done! Database is now completely clean**

---

## Verify It Worked

### Check Table Editor:
👉 **https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/editor**

You should see:
- ✅ Only Supabase system tables (auth.users, storage.buckets, etc.)
- ✅ No custom "public" schema tables

---

## Next: Start Phase 1

Now that your database is clean, start Phase 1 with Cline:

### Open Cline and use this prompt:

```
Let's begin Phase 1: Foundation & Authentication for VISION Platform V2.

Context:
- Supabase project: https://qhibeqcsixitokxllhom.supabase.co
- Database status: ✅ Clean and ready (just reset)
- Environment: ✅ API keys configured in .env.local
- Implementation guide: documentation/CLINE_BACKEND_DEVELOPMENT_PROMPT.md
- Branch: feature/supabase-backend-integration

Task: Create Phase 1 migration for users tables.

Steps:
1. Create migration file: 20250124000001_create_users_tables.sql
2. Add users table with RLS policies
3. Add user_preferences table with RLS policies
4. Apply migration to Supabase using MCP
5. Generate TypeScript types
6. Verify tables were created correctly

Follow CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 1, Task 1.1 exactly.
Use Supabase MCP to validate each step.
```

---

## Troubleshooting

### "Permission denied"
- Make sure you're logged into Supabase Dashboard
- Try refreshing the page

### "Relation does not exist"
- This is fine! It means the table was already gone
- The script is safe to run even if tables don't exist

### Still see tables after reset
- Refresh the Table Editor page
- Check you ran the SQL in the correct project
- The tables might be in a different schema (should only affect 'public' schema)

---

**Ready?** Open the SQL Editor link above and paste the SQL! 🚀
