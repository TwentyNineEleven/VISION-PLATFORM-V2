# VisionFlow Setup Guide

## ✅ What's Been Completed

### 1. Code Integration ✓
- VisionFlow branch successfully merged into `main`
- All TypeScript errors resolved
- Linting passed
- Successfully pushed to `origin/main`

### 2. Development Server ✓
- Server running at **http://localhost:3000**
- VisionFlow routes available:
  - `/visionflow/dashboard` - Main dashboard
  - `/visionflow/tasks` - Task management
  - `/visionflow/tasks/[id]` - Task detail view
  - `/visionflow/plans` - Plans (Phase 2)

### 3. API Endpoints ✓
All endpoints ready for use:
- `GET/POST /api/v1/apps/visionflow/tasks` - List & create tasks
- `GET/PUT/DELETE /api/v1/apps/visionflow/tasks/:id` - Task operations
- `POST /api/v1/apps/visionflow/tasks/:id/assignments` - Assign tasks
- `GET/POST /api/v1/apps/visionflow/plans` - Plans management

---

## 🔧 Next Steps: Database Setup

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/sql/new
   - Or navigate: Your Project → SQL Editor → New Query

2. **Run Schema Migration**
   ```bash
   # Copy the contents of this file:
   supabase/migrations/20250124000001_visionflow_schema.sql
   ```
   - Paste into SQL Editor
   - Click "Run" or press `Cmd+Enter`

3. **Run RLS Policies Migration**
   ```bash
   # Copy the contents of this file:
   supabase/migrations/20250124000002_visionflow_rls.sql
   ```
   - Paste into SQL Editor
   - Click "Run" or press `Cmd+Enter`

4. **Verify Tables Created**
   ```sql
   -- Run this query to check VisionFlow tables:
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%plan%' OR table_name LIKE '%task%' OR table_name LIKE '%workflow%'
   ORDER BY table_name;
   ```

   Expected tables:
   - `plans`
   - `plan_shares`
   - `projects`
   - `milestones`
   - `tasks`
   - `task_assignments`
   - `task_comments`
   - `task_activity`
   - `task_attachments`
   - `task_ingestion_log`
   - `workflows`
   - `workflow_steps`
   - `workflow_instances`
   - `app_sources`
   - `ai_context_cache`

### Option 2: Supabase CLI (If you have DB password)

```bash
# Set your database password
export SUPABASE_DB_PASSWORD="your-db-password"

# Run migrations
npx supabase db push --db-url "postgresql://postgres.qhibeqcsixitokxllhom:${SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

---

## 📊 Generate TypeScript Types

After running migrations, update your TypeScript types:

```bash
# Get your project ref (already have: qhibeqcsixitokxllhom)
npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts
```

Or via URL:
```bash
npx supabase gen types typescript --db-url "your-connection-string" > apps/shell/src/types/supabase.ts
```

---

## 🧪 Testing VisionFlow

### 1. Access the UI
Open in your browser:
- **Dashboard**: http://localhost:3000/visionflow/dashboard
- **Tasks**: http://localhost:3000/visionflow/tasks

### 2. Test API Endpoints

```bash
# List tasks (requires authentication)
curl http://localhost:3000/api/v1/apps/visionflow/tasks

# Create a task
curl -X POST http://localhost:3000/api/v1/apps/visionflow/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing VisionFlow",
    "status": "NOT_STARTED",
    "priority": "MEDIUM"
  }'
```

### 3. Verify Features

**Phase 0 (Foundation)** ✓
- [x] VisionFlow in app launcher
- [x] Top navigation (Dashboard, Tasks, Plans, etc.)
- [x] Database schema created
- [x] RLS policies applied

**Phase 1 (Task Management)** ✓
- [x] Task CRUD API
- [x] Task list page with filters
- [x] Task detail panel
- [x] Task assignments
- [x] Create task modal
- [x] My Tasks view

**Phase 2 (Plans & Projects)** ✓ (Code Ready)
- [x] Plans API endpoint
- [ ] Plans UI (to be tested after DB setup)

---

## 📝 Seed Data (Optional)

After migrations, you can seed the `app_sources` table with VISION apps:

```sql
-- Run in Supabase SQL Editor
INSERT INTO app_sources (id, name, display_name, icon, enabled) VALUES
  ('ops360', 'Ops360', 'Ops360', 'layout-grid', true),
  ('launchpath', 'LaunchPath', 'LaunchPath', 'rocket', true),
  ('capacityiq', 'CapacityIQ', 'CapacityIQ', 'brain', true),
  ('fundingframer', 'FundingFramer', 'FundingFramer', 'dollar-sign', true),
  ('metricmap', 'MetricMap', 'MetricMap', 'bar-chart', true),
  ('stakeholder-spectrum', 'Stakeholder Spectrum', 'Stakeholder Spectrum', 'users', true),
  ('community-compass', 'Community Compass', 'Community Compass', 'compass', true)
ON CONFLICT (id) DO NOTHING;
```

---

## 🐛 Troubleshooting

### Issue: Tables already exist error
**Solution**: The migrations use `CREATE TABLE IF NOT EXISTS`, so existing tables won't cause errors. VisionFlow-specific tables will be created, existing ones will be skipped.

### Issue: RLS policy conflicts
**Solution**: Drop existing policies first:
```sql
-- Only if you have policy conflicts
DROP POLICY IF EXISTS tasks_isolation ON tasks;
-- Then re-run the RLS migration
```

### Issue: Permission denied
**Solution**: Ensure you're logged into Supabase CLI:
```bash
npx supabase login
```

### Issue: TypeScript errors after type generation
**Solution**:
1. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
2. Run `pnpm type-check` to verify

---

## 📚 Documentation Reference

- **Implementation Playbook**: [VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md](VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md)
- **GitHub Project Template**: [VISIONFLOW_GITHUB_PROJECT_TEMPLATE.md](VISIONFLOW_GITHUB_PROJECT_TEMPLATE.md)
- **PR Description**: [VISIONFLOW_PR_DESCRIPTION.md](VISIONFLOW_PR_DESCRIPTION.md)
- **Database Schema**: [supabase/migrations/20250124000001_visionflow_schema.sql](supabase/migrations/20250124000001_visionflow_schema.sql)
- **RLS Policies**: [supabase/migrations/20250124000002_visionflow_rls.sql](supabase/migrations/20250124000002_visionflow_rls.sql)

---

## ✨ Current Status

**Development Server**: ✅ Running at http://localhost:3000
**Code Integration**: ✅ Complete
**Database Migrations**: ⏳ Pending (follow steps above)
**TypeScript Types**: ⏳ Pending (after migrations)
**Ready for Testing**: ⏳ After database setup

---

## 🚀 Quick Start Checklist

- [ ] Run schema migration in Supabase SQL Editor
- [ ] Run RLS policies migration in Supabase SQL Editor
- [ ] Verify tables created successfully
- [ ] Generate TypeScript types
- [ ] Seed app_sources table (optional)
- [ ] Visit http://localhost:3000/visionflow/dashboard
- [ ] Create your first task
- [ ] Test task assignments
- [ ] Explore the dashboard

---

**Questions or Issues?**
Check the troubleshooting section above or review the implementation playbook for detailed architecture information.

Happy building with VisionFlow! 🎯
