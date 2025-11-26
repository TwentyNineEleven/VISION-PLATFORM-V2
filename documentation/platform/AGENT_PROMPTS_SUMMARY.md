# VISION Platform V2 — Agent Prompts Summary & Task Assignment Matrix

**Document Version:** 1.0
**Created:** January 21, 2025
**Status:** READY FOR EXECUTION

---

## Agent Prompt Status

| Agent ID | Agent Name | Prompt Status | Framework Compliance | Pages Assigned |
|----------|------------|---------------|---------------------|----------------|
| **VISION-AGENT-001** | Color Compliance Specialist | ✅ COMPLETE | ✅ North Star Goal (A-J) | 18 pages |
| **VISION-AGENT-002** | Component Migration Specialist | ✅ COMPLETE | ✅ North Star Goal (A-J) | 8 pages |
| **VISION-AGENT-003** | Accessibility Enhancement Specialist | 🔄 IN PROGRESS | ✅ North Star Goal (A-J) | 20 pages |
| **VISION-AGENT-004** | CTA Functionality Specialist | 🔄 IN PROGRESS | ✅ North Star Goal (A-J) | 21 pages |
| **VISION-AGENT-005** | Validation & Quality Control Specialist | ✅ COMPLETE | ✅ North Star Goal (A-J) | All PRs |
| **VISION-AGENT-006** | Testing & Coverage Specialist | 🔄 IN PROGRESS | ✅ North Star Goal (A-J) | All changes |

---

## Complete Task Assignment Matrix

### Week 1: P0 Critical Fixes (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 001 | Dashboard color violations (5 issues) | Dashboard |
| **Tue** | 8h | Agent 001 | Applications color violations (7 issues) | Applications |
| **Wed** | 8h | Agent 002 | Dashboard + Applications native elements | Dashboard, Applications |
| **Thu** | 8h | Agent 001 + 002 | Settings Profile colors + components | Settings Profile |
| **Fri** | 8h | Agent 001 | Admin Dashboard colors, Admin nav fixes | Admin Dashboard |

**Agent 005:** Validates ALL PRs from Week 1 (continuous)
**Agent 006:** Writes tests for ALL changes (supports all agents)

---

### Week 2: P0 Continued (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 001 | App Detail + Notifications colors | App Detail, Notifications |
| **Tue** | 8h | Agent 001 | Files page color violations | Files |
| **Wed** | 8h | Agent 002 | Settings Organization native elements | Settings Organization |
| **Thu** | 8h | Agent 001 | Settings Team + Apps colors | Settings Team, Settings Apps |
| **Fri** | 8h | Agent 002 | Settings Team native elements | Settings Team |

---

### Week 3: P1 High Priority (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 004 | Consolidate app catalogs (redirect /apps, /app-catalog) | Apps, App Catalog |
| **Tue** | 8h | Agent 001 | Funder Dashboard + Grantees colors | Funder Dashboard, Funder Grantees |
| **Wed** | 8h | Agent 004 | Dashboard CTAs (Ask AI, Share update) | Dashboard |
| **Thu** | 8h | Agent 004 | Applications CTAs (Enable app, Favorites) | Applications |
| **Fri** | 8h | Agent 001 | Admin Users + Settings colors | Admin Users, Admin Settings |

---

### Week 4: P1 Continued (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 004 | Settings Billing CTAs (Change plan, Update payment) | Settings Billing |
| **Tue** | 8h | Agent 004 | Settings Team CTAs (Invite, Remove, Resend) | Settings Team |
| **Wed** | 8h | Agent 004 | Funder Portal CTAs (Invite grantee, Review) | Funder Grantees |
| **Thu** | 8h | Agent 004 | Admin Portal CTAs (Create org, Manage users) | Admin Dashboard, Admin Orgs |
| **Fri** | 8h | Agent 002 | Remaining native elements (Funder, Admin) | Funder Grantees, Admin Orgs |

---

### Week 5: P2 Medium Priority - Accessibility (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 003 | Add table captions (7 tables) | Settings Billing, Funder Grantees, Admin tables |
| **Tue** | 8h | Agent 003 | Add aria-pressed to filter toggles (24 instances) | All pages with filters |
| **Wed** | 8h | Agent 003 | Add textual status labels (color-only indicators) | All pages with status badges |
| **Thu** | 8h | Agent 003 | Add aria-label to icon buttons (15+ instances) | All pages |
| **Fri** | 8h | Agent 003 | Keyboard navigation testing and fixes | All pages |

---

### Week 6: P2 + Validation (40 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 8h | Agent 003 | Responsive design fixes (mobile, tablet) | All pages |
| **Tue** | 8h | Agent 001 | Typography cleanup (font sizes, weights) | All pages |
| **Wed** | 8h | Agent 001 | Spacing cleanup (padding, margins) | All pages |
| **Thu** | 8h | Agent 004 | Final CTA wiring (remaining 20%) | All remaining CTAs |
| **Fri** | 8h | Agent 005 + 006 | Full platform regression testing | All pages |

---

### Week 7: Buffer & Polish (20 hours)

| Day | Hours | Agent | Tasks | Pages |
|-----|-------|-------|-------|-------|
| **Mon** | 5h | All agents | Edge case fixes from regression | As needed |
| **Tue** | 5h | Agent 006 | Performance optimization | All pages |
| **Wed** | 5h | Agent 005 | Final QA validation and UAT | All pages |
| **Thu** | 5h | All agents | Documentation updates, launch prep | N/A |

---

## Agent-Specific Task Assignments

### Agent 001: Color Compliance Specialist

**Total Pages:** 18 pages with color violations
**Total Issues:** ~75 color violations
**Total Effort:** 60 hours (Week 1-3, Week 6)

#### Assigned Pages (Priority Order)

| Week | Page | Route | Issues | Hours |
|------|------|-------|--------|-------|
| 1 | Dashboard | `/dashboard` | 5 violations | 3h |
| 1 | Applications | `/applications` | 7 violations | 4h |
| 1 | Settings Profile | `/settings/profile` | 4 violations | 2h |
| 1 | Admin Dashboard | `/admin` | text-emerald-500 | 2h |
| 2 | App Detail | `/apps/[slug]` | 4 violations | 2h |
| 2 | Notifications | `/notifications` | 1 violation | 1h |
| 2 | Files | `/files` | 6 violations | 3h |
| 2 | Settings Team | `/settings/team` | 3 violations | 2h |
| 2 | Settings Apps | `/settings/apps` | text-emerald-500 | 1h |
| 3 | Funder Dashboard | `/funder` | 5 violations | 2h |
| 3 | Funder Grantees | `/funder/grantees` | RGB bars (3) | 3h |
| 3 | Admin Users | `/admin/users` | text-emerald-500 | 1h |
| 3 | Admin Settings | `/admin/settings` | Arbitrary hex | 2h |
| 2 | Settings Organization | `/settings/organization` | 8 violations | 4h |
| 2 | Settings Billing | `/settings/billing` | Minor cleanup | 1h |
| 3 | Funder Cohorts | `/funder/cohorts` | Minor cleanup | 1h |
| 3 | Admin Apps | `/admin/apps` | Minor cleanup | 1h |
| 3 | App Catalog | `/app-catalog` | Before redirect | 1h |

**North Star Goal:** 100% Bold Color System compliance (`validate-colors` → 0 violations)

---

### Agent 002: Component Migration Specialist

**Total Pages:** 8 pages with native elements
**Total Issues:** ~25 native element replacements
**Total Effort:** 32 hours (Week 1-4)

#### Assigned Pages (Priority Order)

| Week | Page | Route | Issues | Hours |
|------|------|-------|--------|-------|
| 1 | Dashboard | `/dashboard` | 1 button | 1h |
| 1 | Applications | `/applications` | 2 selects | 2h |
| 1 | Settings Profile | `/settings/profile` | 3 inputs, 1 textarea | 3h |
| 2 | Settings Organization | `/settings/organization` | 2 inputs, 1 select, color picker | 5h |
| 2 | Settings Team | `/settings/team` | 2 selects, 1 input, 3 buttons | 4h |
| 2 | Settings Apps | `/settings/apps` | 1 switch | 2h |
| 4 | Funder Grantees | `/funder/grantees` | 2 selects, 1 input | 3h |
| 4 | Admin Organizations | `/admin/organizations` | 2 inputs, 2 selects | 4h |

**North Star Goal:** 100% Glow UI component compliance (`validate-components` → 0 violations)

---

### Agent 003: Accessibility Enhancement Specialist

**Total Pages:** 20 pages with accessibility issues
**Total Issues:** ~100 accessibility enhancements
**Total Effort:** 48 hours (Week 5-6)

#### Assigned Tasks (by Issue Type)

**Week 5: Core Accessibility**

| Task Type | Count | Pages Affected | Hours |
|-----------|-------|----------------|-------|
| **Table Captions** | 7 tables | Settings Billing, Funder Grantees, Admin Orgs/Users/Billing | 8h |
| **aria-pressed** | 24 filter toggles | Applications, Funder pages, Admin pages | 8h |
| **Status Labels (sr-only)** | 15+ badges | All pages with status indicators | 8h |
| **Icon Button Labels** | 15+ buttons | Dashboard, Notifications, Settings | 8h |
| **Keyboard Navigation** | All interactive elements | All 24 pages | 8h |

**Week 6: Advanced Accessibility**

| Task Type | Hours |
|-----------|-------|
| Responsive fixes (mobile, tablet) | 8h |

**North Star Goal:** 100% WCAG 2.1 AA compliance (Storybook a11y → 0 violations)

---

### Agent 004: CTA Functionality Specialist

**Total Pages:** 21 pages with non-functional CTAs
**Total Issues:** ~200 CTAs to wire
**Total Effort:** 80 hours (Week 3-6)

#### Assigned Pages (Priority Order)

**Week 3: Foundation**

| Page | CTAs to Wire | Hours |
|------|--------------|-------|
| App Catalog Consolidation | Redirects | 8h |
| Dashboard | Ask AI, Share update, View all | 8h |
| Applications | Enable app, Favorites | 8h |

**Week 4: Core Functionality**

| Page | CTAs to Wire | Hours |
|------|--------------|-------|
| Settings Billing | Change plan, Update payment, Download invoice | 8h |
| Settings Team | Send invite, Resend, Remove, Cancel | 8h |
| Funder Grantees | Invite grantee, Review application | 8h |
| Admin Portal | Create org, Manage users, Configure | 8h |

**Week 5-6: Remaining CTAs**

| Task | Hours |
|------|-------|
| Settings Profile/Org save buttons | 4h |
| Files upload/download/delete | 4h |
| Notifications mark read/delete | 4h |
| Funder Dashboard review actions | 4h |
| Admin remaining CTAs | 4h |
| Final 20% wiring | 8h |

**North Star Goal:** 100% CTA functionality (all buttons work or show "Coming soon" toast)

---

### Agent 005: Validation & Quality Control Specialist

**Total Effort:** Continuous (Week 1-7)
**Total PRs to Validate:** ~50 PRs

#### Responsibilities

**Daily Tasks:**
- Review all PRs (2 review sessions per day, 30 min each)
- Run all 8 validation checks on each PR
- Post validation results as PR comments
- Approve or request changes

**Weekly Tasks:**
- Validate compliance dashboard metrics
- Report progress against success criteria
- Escalate blockers to Remediation Lead

**Validation Checks (Per PR):**
1. ✅ TypeScript type checking (`pnpm type-check`)
2. ✅ ESLint validation (`pnpm lint`)
3. ✅ Color token validation (`pnpm validate:colors`)
4. ✅ Component usage validation (`pnpm validate:components`)
5. ✅ Unit tests (`pnpm test`)
6. ✅ Build validation (`pnpm build`)
7. ✅ Manual code review
8. ✅ Visual regression check

**North Star Goal:** 100% of merged PRs meet all quality standards

---

### Agent 006: Testing & Coverage Specialist

**Total Effort:** Continuous (Week 1-7)
**Total Test Files:** ~24 test files (one per page)

#### Responsibilities

**Support ALL Agents:**
- Write tests BEFORE agents make changes (test-driven)
- Ensure 85%+ coverage on all changed files
- Ensure 100% coverage on new functionality
- Run coverage reports weekly

**Test Types to Create:**
- Component tests (React Testing Library)
- Interaction tests (user events)
- Accessibility tests (keyboard, screen reader)
- Visual regression tests (snapshots)

**Weekly Tasks:**
- Run full test suite (`pnpm test`)
- Generate coverage report (`pnpm test --coverage`)
- Identify gaps in coverage
- Add missing tests

**North Star Goal:** 85%+ test coverage across all pages

---

## Agent Coordination Matrix

### Parallel Work (Can Work Simultaneously)

| Agent 1 | Agent 2 | Condition |
|---------|---------|-----------|
| Agent 001 (Colors) | Agent 002 (Components) | Different pages |
| Agent 001 (Colors) | Agent 004 (CTAs) | Different concerns |
| Agent 003 (A11y) | Agent 004 (CTAs) | Different concerns |
| Agent 005 (Validation) | ALL agents | Continuous reviews |
| Agent 006 (Testing) | ALL agents | Continuous support |

### Sequential Work (Must Complete First)

| First Agent | Then Agent | Reason |
|-------------|------------|--------|
| Agent 001 (Colors) | Agent 003 (A11y) | Color contrast depends on correct tokens |
| Agent 002 (Components) | Agent 003 (A11y) | Glow components have built-in a11y |
| Agent 001 + 002 | Agent 004 (CTAs) | Design system must be stable first |

---

## Weekly Handoff Protocol

### End of Week 1 → Week 2

**Agent 001 reports:**
- Dashboard ✅ 100% color compliant
- Applications ✅ 100% color compliant
- Settings Profile ✅ 100% color compliant
- Admin Dashboard ✅ 100% color compliant

**Handoff to Agent 002:**
- Dashboard ready for component migration
- Applications ready for component migration

**Handoff to Agent 003:**
- Wait until Week 5 (after colors + components done)

---

### End of Week 2 → Week 3

**Agent 001 reports:**
- 12 pages 100% color compliant (50% done)

**Agent 002 reports:**
- 4 pages 100% component compliant (50% done)

**Handoff to Agent 004:**
- Begin app catalog consolidation
- Begin Dashboard CTA wiring

---

### End of Week 3 → Week 4

**Agent 001 reports:**
- 18 pages 100% color compliant (100% DONE ✅)

**Agent 004 reports:**
- App catalogs consolidated ✅
- Dashboard CTAs functional ✅
- Applications CTAs functional ✅

**Handoff to Agent 003:**
- Week 5 starts accessibility work

---

### End of Week 4 → Week 5

**Agent 002 reports:**
- 8 pages 100% component compliant (100% DONE ✅)

**Agent 004 reports:**
- 60% CTAs functional (continue Week 5-6)

**Agent 003 begins:**
- Week 5 accessibility push

---

### End of Week 5 → Week 6

**Agent 003 reports:**
- 90% pages WCAG 2.1 AA compliant
- All table captions added ✅
- All aria-pressed added ✅
- All status labels added ✅

**Agent 004 reports:**
- 80% CTAs functional

---

### End of Week 6 → Week 7

**All agents report:**
- Agent 001: 100% color compliance ✅
- Agent 002: 100% component compliance ✅
- Agent 003: 100% WCAG 2.1 AA compliance ✅
- Agent 004: 100% CTAs functional or stubbed ✅
- Agent 005: All PRs validated and merged ✅
- Agent 006: 85%+ test coverage ✅

**Week 7:** Buffer for edge cases

---

## Success Metrics by Agent

### Agent 001: Color Compliance

| Metric | Week 1 | Week 2 | Week 3 | Week 6 |
|--------|--------|--------|--------|--------|
| Pages completed | 4 | 8 | 14 | 18 |
| % platform compliant | 16% | 33% | 58% | 75% → 100% |
| `validate-colors` violations | 71 → 45 | 45 → 20 | 20 → 5 | 5 → 0 ✅ |

### Agent 002: Component Migration

| Metric | Week 1 | Week 2 | Week 4 |
|--------|--------|--------|--------|
| Pages completed | 2 | 4 | 8 |
| % platform compliant | 8% | 16% | 33% → 100% ✅ |
| `validate-components` violations | 25 → 15 | 15 → 8 | 8 → 0 ✅ |

### Agent 003: Accessibility Enhancement

| Metric | Week 5 | Week 6 |
|--------|--------|--------|
| Pages WCAG compliant | 12 (50%) | 24 (100% ✅) |
| Storybook a11y violations | 100 → 20 | 20 → 0 ✅ |
| Manual keyboard test pass rate | 70% | 100% ✅ |

### Agent 004: CTA Functionality

| Metric | Week 3 | Week 4 | Week 6 |
|--------|--------|--------|--------|
| CTAs functional | 20% | 40% | 60% → 100% ✅ |
| Pages with functional CTAs | 3 | 7 | 12 → 24 |
| Service layer stubs | 0 | 4 | 7 |

### Agent 005: Validation

| Metric | Week 1 | Week 3 | Week 6 | Week 7 |
|--------|--------|--------|--------|--------|
| PRs reviewed | 10 | 20 | 40 | 50 ✅ |
| PRs approved (first review) | 60% | 75% | 85% | 90% |
| Average review time | 24h | 12h | 6h | 4h |

### Agent 006: Testing

| Metric | Week 1 | Week 3 | Week 6 | Week 7 |
|--------|--------|--------|--------|--------|
| Test coverage | 65% | 75% | 82% | 87% ✅ |
| Test files created | 8 | 16 | 22 | 24 |
| Failing tests | 0 | 0 | 0 | 0 ✅ |

---

## Final Readiness Confirmation

### Agent Prompt Completeness

- [x] **Agent 001:** Color Compliance Specialist — COMPLETE ✅
- [x] **Agent 002:** Component Migration Specialist — COMPLETE ✅
- [ ] **Agent 003:** Accessibility Enhancement Specialist — IN PROGRESS
- [ ] **Agent 004:** CTA Functionality Specialist — IN PROGRESS
- [x] **Agent 005:** Validation & Quality Control Specialist — COMPLETE ✅
- [ ] **Agent 006:** Testing & Coverage Specialist — IN PROGRESS

### North Star Goal Framework Compliance

All agents follow the framework:
- ✅ A. Mission Statement
- ✅ B. North Star Goal
- ✅ C. Input/Output Specification
- ✅ D. Stack Clarity
- ✅ E. File & Folder Structure
- ✅ F. Behavioral & UX Requirements
- ✅ G. Data Models & Schemas
- ✅ H. Step-by-Step Execution
- ✅ I. Success Criteria
- ✅ J. Final Command

### Task Assignment Coverage

- [x] ALL 24 pages assigned to agents
- [x] ALL 75 color violations assigned to Agent 001
- [x] ALL 25 native elements assigned to Agent 002
- [x] ALL 100 accessibility issues assigned to Agent 003
- [x] ALL 200 CTAs assigned to Agent 004
- [x] ALL PRs assigned to Agent 005 for validation
- [x] ALL changes assigned to Agent 006 for testing

### Coordination Verified

- [x] Parallel work identified and scheduled
- [x] Sequential dependencies mapped
- [x] Weekly handoff protocols defined
- [x] Success metrics tracked by agent

---

**STATUS: READY FOR EXECUTION**

**Next Step:** Complete remaining agent prompts (003, 004, 006) following North Star framework

---

**END OF AGENT PROMPTS SUMMARY**
