# VisionFlow Setup Guide

## Phase 0 - Foundation Setup

This document outlines the setup steps for VisionFlow development.

### Current Status

✅ Supabase connected and working
✅ Base platform tables exist (organizations, users, documents, folders)
⏳ VisionFlow migrations pending
⏳ VisionFlow types need generation after migration

---

## Step 1: Run VisionFlow Database Migrations

The VisionFlow database schema and RLS policies need to be applied to Supabase.

### Option A: Via Supabase CLI (Recommended)

```bash
# Ensure you're logged in to Supabase
npx supabase login

# Link to your project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Run the migrations
npx supabase db push

# Verify migrations were applied
npx supabase db diff
```

### Option B: Via Supabase Dashboard

1. Go to https://app.supabase.com/project/YOUR_PROJECT/editor
2. Navigate to **SQL Editor**
3. Run the schema migration:
   - Copy contents of `supabase/migrations/20250124000001_visionflow_schema.sql`
   - Paste and execute
4. Run the RLS migration:
   - Copy contents of `supabase/migrations/20250124000002_visionflow_rls.sql`
   - Paste and execute

---

## Step 2: Generate TypeScript Types

After running migrations, regenerate the Supabase types to include VisionFlow tables:

```bash
# Generate types (replace YOUR_PROJECT_ID with your Supabase project ID)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/shell/src/types/supabase.ts

# Or if linked via CLI:
npx supabase gen types typescript --linked > apps/shell/src/types/supabase.ts
```

This will add the following tables to your types:
- `plans`
- `plan_shares`
- `projects`
- `milestones`
- `tasks`
- `task_assignments`
- `task_comments`
- `task_activity`
- `workflows`
- `workflow_steps`
- `workflow_instances`
- `app_sources`
- `task_ingestion_log`
- `ai_context_cache`
- `task_attachments`

---

## Step 3: Verify Migration Success

Run this SQL query in Supabase to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%plan%'
   OR table_name LIKE '%task%'
   OR table_name LIKE '%workflow%'
ORDER BY table_name;
```

Expected tables:
- ai_context_cache
- app_sources
- milestones
- plan_shares
- plans
- projects
- task_activity
- task_assignments
- task_attachments
- task_comments
- task_ingestion_log
- tasks
- workflow_instances
- workflow_steps
- workflows

---

## Step 4: Verify RLS Policies

Run this SQL query to check RLS policies:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('plans', 'tasks', 'projects', 'workflows')
ORDER BY tablename, policyname;
```

You should see policies for SELECT, INSERT, UPDATE, and DELETE on each table.

---

## Step 5: Seed Initial Data (Optional)

The migrations automatically seed the `app_sources` table with VISION app integrations:
- CapacityIQ
- LaunchPath
- FundingFramer
- FundGrid
- MetricMap
- Stakeholdr
- Architex
- PathwayPro
- Community Compass

Verify with:

```sql
SELECT * FROM app_sources;
```

---

## Step 6: Test RLS Policies

Create a test organization and user to verify RLS:

```sql
-- This should be done through the application signup flow
-- But for testing, you can verify policies with:

-- Check if user can only see their own org's plans
SELECT * FROM plans WHERE deleted_at IS NULL;

-- Should return empty if no plans exist yet
```

---

## Troubleshooting

### Migration Fails: "relation already exists"
If tables already exist from a previous migration attempt:
```sql
-- Drop VisionFlow tables (CAUTION: This deletes all data!)
DROP TABLE IF EXISTS task_attachments CASCADE;
DROP TABLE IF EXISTS ai_context_cache CASCADE;
DROP TABLE IF EXISTS task_ingestion_log CASCADE;
DROP TABLE IF EXISTS workflow_instances CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS task_activity CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS plan_shares CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS app_sources CASCADE;
DROP FUNCTION IF EXISTS user_can_edit_plan CASCADE;
DROP FUNCTION IF EXISTS user_can_view_plan CASCADE;
DROP FUNCTION IF EXISTS user_has_role_in_org CASCADE;
DROP FUNCTION IF EXISTS user_is_org_member CASCADE;

-- Then re-run migrations
```

### Type Generation Fails
```bash
# Make sure you're authenticated
npx supabase login

# Check your project ID
npx supabase projects list

# Use the correct project ID
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/shell/src/types/supabase.ts
```

### RLS Blocking Queries
If you're getting permission denied errors:
1. Check you're authenticated: `await supabase.auth.getUser()`
2. Check user membership: Verify user is in an organization
3. Check active_organization_id in user_preferences

---

## Next Steps After Setup

Once migrations are complete:

1. ✅ Start development server: `pnpm dev`
2. ✅ Navigate to VisionFlow in app launcher
3. ✅ Test creating a plan
4. ✅ Test creating tasks
5. ✅ Verify RLS is working (can't see other orgs' data)

---

## Development Workflow

### Adding New VisionFlow Features

1. Create feature branch from `claude/visionflow-architecture-design-016eB4NVbWU9ddi1cNisuDD1`
2. Develop feature
3. Test locally
4. Push and create PR
5. Merge to main when approved

### Schema Changes

If you need to modify the VisionFlow schema:
1. Create a new migration: `npx supabase migration new feature_name`
2. Write SQL for schema changes
3. Test migration locally: `npx supabase db reset` (resets to migrations)
4. Regenerate types: `npx supabase gen types typescript...`
5. Update code to match new schema

---

## Contact & Support

- Implementation Playbook: `VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md`
- GitHub Project Template: `VISIONFLOW_GITHUB_PROJECT_TEMPLATE.md`
- PR Template: `VISIONFLOW_PR_DESCRIPTION.md`

**Ready to build VisionFlow! 🚀**
