# Cursor Agent Prompt: Community Compass Completion

## Context

You are working on the **Community Compass** application within the VISION Platform V2 monorepo. This is a Next.js 15 application using React 19, TypeScript, Supabase, and Anthropic's Claude API.

**Current Status:** 70% complete - core workflow functional but missing critical production features.

**Your Mission:** Complete the remaining 30% to achieve production readiness by following the detailed implementation plan.

---

## Critical Instructions

### Project Architecture Rules

1. **ALWAYS use the AppShell layout** - Never create page-specific headers or sidebars
2. **ALWAYS use Glow UI components** - Located in `apps/shell/src/components/glow-ui/`
3. **ALWAYS follow 2911 Bold Color System** - Use `vision-blue-950`, `vision-green-700`, etc.
4. **ALWAYS implement RLS policies** - All tables must enforce row-level security
5. **ALWAYS use TypeScript** - Strict mode, no `any` types without justification
6. **ALWAYS write tests** - Target 80% coverage for all new code

### File Locations

```
Working Directory: /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/
Main App: apps/shell/src/
Services: apps/shell/src/services/
Components: apps/shell/src/components/
API Routes: apps/shell/src/app/api/
Migrations: supabase/migrations/
```

### Reference Documents

- **Complete Implementation Plan:** `docs/COMMUNITY_COMPASS_COMPLETION_REPORT.md` (88 pages)
- **PRD:** `documentation/CommunityCompass_PRD_Complete_v1.1.md`
- **Project Guidelines:** `CLAUDE.md`
- **Current Implementation:** `apps/shell/src/app/community-compass/`

---

## Phase 1: Critical MVP Features (Priority Order)

### Task 1: Export Functionality Implementation

**Goal:** Enable users to export completed assessments as PDF, DOCX, and Markdown files.

**Status:** Currently has placeholder buttons with `console.log` - needs full implementation.

**Steps:**

1. **Install Dependencies**
   ```bash
   cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
   pnpm add react-pdf @react-pdf/renderer docx marked date-fns
   pnpm add -D @types/marked
   ```

2. **Create Export Service**
   - File: `apps/shell/src/services/exportService.ts`
   - Implement methods: `exportAsPDF()`, `exportAsDOCX()`, `exportAsMarkdown()`
   - Include all assessment data: focus statement, chips, empathy map, needs, personas
   - Follow the complete code example in `docs/COMMUNITY_COMPASS_COMPLETION_REPORT.md` Section 1

3. **Create Export API Route**
   - File: `apps/shell/src/app/api/assessments/[id]/export/route.ts`
   - POST endpoint accepting `{ format: 'pdf' | 'docx' | 'markdown' }`
   - Authenticate user and verify assessment ownership via RLS
   - Fetch all assessment data from database
   - Call export service and return file as blob
   - Follow code example in Section 1 of completion report

4. **Update Profile Page**
   - File: `apps/shell/src/app/community-compass/assessments/[id]/profile/page.tsx`
   - Replace `console.log` placeholder in `handleExport()` with actual API call
   - Implement download flow using blob URL
   - Add loading states for each export format
   - Show toast notifications on success/error
   - Follow code example in Section 1 of completion report

5. **Add Database Fields**
   - Create migration: `supabase/migrations/20251126000000_add_export_fields.sql`
   - Add columns: `empathy_narrative TEXT`, `personas JSONB`
   - Run migration against database

6. **Test Export Functionality**
   - Create test assessment with all data populated
   - Export as PDF - verify formatting and content
   - Export as DOCX - verify opens in Microsoft Word
   - Export as Markdown - verify syntax correctness
   - Test with incomplete assessments (missing sections)
   - Verify RLS prevents cross-org exports

**Acceptance Criteria:**
- [ ] All three export formats generate valid files
- [ ] Files download with correct filenames
- [ ] All assessment sections included in exports
- [ ] Visual formatting matches Glow UI design
- [ ] Toast notifications show success/error
- [ ] Export works for incomplete assessments (with warnings)

**Files to Create/Modify:**
- ✅ CREATE: `apps/shell/src/services/exportService.ts`
- ✅ CREATE: `apps/shell/src/app/api/assessments/[id]/export/route.ts`
- ✅ MODIFY: `apps/shell/src/app/community-compass/assessments/[id]/profile/page.tsx`
- ✅ CREATE: `supabase/migrations/20251126000000_add_export_fields.sql`

---

### Task 2: Service Layer Extraction

**Goal:** Extract business logic from page components into reusable service files to enable testing and maintainability.

**Status:** Logic currently embedded in pages and API routes - needs refactoring.

**Steps:**

1. **Create Assessment Service**
   - File: `apps/shell/src/services/assessmentService.ts`
   - Implement: `create()`, `getById()`, `getAll()`, `update()`, `delete()`, `updateScreen()`, `updateStatus()`, `saveFocusStatement()`
   - Include error classes: `AssessmentNotFoundError`, `AssessmentValidationError`
   - Use Supabase client-side SDK
   - Follow complete code example in Section 2 of completion report

2. **Create Chip Service**
   - File: `apps/shell/src/services/chipService.ts`
   - Implement: `getByAssessment()`, `createMany()`, `toggleSelection()`, `updateText()`, `delete()`, `getSelectedByCategory()`
   - Handle custom chips, editing, and AI-generated chips
   - Follow code example in Section 2 of completion report

3. **Create Need Service**
   - File: `apps/shell/src/services/needService.ts`
   - Implement: `create()`, `getByAssessment()`, `update()`, `delete()`
   - Handle urgency/impact/evidence levels
   - Support AI-suggested needs flag

4. **Create AI Generation Service**
   - File: `apps/shell/src/services/aiGenerationService.ts`
   - Implement: `generateChips()`, `generateFocusStatement()`, `generateEmpathyNarrative()`, `generatePersonas()`
   - Use Anthropic SDK with model `claude-3-sonnet-20240229`
   - Ensure strength-based language in prompts
   - Follow code example in Section 2 of completion report

5. **Refactor API Routes to Use Services**
   - Update: `apps/shell/src/app/api/assessments/route.ts`
   - Update: `apps/shell/src/app/api/ai/generate-chips/route.ts`
   - Update: `apps/shell/src/app/api/ai/generate-focus-statement/route.ts`
   - Replace inline logic with service calls
   - Keep only auth and HTTP handling in routes

6. **Refactor Page Components to Use Services**
   - Update: `apps/shell/src/app/community-compass/assessments/[id]/page.tsx`
   - Update: `apps/shell/src/app/community-compass/assessments/[id]/empathy-map/page.tsx`
   - Update: `apps/shell/src/app/community-compass/assessments/[id]/needs/page.tsx`
   - Replace direct API calls with service calls
   - Simplify component logic

**Acceptance Criteria:**
- [ ] All services created with TypeScript types
- [ ] API routes use services (no business logic in routes)
- [ ] Page components use services (cleaner code)
- [ ] Error handling consistent across services
- [ ] No code duplication between files
- [ ] All services export typed interfaces

**Files to Create/Modify:**
- ✅ CREATE: `apps/shell/src/services/assessmentService.ts`
- ✅ CREATE: `apps/shell/src/services/chipService.ts`
- ✅ CREATE: `apps/shell/src/services/needService.ts`
- ✅ CREATE: `apps/shell/src/services/aiGenerationService.ts`
- ✅ MODIFY: `apps/shell/src/app/api/assessments/route.ts`
- ✅ MODIFY: `apps/shell/src/app/api/ai/generate-chips/route.ts`
- ✅ MODIFY: `apps/shell/src/app/api/ai/generate-focus-statement/route.ts`
- ✅ MODIFY: All page components in `apps/shell/src/app/community-compass/assessments/[id]/`

---

### Task 3: Error Handling Infrastructure

**Goal:** Implement production-grade error handling with structured errors, error boundaries, and proper user messaging.

**Status:** Currently uses generic errors and console logging - needs comprehensive error system.

**Steps:**

1. **Create Error Classes**
   - File: `apps/shell/src/lib/errors.ts`
   - Implement: `ApplicationError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `AIServiceError`, `RateLimitError`
   - Each error should have: code, message, statusCode, details, toJSON()
   - Follow code example in Section 4 of completion report

2. **Create Error Handler Middleware**
   - File: `apps/shell/src/lib/errorHandler.ts`
   - Implement: `handleApiError(error)` function
   - Convert errors to proper HTTP responses
   - Include error codes and request IDs
   - Log to console (Sentry integration later)

3. **Update All API Routes to Use Error Handler**
   - Wrap all route handlers in try/catch
   - Throw specific error types (not generic Error)
   - Return `handleApiError(error)` in catch blocks
   - Example:
     ```typescript
     export async function POST(request: NextRequest) {
       try {
         if (!user) throw new AuthenticationError();
         if (!body.title) throw new ValidationError('Title required');
         // ... logic
       } catch (error) {
         return handleApiError(error);
       }
     }
     ```

4. **Create Error Boundary Component**
   - File: `apps/shell/src/components/ErrorBoundary.tsx`
   - Implement React Error Boundary class component
   - Show user-friendly error UI with reload button
   - Use Glow UI components (GlowCard, GlowButton)
   - Follow code example in Section 4 of completion report

5. **Wrap Pages in Error Boundaries**
   - Update: `apps/shell/src/app/community-compass/layout.tsx`
   - Wrap children with `<ErrorBoundary>`
   - Provide custom fallback UI for Community Compass errors

6. **Improve User-Facing Error Messages**
   - Replace all `console.error()` with proper error handling
   - Show toast notifications for user actions (using `sonner`)
   - Display inline error messages in forms
   - Never show raw error stack traces to users

**Acceptance Criteria:**
- [ ] All error types implemented with proper hierarchy
- [ ] API routes return structured error responses
- [ ] Error boundaries catch React errors
- [ ] User sees helpful error messages (not technical jargon)
- [ ] Errors logged to console in development
- [ ] No unhandled promise rejections

**Files to Create/Modify:**
- ✅ CREATE: `apps/shell/src/lib/errors.ts`
- ✅ CREATE: `apps/shell/src/lib/errorHandler.ts`
- ✅ CREATE: `apps/shell/src/components/ErrorBoundary.tsx`
- ✅ MODIFY: All API route files in `apps/shell/src/app/api/`
- ✅ MODIFY: `apps/shell/src/app/community-compass/layout.tsx`

---

### Task 4: Input Validation with Zod

**Goal:** Add runtime input validation to all API endpoints and forms using Zod schemas.

**Status:** No input validation - accepts any data.

**Steps:**

1. **Create Validation Schemas**
   - File: `apps/shell/src/lib/validation/schemas.ts`
   - Implement schemas:
     - `createAssessmentSchema` (title, targetPopulation, geographicArea)
     - `updateAssessmentSchema` (partial updates)
     - `createNeedSchema` (title, description, category, levels)
     - `createChipSchema` (text, category, assessmentId)
   - Export TypeScript types using `z.infer<>`
   - Follow code example in Section 15 of completion report

2. **Apply Validation in API Routes**
   - Update all POST/PATCH routes to validate request body
   - Use `schema.parse(body)` - throws ZodError on failure
   - Catch ZodError and convert to ValidationError
   - Example:
     ```typescript
     const validatedData = createAssessmentSchema.parse(body);
     ```

3. **Apply Validation in Forms**
   - Update form components to use React Hook Form + Zod
   - Use `zodResolver` for form validation
   - Show validation errors inline in forms
   - Example:
     ```typescript
     const { register, handleSubmit, formState: { errors } } = useForm({
       resolver: zodResolver(createAssessmentSchema),
     });
     ```

4. **Add Sanitization**
   - Trim whitespace in string fields
   - Validate UUID formats for IDs
   - Enforce max lengths on text fields
   - Validate enum values

**Acceptance Criteria:**
- [ ] All API endpoints validate input
- [ ] Forms show validation errors before submission
- [ ] Invalid requests return 400 with helpful messages
- [ ] Type safety between forms and API (shared schemas)
- [ ] SQL injection prevented by validation

**Files to Create/Modify:**
- ✅ CREATE: `apps/shell/src/lib/validation/schemas.ts`
- ✅ MODIFY: All API route files
- ✅ MODIFY: `apps/shell/src/app/community-compass/assessments/new/page.tsx`
- ✅ MODIFY: All form components

---

### Task 5: Basic Unit Testing Setup

**Goal:** Set up testing infrastructure and write tests for critical services (target 80% coverage).

**Status:** No tests exist - needs test framework and initial test suite.

**Steps:**

1. **Configure Vitest**
   - File: `vitest.config.ts` (root directory)
   - Set up jsdom environment
   - Configure path aliases (@/ mapping)
   - Set coverage thresholds (80% lines, 80% functions)
   - Follow config in Section 5 of completion report

2. **Create Test Setup File**
   - File: `apps/shell/src/test/setup.ts`
   - Configure testing library
   - Set up Supabase mocks
   - Set up Anthropic API mocks

3. **Write Assessment Service Tests**
   - File: `apps/shell/src/services/__tests__/assessmentService.test.ts`
   - Test cases:
     - `create()` with valid data
     - `create()` with invalid data (throws ValidationError)
     - `getById()` returns assessment
     - `getById()` throws NotFoundError
     - `update()` updates assessment
     - Input trimming and sanitization
   - Follow code example in Section 5 of completion report

4. **Write Chip Service Tests**
   - File: `apps/shell/src/services/__tests__/chipService.test.ts`
   - Test cases:
     - `getByAssessment()` returns chips
     - `toggleSelection()` updates selection state
     - `updateText()` marks chip as edited
     - `getSelectedByCategory()` groups correctly

5. **Write AI Service Tests**
   - File: `apps/shell/src/services/__tests__/aiGenerationService.test.ts`
   - Test cases:
     - `generateChips()` returns 8-12 chips
     - Chips are under 15 words
     - Strength-based language (no deficit framing)
     - Mock Anthropic API responses

6. **Add Test Scripts to package.json**
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

7. **Run Tests and Fix Failures**
   ```bash
   pnpm test
   ```

**Acceptance Criteria:**
- [ ] Vitest configured and working
- [ ] 80%+ coverage for all services
- [ ] Tests pass in CI/CD
- [ ] Clear test descriptions
- [ ] Mock external dependencies (Supabase, Anthropic)
- [ ] Test both success and error cases

**Files to Create/Modify:**
- ✅ CREATE: `vitest.config.ts`
- ✅ CREATE: `apps/shell/src/test/setup.ts`
- ✅ CREATE: `apps/shell/src/services/__tests__/assessmentService.test.ts`
- ✅ CREATE: `apps/shell/src/services/__tests__/chipService.test.ts`
- ✅ CREATE: `apps/shell/src/services/__tests__/aiGenerationService.test.ts`
- ✅ MODIFY: `package.json` (add test scripts)

---

## Phase 2: Infrastructure & State Management

### Task 6: TanStack Query Integration

**Goal:** Replace manual state management with TanStack Query for better caching, optimistic updates, and simpler code.

**Steps:**

1. **Install Dependencies**
   ```bash
   pnpm add @tanstack/react-query @tanstack/react-query-devtools
   ```

2. **Create Query Client**
   - File: `apps/shell/src/lib/queryClient.ts`
   - Configure with 5min stale time, 10min cache time
   - Follow code example in Section 3 of completion report

3. **Wrap App in Provider**
   - Update: `apps/shell/src/app/layout.tsx`
   - Add `<QueryClientProvider>`
   - Add `<ReactQueryDevtools>` in development

4. **Create Query Hooks**
   - File: `apps/shell/src/hooks/useAssessments.ts`
   - Implement: `useAssessment()`, `useAssessments()`, `useCreateAssessment()`, `useUpdateAssessment()`
   - Include optimistic updates for mutations
   - Follow code example in Section 3 of completion report

5. **Create Additional Hooks**
   - File: `apps/shell/src/hooks/useChips.ts`
   - File: `apps/shell/src/hooks/useNeeds.ts`
   - Similar patterns to assessment hooks

6. **Refactor Components to Use Hooks**
   - Replace `useState` + `useEffect` patterns
   - Use query hooks for data fetching
   - Use mutation hooks for create/update/delete
   - Remove manual loading states

**Acceptance Criteria:**
- [ ] TanStack Query configured
- [ ] All data fetching uses `useQuery`
- [ ] All mutations use `useMutation`
- [ ] Optimistic updates working
- [ ] Cache invalidation working
- [ ] Loading/error states automatic
- [ ] Devtools available in development

---

### Task 7: Rate Limiting Implementation

**Goal:** Prevent API abuse with token bucket rate limiting on AI endpoints.

**Steps:**

1. **Install Dependencies**
   ```bash
   pnpm add @upstash/ratelimit @upstash/redis
   ```

2. **Set Up Upstash Redis**
   - Create free account at upstash.com
   - Create Redis database
   - Copy credentials to `.env.local`:
     ```
     UPSTASH_REDIS_REST_URL=
     UPSTASH_REDIS_REST_TOKEN=
     ```

3. **Create Rate Limiter**
   - File: `apps/shell/src/lib/rateLimit.ts`
   - Implement token bucket algorithm
   - AI endpoints: 10 per minute, max 20 tokens
   - API endpoints: 100 per minute
   - Follow code example in Section 8 of completion report

4. **Apply to AI Routes**
   - Update all routes in `apps/shell/src/app/api/ai/`
   - Check rate limit before processing
   - Return 429 with retry-after on limit exceeded
   - Add rate limit headers to responses

**Acceptance Criteria:**
- [ ] Rate limiting active on AI endpoints
- [ ] Returns 429 when limit exceeded
- [ ] Headers show remaining requests
- [ ] Per-user limits enforced
- [ ] Tokens replenish over time

---

### Task 8: Claude Sonnet 4 Upgrade

**Goal:** Upgrade from Claude Sonnet 3 to Sonnet 4 for better AI quality.

**Steps:**

1. **Update Model ID**
   - File: `apps/shell/src/services/aiGenerationService.ts`
   - Change: `claude-3-sonnet-20240229` → `claude-sonnet-4-20250514`
   - Update in all AI generation methods

2. **Test Prompt Compatibility**
   - Run AI generation tests
   - Verify chip quality
   - Verify focus statement quality
   - Adjust prompts if needed

3. **Update Documentation**
   - Update `CLAUDE.md`
   - Update `COMMUNITY_COMPASS_COMPLETION_REPORT.md`
   - Note model version in comments

**Acceptance Criteria:**
- [ ] All AI generation uses Sonnet 4
- [ ] Tests pass with new model
- [ ] Output quality maintained or improved
- [ ] Documentation updated

---

## Phase 3: UX Enhancements

### Task 9: Progress Indicator & Auto-Save

**Goal:** Add visual progress tracking across 4 screens and automatic draft saving.

**Steps:**

1. **Create Progress Component**
   - File: `apps/shell/src/components/community-compass/AssessmentProgress.tsx`
   - Show 4 steps with completion states
   - Use Glow UI styling
   - Follow code example in Section 10 of completion report

2. **Add to Layout**
   - Update: `apps/shell/src/app/community-compass/assessments/[id]/layout.tsx`
   - Show progress bar above all screens
   - Update current screen on navigation

3. **Implement Auto-Save**
   - File: `apps/shell/src/hooks/useAutoSave.ts`
   - Debounce saves (2 second delay)
   - Save focus statement, chips selection, etc.
   - Show "Saving..." / "Saved" indicator

**Acceptance Criteria:**
- [ ] Progress indicator shows on all screens
- [ ] Completed steps show checkmarks
- [ ] Auto-save works after 2 seconds of inactivity
- [ ] User sees "Saved" confirmation

---

### Task 10: AI Needs Suggestion

**Goal:** Implement AI-powered needs suggestion based on assessment data.

**Status:** Button exists but not implemented - needs full feature.

**Steps:**

1. **Add Service Method**
   - Update: `apps/shell/src/services/aiGenerationService.ts`
   - Implement: `suggestNeeds()` method
   - Takes: targetPopulation, selectedChips, focusStatement
   - Returns: 5 suggested needs with categories/levels
   - Follow code example in Section 11 of completion report

2. **Create API Route**
   - File: `apps/shell/src/app/api/ai/suggest-needs/route.ts`
   - POST endpoint
   - Fetch assessment and chips from DB
   - Call AI service
   - Return suggestions
   - Apply rate limiting

3. **Update Needs Page**
   - Update: `apps/shell/src/app/community-compass/assessments/[id]/needs/page.tsx`
   - Implement `handleGetSuggestions()` function
   - Display suggestions in cards
   - Allow user to add suggested needs with one click
   - Show rationale for each suggestion

**Acceptance Criteria:**
- [ ] "Get AI Suggestions" button works
- [ ] Returns 5 relevant needs
- [ ] Each suggestion has category/urgency/impact/evidence
- [ ] User can add suggestions to list
- [ ] Rate limiting prevents abuse

---

## Phase 4: Database & Security

### Task 11: Database Schema Enhancements

**Goal:** Add missing fields and optimize database performance.

**Steps:**

1. **Add Missing Fields**
   - Create: `supabase/migrations/20251126000001_enhance_schema.sql`
   - Add to `community_assessments`:
     - `empathy_narrative TEXT`
     - `personas JSONB`
     - `metadata JSONB`
     - `published_at TIMESTAMPTZ`
     - `deleted_at TIMESTAMPTZ`
   - Follow SQL in Section 6 of completion report

2. **Add Performance Indexes**
   - Create: `supabase/migrations/20251126000002_add_indexes.sql`
   - Add indexes on:
     - `organization_id`
     - `status`
     - `created_at`
     - Composite index on `assessment_id, is_selected` for chips
   - Follow SQL in Section 14 of completion report

3. **Run Migrations**
   ```bash
   npx supabase db push
   ```

**Acceptance Criteria:**
- [ ] All fields added successfully
- [ ] Indexes created
- [ ] Query performance improved
- [ ] No breaking changes to existing code

---

### Task 12: Organization-Level RLS Migration

**Goal:** Migrate from user-based to organization-based RLS policies for proper multi-tenancy.

**Steps:**

1. **Create New RLS Policies**
   - Create: `supabase/migrations/20251126000003_migrate_to_org_rls.sql`
   - Drop user-based policies
   - Create org-based policies
   - Policies should check `organization_members` table
   - Follow SQL in Section 7 of completion report

2. **Test RLS Policies**
   - Create test script
   - Verify users can only access their org's assessments
   - Verify admins have elevated permissions
   - Verify cross-org access is blocked

**Acceptance Criteria:**
- [ ] RLS policies use organization_id
- [ ] Users can access all org assessments
- [ ] Admins can edit all org assessments
- [ ] Cross-org access blocked
- [ ] Tests pass

---

## Testing & Documentation

### Task 13: Integration Tests

**Goal:** Write integration tests for all API endpoints.

**Steps:**

1. **Create Test Files**
   - File: `apps/shell/src/app/api/assessments/__tests__/route.test.ts`
   - Test: POST creates assessment
   - Test: GET returns assessment
   - Test: 401 when not authenticated
   - Test: 404 when not found
   - Follow code example in Section 5 of completion report

2. **Test AI Endpoints**
   - Test chip generation
   - Test focus statement generation
   - Test needs suggestion
   - Test rate limiting

**Acceptance Criteria:**
- [ ] All endpoints have tests
- [ ] Tests cover success and error cases
- [ ] Tests verify RLS enforcement
- [ ] Tests run in CI/CD

---

### Task 14: E2E Tests with Playwright

**Goal:** Write end-to-end tests for complete user workflows.

**Steps:**

1. **Install Playwright**
   ```bash
   pnpm add -D @playwright/test
   npx playwright install
   ```

2. **Create Test File**
   - File: `e2e/community-compass.spec.ts`
   - Test: Complete assessment workflow (all 4 screens)
   - Test: Export functionality
   - Test: Error handling
   - Follow code example in Section 5 of completion report

3. **Run Tests**
   ```bash
   npx playwright test
   ```

**Acceptance Criteria:**
- [ ] Complete workflow test passes
- [ ] Export test downloads files
- [ ] Error handling test works
- [ ] Tests run in headless mode

---

## Delivery Checklist

Before marking complete, verify:

### Functionality
- [ ] All 5 Phase 1 tasks completed
- [ ] Export works (PDF, DOCX, Markdown)
- [ ] Services extracted and tested
- [ ] Error handling implemented
- [ ] Input validation working
- [ ] Tests achieve 80% coverage

### Code Quality
- [ ] TypeScript strict mode (no `any`)
- [ ] Glow UI components used throughout
- [ ] 2911 color system followed
- [ ] AppShell layout respected
- [ ] No console.log in production code
- [ ] All tests passing

### Security
- [ ] RLS policies enforced
- [ ] Input validation on all endpoints
- [ ] Rate limiting on AI endpoints
- [ ] CSRF protection enabled
- [ ] No SQL injection vulnerabilities

### Documentation
- [ ] README updated
- [ ] API endpoints documented
- [ ] Services have JSDoc comments
- [ ] Environment variables documented

---

## Working Style

### When Starting Each Task:

1. **Read the task section above completely**
2. **Review the code example in `docs/COMMUNITY_COMPASS_COMPLETION_REPORT.md`**
3. **Check existing code in the mentioned files**
4. **Create a plan for implementation**
5. **Implement step by step**
6. **Test thoroughly**
7. **Check acceptance criteria**
8. **Move to next task**

### Best Practices:

- **Make small, incremental changes** - Don't refactor everything at once
- **Test after each change** - Run the app and verify functionality
- **Commit frequently** - Use meaningful commit messages
- **Ask for clarification** - If instructions unclear, ask before proceeding
- **Follow existing patterns** - Match the style of existing code
- **Document as you go** - Add comments for complex logic

### Common Pitfalls to Avoid:

❌ **Don't** create new UI patterns - use existing Glow components
❌ **Don't** skip tests - they prevent regressions
❌ **Don't** hardcode values - use environment variables
❌ **Don't** ignore TypeScript errors - fix them properly
❌ **Don't** commit commented-out code - delete it
❌ **Don't** use `any` type - define proper interfaces

✅ **Do** follow the AppShell layout pattern
✅ **Do** write tests before marking tasks complete
✅ **Do** use proper error handling
✅ **Do** validate all inputs
✅ **Do** update documentation
✅ **Do** check the completion report for examples

---

## Getting Help

If you encounter issues:

1. **Check `docs/COMMUNITY_COMPASS_COMPLETION_REPORT.md`** - 88 pages of detailed implementation guidance
2. **Check `CLAUDE.md`** - Project architecture and patterns
3. **Check `documentation/CommunityCompass_PRD_Complete_v1.1.md`** - Product requirements
4. **Review existing working code** - See how similar features are implemented
5. **Test incrementally** - Don't write too much before testing

---

## Success Criteria

### Phase 1 Complete When:
- Users can export assessments in all 3 formats
- Services are extracted and testable
- Errors are handled gracefully
- All inputs are validated
- Tests achieve 80% coverage

### Production Ready When:
- All phases complete
- All tests passing
- Security audit passed
- Performance benchmarks met
- Documentation complete

---

## Start Here

**Recommended Starting Point:** Task 1 - Export Functionality

This is the highest priority feature that directly impacts users. Once export works, users can actually deliver value from their assessments.

**Command to Begin:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
pnpm install
pnpm dev
```

Then open the completion report:
```bash
cat docs/COMMUNITY_COMPASS_COMPLETION_REPORT.md
```

And start implementing Task 1, Section 1.

Good luck! 🚀
