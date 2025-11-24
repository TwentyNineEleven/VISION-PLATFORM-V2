# Color Remediation Phase 1: Quick Wins

**Status:** 🟡 READY FOR EXECUTION  
**Target:** 100% App Page Compliance & Utility Setup  
**Timeline:** Week 1  
**Estimated Effort:** 4-6 hours

---

## 🎯 Objective
Eliminate the few remaining color violations in application pages and establish the foundational utilities for the larger remediation effort.

## 📋 Pre-flight Checklist
- [ ] Ensure `main` branch is up to date
- [ ] Create new branch `fix/color-remediation-phase-1`
- [ ] Verify build passes locally (`pnpm build`)

---

## 🛠️ Step 1: Create Color Mapping Utility

Create a new utility file to standardize color replacements.

**File:** `apps/shell/src/lib/color-mappings.ts`

```typescript
/**
 * Color Mapping Utility for Bold Color System v3.0 Migration
 * Maps legacy hex codes and Tailwind classes to semantic tokens.
 */

export const COLOR_MAPPINGS = {
  // Brand Colors
  primary: {
    legacy: ['#0047AB', '#2563EB', 'bg-blue-600', 'text-blue-600'],
    token: 'primary',
    class: 'bg-primary',
    textClass: 'text-primary'
  },
  secondary: {
    legacy: ['#047857', '#059669', 'bg-emerald-600', 'text-emerald-600'],
    token: 'secondary',
    class: 'bg-secondary',
    textClass: 'text-secondary'
  },
  accent: {
    legacy: ['#C2410C', '#EA580C', 'bg-orange-600', 'text-orange-600'],
    token: 'accent',
    class: 'bg-accent',
    textClass: 'text-accent'
  },
  
  // Neutral Colors
  foreground: {
    legacy: ['#1F2937', '#111827', 'text-gray-900'],
    token: 'foreground',
    class: 'bg-foreground',
    textClass: 'text-foreground'
  },
  muted: {
    legacy: ['#64748B', '#6B7280', 'text-gray-500', 'text-gray-600'],
    token: 'muted-foreground',
    class: 'bg-muted',
    textClass: 'text-muted-foreground'
  },
  border: {
    legacy: ['#E2E8F0', '#D1D5DB', 'border-gray-200', 'border-gray-300'],
    token: 'border',
    class: 'border-border',
    textClass: 'text-border'
  }
} as const;

export const getLegacyColorName = (hex: string): string => {
  // Helper to identify legacy colors in code
  const entry = Object.entries(COLOR_MAPPINGS).find(([_, value]) => 
    value.legacy.includes(hex.toUpperCase()) || value.legacy.includes(hex)
  );
  return entry ? entry[0] : 'unknown';
};
```

---

## 🛠️ Step 2: Fix App Page Violations

Target the specific files identified in the audit.

### 1. Organization Settings Page
**File:** `apps/shell/src/app/settings/organization/page.tsx`
**Violations:** Hardcoded hex `#2563eb` (2 instances)

**Action:** Replace with `bg-primary` or `text-primary`.

```typescript
// Before
style={{ backgroundColor: state.brandColors?.[colorKey] || (colorKey === 'primary' ? '#2563eb' : '#9333ea') }}

// After
// Note: Ideally use CSS variable var(--primary) if inline style is needed
// Or better: use 'var(--color-vision-blue-700)'
```

### 2. Main Page / Landing
**File:** `apps/shell/src/app/page.tsx`
**Violations:** `text-blue-600` (2 instances)

**Action:** Replace with `text-primary`.

---

## 🛠️ Step 3: Update Validation Script

Exclude legitimate design system files from violation reporting.

**File:** `scripts/validate-colors.ts`

**Action:** Add exclusion pattern for theme files.

```typescript
const EXCLUDED_FILES = [
  'src/design-system/theme/colors.ts',
  'src/design-system/theme/visionTheme.ts',
  'src/design-system/theme/glow.ts',
  'src/design-system/theme/shadows.ts',
  'src/design-system/theme/tokens.ts',
  'src/lib/color-mappings.ts', // New file
];
```

---

## 🧪 Testing Protocol

1. **Run Validation:**
   ```bash
   pnpm validate:colors
   ```
   *Expected Result:* ~450 violations (down from 484, cleanly excluding theme files and fixed pages)

2. **Visual Check:**
   - Go to `/settings/organization`
   - Verify brand color picker still shows correct colors
   - Go to `/` (Landing)
   - Verify text colors look correct

3. **Build Check:**
   ```bash
   pnpm build
   ```

---

## ✅ Completion Criteria
- [ ] `apps/shell/src/lib/color-mappings.ts` created
- [ ] App page violations resolved (0 violations in `src/app/*`)
- [ ] Validation script updated
- [ ] Build passes

---

**Next Phase:** [Navigation Components](./COLOR_REMEDIATION_PHASE_2_NAVIGATION.md)
