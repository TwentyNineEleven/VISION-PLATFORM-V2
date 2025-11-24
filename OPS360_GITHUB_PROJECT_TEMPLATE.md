# Ops360 GitHub Project Template

This document provides the complete structure for tracking Ops360 development in GitHub Projects.

## Project Overview

**Name:** Ops360 Implementation
**Timeline:** 17 weeks
**Team:** 2-3 developers
**Branch:** `feature/ops360-app`

---

## Milestones

### Milestone 1: Phase 0 - Foundation (Weeks 1-2)

**Due Date:** +2 weeks from start
**Description:** Set up Ops360 infrastructure, database schema, and authentication integration.

**Tasks:**

- [ ] **Create database schema**
  - Labels: `database`, `phase-0`
  - Implement all tables from schema SQL file
  - Run migration: `20250124000001_ops360_schema.sql`
  - Verify tables created successfully

- [ ] **Implement RLS policies**
  - Labels: `database`, `security`, `phase-0`
  - Apply RLS policies from `20250124000002_ops360_rls.sql`
  - Test helper functions (`user_is_org_member`, etc.)
  - Verify policies enforce multi-tenant isolation

- [ ] **Seed app_sources table**
  - Labels: `database`, `phase-0`
  - Verify all VISION apps seeded
  - Add display names and icons

- [ ] **Generate TypeScript types**
  - Labels: `typescript`, `phase-0`
  - Run: `npx supabase gen types typescript > apps/shell/src/types/ops360.ts`
  - Verify no type errors
  - Export types from index

- [ ] **Create API route structure**
  - Labels: `api`, `phase-0`
  - Create directory structure: `apps/shell/src/app/api/v1/ops360/`
  - Add empty route files (plans, tasks, projects, etc.)
  - Set up API error handling utilities

- [ ] **Add Ops360 to Vision Impact Hub nav**
  - Labels: `ui`, `phase-0`
  - Register in app launcher
  - Add to global nav config
  - Create route: `apps/shell/src/app/ops360/layout.tsx`

- [ ] **Create Ops360 top navigation component**
  - Labels: `ui`, `phase-0`
  - Build GlowTabs-based top nav
  - Add routes: Dashboard, Tasks, Plans, Projects, Workflows, Calendar
  - Apply 2911 color system

**Acceptance Criteria:**
- ✅ All migrations run successfully
- ✅ RLS smoke tests passing
- ✅ Types generated without errors
- ✅ Ops360 visible in app launcher
- ✅ Top nav renders correctly

---

### Milestone 2: Phase 1 - Task Management (Weeks 3-4)

**Due Date:** +4 weeks from start
**Description:** Implement core task CRUD, assignment, and "My Tasks" view.

**Tasks:**

- [ ] **Task API - Create endpoint**
  - Labels: `api`, `phase-1`
  - `POST /api/v1/ops360/tasks`
  - Request validation (Zod)
  - Create task in database
  - Return created task

- [ ] **Task API - List endpoint**
  - Labels: `api`, `phase-1`
  - `GET /api/v1/ops360/tasks`
  - Query params: status, priority, project, assigned_to_me, due_before
  - Pagination support
  - RLS enforcement

- [ ] **Task API - Detail endpoint**
  - Labels: `api`, `phase-1`
  - `GET /api/v1/ops360/tasks/:id`
  - Include assignments, comments, activity

- [ ] **Task API - Update endpoint**
  - Labels: `api`, `phase-1`
  - `PUT /api/v1/ops360/tasks/:id`
  - Validate permissions
  - Log activity

- [ ] **Task API - Delete endpoint**
  - Labels: `api`, `phase-1`
  - `DELETE /api/v1/ops360/tasks/:id`
  - Soft delete (set deleted_at)

- [ ] **Task API - Assignment endpoint**
  - Labels: `api`, `phase-1`
  - `POST /api/v1/ops360/tasks/:id/assign`
  - Validate assignee is org member
  - Create task_assignment record

- [ ] **Task service layer**
  - Labels: `service`, `phase-1`
  - `apps/shell/src/services/ops360Service.ts`
  - Methods: createTask, getTasks, updateTask, assignTask
  - Error handling

- [ ] **My Tasks page**
  - Labels: `ui`, `phase-1`
  - Route: `/ops360/tasks`
  - Search bar
  - Filters (status, priority, project, source app, due date)
  - Task grouping (Overdue, Today, This Week, Later)
  - Quick actions (complete, view)

- [ ] **Task Detail panel**
  - Labels: `ui`, `phase-1`
  - Right slide-out panel (480px)
  - Status and priority dropdowns
  - Description editor
  - Subtasks list
  - Attachments
  - Comments section
  - Activity log

- [ ] **Dashboard page (basic)**
  - Labels: `ui`, `phase-1`
  - Route: `/ops360/dashboard`
  - My Day section (tasks due today)
  - Active Projects section
  - Recent Activity

**Acceptance Criteria:**
- ✅ All API endpoints tested
- ✅ RLS verified for tasks
- ✅ My Tasks screen renders correctly
- ✅ Task detail panel functional
- ✅ E2E: Create task → View → Assign → Complete

---

### Milestone 3: Phase 2 - Plans & Projects (Weeks 5-6)

**Due Date:** +6 weeks from start
**Description:** Implement plan and project management with sharing.

**Tasks:**

- [ ] **Plans API - CRUD endpoints**
  - Labels: `api`, `phase-2`
  - `GET/POST/PUT/DELETE /api/v1/ops360/plans`
  - Visibility enforcement (USER_PRIVATE, ORG, SHARED)

- [ ] **Plan sharing API**
  - Labels: `api`, `phase-2`
  - `GET /api/v1/ops360/plans/:id/shares`
  - `POST /api/v1/ops360/plans/:id/shares`
  - `DELETE /api/v1/ops360/plans/:id/shares/:share_id`
  - Validate share targets (org or user)

- [ ] **Projects API - CRUD endpoints**
  - Labels: `api`, `phase-2`
  - `GET/POST/PUT/DELETE /api/v1/ops360/projects`
  - Link to parent plan
  - Progress calculation

- [ ] **Milestones API - CRUD endpoints**
  - Labels: `api`, `phase-2`
  - `GET/POST/PUT/DELETE /api/v1/ops360/milestones`
  - Link to parent project

- [ ] **Plans List page**
  - Labels: `ui`, `phase-2`
  - Route: `/ops360/plans`
  - Plan cards with progress bars
  - Visibility indicators (Private, Org, Shared)
  - Status grouping (Active, Draft, Archived)
  - Search and filters

- [ ] **Project Detail page**
  - Labels: `ui`, `phase-2`
  - Route: `/ops360/projects/:id`
  - Breadcrumb to parent plan
  - Milestone checklist
  - Timeline visualization
  - Task list (grouped by milestone)
  - Progress summary

- [ ] **Sharing Modal component**
  - Labels: `ui`, `phase-2`
  - Current shares list
  - Add new share (user or org autocomplete)
  - Access level selector (View, Comment, Edit)
  - Remove share button

**Acceptance Criteria:**
- ✅ Plans RLS policies verified
- ✅ Sharing works (org, user, access levels)
- ✅ Project progress accurate
- ✅ E2E: Create plan → Add project → Add tasks → View progress

---

### Milestone 4: Phase 3 - AI Plan Builder (Weeks 7-9)

**Due Date:** +9 weeks from start
**Description:** Implement AI-powered plan generation.

**Tasks:**

- [ ] **Context API endpoints**
  - Labels: `api`, `integration`, `phase-3`
  - Define `GET /api/v1/{app}/context` spec
  - Implement mock context responses for testing
  - Document context schema

- [ ] **AI Plan Builder Edge Function**
  - Labels: `ai`, `edge-function`, `phase-3`
  - File: `supabase/functions/ai-plan-builder/index.ts`
  - JWT validation
  - Context assembly from VISION apps
  - Anthropic Claude API call
  - Output validation
  - Caching (15 min)

- [ ] **Plan conversion logic**
  - Labels: `ai`, `service`, `phase-3`
  - Function: `convertPlanDraftToDatabase()`
  - Create plan record
  - Create projects (one per workstream)
  - Create milestones
  - Create tasks
  - Handle assignee matching

- [ ] **AI Plan Builder UI - Modal**
  - Labels: `ui`, `ai`, `phase-3`
  - Component: `PlanBuilderModal`
  - Step 1: Goal & Timeframe input
  - Step 2: Context source selection (checkboxes)
  - Step 3: AI generation (loading state, 30s timeout)
  - Step 4: Review & edit draft
  - Convert button

- [ ] **AI validation utilities**
  - Labels: `ai`, `validation`, `phase-3`
  - Schema validation (workstreams, milestones, tasks)
  - Date format validation
  - Hour estimate reasonability checks
  - Warning system for potential issues

- [ ] **AI context caching**
  - Labels: `ai`, `performance`, `phase-3`
  - Cache assembled context (15 min TTL)
  - Deduplicate context requests
  - Clean up expired cache entries

- [ ] **AI task breakdown feature**
  - Labels: `ai`, `phase-3`
  - Edge Function: `ai-task-breakdown`
  - UI: "Break Down" button in task detail
  - Generate 3-7 subtasks
  - Create subtasks automatically

**Acceptance Criteria:**
- ✅ AI generates valid plans (schema conformance)
- ✅ Plan conversion creates correct DB records
- ✅ Context gathering handles failures gracefully
- ✅ E2E: Launch → Enter goal → Generate → Review → Create

---

### Milestone 5: Phase 4 - Cross-App Ingestion (Weeks 10-11)

**Due Date:** +11 weeks from start
**Description:** Implement webhook endpoints and task ingestion.

**Tasks:**

- [ ] **Ingestion webhook endpoint**
  - Labels: `api`, `integration`, `phase-4`
  - `POST /api/v1/ops360/ingest/task`
  - API key validation (`X-Vision-App-Key`)
  - Request body validation
  - Deduplication logic
  - Task creation
  - Logging to `task_ingestion_log`

- [ ] **Deduplication utility**
  - Labels: `integration`, `phase-4`
  - Key: `source_app + source_record_id + organization_id`
  - Idempotent handling
  - Return existing task if duplicate

- [ ] **CapacityIQ integration**
  - Labels: `integration`, `phase-4`
  - Implement webhook sender in CapacityIQ
  - Test assessment → action items flow
  - Verify tasks appear in Ops360

- [ ] **LaunchPath integration**
  - Labels: `integration`, `phase-4`
  - User-initiated export UI
  - Convert 90-day plan to tasks
  - Link back to LaunchPath

- [ ] **FundingFramer integration**
  - Labels: `integration`, `phase-4`
  - Grant awarded trigger
  - Create milestone tasks
  - Share with funder

- [ ] **MetricMap integration**
  - Labels: `integration`, `phase-4`
  - KPI threshold check
  - Auto-generate improvement tasks
  - Link to KPI dashboard

- [ ] **Integrations UI page**
  - Labels: `ui`, `integration`, `phase-4`
  - Route: `/ops360/integrations`
  - Connected Apps list (status, last import)
  - Recent Ingestion Log
  - Error details and retry button

**Acceptance Criteria:**
- ✅ Webhook accepts valid payloads
- ✅ Rejects invalid/unauthorized requests
- ✅ Deduplication prevents duplicates
- ✅ Tasks from CapacityIQ appear in Ops360
- ✅ E2E: Trigger webhook → Task created → View in UI

---

### Milestone 6: Phase 5 - Workflows (Weeks 12-13)

**Due Date:** +13 weeks from start
**Description:** Implement workflow templates and application.

**Tasks:**

- [ ] **Workflows API - CRUD endpoints**
  - Labels: `api`, `phase-5`
  - `GET/POST/PUT/DELETE /api/v1/ops360/workflows`
  - Support workflow_steps (nested)

- [ ] **Workflow application logic**
  - Labels: `service`, `phase-5`
  - `POST /api/v1/ops360/workflows/:id/apply`
  - Create workflow_instance
  - Generate tasks from workflow steps
  - Link to project

- [ ] **Workflow templates seed**
  - Labels: `data`, `phase-5`
  - Seed public templates:
    - Nonprofit Program Launch
    - Grant Management
    - Stakeholder Engagement Campaign
    - Volunteer Onboarding
    - Board Meeting Preparation

- [ ] **Workflows List page**
  - Labels: `ui`, `phase-5`
  - Route: `/ops360/workflows`
  - My Workflows section
  - Public Templates section
  - Workflow preview modal

- [ ] **Workflow Detail modal**
  - Labels: `ui`, `phase-5`
  - View workflow steps
  - Duration and assignee info
  - "Apply to Project" button
  - Copy to My Workflows

**Acceptance Criteria:**
- ✅ Workflows created successfully
- ✅ Applying workflow generates tasks
- ✅ Templates visible to all orgs
- ✅ E2E: Create workflow → Apply → Verify tasks

---

### Milestone 7: Phase 6 - Calendar & Visualization (Week 14)

**Due Date:** +14 weeks from start
**Description:** Implement calendar view and timeline components.

**Tasks:**

- [ ] **Calendar view page**
  - Labels: `ui`, `phase-6`
  - Route: `/ops360/calendar`
  - Day/Week/Month view switcher
  - Display tasks and milestones
  - Color-coded by priority
  - Hover tooltips

- [ ] **Drag-to-reschedule feature**
  - Labels: `ui`, `interaction`, `phase-6`
  - Click and drag tasks to new dates
  - Update due_date via API
  - Visual feedback during drag

- [ ] **Timeline component (Gantt-lite)**
  - Labels: `ui`, `component`, `phase-6`
  - Display on Project Detail page
  - Show milestones and tasks
  - Horizontal timeline bars
  - Today marker

**Acceptance Criteria:**
- ✅ Calendar displays tasks correctly
- ✅ Drag updates due_date
- ✅ Timeline shows project schedule
- ✅ Mobile switches to list view

---

### Milestone 8: Phase 7 - Polish & Performance (Weeks 15-16)

**Due Date:** +16 weeks from start
**Description:** Optimization, mobile responsiveness, accessibility.

**Tasks:**

- [ ] **Performance audit**
  - Labels: `performance`, `phase-7`
  - Dashboard load time optimization (<1s)
  - Task list rendering optimization
  - Query optimization (add indexes if needed)
  - Lazy loading for large lists

- [ ] **Mobile responsive CSS**
  - Labels: `ui`, `responsive`, `phase-7`
  - Test all screens on mobile viewports
  - Collapsible filters
  - Full-screen task detail on mobile
  - Horizontal scroll for top nav

- [ ] **Accessibility audit**
  - Labels: `a11y`, `phase-7`
  - Keyboard navigation (all interactive elements)
  - Screen reader testing
  - ARIA labels
  - Focus indicators
  - Color contrast (WCAG AA)

- [ ] **Error boundaries**
  - Labels: `ui`, `error-handling`, `phase-7`
  - React error boundaries for all routes
  - Graceful fallback UI
  - Error reporting to console

- [ ] **Loading skeletons**
  - Labels: `ui`, `ux`, `phase-7`
  - Task list skeleton
  - Plan list skeleton
  - Dashboard skeleton
  - Project detail skeleton

- [ ] **Empty states**
  - Labels: `ui`, `ux`, `phase-7`
  - No tasks empty state
  - No plans empty state
  - No projects empty state
  - Clear CTAs in each

**Acceptance Criteria:**
- ✅ Lighthouse score >90 (Performance, Accessibility)
- ✅ All screens work on mobile
- ✅ Keyboard navigation functional
- ✅ Screen reader announces correctly

---

### Milestone 9: Phase 8 - MVP Launch (Week 17)

**Due Date:** +17 weeks from start
**Description:** Final testing, documentation, production deployment.

**Tasks:**

- [ ] **Final integration testing**
  - Labels: `testing`, `phase-8`
  - Run full E2E suite on staging
  - Test all user flows
  - Test all integrations
  - Performance testing

- [ ] **RLS verification in production**
  - Labels: `security`, `testing`, `phase-8`
  - Manual audit of RLS policies
  - Test cross-org isolation
  - Test sharing permissions
  - Verify consultant/funder access

- [ ] **User documentation**
  - Labels: `docs`, `phase-8`
  - User guide: Getting Started
  - User guide: AI Plan Builder
  - User guide: Sharing Plans
  - User guide: Cross-App Integrations

- [ ] **API documentation**
  - Labels: `docs`, `phase-8`
  - OpenAPI spec complete
  - Example requests/responses
  - Authentication guide
  - Webhook integration guide

- [ ] **Demo data seeding**
  - Labels: `data`, `phase-8`
  - Seed realistic demo organization
  - Sample plans, projects, tasks
  - Sample workflows
  - Sample integrations

- [ ] **Production deployment**
  - Labels: `deployment`, `phase-8`
  - Deploy to Vercel production
  - Run migrations on production DB
  - Configure environment variables
  - Verify API keys for integrations

- [ ] **Monitoring setup**
  - Labels: `monitoring`, `phase-8`
  - Sentry error tracking
  - PostHog analytics events
  - Log aggregation
  - Performance monitoring dashboard

- [ ] **User training (2911 internal)**
  - Labels: `training`, `phase-8`
  - Demo session for 2911 team
  - Q&A
  - Feedback collection

**Acceptance Criteria:**
- ✅ All tests passing
- ✅ RLS verified in production
- ✅ Documentation complete
- ✅ Deployed to production
- ✅ Monitoring active
- ✅ No critical bugs

---

## Labels

Create these labels in GitHub:

**By Phase:**
- `phase-0` - Foundation
- `phase-1` - Task Management
- `phase-2` - Plans & Projects
- `phase-3` - AI Plan Builder
- `phase-4` - Cross-App Ingestion
- `phase-5` - Workflows
- `phase-6` - Calendar
- `phase-7` - Polish
- `phase-8` - Launch

**By Type:**
- `database` - Database schema/migrations
- `api` - API endpoints
- `service` - Service layer
- `ui` - User interface
- `ai` - AI features
- `integration` - Cross-app integrations
- `testing` - Tests
- `docs` - Documentation
- `security` - Security/RLS
- `performance` - Performance optimization
- `a11y` - Accessibility
- `deployment` - Deployment tasks

**Priority:**
- `priority: critical` - Blocking other work
- `priority: high` - Important but not blocking
- `priority: medium` - Normal priority
- `priority: low` - Nice to have

**Status:**
- `status: blocked` - Blocked by another issue
- `status: in-progress` - Currently being worked on
- `status: needs-review` - PR needs review
- `status: on-hold` - Paused temporarily

---

## Project Board Columns

1. **Backlog** - Not started, future phases
2. **Ready** - Ready to be picked up
3. **In Progress** - Currently being worked on
4. **In Review** - PR submitted, awaiting review
5. **Done** - Merged and deployed

---

## Usage Instructions

### Creating Issues

For each task above:

1. Create a GitHub issue with the task title
2. Copy the task description to the issue body
3. Add appropriate labels (phase, type, priority)
4. Assign to milestone
5. Assign to developer (if known)

### Creating Milestones

For each phase/milestone:

1. Create GitHub milestone
2. Set due date
3. Add description from above
4. Link all phase tasks to milestone

### Tracking Progress

1. Move issues through board columns as work progresses
2. Update issue comments with progress notes
3. Link PRs to issues (use "Closes #123" in PR description)
4. Review milestone progress weekly

---

## Example Issue Template

```markdown
## Description
[Copy task description from above]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Notes
[Add technical notes, design decisions, etc.]

## Related Issues
- Depends on #XXX
- Blocks #YYY

## Testing Plan
[Describe how to test this]
```

---

**END OF GITHUB PROJECT TEMPLATE**
