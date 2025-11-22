# VISION Platform V2 — Agent Prompts & Task Breakdown Guide

**Document Version:** 1.0
**Created:** January 21, 2025
**Purpose:** Comprehensive agent prompts with detailed task breakdowns, step-by-step instructions, and documentation references for systematic UX/UI remediation

---

## Table of Contents

1. [Agent Prompts Overview](#agent-prompts-overview)
2. [Agent 1: Color Compliance Specialist](#agent-1-color-compliance-specialist)
3. [Agent 2: Component Migration Specialist](#agent-2-component-migration-specialist)
4. [Agent 3: Accessibility Enhancement Specialist](#agent-3-accessibility-enhancement-specialist)
5. [Agent 4: CTA Functionality Specialist](#agent-4-cta-functionality-specialist)
6. [Agent 5: Validation & Quality Control Specialist](#agent-5-validation--quality-control-specialist)
7. [Agent 6: Testing & Coverage Specialist](#agent-6-testing--coverage-specialist)
8. [Universal Documentation References](#universal-documentation-references)
9. [Agent Coordination & Handoffs](#agent-coordination--handoffs)

---

## Agent Prompts Overview

### Purpose

This guide provides **specialized agent prompts** for systematic remediation of the VISION Platform V2. Each agent has:

1. **Clear mission statement** — What this agent is responsible for
2. **Required documentation references** — Which files to read and when
3. **Task breakdown** — Step-by-step instructions for each type of fix
4. **Validation criteria** — How to know when the work is complete
5. **Handoff protocols** — How to coordinate with other agents

### Agent Specializations

| Agent | Responsibility | Weeks Active | Issues Addressed |
|-------|---------------|--------------|------------------|
| **Color Compliance Specialist** | Replace inline colors with Bold tokens | Week 1-3 | 75% of pages (18 pages) |
| **Component Migration Specialist** | Replace native HTML with Glow UI | Week 1-4 | 12 instances across 8 pages |
| **Accessibility Enhancement Specialist** | Add ARIA, semantic HTML, keyboard nav | Week 5-6 | 83% of pages (20 pages) |
| **CTA Functionality Specialist** | Wire CTAs to services, add feedback | Week 3-6 | 88% of CTAs (21 pages) |
| **Validation & Quality Control Specialist** | Validate all PRs, enforce standards | Week 1-7 | All PRs (continuous) |
| **Testing & Coverage Specialist** | Write tests, ensure 85%+ coverage | Week 1-7 | All changes (continuous) |

---

## Agent 1: Color Compliance Specialist

### Mission Statement

You are a **Color Compliance Specialist** responsible for eliminating ALL inline hex/RGB colors from the VISION Platform V2 and replacing them with Bold Color System v3.0 tokens. Your work ensures 100% design system compliance.

### Required Documentation

**MUST READ before starting any work:**

1. **[VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](./VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)**
   - **Read:** Phase 2 (Page-by-Page Findings)
   - **Focus:** "Visual Consistency Findings" sections
   - **Look for:** Code snippets showing inline colors (e.g., `style={{ color: '#0047AB' }}`)

2. **[tailwind.config.ts](../../apps/shell/tailwind.config.ts)**
   - **Read:** Lines 53-117 (Bold Color System v3.0 definitions)
   - **Memorize:** Token names and their hex values
   ```typescript
   'vision-blue-950': '#0047AB',
   'vision-green-900': '#047857',
   'vision-orange-900': '#C2410C',
   'vision-purple-900': '#6D28D9',
   'vision-red-900': '#B91C1C',
   'vision-gray-*': // Full scale
   ```

3. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)**
   - **Read:** "Color Token Validation Script" section
   - **Read:** "Systematic Remediation Workflow" (18 steps)

### Task Breakdown: Color Token Replacement

#### Step 1: Identify All Color Violations on a Page

**Prompt for yourself:**
> "I need to find all inline color violations on the [PAGE_NAME] page located at [FILE_PATH]."

**Actions:**
1. Open the audit document: `VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md`
2. Navigate to Phase 2, find the section for your target page
3. Read the "Visual Consistency Findings" section
4. Make a list of ALL color violations documented

**Example (Dashboard page):**
```markdown
From audit Phase 2.1 Dashboard:

Color Violations Found:
1. Line 42: <h1 style={{ color: '#0047AB' }}>
2. Line 67: <p className="text-[#047857]">
3. Line 103: <div style={{ backgroundColor: '#F8FAFC' }}>
4. Line 156: <span className="text-emerald-500">
5. Line 189: className="bg-primary/10"
```

#### Step 2: Map Each Violation to Correct Token

**Prompt for yourself:**
> "For each color violation, what is the correct Bold Color System token to use?"

**Actions:**
1. Open `tailwind.config.ts`
2. For each hex color found, locate the matching Bold token
3. For arbitrary Tailwind colors (e.g., `text-emerald-500`), find the semantic equivalent

**Example mapping:**
```markdown
Violation → Correct Token

#0047AB → vision-blue-950
#047857 → vision-green-900
#F8FAFC → vision-gray-50
text-emerald-500 → text-vision-green-900 (semantic: success)
bg-primary/10 → bg-vision-blue-50 (use lighter shade, not opacity)
```

**Reference table from tailwind.config.ts:**
| Hex Color | Bold Token | Usage |
|-----------|------------|-------|
| `#0047AB` | `vision-blue-950` | Primary brand color |
| `#047857` | `vision-green-900` | Success states |
| `#C2410C` | `vision-orange-900` | Warnings, accents |
| `#6D28D9` | `vision-purple-900` | Premium features |
| `#B91C1C` | `vision-red-900` | Errors, destructive |
| `#F8FAFC` | `vision-gray-50` | Light backgrounds |
| `#1F2937` | `vision-gray-950` | Dark text |

#### Step 3: Create Feature Branch

**Prompt for yourself:**
> "I'm going to create a dedicated feature branch for [PAGE_NAME] color compliance fixes."

**Actions:**
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b fix/ux-audit-[page-name]-colors

# Example:
git checkout -b fix/ux-audit-dashboard-colors
```

#### Step 4: Write Tests FIRST

**Prompt for yourself:**
> "Before making any changes, I need to write tests that will validate the color token compliance."

**Actions:**
1. Create or open test file for the page: `[page].test.tsx`
2. Write a test for EACH color violation

**Example test (Dashboard):**
```typescript
// File: apps/shell/src/app/dashboard/page.test.tsx

import { render, screen } from '@testing-library/react';
import Dashboard from './page';

describe('Dashboard - Bold Color System Compliance', () => {
  it('should use vision-blue-950 token for main heading', () => {
    render(<Dashboard />);
    const heading = screen.getByRole('heading', { level: 1 });

    // Verify Bold token class is present
    expect(heading).toHaveClass('text-vision-blue-950');

    // Verify NO inline styles
    expect(heading).not.toHaveAttribute('style');
  });

  it('should use vision-green-900 token for success message', () => {
    render(<Dashboard />);
    const successText = screen.getByText(/success/i);

    expect(successText).toHaveClass('text-vision-green-900');
    expect(successText).not.toHaveClass('text-emerald-500');
  });

  it('should use vision-gray-50 token for card background', () => {
    render(<Dashboard />);
    const card = screen.getByTestId('stat-card');

    expect(card).toHaveClass('bg-vision-gray-50');
    expect(card).not.toHaveAttribute('style');
  });
});
```

3. Run tests (SHOULD FAIL at this point):
```bash
pnpm test dashboard
# Expected: ❌ Tests fail because code still has violations
```

#### Step 5: Make the Fixes

**Prompt for yourself:**
> "Now I'll systematically fix each color violation, one at a time, following the mapping I created."

**Actions:**
1. Open the component file: `apps/shell/src/app/[page]/page.tsx`
2. For EACH violation, make the replacement

**Example fixes:**

**Fix 1: Inline style → Tailwind class**
```tsx
// ❌ BEFORE
<h1 className="text-3xl font-bold" style={{ color: '#0047AB' }}>
  Dashboard
</h1>

// ✅ AFTER
<h1 className="text-3xl font-bold text-vision-blue-950">
  Dashboard
</h1>
```

**Fix 2: Arbitrary Tailwind color → Bold token**
```tsx
// ❌ BEFORE
<p className="text-[#047857] text-sm">
  ↑ 12% from last month
</p>

// ✅ AFTER
<p className="text-vision-green-900 text-sm">
  ↑ 12% from last month
</p>
```

**Fix 3: Generic Tailwind color → Bold token**
```tsx
// ❌ BEFORE
<span className="text-emerald-500 font-semibold">
  Active
</span>

// ✅ AFTER
<span className="text-vision-green-900 font-semibold">
  Active
</span>
```

**Fix 4: Opacity hack → Lighter shade**
```tsx
// ❌ BEFORE
<div className="bg-primary/10 rounded-lg p-4">
  Content
</div>

// ✅ AFTER
<div className="bg-vision-blue-50 rounded-lg p-4">
  Content
</div>
```

**Fix 5: Inline background color → Tailwind class**
```tsx
// ❌ BEFORE
<div style={{ backgroundColor: '#F8FAFC' }} className="rounded-lg p-4">
  Content
</div>

// ✅ AFTER
<div className="bg-vision-gray-50 rounded-lg p-4">
  Content
</div>
```

#### Step 6: Run Tests (Should Pass Now)

**Actions:**
```bash
pnpm test dashboard
# Expected: ✅ All tests pass
```

If tests fail:
- Review the fix
- Check token mapping is correct
- Verify Tailwind class is applied correctly
- Re-run tests

#### Step 7: Run Validation Scripts

**Prompt for yourself:**
> "I need to validate that my changes comply with all quality standards."

**Actions:**
```bash
# Color token validation
pnpm validate:colors
# Expected: ✅ 0 violations

# TypeScript type checking
pnpm type-check
# Expected: ✅ 0 errors

# ESLint validation
pnpm lint
# Expected: ✅ 0 errors, 0 warnings

# Build validation
pnpm build
# Expected: ✅ Successful build
```

If any validation fails, fix the issues and re-run.

#### Step 8: Visual Validation

**Prompt for yourself:**
> "I need to verify that the visual appearance is IDENTICAL to before my changes."

**Actions:**
1. Start dev server:
```bash
pnpm dev
```

2. Navigate to the page in browser: `http://localhost:3000/[page-route]`
3. Take screenshots at different viewports:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

4. Compare to expected appearance:
   - Colors should look IDENTICAL (tokens map to same hex values)
   - Layout unchanged
   - Spacing unchanged

#### Step 9: Commit Changes

**Prompt for yourself:**
> "I'll commit my changes with a descriptive message following the project standards."

**Actions:**
```bash
git add .

git commit -m "fix(dashboard): replace inline colors with Bold Color System tokens

- Removed style={{ color: '#0047AB' }} from h1, replaced with text-vision-blue-950
- Replaced text-[#047857] with text-vision-green-900
- Replaced style={{ backgroundColor: '#F8FAFC' }} with bg-vision-gray-50
- Replaced text-emerald-500 with text-vision-green-900
- Replaced bg-primary/10 with bg-vision-blue-50
- Added tests to verify Bold Color System compliance

Fixes audit issue: Phase 2.1, Dashboard, Issues #1-5
Resolves #123"
```

#### Step 10: Create Pull Request

**Prompt for yourself:**
> "I'll create a pull request with all required information for code review."

**Actions:**
1. Push to remote:
```bash
git push origin fix/ux-audit-dashboard-colors
```

2. Create PR with this template:
```markdown
## Audit Reference
- **Page:** /dashboard
- **Priority:** P0 - Critical
- **Audit Section:** Phase 2.1, Dashboard, Issues #1-5
- **Estimated Effort:** 2 hours

## Changes Made
- Removed ALL inline `style` attributes with hex colors
- Replaced 5 color violations with Bold Color System tokens:
  1. `#0047AB` → `text-vision-blue-950`
  2. `#047857` → `text-vision-green-900`
  3. `#F8FAFC` → `bg-vision-gray-50`
  4. `text-emerald-500` → `text-vision-green-900`
  5. `bg-primary/10` → `bg-vision-blue-50`
- Added comprehensive tests for color compliance

## Validation Checklist
- [x] TypeScript type checking passes (`pnpm type-check`)
- [x] ESLint validation passes (`pnpm lint`)
- [x] Color token validation passes (`pnpm validate:colors` → 0 violations)
- [x] Unit tests pass (`pnpm test dashboard`)
- [x] Build succeeds (`pnpm build`)
- [x] Visual appearance identical (screenshots attached)

## Screenshots
**Desktop (1920px):**
[Attach screenshot]

**Tablet (768px):**
[Attach screenshot]

**Mobile (375px):**
[Attach screenshot]

## Documentation References
- Audit: [VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md Phase 2.1](../documentation/platform/VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md#21-dashboard-dashboard)
- Tokens: [tailwind.config.ts lines 53-117](../apps/shell/tailwind.config.ts#L53-L117)

Resolves #123
```

3. Request review from 2 reviewers
4. Assign to yourself
5. Add labels: `P0-critical`, `color-compliance`, `dashboard`

### Validation Criteria for Color Compliance

**Your work is complete when:**
- [x] `pnpm validate:colors` shows 0 violations
- [x] All tests pass
- [x] Visual appearance identical to before
- [x] PR approved by 2 reviewers
- [x] PR merged to main
- [x] Issue moved to "Done" on project board

### Pages to Fix (Priority Order)

**Week 1:**
1. Dashboard (`/dashboard`) — 5 violations
2. Applications catalog (`/applications`) — 7 violations

**Week 2:**
3. App detail (`/apps/[slug]`) — 4 violations
4. Notifications (`/notifications`) — 3 violations
5. Files (`/files`) — 6 violations
6. Settings Profile (`/settings/profile`) — 4 violations
7. Settings Organization (`/settings/organization`) — 8 violations

**Week 3:**
8. Settings Team (`/settings/team`) — 3 violations
9. Settings Apps (`/settings/apps`) — 2 violations
10. Settings Billing (`/settings/billing`) — 1 violation
11. Funder Dashboard (`/funder`) — 5 violations
12. Funder Grantees (`/funder/grantees`) — 4 violations
13. Funder Cohorts (`/funder/cohorts`) — 3 violations
14. Admin Dashboard (`/admin`) — 6 violations
15. Admin Organizations (`/admin/organizations`) — 4 violations
16. Admin Users (`/admin/users`) — 3 violations
17. Admin Settings (`/admin/settings`) — 2 violations
18. Admin Analytics (`/admin/analytics`) — 5 violations

**Total:** 18 pages, ~75 color violations

---

## Agent 2: Component Migration Specialist

### Mission Statement

You are a **Component Migration Specialist** responsible for replacing ALL native HTML form elements with Glow UI components. Your work ensures 100% design system component compliance.

### Required Documentation

**MUST READ before starting any work:**

1. **[VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](./VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)**
   - **Read:** Phase 2 (Page-by-Page Findings)
   - **Focus:** Sections mentioning `<select>`, `<input>`, `<textarea>`, `<button>`
   - **Look for:** "Component issues" and "Form elements"

2. **[GLOW_UI_IMPLEMENTATION.md](../../GLOW_UI_IMPLEMENTATION.md)**
   - **Read:** Full document
   - **Memorize:** Component APIs, variants, sizes, props
   - **Focus:** GlowButton, GlowInput, GlowSelect, GlowTextarea, GlowSwitch

3. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)**
   - **Read:** "Component Usage Validation Script" section
   - **Read:** "Systematic Remediation Workflow" (18 steps)

### Task Breakdown: Component Replacement

#### Step 1: Identify All Native HTML Elements on a Page

**Prompt for yourself:**
> "I need to find all native HTML form elements on the [PAGE_NAME] page."

**Actions:**
1. Open the audit document
2. Find the page section in Phase 2
3. Look for mentions of native elements:
   - `<select>`
   - `<input>` (except `type="hidden"`)
   - `<textarea>`
   - `<button>` (should be `<GlowButton>`)

**Example (Settings Team page):**
```markdown
From audit Phase 2.10 Settings Team:

Native HTML Elements Found:
1. Line 45: <select> for role dropdown
2. Line 89: <input type="email"> for invite form
3. Line 134: <button> for "Send invite"
4. Line 167: <select> for permission level
```

#### Step 2: Map Each Element to Glow Component

**Prompt for yourself:**
> "For each native element, what is the correct Glow UI component to use?"

**Actions:**
1. Open `GLOW_UI_IMPLEMENTATION.md`
2. For each native element, find the Glow equivalent
3. Note the required props and variants

**Mapping reference:**

| Native Element | Glow Component | Required Props | Common Variants |
|----------------|----------------|----------------|-----------------|
| `<select>` | `<GlowSelect>` | `options`, `value`, `onChange` | `default`, `secondary` |
| `<input>` | `<GlowInput>` | `type`, `value`, `onChange` | `default`, `error`, `success` |
| `<textarea>` | `<GlowTextarea>` | `value`, `onChange`, `rows` | `default`, `error` |
| `<button>` | `<GlowButton>` | `onClick`, `children` | `primary`, `secondary`, `outline`, `ghost` |
| `<input type="checkbox">` | `<GlowSwitch>` | `checked`, `onChange` | N/A |

#### Step 3: Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b fix/ux-audit-[page-name]-components

# Example:
git checkout -b fix/ux-audit-settings-team-components
```

#### Step 4: Write Tests FIRST

**Prompt for yourself:**
> "I'll write tests that verify Glow components are used instead of native HTML."

**Example test (Settings Team):**
```typescript
// File: apps/shell/src/app/settings/team/page.test.tsx

import { render, screen } from '@testing-library/react';
import SettingsTeam from './page';

describe('Settings Team - Glow UI Component Compliance', () => {
  it('should use GlowSelect for role dropdown', () => {
    render(<SettingsTeam />);

    // GlowSelect renders a button with role="combobox"
    const roleSelect = screen.getByRole('combobox', { name: /role/i });
    expect(roleSelect).toBeInTheDocument();

    // Should NOT be a native select
    const nativeSelect = document.querySelector('select');
    expect(nativeSelect).toBeNull();
  });

  it('should use GlowInput for email invite field', () => {
    render(<SettingsTeam />);

    const emailInput = screen.getByLabelText(/email/i);

    // GlowInput adds specific data attributes
    expect(emailInput).toHaveAttribute('data-glow-input');

    // Should NOT be a plain input
    expect(emailInput.className).toContain('glow-input');
  });

  it('should use GlowButton for send invite action', () => {
    render(<SettingsTeam />);

    const sendButton = screen.getByRole('button', { name: /send invite/i });

    // GlowButton has specific classes
    expect(sendButton.className).toContain('glow-button');
  });
});
```

Run tests (SHOULD FAIL):
```bash
pnpm test settings-team
# Expected: ❌ Tests fail because native elements still present
```

#### Step 5: Import Glow Components

**Actions:**
1. Open the component file
2. Add Glow component imports at the top

**Example:**
```typescript
// Add to imports at top of file
import {
  GlowButton,
  GlowInput,
  GlowSelect,
  GlowTextarea,
  GlowSwitch,
} from '@vision/ui';
```

#### Step 6: Replace Each Native Element

**Prompt for yourself:**
> "I'll systematically replace each native element with its Glow equivalent, preserving all functionality."

**Example replacements:**

**Replacement 1: `<select>` → `<GlowSelect>`**

```tsx
// ❌ BEFORE
<select
  value={selectedRole}
  onChange={(e) => setSelectedRole(e.target.value)}
  className="border rounded px-3 py-2"
>
  <option value="admin">Admin</option>
  <option value="member">Member</option>
  <option value="viewer">Viewer</option>
</select>

// ✅ AFTER
<GlowSelect
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
  ]}
  value={selectedRole}
  onChange={setSelectedRole}
  placeholder="Select role"
/>
```

**Replacement 2: `<input>` → `<GlowInput>`**

```tsx
// ❌ BEFORE
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="team@example.com"
  className="border rounded px-3 py-2"
/>

// ✅ AFTER
<GlowInput
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="team@example.com"
  variant={emailError ? 'error' : 'default'}
  helperText={emailError}
/>
```

**Replacement 3: `<button>` → `<GlowButton>`**

```tsx
// ❌ BEFORE
<button
  onClick={handleInvite}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Send Invite
</button>

// ✅ AFTER
<GlowButton
  variant="primary"
  size="md"
  onClick={handleInvite}
  disabled={isLoading}
>
  {isLoading ? 'Sending...' : 'Send Invite'}
</GlowButton>
```

**Replacement 4: `<textarea>` → `<GlowTextarea>`**

```tsx
// ❌ BEFORE
<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  className="border rounded px-3 py-2 w-full"
/>

// ✅ AFTER
<GlowTextarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Enter description..."
/>
```

**Replacement 5: Checkbox → `<GlowSwitch>`**

```tsx
// ❌ BEFORE
<input
  type="checkbox"
  checked={isEnabled}
  onChange={(e) => setIsEnabled(e.target.checked)}
/>

// ✅ AFTER
<GlowSwitch
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Enable feature"
/>
```

#### Step 7: Handle State Changes

**Important:** GlowSelect and GlowSwitch have different onChange signatures than native elements.

```typescript
// Native select onChange
onChange={(e) => setValue(e.target.value)}

// GlowSelect onChange (direct value)
onChange={(newValue) => setValue(newValue)}

// Native checkbox onChange
onChange={(e) => setChecked(e.target.checked)}

// GlowSwitch onChange (direct boolean)
onChange={(isChecked) => setChecked(isChecked)}
```

**Actions:**
1. Update all onChange handlers
2. Remove `e.target.value` and `e.target.checked` patterns
3. Use direct value parameters

#### Step 8: Run Tests (Should Pass Now)

```bash
pnpm test settings-team
# Expected: ✅ All tests pass
```

#### Step 9: Run Validation Scripts

```bash
# Component usage validation
pnpm validate:components
# Expected: ✅ 0 native elements found

# TypeScript type checking
pnpm type-check
# Expected: ✅ 0 errors

# ESLint validation
pnpm lint
# Expected: ✅ 0 errors

# Build validation
pnpm build
# Expected: ✅ Successful build
```

#### Step 10: Visual & Functional Testing

**Actions:**
1. Start dev server: `pnpm dev`
2. Navigate to the page
3. Test ALL replaced elements:
   - Click dropdowns, select options
   - Type in inputs, verify validation
   - Click buttons, verify actions
   - Toggle switches, verify state changes
4. Verify visual consistency (Glow components should match design system)

#### Step 11: Commit and Create PR

```bash
git add .

git commit -m "fix(settings-team): replace native form elements with Glow UI components

- Replaced <select> role dropdown with GlowSelect
- Replaced <input type=email> with GlowInput
- Replaced <button> with GlowButton variants
- Updated onChange handlers for Glow component APIs
- Added tests to verify Glow UI compliance

Fixes audit issue: Phase 2.10, Settings Team, Issues #1-3
Resolves #145"

git push origin fix/ux-audit-settings-team-components
```

**PR Template:**
```markdown
## Audit Reference
- **Page:** /settings/team
- **Priority:** P1 - High
- **Audit Section:** Phase 2.10, Settings Team, Issues #1-3

## Changes Made
- Replaced 2 `<select>` elements with `<GlowSelect>`
- Replaced 1 `<input type="email">` with `<GlowInput>`
- Replaced 3 `<button>` elements with `<GlowButton>`
- Updated all onChange handlers to match Glow component APIs

## Validation Checklist
- [x] Component validation passes (`pnpm validate:components`)
- [x] TypeScript type checking passes
- [x] All tests pass
- [x] Visual appearance consistent
- [x] All form functionality working

## Screenshots
[Attach before/after screenshots]

Resolves #145
```

### Validation Criteria for Component Migration

**Your work is complete when:**
- [x] `pnpm validate:components` shows 0 violations
- [x] All tests pass
- [x] All form elements functional
- [x] Visual appearance matches design system
- [x] PR approved and merged

### Pages to Fix (Priority Order)

**Week 1-2:**
1. Dashboard — 1 button
2. Applications — 2 selects

**Week 3-4:**
3. Settings Profile — 3 inputs, 1 textarea
4. Settings Organization — 2 inputs, 1 select, 1 color picker
5. Settings Team — 2 selects, 1 input, 3 buttons
6. Settings Apps — 1 switch
7. Funder Grantees — 2 selects, 1 input
8. Admin Organizations — 2 inputs, 2 selects

**Total:** 8 pages, ~25 native element replacements

---

## Agent 3: Accessibility Enhancement Specialist

### Mission Statement

You are an **Accessibility Enhancement Specialist** responsible for ensuring ALL pages meet WCAG 2.1 AA standards. Your work makes the VISION Platform usable for everyone, including users with disabilities.

### Required Documentation

**MUST READ before starting any work:**

1. **[VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](./VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)**
   - **Read:** Phase 2 (Page-by-Page Findings)
   - **Focus:** "Accessibility Issues" sections
   - **Look for:** Missing ARIA attributes, semantic HTML issues, keyboard nav problems

2. **[WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)**
   - **Read:** Perceivable, Operable, Understandable, Robust principles
   - **Focus:** Color contrast, keyboard nav, ARIA landmarks, semantic HTML

3. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)**
   - **Read:** "Accessibility Validation" section
   - **Read:** Week 5 schedule (Accessibility focus)

### Task Breakdown: Accessibility Enhancements

#### Common Accessibility Issues & Fixes

**Issue Type 1: Missing Table Captions**

**Audit Finding:**
```markdown
❌ Billing history table lacks <caption>
```

**Fix:**
```tsx
// ❌ BEFORE
<table className="w-full">
  <thead>
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>

// ✅ AFTER
<table className="w-full">
  <caption className="sr-only">Billing history</caption>
  <thead>
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>
```

**Test:**
```typescript
it('should have accessible table caption', () => {
  render(<BillingPage />);
  const table = screen.getByRole('table', { name: /billing history/i });
  expect(table).toBeInTheDocument();
});
```

**Issue Type 2: Missing aria-pressed on Toggle Buttons**

**Audit Finding:**
```markdown
❌ Filter toggles lack aria-pressed attribute
```

**Fix:**
```tsx
// ❌ BEFORE
<button
  onClick={() => toggleFilter('active')}
  className={activeFilters.includes('active') ? 'bg-blue-600' : 'bg-gray-200'}
>
  Active
</button>

// ✅ AFTER
<GlowButton
  onClick={() => toggleFilter('active')}
  variant={activeFilters.includes('active') ? 'primary' : 'outline'}
  aria-pressed={activeFilters.includes('active')}
>
  Active
</GlowButton>
```

**Test:**
```typescript
it('should announce toggle state to screen readers', () => {
  render(<FilterPanel />);
  const activeButton = screen.getByRole('button', { name: /active/i });

  expect(activeButton).toHaveAttribute('aria-pressed', 'false');

  fireEvent.click(activeButton);

  expect(activeButton).toHaveAttribute('aria-pressed', 'true');
});
```

**Issue Type 3: Color-Only Status Indicators**

**Audit Finding:**
```markdown
❌ Status badges rely on color only (not accessible to colorblind users)
```

**Fix:**
```tsx
// ❌ BEFORE
<GlowBadge variant={status === 'active' ? 'success' : 'warning'}>
  {status}
</GlowBadge>

// ✅ AFTER
<GlowBadge variant={status === 'active' ? 'success' : 'warning'}>
  <span className="sr-only">Status: </span>
  {status === 'active' ? 'Active' : 'Pending'}
</GlowBadge>
```

**Test:**
```typescript
it('should provide textual status information', () => {
  render(<StatusBadge status="active" />);
  const badge = screen.getByText(/active/i);
  expect(badge).toHaveTextContent('Status: Active');
});
```

**Issue Type 4: Icon-Only Buttons Without Labels**

**Audit Finding:**
```markdown
❌ Notification icon button lacks aria-label
```

**Fix:**
```tsx
// ❌ BEFORE
<button onClick={openNotifications}>
  <BellIcon />
</button>

// ✅ AFTER
<GlowButton
  variant="ghost"
  size="icon"
  onClick={openNotifications}
  aria-label="Open notifications (3 unread)"
>
  <BellIcon />
</GlowButton>
```

**Test:**
```typescript
it('should have descriptive label for icon button', () => {
  render(<NotificationButton unreadCount={3} />);
  const button = screen.getByRole('button', { name: /open notifications.*3 unread/i });
  expect(button).toBeInTheDocument();
});
```

**Issue Type 5: Missing Form Labels**

**Audit Finding:**
```markdown
❌ Input fields rely on placeholder only (not accessible)
```

**Fix:**
```tsx
// ❌ BEFORE
<GlowInput
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={setEmail}
/>

// ✅ AFTER
<div>
  <label htmlFor="email-input" className="block text-sm font-medium mb-2">
    Email Address
  </label>
  <GlowInput
    id="email-input"
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={setEmail}
    aria-describedby="email-helper"
  />
  <p id="email-helper" className="text-sm text-vision-gray-700 mt-1">
    We'll never share your email with anyone else.
  </p>
</div>
```

**Test:**
```typescript
it('should have associated label for form input', () => {
  render(<EmailForm />);
  const input = screen.getByLabelText(/email address/i);
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('aria-describedby', 'email-helper');
});
```

**Issue Type 6: Keyboard Navigation**

**Audit Finding:**
```markdown
❌ Modal doesn't trap focus
❌ Dropdown not keyboard accessible
```

**Fix (Modal Focus Trap):**
```tsx
import { useEffect, useRef } from 'react';

function GlowModal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    // Trap focus
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
}
```

**Test:**
```typescript
it('should trap focus within modal', () => {
  render(<ModalExample />);
  const openButton = screen.getByRole('button', { name: /open modal/i });

  fireEvent.click(openButton);

  const modalTitle = screen.getByRole('heading', { name: /modal title/i });
  const closeButton = screen.getByRole('button', { name: /close/i });

  // First element should receive focus
  expect(closeButton).toHaveFocus();

  // Tab to last element then back to first
  userEvent.tab();
  userEvent.tab();
  expect(closeButton).toHaveFocus(); // Focus wrapped around
});
```

### Systematic Accessibility Audit Process

**Step 1: Run Storybook A11y Addon**

```bash
pnpm storybook
```

Navigate to component story → Check "Accessibility" panel → Document all violations

**Step 2: Manual Keyboard Testing**

Test EVERY interactive element:
- [ ] Tab through all focusable elements
- [ ] Shift+Tab reverses direction
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate menus

**Step 3: Screen Reader Testing**

Use VoiceOver (macOS) or NVDA (Windows):
- [ ] All content announced
- [ ] Landmarks identified
- [ ] Form labels read
- [ ] Status changes announced

**Step 4: Color Contrast Testing**

Use browser DevTools or WebAIM Contrast Checker:
- [ ] Text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] UI components contrast ≥ 3:1

### Pages to Audit (Week 5-6)

**Week 5:**
1-5. All tables (add captions)
6-15. All filter toggles (add aria-pressed)
16-20. All status indicators (add sr-only text)

**Week 6:**
21-25. All icon buttons (add aria-label)
26-30. All forms (add labels, aria-describedby)
31-35. All modals (focus trap, keyboard nav)

**Total:** 20 pages, ~100 accessibility enhancements

---

## Agent 4: CTA Functionality Specialist

### Mission Statement

You are a **CTA Functionality Specialist** responsible for wiring ALL call-to-action buttons to actual functionality (no more `console.log`!). Your work makes the platform actually DO things when users click buttons.

### Required Documentation

**MUST READ before starting any work:**

1. **[VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](./VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)**
   - **Read:** Phase 2 (Page-by-Page Findings)
   - **Focus:** "Functional Issues" sections
   - **Look for:** CTAs that only `console.log`

2. **[CODE_STANDARDS.md](../general/CODE_STANDARDS.md)**
   - **Read:** Error handling, async patterns, state management
   - **Focus:** Service layer architecture, toast notifications

3. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)**
   - **Read:** Week 3-6 schedule (CTA functionality focus)

### Task Breakdown: CTA Wiring

#### Step 1: Identify Non-Functional CTAs

**From audit, find CTAs that only console.log:**

**Example (Dashboard):**
```markdown
From audit Phase 2.1 Dashboard:

Non-Functional CTAs:
1. "Ask VISION AI" → console.log only
2. "Share update" → console.log only
3. "View all" notifications → console.log only
```

#### Step 2: Determine Required Functionality

**For each CTA, define what it SHOULD do:**

| CTA | Expected Functionality |
|-----|------------------------|
| "Ask VISION AI" | Open AI chat modal, send query to AI service |
| "Share update" | Open share modal, validate content, post to timeline |
| "View all" notifications | Navigate to `/notifications` page |
| "Send invite" | Validate email, POST to team service, show toast |
| "Change plan" | Navigate to billing page, highlight plan selection |

#### Step 3: Create or Use Service Layer

**Check if service exists, if not create it:**

```typescript
// File: apps/shell/src/services/ai-service.ts

export interface AIQuery {
  query: string;
  context?: Record<string, any>;
}

export interface AIResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

export class AIService {
  async sendQuery(query: AIQuery): Promise<AIResponse> {
    const response = await fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error('Failed to send AI query');
    }

    return response.json();
  }
}

export const aiService = new AIService();
```

#### Step 4: Wire CTA to Service with Proper UX

**Example: "Ask VISION AI" Button**

```tsx
// ❌ BEFORE
<GlowButton onClick={() => console.log('Ask AI')}>
  Ask VISION AI
</GlowButton>

// ✅ AFTER
import { useState } from 'react';
import { aiService } from '@/services/ai-service';
import { toast } from '@vision/ui';

function Dashboard() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiQuery, setAIQuery] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAskAI = async () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoadingAI(true);

    try {
      const response = await aiService.sendQuery({ query: aiQuery });

      toast.success('AI response received');

      // Display response in modal
      // ... show response UI

    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      console.error('AI query error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <>
      <GlowButton
        variant="primary"
        onClick={() => setIsAIModalOpen(true)}
        icon={<SparklesIcon />}
      >
        Ask VISION AI
      </GlowButton>

      <GlowModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="Ask VISION AI"
      >
        <GlowTextarea
          value={aiQuery}
          onChange={(e) => setAIQuery(e.target.value)}
          placeholder="Ask me anything about your organization..."
          rows={4}
        />

        <GlowButton
          variant="primary"
          onClick={handleAskAI}
          disabled={isLoadingAI}
          className="mt-4"
        >
          {isLoadingAI ? 'Asking...' : 'Send Question'}
        </GlowButton>
      </GlowModal>
    </>
  );
}
```

#### Step 5: Add Proper Loading States

**Every async CTA needs:**
- [ ] Loading state (disable button)
- [ ] Loading text/spinner
- [ ] Error handling
- [ ] Success feedback

**Pattern:**
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);

  try {
    await service.doSomething();
    toast.success('Action completed!');
  } catch (error) {
    toast.error('Action failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

return (
  <GlowButton
    onClick={handleAction}
    disabled={isLoading}
  >
    {isLoading ? 'Processing...' : 'Do Action'}
  </GlowButton>
);
```

#### Step 6: Add Confirmation for Destructive Actions

**CTAs like "Delete", "Remove", "Cancel" need confirmation:**

```tsx
import { GlowModal } from '@vision/ui';

const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = async () => {
  try {
    await service.deleteSomething(id);
    toast.success('Deleted successfully');
    setShowConfirm(false);
  } catch (error) {
    toast.error('Failed to delete');
  }
};

return (
  <>
    <GlowButton
      variant="destructive"
      onClick={() => setShowConfirm(true)}
    >
      Delete
    </GlowButton>

    <GlowModal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      title="Confirm Deletion"
    >
      <p>Are you sure? This action cannot be undone.</p>

      <div className="flex gap-2 mt-4">
        <GlowButton variant="outline" onClick={() => setShowConfirm(false)}>
          Cancel
        </GlowButton>
        <GlowButton variant="destructive" onClick={handleDelete}>
          Delete
        </GlowButton>
      </div>
    </GlowModal>
  </>
);
```

#### Step 7: Test Functionality

**Write tests for CTA behavior:**

```typescript
describe('Dashboard - Ask VISION AI', () => {
  it('should open AI modal when clicked', () => {
    render(<Dashboard />);
    const askAIButton = screen.getByRole('button', { name: /ask vision ai/i });

    fireEvent.click(askAIButton);

    const modal = screen.getByRole('dialog', { name: /ask vision ai/i });
    expect(modal).toBeInTheDocument();
  });

  it('should send query to AI service', async () => {
    const mockAIService = jest.spyOn(aiService, 'sendQuery');
    mockAIService.mockResolvedValue({
      answer: 'Test response',
      sources: [],
      confidence: 0.9,
    });

    render(<Dashboard />);

    // Open modal
    const askAIButton = screen.getByRole('button', { name: /ask vision ai/i });
    fireEvent.click(askAIButton);

    // Enter query
    const textarea = screen.getByPlaceholderText(/ask me anything/i);
    fireEvent.change(textarea, { target: { value: 'What is my budget?' } });

    // Send question
    const sendButton = screen.getByRole('button', { name: /send question/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockAIService).toHaveBeenCalledWith({
        query: 'What is my budget?',
      });
    });

    // Verify success toast
    expect(screen.getByText(/ai response received/i)).toBeInTheDocument();
  });

  it('should show error toast on failure', async () => {
    const mockAIService = jest.spyOn(aiService, 'sendQuery');
    mockAIService.mockRejectedValue(new Error('Network error'));

    render(<Dashboard />);

    // Trigger error flow...

    await waitFor(() => {
      expect(screen.getByText(/failed to get ai response/i)).toBeInTheDocument();
    });
  });
});
```

### Acceptable Stubs (When Service Layer Not Ready)

**If backend API doesn't exist yet, create intentional stubs:**

```tsx
// ✅ ACCEPTABLE STUB (clearly temporary)
const handleChangeplan = () => {
  // TODO: Wire to Stripe service when backend ready
  toast.success('Plan selection coming soon! Your organization will be able to upgrade/downgrade plans here.');
};

// ❌ NOT ACCEPTABLE (looks broken)
const handleChangePlan = () => {
  console.log('Change plan');
};
```

### Pages with CTAs to Wire (Week 3-6)

**Week 3:**
1. Dashboard (Ask AI, Share update, View all)
2. Applications (Enable app, Add to favorites)

**Week 4:**
3. Settings Billing (Change plan, Update payment, Download invoice)
4. Settings Team (Send invite, Resend, Remove member)
5. Funder Portal (Invite grantee, Review application, Approve grant)

**Week 5-6:**
6. Admin Portal (Create organization, Manage users, Configure settings)
7. All remaining CTAs across 15+ pages

**Total:** 21 pages, ~200 CTAs to wire

---

## Agent 5: Validation & Quality Control Specialist

**See:** [VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md](./VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md) for complete validation agent prompt.

**Mission:** Validate every PR for compliance with all standards before merge.

---

## Agent 6: Testing & Coverage Specialist

### Mission Statement

You are a **Testing & Coverage Specialist** responsible for ensuring ALL code changes have comprehensive tests with 85%+ coverage. You write tests BEFORE code changes (test-driven development).

### Required Documentation

1. **[CODE_STANDARDS.md](../general/CODE_STANDARDS.md)** — Testing standards
2. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)** — Test-driven workflow

### Task Breakdown: Writing Tests

#### Test Types to Write

**1. Component Tests (React Testing Library)**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './page';

describe('Dashboard', () => {
  it('should render main heading', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1, name: /dashboard/i })).toBeInTheDocument();
  });

  it('should display stat cards', () => {
    render(<Dashboard />);
    expect(screen.getByText(/total budget/i)).toBeInTheDocument();
    expect(screen.getByText(/active grants/i)).toBeInTheDocument();
  });
});
```

**2. Interaction Tests**
```typescript
it('should open AI modal on button click', () => {
  render(<Dashboard />);
  const button = screen.getByRole('button', { name: /ask vision ai/i });

  fireEvent.click(button);

  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

**3. Accessibility Tests**
```typescript
it('should be keyboard accessible', () => {
  render(<Dashboard />);
  const button = screen.getByRole('button', { name: /ask vision ai/i });

  button.focus();
  expect(button).toHaveFocus();

  fireEvent.keyDown(button, { key: 'Enter' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

**4. Visual Regression Tests**
```typescript
it('should match snapshot', () => {
  const { container } = render(<Dashboard />);
  expect(container).toMatchSnapshot();
});
```

#### Test Coverage Requirements

- **Changed files:** 85%+ coverage
- **New functions:** 100% coverage
- **Edge cases:** All branches tested

**Check coverage:**
```bash
pnpm test --coverage
```

---

## Universal Documentation References

### Primary Documents (Read First)

1. **[VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](./VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)**
   - Complete findings for all 24 pages
   - Priority matrix
   - Compliance dashboard

2. **[VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](./VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)**
   - Execution workflow
   - Quality gates
   - Week-by-week schedule

3. **[tailwind.config.ts](../../apps/shell/tailwind.config.ts)**
   - Bold Color System tokens (lines 53-117)

4. **[GLOW_UI_IMPLEMENTATION.md](../../GLOW_UI_IMPLEMENTATION.md)**
   - Component API reference

5. **[CODE_STANDARDS.md](../general/CODE_STANDARDS.md)**
   - TypeScript, React, Testing standards

### Supporting Documents

6. **[PROJECT_OVERVIEW.md](../general/PROJECT_OVERVIEW.md)** — Product vision
7. **[Platform_Shell_Implementation_Guide.md](./Platform_Shell_Implementation_Guide.md)** — Architecture

---

## Agent Coordination & Handoffs

### Parallel Work (Same Week)

**Agents that can work simultaneously:**
- Color Compliance + Component Migration (different files)
- Accessibility + CTA Functionality (different concerns)
- Testing Specialist (supports all other agents)
- Validation Specialist (reviews all PRs)

### Sequential Work (Must Complete First)

**Dependencies:**
1. Color Compliance → MUST complete before Accessibility (affects contrast)
2. Component Migration → MUST complete before Accessibility (Glow components have built-in a11y)
3. All fixes → Testing Specialist writes tests

### Handoff Protocol

**When Color Compliance finishes a page:**
```markdown
## Handoff to Component Migration Specialist

Page: /dashboard
Status: Color compliance COMPLETE ✅
Files changed: apps/shell/src/app/dashboard/page.tsx
PR: #123 (merged)

Next: Replace 1 native button on this page with GlowButton.
Audit reference: Phase 2.1, Dashboard, Issue #6
```

**When Component Migration finishes a page:**
```markdown
## Handoff to Accessibility Specialist

Page: /dashboard
Status: Component migration COMPLETE ✅
Previous: Color compliance COMPLETE ✅
Files changed: apps/shell/src/app/dashboard/page.tsx
PR: #145 (merged)

Next: Add aria-label to notification icon button, add table caption.
Audit reference: Phase 2.1, Dashboard, Issues #8-9
```

---

## Quick Start for Each Agent

### I'm Agent 1 (Color Compliance):
1. Read `VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md` Phase 2.1 (Dashboard)
2. Read `tailwind.config.ts` lines 53-117
3. Follow "Task Breakdown: Color Token Replacement" above
4. Start with Dashboard page, Week 1

### I'm Agent 2 (Component Migration):
1. Read `GLOW_UI_IMPLEMENTATION.md` full document
2. Read `VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md` Phase 2 (find native elements)
3. Follow "Task Breakdown: Component Replacement" above
4. Start with Dashboard, Week 1

### I'm Agent 3 (Accessibility):
1. Read WCAG 2.1 AA guidelines
2. Read `VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md` Phase 2 (accessibility issues)
3. Follow "Task Breakdown: Accessibility Enhancements" above
4. Start Week 5 after color/component work done

### I'm Agent 4 (CTA Functionality):
1. Read `CODE_STANDARDS.md` error handling section
2. Read `VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md` Phase 2 (functional issues)
3. Follow "Task Breakdown: CTA Wiring" above
4. Start Week 3

### I'm Agent 5 (Validation):
1. Read `VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md` (full document)
2. Set up all validation scripts
3. Review every PR from Week 1-7

### I'm Agent 6 (Testing):
1. Read `CODE_STANDARDS.md` testing section
2. Support ALL other agents by writing tests
3. Ensure 85%+ coverage on all changes

---

**END OF AGENT PROMPTS GUIDE**

**Document Status:** READY FOR USE
**Total Agents:** 6 specialized agents
**Total Pages:** 24 pages to remediate
**Total Effort:** 260 hours across 7 weeks
