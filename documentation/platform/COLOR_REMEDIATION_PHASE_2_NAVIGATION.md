# Color Remediation Phase 2: Navigation Components

**Status:** 🟡 READY FOR EXECUTION  
**Target:** 100% Navigation Color Compliance  
**Timeline:** Week 2  
**Estimated Effort:** 8-12 hours

---

## 🎯 Objective

Refactor all navigation UI components to use the Bold Color System v3.0 (vision-* tokens and semantic CSS variables), eliminating hardcoded hex colors and generic Tailwind color classes while preserving UX, accessibility, and interaction states.

---

## 📋 Pre-flight Checklist

- [ ] Branch created from latest `main` (or current integration branch)
- [ ] All tests passing (`pnpm test` if applicable)
- [ ] Previous phase completed & merged (Phase 1)
- [ ] Screenshots captured for key navigation views:
  - Dashboard with side nav
  - Any page with top nav
  - Mobile nav drawer open/closed

Recommended branch name:
```bash
git checkout -b fix/color-remediation-phase-2-navigation
```

---

## 🔍 Scope

Navigation-related components only (no business logic changes):

1. `apps/shell/src/components/navigation/GlowSideNav.tsx`
2. `apps/shell/src/components/navigation/GlowTopHeader.tsx`
3. `apps/shell/src/components/navigation/GlowMobileNavDrawer.tsx`

Goal: Remove all of the following patterns in these files:
- Hardcoded hex colors (e.g. `#0047AB`, `#64748B`, `#F9FAFB`, `#DBEAFE`)
- Generic Tailwind color classes (`text-gray-*`, `bg-gray-*`, `border-gray-*`, `text-blue-600`, etc.)
- Non-vision semantic tokens (`bg-muted/50`, `text-muted-foreground/70`) when they conflict with Bold Color System usage

---

## 🎨 Standard Navigation Color Palette

Use this mapping consistently across all navigation components:

| Intent                | Token / Class                        | Notes                           |
|-----------------------|---------------------------------------|----------------------------------|
| Nav background (main) | `bg-background` or `bg-vision-gray-50` | Depends on design context       |
| Nav surface (cards)   | `bg-card`                             | For panels / drawers            |
| Primary accent        | `text-primary`, `bg-primary`          | Active item, primary actions    |
| Secondary text        | `text-vision-gray-700`                | Labels, descriptions            |
| Muted text            | `text-muted-foreground`               | Tertiary information            |
| Default border        | `border-border`                       | Nav dividers                    |
| Selected state chip   | `bg-vision-blue-50 text-primary`      | Selected nav item background    |
| Hover background      | `bg-vision-gray-100`                  | Hover states                    |
| Active indicator      | `bg-primary`                          | Left border or pill indicator   |

**Phase Colors (if used in nav badges):**
- INITIATE: `text-vision-blue-700`
- VOICE: `text-vision-green-700`
- INSPIRE: `text-vision-orange-900`
- NARRATE: `text-vision-purple-900`

---

## 🧩 Step-by-Step: GlowSideNav.tsx

**File:** `apps/shell/src/components/navigation/GlowSideNav.tsx`

### 1. Replace Hardcoded Hex Colors

Common patterns you will see:
- `#0047AB` (primary blue)
- `#64748B` (gray text)
- `#DBEAFE` (blue background)
- `#E6E8EB` / `#EBEDEF` / `#F9FAFB` (grays)

**Guidelines:**
- `#0047AB` → `text-primary` or `bg-primary`
- `#64748B` → `text-vision-gray-700`
- `#DBEAFE` → `bg-vision-blue-50`
- `#E6E8EB`, `#EBEDEF` → `border-border`
- `#F9FAFB` → `bg-vision-gray-50`

Example transformation:
```tsx
// Before
<div className="..." style={{ backgroundColor: '#0047AB' }}>

// After (prefer classes over inline styles)
<div className="bg-primary ...">
```

If inline styles are strictly necessary (rare), use CSS variables:
```tsx
style={{ backgroundColor: 'hsl(var(--primary))' }}
```

### 2. Replace Generic Tailwind Colors

Search for:
- `text-gray-900`, `text-gray-600`, `text-gray-400`
- `bg-gray-100`, `bg-gray-50`
- `border-gray-200`, `border-gray-300`

Replace with:
- `text-gray-900` → `text-vision-gray-950`
- `text-gray-600` / `text-gray-500` → `text-vision-gray-700`
- `text-gray-400` → `text-muted-foreground`
- `bg-gray-100` → `bg-vision-gray-100`
- `bg-gray-50` → `bg-vision-gray-50`
- `border-gray-200` → `border-border`

### 3. Active & Hover States

Ensure nav items follow this pattern:

```tsx
<button
  className={cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-vision-blue-50 text-primary'
      : 'text-vision-gray-700 hover:bg-vision-gray-100 hover:text-foreground'
  )}
>
  {icon}
  <span className="truncate">{label}</span>
</button>
```

- Active state uses `bg-vision-blue-50 text-primary`
- Hover state uses `hover:bg-vision-gray-100`

### 4. Borders & Dividers

Use `border-border` consistently:
```tsx
// Before
<div className="border-l-2" style={{ borderColor: '#0047AB' }} />

// After
<div className="border-l-2 border-primary" />
```

---

## 🧩 Step-by-Step: GlowTopHeader.tsx

**File:** `apps/shell/src/components/navigation/GlowTopHeader.tsx`

### 1. Map Hero & Header Colors

Replace:
- `#0047AB` → `text-primary` / `bg-primary`
- `#64748B` → `text-vision-gray-700`
- `#94A3B8` → `text-muted-foreground`
- `#E6E8EB` → `border-border`
- `#F9FAFB` → `bg-vision-gray-50`

If there is a top gradient or hero strip using hex values, switch to CSS variables or `vision-*` tokens.

### 2. Icon & Badge Colors

Any icon with hardcoded hex:
```tsx
// Before
<SomeIcon className="h-4 w-4" style={{ color: '#0047AB' }} />

// After
<SomeIcon className="h-4 w-4 text-primary" />
```

Badges/pills:
```tsx
// Before
<span className="..." style={{ backgroundColor: '#DBEAFE', color: '#0047AB' }}>

// After
<span className="bg-vision-blue-50 text-primary ...">
```

---

## 🧩 Step-by-Step: GlowMobileNavDrawer.tsx

**File:** `apps/shell/src/components/navigation/GlowMobileNavDrawer.tsx`

### 1. Backdrop & Drawer Surfaces

Replace patterns:
- `bg-black/50` for overlay → keep as-is (semantic non-brand overlay is acceptable)
- `#F9FAFB` → `bg-vision-gray-50`
- `#1F2937` text → `text-foreground`

Drawer container should generally be:
```tsx
<div className="bg-card text-foreground ...">
```

### 2. Nav Item Styles

Align with `GlowSideNav` item patterns:
- Active: `bg-vision-blue-50 text-primary`
- Inactive: `text-vision-gray-700 hover:bg-vision-gray-100`

Ensure no inline color styles remain.

---

## 🔁 Cross-File Checks

After making changes in all three files, run a quick search to ensure no legacy patterns remain in navigation:

```bash
# Hardcoded hex in navigation components
grep -rn "#0047AB\|#64748B\|#F9FAFB\|#DBEAFE" apps/shell/src/components/navigation

# Generic tailwind grays in navigation
grep -rn "text-gray-\|bg-gray-\|border-gray-" apps/shell/src/components/navigation

# Old blue utility
grep -rn "text-blue-600\|bg-blue-600" apps/shell/src/components/navigation
```

Expected: **no matches** after remediation.

---

## 🧪 Testing Protocol

### 1. Automated

```bash
pnpm validate:colors
```
- Confirm that total violations have decreased compared to end of Phase 1.
- Confirm no navigation-related files appear in the violations list.

```bash
pnpm lint
pnpm type-check
pnpm build
```
- All commands should pass without errors.

### 2. Manual Visual Testing

**Desktop:**
- Resize browser to desktop width (~1440px+)
- Visit `/dashboard` and other key routes
- Verify:
  - Nav background colors look correct
  - Active item clearly indicated
  - Hover states visible but not overpowering
  - Text contrast meets AA guidelines

**Mobile:**
- Resize to mobile (~375px)
- Open mobile nav drawer
- Verify:
  - Backdrop opacity feels right
  - Drawer surface uses `bg-card` / `bg-background`
  - Items have correct hover/tap states

### 3. Accessibility Checks

- Use browser dev tools / Lighthouse for accessibility audit
- Confirm:
  - Contrast ratio for nav text vs background >= 4.5:1
  - Focus outlines visible for keyboard navigation

---

## ✅ Completion Criteria

- [ ] No hardcoded hex colors remain in navigation components
- [ ] No generic Tailwind `gray-*` or `blue-*` classes remain in navigation
- [ ] `pnpm validate:colors` shows no navigation files in the report
- [ ] Lint, type-check, and build all pass
- [ ] Visual regression checks passed (before/after screenshots reviewed)
- [ ] Accessibility checks passed for nav areas
- [ ] Changes committed with clear message, e.g.:
  ```bash
  git commit -m "feat(colors): migrate navigation to Bold Color System v3.0"
  ```

---

**Next Phase:** [Dashboard Components](./COLOR_REMEDIATION_PHASE_3_DASHBOARD.md)
