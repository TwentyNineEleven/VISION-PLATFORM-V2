# 📘 OPS360 IMPLEMENTATION PLAYBOOK

**VISION Platform · TwentyNine Eleven Impact Partners, LLC**
**Version 1.0 — Production Ready**

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Section A — System Context & North Star](#section-a--system-context--north-star)
- [Section B — Full Technical Architecture](#section-b--full-technical-architecture)
- [Section C — AI Architecture & Plan Builder](#section-c--ai-architecture--plan-builder)
- [Section D — UI/UX Specification](#section-d--uiux-specification-glowui--2911-bold-color-system)
- [Section E — Cross-App Integration Architecture](#section-e--cross-app-integration-architecture)
- [Section F — Testing Strategy](#section-f--testing-strategy)
- [Section G — Development Roadmap & Git Strategy](#section-g--development-roadmap--git-strategy)
- [Section H — Research-Based Comparisons](#section-h--research-based-comparisons--best-practices)
- [Implementation Guide](#implementation-guide)

---

# Executive Summary

This **Ops360 Implementation Playbook** serves as the complete architectural, technical, and strategic blueprint for building Ops360, the central execution engine of the VISION Platform.

## Document Purpose

**Intended Audience:**
- Development team implementing Ops360
- Product managers overseeing rollout
- 2911 leadership evaluating scope and timeline
- Future contributors to the VISION Platform ecosystem

## What This Playbook Contains

| Section | Key Deliverables |
|---------|------------------|
| **A. System Context & North Star** | Vision, purpose, target users, success metrics |
| **B. Full Technical Architecture** | Complete SQL schema, RLS policies, API contracts, ERD |
| **C. AI Architecture** | AI Plan Builder design, prompt engineering, Edge Functions |
| **D. UI/UX Specification** | 10+ screen specifications with GlowUI + 2911 color system |
| **E. Cross-App Integration** | Webhook specs, ingestion logic, app-specific integrations |
| **F. Testing Strategy** | Unit, integration, RLS, AI validation, E2E tests |
| **G. Development Roadmap** | 8-phase implementation plan, git branching strategy, 17-week timeline |
| **H. Research-Based Comparisons** | Analysis of Notion AI, Linear, Motion, ClickUp, Asana; best practices |

---

# SECTION A — SYSTEM CONTEXT & NORTH STAR

## A.1 Vision & Purpose

Ops360 is the **central execution engine** of the VISION Platform, serving as the operational backbone that transforms strategic insights into actionable reality.

### The Challenge

Mission-driven organizations across the nonprofit, social enterprise, and impact sectors face a critical gap:
- They have brilliant strategies (from PathwayPro, Stakeholdr, Community Compass)
- They have data and metrics (from MetricMap, CapacityIQ)
- They have funding plans (from FundGrid, FundingFramer)
- They have architectural designs (from Architex, LaunchPath)

**But they struggle to EXECUTE.**

### The Ops360 Solution

Ops360 closes the execution gap by:

1. **Centralizing Action** — All tasks from every VISION app flow into one unified workspace
2. **AI-Powered Planning** — "Help me build a plan" converts context into executable roadmaps
3. **Collaborative Execution** — Staff, consultants, and funders work together in shared plans
4. **Workflow Automation** — Reusable templates for common processes
5. **Real-Time Visibility** — Leadership sees what's happening, what's blocked, what's at risk

### North Star Principles

| Principle | Implementation |
|-----------|----------------|
| **Execution-First** | Every feature must directly support getting work done |
| **Context-Aware** | AI reads from ALL VISION apps to generate relevant plans |
| **Collaboration-Native** | Multi-role, multi-org sharing built into the core |
| **Nonprofit-Optimized** | Designed for capacity constraints, not enterprise overhead |
| **Mission-Aligned** | Built on TEIF (Transformative Exile Impact Framework) values |

## A.2 Position Within VISION Platform

### The VISION Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│         VISION IMPACT HUB (Authentication & Shell)          │
│  Global Header | Global Left Nav | App Launcher | Profile   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   STRATEGY LAYER      EXECUTION LAYER       INSIGHT LAYER
        │                     │                     │
┌───────────────┐    ┌────────────────┐    ┌──────────────┐
│ PathwayPro    │───▶│   OPS360       │◀───│ MetricMap    │
│ Stakeholdr    │───▶│  (Execution    │◀───│ CapacityIQ   │
│ FundingFramer │───▶│   Engine)      │◀───│ Analytics    │
│ Architex      │───▶│                │◀───│ Reporting    │
└───────────────┘    └────────────────┘    └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   TASK OUTPUT     │
                    │  (to all apps)    │
                    └───────────────────┘
```

### Ops360's Role

- **Receives**: Strategic plans, logic models, KPIs, capacity gaps, budgets, stakeholder maps
- **Processes**: AI Plan Builder converts context → executable plans
- **Executes**: Projects, tasks, workflows, milestones
- **Returns**: Progress updates, completion data, performance metrics

## A.3 Relationship to TEIF Framework

The Transformative Exile Impact Framework (TEIF) underpins all VISION applications.

Ops360 operationalizes TEIF by:

| TEIF Pillar | Ops360 Implementation |
|-------------|----------------------|
| **Equity** | Multi-role collaboration (staff + consultants + funders) ensures diverse voices in execution |
| **Community-Centered** | Tasks can originate from stakeholder engagement (Stakeholdr) and community needs |
| **Data-Informed** | AI uses MetricMap KPIs and CapacityIQ assessments to generate relevant plans |
| **Sustainable** | Workflows reduce repetitive planning; reusable templates build organizational memory |
| **Accountable** | Full audit trail, role-based access, funder visibility into execution |

## A.4 Target Users & Personas

### Primary Users

#### 1. Organization Staff (ORG_STAFF)
- **Example**: Program Director at a refugee resettlement org
- **Needs**:
  - Daily task list
  - Project timelines
  - Collaboration with consultants
  - AI to break down complex initiatives
- **Pain Points**:
  - Overwhelmed by email-based task management
  - Lost context when switching between apps
  - No clear execution roadmap after strategic planning

#### 2. Consultants (CONSULTANT)
- **Example**: Capacity-building coach working with 5 nonprofits
- **Needs**:
  - Cross-org dashboard
  - Ability to create plans for client orgs
  - Assign tasks to org staff
  - Track progress without daily check-ins
- **Pain Points**:
  - Managing multiple org contexts
  - No unified view of all client work
  - Manual plan creation takes hours

#### 3. Funders (FUNDER)
- **Example**: Program officer at a community foundation
- **Needs**:
  - View grantee execution plans
  - Track grant-funded milestones
  - Provide feedback without micromanaging
  - Trigger tasks when milestones are at risk
- **Pain Points**:
  - Limited visibility into grantee operations
  - Quarterly reports don't show real-time status
  - Can't support grantees proactively

#### 4. 2911 Admin (ADMIN)
- **Example**: Platform operations team member
- **Needs**:
  - Full system visibility
  - Troubleshooting access
  - Usage analytics
- **Pain Points**:
  - Balancing support needs with data privacy

## A.5 Success Metrics

Ops360 will be considered successful when:

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Task Completion Rate** | >75% of tasks marked complete within 7 days of due date | Execution actually happens |
| **Plan Generation Time** | <5 minutes from "Help me build a plan" to executable tasks | AI reduces planning overhead |
| **Cross-App Task Ingestion** | >80% of tasks auto-imported from other apps | Centralization works |
| **User Adoption** | >60% of active VISION users engage with Ops360 weekly | Stickiness |
| **Consultant Efficiency** | Consultants report 40% reduction in planning time | Value for multi-org users |
| **Funder Visibility** | Funders access grantee plans 2x per month on average | Accountability works |

---

# SECTION B — FULL TECHNICAL ARCHITECTURE

## B.1 Architecture Overview

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 + React 19 + TypeScript 5.6 | App Router, Server Components, Type Safety |
| **UI Framework** | GlowUI + Tailwind CSS 3.4 | Design system compliance |
| **Backend** | Supabase (Postgres 15) | Database, Auth, RLS, Storage |
| **Authentication** | Vision Impact Hub + Supabase Auth | JWT validation, session management |
| **API Layer** | Next.js API Routes + Supabase Edge Functions | REST endpoints, AI orchestration |
| **Real-time** | Supabase Realtime | Live task updates, collaboration |
| **AI** | Anthropic Claude (Sonnet 4.5) via Edge Functions | Plan generation, task breakdown |
| **Storage** | Supabase Storage | Task attachments, documents |

### Architecture Principles

1. **Multi-Tenancy First** — Every query filtered by `organization_id`
2. **RLS Enforcement** — Database-level security, not application-level
3. **API-First** — All operations via documented endpoints
4. **Event-Driven** — Cross-app ingestion via webhooks
5. **Stateless** — JWT-based auth, no server-side sessions

## B.2 Database Schema (Supabase SQL)

See `supabase/migrations/YYYYMMDDHHMMSS_ops360_schema.sql` for the complete implementation.

### Core Tables Overview

- **organizations** — Organization details
- **memberships** — User ↔ Organization ↔ Role mapping
- **plans** — High-level strategic containers
- **plan_shares** — Sharing relationships
- **projects** — Structured units within plans
- **milestones** — Major checkpoints
- **tasks** — Atomic units of work
- **task_assignments** — User ↔ Task assignments
- **task_comments** — Collaborative discussion
- **task_activity** — Audit log
- **workflows** — Reusable process templates
- **workflow_steps** — Steps within workflows
- **workflow_instances** — Applied workflows
- **app_sources** — Connected VISION apps
- **task_ingestion_log** — Cross-app import tracking
- **ai_context_cache** — Cached AI context
- **task_attachments** — File uploads

## B.3 Row Level Security (RLS) Policies

See `supabase/migrations/YYYYMMDDHHMMSS_ops360_rls.sql` for complete RLS implementation.

### RLS Philosophy

1. **Defense in Depth** — RLS is the primary security boundary
2. **Deny by Default** — All tables have RLS enabled, no implicit access
3. **Explicit Grants** — Policies explicitly grant access based on JWT claims
4. **Auditability** — All policies are documented and version-controlled

### Key Helper Functions

- `user_is_org_member(org_id UUID)` — Check membership
- `user_has_role_in_org(org_id UUID, required_role TEXT)` — Role verification
- `user_can_view_plan(plan_id UUID)` — Plan access check
- `user_can_edit_plan(plan_id UUID)` — Plan edit permission

## B.4 API Architecture

### Base URL Structure

```
https://app.visionplatform.com/api/v1/ops360/...
```

### Core API Endpoints

**Plans:**
- `GET /api/v1/ops360/plans` — List accessible plans
- `POST /api/v1/ops360/plans` — Create plan
- `GET /api/v1/ops360/plans/:id` — Get plan details
- `PUT /api/v1/ops360/plans/:id` — Update plan
- `DELETE /api/v1/ops360/plans/:id` — Delete plan

**Plan Sharing:**
- `GET /api/v1/ops360/plans/:id/shares` — List shares
- `POST /api/v1/ops360/plans/:id/shares` — Create share
- `DELETE /api/v1/ops360/plans/:id/shares/:share_id` — Revoke share

**Tasks:**
- `GET /api/v1/ops360/tasks` — List tasks
- `POST /api/v1/ops360/tasks` — Create task
- `GET /api/v1/ops360/tasks/:id` — Get task details
- `PUT /api/v1/ops360/tasks/:id` — Update task
- `DELETE /api/v1/ops360/tasks/:id` — Delete task
- `POST /api/v1/ops360/tasks/:id/assign` — Assign task
- `POST /api/v1/ops360/tasks/:id/comments` — Add comment

**AI Plan Builder:**
- `POST /api/v1/ops360/ai/plan-builder` — Generate plan
- `POST /api/v1/ops360/ai/plan-builder/convert` — Convert draft to plan
- `POST /api/v1/ops360/ai/task-breakdown` — Break task into subtasks

**Cross-App Ingestion:**
- `POST /api/v1/ops360/ingest/task` — Webhook for task ingestion
- `GET /api/v1/ops360/ingest/logs` — View ingestion logs

---

# SECTION C — AI ARCHITECTURE & PLAN BUILDER

## C.1 AI Vision

The **Universal AI Plan Builder** is the core innovation of Ops360 and the VISION Platform.

### Guiding Principle

> **"Every app should let users say: 'Help me build a plan.'"**

When invoked, the AI must:
1. Understand the current organizational context
2. Read relevant data from ALL VISION apps
3. Generate a structured, executable plan
4. Convert that plan into Projects, Tasks, and Milestones
5. Suggest realistic timelines and assignees

## C.2 Context Gathering

### What is Context?

Context is all the organizational data relevant to plan generation:

| Source App | Context Provided |
|-----------|------------------|
| **PathwayPro** | Logic models, theory of change, outcomes |
| **Architex** | Service delivery models, program architecture |
| **CapacityIQ** | Capacity gaps, staffing constraints, training needs |
| **FundGrid** | Budget allocations, funding sources, spending patterns |
| **FundingFramer** | Grant requirements, deliverables, milestones |
| **MetricMap** | KPIs, performance data, metrics to track |
| **Stakeholdr** | Stakeholder maps, engagement strategies |
| **Community Compass** | Community needs, equity assessments |
| **Ops360** | Historical task completion rates, team velocity |

### Context API

Each VISION app must expose:

```
GET /api/v1/{app}/context?organization_id={org_id}
```

## C.3 AI Plan Generation Prompt Architecture

### System Prompt

```
You are an expert strategic planning assistant for mission-driven organizations (nonprofits, social enterprises, government agencies).

Your role is to generate detailed, executable plans that transform organizational goals into actionable projects, milestones, and tasks.

When generating plans, you must:
1. Ground all recommendations in the provided context
2. Respect capacity constraints (staff size, budget, existing workload)
3. Align tasks with strategic outcomes
4. Suggest realistic timelines based on nonprofit best practices
5. Identify dependencies and risks
6. Recommend assignees based on roles and available staff
7. Output structured JSON conforming to the Plan Draft Schema

CRITICAL: You are generating plans for under-resourced organizations. Avoid over-engineering. Prioritize high-impact, achievable actions.
```

### Plan Draft JSON Schema

```json
{
  "plan": {
    "title": "Plan Title",
    "description": "Plan description",
    "timeframe": "6 months",
    "workstreams": [
      {
        "id": "ws-1",
        "title": "Workstream Title",
        "milestones": [
          {
            "id": "ms-1",
            "title": "Milestone Title",
            "due_date": "2025-03-15",
            "tasks": [
              {
                "id": "task-1",
                "title": "Task Title",
                "estimated_hours": 8,
                "priority": "HIGH",
                "suggested_assignee_role": "ORG_STAFF",
                "dependencies": []
              }
            ]
          }
        ]
      }
    ],
    "risks": [],
    "assumptions": []
  }
}
```

## C.4 Supabase Edge Function Implementation

See `supabase/functions/ai-plan-builder/index.ts` for complete implementation.

### Key Steps

1. Validate JWT
2. Verify user membership in organization
3. Assemble context from VISION apps
4. Build prompt (system + user)
5. Call Anthropic Claude API
6. Validate AI output against schema
7. Cache result
8. Return plan draft to user

---

# SECTION D — UI/UX SPECIFICATION (GlowUI + 2911 Bold Color System)

## D.1 Design Principles

Ops360's UI must embody:

1. **Clarity** — Users should always know where they are and what they can do
2. **Efficiency** — Minimize clicks to complete common tasks
3. **Consistency** — Use GlowUI patterns uniformly across all screens
4. **Accessibility** — WCAG AA compliance, keyboard navigation, screen reader support
5. **Delight** — Micro-interactions that feel responsive and polished

## D.2 Navigation Architecture

### CRITICAL: Top Navigation Only

Per platform-wide requirements, Ops360 **MUST NOT** implement a left sidebar. All app-level navigation uses a **top navigation bar** within the AppShell content region.

### Ops360 Top Navigation Structure

**Primary Tabs:**
- **Dashboard** — Personal command center
- **Tasks** — All tasks (My Tasks, Team Tasks, filters)
- **Plans** — View/create/edit plans
- **Projects** — Project list and detail views
- **Workflows** — Workflow templates and instances
- **Calendar** — Timeline view of tasks/milestones
- **Reports** — Analytics and insights (Phase 2)

## D.3 Color System Application (2911 Bold)

### Color Roles

| 2911 Color | Hex | Usage in Ops360 |
|------------|-----|-----------------|
| **Blue** | `#0047AB` | Primary actions, active states, links, status badges (In Progress) |
| **Green** | `#047857` | Success states, completed tasks, positive metrics |
| **Orange** | `#C2410C` | Warnings, overdue tasks, medium priority |
| **Purple** | `#6D28D9` | AI features, plan builder, automation |
| **Red** | `#B91C1C` | Errors, blocked tasks, high priority, destructive actions |
| **Gray** | `#64748B` | Secondary text, borders, disabled states |

## D.4 Core Screens

### Screen 1: Dashboard (`/ops360/dashboard`)

**Purpose:** Personal command center showing today's priorities, active projects, and AI insights.

**Key Sections:**
- My Day (tasks due today)
- AI Insights (recommendations)
- Active Projects (progress bars)
- Recent Activity (team updates)
- Tasks From Other Apps (imported items)

### Screen 2: My Tasks (`/ops360/tasks`)

**Purpose:** Comprehensive task list with filtering, search, and quick actions.

**Features:**
- Search bar
- Filters (status, priority, project, source app, due date)
- Grouped by: Overdue, Today, This Week, Later
- Inline quick actions (complete, reschedule, view)

### Screen 3: Task Detail (Right Panel)

**Purpose:** Full task details, comments, activity, attachments, and AI assistance.

**Components:**
- Status and priority dropdowns
- Description editor
- Subtasks list
- Attachments
- Comments
- Activity log
- AI sidebar (suggestions, task breakdown)

### Screen 4: Plans List (`/ops360/plans`)

**Purpose:** View all plans user has access to, with filters and search.

**Features:**
- Plan cards with progress indicators
- Visibility badges (Private, Org, Shared)
- Status grouping (Active, Draft, Archived)
- AI Plan Builder button

### Screen 5: AI Plan Builder (Modal)

**Purpose:** Guided interface for AI-powered plan generation.

**Steps:**
1. Goal & Timeframe input
2. Context source selection
3. AI generation & review
4. Convert to plan

### Screen 6: Project View (`/ops360/projects/:id`)

**Purpose:** Detailed view of a single project with milestones, tasks, and progress.

**Features:**
- Milestone checklist
- Timeline/Gantt visualization
- Task list (grouped by milestone)
- Progress summary

### Screen 7: Workflows (`/ops360/workflows`)

**Purpose:** Browse workflow templates, create custom workflows.

**Sections:**
- My Workflows
- Public Templates
- Workflow detail modal

### Screen 8: Calendar View (`/ops360/calendar`)

**Purpose:** Timeline view of tasks and milestones across projects.

**Features:**
- Day/Week/Month views
- Drag-to-reschedule
- Color-coded by priority
- Milestone markers

### Screen 9: Sharing Modal

**Purpose:** Manage plan/project sharing with users and organizations.

**Features:**
- Current shares list
- Add new share (user or org)
- Access level selector (View, Comment, Edit)

### Screen 10: Integrations Panel (`/ops360/integrations`)

**Purpose:** View connected VISION apps, ingestion status, logs.

**Sections:**
- Connected Apps (status, last import)
- Recent Ingestion Log (success/failures)

---

# SECTION E — CROSS-APP INTEGRATION ARCHITECTURE

## E.1 Integration Patterns

### Pattern 1: Webhook Push (Recommended)

Source app sends task to Ops360 when an event occurs.

**Use Cases:**
- CapacityIQ: Assessment complete → generate action items
- FundingFramer: Grant awarded → create milestone tasks
- MetricMap: KPI below threshold → create improvement task

### Pattern 2: User-Initiated Export

User explicitly sends work from source app to Ops360.

**Use Cases:**
- PathwayPro: "Turn this logic model into an execution plan"
- LaunchPath: "Send 90-day plan to Ops360"
- Stakeholdr: "Convert engagement strategy to tasks"

### Pattern 3: Scheduled Sync

Ops360 periodically pulls from source app.

**Use Cases:**
- Architex: Service delivery tasks generated in batch
- Community Compass: Community feedback tasks

## E.2 Webhook API Specification

### Endpoint

```
POST /api/v1/ops360/ingest/task
```

### Authentication

```
Authorization: Bearer {vision_hub_jwt}
X-Vision-App-Key: {app_api_key}
```

### Request Body Schema

```json
{
  "source_app": "CapacityIQ",
  "source_record_id": "cap_assess_abc123",
  "organization_id": "org_uuid",
  "task": {
    "title": "Task title",
    "description": "Task description",
    "priority": "HIGH",
    "due_date": "2025-02-28T23:59:59Z",
    "estimated_hours": 40,
    "suggested_assignee_email": "user@nonprofit.org",
    "project_hint": "Capacity Building",
    "source_context": {}
  }
}
```

### Response

```json
{
  "status": "SUCCESS",
  "task_id": "task_uuid",
  "task_url": "https://vision.platform/ops360/tasks/task_uuid"
}
```

## E.3 App-Specific Integration Specs

### CapacityIQ → Ops360
**Trigger:** User completes capacity assessment
**Tasks Generated:** Action items for each critical gap

### LaunchPath → Ops360
**Trigger:** User completes 90-day plan
**Tasks Generated:** Full plan converted to projects and tasks

### FundingFramer → Ops360
**Trigger:** Grant awarded
**Tasks Generated:** Grant milestones and deliverables

### MetricMap → Ops360
**Trigger:** KPI falls below threshold
**Tasks Generated:** Improvement action items

### Stakeholdr → Ops360
**Trigger:** User creates engagement plan
**Tasks Generated:** Stakeholder touchpoint tasks

### Architex → Ops360
**Trigger:** Service model created
**Tasks Generated:** Recurring operational tasks

### PathwayPro → Ops360
**Trigger:** Logic model implementation phase
**Tasks Generated:** Outcome-based implementation tasks

---

# SECTION F — TESTING STRATEGY

## F.1 Testing Philosophy

Ops360 is mission-critical infrastructure. Testing must ensure:

1. **Security** — RLS policies prevent unauthorized data access
2. **Data Integrity** — Multi-tenant isolation is never violated
3. **Functional Correctness** — All features work as specified
4. **AI Quality** — AI-generated plans are coherent and actionable
5. **Integration Reliability** — Cross-app ingestion works consistently

## F.2 Test Coverage Goals

| Category | Target |
|----------|--------|
| Unit Tests | ≥ 80% code coverage |
| Integration Tests | All API endpoints |
| RLS Tests | All tables, all policies |
| Multi-Tenant Tests | All critical flows |
| E2E Tests | All user journeys |
| AI Validation | All AI endpoints |

## F.3 Testing Layers

1. **Unit Tests** (Vitest) — Service layer, utilities
2. **API Integration Tests** (Vitest) — All endpoints with auth
3. **RLS Policy Tests** (SQL + Vitest) — Verify row-level security
4. **Multi-Tenant Tests** — Cross-org isolation
5. **AI Validation Tests** — Schema conformance, output quality
6. **E2E Tests** (Playwright) — Full user flows

## F.4 CI/CD Pipeline

See `.github/workflows/ops360-tests.yml`

**Jobs:**
- `unit-tests` — Run Vitest, upload coverage
- `rls-tests` — Test RLS policies on Supabase
- `e2e-tests` — Run Playwright tests

---

# SECTION G — DEVELOPMENT ROADMAP & GIT STRATEGY

## G.1 Git Branching Model

### Branch Structure

```
main (App Launcher + Vision Impact Hub Shell — STABLE)
 │
 └── feature/ops360-app (Long-lived Ops360 branch)
      │
      ├── feature/ops360-schema (Short-lived)
      ├── feature/ops360-rls (Short-lived)
      ├── feature/ops360-api-tasks (Short-lived)
      ├── feature/ops360-dashboard-ui (Short-lived)
      └── ... (additional feature branches)
```

### Workflow

1. Create feature branch from `feature/ops360-app`
2. Develop feature
3. Push and open PR to `feature/ops360-app`
4. Code review, tests pass, merge
5. Delete feature branch
6. When MVP complete, merge `feature/ops360-app` → `main`

## G.2 Implementation Phases

### Phase 0: Foundation (Weeks 1-2)
- Create database schema
- Implement RLS policies
- Set up API routes
- Add Ops360 to nav

### Phase 1: Task Management (Weeks 3-4)
- Task API endpoints
- My Tasks screen
- Task Detail panel
- Dashboard (basic)

### Phase 2: Plans & Projects (Weeks 5-6)
- Plans API
- Plan sharing API
- Projects API
- Plans List screen
- Project Detail screen

### Phase 3: AI Plan Builder (Weeks 7-9)
- Context API
- AI Plan Builder Edge Function
- Plan conversion logic
- AI Plan Builder UI

### Phase 4: Cross-App Ingestion (Weeks 10-11)
- Ingestion webhook endpoint
- App-specific integrations
- Integrations UI

### Phase 5: Workflows (Weeks 12-13)
- Workflows API
- Workflow application logic
- Workflows List screen

### Phase 6: Calendar & Visualization (Week 14)
- Calendar view
- Timeline component

### Phase 7: Polish & Performance (Weeks 15-16)
- Performance audit
- Mobile responsive
- Accessibility audit
- Empty states

### Phase 8: MVP Launch (Week 17)
- Final integration testing
- Documentation
- Production deployment

## G.3 Development Timeline

**Total Duration:** 17 weeks (~4 months)
**Team Size:** 2-3 developers

---

# SECTION H — RESEARCH-BASED COMPARISONS & BEST PRACTICES

## H.1 Competitive Analysis

### Tools Analyzed

1. **Notion AI** — AI Agents for autonomous task management
2. **Linear** — Fast, keyboard-first issue tracking
3. **Motion** — AI-powered scheduling and prioritization
4. **ClickUp** — Customizable productivity platform
5. **Asana** — Enterprise project management
6. **Trello, Jira, Focalboard, Plane** — Other alternatives

## H.2 Feature Comparison Matrix

| Feature | Notion AI | Linear | Motion | ClickUp | Asana | **Ops360** |
|---------|-----------|--------|--------|---------|-------|------------|
| **AI Plan Generation** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ **CORE** |
| **Cross-App Context** | ⚠️ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| **Multi-Org Support** | ⚠️ | ❌ | ❌ | ⚠️ | ⚠️ | ✅ **NATIVE** |
| **Consultant/Funder Roles** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| **Nonprofit Pricing** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ **INCLUDED** |

## H.3 Unique Value Propositions of Ops360

1. **Platform-Native Cross-App Intelligence** — Context from CapacityIQ, FundingFramer, MetricMap, etc.
2. **Multi-Role Collaboration** — Staff, consultants, funders working together
3. **Mission-Driven Workflow Library** — Nonprofit-specific templates
4. **Affordable AI-First Design** — AI included, not an upsell

## H.4 Best Practices Synthesis

**From Notion AI:**
- ✅ AI agents that work autonomously
- ✅ Batch operations
- ✅ Learning/memory

**From Linear:**
- ✅ Speed and simplicity
- ✅ Keyboard-first navigation
- ✅ Automatic rollover

**From Motion:**
- ✅ AI-driven prioritization
- ✅ Calendar integration
- ✅ Automatic rescheduling

**From ClickUp:**
- ✅ Nonprofit-specific workflows
- ✅ Automation agents
- ✅ Donor/volunteer management

**From Asana:**
- ✅ Smart summaries
- ✅ Workflow automation suggestions
- ✅ Template library

---

# IMPLEMENTATION GUIDE

## Quick Start: Where to Begin

### For Developers

1. **Read** Section B (Technical Architecture)
2. **Review** Section G (Development Roadmap)
3. **Start** Phase 0 implementation:
   - Create `feature/ops360-app` branch
   - Run migration: `supabase/migrations/YYYYMMDDHHMMSS_ops360_schema.sql`
   - Apply RLS: `supabase/migrations/YYYYMMDDHHMMSS_ops360_rls.sql`

### For Product Managers

1. **Read** Section A (System Context) and Section D (UI/UX)
2. **Review** Section H (Research)
3. **Plan** using roadmap in Section G

### For AI/ML Engineers

1. **Read** Section C (AI Architecture)
2. **Implement** Edge Function: `supabase/functions/ai-plan-builder/`
3. **Test** using Section F.6 strategy

## Critical Design Decisions

1. ✅ **Vision Impact Hub SSO ONLY** — No auth in Ops360
2. ✅ **Top navigation ONLY** — No app-level left sidebar
3. ✅ **Database-level RLS** — Security at PostgreSQL level
4. ✅ **Anthropic Claude Sonnet 4.5** — AI model
5. ✅ **GlowUI + 2911 exclusively** — Design system

## Success Criteria for MVP

### Functional Requirements
- ✅ Create, assign, complete tasks
- ✅ Create plans with projects/milestones
- ✅ AI Plan Builder generates valid plans
- ✅ Tasks from other apps appear in Ops360
- ✅ Sharing works (staff, consultants, funders)

### Non-Functional Requirements
- ✅ Dashboard loads <1s
- ✅ All tests passing
- ✅ RLS verified in production
- ✅ API docs complete
- ✅ Error monitoring active

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **AI output quality issues** | MEDIUM | HIGH | Extensive validation, human review |
| **RLS policy bugs** | MEDIUM | CRITICAL | Comprehensive RLS tests |
| **Scope creep** | HIGH | MEDIUM | Strict MVP adherence |
| **Integration failures** | MEDIUM | MEDIUM | Robust error handling |
| **Performance at scale** | LOW | MEDIUM | Query optimization, indexing |

## Post-Launch Roadmap

### High Priority
1. Email Notifications
2. Workload Analytics
3. Automation Rules

### Medium Priority
4. Recurring Tasks
5. Task Dependencies
6. Bidirectional Sync

### Future Vision
7. Mobile App
8. Voice Input
9. Open Source Core

---

# APPENDICES

## Appendix A: Database Schema SQL

See `supabase/migrations/YYYYMMDDHHMMSS_ops360_schema.sql`

## Appendix B: RLS Policies SQL

See `supabase/migrations/YYYYMMDDHHMMSS_ops360_rls.sql`

## Appendix C: API Documentation

See OpenAPI spec in Section B.4

## Appendix D: Testing Files

See `tests/` directory structure in Section F

## Appendix E: Git Workflow

See Section G.2 for complete branching strategy

---

**END OF OPS360 IMPLEMENTATION PLAYBOOK**

**Version:** 1.0
**Date:** 2025-01-24
**Status:** Production Ready
**Next Action:** Begin Phase 0 Development
