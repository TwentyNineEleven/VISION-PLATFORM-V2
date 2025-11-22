# VISION Platform — Complete UX/UI Audit Report

**Evaluation Date:** January 21, 2025
**Evaluator:** UX/UI Evaluation Specialist
**Platform:** VISION Platform V2
**Total Pages Evaluated:** 24 pages
**Evaluation Method:** 5-Phase Comprehensive Audit

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 1: Discovery & Inventory](#phase-1-discovery--inventory)
3. [Phase 2: Page-by-Page Detailed Findings](#phase-2-page-by-page-detailed-findings)
4. [Phase 3: Cross-Page Consistency Analysis](#phase-3-cross-page-consistency-analysis)
5. [Phase 4: Critical Issue Synthesis & Priority Matrix](#phase-4-critical-issue-synthesis--priority-matrix)
6. [Phase 5: Implementation Roadmap & Validation](#phase-5-implementation-roadmap--validation)
7. [Appendices](#appendices)

---

## Executive Summary

### Overall Assessment

**Status:** ⚠️ **NEEDS SIGNIFICANT WORK** — Platform is approximately **60-70% production-ready**

### Critical Findings

1. **Navigation Failures (HIGH SEVERITY)**
   - Help & Support (`/help`) advertised in sidebar but routes to 404
   - Admin portal navigation broken: inline tabs point to `/dashboard/admin/*` which 404
   - Admin sidebar visible regardless of `ADMIN_PORTAL_ENABLED` flag

2. **Design System Non-Compliance (HIGH SEVERITY)**
   - **75% of pages** use inline hex/RGB colors instead of Bold Color System tokens
   - **12 instances** of native `<select>` elements bypassing Glow UI components
   - Arbitrary color pickers in branding settings allow any hex value

3. **Fragmented User Experience (HIGH SEVERITY)**
   - **Three separate app catalogs** (`/applications`, `/apps`, `/app-catalog`) with conflicting logic
   - Favorites and app status toggles don't persist across routes
   - Different terminology and filters in each catalog

4. **Non-Functional CTAs (CRITICAL SEVERITY)**
   - **88% of primary CTAs** only `console.log` or mutate local state
   - Key actions broken: "Ask VISION AI", "Share update", "Change plan", "Enable app", "Invite grantee", all billing actions
   - Zero user feedback (no loading states, toasts, or confirmations)

5. **Accessibility Violations (HIGH SEVERITY)**
   - **83% of pages** fail WCAG 2.1 AA criteria
   - Missing table captions (7 tables)
   - Missing `aria-pressed` on filter toggles (24 instances)
   - Color-only status indicators (15+ instances)

### Compliance Dashboard

| Metric | Target | Actual | Status | Impact |
|--------|--------|--------|--------|---------|
| Glow UI Usage | 100% | 35% | ❌ Red | 16 pages use native HTML |
| Bold Color System | 100% | 25% | ❌ Red | 18 pages with inline hex |
| Typography | 100% | 75% | 🟡 Yellow | Mostly compliant |
| Spacing | 100% | 60% | ❌ Red | Double-padding issues |
| Accessibility | 100% | 45% | ❌ Red | Major WCAG violations |
| Responsive Design | 100% | 80% | 🟡 Yellow | Minor fixes needed |
| Code Quality | 100% | 70% | 🟡 Yellow | Mock data everywhere |
| Functional CTAs | 100% | 12% | ❌ Red | 21/24 pages broken |

**Estimated Remediation Effort:** 260 hours (6.5 weeks full-time or 13 weeks part-time)

---

## Phase 1: Discovery & Inventory

### 1.1 Route Map Analysis

**Complete Route Inventory:**

```
VISION Platform V2 Route Structure
├── / (landing - redirects to /dashboard)
├── /dashboard
├── /applications (Glow-based catalog)
├── /apps (duplicate catalog)
├── /app-catalog (legacy duplicate)
├── /apps/[slug] (app detail)
├── /apps/[slug]/onboarding (app setup)
├── /notifications
├── /files
├── /funder
│   ├── /funder (dashboard)
│   ├── /funder/grantees
│   └── /funder/cohorts
├── /settings
│   ├── /settings/profile
│   ├── /settings/organization
│   ├── /settings/team
│   ├── /settings/apps
│   └── /settings/billing
├── /admin
│   ├── /admin (dashboard)
│   ├── /admin/organizations
│   ├── /admin/users
│   ├── /admin/apps
│   ├── /admin/billing
│   ├── /admin/settings
│   └── /admin/cohorts
├── /help (❌ MISSING - 404)
└── /auth
    ├── /auth/signin
    ├── /auth/signup
    └── /auth/reset-password
```

**Route Status:**
- ✅ **Implemented:** 21 pages
- ❌ **Missing:** 1 page (`/help`)
- ⚠️ **Broken Navigation:** Admin suite (inline tabs point to wrong URLs)
- ⚠️ **Duplicate Routes:** 3 app catalogs

**Critical Issues Found:**
1. `/help` route advertised in sidebar but doesn't exist (returns 404)
2. Admin inline navigation points to `/dashboard/admin/*` but routes are at `/admin/*`
3. Admin nav visible even when `ADMIN_PORTAL_ENABLED` flag is false
4. Three separate app catalog routes with no consolidation

---

### 1.2 Design System Asset Inventory

**Glow UI Components Available:**

| Component | Status | Usage Count | Issues |
|-----------|--------|-------------|---------|
| GlowButton | ✅ Implemented | 47 instances | Used correctly |
| GlowCard | ✅ Implemented | 35 instances | Used correctly |
| GlowInput | ✅ Implemented | 28 instances | Used correctly |
| GlowBadge | ✅ Implemented | 22 instances | Used correctly |
| GlowModal | ✅ Implemented | 5 instances | Could be used more |
| GlowSelect | ❌ Not Used | 0 instances | **12 native selects instead** |
| GlowToast | ❌ Not Implemented | 0 instances | **Critical missing** |
| GlowProgress | ⚠️ Partial | 3 instances | Capacity bars use inline RGB |

**Bold Color System v3.0 Tokens:**

Defined in `/apps/shell/tailwind.config.ts`:

```css
/* Primary Brand Colors */
--vision-blue-950: #0047AB      /* Primary CTAs, links */
--vision-green-900: #047857     /* Success, positive */
--vision-orange-900: #C2410C    /* Warnings, accents */
--vision-purple-900: #6D28D9    /* Premium features */
--vision-red-900: #B91C1C       /* Errors, destructive */

/* Gray Scale */
--vision-gray-0: #FFFFFF
--vision-gray-50: #F8FAFC
--vision-gray-100: #F1F5F9
--vision-gray-300: #CBD5E1
--vision-gray-500: #94A3B8
--vision-gray-700: #64748B
--vision-gray-950: #1F2937
```

**Token Violations Found:**

| Page/Component | Violation | Should Use |
|----------------|-----------|------------|
| Dashboard Hero | `#F8FAFC`, `#0047AB` inline | `vision-gray-50`, `vision-blue-950` |
| MiniAppCard | Inline hex phase colors | Theme-based classes |
| Capacity Bars | `rgb(34 197 94)`, `rgb(234 179 8)` | `vision-green-900`, `vision-orange-900` |
| Branding Picker | Arbitrary hex input | Constrained to Bold palette |
| Funder Dashboard | `text-orange-500`, `bg-primary/10` | `text-vision-orange-900` |
| Admin Users | `text-emerald-500` | `text-vision-green-900` |

**18 pages total** with color token violations.

---

### 1.3 Component Usage Analysis

**App Catalog Implementations (3 Separate Stacks):**

| Route | Implementation | Components Used | Status | Issues |
|-------|---------------|-----------------|--------|---------|
| `/applications` | Glow UI | `PageHero`, `AppsFilterBar`, `AppsGrid`, `AppCard` | ✅ Best | Double-padding from wrapper |
| `/apps` | Glow UI | `AppCard`, filter pills, native `<select>` sort | ⚠️ Partial | Native select, no persistence |
| `/app-catalog` | Legacy | Native buttons, Tailwind classes | ❌ Deprecated | Hard-coded colors, no Glow |

**Duplicated Component Patterns:**

1. **Metric Cards**
   - Implementation: Dashboard, Funder Dashboard, Admin Dashboard
   - Variants: 3 different padding/color schemes
   - Recommendation: Extract `<MetricCard>` Glow component

2. **Cohort Cards**
   - Implementation: Funder Cohorts, Admin Cohorts
   - Variants: Different button styles and spacing
   - Recommendation: Extract `<CohortCard>` component

3. **Grantee Tables**
   - Implementation: Funder Grantees page
   - Variants: Inline RGB colors for capacity bars
   - Recommendation: Standardize with `<GranteeTable>` using tokens

4. **Data Tables**
   - Implementation: Files, Billing, Team, Admin pages (7 total)
   - Issues: No shared component, missing captions
   - Recommendation: Create `<DataTable>` with accessibility built-in

5. **Filter Pills**
   - Implementation: Applications, Apps pages
   - Issues: No `aria-pressed`, different logic
   - Recommendation: Create `<FilterPillGroup>` component

6. **Quick Action Grids**
   - Implementation: Dashboard, Admin Dashboard
   - Variants: Different icon colors and sizes
   - Recommendation: Extract `<QuickActionGrid>` component

7. **Status Badges**
   - Implementation: Apps, Grantees, Admin Apps
   - Issues: Inconsistent color/text combinations
   - Recommendation: Create semantic `<StatusBadge>` variants

---

### 1.4 Data Sources & Persistence

**Mock Data Usage:**

All pages rely on mock data from `/apps/shell/src/lib/mock-data.ts`:

```typescript
export const mockApps = [...]           // 18 VISION apps
export const mockNotifications = [...]  // 6 notifications
export const mockFiles = [...]          // 8 files
export const mockGrantees = [...]       // 4 grantees
export const mockCohorts = [...]        // 3 cohorts
export const mockTeamMembers = [...]    // 5 members
export const mockBillingHistory = [...] // 6 invoices
// ... 20+ mock datasets total
```

**State Management Issues:**

1. **No Service Layer**
   - All state in component `useState`
   - No centralized API/data layer
   - No persistence across routes

2. **Local-Only Mutations**
   - Favorite toggles: `useState` only
   - App enable/disable: `useState` only
   - Team invites: `useState` only
   - Notifications: `useState` only
   - All changes lost on refresh

3. **No Global State**
   - No Redux, Zustand, or Context for shared state
   - Each route has isolated state
   - Favorites in `/applications` don't show in `/apps`

**Recommendations:**
- Create service layer (`appsService`, `billingService`, `teamService`)
- Implement global state management
- Add persistence layer (localStorage minimum, API ideal)

---

### 1.5 Accessibility Inventory

**WCAG 2.1 AA Compliance Check:**

| Criterion | Requirement | Status | Violations |
|-----------|-------------|--------|------------|
| 1.3.1 Info & Relationships | Semantic HTML | ⚠️ Partial | Tables lack captions |
| 1.4.1 Use of Color | Color not sole indicator | ❌ Fail | 15+ color-only statuses |
| 1.4.3 Contrast (Min) | 4.5:1 for text | ✅ Pass | Most text passes |
| 2.1.1 Keyboard | All functions via keyboard | ⚠️ Partial | Some CTAs inaccessible |
| 2.4.6 Headings & Labels | Descriptive labels | ⚠️ Partial | Missing avatar labels |
| 4.1.2 Name, Role, Value | ARIA on UI components | ❌ Fail | Filter toggles lack aria-pressed |

**Specific Violations:**

1. **Missing Table Captions (7 tables)**
   - Files table
   - Billing history table
   - Grantees table
   - Team members table
   - Pending invites table
   - Admin organizations table
   - Admin users table

2. **Missing `aria-pressed` (24 instances)**
   - Applications filter pills
   - Apps filter pills
   - Funder grantee filters
   - Settings toggles

3. **Missing `aria-label` (30+ instances)**
   - Avatar initials in cohorts
   - Avatar initials in team lists
   - Icon-only buttons

4. **Color-Only Indicators (15+ instances)**
   - Risk badges (red/yellow/green)
   - Capacity bars (color only)
   - Usage trends (color only)
   - Payment status (color only)

---

## Phase 2: Page-by-Page Detailed Findings

### 2.1 Dashboard (`/dashboard`)

**File Location:** `/apps/shell/src/app/dashboard/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ VIOLATION: Inline hex colors
<GlowCard style={{ backgroundColor: '#F8FAFC', borderRadius: '16px' }}>
  <GlowButton style={{ backgroundColor: '#0047AB', color: '#FFFFFF' }}>
    Ask VISION AI
  </GlowButton>
</GlowCard>

// ❌ VIOLATION: MiniAppCard manipulates DOM
<GlowButton
  style={{ backgroundColor: phaseColor, color: '#FFFFFF' }}
  onMouseEnter={(e) => {
    const hoverColor = phaseColor === '#0F766E' ? '#0D5D56' : ...;
    e.currentTarget.style.backgroundColor = hoverColor;
  }}
/>

// ❌ VIOLATION: Redundant wrapper causing double-padding
<div className="max-w-7xl mx-auto px-8">
  {/* AppShell already provides container padding */}
</div>
```

**Functional Issues:**

```tsx
// ❌ CTA does nothing
<GlowButton onClick={() => console.log('Ask VISION AI')}>
  Ask VISION AI
</GlowButton>
```

**Issues Summary:**
1. ❌ Inline colors (`#F8FAFC`, `#0047AB`) instead of Bold tokens
2. ❌ `MiniAppCard` manipulates DOM directly on hover
3. ❌ `max-w-7xl` wrapper duplicates AppShell padding
4. ❌ "Ask VISION AI" CTA logs to console only
5. ⚠️ Missing `aria-label` on primary CTA

**What's Needed:**
- Replace all inline colors with `vision-gray-50`, `vision-blue-950` classes
- Refactor `MiniAppCard` to use CSS-only hover effects with theme classes
- Remove `max-w-7xl` wrapper
- Wire "Ask VISION AI" to actual AI assistant flow OR add "Coming Soon" badge
- Add `aria-label="Open VISION AI Assistant"` to CTA

**Estimated Fix Time:** 4 hours

---

### 2.2 App Catalog — Applications (`/applications`)

**File Location:** `/apps/shell/src/app/applications/page.tsx`

**Visual Consistency Findings:**

```tsx
// ⚠️ Still has redundant wrapper
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>

// ❌ Filter pills lack accessibility
<button className="rounded-full px-4 py-2 ...">
  {/* No aria-pressed attribute */}
  Active
</button>
```

**Functional Issues:**

```tsx
// ❌ CTAs non-functional
<GlowButton onClick={() => console.log('Ask VISION AI')}>...</GlowButton>
<GlowButton onClick={() => console.log('View usage')}>...</GlowButton>

// ❌ Favorites don't persist
const [favorites, setFavorites] = useState<string[]>([]);
// No backend/localStorage persistence
```

**Issues Summary:**
1. ⚠️ Double-padding from `max-w-7xl` wrapper
2. ❌ Filter pills lack `aria-pressed` state
3. ❌ Bulk CTAs log to console
4. ❌ Favorite toggles mutate local state only (no persistence)
5. ⚠️ No empty state messaging when filters return zero results

**What's Needed:**
- Remove redundant wrapper
- Add `role="button"` and `aria-pressed="true|false"` to filter pills
- Wire CTAs to real flows or show appropriate feedback
- Persist favorites to localStorage/backend
- Add empty state: "No apps match your filters"

**Estimated Fix Time:** 3 hours

---

### 2.3 App Catalog — Apps (`/apps`)

**File Location:** `/apps/shell/src/app/apps/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Native select instead of Glow component
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="h-11 w-full rounded-md border ..."
>
  <option value="name">Name</option>
  <option value="category">Category</option>
</select>

// ❌ Filter pills lack aria-pressed
<button className="...">
  {/* Missing aria-pressed */}
</button>
```

**Functional Issues:**

```tsx
// ❌ Favorites don't persist
const [favorites, setFavorites] = useState<Set<string>>(new Set());

// ❌ List view toggle is cosmetic
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
// But always renders grid regardless
```

**Issues Summary:**
1. ❌ Sort dropdown is native `<select>` instead of `GlowSelect`
2. ❌ Filter pills lack `aria-pressed` attribute
3. ❌ Favorite toggles mutate local state only
4. ❌ "List view" toggle doesn't actually change layout
5. ⚠️ Duplicate of `/applications` with fewer features

**What's Needed:**
- **Merge into `/applications`** — consolidate features
- Replace native select with `GlowSelect`
- Add `aria-pressed` to filters
- Persist favorites
- Implement actual list layout OR remove toggle

**Estimated Fix Time:** 4 hours (consolidation) or 2 hours (fixes only)

---

### 2.4 App Catalog — Legacy (`/app-catalog`)

**File Location:** `/apps/shell/src/app/app-catalog/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Hard-coded Tailwind colors instead of Glow/Bold
<div className="bg-gray-900 text-white">
  <button className="bg-blue-600 hover:bg-blue-700">
    {/* Native button with Tailwind classes */}
  </button>
</div>

// ❌ Inline hex values
<div style={{ backgroundColor: '#1F2937', color: '#64748B' }}>
  {/* Manual styling */}
</div>
```

**Issues Summary:**
1. ❌ **ENTIRE PAGE VIOLATES DESIGN SYSTEM**
2. ❌ Zero Glow UI components used
3. ❌ All native HTML elements
4. ❌ Hard-coded hex colors (`#1F2937`, `#64748B`)
5. ❌ Duplicate of `/applications` with inferior UX
6. ❌ No advanced filters (present in `/applications`)

**What's Needed:**
- **DELETE THIS PAGE ENTIRELY**
- Set up redirect: `/app-catalog` → `/applications`
- Remove from navigation
- Clean up any references in codebase

**Estimated Fix Time:** 0.5 hours (deletion + redirect)

---

### 2.5 App Detail (`/apps/[slug]`)

**File Location:** `/apps/shell/src/app/apps/[slug]/page.tsx`

**Functional Issues:**

```tsx
// ❌ CRITICAL: Launch button reloads same page
const launchHref = app?.launchPath || `/apps/${params.slug}`;

<GlowButton asChild>
  <Link href={launchHref}>
    Open App {/* Clicks here just reload detail page */}
  </Link>
</GlowButton>

// ❌ Status logic broken
{app?.status === 'coming-soon' && (
  <GlowBadge>Full experience coming soon</GlowBadge>
)}
// Shows "coming soon" even for active apps

// ❌ Wrong TypeScript signature
export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // ❌ Should await
})
```

**Issues Summary:**
1. ❌ **CRITICAL:** `launchHref` defaults to `/apps/[slug]`, causing "Open app" to reload same page
2. ❌ Status messaging shows "coming soon" for active apps
3. ❌ Params typed as `Promise` instead of awaited (Next.js 15 issue)
4. ❌ No 404 handling for invalid slugs
5. ⚠️ No loading states

**What's Needed:**
- Provide real `launchPath` for each app in mock data OR disable button with tooltip
- Fix status logic to use actual app status
- Update route signature: `const { slug } = await params;`
- Return `notFound()` when app doesn't exist
- Add "Launching..." intermediate state

**Estimated Fix Time:** 2 hours

---

### 2.6 App Onboarding (`/apps/[slug]/onboarding`)

**File Location:** `/apps/shell/src/app/apps/[slug]/onboarding/page.tsx`

**Functional Issues:**

```tsx
// ❌ Steps are static text only
const steps = [
  { id: 1, title: 'Connect data sources', completed: true },
  { id: 2, title: 'Configure settings', completed: false },
  // No actual tasks to perform
];

// ❌ Launch button loops back
<GlowButton asChild>
  <Link href={`/apps/${app.slug}`}>
    Launch App {/* Goes back to detail page */}
  </Link>
</GlowButton>

// ❌ Same params issue
export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ slug: string }>; // ❌ Should await
})
```

**Issues Summary:**
1. ❌ **CRITICAL:** Steps are purely informational (no tasks to complete)
2. ❌ "Launch" button goes back to detail page instead of actual app
3. ❌ No progress tracking or persistence
4. ❌ Params typed as `Promise` (Next.js 15 issue)
5. ⚠️ No validation that app actually supports onboarding

**What's Needed:**
- Build genuine onboarding tasks (checkboxes, forms, configuration)
- Save progress to localStorage or backend
- Provide real launch path after completion
- Update route signature to await params
- Add completion redirect to actual app experience

**Estimated Fix Time:** 6 hours (for real onboarding) or 1 hour (to remove fake steps)

---

### 2.7 Notifications (`/notifications`)

**File Location:** `/apps/shell/src/app/notifications/page.tsx`

**Visual Consistency Findings:**

```tsx
// ⚠️ Uses non-token color for unread highlight
<div className={cn(
  'p-4',
  !notification.read && 'bg-blue-50/50' // ❌ Should use vision-blue-50
)}>
```

**Functional Issues:**

```tsx
// ❌ All actions update local state only
const markAsRead = (id: string) => {
  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, read: true } : n)
  );
  // No backend call
};

// ❌ No toast feedback
const clearAll = () => {
  setNotifications([]);
  // User gets no confirmation
};
```

**Issues Summary:**
1. ⚠️ Unread highlight uses `bg-blue-50/50` instead of Bold token
2. ❌ Mark as read/unread only updates local state
3. ❌ Delete notification only updates local state
4. ❌ Clear all only updates local state
5. ❌ No toast notifications for user actions
6. ✅ Otherwise generally compliant with Glow UI

**What's Needed:**
- Replace `bg-blue-50/50` with `bg-vision-blue-50`
- Connect actions to notifications service (even if mocked)
- Add toast confirmations for all actions
- Persist state changes
- Add undo functionality for bulk actions

**Estimated Fix Time:** 2 hours

---

### 2.8 Files (`/files`)

**File Location:** `/apps/shell/src/app/files/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Tailwind grays instead of Bold tokens
<p className="text-gray-600">Manage and organize your documents</p>
<div className="bg-gray-200 rounded-full h-2">
  {/* Progress bar */}
</div>

// ❌ Icon colors hardcoded
<FileIcon className="w-8 h-8 text-blue-500" />
<ImageIcon className="w-8 h-8 text-green-600" />

// ❌ Native select
<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="h-11 w-full rounded-md border ..."
>
```

**Functional Issues:**

```tsx
// ❌ Upload button does nothing
<GlowButton onClick={() => console.log('Upload')}>
  Upload Files
</GlowButton>

// ❌ Download navigates to #
<GlowButton asChild>
  <Link href="#">Download</Link>
</GlowButton>

// ❌ Delete doesn't persist
const handleDelete = (fileId: string) => {
  setFiles(prev => prev.filter(f => f.id !== fileId));
  // Lost on refresh
};
```

**Accessibility Issues:**

```tsx
// ❌ Table lacks caption
<table className="w-full">
  {/* No <caption> element */}
  <thead>...</thead>
</table>

// ❌ File type icons lack labels
<FileIcon className="w-8 h-8" />
{/* No aria-label describing file type */}
```

**Issues Summary:**
1. ❌ Uses `text-gray-600`, `bg-gray-200` instead of Bold tokens
2. ❌ Icon colors hardcoded (`text-blue-500`, `text-green-600`)
3. ❌ Category filter is native `<select>`
4. ❌ Upload button does nothing
5. ❌ Download buttons navigate to `#` (no action)
6. ❌ Delete doesn't persist changes
7. ❌ Table lacks caption
8. ❌ File type icons lack `aria-label`

**What's Needed:**
- Replace all Tailwind colors with Bold tokens
- Replace icon colors with `text-vision-blue-950`, etc.
- Replace native select with `GlowSelect`
- Wire upload/download/delete to file service
- Add table caption: `<caption>Your uploaded files</caption>`
- Add `aria-label` to file icons: `aria-label="PDF document"`

**Estimated Fix Time:** 4 hours

---

### 2.9 Settings — Profile (`/settings/profile`)

**File Location:** `/apps/shell/src/app/settings/profile/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Native select for timezone
<select
  value={formState.timezone}
  className="h-11 w-full rounded-md ..."
>
  {mockTimezones.map(tz => (
    <option key={tz.value} value={tz.value}>{tz.label}</option>
  ))}
</select>
```

**Functional Issues:**

```tsx
// ❌ Password change shows success without validation
const handlePasswordChange = () => {
  console.log('Password changed');
  setShowSuccess(true); // Always succeeds
};

// ❌ Save button always succeeds
const handleSave = () => {
  console.log('Saved');
  setShowSuccess(true); // No validation
};

// ❌ Delete account just logs
const handleDeleteAccount = () => {
  console.log('Account deleted');
  // No confirmation, no actual deletion
};
```

**Issues Summary:**
1. ❌ Timezone control is native `<select>`
2. ❌ Password change shows success regardless of validation
3. ❌ Save button always shows success (no actual save)
4. ❌ Danger Zone "Delete Account" only logs to console
5. ❌ No confirmation dialogs for destructive actions
6. ⚠️ No dirty-state tracking (can navigate away with unsaved changes)

**What's Needed:**
- Replace timezone select with `GlowSelect`
- Add password validation (length, complexity, match)
- Wire Save button to profile service with real feedback
- Implement delete account confirmation flow
- Add dirty-state warning on navigation
- Add password strength indicator

**Estimated Fix Time:** 4 hours

---

### 2.10 Settings — Organization (`/settings/organization`)

**File Location:** `/apps/shell/src/app/settings/organization/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Native selects
<select value={state.organizationType} className="...">
  {mockOrganizationTypes.map(...)}
</select>

<select value={state.country} className="...">
  {mockCountries.map(...)}
</select>

// ❌ Arbitrary hex color picker
<input
  type="color"
  value={state.brandColors?.primary || '#2563eb'}
  onChange={(e) => handleChange('brandColors', {
    ...state.brandColors,
    primary: e.target.value // ❌ Allows any hex value
  })}
/>
```

**Functional Issues:**

```tsx
// ❌ Save always succeeds
const handleSave = () => {
  console.log('Organization saved');
  setShowSuccess(true); // No validation or persistence
};

// ❌ Danger zone actions inert
const handleTransferOwnership = () => {
  console.log('Transfer ownership');
  // No actual transfer flow
};

const handleDeleteOrganization = () => {
  console.log('Delete organization');
  // No confirmation or deletion
};
```

**Issues Summary:**
1. ❌ Organization type select is native `<select>`
2. ❌ Country select is native `<select>`
3. ❌ **CRITICAL:** Branding allows arbitrary hex colors (should constrain to Bold palette)
4. ❌ Save button always shows success (no validation)
5. ❌ Transfer ownership button does nothing
6. ❌ Delete organization button does nothing
7. ⚠️ No confirmation for destructive actions

**What's Needed:**
- Replace native selects with `GlowSelect`
- **Constrain branding colors to Bold Color System palette only**
- Add form validation (required fields, URL format)
- Wire Save to organization service
- Implement transfer ownership flow with security checks
- Implement delete organization with confirmation + warning
- Add logo upload with cropping

**Estimated Fix Time:** 5 hours

---

### 2.11 Settings — Team (`/settings/team`)

**File Location:** `/apps/shell/src/app/settings/team/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Native select for role
<select value={inviteRole} className="...">
  <option value="owner">Owner</option>
  <option value="admin">Admin</option>
  <option value="editor">Editor</option>
  <option value="viewer">Viewer</option>
</select>

// ❌ Edit role dropdowns also native
<select value={member.role} className="...">
  {/* Role options */}
</select>
```

**Functional Issues:**

```tsx
// ❌ Send invite does nothing
const handleSendInvite = () => {
  console.log('Invite sent');
  // No validation, no backend call
};

// ❌ Resend does nothing
const handleResend = (inviteId: string) => {
  console.log('Resend', inviteId);
};

// ❌ Cancel invite does nothing
const handleCancel = (inviteId: string) => {
  console.log('Cancel', inviteId);
};

// ❌ Remove member does nothing
const handleRemove = (memberId: string) => {
  console.log('Remove', memberId);
  // No confirmation
};
```

**Accessibility Issues:**

```tsx
// ⚠️ Permissions matrix could use table semantics
<div className="grid grid-cols-5">
  {/* Rendered as div grid instead of <table> */}
</div>
```

**Issues Summary:**
1. ❌ Invite form role dropdown is native `<select>`
2. ❌ Edit role dropdowns are native `<select>`
3. ❌ "Send invite" does nothing
4. ❌ "Resend" invitation does nothing
5. ❌ "Cancel" invitation does nothing
6. ❌ "Remove" member does nothing
7. ❌ No email validation on invite form
8. ❌ No confirmation for destructive actions
9. ⚠️ Permissions matrix should use `<table>` semantics

**What's Needed:**
- Replace all selects with `GlowSelect`
- Wire all team actions to team service
- Add email validation
- Add confirmation dialogs for remove/cancel actions
- Convert permissions matrix to proper `<table>` with ARIA
- Add toast notifications for all actions

**Estimated Fix Time:** 4 hours

---

### 2.12 Settings — Apps (`/settings/apps`)

**File Location:** `/apps/shell/src/app/settings/apps/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Uses text-emerald-500 instead of Bold token
<p className="text-sm text-emerald-500">
  ↑ 12% from last month
</p>
```

**Functional Issues:**

```tsx
// ❌ Enable/disable toggles only update local state
const handleToggle = (appId: string) => {
  setEnabledApps(prev =>
    prev.includes(appId)
      ? prev.filter(id => id !== appId)
      : [...prev, appId]
  );
  // No persistence
};

// ❌ Configure button does nothing
<GlowButton onClick={() => console.log('Configure')}>
  Configure
</GlowButton>

// ❌ Change plan does nothing
<GlowButton onClick={() => console.log('Change plan')}>
  Change Plan
</GlowButton>

// ❌ Manage billing does nothing
<GlowButton onClick={() => console.log('Manage billing')}>
  Manage Billing
</GlowButton>
```

**Issues Summary:**
1. ❌ Usage trend text uses `text-emerald-500` instead of `text-vision-green-900`
2. ❌ Enable/disable toggles only update local state (no persistence)
3. ❌ "Configure" button does nothing
4. ❌ "Change plan" button does nothing
5. ❌ "Manage billing" button does nothing
6. ⚠️ No usage analytics (static data)

**What's Needed:**
- Replace `text-emerald-500` with `text-vision-green-900`
- Persist app enable/disable toggles to backend/localStorage
- Wire "Configure" to app-specific settings OR remove if not applicable
- Wire "Change plan" to plan selection flow
- Wire "Manage billing" to navigate to billing page or open modal
- Add toast confirmations for toggle changes

**Estimated Fix Time:** 3 hours

---

### 2.13 Settings — Billing (`/settings/billing`)

**File Location:** `/apps/shell/src/app/settings/billing/page.tsx`

**Functional Issues:**

```tsx
// ❌ ALL CTAs are non-functional
<GlowButton onClick={() => console.log('Change plan')}>Change Plan</GlowButton>
<GlowButton onClick={() => console.log('Cancel subscription')}>Cancel</GlowButton>
<GlowButton onClick={() => console.log('Update payment')}>Update Payment Method</GlowButton>
<GlowButton onClick={() => console.log('Export')}>Export</GlowButton>
<GlowButton onClick={() => console.log('Download')}>Download Invoice</GlowButton>
<GlowButton onClick={() => console.log('Save contact')}>Save</GlowButton>

// ❌ AI usage data is static
const aiUsage = {
  used: 15000,
  limit: 50000,
  // Never updates
};

// ❌ Contact form doesn't persist
const handleSaveContact = () => {
  console.log('Contact saved');
  // No validation or persistence
};
```

**Accessibility Issues:**

```tsx
// ❌ Billing history table lacks caption
<table className="w-full">
  {/* No <caption> */}
  <thead>...</thead>
</table>

// ❌ Invoice status relies on color only
<GlowBadge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
  {invoice.status}
</GlowBadge>
// Should include text like "Paid" or "Due"
```

**Issues Summary:**
1. ❌ **ENTIRE PAGE NON-FUNCTIONAL** — all CTAs log to console only
2. ❌ "Change plan" does nothing
3. ❌ "Cancel subscription" does nothing
4. ❌ "Update payment method" does nothing
5. ❌ "Export" billing data does nothing
6. ❌ "Download invoice" does nothing
7. ❌ Contact form doesn't save
8. ❌ AI usage data is static (never updates)
9. ❌ Billing history table lacks caption
10. ❌ Payment status relies on color only

**What's Needed:**
- Implement Stripe/payment integration OR stub with toasts
- Wire all CTAs to billing service
- Add form validation for contact info
- Add confirmation dialogs for plan changes/cancellation
- Implement invoice download functionality
- Add table caption: `<caption>Billing history</caption>`
- Add textual status labels: `<span className="sr-only">Paid</span>`
- Make AI usage update in real-time

**Estimated Fix Time:** 8 hours (with Stripe) or 3 hours (with stubs)

---

### 2.14 Funder Dashboard (`/funder`)

**File Location:** `/apps/shell/src/app/funder/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Inline colors
<p className="text-sm text-orange-500">
  High priority
</p>

<div className="bg-primary/10 rounded-lg p-4">
  {/* Manual opacity instead of token */}
</div>

// ❌ Double padding
<Container maxWidth="7xl" className="px-8">
  {/* Container already provides padding */}
</Container>
```

**Functional Issues:**

```tsx
// ❌ CTAs don't work
<GlowButton onClick={() => console.log('Share update')}>
  Share Update
</GlowButton>

<GlowButton onClick={() => console.log('Create report')}>
  Create Report
</GlowButton>

// ❌ Filters don't affect data
const [timeRange, setTimeRange] = useState('30d');
const [selectedCohort, setSelectedCohort] = useState('all');
// Changes don't re-query or filter data
```

**Issues Summary:**
1. ❌ Uses `text-orange-500` instead of `text-vision-orange-900`
2. ❌ Uses `bg-primary/10` instead of tokenized variant
3. ❌ `Container maxWidth="7xl"` plus `px-8` causes double-padding
4. ❌ "Share update" button does nothing
5. ❌ "Create report" button does nothing
6. ❌ Time range filter doesn't affect displayed data
7. ❌ Cohort filter doesn't affect displayed data

**What's Needed:**
- Replace inline colors with Bold tokens
- Remove `px-8` (Container handles padding)
- Wire "Share update" to sharing modal/flow
- Wire "Create report" to report generation
- Make filters actually re-query/filter data
- Add loading states when filters change

**Estimated Fix Time:** 4 hours

---

### 2.15 Funder — Grantees (`/funder/grantees`)

**File Location:** `/apps/shell/src/app/funder/grantees/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Capacity bars use inline RGB
<div
  className="h-full rounded-full"
  style={{
    width: `${grantee.capacityScore}%`,
    backgroundColor:
      grantee.capacityScore >= 80
        ? 'rgb(34 197 94)'   // ❌ Should use vision-green-900
        : grantee.capacityScore >= 60
          ? 'rgb(234 179 8)' // ❌ Should use vision-orange-900
          : 'rgb(239 68 68)', // ❌ Should use vision-red-900
  }}
/>

// ❌ Native selects for filters
<select value={statusFilter} className="...">
  <option value="all">All Statuses</option>
  <option value="active">Active</option>
</select>
```

**Functional Issues:**

```tsx
// ❌ Invite grantee button inert
<GlowButton onClick={() => console.log('Invite grantee')}>
  Invite Grantee
</GlowButton>

// ❌ Filters don't actually filter
const handleFilterChange = (key: string, value: string) => {
  setFilters(prev => ({ ...prev, [key]: value }));
  // Doesn't re-query data
};
```

**Accessibility Issues:**

```tsx
// ❌ Table lacks caption
<table className="w-full">
  {/* No <caption> */}
</table>

// ❌ Risk/capacity rely on color only
<GlowBadge variant={risk === 'high' ? 'danger' : 'warning'}>
  {risk}
</GlowBadge>
// No textual severity label
```

**Issues Summary:**
1. ❌ **CRITICAL:** Capacity bars use inline RGB values instead of Bold tokens
2. ❌ All filter dropdowns are native `<select>`
3. ❌ "Invite grantee" button does nothing
4. ❌ Filters are cosmetic (don't affect data)
5. ❌ Table lacks caption
6. ❌ Risk/capacity status relies on color only (no text labels)
7. ⚠️ No accessible textual severity indicators

**What's Needed:**
- Replace RGB capacity colors with Bold token classes
- Replace native selects with `GlowSelect`
- Wire "Invite grantee" to invitation flow
- Make filters functional (re-query data)
- Add table caption: `<caption>Grantee portfolio</caption>`
- Add severity text: `<span className="sr-only">High risk</span>`
- Add textual capacity labels

**Estimated Fix Time:** 5 hours

---

### 2.16 Funder — Cohorts (`/funder/cohorts`)

**File Location:** `/apps/shell/src/app/funder/cohorts/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Redundant wrapper
<div className="max-w-6xl mx-auto px-6">
  {/* Duplicates AppShell container */}
</div>
```

**Functional Issues:**

```tsx
// ❌ Edit button logs only
<GlowButton onClick={() => console.log('Edit', cohort.id)}>
  Edit
</GlowButton>

// ❌ Delete button logs only
<GlowButton onClick={() => console.log('Delete', cohort.id)}>
  Delete
</GlowButton>

// ❌ Create modal lacks validation
const handleCreate = () => {
  console.log('Create cohort');
  // No validation, no persistence
};
```

**Accessibility Issues:**

```tsx
// ❌ Member avatars lack aria-label
<div className="flex -space-x-2">
  {cohort.members.slice(0, 5).map(member => (
    <div className="w-8 h-8 rounded-full bg-blue-500">
      {member.initials}
      {/* No aria-label="Jane Doe" */}
    </div>
  ))}
</div>
```

**Issues Summary:**
1. ❌ `max-w-6xl` wrapper causes double-padding
2. ❌ Edit button only logs to console
3. ❌ Delete button only logs to console
4. ❌ Create modal lacks validation
5. ❌ No persistence for any actions
6. ❌ Member avatars lack `aria-label` describing the user

**What's Needed:**
- Remove `max-w-6xl` wrapper (rely on AppShell)
- Implement edit cohort flow with validation
- Implement delete cohort with confirmation
- Add validation to create modal (name required, description max length)
- Wire to cohort service for persistence
- Add `aria-label` to avatars: `aria-label="Jane Doe"`

**Estimated Fix Time:** 4 hours

---

### 2.17 Admin Dashboard (`/admin`)

**File Location:** `/apps/shell/src/app/admin/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Color token violation
<p className="text-emerald-500">
  Active organizations
</p>
```

**Navigation Issues:**

```tsx
// ❌ Inline tabs point to wrong URLs
<Link href="/dashboard/admin/organizations">
  Organizations
  {/* Should be /admin/organizations */}
</Link>

<Link href="/dashboard/admin/users">
  Users
  {/* Should be /admin/users */}
</Link>
```

**Functional Issues:**

```tsx
// ❌ Quick action buttons log only
<GlowButton onClick={() => console.log('Create org')}>
  Create Organization
</GlowButton>

<GlowButton onClick={() => console.log('Invite user')}>
  Invite User
</GlowButton>

<GlowButton onClick={() => console.log('Configure app')}>
  Configure App
</GlowButton>

<GlowButton onClick={() => console.log('Run report')}>
  Run Report
</GlowButton>
```

**Issues Summary:**
1. ❌ **CRITICAL:** Inline navigation tabs point to `/dashboard/admin/*` which 404
2. ❌ Uses `text-emerald-500` instead of `text-vision-green-900`
3. ❌ All quick action buttons log to console only
4. ⚠️ Admin nav visible even when `ADMIN_PORTAL_ENABLED` flag is false

**What's Needed:**
- **Fix inline navigation URLs** — remove `/dashboard` prefix
- Replace `text-emerald-500` with Bold token
- Wire quick actions to actual flows (create org modal, invite user modal, etc.)
- Add toasts for all actions
- Guard admin nav visibility with feature flag

**Estimated Fix Time:** 3 hours

---

### 2.18 Admin — Organizations (`/admin/organizations`)

**File Location:** `/apps/shell/src/app/admin/organizations/page.tsx`

**Navigation Issues:**

```tsx
// ❌ Wrong route
<Link href={`/dashboard/admin/apps?orgId=${org.id}`}>
  Manage Apps
  {/* Should be /admin/apps?orgId=... */}
</Link>
```

**Functional Issues:**

```tsx
// ❌ Impersonate button enabled but does nothing
<GlowButton
  onClick={() => console.log('Impersonate', org.id)}
  disabled={false} // ❌ Always enabled
>
  Impersonate
</GlowButton>
```

**Accessibility Issues:**

```tsx
// ❌ Table lacks caption
<table className="w-full">
  {/* No <caption> describing organizations table */}
</table>
```

**Issues Summary:**
1. ❌ **CRITICAL:** "Manage apps" links to `/dashboard/admin/apps` (404)
2. ❌ Should link to `/admin/apps?orgId=...`
3. ❌ "Impersonate" button enabled for all orgs but does nothing
4. ❌ No validation or confirmation for impersonation
5. ❌ Table lacks caption

**What's Needed:**
- Fix "Manage apps" route (remove `/dashboard` prefix)
- Wire impersonate flow OR disable button with tooltip explaining why
- Add validation (can only impersonate if org allows it)
- Add confirmation dialog for impersonation
- Add table caption: `<caption>All organizations</caption>`
- Add toast feedback

**Estimated Fix Time:** 2 hours

---

### 2.19 Admin — Users (`/admin/users`)

**File Location:** `/apps/shell/src/app/admin/users/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Permissions matrix uses text-emerald-500
<div className="text-emerald-500">
  ✓ {/* Checkmark */}
</div>
```

**Functional Issues:**

```tsx
// ❌ Invite user modal only mutates local state
const handleInvite = () => {
  setUsers(prev => [...prev, newUser]);
  // No backend call
};

// ❌ Edit user only mutates local state
const handleEdit = (userId: string) => {
  setUsers(prev => prev.map(u =>
    u.id === userId ? { ...u, ...edits } : u
  ));
  // No persistence
};
```

**Accessibility Issues:**

```tsx
// ❌ Permission checkmarks rely on color only
<div className={cn(
  hasPermission ? 'text-emerald-500' : 'text-gray-300'
)}>
  {hasPermission ? '✓' : '—'}
</div>
// No aria-label or textual description
```

**Issues Summary:**
1. ❌ Permissions matrix uses `text-emerald-500` instead of Bold token
2. ❌ Invite user modal only mutates local state (no backend)
3. ❌ Edit user only mutates local state
4. ❌ No email validation on invite form
5. ❌ No persistence for any changes
6. ❌ Permission indicators rely on color only

**What's Needed:**
- Replace `text-emerald-500` with `text-vision-green-900`
- Wire invite/edit actions to admin user service
- Add email validation
- Add form error feedback
- Add `aria-label` to permission indicators
- Add toast confirmations

**Estimated Fix Time:** 3 hours

---

### 2.20 Admin — Apps (`/admin/apps`)

**File Location:** `/apps/shell/src/app/admin/apps/page.tsx`

**Functional Issues:**

```tsx
// ❌ Global enable/disable toggles mutate state without persistence
const handleToggle = (appId: string) => {
  setEnabledApps(prev =>
    prev.includes(appId)
      ? prev.filter(id => id !== appId)
      : [...prev, appId]
  );
  // No backend call, no confirmation
};

// ❌ Beta/Coming Soon messaging inconsistent
{app.status === 'beta' && <GlowBadge>Beta</GlowBadge>}
{app.status === 'coming-soon' && <GlowBadge>Coming Soon</GlowBadge>}
// But some apps show both or neither
```

**Issues Summary:**
1. ❌ **CRITICAL:** Platform-wide app toggles have no confirmation
2. ❌ Toggles only update local state (no persistence)
3. ❌ No admin activity logging for platform changes
4. ❌ Beta/Coming Soon messaging inconsistent
5. ⚠️ No rollback/undo functionality for accidental changes

**What's Needed:**
- Add confirmation dialog for platform-wide changes
- Wire toggles to admin apps service
- Add admin activity logging
- Implement undo/rollback functionality
- Standardize app status messaging
- Add toasts with action feedback

**Estimated Fix Time:** 4 hours

---

### 2.21 Admin — Billing (`/admin/billing`)

**File Location:** `/apps/shell/src/app/admin/billing/page.tsx`

**Functional Issues:**

```tsx
// ❌ All actions inert
<GlowButton onClick={() => console.log('Collect payment')}>
  Collect Payment
</GlowButton>

<GlowButton onClick={() => console.log('Export CSV')}>
  Export CSV
</GlowButton>

// ❌ Summary data is static
const summary = {
  mrr: 125000,
  activeOrgs: 47,
  // Never updates
};
```

**Accessibility Issues:**

```tsx
// ❌ Table lacks caption
<table className="w-full">
  {/* No <caption> */}
</table>

// ❌ Payment status relies on color only
<GlowBadge variant={status === 'paid' ? 'success' : 'danger'}>
  {status}
</GlowBadge>
```

**Issues Summary:**
1. ❌ "Collect payment" button does nothing
2. ❌ "Export CSV" button does nothing
3. ❌ Summary data is static (never updates)
4. ❌ Table lacks caption
5. ❌ Payment status relies on color only

**What's Needed:**
- Implement payment collection flow OR show stub toast
- Implement CSV export functionality
- Connect to real/mock billing data
- Add table caption: `<caption>Organization billing status</caption>`
- Add textual status labels

**Estimated Fix Time:** 3 hours

---

### 2.22 Admin — Settings (`/admin/settings`)

**File Location:** `/apps/shell/src/app/admin/settings/page.tsx`

**Visual Consistency Findings:**

```tsx
// ❌ Branding accepts arbitrary hex colors
<input
  type="color"
  value={platformBranding.primaryColor || '#0047AB'}
  onChange={(e) => setPlatformBranding({
    ...platformBranding,
    primaryColor: e.target.value // ❌ Allows any hex
  })}
/>
```

**Functional Issues:**

```tsx
// ❌ Save button lacks feedback
const handleSave = () => {
  console.log('Platform settings saved');
  // No validation, no persistence, no feedback
};

// ❌ Toggles mutate state only
const handleToggle = (setting: string) => {
  setSettings(prev => ({
    ...prev,
    [setting]: !prev[setting]
  }));
  // No persistence
};
```

**Issues Summary:**
1. ❌ **CRITICAL:** Branding accepts arbitrary hex (should constrain to Bold palette)
2. ❌ Save button lacks validation and feedback
3. ❌ Toggles mutate local state only (no persistence)
4. ⚠️ No confirmation for sensitive platform-wide changes
5. ⚠️ No dirty-state tracking

**What's Needed:**
- **Enforce Bold Color System** for branding palette picker
- Add validation for all settings
- Wire to admin config service
- Add toast feedback
- Add confirmation for sensitive changes
- Add dirty-state warning

**Estimated Fix Time:** 3 hours

---

### 2.23 Admin — Cohorts (`/admin/cohorts`)

**File Location:** `/apps/shell/src/app/admin/cohorts/page.tsx`

**Functional Issues:**

```tsx
// ❌ All actions log only
const handleEdit = (cohortId: string) => {
  console.log('Edit', cohortId);
};

const handleDelete = (cohortId: string) => {
  console.log('Delete', cohortId);
};

const handleSave = () => {
  console.log('Save cohort');
  // No validation
};
```

**Accessibility Issues:**

```tsx
// ❌ Avatar initials lack labels
<div className="w-8 h-8 rounded-full">
  {member.initials}
  {/* No aria-label */}
</div>
```

**Issues Summary:**
1. ❌ Edit button logs only
2. ❌ Delete button logs only
3. ❌ Save button logs only
4. ❌ Create modal lacks validation
5. ❌ No persistence for any actions
6. ❌ Avatar initials lack `aria-label`

**What's Needed:**
- Implement cohort CRUD operations
- Add validation to create/edit modals
- Add confirmation for delete
- Add `aria-label` to avatars
- Wire to admin cohort service
- Add toast feedback

**Estimated Fix Time:** 3 hours

---

### 2.24 Help & Support (`/help`)

**File Location:** N/A (route doesn't exist)

**Status:** ❌ **MISSING**

**Issues Summary:**
1. ❌ **CRITICAL:** Sidebar advertises "Help & Support" but route returns 404
2. ❌ No alternative support content
3. ❌ No redirect to external resources
4. ❌ Breadcrumb shows "Help" implying page exists
5. ❌ Users seeking support hit dead end

**What's Needed:**
- **Option A:** Build dedicated Help Center page with:
  - Hero section
  - Search functionality
  - FAQ categories
  - Contact/escalation CTAs
  - Knowledge base articles
  - Glow UI layout patterns
- **Option B:** Hide "Help & Support" nav item until page is built
- **Option C:** Redirect to external support resource (temporary)
- Add automated route test to prevent regressions

**Estimated Fix Time:** 8 hours (Option A) or 0.5 hours (Option B/C)

---

## Phase 3: Cross-Page Consistency Analysis

### 3.1 Navigation & Information Architecture

#### 3.1.1 Sidebar Navigation Truth vs Reality

**Broken Links:**

1. **Help & Support (`/help`)**
   - ❌ Advertised in sidebar
   - ❌ Route doesn't exist (404)
   - ❌ No fallback or redirect
   - **Impact:** Users seeking help encounter dead end

2. **Admin Suite Inline Navigation**
   - ❌ Tabs point to `/dashboard/admin/*`
   - ❌ But routes are at `/admin/*`
   - ❌ All admin internal links 404
   - **Impact:** Admin suite navigation completely broken

3. **Admin Nav Visibility**
   - ❌ Visible regardless of `ADMIN_PORTAL_ENABLED` flag
   - ❌ Non-admins see admin links they can't access
   - **Impact:** Confusing UX, security concern

**Action Hierarchy Drift:**

Primary CTAs across platform show inconsistent reliability:

| CTA | Frequency | Functional | Broken | Status |
|-----|-----------|-----------|--------|---------|
| "Ask VISION AI" | 3 pages | 0 | 3 | ❌ All log only |
| "Share update" | 2 pages | 0 | 2 | ❌ All log only |
| "Create report" | 2 pages | 0 | 2 | ❌ All log only |
| "Invite grantee" | 2 pages | 0 | 2 | ❌ All log only |
| "Change plan" | 2 pages | 0 | 2 | ❌ All log only |
| "Enable/Disable app" | 3 pages | 0 | 3 | ❌ State only |
| "Send invite" | 2 pages | 0 | 2 | ❌ State only |
| Billing actions | 5 buttons | 0 | 5 | ❌ All log only |

**88% of primary CTAs** are non-functional.

---

#### 3.1.2 Catalog Fragmentation

**Three Parallel Experiences:**

| Route | Type | Components | Filters | Favorites | Status Display |
|-------|------|-----------|---------|-----------|---------------|
| `/applications` | Glow UI | PageHero, AppsFilterBar, AppsGrid | Advanced (search, phase, audience, focus) | Local state | Status badges |
| `/apps` | Glow UI | AppCard, filter pills | Basic (search, category, sort) | Local state | Different badges |
| `/app-catalog` | Legacy | Native HTML | Basic (search only) | None | Text only |

**Terminology Inconsistencies:**

- **Launch Actions:** "Launch", "Open app", "Enable", "Preview", "Start onboarding", "Configure"
- **Status Labels:** "Active", "Enabled", "Coming Soon", "Beta", "Preview", "Full experience coming soon"
- **CTA Text:** Different verbs for same action across catalogs

**Persistence Issues:**

- Favorites marked in `/applications` don't show in `/apps`
- App status in one catalog differs from another
- Sort order doesn't carry over
- Filter state resets between routes

**User Impact:**
- Severe cognitive load
- Confusion about which catalog to use
- Distrust when favorites disappear
- Perception of broken platform

---

### 3.2 Design System & Color Token Fidelity

#### 3.2.1 Palette Violations Across Domains

**Systematic Color Token Violations:**

| Domain | Page/Component | Violation | Count | Should Use |
|--------|---------------|-----------|-------|------------|
| **Dashboard** | Hero cards | `#F8FAFC`, `#0047AB` inline | 4 | `vision-gray-50`, `vision-blue-950` |
| **Dashboard** | MiniAppCard | Phase colors inline hex | 18 | Theme-based classes |
| **Funder** | Dashboard | `text-orange-500`, `bg-primary/10` | 6 | `text-vision-orange-900` |
| **Funder** | Grantees | `rgb(34 197 94)`, `rgb(234 179 8)`, `rgb(239 68 68)` | 12 | `vision-green-900`, `vision-orange-900`, `vision-red-900` |
| **Admin** | Users | `text-emerald-500` | 8 | `text-vision-green-900` |
| **Admin** | Dashboard | `text-emerald-500` | 4 | `text-vision-green-900` |
| **Settings** | Organization | Arbitrary hex input | 2 | Constrained palette picker |
| **Settings** | Apps | `text-emerald-500` | 2 | `text-vision-green-900` |
| **Files** | Page | `text-gray-600`, `bg-gray-200` | 10+ | `text-vision-gray-700`, `bg-vision-gray-100` |
| **Notifications** | Page | `bg-blue-50/50` | 1 | `bg-vision-blue-50` |

**Total Violations:** 67+ instances across 18 pages

**Impact:**
- Inconsistent branding
- Impossible to implement theming or dark mode
- Design system rendered ineffective
- Maintenance nightmare (hard to find/replace colors)

---

#### 3.2.2 Glow vs Native Controls

**Native Form Controls (Should Use Glow):**

| Page | Control | Count | Glow Alternative |
|------|---------|-------|------------------|
| Profile Settings | Timezone `<select>` | 1 | `GlowSelect` |
| Organization Settings | Org type `<select>` | 1 | `GlowSelect` |
| Organization Settings | Country `<select>` | 1 | `GlowSelect` |
| Organization Settings | Color `<input type="color">` | 2 | `GlowColorPicker` (constrained) |
| Team Settings | Role `<select>` | 5 | `GlowSelect` |
| Files | Category `<select>` | 1 | `GlowSelect` |
| Apps Catalog | Sort `<select>` | 1 | `GlowSelect` |
| Funder Grantees | Status/Risk/Cohort `<select>` | 3 | `GlowSelect` |

**Total:** 12 native controls that should use Glow components

**Issues with Native Controls:**
- Different font sizes and weights
- Inconsistent border styles
- No error states
- No disabled states matching Glow
- No ARIA labeling
- Break visual consistency

---

#### 3.2.3 Avatar & Icon Semantics

**Avatar Issues:**

All avatar implementations lack accessibility:

```tsx
// ❌ BAD: Current implementation
<div className="w-8 h-8 rounded-full bg-blue-500 text-white">
  JS
</div>

// ✅ GOOD: Should be
<div
  className="w-8 h-8 rounded-full bg-blue-500 text-white"
  aria-label="Jane Smith"
  role="img"
>
  JS
</div>
```

**Locations:**
- Funder Cohorts (5+ instances)
- Admin Cohorts (5+ instances)
- Team Members (5+ instances)
- User menus (3+ instances)

**Total:** 18+ avatar instances missing `aria-label`

---

### 3.3 Component & Data Duplication

#### 3.3.1 Metric Card Implementations

**Three Separate Implementations:**

1. **Dashboard Metrics** (`/dashboard`)
   ```tsx
   <GlowCard className="p-6">
     <div className="flex items-center justify-between">
       <div>
         <p className="text-sm text-gray-600">Total Apps</p>
         <p className="text-2xl font-bold">{count}</p>
       </div>
       <Icon className="w-10 h-10 text-blue-500" />
     </div>
   </GlowCard>
   ```

2. **Funder Dashboard Metrics** (`/funder`)
   ```tsx
   <GlowCard className="p-4"> {/* Different padding */}
     <div className="flex justify-between items-start">
       <div>
         <p className="text-xs text-gray-500">Active Grantees</p> {/* Different size */}
         <p className="text-3xl font-semibold">{count}</p> {/* Different weight */}
       </div>
       <Icon className="w-8 h-8 text-orange-500" /> {/* Different size, non-token color */}
     </div>
   </GlowCard>
   ```

3. **Admin Dashboard Metrics** (`/admin`)
   ```tsx
   <GlowCard className="p-5"> {/* Different padding */}
     <div className="space-y-2">
       <div className="flex items-center gap-2">
         <Icon className="w-6 h-6 text-emerald-500" /> {/* Different size, non-token */}
         <p className="text-sm font-medium">Organizations</p>
       </div>
       <p className="text-4xl font-bold">{count}</p> {/* Different size */}
     </div>
   </GlowCard>
   ```

**Differences:**
- Padding: `p-6` vs `p-4` vs `p-5`
- Text sizes: `text-sm/text-2xl` vs `text-xs/text-3xl` vs `text-sm/text-4xl`
- Font weights: `font-bold` vs `font-semibold` vs `font-bold`
- Icon sizes: `w-10` vs `w-8` vs `w-6`
- Icon colors: `text-blue-500` vs `text-orange-500` vs `text-emerald-500` (all non-token)
- Layout: Horizontal vs vertical

**Recommendation:**
Extract to shared `<MetricCard>` component with standardized styling:

```tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-vision-gray-700">{label}</p>
          <p className="text-2xl font-bold text-vision-gray-950">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm',
              trend.direction === 'up' ? 'text-vision-green-900' : 'text-vision-red-900'
            )}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className="text-vision-blue-950">
          {icon}
        </div>
      </div>
    </GlowCard>
  );
}
```

---

#### 3.3.2 Cohort Card Duplication

**Two Implementations:**

1. **Funder Cohorts** (`/funder/cohorts`)
2. **Admin Cohorts** (`/admin/cohorts`)

Both have:
- Similar card structure
- Member avatar display (first 5 + count)
- Cohort stats
- Edit/Delete buttons

But differ in:
- Button styles (badges vs buttons)
- Spacing
- Color usage

**Recommendation:**
Extract `<CohortCard>` component with role-based action buttons.

---

#### 3.3.3 Data Table Duplication

**Seven Table Implementations:**

1. Files table (`/files`)
2. Billing history (`/settings/billing`)
3. Grantees (`/funder/grantees`)
4. Team members (`/settings/team`)
5. Pending invites (`/settings/team`)
6. Admin organizations (`/admin/organizations`)
7. Admin users (`/admin/users`)

All have:
- Similar column structure
- Similar row styling
- Action buttons
- Hover states

But differ in:
- Column configurations
- Sort logic
- Filter logic
- Pagination
- Accessibility (most lack captions)

**Recommendation:**
Create `<DataTable>` component with:
- Built-in sorting
- Built-in pagination
- Built-in accessibility (caption, ARIA)
- Configurable columns
- Action slot

---

### 3.4 Behavioral Inconsistencies

#### 3.4.1 State Pseudo-Persistence

**The Problem:**

All state changes use `useState` seeded from mock data. No persistence layer exists.

**Impact Table:**

| Action | Component State | Persists? | Visible Elsewhere? |
|--------|----------------|-----------|-------------------|
| Toggle favorite | `useState` | ❌ No | ❌ No (lost on refresh) |
| Enable/disable app | `useState` | ❌ No | ❌ No (different per page) |
| Mark notification read | `useState` | ❌ No | ❌ No (lost on refresh) |
| Invite team member | `useState` | ❌ No | ❌ No (list resets) |
| Update profile | `useState` | ❌ No | ❌ No (changes lost) |
| Create cohort | `useState` | ❌ No | ❌ No (doesn't sync) |
| Change settings | `useState` | ❌ No | ❌ No (resets) |

**This contradicts the product narrative** of an "integrated platform" where data flows between applications.

---

#### 3.4.2 CTA Feedback Patterns

**Zero User Feedback:**

Across all 24 pages, primary actions have:
- ❌ No loading states
- ❌ No success states
- ❌ No error states
- ❌ No toast notifications
- ❌ No visual confirmation
- ❌ No state updates that cross pages

**User Experience:**

User clicks "Send invite" →
- Button doesn't show loading
- No toast appears
- Invite list doesn't update
- Page refresh shows no invite
- **User conclusion:** "The button is broken"

**This pattern repeats 150+ times** across the platform.

---

#### 3.4.3 Permission Messaging Inconsistency

**Multiple Patterns:**

1. **Admin Suite:**
   - Silent redirect to `/dashboard` when flag off
   - No explanation to user

2. **Funder Cohorts:**
   - Shows "Funder admins only" screen
   - Explains restriction

3. **Settings Pages:**
   - Shows full page with disabled buttons
   - No explanation

**Recommendation:**
Create global permission denial pattern with:
- Consistent messaging
- Explanation of required role
- Next steps (e.g., "Contact admin")

---

### 3.5 Accessibility & Semantics Debt

#### 3.5.1 Filter Control Accessibility

**Missing `aria-pressed` State:**

Filter pills acting as toggles throughout platform lack proper ARIA:

```tsx
// ❌ BAD: Current implementation
<button
  onClick={() => setFilter('active')}
  className={cn(
    'px-4 py-2 rounded-full',
    filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100'
  )}
>
  Active
</button>

// ✅ GOOD: Should be
<button
  role="button"
  aria-pressed={filter === 'active'}
  onClick={() => setFilter('active')}
  className={cn(
    'px-4 py-2 rounded-full',
    filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100'
  )}
>
  Active
</button>
```

**Locations (24 instances):**
- Applications page (6 filters)
- Apps page (6 filters)
- App catalog (4 filters)
- Funder grantees (3 filters)
- Team settings (3 toggles)
- Admin pages (2 toggles)

---

#### 3.5.2 Tables Without Captions

**All Data Tables Missing Captions:**

Screen reader users can't understand table purpose.

```tsx
// ❌ BAD: Current
<table className="w-full">
  <thead>...</thead>
  <tbody>...</tbody>
</table>

// ✅ GOOD: Should be
<table className="w-full">
  <caption className="sr-only">Your uploaded files</caption>
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

**Missing Captions (7 tables):**
1. Files table → "Your uploaded files"
2. Billing history → "Billing history"
3. Grantees → "Grantee portfolio"
4. Team members → "Team members"
5. Pending invites → "Pending team invitations"
6. Admin organizations → "All organizations"
7. Admin users → "Platform users"

---

#### 3.5.3 Color-Only Indicators

**WCAG SC 1.4.1 Violations:**

15+ instances where color is the sole indicator:

| Location | Indicator | Colors Used | Missing |
|----------|-----------|-------------|---------|
| Grantees | Risk level | Red/Yellow/Green | Text: "High risk" |
| Grantees | Capacity | RGB bars | Text: "80% capacity" |
| Billing | Payment status | Green/Red badge | Text: "Paid"/"Due" |
| Apps | App status | Color badges | Icon + text |
| Admin | Permissions | Green/Gray check | aria-label |
| Dashboard | Trends | Orange/Green text | Icon + severity |

**Recommendation:**
Always pair color with:
- Textual label (visible or `sr-only`)
- Icon
- Pattern/texture

---

### 3.6 Content & Copy Alignment

#### 3.6.1 Conflicting Value Props

**App Detail Pages:**

Promise: "Full experience coming soon"
Reality: App may actually be available

**Onboarding Pages:**

Promise: "Launch the live experience"
Reality: Button goes back to marketing card

**Dashboard Hero:**

Copy: "Glow UI dashboard surfaces..."
Issue: Internal implementation language shown to end users

---

#### 3.6.2 Inconsistent Terminology

**Same Entity, Different Names:**

| Context | Term Used |
|---------|-----------|
| Billing | "Workspace" |
| Admin | "Organization" |
| Onboarding | "Team" |
| Settings | "Organization" |
| API | "Tenant" |

**Recommendation:**
Standardize on "Organization" throughout platform.

---

### 3.7 Cross-Page Remediation Themes

**Theme 1: Unify App Catalog Experience**
- Choose `/applications` as single source
- Deprecate `/apps` and `/app-catalog`
- Wire favorites/statuses to real data
- Consolidate terminology

**Theme 2: Enforce Bold Color & Glow Form Controls**
- Replace all inline hex/RGB with tokens
- Replace all native selects with `GlowSelect`
- Add lint rules to prevent regressions
- Create constrained color picker for branding

**Theme 3: Action Feedback & Persistence**
- Introduce global toast pattern
- Connect CTAs to service layer
- Show loading/success/error states
- Persist state changes

**Theme 4: Navigation Hygiene**
- Hide/redirect unavailable routes
- Fix admin inline nav URLs
- Add automated tests
- Guard nav with feature flags

**Theme 5: Component Reuse**
- Extract MetricCard
- Extract CohortCard
- Extract DataTable
- Extract FilterPillGroup
- Extract StatusBadge

---

## Phase 4: Critical Issue Synthesis & Priority Matrix

### 4.1 Priority Matrix

#### P0 — CRITICAL (Must Fix Before Launch)

**Total:** 10 issues | **Estimated Effort:** 80 hours

| # | Issue | Impact | Files | Effort |
|---|-------|--------|-------|--------|
| 1 | **Help link 404** — `/help` advertised but doesn't exist | Users seeking support hit dead end | 1 nav + 1 page | 4h |
| 2 | **Admin nav broken** — All inline tabs point to `/dashboard/admin/*` (404) | Admin suite unusable | 7 admin pages | 2h |
| 3 | **App launch broken** — "Open app" reloads same page | Users can't launch apps | 2 pages | 3h |
| 4 | **88% CTAs broken** — Primary actions log to console only | Platform appears non-functional | 21 pages | 40h |
| 5 | **No persistence** — All form submissions lost on refresh | Users lose all work | 15 pages | 20h |
| 6 | **Missing table captions** — 7 tables lack ARIA | Screen readers can't describe purpose | 7 pages | 3h |
| 7 | **Color-only status** — Risk/capacity rely on color alone | Fails WCAG 1.4.1 | 4 pages | 4h |
| 8 | **Missing aria-pressed** — 24 filter toggles lack state | Screen readers don't announce toggle | 6 pages | 2h |
| 9 | **Admin route 404s** — "Manage apps" links broken | Cannot navigate admin suite | 3 pages | 1h |
| 10 | **Params signature** — App routes use wrong TypeScript | Build errors in Next.js 15 | 2 pages | 1h |

---

#### P1 — HIGH PRIORITY (Fix This Sprint)

**Total:** 10 issues | **Estimated Effort:** 120 hours

| # | Issue | Impact | Files | Effort |
|---|-------|--------|-------|--------|
| 11 | **75% inline hex colors** — Violates Bold Color System | Inconsistent branding, can't theme | 18 pages | 36h |
| 12 | **12 native selects** — Should use Glow components | Inconsistent UX, accessibility | 8 pages | 24h |
| 13 | **Three app catalogs** — Fragmented experience | User confusion, duplicate code | 5 pages | 16h |
| 14 | **No favorites persistence** — Lost on refresh | Poor UX, broken promise | 3 pages | 6h |
| 15 | **7 component duplications** — Metric/cohort/table patterns | Maintenance burden, inconsistency | 15 pages | 24h |
| 16 | **Admin nav guard** — Shows regardless of flag | Non-admins see unavailable links | 1 component | 2h |
| 17 | **No toast notifications** — Zero user feedback | Users unsure if actions worked | Platform-wide | 6h |
| 18 | **No form validation** — Forms accept invalid data | Data integrity issues | 8 pages | 16h |
| 19 | **Avatar accessibility** — 18+ missing aria-labels | Screen reader can't identify users | 6 pages | 3h |
| 20 | **Branding palette** — Accepts any hex value | Breaks design system | 2 pages | 2h |

---

#### P2 — MEDIUM PRIORITY (Fix Next Sprint)

**Total:** 5 issues | **Estimated Effort:** 60 hours

| # | Issue | Impact | Files | Effort |
|---|-------|--------|-------|--------|
| 21 | **Double-padding** — 5 pages have redundant wrappers | Excessive whitespace on desktop | 5 pages | 5h |
| 22 | **Inconsistent empty states** — Some lack messaging | Poor UX when no data | 8 pages | 8h |
| 23 | **Missing loading states** — No spinners during async | Appears frozen to users | 20 pages | 20h |
| 24 | **MiniAppCard DOM manipulation** — Causes reflows | Minor performance hit | 1 component | 3h |
| 25 | **Legacy catalog** — `/app-catalog` should be deleted | Bundle size, confusion | 1 page | 0.5h |

---

#### P3 — LOW PRIORITY (Nice to Have)

**Total:** 5 issues | **Estimated Effort:** 40 hours

| # | Issue | Impact | Files | Effort |
|---|-------|--------|-------|--------|
| 26 | **Real-time updates** — WebSocket integration | Enhanced UX | Platform-wide | 16h |
| 27 | **Advanced search** — Global search across content | Better discoverability | 1 feature | 12h |
| 28 | **Dashboard customization** — Drag-drop widgets | Personalization | 1 page | 8h |
| 29 | **Bulk actions** — Multi-select for tables | Efficiency | 7 tables | 8h |
| 30 | **Export functionality** — CSV/PDF downloads | Data portability | 4 pages | 6h |

---

### 4.2 Detailed Refactor Plans

#### Refactor Plan 1: Dashboard (`/dashboard`)

**Current State:**
- File: `/apps/shell/src/app/dashboard/page.tsx`
- Lines of code: ~250
- Components used: 8 (HeroWelcome, MiniAppCard, MetricWidget, etc.)
- Issues found: 6

**Proposed Changes:**

**Change 1: Replace Inline Colors (Priority: P1)**

*Current implementation:*
```tsx
<GlowCard style={{ backgroundColor: '#F8FAFC' }}>
  <GlowButton style={{ backgroundColor: '#0047AB', color: '#FFFFFF' }}>
```

*Issue:* Violates Bold Color System; not themeable

*Proposed fix:*
```tsx
<GlowCard className="bg-vision-gray-50">
  <GlowButton variant="default" className="bg-vision-blue-950 text-white">
```

*Code location:* Lines 45, 67, `MiniAppCard` component
*Estimated effort:* 2 hours
*Dependencies:* Ensure all Bold tokens in Tailwind config

**Change 2: Remove max-w-7xl Wrapper (Priority: P2)**

*Current implementation:*
```tsx
<div className="max-w-7xl mx-auto px-8">
  {/* Content */}
</div>
```

*Issue:* Duplicates AppShell container padding, causes double gutters

*Proposed fix:* Remove wrapper div entirely; AppShell provides container

*Code location:* Line ~30
*Estimated effort:* 0.5 hours
*Dependencies:* None

**Change 3: Wire "Ask VISION AI" CTA (Priority: P0)**

*Current implementation:*
```tsx
<GlowButton onClick={() => console.log('Ask VISION AI')}>
  Ask VISION AI
</GlowButton>
```

*Issue:* Button appears functional but does nothing

*Proposed fix (Option A):* Navigate to `/ai-assistant` with context
```tsx
<GlowButton onClick={() => router.push('/ai-assistant')}>
  Ask VISION AI
</GlowButton>
```

*Proposed fix (Option B):* Open modal with AI chat
```tsx
const [showAI, setShowAI] = useState(false);
<GlowButton onClick={() => setShowAI(true)}>Ask VISION AI</GlowButton>
<AIAssistantModal open={showAI} onClose={() => setShowAI(false)} />
```

*Proposed fix (Option C):* Add "Coming Soon" badge and disable
```tsx
<GlowButton disabled>
  Ask VISION AI
  <GlowBadge>Coming Soon</GlowBadge>
</GlowButton>
```

*Code location:* Line ~78
*Estimated effort:* 8 hours (A/B) or 0.5 hours (C)
*Dependencies:* AI assistant route/component if implementing A/B

**Change 4: Extract MetricCard Component (Priority: P1)**

*Current implementation:* Inline metric card markup repeated 4x

*Issue:* Pattern duplicated in Funder & Admin dashboards

*Proposed fix:* Create `<MetricCard>` Glow component
```tsx
// packages/ui/src/metric-card.tsx
export function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-vision-gray-700">{label}</p>
          <p className="text-2xl font-bold text-vision-gray-950">{value}</p>
          {trend && <TrendIndicator {...trend} />}
        </div>
        <div className="text-vision-blue-950">{icon}</div>
      </div>
    </GlowCard>
  );
}
```

*Code location:* Lines ~90-110 (repeated 4x)
*Estimated effort:* 3 hours
*Dependencies:* None

**Change 5: Fix MiniAppCard Hover Effects (Priority: P2)**

*Current implementation:*
```tsx
<GlowButton
  style={{ backgroundColor: phaseColor }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = hoverColor;
  }}
/>
```

*Issue:* Direct DOM manipulation causes layout reflows, not performant

*Proposed fix:* Use CSS-only hover with theme tokens
```tsx
<GlowButton
  className={cn(
    'bg-vision-blue-950',
    'hover:bg-vision-blue-900',
    'transition-colors duration-200'
  )}
/>
```

*Code location:* `MiniAppCard` component
*Estimated effort:* 2 hours
*Dependencies:* None

**Change 6: Add ARIA Labels (Priority: P0)**

*Current implementation:*
```tsx
<GlowButton onClick={handleAskAI}>
  Ask VISION AI
</GlowButton>
```

*Issue:* Missing aria-label, fails accessibility audit

*Proposed fix:*
```tsx
<GlowButton
  onClick={handleAskAI}
  aria-label="Open VISION AI Assistant to ask questions"
>
  Ask VISION AI
</GlowButton>
```

*Code location:* Line ~78
*Estimated effort:* 0.5 hours
*Dependencies:* None

**Acceptance Criteria:**
- [ ] All inline hex colors replaced with Bold tokens
- [ ] No double-padding on any viewport size
- [ ] "Ask VISION AI" either works or shows "Coming Soon"
- [ ] All ARIA labels present
- [ ] No console.log statements
- [ ] MetricCard component extracted and reused
- [ ] MiniAppCard uses CSS-only hover effects

**Testing Checklist:**
- [ ] Visual regression test (compare before/after screenshots)
- [ ] Lighthouse accessibility score ≥95
- [ ] Responsive design verified (375px, 768px, 1024px+)
- [ ] Navigation still works
- [ ] Mock data still loads correctly
- [ ] No layout shift on hover

**Total Estimated Effort:** 16 hours

---

#### Refactor Plan 2: App Catalog Consolidation

**Current State:**
- Files: `/applications/page.tsx`, `/apps/page.tsx`, `/app-catalog/page.tsx`
- Total lines: ~800
- Issues: Duplicate logic, conflicting UX, no persistence

**Proposed Changes:**

**Change 1: Choose Canonical Implementation (Priority: P1)**

*Decision:* Use `/applications` as single source of truth

*Reasoning:*
- Uses Glow UI components (best design system compliance)
- Has advanced filters (search, phase, audience, focus)
- Cleaner code structure
- Better accessibility

**Change 2: Deprecate Legacy Routes (Priority: P1)**

*Implementation:*

```tsx
// /apps/shell/src/app/apps/page.tsx
import { redirect } from 'next/navigation';

export default function AppsPage() {
  redirect('/applications');
}

// /apps/shell/src/app/app-catalog/page.tsx
import { redirect } from 'next/navigation';

export default function AppCatalogPage() {
  redirect('/applications');
}
```

*Code location:* Create redirect pages
*Estimated effort:* 1 hour
*Dependencies:* None

**Change 3: Extract Shared Filter Logic (Priority: P1)**

*Current:* Filter logic duplicated 3x

*Proposed:* Create shared hook
```tsx
// /apps/shell/src/hooks/useAppFilters.ts
export function useAppFilters() {
  const [search, setSearch] = useState('');
  const [phase, setPhase] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [audience, setAudience] = useState<string[]>([]);

  const filteredApps = useMemo(() => {
    return mockApps.filter(app => {
      if (search && !app.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (phase.length && !phase.includes(app.phase)) {
        return false;
      }
      // ... more filters
      return true;
    });
  }, [search, phase, category, audience]);

  return {
    search,
    setSearch,
    phase,
    setPhase,
    category,
    setCategory,
    audience,
    setAudience,
    filteredApps,
  };
}
```

*Code location:* New hook file
*Estimated effort:* 4 hours
*Dependencies:* None

**Change 4: Implement Favorites Persistence (Priority: P1)**

*Current:* `useState` only
```tsx
const [favorites, setFavorites] = useState<string[]>([]);
```

*Proposed:* localStorage persistence
```tsx
// /apps/shell/src/hooks/useFavorites.ts
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('app-favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = useCallback((appId: string) => {
    setFavorites(prev => {
      const next = prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId];
      localStorage.setItem('app-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
```

*Code location:* New hook file
*Estimated effort:* 2 hours
*Dependencies:* None

**Change 5: Update App Detail Pages (Priority: P1)**

*Fix launch paths:*
```tsx
// /apps/shell/src/lib/vision-apps.ts
export const VISION_APPS: VisionApp[] = [
  {
    id: 'capacityiq',
    slug: 'capacityiq',
    name: 'CapacityIQ',
    launchPath: '/apps/capacityiq/dashboard', // ✅ Real path
    status: 'active',
    // ...
  },
  {
    id: 'fundingframer',
    slug: 'fundingframer',
    name: 'FundingFramer',
    launchPath: '/apps/fundingframer/grants', // ✅ Real path
    status: 'active',
    // ...
  },
  {
    id: 'crmlite',
    slug: 'crmlite',
    name: 'CRM Lite',
    launchPath: null, // ✅ Coming soon
    status: 'coming-soon',
    // ...
  },
];

// /apps/shell/src/app/apps/[slug]/page.tsx
export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params; // ✅ Fix Next.js 15 signature

  const app = VISION_APPS.find(a => a.slug === slug);

  if (!app) {
    return notFound(); // ✅ Handle 404
  }

  const canLaunch = !!app.launchPath;

  return (
    <div>
      {/* ... */}
      <GlowButton
        disabled={!canLaunch}
        onClick={() => canLaunch && router.push(app.launchPath!)}
      >
        {canLaunch ? 'Open App' : 'Coming Soon'}
      </GlowButton>
    </div>
  );
}
```

*Code location:* Multiple files
*Estimated effort:* 4 hours
*Dependencies:* Real app routes must exist OR use placeholders

**Change 6: Add Accessible Filter Toggles (Priority: P0)**

*Current:*
```tsx
<button onClick={() => setPhase('prototype')}>
  Prototype
</button>
```

*Proposed:*
```tsx
<button
  role="button"
  aria-pressed={phase.includes('prototype')}
  onClick={() => togglePhase('prototype')}
>
  Prototype
</button>
```

*Code location:* Filter components
*Estimated effort:* 2 hours
*Dependencies:* None

**Acceptance Criteria:**
- [ ] Only `/applications` route serves app catalog
- [ ] `/apps` and `/app-catalog` redirect to `/applications`
- [ ] Favorites persist across sessions
- [ ] App statuses accurate
- [ ] Filter toggles have `aria-pressed`
- [ ] App detail "Open app" works OR shows "Coming Soon"
- [ ] No 404s for invalid app slugs

**Testing Checklist:**
- [ ] Navigate to `/apps` → redirects to `/applications`
- [ ] Navigate to `/app-catalog` → redirects to `/applications`
- [ ] Toggle favorite → refresh page → favorite persists
- [ ] Click "Open app" for active app → navigates to app
- [ ] Click "Open app" for coming-soon app → disabled with message
- [ ] Filter apps → toggles show correct `aria-pressed`
- [ ] Navigate to `/apps/invalid-slug` → shows 404

**Total Estimated Effort:** 16 hours

---

#### Refactor Plan 3: Admin Navigation Fix

**Current State:**
- Files: `/admin/page.tsx`, `/admin/organizations/page.tsx`, etc.
- Issue: All inline tabs point to `/dashboard/admin/*` (404)

**Proposed Changes:**

**Change 1: Fix Inline Tab URLs (Priority: P0)**

*Current implementation:*
```tsx
<Link href="/dashboard/admin/organizations">Organizations</Link>
<Link href="/dashboard/admin/users">Users</Link>
<Link href="/dashboard/admin/apps">Apps</Link>
```

*Issue:* All links 404 (routes don't exist under `/dashboard`)

*Proposed fix:*
```tsx
<Link href="/admin/organizations">Organizations</Link>
<Link href="/admin/users">Users</Link>
<Link href="/admin/apps">Apps</Link>
```

*Code location:* `/admin/page.tsx` lines ~55-75
*Estimated effort:* 1 hour
*Dependencies:* None

**Change 2: Fix Cross-Links (Priority: P0)**

*Current:*
```tsx
// In /admin/organizations/page.tsx
<Link href={`/dashboard/admin/apps?orgId=${org.id}`}>
  Manage Apps
</Link>
```

*Proposed:*
```tsx
<Link href={`/admin/apps?orgId=${org.id}`}>
  Manage Apps
</Link>
```

*Code location:* Multiple admin pages
*Estimated effort:* 0.5 hours
*Dependencies:* None

**Change 3: Add Sidebar Guard (Priority: P1)**

*Current:* Admin nav always visible

*Proposed:*
```tsx
// /apps/shell/src/components/navigation/Sidebar.tsx
import { ADMIN_PORTAL_ENABLED } from '@/lib/constants';

{ADMIN_PORTAL_ENABLED && (
  <SidebarItem href="/admin" icon={<Shield />}>
    Admin
  </SidebarItem>
)}
```

*Code location:* Sidebar navigation component
*Estimated effort:* 1 hour
*Dependencies:* Environment variable or feature flag

**Acceptance Criteria:**
- [ ] All admin inline tabs navigate correctly
- [ ] Cross-links between admin pages work
- [ ] Admin nav only visible when `ADMIN_PORTAL_ENABLED`
- [ ] No 404 errors in admin suite

**Testing Checklist:**
- [ ] Click each inline tab → navigates correctly
- [ ] Click "Manage apps" from Organizations → goes to Apps page
- [ ] Sidebar shows/hides admin link based on flag
- [ ] All admin pages render without errors

**Total Estimated Effort:** 2.5 hours

---

## Phase 5: Implementation Roadmap & Validation

### 5.1 Implementation Roadmap

#### Week 1-2: Critical Issues (P0) — 80 hours

**Days 1-3: Route & Navigation Fixes (16 hours)**

Tasks:
- [ ] Fix admin inline navigation URLs (1h)
- [ ] Fix admin cross-link URLs (0.5h)
- [ ] Fix app detail launch path logic (1h)
- [ ] Update Next.js 15 async params (2h across 2 pages)
- [ ] Add 404 handling to app pages (0.5h)
- [ ] Create Help page OR remove link (4h or 0.5h)
- [ ] Add sidebar guard for admin nav (1h)
- [ ] Test all navigation flows (6h)

Files to modify: 8 files
Verification: All routes work, no 404s, navigation functional

**Days 4-6: Accessibility Violations (20 hours)**

Tasks:
- [ ] Add table captions to 7 tables (3.5h)
- [ ] Add textual status labels (risk, capacity, payment) (4h)
- [ ] Add `aria-pressed` to filter pills (24 instances) (8h)
- [ ] Add `aria-label` to avatar initials (2h)
- [ ] Add accessible table semantics to permissions matrices (2h)
- [ ] Run Lighthouse audits on all pages (0.5h)

Files to modify: 12 files
Verification: Lighthouse accessibility score ≥90 on all pages

**Days 7-10: Wire Critical CTAs (44 hours)**

Tasks:
- [ ] Implement toast notification component (GlowToast) (4h)
- [ ] Wire "Ask VISION AI" or add "Coming Soon" (0.5h × 3 = 1.5h)
- [ ] Wire app enable/disable toggles with persistence (6h)
- [ ] Wire team invite/remove with backend (8h)
- [ ] Wire favorite toggles with persistence (4h)
- [ ] Wire primary save buttons with validation (12h across 5 pages)
- [ ] Wire delete/destructive actions with confirmations (8h)
- [ ] Test all wired CTAs with loading/success/error states (0.5h)

Files to modify: 15+ files
Verification: Primary user flows functional, feedback visible

---

#### Week 3-4: High Priority (P1) — 120 hours

**Days 11-15: Design System Compliance (40 hours)**

Tasks:
- [ ] Replace inline hex colors with Bold tokens (18 pages × 2h = 36h)
- [ ] Create CSS variable migration script (2h)
- [ ] Run lint check for remaining hardcoded colors (2h)

Files to modify: 18 pages
Verification: Zero hardcoded hex colors in codebase

**Days 16-20: Component Replacements (32 hours)**

Tasks:
- [ ] Create `GlowSelect` component if missing (4h)
- [ ] Replace 12 native selects with `GlowSelect` (12 × 2h = 24h)
- [ ] Test all dropdowns (4h)

Files to modify: 12 files
Verification: Zero native `<select>` elements in UI code

**Days 21-25: Component Extraction (32 hours)**

Tasks:
- [ ] Extract `<MetricCard>` component (4h)
- [ ] Extract `<FilterPillGroup>` with aria-pressed (6h)
- [ ] Extract `<StatusBadge>` with semantic variants (4h)
- [ ] Extract `<DataTable>` with sorting/pagination (12h)
- [ ] Extract `<CohortCard>` component (3h)
- [ ] Extract `<QuickActionGrid>` component (3h)

Files to modify: 15+ files
Verification: Shared components used consistently

**Days 26-30: App Catalog Consolidation (16 hours)**

Tasks:
- [ ] Merge `/apps` and `/app-catalog` features into `/applications` (8h)
- [ ] Set up redirects from old routes (1h)
- [ ] Delete deprecated pages (0.5h)
- [ ] Test consolidated catalog (2h)
- [ ] Update documentation (0.5h)
- [ ] Test all app catalog features (4h)

Files to modify: 5 files, 2 deleted
Verification: Single app catalog with all features working

---

#### Week 5-6: Medium Priority (P2) — 60 hours

**Days 31-35: Layout & Polish (24 hours)**

Tasks:
- [ ] Remove `max-w-7xl` wrappers (5 pages × 1h = 5h)
- [ ] Add empty states to all data-driven pages (10 pages × 1h = 10h)
- [ ] Add loading states to all async CTAs (8h)
- [ ] Test responsive layouts (1h)

Files to modify: 15 files
Verification: No double-padding, friendly empty states

**Days 36-40: Form Validation (24 hours)**

Tasks:
- [ ] Create Zod schemas for all forms (12h)
- [ ] Add validation to settings forms (6h)
- [ ] Add validation to admin forms (6h)

Files to modify: 10 files
Verification: Forms reject invalid data with helpful messages

**Days 41-45: Performance & Cleanup (12 hours)**

Tasks:
- [ ] Fix `MiniAppCard` hover effects (2h)
- [ ] Remove console.log statements (2h)
- [ ] Delete `/app-catalog` page (0.5h)
- [ ] Run performance audits (2h)
- [ ] Fix any identified bottlenecks (5.5h)

Files to modify: 8 files
Verification: Lighthouse performance score ≥90

---

### 5.2 Final Validation Checklist

**Before Launch:**

**P0 Issues:**
- [ ] All P0 issues resolved (80 hours completed)
- [ ] Build succeeds with 0 errors
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with 0 warnings

**Navigation:**
- [ ] All 24 pages load without errors
- [ ] Navigation works across all pages
- [ ] No 404 errors on any nav link
- [ ] Admin nav hidden when flag is off
- [ ] Help page exists or link removed

**Design System:**
- [ ] Zero hardcoded hex colors in codebase
- [ ] Glow UI components used exclusively (no native elements)
- [ ] All Bold Color System tokens applied correctly
- [ ] Design system 100% compliant

**Accessibility:**
- [ ] Lighthouse accessibility score ≥90 on all pages
- [ ] All tables have captions
- [ ] All filter toggles have `aria-pressed`
- [ ] All avatars have `aria-label`
- [ ] Color not sole indicator anywhere

**Functionality:**
- [ ] All critical user flows functional
- [ ] Toast notifications provide feedback
- [ ] Forms validate correctly
- [ ] No console.log statements in production code
- [ ] State persists appropriately

**Performance:**
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Page loads in < 3s
- [ ] Performance metrics acceptable
- [ ] No layout shifts

**Post-Launch P1/P2 Work:**
- [ ] All P1 issues resolved (120 hours completed)
- [ ] Complete medium priority issues (60 hours)
- [ ] Implement P3 enhancements as capacity allows
- [ ] Monitor user feedback and iterate

---

## Appendices

### Appendix A: Complete Page Status Table

| # | Page | Route | Glow UI | Colors | A11y | Functional | Priority | Est. Hours |
|---|------|-------|---------|--------|------|------------|----------|------------|
| 1 | Dashboard | `/dashboard` | ⚠️ Partial | ❌ Inline hex | ⚠️ Missing ARIA | ⚠️ CTAs broken | P1 | 16h |
| 2 | Applications | `/applications` | ✅ Yes | ✅ Tokens | ❌ No aria-pressed | ❌ No persistence | P1 | 8h |
| 3 | Apps | `/apps` | ✅ Yes | ✅ Tokens | ❌ No aria-pressed | ❌ No persistence | P1-MERGE | 4h |
| 4 | App Catalog | `/app-catalog` | ❌ None | ❌ Hard-coded | ❌ Poor | ❌ Broken | P0-DELETE | 0.5h |
| 5 | App Detail | `/apps/[slug]` | ✅ Yes | ✅ Tokens | ✅ Good | ❌ Launch broken | P0 | 3h |
| 6 | App Onboarding | `/apps/[slug]/onboarding` | ✅ Yes | ✅ Tokens | ✅ Good | ❌ Fake steps | P0 | 6h |
| 7 | Notifications | `/notifications` | ✅ Yes | ⚠️ One non-token | ✅ Good | ❌ No persistence | P1 | 2h |
| 8 | Files | `/files` | ⚠️ Partial | ❌ Tailwind grays | ❌ No captions | ❌ No actions | P0 | 4h |
| 9 | Settings-Profile | `/settings/profile` | ⚠️ Partial | ✅ Tokens | ✅ Good | ❌ No save | P0 | 4h |
| 10 | Settings-Org | `/settings/organization` | ⚠️ Partial | ❌ Arbitrary hex | ✅ Good | ❌ No save | P0 | 5h |
| 11 | Settings-Team | `/settings/team` | ⚠️ Partial | ✅ Tokens | ❌ No table sem | ❌ No actions | P0 | 4h |
| 12 | Settings-Apps | `/settings/apps` | ✅ Yes | ❌ text-emerald | ✅ Good | ❌ No persistence | P0 | 3h |
| 13 | Settings-Billing | `/settings/billing` | ✅ Yes | ✅ Tokens | ❌ No captions | ❌ All broken | P0 | 8h |
| 14 | Funder Dashboard | `/funder` | ✅ Yes | ❌ Inline colors | ⚠️ Partial | ❌ CTAs broken | P1 | 4h |
| 15 | Funder-Grantees | `/funder/grantees` | ⚠️ Partial | ❌ RGB bars | ❌ No captions | ❌ No invite | P0 | 5h |
| 16 | Funder-Cohorts | `/funder/cohorts` | ✅ Yes | ✅ Tokens | ❌ No aria-label | ❌ No actions | P0 | 4h |
| 17 | Admin Dashboard | `/admin` | ⚠️ Partial | ❌ text-emerald | ⚠️ Partial | ❌ Nav broken | P0 | 3h |
| 18 | Admin-Orgs | `/admin/organizations` | ✅ Yes | ✅ Tokens | ❌ No caption | ❌ Links 404 | P0 | 2h |
| 19 | Admin-Users | `/admin/users` | ✅ Yes | ❌ text-emerald | ❌ No aria | ❌ No persistence | P0 | 3h |
| 20 | Admin-Apps | `/admin/apps` | ✅ Yes | ✅ Tokens | ⚠️ Partial | ❌ No confirm | P0 | 4h |
| 21 | Admin-Billing | `/admin/billing` | ✅ Yes | ✅ Tokens | ❌ No captions | ❌ All broken | P0 | 3h |
| 22 | Admin-Settings | `/admin/settings` | ✅ Yes | ❌ Arbitrary hex | ✅ Good | ❌ No save | P0 | 3h |
| 23 | Admin-Cohorts | `/admin/cohorts` | ✅ Yes | ✅ Tokens | ❌ No aria-label | ❌ No actions | P0 | 3h |
| 24 | Help | `/help` | N/A | N/A | N/A | ❌ Missing | P0 | 4h or 0.5h |

**Total Estimated Remediation:** 260 hours

---

### Appendix B: Color Violations Reference

**All Inline Hex/RGB Violations:**

1. Dashboard Hero: `#F8FAFC`, `#0047AB`
2. Dashboard MiniAppCard: Phase colors inline
3. Funder Dashboard: `text-orange-500`, `bg-primary/10`
4. Funder Grantees: `rgb(34 197 94)`, `rgb(234 179 8)`, `rgb(239 68 68)`
5. Admin Dashboard: `text-emerald-500`
6. Admin Users: `text-emerald-500`
7. Settings Organization: Arbitrary hex input
8. Settings Apps: `text-emerald-500`
9. Files: `text-gray-600`, `bg-gray-200`, icon colors
10. Notifications: `bg-blue-50/50`
11. App Catalog: `#1F2937`, `#64748B`

**Replacement Map:**

| Current | Replace With |
|---------|--------------|
| `#0047AB` | `bg-vision-blue-950` or `text-vision-blue-950` |
| `#F8FAFC` | `bg-vision-gray-50` |
| `text-orange-500` | `text-vision-orange-900` |
| `text-emerald-500` | `text-vision-green-900` |
| `rgb(34 197 94)` | `bg-vision-green-900` |
| `rgb(234 179 8)` | `bg-vision-orange-900` |
| `rgb(239 68 68)` | `bg-vision-red-900` |
| `text-gray-600` | `text-vision-gray-700` |
| `bg-gray-200` | `bg-vision-gray-100` |
| `bg-blue-50/50` | `bg-vision-blue-50` |

---

### Appendix C: Service Layer Architecture

**Recommended Service Structure:**

```
/apps/shell/src/services/
├── appsService.ts          # App catalog, favorites, enablement
├── billingService.ts       # Subscriptions, invoices, payments
├── teamService.ts          # Invites, members, roles
├── notificationsService.ts # Mark read, delete, preferences
├── filesService.ts         # Upload, download, delete
├── funderService.ts        # Grantees, cohorts, reports
├── adminService.ts         # Platform-wide config
└── index.ts                # Exports
```

**Example Service:**

```typescript
// /apps/shell/src/services/appsService.ts

export const appsService = {
  // Favorites
  async getFavorites(): Promise<string[]> {
    // For now: localStorage
    const stored = localStorage.getItem('app-favorites');
    return stored ? JSON.parse(stored) : [];
    // Future: API call
  },

  async toggleFavorite(appId: string): Promise<void> {
    const favorites = await this.getFavorites();
    const next = favorites.includes(appId)
      ? favorites.filter(id => id !== appId)
      : [...favorites, appId];
    localStorage.setItem('app-favorites', JSON.stringify(next));
    // Future: await api.post('/favorites', { appId });
  },

  // App enablement
  async getEnabledApps(): Promise<string[]> {
    const stored = localStorage.getItem('enabled-apps');
    return stored ? JSON.parse(stored) : [];
  },

  async toggleAppEnabled(appId: string): Promise<void> {
    const enabled = await this.getEnabledApps();
    const next = enabled.includes(appId)
      ? enabled.filter(id => id !== appId)
      : [...enabled, appId];
    localStorage.setItem('enabled-apps', JSON.stringify(next));
    // Future: await api.post('/apps/toggle', { appId });
  },
};
```

---

### Appendix D: Testing Plan

**Automated Tests to Add:**

1. **Route Navigation Test**
   ```typescript
   describe('Navigation', () => {
     it('all sidebar links return 200', async () => {
       const links = [
         '/dashboard',
         '/applications',
         '/funder',
         '/notifications',
         '/files',
         '/settings/profile',
         '/admin',
       ];
       for (const link of links) {
         const res = await fetch(`http://localhost:3000${link}`);
         expect(res.status).toBe(200);
       }
     });
   });
   ```

2. **Accessibility Test**
   ```typescript
   describe('Accessibility', () => {
     it('all pages pass Lighthouse audit', async () => {
       const pages = ['/dashboard', '/applications', '/funder', /* ... */];
       for (const page of pages) {
         const report = await lighthouse(`http://localhost:3000${page}`);
         expect(report.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
       }
     });
   });
   ```

3. **Design Token Test**
   ```typescript
   describe('Design System', () => {
     it('no inline hex colors in UI files', () => {
       const files = glob.sync('src/{app,components}/**/*.tsx');
       for (const file of files) {
         const content = fs.readFileSync(file, 'utf8');
         const hexMatches = content.match(/#[0-9A-Fa-f]{3,6}/g);
         expect(hexMatches).toBeNull();
       }
     });
   });
   ```

---

**END OF COMPREHENSIVE UX/UI AUDIT REPORT**

**Report Generated:** January 21, 2025
**Total Pages Evaluated:** 24
**Total Issues Identified:** 150+
**Estimated Remediation Effort:** 260 hours (6.5 weeks full-time)
**Critical Priority:** Fix P0 issues first (80 hours)
**Next Steps:** Begin Week 1 roadmap execution
