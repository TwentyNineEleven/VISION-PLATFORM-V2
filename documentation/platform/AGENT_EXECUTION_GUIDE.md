# VISION Platform V2 — Agent Execution Guide

**Document Version:** 1.0
**Created:** January 21, 2025
**Purpose:** Step-by-step guide for executing agent prompts without conflicts

---

## Table of Contents

1. [Execution Overview](#execution-overview)
2. [How to Execute an Agent Prompt](#how-to-execute-an-agent-prompt)
3. [Execution Order by Week](#execution-order-by-week)
4. [Conflict Prevention Matrix](#conflict-prevention-matrix)
5. [Daily Execution Schedule](#daily-execution-schedule)
6. [Handoff Procedures](#handoff-procedures)
7. [Troubleshooting Conflicts](#troubleshooting-conflicts)

---

## Execution Overview

### The Golden Rule

**ONE AGENT, ONE PAGE, ONE BRANCH AT A TIME** (per developer or AI agent instance)

This prevents:
- Merge conflicts
- Duplicate work
- Contradictory changes
- Validation failures

### Agent Execution Model

You have two execution options:

#### Option 1: Sequential Execution (Safest)
- Execute one agent prompt at a time
- Complete all work for that agent before moving to next
- **NO CONFLICTS POSSIBLE**
- **Slower:** 7 weeks sequential

#### Option 2: Parallel Execution (Faster)
- Execute multiple agents simultaneously
- Follow strict coordination rules
- **CONFLICTS POSSIBLE if rules violated**
- **Faster:** 7 weeks with parallel work

**This guide assumes Option 2 (Parallel Execution) for maximum speed.**

---

## How to Execute an Agent Prompt

### Step-by-Step for Each Agent

#### Phase 1: Load the Agent Prompt

**For AI Agent (Claude, GPT, etc.):**

```
Open the agent prompt file and paste the ENTIRE contents into the AI conversation:

File: /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md

Then say: "You are now Agent 001: Color Compliance Specialist. Read your mission and await your first assignment."
```

**For Human Developer:**

```
Open the agent prompt file:
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md

Read sections A-J completely.
Understand your North Star Goal.
Proceed to Phase 2.
```

#### Phase 2: Assign a Specific Page

**DO NOT say:** "Fix all color issues across the platform"

**DO say:** "Your assignment: Dashboard page. Fix the 5 color violations documented in audit Phase 2.1."

**Why:** Scoped assignments prevent conflicts and ensure focused work.

#### Phase 3: Agent Executes Following Their Prompt

The agent will:
1. Read audit documentation
2. Map violations to tokens
3. Create feature branch: `fix/ux-audit-dashboard-colors`
4. Write tests FIRST
5. Make fixes
6. Run validation
7. Create PR
8. Report completion

#### Phase 4: Review and Merge

**Before merging:**
- [ ] 2 code reviewers approve
- [ ] All 8 validation checks pass
- [ ] Agent 005 (Validation Specialist) approves

**After merging:**
- [ ] Delete feature branch
- [ ] Update progress tracker
- [ ] Assign next page to agent

#### Phase 5: Repeat for Next Assignment

**Agent 001 completes Dashboard → Assign Applications**
**Agent 001 completes Applications → Assign Settings Profile**
**Continue until all 18 pages done**

---

## Execution Order by Week

### Week 1: Critical Foundation (NO CONFLICTS)

**Execute in this exact order:**

#### Monday (8 hours)

```
Agent 001: Color Compliance Specialist
├─ Assignment: Dashboard page
├─ File: /apps/shell/src/app/dashboard/page.tsx
├─ Branch: fix/ux-audit-dashboard-colors
├─ Issues: 5 color violations
├─ Conflicts: NONE (only agent working on Dashboard)
└─ Execute prompt: AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md
   └─ Start at: "J. FINAL COMMAND"
   └─ Page assignment: "Dashboard"
```

**Parallel Work (if multiple developers/agents):**
```
Agent 006: Testing & Coverage Specialist
├─ Assignment: Support Agent 001 (write tests for Dashboard)
├─ File: /apps/shell/src/app/dashboard/page.test.tsx
├─ Branch: SAME as Agent 001 (fix/ux-audit-dashboard-colors)
├─ Conflicts: NONE (different file, same branch)
└─ Note: Agent 006 writes tests BEFORE Agent 001 makes changes
```

#### Tuesday (8 hours)

```
Agent 001: Color Compliance Specialist
├─ Assignment: Applications page
├─ File: /apps/shell/src/app/applications/page.tsx
├─ Branch: fix/ux-audit-applications-colors
├─ Issues: 7 color violations
├─ Conflicts: NONE
└─ Prerequisites: Dashboard PR must be MERGED first
```

#### Wednesday (8 hours)

**FIRST PARALLEL EXECUTION (2 agents, different pages)**

```
Agent 002: Component Migration Specialist
├─ Assignment: Dashboard page (native button replacement)
├─ File: /apps/shell/src/app/dashboard/page.tsx
├─ Branch: fix/ux-audit-dashboard-components
├─ Issues: 1 native button
├─ Conflicts: NONE (Agent 001 already merged Dashboard colors)
├─ Prerequisites: Dashboard colors PR MERGED ✅
└─ Execute prompt: AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md

PARALLEL:

Agent 002: Component Migration Specialist (same agent, different page)
├─ Assignment: Applications page (2 native selects)
├─ File: /apps/shell/src/app/applications/page.tsx
├─ Branch: fix/ux-audit-applications-components
├─ Issues: 2 native selects
├─ Conflicts: NONE (different branch from Dashboard)
└─ CAN execute in parallel with Dashboard components
```

**Why no conflicts?**
- Different pages = different files
- Different branches = isolated changes
- Agent 001 already finished and merged both pages

#### Thursday (8 hours)

**COORDINATED PARALLEL (2 agents, SAME page, SEQUENTIAL)**

```
Agent 001: Color Compliance Specialist
├─ Assignment: Settings Profile colors
├─ File: /apps/shell/src/app/settings/profile/page.tsx
├─ Branch: fix/ux-audit-settings-profile-colors
├─ Issues: 4 color violations
├─ Execute: 9:00 AM - 1:00 PM (4 hours)
└─ MUST MERGE PR before Agent 002 starts ⚠️

THEN (after Agent 001 merges):

Agent 002: Component Migration Specialist
├─ Assignment: Settings Profile components
├─ File: /apps/shell/src/app/settings/profile/page.tsx (SAME FILE!)
├─ Branch: fix/ux-audit-settings-profile-components
├─ Issues: 3 inputs, 1 textarea
├─ Execute: 2:00 PM - 6:00 PM (4 hours)
├─ Prerequisites: Agent 001 colors PR MERGED ✅
└─ CONFLICT AVOIDED: Agent 001 finished first
```

**Why this works:**
- Agent 001 finishes FIRST (colors)
- Agent 001 merges PR to main
- Agent 002 starts AFTER merge (pulls latest main)
- Agent 002 works on fresh code with colors already fixed

**Why this would FAIL:**
```
❌ BAD: Both agents work on same file simultaneously
❌ RESULT: Merge conflict when second PR tries to merge
```

#### Friday (8 hours)

```
Agent 001: Color Compliance Specialist
├─ Assignment: Admin Dashboard colors + Admin nav fixes
├─ File: /apps/shell/src/app/admin/page.tsx + layout.tsx
├─ Branch: fix/ux-audit-admin-dashboard-colors
├─ Issues: text-emerald-500, broken admin nav links
├─ Conflicts: NONE
└─ Note: This is a P0 critical fix (Admin nav broken)
```

**Week 1 Summary:**
- ✅ 5 PRs merged (Dashboard colors, Applications colors, Dashboard components, Applications components, Settings Profile colors/components, Admin Dashboard)
- ✅ Zero conflicts (sequential execution on same files, parallel on different files)
- ✅ Agent 005 validated all PRs
- ✅ Agent 006 ensured 85%+ test coverage

---

### Week 2: Expanded Parallel Work

#### Monday (8 hours)

**2 agents, 2 different pages = NO CONFLICTS**

```
Agent 001: Color Compliance Specialist
├─ Assignment: App Detail page colors
├─ File: /apps/shell/src/app/apps/[slug]/page.tsx
├─ Branch: fix/ux-audit-app-detail-colors
└─ Conflicts: NONE

PARALLEL (different page):

Agent 001: Color Compliance Specialist (same agent, second assignment)
├─ Assignment: Notifications page colors
├─ File: /apps/shell/src/app/notifications/page.tsx
├─ Branch: fix/ux-audit-notifications-colors
└─ Conflicts: NONE (completely different file)
```

**Can these run in parallel?**
✅ YES - Different files, different branches, no shared code

#### Tuesday - Friday

Continue pattern:
- Agent 001 works on color violations (different pages each day)
- Agent 002 works on component migrations (follows Agent 001 after merges)
- Agent 005 validates all PRs continuously
- Agent 006 supports with tests continuously

---

### Week 3-4: Introducing Agent 004 (CTA Functionality)

#### Week 3 Monday (8 hours)

**NEW AGENT INTRODUCED**

```
Agent 004: CTA Functionality Specialist
├─ Assignment: Consolidate app catalogs
├─ Files:
│   ├─ /apps/shell/src/app/apps/page.tsx (redirect to /applications)
│   └─ /apps/shell/src/app/app-catalog/page.tsx (redirect to /applications)
├─ Branch: fix/ux-audit-app-catalog-consolidation
├─ Conflicts: POTENTIAL ⚠️
└─ Prerequisites:
    ├─ Applications page colors MERGED ✅ (Agent 001, Week 1)
    ├─ Applications page components MERGED ✅ (Agent 002, Week 1)
    └─ App Detail page colors MERGED ✅ (Agent 001, Week 2)
```

**Why prerequisites matter:**
- Agent 004 will create redirects from `/apps` and `/app-catalog` to `/applications`
- `/applications` page must be STABLE (colors + components fixed)
- If Agent 004 works before Agent 001/002 finish, redirects point to unstable page

**Conflict check:**
```
✅ NO CONFLICT if:
   - Applications page PRs are merged
   - Agent 001/002 not currently working on /apps or /app-catalog pages

❌ CONFLICT if:
   - Agent 001 is simultaneously working on /apps page
   - Solution: Agent 001 finishes /apps first, THEN Agent 004 redirects it
```

#### Week 3 Wednesday

```
Agent 004: CTA Functionality Specialist
├─ Assignment: Dashboard CTAs (Ask AI, Share update)
├─ File: /apps/shell/src/app/dashboard/page.tsx
├─ Branch: fix/ux-audit-dashboard-ctas
├─ Conflicts: POTENTIAL ⚠️
└─ Prerequisites:
    ├─ Dashboard colors MERGED ✅ (Agent 001, Week 1 Monday)
    ├─ Dashboard components MERGED ✅ (Agent 002, Week 1 Wednesday)
    └─ Agent 001 NOT working on Dashboard ✅
```

**Conflict prevention:**
- Dashboard page already touched by Agent 001 (Week 1) and Agent 002 (Week 1)
- Both PRs merged ✅
- No other agent currently working on Dashboard
- Agent 004 can safely add CTA functionality

---

### Week 5-6: Introducing Agent 003 (Accessibility)

#### Week 5 Monday

```
Agent 003: Accessibility Enhancement Specialist
├─ Assignment: Add table captions (7 tables across 3 pages)
├─ Files:
│   ├─ /apps/shell/src/app/settings/billing/page.tsx
│   ├─ /apps/shell/src/app/funder/grantees/page.tsx
│   └─ /apps/shell/src/app/admin/organizations/page.tsx
├─ Branch: fix/ux-audit-table-captions
├─ Conflicts: POTENTIAL ⚠️
└─ Prerequisites: ALL prior agents finished these pages
```

**Critical prerequisite check:**

| Page | Agent 001 (Colors) | Agent 002 (Components) | Agent 004 (CTAs) | Safe for Agent 003? |
|------|-------------------|----------------------|------------------|---------------------|
| Settings Billing | ✅ Week 2 | ✅ Week 2 | ✅ Week 4 | ✅ YES (Week 5) |
| Funder Grantees | ✅ Week 3 | ✅ Week 4 | ✅ Week 4 | ✅ YES (Week 5) |
| Admin Organizations | ✅ Week 3 | ✅ Week 4 | ✅ Week 4 | ✅ YES (Week 5) |

**Why Week 5 is safe:**
- Week 1-2: Agent 001 finished all color work ✅
- Week 1-4: Agent 002 finished all component work ✅
- Week 3-4: Agent 004 finished most CTA work ✅
- Week 5: Agent 003 adds accessibility (different concern, no conflicts)

**Agent 003 CAN work in parallel with Agent 004 finishing remaining CTAs**
- Different concerns (accessibility vs functionality)
- Same files but different code sections
- Low conflict risk

---

## Conflict Prevention Matrix

### ✅ SAFE PARALLEL EXECUTION

| Agent 1 | Working On | Agent 2 | Working On | Conflict Risk | Reason |
|---------|------------|---------|------------|---------------|--------|
| Agent 001 | Dashboard colors | Agent 001 | Applications colors | ✅ NONE | Different files |
| Agent 001 | Dashboard colors | Agent 002 | Settings Profile components | ✅ NONE | Different files |
| Agent 001 | Dashboard colors | Agent 006 | Dashboard tests | ✅ NONE | Different files (.tsx vs .test.tsx) |
| Agent 002 | Dashboard components | Agent 004 | Applications CTAs | ✅ NONE | Different files |
| Agent 003 | Dashboard aria-labels | Agent 004 | Settings Billing CTAs | ✅ NONE | Different files |
| Agent 005 | Validating PR #45 | Any agent | Creating PR #46 | ✅ NONE | Different PRs |

### ⚠️ SEQUENTIAL EXECUTION REQUIRED

| Agent 1 | Working On | Agent 2 | Working On | Conflict Risk | Solution |
|---------|------------|---------|------------|---------------|----------|
| Agent 001 | Dashboard colors | Agent 002 | Dashboard components | ⚠️ MEDIUM | Agent 001 merges FIRST, then Agent 002 |
| Agent 001 | Dashboard colors | Agent 004 | Dashboard CTAs | ⚠️ MEDIUM | Agent 001 → Agent 002 → Agent 004 (sequence) |
| Agent 002 | Dashboard components | Agent 003 | Dashboard accessibility | ⚠️ MEDIUM | Agent 002 merges FIRST, then Agent 003 |
| Agent 001 | Settings Team colors | Agent 002 | Settings Team components | ⚠️ MEDIUM | Agent 001 finishes by noon, Agent 002 starts afternoon |

**Pattern:** Same file = sequential execution required

### ❌ NEVER DO THIS (HIGH CONFLICT)

| Agent 1 | Working On | Agent 2 | Working On | Conflict Risk | Why This Fails |
|---------|------------|---------|------------|---------------|----------------|
| Agent 001 | Dashboard colors (open PR) | Agent 002 | Dashboard components (open PR) | ❌ HIGH | Two PRs modifying same file simultaneously = merge conflict |
| Agent 001 | Dashboard line 42-50 | Agent 004 | Dashboard line 45-60 | ❌ HIGH | Overlapping line changes = conflict |
| Agent 002 | Creating `GlowSelect` wrapper | Agent 002 | Creating `GlowSelect` wrapper (different branch) | ❌ HIGH | Duplicate work, conflicting implementations |

---

## Daily Execution Schedule

### Template for Each Day

```
DAY: Monday, Week 1
TIME: 9:00 AM - 5:00 PM (8 hours)

MORNING SESSION (9:00 AM - 12:00 PM)
├─ Agent 001: Color Compliance Specialist
│  ├─ Assignment: Dashboard colors
│  ├─ Branch: fix/ux-audit-dashboard-colors
│  ├─ Execute: Phases 1-3 (Prep, Write Tests, Make Fixes)
│  ├─ Duration: 3 hours
│  └─ Status: PR ready for review
│
└─ Agent 006: Testing & Coverage Specialist
   ├─ Assignment: Support Agent 001 (write Dashboard tests FIRST)
   ├─ Branch: SAME (fix/ux-audit-dashboard-colors)
   ├─ Execute: Write tests before Agent 001 makes changes
   └─ Duration: 1 hour

LUNCH (12:00 PM - 1:00 PM)

AFTERNOON SESSION (1:00 PM - 5:00 PM)
├─ Agent 001: Color Compliance Specialist
│  ├─ Execute: Phases 4-5 (Validation, Create PR)
│  ├─ Duration: 2 hours
│  └─ Output: PR #45 created
│
├─ Agent 005: Validation & Quality Control Specialist
│  ├─ Assignment: Review PR #45 from Agent 001
│  ├─ Execute: Run 8 validation checks
│  ├─ Duration: 1 hour
│  └─ Output: Approve or request changes
│
└─ Code Reviewers (2)
   ├─ Assignment: Review PR #45
   ├─ Duration: 30 min each
   └─ Output: 2 approvals → Merge PR

END OF DAY
├─ PRs Merged: 1 (Dashboard colors)
├─ Next Assignment: Applications colors (Tuesday)
└─ Handoff Notes: Dashboard ready for Agent 002 (components)
```

---

## Handoff Procedures

### Agent-to-Agent Handoff (Same Page, Different Concern)

**Scenario:** Agent 001 finishes Dashboard colors → Agent 002 starts Dashboard components

#### Agent 001 Completes Work

```bash
# Agent 001 final steps
git add apps/shell/src/app/dashboard/page.tsx
git commit -m "fix(dashboard): replace inline colors with Bold tokens"
git push origin fix/ux-audit-dashboard-colors

# Create PR, get approvals, MERGE to main
```

#### Handoff Message

```markdown
## Handoff to Agent 002: Component Migration Specialist

**Page:** Dashboard
**Status:** Colors 100% compliant ✅
**PR:** #45 (MERGED)
**Files changed:**
- apps/shell/src/app/dashboard/page.tsx (colors fixed)
- apps/shell/src/app/dashboard/page.test.tsx (color tests added)

**Next task:** Replace 1 native button with GlowButton
**Audit reference:** Phase 2.1, Dashboard, Issue #6
**Estimated effort:** 1 hour

**Prerequisites met:**
- [x] Dashboard colors 100% Bold tokens
- [x] All tests passing
- [x] PR merged to main

**Agent 002 can begin immediately.**
```

#### Agent 002 Starts Work

```bash
# Agent 002 first steps
git checkout main
git pull origin main  # ← Gets Agent 001's merged changes

# Now Dashboard has colors fixed ✅
# Agent 002 can add Glow components on top of clean code

git checkout -b fix/ux-audit-dashboard-components
```

### Week-to-Week Handoff

**End of Week 1:**

```markdown
## Week 1 Complete → Week 2 Begins

**Agent 001 Progress:**
- Dashboard ✅ 100% colors
- Applications ✅ 100% colors
- Settings Profile ✅ 100% colors
- Admin Dashboard ✅ 100% colors
- **Total:** 4 pages, 18 color violations fixed

**Agent 002 Progress:**
- Dashboard ✅ 100% components
- Applications ✅ 100% components
- Settings Profile ✅ 100% components
- **Total:** 3 pages, 6 native elements replaced

**Handoff to Week 2:**
- Agent 001: Continue with App Detail, Notifications, Files
- Agent 002: Continue with Settings Organization, Settings Team
- Agent 004: NOT STARTED YET (begins Week 3)
- Agent 003: NOT STARTED YET (begins Week 5)

**No blockers. All agents can proceed.**
```

---

## Troubleshooting Conflicts

### Scenario 1: Merge Conflict Detected

**Situation:**
```
Agent 002 tries to merge PR #47 (Dashboard components)
GitHub says: "Merge conflict in apps/shell/src/app/dashboard/page.tsx"
```

**Root cause:**
- Agent 001 PR #45 (Dashboard colors) was merged
- Agent 002 branched BEFORE Agent 001 merged
- Agent 002's branch is now outdated

**Solution:**
```bash
# Agent 002 resolves conflict
git checkout fix/ux-audit-dashboard-components
git pull origin main  # Pull Agent 001's changes

# Resolve conflicts manually
code apps/shell/src/app/dashboard/page.tsx
# Keep both changes: Agent 001's colors + Agent 002's components

git add apps/shell/src/app/dashboard/page.tsx
git commit -m "fix: resolve merge conflict with colors PR"
git push origin fix/ux-audit-dashboard-components

# Re-run validation
pnpm validate:colors  # ✅ Should still pass
pnpm validate:components  # ✅ Should still pass

# Request re-review, then merge
```

**Prevention:**
- Agent 002 should have waited for Agent 001 to merge
- OR Agent 002 should pull main frequently during work

### Scenario 2: Duplicate Work

**Situation:**
```
Agent 001 fixes Dashboard colors (PR #45)
Agent 002 also fixes Dashboard colors (PR #46)
Both PRs open simultaneously
```

**Root cause:**
- Poor task assignment (both agents given same task)
- No coordination

**Solution:**
```
1. Check which PR is further along
2. Close duplicate PR
3. Reassign agent to different page
```

**Prevention:**
- Use task assignment matrix strictly
- Check GitHub Issues before starting work
- One agent, one page, one concern at a time

### Scenario 3: Validation Failure After Merge

**Situation:**
```
Agent 002 merges Dashboard components PR
Agent 003 (Week 5) adds accessibility to Dashboard
Validation fails: `pnpm validate:components` shows 1 violation
```

**Root cause:**
- Agent 003 accidentally introduced native `<select>` during accessibility work
- Validation didn't catch it because Agent 003 didn't run component validation

**Solution:**
```bash
# Agent 003 fixes immediately
git checkout -b fix/ux-audit-dashboard-a11y-components
# Remove native select, use GlowSelect
git commit -m "fix(dashboard): replace native select introduced in a11y PR"
git push

# Create hotfix PR, fast-track review, merge
```

**Prevention:**
- ALL agents must run ALL 8 validation checks before creating PR
- Agent 005 must validate EVERY PR before approval
- Never skip validation steps

---

## Execution Checklist (Daily)

### Morning Standup (9:00 AM)

- [ ] Which agents are working today?
- [ ] Which pages are assigned?
- [ ] Any dependencies? (Agent 1 must finish before Agent 2 starts?)
- [ ] Any blockers from yesterday?

### Before Starting Work

- [ ] Pull latest main: `git pull origin main`
- [ ] Check no other agent is working on this page
- [ ] Read agent prompt section J (Final Command)
- [ ] Create feature branch with correct naming

### During Work

- [ ] Follow 18-step remediation workflow
- [ ] Write tests FIRST
- [ ] Run validation frequently
- [ ] Commit with descriptive messages

### Before Creating PR

- [ ] Run ALL 8 validation checks
- [ ] Take screenshots (desktop, tablet, mobile)
- [ ] Write complete PR description
- [ ] Assign 2 reviewers + Agent 005

### After PR Merged

- [ ] Delete feature branch
- [ ] Update progress tracker
- [ ] Write handoff notes if next agent waiting
- [ ] Assign next task to agent

---

## Summary: How to Execute Without Conflicts

### The Simple Rules

1. **ONE AGENT, ONE PAGE, ONE BRANCH**
   - Agent 001 works on Dashboard? → Branch: `fix/ux-audit-dashboard-colors`
   - Agent 002 works on Dashboard? → Wait for Agent 001 to merge FIRST

2. **DIFFERENT PAGES = PARALLEL OK**
   - Agent 001: Dashboard colors ✅ Parallel with Agent 001: Applications colors

3. **SAME PAGE = SEQUENTIAL REQUIRED**
   - Agent 001: Dashboard colors → MERGE → Agent 002: Dashboard components

4. **FOLLOW THE WEEK PLAN**
   - Week 1-2: Agent 001 + Agent 002 (colors + components)
   - Week 3-4: Agent 001 + Agent 002 + Agent 004 (add CTAs)
   - Week 5-6: Agent 003 + Agent 004 (accessibility + remaining CTAs)
   - Week 7: All agents (polish + buffer)

5. **VALIDATE EVERYTHING**
   - Before PR: Run 8 validation checks
   - During review: Agent 005 validates again
   - After merge: Regression tests

---

## Quick Reference: Agent Execution Order

```
WEEK 1:
Mon: Agent 001 (Dashboard) → Merge → Agent 002 (Dashboard)
Tue: Agent 001 (Applications) → Merge → Agent 002 (Applications)
Wed: Agent 002 (Dashboard + Applications components in parallel)
Thu: Agent 001 (Settings Profile) → Merge → Agent 002 (Settings Profile)
Fri: Agent 001 (Admin Dashboard)

WEEK 2:
Mon-Fri: Agent 001 (5 pages) + Agent 002 (3 pages) in parallel (different pages)

WEEK 3:
Mon: Agent 004 (App catalog consolidation)
Tue: Agent 001 (Funder pages)
Wed: Agent 004 (Dashboard CTAs) — after Agent 001+002 done with Dashboard
Thu: Agent 004 (Applications CTAs) — after Agent 001+002 done with Applications
Fri: Agent 001 (Admin pages)

WEEK 4:
Mon-Fri: Agent 004 (CTAs) + Agent 002 (remaining components)

WEEK 5:
Mon-Fri: Agent 003 (Accessibility) — AFTER Agent 001+002 finished all pages

WEEK 6:
Mon-Fri: Agent 003 (Advanced accessibility) + Agent 004 (final CTAs)

WEEK 7:
Mon-Thu: All agents (edge cases, polish, launch prep)
```

---

**END OF EXECUTION GUIDE**

**Key Takeaway:** Follow the schedule, work on different pages in parallel, work on same page sequentially, validate everything, and there will be NO CONFLICTS.
