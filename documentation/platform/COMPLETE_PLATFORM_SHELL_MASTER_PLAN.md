# VISION Platform V2 — Complete Platform Shell Master Plan

**Document Version:** 1.0
**Created:** January 21, 2025
**Purpose:** End-to-end execution plan for complete platform shell redesign with solid foundation
**Status:** READY FOR EXECUTION

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Master Timeline: 7-Week Complete Redesign](#master-timeline-7-week-complete-redesign)
3. [Page-by-Page Execution Breakdown](#page-by-page-execution-breakdown)
4. [Agent Prompts for Every Page](#agent-prompts-for-every-page)
5. [Foundation Requirements](#foundation-requirements)
6. [Quality Checkpoints](#quality-checkpoints)
7. [Frontend Completion Criteria](#frontend-completion-criteria)
8. [Validation at Every Step](#validation-at-every-step)
9. [Handoff to Backend Integration](#handoff-to-backend-integration)

---

## Executive Summary

### What This Plan Delivers

**COMPLETE PLATFORM SHELL REDESIGN** across all 24 pages with:

- ✅ **100% Bold Color System compliance** (zero inline colors)
- ✅ **100% Glow UI component compliance** (zero native HTML elements)
- ✅ **100% WCAG 2.1 AA accessibility** (fully keyboard/screen reader accessible)
- ✅ **100% functional CTAs** (all buttons work or have intentional stubs)
- ✅ **85%+ test coverage** (comprehensive test suite)
- ✅ **Solid foundation** (ready for backend integration)
- ✅ **Production-ready frontend** (deployable to staging/production)

### Timeline

**7 weeks (280 hours)** = **6.5 weeks work + 0.5 week buffer**

- **Weeks 1-2:** Foundation (colors + components) — **40% complete**
- **Weeks 3-4:** Functionality (CTAs + consolidation) — **70% complete**
- **Weeks 5-6:** Polish (accessibility + refinement) — **95% complete**
- **Week 7:** Final validation and launch prep — **100% complete**

### Success Definition

**Platform Shell is COMPLETE when:**

1. All 24 pages pass ALL 8 validation checks
2. Design system 100% compliant (automated validation)
3. All user flows functional (manual testing)
4. Accessibility 100% WCAG 2.1 AA (Storybook + manual)
5. Test coverage 85%+ (automated coverage report)
6. Stakeholder UAT approved
7. Ready for backend API integration

---

## Master Timeline: 7-Week Complete Redesign

### High-Level Phases

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: FOUNDATION (Weeks 1-2)                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ • Design System Compliance (Colors + Components)                │
│ • Critical Navigation Fixes                                     │
│ • Test Infrastructure Setup                                     │
│ • Baseline Quality Established                                  │
│ Output: 40% pages production-ready                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: FUNCTIONALITY (Weeks 3-4)                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ • CTA Wiring (forms, actions, navigation)                       │
│ • Service Layer Stubs                                           │
│ • User Flow Validation                                          │
│ • App Catalog Consolidation                                     │
│ Output: 70% pages production-ready                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: POLISH & ACCESSIBILITY (Weeks 5-6)                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ • WCAG 2.1 AA Compliance                                        │
│ • Responsive Design Validation                                  │
│ • Typography & Spacing Refinement                               │
│ • Performance Optimization                                      │
│ Output: 95% pages production-ready                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: VALIDATION & LAUNCH PREP (Week 7)                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ • Full Platform Regression Testing                              │
│ • UAT with Stakeholders                                         │
│ • Documentation Complete                                        │
│ • Launch Readiness Checklist                                    │
│ Output: 100% COMPLETE — READY FOR BACKEND INTEGRATION           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page-by-Page Execution Breakdown

### All 24 Pages with Complete Execution Plan

#### 📊 **Page 1: Dashboard** (`/dashboard`)

**Priority:** P0 - Critical
**Total Effort:** 16 hours
**Execution Order:** Week 1 (Colors → Components → CTAs)

**Issues to Fix:**
1. **Colors (Week 1 Mon):** 5 inline hex colors → Bold tokens (3h)
2. **Components (Week 1 Wed):** 1 native button → GlowButton (1h)
3. **CTAs (Week 3 Wed):** Wire "Ask VISION AI", "Share update" (8h)
4. **Accessibility (Week 5):** Add aria-labels, test keyboard nav (2h)
5. **Polish (Week 6):** Typography, spacing cleanup (2h)

**Agent Assignments:**
- Agent 001 (Colors): Week 1 Monday
- Agent 002 (Components): Week 1 Wednesday
- Agent 004 (CTAs): Week 3 Wednesday
- Agent 003 (A11y): Week 5
- Agent 001 (Polish): Week 6

**Success Criteria:**
- [ ] Zero inline colors (validate-colors passing)
- [ ] Zero native elements (validate-components passing)
- [ ] "Ask VISION AI" functional (opens modal, sends query)
- [ ] "Share update" functional (form validation, submission)
- [ ] All interactive elements keyboard accessible
- [ ] Tests: 85%+ coverage, all passing

**Prompt Assignment:**
```
Agent 001: AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md
→ Assignment: "Dashboard page - Fix 5 color violations from audit Phase 2.1"

Agent 002: AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md
→ Assignment: "Dashboard page - Replace 1 native button with GlowButton"

Agent 004: AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md (to be created)
→ Assignment: "Dashboard page - Wire Ask AI and Share update CTAs"
```

---

#### 📱 **Page 2: Applications Catalog** (`/applications`)

**Priority:** P1 - High
**Total Effort:** 12 hours
**Execution Order:** Week 1-3 (Colors → Components → CTAs)

**Issues to Fix:**
1. **Colors (Week 1 Tue):** 7 inline colors → Bold tokens (4h)
2. **Components (Week 1 Wed):** 2 native selects → GlowSelect (2h)
3. **CTAs (Week 3 Thu):** Wire "Enable app", "Add to favorites" (4h)
4. **Accessibility (Week 5):** Add aria-pressed to filter toggles (2h)

**Agent Assignments:**
- Agent 001: Week 1 Tuesday (colors)
- Agent 002: Week 1 Wednesday (components)
- Agent 004: Week 3 Thursday (CTAs)
- Agent 003: Week 5 (accessibility)

**Success Criteria:**
- [ ] App enable/disable toggles persist (localStorage)
- [ ] Favorites persist across sessions
- [ ] Filter toggles have aria-pressed
- [ ] All tests passing

---

#### 🔄 **Page 3: Apps (Duplicate)** (`/apps`)

**Priority:** P0 - DELETE/REDIRECT
**Total Effort:** 1 hour
**Execution Order:** Week 3 Monday

**Action:**
- Create redirect to `/applications`
- Remove from navigation
- Update all internal links

**Agent Assignment:**
- Agent 004: Week 3 Monday

**Success Criteria:**
- [ ] `/apps` redirects to `/applications`
- [ ] Zero direct links to `/apps` remain
- [ ] Navigation updated

---

#### 🗂️ **Page 4: App Catalog (Legacy)** (`/app-catalog`)

**Priority:** P0 - DELETE/REDIRECT
**Total Effort:** 1 hour
**Execution Order:** Week 3 Monday

**Action:**
- Create redirect to `/applications`
- Remove from navigation

**Agent Assignment:**
- Agent 004: Week 3 Monday

---

#### 📄 **Page 5: App Detail** (`/apps/[slug]`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 2-3

**Issues to Fix:**
1. **Colors (Week 2 Mon):** 4 color violations (2h)
2. **Launch Paths (Week 3):** Fix broken app launch paths (3h)
3. **Accessibility (Week 5):** Keyboard navigation (1h)

**Agent Assignments:**
- Agent 001: Week 2 Monday
- Agent 004: Week 3
- Agent 003: Week 5

**Success Criteria:**
- [ ] App launch buttons work correctly
- [ ] Coming soon apps show proper messaging
- [ ] All metadata displays correctly

---

#### 🚀 **Page 6: App Onboarding** (`/apps/[slug]/onboarding`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 3-4

**Issues to Fix:**
1. **Mock Steps (Week 3):** Replace fake stepper with real flow (4h)
2. **Form Validation (Week 4):** Add proper validation (2h)

**Agent Assignment:**
- Agent 004: Week 3-4

---

#### 🔔 **Page 7: Notifications** (`/notifications`)

**Priority:** P1 - High
**Total Effort:** 4 hours
**Execution Order:** Week 2-4

**Issues to Fix:**
1. **Colors (Week 2 Mon):** 1 opacity hack → proper token (1h)
2. **Persistence (Week 4):** Mark as read/delete functionality (2h)
3. **Accessibility (Week 5):** Icon button labels (1h)

**Agent Assignments:**
- Agent 001: Week 2 Monday
- Agent 004: Week 4
- Agent 003: Week 5

---

#### 📁 **Page 8: Files** (`/files`)

**Priority:** P0 - Critical
**Total Effort:** 8 hours
**Execution Order:** Week 2-4

**Issues to Fix:**
1. **Colors (Week 2 Tue):** 6 Tailwind grays → Bold tokens (3h)
2. **Accessibility (Week 5):** Table caption, file status labels (2h)
3. **CTAs (Week 4):** Upload/download/delete actions (3h)

**Agent Assignments:**
- Agent 001: Week 2 Tuesday
- Agent 004: Week 4
- Agent 003: Week 5

---

#### ⚙️ **Page 9: Settings — Profile** (`/settings/profile`)

**Priority:** P0 - Critical
**Total Effort:** 7 hours
**Execution Order:** Week 1-4

**Issues to Fix:**
1. **Colors (Week 1 Thu AM):** 4 violations (2h)
2. **Components (Week 1 Thu PM):** 3 inputs, 1 textarea → Glow (3h)
3. **Save Button (Week 4):** Wire profile save (2h)

**Agent Assignments:**
- Agent 001: Week 1 Thursday AM
- Agent 002: Week 1 Thursday PM
- Agent 004: Week 4

---

#### 🏢 **Page 10: Settings — Organization** (`/settings/organization`)

**Priority:** P0 - Critical
**Total Effort:** 10 hours
**Execution Order:** Week 2-4

**Issues to Fix:**
1. **Colors (Week 2):** 8 arbitrary hex colors (4h)
2. **Components (Week 2):** 2 inputs, 1 select, color picker (5h)
3. **Save Button (Week 4):** Wire organization save (1h)

**Agent Assignments:**
- Agent 001: Week 2
- Agent 002: Week 2
- Agent 004: Week 4

---

#### 👥 **Page 11: Settings — Team** (`/settings/team`)

**Priority:** P0 - Critical
**Total Effort:** 8 hours
**Execution Order:** Week 2-4

**Issues to Fix:**
1. **Colors (Week 2 Thu):** 3 violations (2h)
2. **Components (Week 2 Fri):** 2 selects, 1 input, 3 buttons (4h)
3. **Team Actions (Week 4 Tue):** Invite/resend/remove (2h)

**Agent Assignments:**
- Agent 001: Week 2 Thursday
- Agent 002: Week 2 Friday
- Agent 004: Week 4 Tuesday

---

#### 🎯 **Page 12: Settings — Apps** (`/settings/apps`)

**Priority:** P0 - Critical
**Total Effort:** 4 hours
**Execution Order:** Week 2-4

**Issues to Fix:**
1. **Colors (Week 2 Thu):** text-emerald-500 (1h)
2. **Components (Week 2):** 1 switch (2h)
3. **Toggle Persistence (Week 4):** Enable/disable apps (1h)

**Agent Assignments:**
- Agent 001: Week 2 Thursday
- Agent 002: Week 2
- Agent 004: Week 4

---

#### 💳 **Page 13: Settings — Billing** (`/settings/billing`)

**Priority:** P0 - Critical
**Total Effort:** 11 hours
**Execution Order:** Week 2-5

**Issues to Fix:**
1. **Colors (Week 2):** Minor cleanup (1h)
2. **Accessibility (Week 5):** Table caption, status labels (2h)
3. **Billing CTAs (Week 4 Mon):** All billing actions (8h)

**Agent Assignments:**
- Agent 001: Week 2
- Agent 003: Week 5
- Agent 004: Week 4 Monday (FULL DAY - complex)

---

#### 💰 **Page 14: Funder Dashboard** (`/funder`)

**Priority:** P1 - High
**Total Effort:** 8 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3 Tue):** 5 inline colors (2h)
2. **CTAs (Week 5):** Review actions (4h)
3. **Accessibility (Week 5):** Labels and keyboard nav (2h)

**Agent Assignments:**
- Agent 001: Week 3 Tuesday
- Agent 004: Week 5
- Agent 003: Week 5

---

#### 🤝 **Page 15: Funder — Grantees** (`/funder/grantees`)

**Priority:** P0 - Critical
**Total Effort:** 10 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3 Tue):** 3 RGB bars (3h)
2. **Components (Week 4):** 2 selects, 1 input (3h)
3. **Invite Grantee (Week 4 Wed):** Wire invite form (2h)
4. **Accessibility (Week 5):** Table caption (2h)

**Agent Assignments:**
- Agent 001: Week 3 Tuesday
- Agent 002: Week 4
- Agent 004: Week 4 Wednesday
- Agent 003: Week 5

---

#### 👨‍🎓 **Page 16: Funder — Cohorts** (`/funder/cohorts`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3):** Minor cleanup (1h)
2. **CTAs (Week 5):** Cohort actions (3h)
3. **Accessibility (Week 5):** aria-labels (2h)

**Agent Assignments:**
- Agent 001: Week 3
- Agent 004: Week 5
- Agent 003: Week 5

---

#### 🎛️ **Page 17: Admin Dashboard** (`/admin`)

**Priority:** P0 - Critical (Navigation Broken!)
**Total Effort:** 6 hours
**Execution Order:** Week 1-4

**Issues to Fix:**
1. **Colors + Nav Fix (Week 1 Fri):** text-emerald + broken nav (3h)
2. **CTAs (Week 4 Thu):** Platform stats, quick actions (3h)

**Agent Assignments:**
- Agent 001: Week 1 Friday (CRITICAL - nav broken)
- Agent 004: Week 4 Thursday

---

#### 🏛️ **Page 18: Admin — Organizations** (`/admin/organizations`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3):** Minor cleanup (1h)
2. **Components (Week 4):** 2 inputs, 2 selects (4h)
3. **Accessibility (Week 5):** Table caption (1h)

**Agent Assignments:**
- Agent 001: Week 3
- Agent 002: Week 4
- Agent 003: Week 5

---

#### 👤 **Page 19: Admin — Users** (`/admin/users`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3 Fri):** text-emerald-500 (1h)
2. **Persistence (Week 4):** User status toggles (3h)
3. **Accessibility (Week 5):** aria attributes (2h)

**Agent Assignments:**
- Agent 001: Week 3 Friday
- Agent 004: Week 4
- Agent 003: Week 5

---

#### 📱 **Page 20: Admin — Apps** (`/admin/apps`)

**Priority:** P0 - Critical
**Total Effort:** 5 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3):** Minor cleanup (1h)
2. **Confirmation Dialogs (Week 4):** Add confirms for enable/disable (2h)
3. **Accessibility (Week 5):** Labels (2h)

**Agent Assignments:**
- Agent 001: Week 3
- Agent 004: Week 4
- Agent 003: Week 5

---

#### 💵 **Page 21: Admin — Billing** (`/admin/billing`)

**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3):** Minor cleanup (1h)
2. **CTAs (Week 4):** Billing admin actions (3h)
3. **Accessibility (Week 5):** Table captions (2h)

**Agent Assignments:**
- Agent 001: Week 3
- Agent 004: Week 4
- Agent 003: Week 5

---

#### ⚙️ **Page 22: Admin — Settings** (`/admin/settings`)

**Priority:** P0 - Critical
**Total Effort:** 5 hours
**Execution Order:** Week 3-4

**Issues to Fix:**
1. **Colors (Week 3 Fri):** Arbitrary hex (2h)
2. **Save Actions (Week 4):** Wire platform settings save (3h)

**Agent Assignments:**
- Agent 001: Week 3 Friday
- Agent 004: Week 4

---

#### 📈 **Page 23: Admin — Analytics** (`/admin/analytics`)

**Priority:** P1 - High
**Total Effort:** 5 hours
**Execution Order:** Week 3-5

**Issues to Fix:**
1. **Colors (Week 3):** Chart colors (2h)
2. **Export Actions (Week 4):** Export reports (2h)
3. **Accessibility (Week 5):** Chart labels (1h)

**Agent Assignments:**
- Agent 001: Week 3
- Agent 004: Week 4
- Agent 003: Week 5

---

#### ❓ **Page 24: Help** (`/help`)

**Priority:** P0 - Critical (404!)
**Total Effort:** 4 hours OR 0.5 hours
**Execution Order:** Week 1 Friday

**Options:**
1. **Remove:** Delete link from navigation (0.5h)
2. **Redirect:** Point to external docs (0.5h)
3. **Build:** Create help page (4h)

**Agent Assignment:**
- Agent 001 or Agent 004: Week 1 Friday (after decision)

---

## Agent Prompts for Every Page

### Master Prompt Structure

Each page requires **3-5 agent prompts** following this pattern:

```
1. COLOR COMPLIANCE (Agent 001)
   Prompt: AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md
   Assignment: "[PAGE] - Fix [N] color violations from audit Phase 2.[X]"

2. COMPONENT MIGRATION (Agent 002)
   Prompt: AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md
   Assignment: "[PAGE] - Replace [N] native elements with Glow components"

3. CTA FUNCTIONALITY (Agent 004)
   Prompt: AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md
   Assignment: "[PAGE] - Wire [ACTIONS] CTAs with proper feedback"

4. ACCESSIBILITY (Agent 003)
   Prompt: AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md
   Assignment: "[PAGE] - Add [ARIA/LABELS/CAPTIONS] for WCAG 2.1 AA"

5. TESTING (Agent 006)
   Prompt: AGENT_PROMPT_TESTING_COVERAGE_SPECIALIST.md
   Assignment: "[PAGE] - Ensure 85%+ test coverage"
```

### Page-Specific Prompt Examples

#### Example 1: Dashboard (Complete Flow)

```markdown
WEEK 1 MONDAY — COLOR COMPLIANCE
═══════════════════════════════════════════════════════════════

Agent: 001 (Color Compliance Specialist)
Prompt File: AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md

Assignment Instruction:
"You are Agent 001: Color Compliance Specialist.

Your assignment: Dashboard page located at /apps/shell/src/app/dashboard/page.tsx

Fix the following 5 color violations documented in audit Phase 2.1:
1. Line 42: Inline hex #0047AB on h1 element
2. Line 67: Arbitrary color text-[#047857] on success text
3. Line 103: Inline backgroundColor #F8FAFC on card
4. Line 156: Generic Tailwind text-emerald-500 on badge
5. Line 189: Opacity hack bg-primary/10 on section

Replace all with Bold Color System v3.0 tokens per your mapping schema.

Begin execution now following Phase 1, Step 1.1 of your prompt."

Expected Output:
- Branch: fix/ux-audit-dashboard-colors
- PR with 2 approvals
- All validation passing
- Time: 3 hours
```

```markdown
WEEK 1 WEDNESDAY — COMPONENT MIGRATION
═══════════════════════════════════════════════════════════════

Agent: 002 (Component Migration Specialist)
Prompt File: AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md

Assignment Instruction:
"You are Agent 002: Component Migration Specialist.

Your assignment: Dashboard page located at /apps/shell/src/app/dashboard/page.tsx

Prerequisites:
- ✅ Dashboard colors PR merged (Agent 001 completed Monday)

Fix the following 1 native element violation documented in audit Phase 2.1:
1. Line 134: Native <button> for 'Ask VISION AI' action

Replace with GlowButton variant="primary" with icon.

Note: onChange signature for GlowButton is SAME as native button (no change needed).

Begin execution now following Phase 1, Step 1.1 of your prompt."

Expected Output:
- Branch: fix/ux-audit-dashboard-components
- PR with 2 approvals
- Component validation passing
- Time: 1 hour
```

```markdown
WEEK 3 WEDNESDAY — CTA FUNCTIONALITY
═══════════════════════════════════════════════════════════════

Agent: 004 (CTA Functionality Specialist)
Prompt File: AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md

Assignment Instruction:
"You are Agent 004: CTA Functionality Specialist.

Your assignment: Dashboard page located at /apps/shell/src/app/dashboard/page.tsx

Prerequisites:
- ✅ Dashboard colors PR merged (Week 1)
- ✅ Dashboard components PR merged (Week 1)

Wire the following 2 CTAs documented in audit Phase 2.1:

1. 'Ask VISION AI' button (line ~134):
   - Open GlowModal with AI chat interface
   - Create aiService with sendQuery method
   - Add loading state (isLoading)
   - Add toast feedback (success/error)
   - Validate query input (not empty)

2. 'Share update' button (line ~178):
   - Open GlowModal with share form
   - Create shareService with postUpdate method
   - Add form validation (content required, max 500 chars)
   - Add loading state
   - Add toast feedback

Use service layer pattern from audit Appendix C.

If backend API not ready, use localStorage stubs with toast: 'Feature coming soon!'

Begin execution now following your prompt's CTA wiring workflow."

Expected Output:
- Branch: fix/ux-audit-dashboard-ctas
- PR with 2 approvals
- 2 CTAs functional with user feedback
- Time: 8 hours
```

#### Example 2: Settings Team (Complete Flow)

```markdown
WEEK 2 THURSDAY — COLOR COMPLIANCE
═══════════════════════════════════════════════════════════════

Agent: 001
Assignment: "Settings Team page - Fix 3 color violations from Phase 2.10"
Time: 2 hours
```

```markdown
WEEK 2 FRIDAY — COMPONENT MIGRATION
═══════════════════════════════════════════════════════════════

Agent: 002
Assignment: "Settings Team page - Replace 2 selects, 1 input, 3 buttons with Glow components"
Critical: onChange signature changes for GlowSelect!
Time: 4 hours
```

```markdown
WEEK 4 TUESDAY — CTA FUNCTIONALITY
═══════════════════════════════════════════════════════════════

Agent: 004
Assignment: "Settings Team page - Wire Send invite, Resend, Remove, Cancel actions"
Requirements:
- Email validation on invite form
- Confirmation dialog for Remove and Cancel
- Toast feedback for all actions
- Team service with localStorage persistence
Time: 2 hours
```

---

## Foundation Requirements

### What "Solid Foundation" Means

**A solid platform shell foundation includes:**

#### 1. Design System Foundation ✅

```
✓ Bold Color System v3.0 implemented (all tokens defined)
✓ Glow UI component library complete (15+ components)
✓ Tailwind config optimized (no arbitrary values allowed)
✓ Typography system consistent (font sizes, weights, line heights)
✓ Spacing system consistent (padding, margins, gaps)
✓ Shadow/glow effects standardized (ambient, interactive)
```

**Validation:**
```bash
pnpm validate:colors → 0 violations
pnpm validate:components → 0 violations
```

#### 2. Component Architecture Foundation ✅

```
✓ All pages use functional React components
✓ TypeScript strict mode enabled (no 'any' types)
✓ Consistent prop interfaces
✓ Reusable component patterns extracted
✓ No duplicate component logic
✓ Clear component hierarchy
```

**Validation:**
```bash
pnpm type-check → 0 errors
pnpm lint → 0 errors, 0 warnings
```

#### 3. Routing Foundation ✅

```
✓ Next.js 15 App Router properly implemented
✓ Async params pattern used consistently
✓ All routes return 200 (no 404s except intentional)
✓ Redirects properly configured
✓ Route guards implemented (admin, funder)
✓ Deep linking supported
```

**Validation:**
```bash
pnpm test -- routes.test.ts → all routes accessible
```

#### 4. State Management Foundation ✅

```
✓ React useState/useReducer for local state
✓ React Context for global state (theme, user)
✓ Custom hooks for reusable logic
✓ localStorage for client-side persistence
✓ Ready for backend API integration (service layer pattern)
```

**Validation:**
```bash
pnpm test -- state.test.ts → state management works
```

#### 5. Accessibility Foundation ✅

```
✓ WCAG 2.1 AA compliant
✓ Semantic HTML throughout
✓ ARIA attributes on all interactive elements
✓ Keyboard navigation fully functional
✓ Screen reader tested (VoiceOver/NVDA)
✓ Color contrast meets 4.5:1 minimum
```

**Validation:**
```bash
pnpm storybook → Storybook a11y addon shows 0 violations
Manual: Keyboard test all pages
Manual: Screen reader test all pages
```

#### 6. Testing Foundation ✅

```
✓ Vitest configured and running
✓ React Testing Library setup
✓ 85%+ code coverage
✓ Component tests for all pages
✓ Integration tests for user flows
✓ Accessibility tests automated
```

**Validation:**
```bash
pnpm test → all tests passing
pnpm test --coverage → 85%+ coverage
```

#### 7. Build & Deployment Foundation ✅

```
✓ Next.js production build succeeds
✓ Bundle size optimized
✓ Environment variables configured
✓ Error boundaries implemented
✓ 404/500 error pages styled
✓ Loading states on all async operations
```

**Validation:**
```bash
pnpm build → successful build
Lighthouse audit → Performance 90+, Accessibility 100
```

---

## Quality Checkpoints

### Daily Checkpoint (Every Day)

**Time:** End of day (5:00 PM)

**Checklist:**
- [ ] All PRs created today have 2 reviewers assigned
- [ ] All validation checks passing on open PRs
- [ ] No blocking merge conflicts
- [ ] Progress tracker updated
- [ ] Tomorrow's work assigned

**Owner:** Remediation Lead

---

### Weekly Checkpoint (Every Friday)

**Time:** 4:00 PM (Weekly Demo)

#### Week 1 Checkpoint

**Goal:** Foundation established (colors + components)

**Metrics:**
- [ ] 4 pages 100% color compliant (Dashboard, Applications, Settings Profile, Admin Dashboard)
- [ ] 3 pages 100% component compliant
- [ ] Zero validation failures on merged PRs
- [ ] Test coverage: 65%+
- [ ] Critical nav issue fixed (Admin dashboard)

**Demo:**
- Show before/after: Dashboard (inline colors → Bold tokens)
- Show color validation script in action
- Show component validation script in action

**Go/No-Go for Week 2:**
- ✅ GO if: All Week 1 pages merged, validation passing
- ⚠️ PAUSE if: >3 PRs still in review, validation failing

---

#### Week 2 Checkpoint

**Goal:** Expand foundation (12 pages total)

**Metrics:**
- [ ] 12 pages color compliant (50% of platform)
- [ ] 6 pages component compliant (25% of platform)
- [ ] Test coverage: 75%+
- [ ] All Settings pages have proper form elements

**Demo:**
- Show Settings Team: native selects → GlowSelect
- Show form validation working
- Show consistent styling across all Settings pages

**Go/No-Go for Week 3:**
- ✅ GO if: All Week 1-2 pages merged, foundation solid
- ⚠️ PAUSE if: Design system violations found, need to fix before CTAs

---

#### Week 3 Checkpoint

**Goal:** Add functionality (CTAs + consolidation)

**Metrics:**
- [ ] 18 pages color compliant (75% of platform)
- [ ] App catalog consolidated (single source of truth)
- [ ] Dashboard CTAs functional
- [ ] Applications CTAs functional
- [ ] Test coverage: 78%+

**Demo:**
- Show app catalog consolidation (3 → 1)
- Show Dashboard "Ask AI" working
- Show Applications "Enable app" persisting

**Go/No-Go for Week 4:**
- ✅ GO if: Core CTAs working, no regressions
- ⚠️ PAUSE if: Major functionality broken, need to fix

---

#### Week 4 Checkpoint

**Goal:** Complete functionality layer

**Metrics:**
- [ ] All colors compliant (100%) ✅
- [ ] All components compliant (100%) ✅
- [ ] 80% CTAs functional
- [ ] All forms have validation
- [ ] Test coverage: 82%+

**Demo:**
- Show Settings Billing: all actions working
- Show Settings Team: invite flow complete
- Show Funder: grantee invite working

**Go/No-Go for Week 5:**
- ✅ GO if: Functionality stable, ready for accessibility layer
- ⚠️ PAUSE if: Too many broken CTAs, need more time

---

#### Week 5 Checkpoint

**Goal:** Accessibility compliance

**Metrics:**
- [ ] All table captions added (7 tables)
- [ ] All filter toggles have aria-pressed (24)
- [ ] All status badges have sr-only text (15+)
- [ ] All icon buttons have aria-labels (15+)
- [ ] Keyboard navigation 90% complete
- [ ] Test coverage: 85%+

**Demo:**
- Show keyboard navigation through Dashboard
- Show screen reader reading status updates
- Show Storybook a11y addon (0 violations)

**Go/No-Go for Week 6:**
- ✅ GO if: Accessibility 90%+, all critical items done
- ⚠️ PAUSE if: Major a11y violations remain

---

#### Week 6 Checkpoint

**Goal:** Polish and refinement

**Metrics:**
- [ ] Accessibility 100% WCAG 2.1 AA ✅
- [ ] Typography 100% consistent
- [ ] Spacing 100% consistent
- [ ] Responsive design validated (mobile, tablet, desktop)
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Test coverage: 87%+

**Demo:**
- Show full platform walkthrough (all 24 pages)
- Show mobile responsive design
- Show performance metrics

**Go/No-Go for Week 7:**
- ✅ GO if: Platform 95%+ complete, ready for final validation
- ⚠️ PAUSE if: Major issues found, need more time

---

#### Week 7 Final Checkpoint

**Goal:** Launch readiness

**Metrics:**
- [ ] 100% compliance across all dimensions ✅
- [ ] All 24 pages pass all 8 validation checks ✅
- [ ] UAT completed and approved ✅
- [ ] Documentation complete ✅
- [ ] Launch runbook ready ✅
- [ ] Test coverage: 87%+ ✅

**Final Demo:**
- Executive walkthrough (all stakeholders)
- Show compliance dashboard (all green)
- Show validation passing
- Q&A session

**Go/No-Go for Launch:**
- ✅ GO if: All criteria met, stakeholders approve
- ❌ NO-GO if: Critical issues found, need to address

---

## Frontend Completion Criteria

### **Platform Shell is 100% COMPLETE when:**

#### ✅ **Dimension 1: Design System Compliance**

```
[✓] Bold Color System v3.0
    ├─ Zero inline hex colors (validate-colors → 0)
    ├─ Zero arbitrary Tailwind colors
    ├─ Zero opacity hacks
    └─ 100% semantic token usage

[✓] Glow UI Component Library
    ├─ Zero native <select> elements
    ├─ Zero native <input> elements (except type="hidden")
    ├─ Zero native <textarea> elements
    ├─ Zero native <button> elements (all use GlowButton)
    └─ 100% design system components (validate-components → 0)

[✓] Typography System
    ├─ Consistent font families (Inter variable)
    ├─ Consistent font sizes (text-sm, text-base, text-lg, etc.)
    ├─ Consistent font weights (font-normal, font-medium, font-semibold, font-bold)
    └─ Consistent line heights

[✓] Spacing System
    ├─ No arbitrary spacing values (space-[13px])
    ├─ Consistent padding (p-2, p-4, p-6, p-8)
    ├─ Consistent margins (m-2, m-4, m-6, m-8)
    └─ Consistent gaps (gap-2, gap-4, gap-6, gap-8)
```

**Validation:**
```bash
✅ pnpm validate:colors
✅ pnpm validate:components
✅ Visual inspection: all pages match design system
```

---

#### ✅ **Dimension 2: Functionality**

```
[✓] Navigation
    ├─ All sidebar links work (no 404s)
    ├─ Breadcrumbs functional
    ├─ Back/forward browser navigation works
    └─ Deep linking supported

[✓] Forms
    ├─ All forms have validation (Zod schemas)
    ├─ All forms show error messages
    ├─ All forms have loading states
    ├─ All forms show success/error feedback (toasts)
    └─ All forms persist data appropriately

[✓] CTAs (Call-to-Actions)
    ├─ 100% buttons functional or intentionally stubbed
    ├─ All buttons show loading states during async
    ├─ All buttons have user feedback (toast/modal)
    ├─ All destructive actions have confirmation dialogs
    └─ All toggles persist state (localStorage/backend)

[✓] Data Display
    ├─ All tables display data correctly
    ├─ All filters work
    ├─ All sorting works (where applicable)
    ├─ All pagination works (where applicable)
    └─ All search functionality works
```

**Validation:**
```bash
✅ Manual testing: Complete all user flows
✅ Automated tests: pnpm test (all passing)
✅ No console.log in production
```

---

#### ✅ **Dimension 3: Accessibility (WCAG 2.1 AA)**

```
[✓] Semantic HTML
    ├─ Proper heading hierarchy (h1 → h2 → h3)
    ├─ All tables have <caption>
    ├─ All forms use <label> elements
    ├─ All buttons use <button> (not <div onClick>)
    └─ Landmarks used (header, nav, main, aside, footer)

[✓] ARIA Attributes
    ├─ All icon buttons have aria-label
    ├─ All toggles have aria-pressed
    ├─ All modals have role="dialog" and aria-labelledby
    ├─ All status messages have role="status"
    └─ All form errors have aria-describedby

[✓] Keyboard Navigation
    ├─ All interactive elements reachable via Tab
    ├─ Focus visible on all elements
    ├─ Escape closes modals/dropdowns
    ├─ Enter/Space activates buttons
    └─ Arrow keys navigate menus (where applicable)

[✓] Screen Reader Support
    ├─ All images have alt text
    ├─ All status indicators have sr-only text
    ├─ All form errors announced
    ├─ All page changes announced
    └─ All dynamic content changes announced

[✓] Color Contrast
    ├─ Text contrast ≥ 4.5:1 (normal text)
    ├─ Large text contrast ≥ 3:1 (18pt+)
    ├─ UI component contrast ≥ 3:1
    └─ No color-only indicators (always paired with text/icon)
```

**Validation:**
```bash
✅ Storybook a11y addon → 0 violations
✅ Manual keyboard test → all pages navigable
✅ Manual screen reader test → all content announced
✅ Lighthouse accessibility audit → 100 score
```

---

#### ✅ **Dimension 4: Testing**

```
[✓] Test Coverage
    ├─ Overall coverage: 85%+
    ├─ Component tests: 90%+
    ├─ Integration tests: 80%+
    └─ E2E tests: Critical flows covered

[✓] Test Quality
    ├─ All tests follow AAA pattern (Arrange, Act, Assert)
    ├─ All tests are deterministic (no flaky tests)
    ├─ All tests use React Testing Library best practices
    ├─ All tests have descriptive names
    └─ All edge cases tested

[✓] Test Types
    ├─ Component tests (render, props, events)
    ├─ Interaction tests (user events)
    ├─ Accessibility tests (keyboard, aria)
    ├─ Visual regression tests (snapshots)
    └─ Integration tests (user flows)
```

**Validation:**
```bash
✅ pnpm test --coverage → 85%+ coverage
✅ pnpm test → 0 failing tests
✅ All critical user flows have E2E tests
```

---

#### ✅ **Dimension 5: Code Quality**

```
[✓] TypeScript
    ├─ Strict mode enabled
    ├─ Zero 'any' types
    ├─ All function params typed
    ├─ All function returns typed
    └─ All interfaces documented

[✓] ESLint
    ├─ Zero errors
    ├─ Zero warnings
    ├─ Custom rules enforced (no console.log, etc.)
    └─ Consistent code style

[✓] React Best Practices
    ├─ Functional components only (no class components)
    ├─ Proper hook usage (dependencies correct)
    ├─ No prop drilling (Context used appropriately)
    ├─ Memoization where beneficial
    └─ Keys on list items

[✓] File Organization
    ├─ Clear folder structure
    ├─ Co-located tests
    ├─ Consistent naming conventions
    └─ No duplicate code
```

**Validation:**
```bash
✅ pnpm type-check → 0 errors
✅ pnpm lint → 0 errors, 0 warnings
✅ Code review → all PRs approved
```

---

#### ✅ **Dimension 6: Performance**

```
[✓] Build Optimization
    ├─ Production build succeeds
    ├─ Bundle size optimized (<500KB initial)
    ├─ Code splitting implemented
    ├─ Lazy loading for routes
    └─ Image optimization (next/image)

[✓] Runtime Performance
    ├─ First Contentful Paint < 1.5s
    ├─ Largest Contentful Paint < 2.5s
    ├─ Time to Interactive < 3.5s
    ├─ Cumulative Layout Shift < 0.1
    └─ No memory leaks

[✓] Lighthouse Scores
    ├─ Performance: 90+
    ├─ Accessibility: 100
    ├─ Best Practices: 95+
    └─ SEO: 90+
```

**Validation:**
```bash
✅ pnpm build → successful build
✅ Lighthouse audit → all scores meet targets
✅ Bundle analyzer → no large unnecessary dependencies
```

---

#### ✅ **Dimension 7: Documentation**

```
[✓] Code Documentation
    ├─ All components have JSDoc comments
    ├─ All complex functions documented
    ├─ All props interfaces documented
    └─ README files for each package

[✓] User Documentation
    ├─ Storybook stories for all components
    ├─ Component usage examples
    ├─ Design system documentation
    └─ Accessibility guidelines

[✓] Developer Documentation
    ├─ Setup instructions (README.md)
    ├─ Architecture overview
    ├─ Contributing guidelines
    ├─ Testing strategy
    └─ Deployment guide
```

**Validation:**
```bash
✅ Storybook build successful
✅ All major components have stories
✅ README complete and up-to-date
```

---

#### ✅ **Dimension 8: Launch Readiness**

```
[✓] Environment Configuration
    ├─ Development environment working
    ├─ Staging environment working
    ├─ Production environment configured
    └─ Environment variables documented

[✓] Error Handling
    ├─ Error boundaries implemented
    ├─ 404 page styled
    ├─ 500 page styled
    ├─ Toast notifications for errors
    └─ Logging configured (Sentry/DataDog)

[✓] Security
    ├─ No hardcoded secrets
    ├─ CSRF protection enabled
    ├─ XSS prevention (React default + CSP)
    ├─ Rate limiting on forms
    └─ Input sanitization

[✓] Stakeholder Approval
    ├─ Design team sign-off ✅
    ├─ Product owner sign-off ✅
    ├─ QA sign-off ✅
    ├─ UAT completed ✅
    └─ CTO/Engineering lead sign-off ✅
```

**Validation:**
```bash
✅ All environments accessible
✅ Error pages render correctly
✅ Security audit passed
✅ All stakeholders approved
```

---

## Validation at Every Step

### The 8 Validation Checks (Run Before Every PR)

```bash
# 1. TypeScript Type Checking
pnpm type-check
# Must pass: 0 errors

# 2. ESLint Validation
pnpm lint
# Must pass: 0 errors, 0 warnings

# 3. Color Token Validation
pnpm validate:colors
# Must pass: 0 inline hex/RGB colors found

# 4. Component Usage Validation
pnpm validate:components
# Must pass: 0 native form elements found

# 5. Unit Tests
pnpm test
# Must pass: All tests passing, 85%+ coverage

# 6. Build Validation
pnpm build
# Must pass: Successful production build

# 7. Storybook A11y Validation
pnpm build-storybook
# Must pass: 0 accessibility violations

# 8. Visual Regression (Manual)
pnpm dev
# Must pass: Screenshots match expected appearance
```

**Automated in CI/CD:**
```yaml
# .github/workflows/validation.yml
# Runs checks 1-6 automatically on every PR
```

---

## Handoff to Backend Integration

### When Frontend is 100% Complete

**You have a SOLID FOUNDATION ready for backend integration when:**

#### ✅ **Service Layer Pattern Established**

```typescript
// All CTAs use consistent service layer pattern
// Example: apps/shell/src/services/teamService.ts

export const teamService = {
  async inviteMember(email: string, role: string): Promise<void> {
    // CURRENT: localStorage stub
    const invites = JSON.parse(localStorage.getItem('team-invites') || '[]');
    invites.push({ email, role, sentAt: new Date().toISOString() });
    localStorage.setItem('team-invites', JSON.stringify(invites));

    // FUTURE: Replace with API call
    // await api.post('/team/invites', { email, role });
  },

  async removeMember(memberId: string): Promise<void> {
    // CURRENT: localStorage stub
    const members = JSON.parse(localStorage.getItem('team-members') || '[]');
    const updated = members.filter(m => m.id !== memberId);
    localStorage.setItem('team-members', JSON.stringify(updated));

    // FUTURE: Replace with API call
    // await api.delete(`/team/members/${memberId}`);
  }
};
```

**Backend Integration Steps:**
1. Keep service interface unchanged
2. Replace localStorage with API calls
3. Add error handling
4. Add loading states (already in UI)
5. Tests continue to pass (mock API)

---

#### ✅ **Clear API Requirements Documented**

```markdown
# API Endpoints Needed for Backend Team

## Team Management API

### POST /api/team/invites
Request: { email: string, role: string }
Response: { inviteId: string, sentAt: string }

### DELETE /api/team/members/:memberId
Request: { memberId: string }
Response: { success: boolean }

### GET /api/team/members
Response: { members: Member[] }

(Continue for all 21 pages...)
```

---

#### ✅ **TypeScript Interfaces Defined**

```typescript
// All data models already defined in frontend
// Backend can use same interfaces

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  status: 'active' | 'invited' | 'inactive';
}

export interface TeamInvite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expiresAt: string;
}
```

---

#### ✅ **Error Handling Ready**

```typescript
// All CTAs already have error handling
// Just need to wire to real API errors

try {
  await teamService.inviteMember(email, role);
  toast.success('Invite sent successfully!');
} catch (error) {
  // Frontend already handles errors
  toast.error(error.message || 'Failed to send invite');
  console.error('Invite error:', error);
}
```

---

### Backend Integration Checklist

**When frontend complete, backend team can:**

- [ ] Review service layer interfaces
- [ ] Implement matching API endpoints
- [ ] Use same TypeScript interfaces
- [ ] Test with frontend (replace localStorage calls)
- [ ] Deploy API to staging
- [ ] Update frontend env vars (API_URL)
- [ ] Full integration testing
- [ ] Deploy to production

**Frontend requires ZERO changes** (just env vars) because service layer pattern is established.

---

## Summary: Complete Path to Solid Foundation

```
WEEK 1-2: FOUNDATION
├─ Design system compliance (colors + components)
├─ Critical navigation fixes
├─ Test infrastructure
└─ 40% pages complete

WEEK 3-4: FUNCTIONALITY
├─ CTA wiring (forms + actions)
├─ Service layer stubs
├─ User flows validated
└─ 70% pages complete

WEEK 5-6: POLISH
├─ WCAG 2.1 AA accessibility
├─ Responsive design
├─ Performance optimization
└─ 95% pages complete

WEEK 7: LAUNCH PREP
├─ Final validation
├─ UAT approval
├─ Documentation complete
└─ 100% COMPLETE ✅

RESULT: SOLID PLATFORM SHELL FOUNDATION
├─ 100% design system compliant
├─ 100% functional
├─ 100% accessible
├─ 85%+ test coverage
├─ Ready for backend integration
└─ PRODUCTION READY 🚀
```

---

**END OF COMPLETE PLATFORM SHELL MASTER PLAN**

**Status:** READY FOR EXECUTION
**Next Step:** Begin Week 1, Monday with Agent 001 on Dashboard page
**Total Effort:** 280 hours (7 weeks)
**Expected Completion:** 100% solid foundation, production-ready frontend
