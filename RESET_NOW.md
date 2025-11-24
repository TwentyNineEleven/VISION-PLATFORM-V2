# 🗑️ Reset Database Now

**Quick Guide:** Follow these 3 steps to reset your database

---

## Step 1: Open Supabase SQL Editor

Click this link:
👉 **https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/sql/new**

---

## Step 2: Copy and Paste This SQL

```sql
-- Reset Database - Clean out all existing tables
-- Safe to run: Uses IF EXISTS so won't error if tables don't exist

-- Drop all custom tables
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;
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
DROP TABLE IF EXISTS cohorts CASCADE;
DROP TABLE IF EXISTS cohort_members CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS application_reviews CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS member_role CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

-- Drop custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Verify clean state
SELECT 'Database reset complete!' as status;
```

---

## Step 3: Click "Run" or Press Cmd/Ctrl + Enter

You should see:
```
status: "Database reset complete!"
```

✅ **Done! Database is now clean**

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
