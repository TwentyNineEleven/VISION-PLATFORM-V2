# Database Reset Guide

**Purpose:** Clean out existing tables before starting Phase 1 implementation
**Date:** January 24, 2025
**Status:** Ready to execute

---

## Why Reset?

Starting with a clean database ensures:
- ✅ No conflicting schemas from previous tests
- ✅ Clean migration history
- ✅ Proper RLS policies from the start
- ✅ No orphaned data or relationships

---

## Option 1: Reset via Supabase Dashboard (Recommended)

This is the safest and most straightforward method:

### Step 1: Go to Supabase Dashboard
```
https://supabase.com/dashboard/project/qhibeqcsixitokxllhom
```

### Step 2: Navigate to SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Run Reset Script
Copy and paste this SQL:

```sql
-- Reset Database - Clean out all existing tables
-- This removes any existing tables to start fresh with Phase 1

-- Drop all custom tables (if they exist)
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

-- Drop any custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;

-- Drop any custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### Step 4: Execute
Click **Run** or press `Cmd/Ctrl + Enter`

### Step 5: Verify
1. Click **Table Editor** in left sidebar
2. You should see only Supabase system tables (like `auth.users`, `storage.buckets`)
3. No custom tables should exist

✅ **Database is now clean and ready for Phase 1!**

---

## Option 2: Reset via Supabase CLI

If you prefer command line:

### Prerequisites
You need to be logged in to Supabase CLI:

```bash
# Get your access token from: https://supabase.com/dashboard/account/tokens
# Then set it as environment variable
export SUPABASE_ACCESS_TOKEN=your_access_token_here

# Or login interactively (requires browser)
npx supabase login
```

### Link to Project
```bash
npx supabase link --project-ref qhibeqcsixitokxllhom
```

### Apply Reset Migration
```bash
# Run the reset migration
npx supabase db push --db-url "postgresql://postgres:[YOUR_DB_PASSWORD]@db.qhibeqcsixitokxllhom.supabase.co:5432/postgres"
```

**Note:** You'll need your database password from Supabase Dashboard → Settings → Database

---

## Option 3: Using Cline with MCP (Easiest)

Since you have Supabase MCP configured in Cline, you can ask Cline to reset the database:

### Step 1: Open Cline in Cursor

### Step 2: Use this prompt:
```
Reset my Supabase database to prepare for Phase 1 implementation.

Project: https://qhibeqcsixitokxllhom.supabase.co

Task:
1. Drop all existing custom tables (users, organizations, notifications, etc.)
2. Drop all custom types and functions
3. Verify database is clean (only Supabase system tables remain)
4. Confirm database is ready for Phase 1 migration

Use Supabase MCP to execute this safely.
```

### Step 3: Review and Approve
Cline will:
1. Use MCP to check current database schema
2. Generate the DROP statements
3. Ask for your approval
4. Execute the reset
5. Verify the database is clean

✅ **Database reset complete!**

---

## What Gets Removed

### Tables
- users
- user_preferences
- organizations
- organization_members
- teams
- team_members
- notifications
- files
- folders
- apps
- app_installations
- activities
- tasks
- comments
- tags
- bookmarks
- search_history

### Custom Types
- user_role
- notification_type
- priority_level
- task_status

### Custom Functions
- update_updated_at_column()

### What Stays (Supabase System Tables)
- ✅ auth.users
- ✅ auth.sessions
- ✅ storage.buckets
- ✅ storage.objects
- ✅ All other Supabase system tables

---

## After Reset: Next Steps

Once the database is clean:

### 1. Verify Clean State
```bash
# Using Supabase Dashboard
# Go to Table Editor → Should see only system tables
```

### 2. Start Phase 1 Implementation

Open Cline and use this prompt:

```
Let's begin Phase 1: Foundation & Authentication for VISION Platform V2.

Context:
- Supabase project: https://qhibeqcsixitokxllhom.supabase.co
- Database is clean and ready ✅
- Implementation guide: documentation/CLINE_BACKEND_DEVELOPMENT_PROMPT.md
- Branch: feature/supabase-backend-integration

Task: Start with Phase 1, Task 1.1 - Create users tables migration.

Follow the guide in CLINE_BACKEND_DEVELOPMENT_PROMPT.md exactly.
Use Supabase MCP to apply and verify the migration.
```

### 3. Phase 1 Creates:
- ✅ users table with RLS
- ✅ user_preferences table with RLS
- ✅ Authentication helper functions
- ✅ TypeScript types generated

---

## Troubleshooting

### Error: "permission denied to drop table"
**Solution:** Make sure you're using the service_role key or database password

### Error: "relation does not exist"
**Solution:** Table already dropped - this is fine, continue

### Error: "cannot drop type because other objects depend on it"
**Solution:** Use CASCADE in the DROP statement (already included in script)

### Verify Reset Worked
Run this query in SQL Editor:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Should return empty or only Supabase system tables.

---

## Safety Notes

⚠️ **Important:**
- This reset script uses `IF EXISTS` so it's safe to run multiple times
- Uses `CASCADE` to drop dependent objects automatically
- Only drops custom tables, not Supabase system tables
- No data is lost from Supabase Auth or Storage systems

✅ **Safe to execute:** Yes, this only affects custom application tables

---

## Summary

**Recommended Method:** Use Cline with MCP (easiest and safest)

**Alternative:** Run SQL script directly in Supabase Dashboard

**Result:** Clean database ready for Phase 1 implementation

**Next Action:** Start Phase 1 with Cline using the prompt above

---

**Document Version:** 1.0
**Created:** January 24, 2025
**Status:** Ready to execute
**Impact:** Removes all custom tables, keeps Supabase system tables
