# VisionFlow Phase 2+ Implementation Agent Prompt

## 🎯 Objective

Implement the remaining VisionFlow pages (Plans, Projects, Workflows, Calendar) following the existing architecture, using Glow UI design system, and implementing the Kanban board view from the provided Figma design.

---

## 📋 Context & Requirements

### Project Overview
- **Platform**: VISION Platform V2 - Next.js 15 + React 19 + TypeScript 5.6
- **Design System**: Glow UI with 2911 Bold Color System
- **Database**: Supabase PostgreSQL with RLS
- **Architecture**: AppShell layout with top navigation (no page-specific sidebars)
- **Current Status**: Phase 1 (Task Management) complete, Phase 2+ pages need implementation

### Already Completed (Phase 0-1)
✅ Database schema created (`20250124000001_visionflow_schema.sql`)
✅ RLS policies configured (`20250124000002_visionflow_rls.sql`)
✅ VisionFlow service layer (`apps/shell/src/services/visionflowService.ts`)
✅ Task management API endpoints
✅ Dashboard page (`/visionflow/dashboard`)
✅ Tasks list page (`/visionflow/tasks`)
✅ Task detail page (`/visionflow/tasks/[id]`)
✅ CreateTaskModal component
✅ TaskAssignments component

### Design Reference
**Figma Design for Kanban View**:
https://www.figma.com/design/vyRUcaDKVr9sJwRVj30oAq/Glow-UI-%E2%80%94-Pro-1.7?node-id=37388-42830&m=dev

**Important**: Use this Figma design as the reference for implementing the Kanban board view for tasks, projects, and workflow instances.

---

## 📁 Pages to Implement

### 1. Plans Page (`/visionflow/plans`)
**Route**: `apps/shell/src/app/visionflow/plans/page.tsx`

**Requirements**:
- List all plans with cards showing:
  - Plan title
  - Status (Draft, Active, Archived)
  - Visibility indicator (Private, Org, Shared)
  - Progress bar (calculated from projects/tasks)
  - Created date
  - Number of projects
- Filters:
  - Status (All, Draft, Active, Archived)
  - Visibility (All, Private, Org, Shared)
  - Search by title
- Actions:
  - Create new plan button (opens modal)
  - Edit plan (inline or modal)
  - Delete plan (with confirmation)
  - Share plan (opens sharing modal)
- Use Glow UI components: GlowCard, GlowButton, GlowBadge, GlowInput

**Database Tables**:
```sql
plans (
  id, organization_id, title, description,
  status, visibility, start_date, end_date,
  created_by, created_at, updated_at, deleted_at
)
plan_shares (
  id, plan_id, shared_with_type, shared_with_id,
  access_level, created_at
)
```

**API Endpoints** (Already created):
- `GET /api/v1/apps/visionflow/plans` - List plans
- `POST /api/v1/apps/visionflow/plans` - Create plan
- `PUT /api/v1/apps/visionflow/plans/:id` - Update plan
- `DELETE /api/v1/apps/visionflow/plans/:id` - Delete plan

---

### 2. Projects Page (`/visionflow/projects`)
**Route**: `apps/shell/src/app/visionflow/projects/page.tsx`

**Requirements**:
- **Kanban Board View** (Primary view - implement from Figma design):
  - Columns: Not Started, In Progress, At Risk, Completed
  - Draggable project cards
  - Card shows:
    - Project name
    - Parent plan (if linked)
    - Progress percentage
    - Due date
    - Assigned team members (avatars)
    - Priority indicator
  - Drag-and-drop to change status
  - Smooth animations on drag
- **List View** (Secondary view - toggle):
  - Table with columns: Name, Plan, Status, Progress, Due Date, Team
  - Sortable columns
  - Click row to view project detail
- Filters:
  - By parent plan
  - By status
  - By priority
  - Search by name
- Actions:
  - Create project button
  - View project detail (slide-out panel or modal)
  - Edit project
  - Delete project
  - Link to plan

**Kanban Implementation Notes**:
- Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop
- Reference Figma design for exact styling, spacing, shadows
- Implement smooth transitions and hover states
- Add loading states for status updates
- Optimistic updates for better UX

**Database Tables**:
```sql
projects (
  id, organization_id, plan_id, name, description,
  status, priority, start_date, end_date, progress_percentage,
  created_by, created_at, updated_at, deleted_at
)
milestones (
  id, project_id, name, description, due_date,
  status, order_index, created_at, updated_at, deleted_at
)
```

**API Endpoints to Create**:
- `GET /api/v1/apps/visionflow/projects` - List projects
- `POST /api/v1/apps/visionflow/projects` - Create project
- `GET /api/v1/apps/visionflow/projects/:id` - Get project detail
- `PUT /api/v1/apps/visionflow/projects/:id` - Update project
- `DELETE /api/v1/apps/visionflow/projects/:id` - Delete project
- `PATCH /api/v1/apps/visionflow/projects/:id/status` - Update status (for drag-and-drop)

---

### 3. Workflows Page (`/visionflow/workflows`)
**Route**: `apps/shell/src/app/visionflow/workflows/page.tsx`

**Requirements**:
- Two sections:
  1. **My Workflows** (user-created templates)
  2. **Public Templates** (system-provided)
- Each workflow card shows:
  - Workflow name
  - Description (truncated)
  - Number of steps
  - Estimated duration
  - Times used
  - Preview button
  - Apply to project button
- Workflow preview modal:
  - List of steps with order
  - Step details (name, duration, assignee type)
  - Visual timeline
  - Apply button
  - Copy to My Workflows button (for public templates)
- Create workflow builder:
  - Add steps
  - Set duration for each step
  - Set assignee type (specific user, role, project lead)
  - Reorder steps (drag-and-drop)
  - Save as template

**Database Tables**:
```sql
workflows (
  id, organization_id, name, description,
  is_public, estimated_days, created_by,
  created_at, updated_at, deleted_at
)
workflow_steps (
  id, workflow_id, name, description,
  order_index, duration_days, assignee_type, assignee_id,
  created_at, updated_at
)
workflow_instances (
  id, workflow_id, project_id, status,
  started_at, completed_at, created_at
)
```

**API Endpoints to Create**:
- `GET /api/v1/apps/visionflow/workflows` - List workflows
- `POST /api/v1/apps/visionflow/workflows` - Create workflow
- `GET /api/v1/apps/visionflow/workflows/:id` - Get workflow detail
- `PUT /api/v1/apps/visionflow/workflows/:id` - Update workflow
- `DELETE /api/v1/apps/visionflow/workflows/:id` - Delete workflow
- `POST /api/v1/apps/visionflow/workflows/:id/apply` - Apply to project

---

### 4. Calendar Page (`/visionflow/calendar`)
**Route**: `apps/shell/src/app/visionflow/calendar/page.tsx`

**Requirements**:
- Full calendar view (use `react-big-calendar` or similar)
- Show events:
  - Task due dates
  - Project milestones
  - Workflow deadlines
- Views:
  - Month view (default)
  - Week view
  - Day view
  - Agenda view (list)
- Event colors by type:
  - Tasks: Blue (#0047AB)
  - Projects: Green (#047857)
  - Milestones: Purple (#6D28D9)
- Click event to open detail panel
- Drag-and-drop to reschedule (update due dates)
- Filters:
  - Show/hide tasks
  - Show/hide projects
  - Show/hide milestones
  - Filter by assigned user

**Dependencies to Add**:
```json
{
  "react-big-calendar": "^1.13.0",
  "date-fns": "^3.0.0"
}
```

**API Endpoints** (Use existing):
- `GET /api/v1/apps/visionflow/tasks` (with date filters)
- `GET /api/v1/apps/visionflow/projects` (with date filters)

---

## 🎨 Design System Requirements

### Color System (2911 Bold Colors)
```typescript
// Use these exact colors from Tailwind config
const colors = {
  blue: '#0047AB',      // Primary actions, tasks
  green: '#047857',     // Success, projects
  orange: '#C2410C',    // Warnings, at risk
  purple: '#6D28D9',    // Premium, milestones
  red: '#B91C1C',       // Errors, overdue
  gray: '#64748B',      // Text, borders
};
```

### Glow UI Components to Use
All components from `@/components/glow-ui/`:
- `GlowButton` - All buttons
- `GlowCard` - Cards and containers
- `GlowInput` - Form inputs
- `GlowSelect` - Dropdowns
- `GlowTextarea` - Text areas
- `GlowModal` - Modals and dialogs
- `GlowBadge` - Status badges
- `GlowTabs` - Tab navigation (if needed)
- `GlowSwitch` - Toggle switches

### Spacing Scale
Use multiples of 4: `4, 8, 12, 16, 20, 24, 32, 40`

### Shadows
```css
/* Use these Tailwind classes */
shadow-glow-primary          /* Interactive elements */
shadow-glow-primary-lg       /* Hover states */
shadow-ambient-card          /* Cards */
shadow-ambient-card-hover    /* Card hover */
shadow-interactive           /* Buttons */
shadow-interactive-hover     /* Button hover */
```

---

## 🔧 Implementation Guidelines

### File Structure Pattern
```
apps/shell/src/app/visionflow/
├── plans/
│   ├── page.tsx                 # Plans list
│   ├── [id]/
│   │   └── page.tsx            # Plan detail
│   └── components/
│       ├── CreatePlanModal.tsx
│       ├── PlanCard.tsx
│       └── PlanShareModal.tsx
├── projects/
│   ├── page.tsx                 # Projects kanban/list
│   ├── [id]/
│   │   └── page.tsx            # Project detail
│   └── components/
│       ├── ProjectKanban.tsx   # Kanban board
│       ├── ProjectCard.tsx     # Card in kanban
│       ├── ProjectList.tsx     # List view
│       └── CreateProjectModal.tsx
├── workflows/
│   ├── page.tsx                 # Workflows list
│   ├── [id]/
│   │   └── page.tsx            # Workflow detail
│   └── components/
│       ├── WorkflowCard.tsx
│       ├── WorkflowBuilder.tsx
│       └── WorkflowPreviewModal.tsx
└── calendar/
    ├── page.tsx                 # Calendar view
    └── components/
        ├── CalendarView.tsx
        ├── EventDetailPanel.tsx
        └── CalendarFilters.tsx
```

### API Route Pattern
```
apps/shell/src/app/api/v1/apps/visionflow/
├── plans/
│   ├── route.ts                 # GET (list), POST (create)
│   ├── [id]/
│   │   ├── route.ts            # GET, PUT, DELETE
│   │   └── shares/
│   │       └── route.ts        # GET, POST, DELETE shares
├── projects/
│   ├── route.ts
│   ├── [id]/
│   │   ├── route.ts
│   │   ├── status/
│   │   │   └── route.ts        # PATCH status (for kanban)
│   │   └── milestones/
│   │       └── route.ts
├── workflows/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── apply/
│           └── route.ts         # POST apply workflow
└── calendar/
    └── events/
        └── route.ts             # GET all events
```

### Service Layer Pattern
Extend `apps/shell/src/services/visionflowService.ts`:
```typescript
export const visionflowService = {
  // Existing task methods...

  // Plans
  async getPlans(filters?: PlanFilters): Promise<Plan[]> { ... },
  async createPlan(data: CreatePlanRequest): Promise<Plan> { ... },
  async updatePlan(id: string, data: UpdatePlanRequest): Promise<Plan> { ... },
  async deletePlan(id: string): Promise<void> { ... },
  async sharePlan(planId: string, shareData: SharePlanRequest): Promise<void> { ... },

  // Projects
  async getProjects(filters?: ProjectFilters): Promise<Project[]> { ... },
  async createProject(data: CreateProjectRequest): Promise<Project> { ... },
  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> { ... },
  async updateProjectStatus(id: string, status: string): Promise<Project> { ... },
  async deleteProject(id: string): Promise<void> { ... },

  // Workflows
  async getWorkflows(filters?: WorkflowFilters): Promise<Workflow[]> { ... },
  async createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> { ... },
  async applyWorkflow(workflowId: string, projectId: string): Promise<void> { ... },

  // Calendar
  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> { ... },
};
```

### TypeScript Types Pattern
Create types in `apps/shell/src/types/visionflow.ts`:
```typescript
// Plans
export interface Plan {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  visibility: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanRequest {
  title: string;
  description?: string;
  status?: string;
  visibility?: string;
  start_date?: string;
  end_date?: string;
}

// Projects
export interface Project {
  id: string;
  organization_id: string;
  plan_id?: string;
  name: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  start_date: string;
  end_date: string;
  progress_percentage: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Workflows
export interface Workflow {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  is_public: boolean;
  estimated_days: number;
  steps: WorkflowStep[];
  created_by: string;
  created_at: string;
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  name: string;
  description: string;
  order_index: number;
  duration_days: number;
  assignee_type: 'USER' | 'ROLE' | 'PROJECT_LEAD';
  assignee_id?: string;
}

// Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'TASK' | 'PROJECT' | 'MILESTONE';
  status: string;
  color: string;
  allDay: boolean;
}
```

---

## 🧪 Testing Requirements

### Unit Tests
Create test files for each service method:
```typescript
// apps/shell/src/services/__tests__/visionflowService.plans.test.ts
describe('VisionFlow Plans Service', () => {
  test('should fetch plans with filters', async () => { ... });
  test('should create new plan', async () => { ... });
  test('should share plan with organization', async () => { ... });
});
```

### Integration Tests
Test API endpoints:
```typescript
// apps/shell/src/app/api/v1/apps/visionflow/plans/__tests__/route.test.ts
describe('Plans API', () => {
  test('GET /api/v1/apps/visionflow/plans', async () => { ... });
  test('POST /api/v1/apps/visionflow/plans', async () => { ... });
});
```

### E2E Tests (Optional)
```typescript
// e2e/visionflow-projects-kanban.spec.ts
test('should drag project between columns', async ({ page }) => {
  // Test drag-and-drop functionality
});
```

---

## 📚 Reference Files

### Existing Implementations to Reference
1. **Task Management** (Pattern to follow):
   - `apps/shell/src/app/visionflow/tasks/page.tsx`
   - `apps/shell/src/app/visionflow/tasks/[id]/page.tsx`
   - `apps/shell/src/components/visionflow/CreateTaskModal.tsx`
   - `apps/shell/src/services/visionflowService.ts`

2. **API Endpoints**:
   - `apps/shell/src/app/api/v1/apps/visionflow/tasks/route.ts`
   - `apps/shell/src/app/api/v1/apps/visionflow/tasks/[id]/route.ts`

3. **Database Schema**:
   - `supabase/migrations/20250124000001_visionflow_schema.sql`
   - `supabase/migrations/20250124000002_visionflow_rls.sql`

4. **Glow UI Components**:
   - `apps/shell/src/components/glow-ui/`

### Documentation
- **Setup Guide**: `VISIONFLOW_SETUP_COMPLETE.md`
- **Implementation Playbook**: `VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md`
- **CLAUDE.md**: Project-wide guidelines and architecture

---

## ✅ Acceptance Criteria

### For Each Page
- [ ] Page renders without errors
- [ ] Uses only Glow UI components (no custom styled divs)
- [ ] Follows 2911 Bold Color System
- [ ] Implements proper loading states
- [ ] Implements proper error handling
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility: keyboard navigation, ARIA labels
- [ ] TypeScript: No `any` types, all props typed
- [ ] RLS policies enforced (organization-scoped data)

### Kanban Board Specific
- [ ] Matches Figma design exactly (spacing, colors, shadows)
- [ ] Smooth drag-and-drop animations
- [ ] Optimistic UI updates
- [ ] Loading states during API calls
- [ ] Handles errors gracefully
- [ ] Works on touch devices (mobile)
- [ ] Keyboard accessible (Tab, Enter, Escape, Arrow keys)

### API Endpoints
- [ ] Request validation with Zod schemas
- [ ] Proper error responses (400, 401, 403, 404, 500)
- [ ] RLS enforced (users only see their org data)
- [ ] Pagination for list endpoints
- [ ] Filtering and sorting support
- [ ] Rate limiting configured

### Testing
- [ ] Unit tests for service methods (>80% coverage)
- [ ] Integration tests for API endpoints
- [ ] Manual testing checklist completed
- [ ] No console errors or warnings

---

## 🚀 Implementation Steps

### Phase 2A: Plans (Week 1)
1. Create Plans API endpoints
2. Implement Plans list page
3. Create Plan detail page
4. Add CreatePlanModal component
5. Add PlanShareModal component
6. Write unit tests
7. Update navigation (uncomment Plans route)

### Phase 2B: Projects with Kanban (Week 2-3)
1. Study Figma design thoroughly
2. Install drag-and-drop dependencies
3. Create Projects API endpoints (with status update)
4. Implement Kanban board component
5. Implement draggable ProjectCard component
6. Add smooth animations and transitions
7. Implement list view (alternative to kanban)
8. Create Project detail page
9. Write unit tests
10. Update navigation (uncomment Projects route)

### Phase 2C: Workflows (Week 4)
1. Create Workflows API endpoints
2. Seed public workflow templates
3. Implement Workflows list page
4. Create WorkflowBuilder component
5. Add WorkflowPreviewModal
6. Implement apply workflow logic
7. Write unit tests
8. Update navigation (uncomment Workflows route)

### Phase 2D: Calendar (Week 5)
1. Install calendar dependencies
2. Create calendar events aggregation API
3. Implement CalendarView component
4. Add event detail panel
5. Implement drag-to-reschedule
6. Add calendar filters
7. Write unit tests
8. Update navigation (uncomment Calendar route)

---

## 🎯 Success Metrics

When implementation is complete:
- [ ] All 4 pages accessible via navigation
- [ ] No 404 errors when clicking tabs
- [ ] Kanban board matches Figma design
- [ ] All CRUD operations working
- [ ] Data persisted in Supabase
- [ ] RLS policies enforced
- [ ] TypeScript build passes (`pnpm type-check`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Production build succeeds (`pnpm build`)
- [ ] Manual testing checklist 100% complete

---

## 📦 Deliverables

1. **Code**:
   - All 4 pages implemented
   - All API endpoints created
   - Service layer methods added
   - TypeScript types defined
   - Unit tests written

2. **Documentation**:
   - Update `VISIONFLOW_SETUP_COMPLETE.md` with Phase 2 info
   - Create `KANBAN_IMPLEMENTATION_NOTES.md` with Figma → code mapping
   - Update navigation config
   - Add screenshots of completed pages

3. **Testing**:
   - Unit test suite passing
   - Integration tests passing
   - Manual testing checklist completed
   - Performance metrics documented

---

## 💡 Tips & Best Practices

1. **Start with the database**: Verify all tables exist and RLS works
2. **Build API first**: Test with curl/Postman before UI
3. **Component isolation**: Build components in Storybook first (optional)
4. **Figma fidelity**: Match the design exactly - spacing, colors, shadows
5. **Accessibility**: Test with keyboard only, screen reader
6. **Mobile-first**: Start with mobile layout, then scale up
7. **Error states**: Handle loading, empty, error states
8. **Optimistic updates**: Update UI immediately, rollback on error
9. **Progressive enhancement**: Basic functionality first, polish later
10. **Commit often**: Small, atomic commits with clear messages

---

## 🆘 Support & Resources

- **Figma Design**: https://www.figma.com/design/vyRUcaDKVr9sJwRVj30oAq/Glow-UI-%E2%80%94-Pro-1.7?node-id=37388-42830&m=dev
- **Existing Code**: Study `apps/shell/src/app/visionflow/tasks/` for patterns
- **Database Schema**: `supabase/migrations/20250124000001_visionflow_schema.sql`
- **Design System**: `apps/shell/src/components/glow-ui/`
- **Test User**: `test@visionplatform.org` / `TestPassword123!`
- **Dev Server**: http://localhost:3000

---

**Ready to begin?** Start with Phase 2A (Plans) and work through each phase systematically. Good luck! 🚀
