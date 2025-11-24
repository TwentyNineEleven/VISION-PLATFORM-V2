# VISION Platform V2 - Cursor AI Implementation Guide
## Supabase + Vercel Backend Integration

**Branch:** `feature/supabase-backend-integration`
**Estimated Timeline:** 7-8 weeks (2 developers) | 10-12 weeks (1 developer)
**Total Effort:** 312 hours
**Implementation Method:** Cursor IDE with Composer + YOLO Mode

---

## 🎯 Mission

Migrate VISION Platform V2 from localStorage/mock data to production Supabase + Vercel backend.

**Current State:**
- ✅ 34 pages built and functioning with mock data
- ✅ All services using localStorage
- ✅ Frontend complete and production-ready on `main` branch

**Target State:**
- 🎯 Full Supabase PostgreSQL backend with Row Level Security
- 🎯 Real-time notifications with Supabase Realtime
- 🎯 File storage with Supabase Storage
- 🎯 Stripe billing integration
- 🎯 Multi-tenant architecture with organization isolation

---

## 📚 Required Reading (Priority Order)

Before starting, open these documents in Cursor and use **Cmd/Ctrl + K** to ask context-aware questions:

1. **[SUPABASE_BACKEND_INTEGRATION_PLAN.md](./SUPABASE_BACKEND_INTEGRATION_PLAN.md)** - Complete technical specification
2. **[CLINE_BACKEND_DEVELOPMENT_PROMPT.md](./CLINE_BACKEND_DEVELOPMENT_PROMPT.md)** - Detailed implementation steps
3. This document (CURSOR_BACKEND_IMPLEMENTATION_GUIDE.md) - Cursor-specific workflow

---

## 🛠️ Cursor Setup & Configuration

### 1. Install Cursor IDE

Download from: https://cursor.sh

### 2. Configure Cursor for This Project

**Open Settings** (`Cmd/Ctrl + ,`)

#### General Tab
- ✅ Enable "Multi-line completions"
- ✅ Enable "Codebase indexing"
- ✅ Enable "Auto-apply diffs"

#### Models Tab
- **Default Model:** Claude Sonnet 4 (best for complex reasoning)
- **Fast Model:** Claude Haiku (for quick completions)
- **YOLO Mode Model:** Claude Sonnet 4

#### Features Tab
- ✅ Enable "Composer" (multi-file editing)
- ✅ Enable "YOLO Mode" (auto-test, auto-fix)
- ✅ Enable "Apply all" for diffs

### 3. Install Cursor Extensions

Open Command Palette (`Cmd/Ctrl + Shift + P`) and install:

```
ext install Supabase.supabase
ext install bradlc.vscode-tailwindcss
ext install esbenp.prettier-vscode
ext install dbaeumer.vscode-eslint
```

### 4. Set Up Supabase MCP Integration

**File:** `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server", "--project-id", "YOUR_PROJECT_ID"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

### 5. Configure TypeScript for Cursor

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./apps/shell/src/*"]
    }
  }
}
```

This enables **Cmd/Ctrl + Click** to navigate to imports.

---

## 🚀 Cursor Workflow: Step-by-Step

### Phase 1: Foundation & Authentication (Week 1-2)

#### Step 1.1: Supabase Project Setup

**Use Cursor Chat** (`Cmd/Ctrl + L`):

```
@supabase Create a new Supabase project for VISION Platform V2 backend.

Project requirements:
- Database: PostgreSQL 15+
- Region: us-east-1
- Plan: Pro (need RLS, backups, point-in-time recovery)
- Extensions needed: pgvector (for future AI features)

Once created, provide the project URL and anon key for environment variables.
```

**Manual Steps:**
1. Copy `.env.local.example` → `.env.local`
2. Add Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

#### Step 1.2: Create Database Migration

**Use Composer** (`Cmd/Ctrl + I`):

```
Create the first database migration at /supabase/migrations/20240101000001_create_users_tables.sql

Requirements:
- Create public.users table (extends auth.users)
  - id UUID PRIMARY KEY REFERENCES auth.users(id)
  - email TEXT NOT NULL UNIQUE
  - name TEXT NOT NULL
  - avatar_url TEXT
  - created_at, updated_at TIMESTAMPTZ

- Create public.user_preferences table
  - user_id UUID REFERENCES public.users(id)
  - theme TEXT (light/dark/system)
  - notifications_enabled BOOLEAN
  - email_digest TEXT (realtime/daily/weekly/never)
  - language, timezone TEXT

- Create update_updated_at_column() trigger function
- Add triggers to both tables
- Create indexes on user_id
- Enable RLS on both tables
- Add RLS policies:
  - Users can view/update own profile
  - Users can view/update own preferences

Use the exact schema from SUPABASE_BACKEND_INTEGRATION_PLAN.md section 2.1
```

**Cursor will:**
1. Create the migration file
2. Show a diff preview
3. Ask "Apply all changes?"

**You:**
1. Review the SQL carefully
2. Click "Accept All" if correct
3. Run: `npx supabase db push` to apply

#### Step 1.3: Generate TypeScript Types

**Use Terminal in Cursor** (`` Ctrl/Cmd + ` ``):

```bash
npx supabase gen types typescript --local > apps/shell/src/types/supabase.ts
```

**Use Cursor Chat:**

```
@codebase Update all service files to use the new Supabase types from types/supabase.ts instead of manual type definitions.
```

#### Step 1.4: Create Supabase Client Utilities

**Use Composer** (`Cmd/Ctrl + I`):

```
Create Supabase client utilities:

1. /apps/shell/src/lib/supabase/client.ts
   - Browser client using createBrowserClient from @supabase/ssr
   - Export createClient() function

2. /apps/shell/src/lib/supabase/server.ts
   - Server client using createServerClient
   - Handle cookies with next/headers
   - Export createServerSupabaseClient() async function

3. /apps/shell/src/lib/supabase/middleware.ts
   - Session refresh middleware
   - Export updateSession(request: NextRequest)

4. /apps/shell/middleware.ts
   - Import and use updateSession
   - Configure matcher to exclude static files

Use the exact code from CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 1.3
```

**YOLO Mode Tip:** Enable YOLO mode for auto-testing:
- `Cmd/Ctrl + Shift + P` → "Cursor: Toggle YOLO Mode"
- Cursor will automatically run tests and fix errors

#### Step 1.5: Convert profileService.ts

**Use Composer** with file context:

```
@profileService.ts Convert this service from localStorage to Supabase.

Requirements:
- Keep all existing method signatures
- Replace localStorage with Supabase client
- Use RLS policies (no manual filtering needed)
- Add proper error handling
- Methods to convert:
  1. getProfile() - fetch from users table with preferences
  2. updateProfile() - update users table
  3. updatePreferences() - upsert user_preferences
  4. uploadAvatar() - use Supabase Storage

Reference implementation in CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 1.5
```

**Cursor Composer Features:**
- Shows **side-by-side diff**
- Highlights changes in green/red
- Can **partially accept** changes
- **Regenerate** if not satisfied

**Pro Tip:** Use `Cmd/Ctrl + K` in editor for inline edits:
```
Replace window.localStorage.getItem() with Supabase client query
```

#### Step 1.6: Create Authentication API Endpoints

**Use Composer**:

```
Create authentication API endpoints in /apps/shell/src/app/api/auth/:

1. signup/route.ts
   - POST handler
   - Create user in auth.users
   - Create profile in public.users
   - Create default preferences
   - Return user + session

2. signin/route.ts
   - POST handler
   - Sign in with password
   - Update last_active_at
   - Return session

3. signout/route.ts
   - POST handler
   - Sign out user
   - Clear session

4. reset-password/route.ts
   - POST handler
   - Send reset email
   - Return success message

Use exact implementations from CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 1.4
```

#### Step 1.7: Test Authentication Flow

**Use Cursor Terminal:**

```bash
# Run dev server
pnpm dev

# In another terminal, test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","name":"Test User"}'
```

**Use Cursor Chat to generate tests:**

```
@test Generate Vitest tests for authentication endpoints.

Test cases:
- Sign up creates user in database
- Sign in returns valid session
- Sign out clears cookies
- RLS prevents cross-user access

Save to: apps/shell/src/tests/auth.test.ts
```

**YOLO Mode:** Will auto-run tests and fix failures!

---

## 🎨 Cursor Pro Tips for Backend Development

### 1. Multi-File Editing with Composer

**Scenario:** Converting a service requires updating multiple files

**Workflow:**
1. Open Composer (`Cmd/Ctrl + I`)
2. Tag multiple files: `@organizationService.ts @types/organization.ts @app/api/organizations/route.ts`
3. Describe the change once
4. Cursor edits all files simultaneously
5. Review side-by-side diffs
6. Accept all or reject individual changes

**Example:**

```
@organizationService.ts @types/organization.ts @lib/mock-data.ts

Convert organizationService from localStorage to Supabase:
1. Remove mock data dependency
2. Add Supabase client queries
3. Update types to match database schema
4. Add getCurrentOrgId() helper
5. Keep all existing method signatures

Follow implementation in CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 2.2
```

### 2. Using @supabase Chat Participant

With Supabase MCP extension:

```
@supabase Show me the current schema for the organizations table
@supabase Generate a migration to add 'logo_url' column to organizations
@supabase /migration Add organization_invites table with email, role, token columns
```

### 3. Codebase-Wide Search & Replace

**Use Chat:**

```
@codebase Find all occurrences of localStorage.getItem and list which services still use mock data
```

Cursor will:
- Search entire codebase
- Show file locations
- Provide context for each occurrence
- Suggest refactoring plan

### 4. Auto-Fix TypeScript Errors

**Enable Auto-Fix:**
1. Make a change that breaks types
2. `Cmd/Ctrl + Shift + M` to open Problems panel
3. Click on error
4. `Cmd/Ctrl + .` → "Fix all in file"

**Or use Chat:**

```
@errors Fix all TypeScript errors in the current file
```

### 5. Generate Tests with Context

```
@organizationService.ts @types/organization.ts

Generate comprehensive Vitest tests for organizationService:
- Test getOrganization() with valid org
- Test updateOrganization() with partial data
- Test RLS policy enforcement (user can't access other org)
- Test validation errors
- Mock Supabase client responses

Save to: apps/shell/src/services/__tests__/organizationService.test.ts
```

### 6. Cursor YOLO Mode for Rapid Development

**When to use YOLO:**
- Converting repetitive services (notifications, files, etc.)
- Running test suites automatically
- Fixing linter errors in bulk

**How to use:**
1. Enable: `Cmd/Ctrl + Shift + P` → "Toggle YOLO Mode"
2. Make a change
3. Cursor will:
   - Run `pnpm build`
   - Run `pnpm test`
   - Fix any errors
   - Re-run until passing

**Example:**

```
@notificationService.ts Enable YOLO mode and convert to Supabase with Realtime subscriptions
```

Cursor will iterate until:
- ✅ TypeScript compiles
- ✅ Tests pass
- ✅ Linter happy

### 7. Using Cursor for Database Migrations

**Create migration:**

```
@supabase Create migration for notifications table:
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users(id)
- type TEXT (info/success/warning/error)
- title, message TEXT
- read BOOLEAN DEFAULT false
- created_at TIMESTAMPTZ

Enable RLS:
- Users can only view their own notifications
- System can create notifications for any user

Save to: supabase/migrations/20240101000004_create_notifications_tables.sql
```

**Test migration:**

```bash
# Cursor terminal
npx supabase db reset  # Reset local DB
npx supabase db push   # Apply migration
npx supabase gen types typescript --local > apps/shell/src/types/supabase.ts
```

### 8. Debugging with Cursor

**Set breakpoints:**
1. Click left of line number
2. `F5` to start debugging
3. Use Cursor Chat while debugging:

```
@errors Why is this Supabase query returning null?
```

Cursor analyzes:
- Current variable values
- Stack trace
- RLS policies
- Suggests fixes

---

## 📋 Phase-by-Phase Implementation with Cursor

### Phase 1: Foundation & Authentication ✅

**Cursor Workflow:**

1. **Create Migration** (Composer)
   ```
   @supabase /migration Create users and user_preferences tables with RLS
   ```

2. **Generate Types** (Terminal)
   ```bash
   npx supabase gen types typescript --local
   ```

3. **Create Clients** (Composer)
   ```
   Create Supabase client utilities for browser, server, and middleware
   ```

4. **Convert Service** (Composer + YOLO)
   ```
   @profileService.ts Convert to Supabase, enable YOLO mode
   ```

5. **Create APIs** (Composer)
   ```
   Create auth endpoints: signup, signin, signout, reset-password
   ```

6. **Test** (YOLO Mode)
   - Auto-runs tests
   - Auto-fixes failures
   - Reports success

**Completion Criteria:**
- [ ] Migration applied successfully
- [ ] Types generated
- [ ] profileService converted
- [ ] All auth endpoints working
- [ ] Tests passing
- [ ] Production build succeeds

---

### Phase 2: Organizations & Teams

**Cursor Workflow:**

1. **Migration** (Composer):
   ```
   @supabase Create migrations for:
   - organizations table
   - organization_members table
   - organization_invites table

   Include RLS policies for multi-tenant isolation
   Reference: SUPABASE_BACKEND_INTEGRATION_PLAN.md section 2.2
   ```

2. **Convert Services** (Composer with multiple files):
   ```
   @organizationService.ts @teamService.ts Convert both services to Supabase.

   Add getCurrentOrgId() helper function.
   Implement team invite flow with email.
   Use RLS for organization isolation.
   ```

3. **Email Invites** (Composer):
   ```
   Create /api/invites/send/route.ts using Resend API.
   Create /app/invites/[token]/page.tsx for invite acceptance.

   Reference: CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 2.4
   ```

4. **Test with YOLO**:
   ```
   @teamService.ts Generate tests for invite flow, enable YOLO mode
   ```

---

### Phase 3: Notifications with Realtime

**Cursor Workflow:**

1. **Migration**:
   ```
   @supabase /migration Create notifications table with RLS
   ```

2. **Convert Service** (Composer):
   ```
   @notificationService.ts Convert to Supabase with Realtime subscriptions.

   Implement:
   - getNotifications() with filters
   - markAsRead() / markAllAsRead()
   - subscribeToNotifications() using Supabase Realtime

   Reference: CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 3.2
   ```

3. **Test Realtime**:
   ```
   @notificationService.ts Generate integration test for Realtime delivery
   ```

**YOLO Mode** will automatically:
- Fix subscription errors
- Handle reconnection logic
- Test delivery latency

---

### Phase 4: Applications & Files

**Cursor Workflow:**

1. **Seed Apps Data** (Composer):
   ```
   @lib/mock-data.ts Create SQL script to seed apps table from mock data.
   Save to: supabase/seed.sql
   ```

2. **Convert Services**:
   ```
   @favoritesService.ts @onboardingService.ts Convert to Supabase, parallel edit
   ```

3. **File Storage** (Composer):
   ```
   @fileService.ts Convert to Supabase Storage.

   Implement:
   - uploadFile() to Supabase Storage
   - getFiles() from files table
   - downloadFile() with signed URLs
   - deleteFile() with cascade to storage

   Reference: CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 4
   ```

---

### Phase 5: Dashboard Data

**Cursor Workflow:**

```
@tasks @deadlines @approvals Create migrations and convert services for dashboard entities.

Use Composer to edit all three services simultaneously.
Enable YOLO mode for auto-testing.
```

---

### Phase 6: Billing & Stripe

**Cursor Workflow:**

1. **Stripe Setup**:
   ```
   @lib/stripe Create Stripe client utility and webhook handler.
   Reference: SUPABASE_BACKEND_INTEGRATION_PLAN.md section 5.7
   ```

2. **Billing Service**:
   ```
   @billingService.ts Convert to Stripe + Supabase.
   Implement subscription management, payment methods, invoices.
   ```

3. **Webhook Testing** (YOLO Mode):
   - Cursor will auto-test webhook scenarios
   - Auto-fix signature validation
   - Test event processing

---

### Phase 7: Funder & Admin

**Cursor Workflow:**

```
@cohortService.ts @adminService.ts Final service conversions.
Enable YOLO mode for batch processing.
```

---

## 🧪 Testing Strategy with Cursor

### Unit Tests

**Generate with Chat:**

```
@organizationService.ts Generate unit tests:
- Mock Supabase client
- Test all methods
- Test error handling
- Test RLS policy enforcement

Use Vitest and @supabase/ssr
Save to: __tests__/organizationService.test.ts
```

### Integration Tests

**Use Composer:**

```
Create integration test suite for authentication flow:
1. Sign up new user
2. Verify user in database
3. Sign in with credentials
4. Check session is valid
5. Sign out and verify session cleared

Save to: apps/shell/src/tests/integration/auth.integration.test.ts
```

### RLS Policy Tests

**Generate SQL tests:**

```
@supabase Generate RLS policy tests for organizations table:
- Test user can access own org
- Test user cannot access other org
- Test org_admin can update org
- Test member cannot update org

Save to: supabase/tests/organizations_rls.test.sql
```

### YOLO Mode for Test-Driven Development

**Workflow:**

1. Write failing test
2. Enable YOLO mode
3. Implement feature
4. Cursor auto-runs tests
5. Cursor auto-fixes until passing

**Example:**

```typescript
// Write test first
test('should create organization invite', async () => {
  const invite = await teamService.inviteTeamMember('new@example.com', 'member');
  expect(invite.status).toBe('pending');
});

// Enable YOLO, Cursor implements teamService.inviteTeamMember()
```

---

## 🚢 Deployment with Cursor

### Pre-Deployment Checklist

**Use Chat:**

```
@codebase Run pre-deployment checklist:
1. All migrations applied
2. All services converted (no localStorage)
3. All tests passing
4. Production build succeeds
5. Environment variables documented
6. RLS policies reviewed
7. No console.errors in production build

Generate checklist markdown report.
```

### Deploy to Vercel

**Use Terminal:**

```bash
# Cursor will suggest these commands
vercel --prod

# Or use GitHub integration (Cursor will create PR)
git push origin feature/supabase-backend-integration
```

### Post-Deployment Monitoring

**Use Chat:**

```
@codebase Add Sentry error tracking and Vercel Analytics.
Configure environment variables for production.
```

---

## 📊 Progress Tracking

### Daily Checklist (Use Cursor Tasks)

Create tasks in Cursor (`Cmd/Ctrl + Shift + T`):

```markdown
## Week 1
- [ ] Phase 1.1: Supabase project setup
- [ ] Phase 1.2: Users migration
- [ ] Phase 1.3: Supabase clients
- [ ] Phase 1.4: Auth endpoints
- [ ] Phase 1.5: profileService conversion
- [ ] Phase 1.6: Auth tests passing

## Week 2
- [ ] Phase 2.1: Organizations migration
- [ ] Phase 2.2: organizationService conversion
- [ ] Phase 2.3: teamService conversion
- [ ] Phase 2.4: Email invites working
- [ ] Phase 2 tests passing
```

Cursor will:
- Show progress in sidebar
- Auto-check completed tasks
- Suggest next task

### Weekly Review

**Use Chat:**

```
@codebase Generate progress report:
- Services converted (X/10)
- Tests passing (X/total)
- Migrations applied (X/18)
- RLS policies implemented (X/total)
- Build status
- Blockers

Format as markdown table.
```

---

## 🆘 Common Issues & Cursor Solutions

### Issue 1: RLS Policy Too Restrictive

**Symptom:** Query returns empty when data exists

**Cursor Solution:**

```
@errors RLS policy is blocking query. Debug RLS for organizations table:
1. Show current policy SQL
2. Explain why query fails
3. Suggest policy fix
4. Generate test to verify fix
```

### Issue 2: TypeScript Errors After Migration

**Cursor Solution:**

```
@errors Fix TypeScript errors caused by Supabase type changes.
Regenerate types and update affected files.
```

YOLO Mode will auto-fix!

### Issue 3: Realtime Not Connecting

**Cursor Solution:**

```
@notificationService.ts Debug Realtime subscription.
Check:
1. Supabase project has Realtime enabled
2. RLS allows subscription
3. Channel name is correct
4. Filter syntax is valid

Fix and test connection.
```

---

## 🎓 Cursor Keyboard Shortcuts

Essential shortcuts for backend development:

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `Cmd/Ctrl + K` | Inline edit | Quick refactor in place |
| `Cmd/Ctrl + I` | Composer | Multi-file editing |
| `Cmd/Ctrl + L` | Chat | Ask questions, generate code |
| `Cmd/Ctrl + Shift + P` | Command Palette | Toggle YOLO, run commands |
| `Cmd/Ctrl + .` | Quick Fix | Fix TypeScript errors |
| `Cmd/Ctrl + Shift + M` | Problems Panel | View all errors |
| `Cmd/Ctrl + Shift + T` | Tasks | Track progress |
| `F5` | Debug | Start debugging |

---

## 📈 Success Metrics

Track these in Cursor Chat:

```
@codebase Calculate success metrics:
- Services converted: X/10 (target: 10/10)
- Tests passing: X/Y (target: 100%)
- RLS policies: X/Z (target: 100% coverage)
- API response time: <500ms (p95)
- Build time: <5 minutes
- Zero localStorage usage
- Zero mock data dependencies

Generate dashboard report.
```

---

## 🎁 Final Handoff Checklist

Before marking complete:

```
@codebase Final verification:

1. [ ] All migrations applied successfully
2. [ ] All 10 services converted to Supabase
3. [ ] All 100+ API endpoints implemented
4. [ ] RLS policies tested and verified
5. [ ] Real-time notifications working
6. [ ] File upload/download working
7. [ ] Stripe billing integrated
8. [ ] All tests passing (unit + integration)
9. [ ] Production build succeeds
10. [ ] No TypeScript errors
11. [ ] No console errors
12. [ ] Documentation updated
13. [ ] Environment variables documented
14. [ ] Deployed to staging
15. [ ] Load tested (1000 concurrent users)
16. [ ] Security audit passed

Generate final report with screenshots.
```

---

## 🚀 Ready to Start?

### Step 1: Open Cursor

```bash
cursor /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
```

### Step 2: Switch to Backend Branch

```bash
git checkout feature/supabase-backend-integration
```

### Step 3: Read Context Documents

In Cursor Chat (`Cmd/Ctrl + L`):

```
@SUPABASE_BACKEND_INTEGRATION_PLAN.md @CLINE_BACKEND_DEVELOPMENT_PROMPT.md

Summarize the backend implementation plan. What are the 7 phases and what gets built in each?
```

### Step 4: Start Phase 1

In Composer (`Cmd/Ctrl + I`):

```
Let's begin Phase 1: Foundation & Authentication.

First task: Create Supabase project and set up environment variables.

Guide me through:
1. Creating Supabase project
2. Configuring .env.local
3. Creating first migration (users tables)
4. Generating TypeScript types

Reference: CLINE_BACKEND_DEVELOPMENT_PROMPT.md Phase 1.1-1.2
```

### Step 5: Enable YOLO Mode

```
Cmd/Ctrl + Shift + P → "Cursor: Toggle YOLO Mode"
```

### Step 6: Let Cursor Guide You

Cursor will:
- ✅ Suggest next steps
- ✅ Generate code
- ✅ Run tests automatically
- ✅ Fix errors
- ✅ Track progress

---

## 📞 Support Resources

- **Cursor Discord:** https://discord.gg/cursor
- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Project Docs:** All in `/documentation/`

---

**Document Version:** 1.0
**Last Updated:** 2025-01-23
**Branch:** `feature/supabase-backend-integration`
**Status:** Ready for Cursor Implementation

**Next Step:** Open Cursor and start Phase 1! 🚀
