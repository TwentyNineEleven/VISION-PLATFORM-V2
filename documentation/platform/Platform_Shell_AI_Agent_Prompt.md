# AI Agent Prompt: Complete VISION Platform Shell Frontend Implementation

**Target Agent:** General-purpose AI development agent
**Task Type:** Frontend implementation completion
**Estimated Effort:** 38.5-41.5 hours
**Complexity:** High (multi-phase, file restructuring, component creation)

---

## Mission Statement

You are an AI development agent tasked with completing the frontend implementation of the VISION Platform Shell to 100%. The platform is currently 85-90% complete. Your mission is to:

1. **Fix critical route structure mismatch** (P0 - Breaking change)
2. **Create 3 missing pages** (Files, Notifications, Landing)
3. **Complete funder portal features** (Dashboard, Grantees, Cohorts)
4. **Verify all settings pages** against specifications
5. **Validate and test** the entire implementation

You will work autonomously following detailed step-by-step instructions. After each major step, you MUST verify your work before proceeding.

---

## Critical Context

### What You're Working On

**Project:** VISION Platform V2 - Enterprise SaaS platform for nonprofits
**Component:** Platform Shell (core infrastructure)
**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Glow UI
**Architecture:** Monorepo (pnpm workspaces + Turborepo)
**Current State:** 85-90% complete (working dashboard, auth, components)

### What's Broken

**CRITICAL ISSUE:** All routes are nested under `/dashboard/*` but specifications require independent top-level routes like `/settings`, `/funder`, `/applications`.

This affects:
- Navigation components (wrong hrefs)
- Deep linking (broken links)
- Breadcrumbs (incorrect paths)
- User experience (doesn't match documentation)

---

## Reference Documents - READ THESE FIRST

### Primary Specification (Source of Truth)

**File:** `/Users/fordaaro/Downloads/Platform_Shell_Frontend_Complete_Specification_v2.0.md`

**What it contains:**
- Complete UI/UX specifications for every page
- Component requirements with exact layouts
- Mock data structures and integration points
- Code examples for all features
- Testing requirements

**How to use it:**
- Read relevant sections before implementing each page
- Copy code snippets but adapt to project structure
- Verify your implementation matches the spec
- Cross-reference with REQUIREMENTS.md

### Technical Requirements

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/features/platform-shell/REQUIREMENTS.md`

**Critical sections:**
- **Lines 549-600:** Route structure (MUST READ - this is what's broken)
- **Lines 96-103:** Funder dashboard requirements
- **Lines 1067-1075:** Success criteria and sign-off

**What it confirms:**
- "All sidebar navigation items use **independent top-level routes** (not nested under `/dashboard`)"
- Explicit route structure: `/settings`, `/funder`, `/applications`, `/notifications`, `/files`

### Implementation Guide

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/Platform_Shell_Implementation_Guide.md`

**What it contains:**
- Step-by-step implementation instructions
- Complete code for all missing pages
- Verification checklists after each step
- Testing procedures
- Success criteria

**How to use it:**
- Follow phases in order (don't skip Phase 1!)
- Use provided code snippets
- Complete verification checklists
- Run all tests before moving to next phase

### Current Codebase

**Root Directory:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/`

**Shell Application:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/`

**Key Files:**
```
apps/shell/src/
├── app/                                  ← Pages (Next.js App Router)
│   ├── dashboard/                        ❌ PROBLEM: Has nested routes
│   │   ├── settings/                     ← Should be /app/settings/
│   │   ├── funder/                       ← Should be /app/funder/
│   │   ├── apps/                         ← Should be /app/applications/
│   │   └── page.tsx                      ✅ Dashboard page (complete)
│   ├── onboarding/                       ✅ Complete
│   ├── auth/                             ✅ Complete
│   └── page.tsx                          ⚠️ Landing (just redirects)
├── components/                           ✅ 46+ components built
│   ├── dashboard/
│   ├── settings/
│   ├── funder/
│   └── glow-ui/                          ✅ Design system
└── lib/
    ├── mock-data.ts                      ✅ 20+ mock arrays (needs mockFiles)
    └── vision-apps.ts                    ✅ 18 VISION apps defined
```

### Mock Data System

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Available Mock Data (20+ exports):**
- `mockApps` (18 VISION apps)
- `mockNotifications` (6 notifications)
- `mockUser`, `mockOrganization`
- `mockTeamMembers`, `mockPendingInvites`
- `mockBillingHistory`, `mockAIUsageData`
- `mockGrantees` (4 grantees), `mockCohorts` (3 cohorts)
- `mockPortfolioHealthData`, `mockFunderActivities`
- `mockSearchResults`, `mockTimezones`, `mockOrganizationTypes`, `mockCountries`
- `mockProfileSettings`, `mockOrganizationSettings`
- `mockAppSubscriptions`, `mockCurrentPlan`
- `mockDocuments`

**Missing:**
- `mockFiles` array (you will add this in Phase 2)

### VISION Apps Definitions

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/vision-apps.ts`

**Contains:**
- `VISION_APPS` array (18 apps with icons)
- `APP_MODULES` (6 phases: Voice, Inspire, Strategize, Initiate, Operate, Narrate)
- `APP_CATEGORIES` (Capacity Building, Program Management, Fundraising, Impact Measurement)
- Icons are now embedded directly in app definitions (line 45: `icon?: React.ElementType`)

---

## Your Implementation Plan

### Phase Overview

```
Phase 1: Route Restructuring (8 hours) ← START HERE (CRITICAL)
    ↓
Phase 2: Missing Pages (15 hours)
    ↓
Phase 3: Funder Portal (10 hours)
    ↓
Phase 4: Settings Verification (5 hours)
    ↓
Phase 5: Final Validation (3 hours)
```

### Phase 1: Critical Route Restructuring (8 hours)

**DO NOT SKIP THIS PHASE - Everything else depends on it**

#### Step 1.1: Backup and Move Directories (2 hours)

**Working Directory:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app
```

**Commands to Execute:**
```bash
# Create backup
cp -r dashboard dashboard.backup

# Move settings to top level
mv dashboard/settings ./settings

# Move funder to top level
mv dashboard/funder ./funder

# Rename apps to applications
mv dashboard/apps ./applications

# Move notifications to top level (if exists)
mv dashboard/notifications ./notifications

# Verify moves
ls -la settings/
ls -la funder/
ls -la applications/
ls -la notifications/
```

**⚠️ CRITICAL VERIFICATION - Do NOT proceed until ALL checks pass:**

- [ ] Directory `/app/settings/` exists with subdirectories: `profile/`, `organization/`, `team/`, `apps/`, `billing/`
- [ ] Directory `/app/funder/` exists with subdirectories: `grantees/`, `cohorts/`
- [ ] Directory `/app/applications/` exists
- [ ] Directory `/app/notifications/` exists
- [ ] Directory `/app/dashboard/` still contains `page.tsx` and `layout.tsx` (NOT the moved directories)
- [ ] Run `ls -la app/` and confirm the new structure

**If any verification fails:** STOP. Fix the issue before proceeding. The directory structure MUST be correct for navigation to work.

---

#### Step 1.2: Update DashboardSidebar (1.5 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/dashboard/DashboardSidebar.tsx`

**Action:** Find the `sidebarItems` array (around lines 35-77) and update ALL href values.

**Current (WRONG):**
```typescript
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/dashboard/apps' }, // ❌
      { id: 'notifications', label: 'Notifications', href: '/dashboard/notifications' }, // ❌
    ],
  },
  // ... more items
];
```

**Replace with (CORRECT):**
```typescript
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/applications' }, // ✅
      { id: 'notifications', label: 'Notifications', href: '/notifications' }, // ✅
    ],
  },
  {
    id: 'apps',
    label: 'Applications',
    icon: <Layers3 className="w-5 h-5" />,
    href: '/applications', // ✅
  },
  {
    id: 'funder',
    label: 'Funder',
    icon: <Handshake className="w-5 h-5" />,
    href: '/funder', // ✅
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/notifications', // ✅
    badge: 3,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <UploadCloud className="w-5 h-5" />,
    href: '/files', // ✅
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings/profile', // ✅
  },
];
```

**Verification:**
- [ ] All hrefs updated (no `/dashboard/` prefix except for Dashboard itself)
- [ ] TypeScript compiles without errors: `pnpm run type-check`
- [ ] File saved

---

#### Step 1.3: Update SettingsSidebar (0.5 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/settings/SettingsSidebar.tsx`

**Action:** Search and replace ALL instances:

```typescript
'/dashboard/settings/profile'      → '/settings/profile'
'/dashboard/settings/organization' → '/settings/organization'
'/dashboard/settings/team'         → '/settings/team'
'/dashboard/settings/apps'         → '/settings/apps'
'/dashboard/settings/billing'      → '/settings/billing'
```

**Verification:**
- [ ] All settings routes use `/settings/` prefix (no `/dashboard/`)
- [ ] TypeScript compiles: `pnpm run type-check`
- [ ] File saved

---

#### Step 1.4: Update Mock Data URLs (1 hour)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Action:** Update `mockNotifications` array - change all `actionUrl` values from `/dashboard/*` to top-level routes.

**Example changes:**
```typescript
// Before:
actionUrl: '/apps/capacityiq'                    → '/applications/capacityiq'
actionUrl: '/dashboard/settings/team'            → '/settings/team'
actionUrl: '/apps/fundingframer/documents/1'     → '/applications/fundingframer/documents/1'
```

**Also update `mockSearchResults` array - change all `url` values:**
```typescript
// Before:
url: '/apps/fundingframer/documents/1'     → '/applications/fundingframer/documents/1'
url: '/apps/capacityiq'                    → '/applications/capacityiq'
```

**Verification:**
- [ ] All notification `actionUrl` values updated
- [ ] All search result `url` values updated
- [ ] No `/dashboard/` prefix in any URLs except `/dashboard` itself
- [ ] TypeScript compiles: `pnpm run type-check`

---

#### Step 1.5: Global Search & Replace (2 hours)

**Objective:** Find and update ALL remaining old route references in the codebase.

**Commands to find files with old routes:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src

# Find all occurrences
grep -r "/dashboard/settings" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/funder" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/apps" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/notifications" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/files" . --exclude-dir=node_modules --exclude-dir=.next
```

**For each file found:**
1. Read the file
2. Replace old route patterns with new top-level routes
3. Save the file
4. Verify TypeScript compiles

**Common files that need updates:**
- `components/dashboard/DashboardNavbar.tsx`
- `components/dashboard/AppSwitcher.tsx`
- `components/onboarding/CompletionStep.tsx`
- Any constants or config files with route definitions

**Verification:**
- [ ] All grep commands return 0 results (no old routes found)
- [ ] TypeScript check passes: `pnpm run type-check`
- [ ] No compilation errors

---

#### Step 1.6: Phase 1 Final Verification (1 hour)

**Build Test:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
pnpm run build
```

**Expected:** Build completes successfully with 0 errors

**If build fails:**
1. Read error messages
2. Fix TypeScript errors
3. Fix import errors
4. Re-run build
5. DO NOT PROCEED until build succeeds

**Development Server Test:**
```bash
pnpm dev
```

**Manual Navigation Test:**
Open browser to `http://localhost:3000` and test:

- [ ] Navigate to `/dashboard` - loads correctly
- [ ] Click "Settings" in sidebar - URL shows `/settings/profile`
- [ ] Click "Funder" in sidebar - URL shows `/funder`
- [ ] Click "Applications" in sidebar - URL shows `/applications`
- [ ] Click "Notifications" in sidebar - URL shows `/notifications`
- [ ] No console errors in browser DevTools
- [ ] No 404 errors

**🚨 CRITICAL CHECKPOINT:** If ANY test above fails, STOP and fix before proceeding to Phase 2. The route structure MUST work correctly.

---

### Phase 2: Create Missing Pages (15 hours)

#### Step 2.1: Add mockFiles to Mock Data (0.5 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Action:** Add the following code at the END of the file (before any final exports):

```typescript
/**
 * Mock Files for File Management Page
 */
export interface FileItem {
  id: string;
  name: string;
  type: string; // MIME type
  category: 'report' | 'grant' | 'financial' | 'media' | 'governance' | 'policy' | 'other';
  size: number; // bytes
  uploaded_by: string;
  uploaded_at: string;
  url: string;
}

export const mockFiles: FileItem[] = [
  {
    id: 'file-1',
    name: '2024_Annual_Report.pdf',
    type: 'application/pdf',
    category: 'report',
    size: 2456789,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-15',
    url: '#',
  },
  {
    id: 'file-2',
    name: 'Grant_Application_Draft.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'grant',
    size: 1234567,
    uploaded_by: 'Michael Chen',
    uploaded_at: '2024-11-18',
    url: '#',
  },
  {
    id: 'file-3',
    name: 'Budget_FY2024.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'financial',
    size: 987654,
    uploaded_by: 'Emily Rodriguez',
    uploaded_at: '2024-11-10',
    url: '#',
  },
  {
    id: 'file-4',
    name: 'Program_Photos.zip',
    type: 'application/zip',
    category: 'media',
    size: 15678901,
    uploaded_by: 'David Park',
    uploaded_at: '2024-11-05',
    url: '#',
  },
  {
    id: 'file-5',
    name: 'Board_Meeting_Minutes.pdf',
    type: 'application/pdf',
    category: 'governance',
    size: 543210,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-12',
    url: '#',
  },
  {
    id: 'file-6',
    name: 'Strategic_Plan_2024-2027.pdf',
    type: 'application/pdf',
    category: 'policy',
    size: 3456789,
    uploaded_by: 'Ava Thompson',
    uploaded_at: '2024-11-08',
    url: '#',
  },
  {
    id: 'file-7',
    name: 'Donor_Database_Export.csv',
    type: 'text/csv',
    category: 'financial',
    size: 876543,
    uploaded_by: 'Jordan Lee',
    uploaded_at: '2024-11-14',
    url: '#',
  },
  {
    id: 'file-8',
    name: 'Impact_Measurement_Framework.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'report',
    size: 5678901,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-01',
    url: '#',
  },
];

export const fileCategories = [
  { value: 'report', label: 'Reports' },
  { value: 'grant', label: 'Grants' },
  { value: 'financial', label: 'Financial' },
  { value: 'media', label: 'Media' },
  { value: 'governance', label: 'Governance' },
  { value: 'policy', label: 'Policies' },
  { value: 'other', label: 'Other' },
];

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
```

**Verification:**
- [ ] Code added successfully
- [ ] TypeScript compiles: `pnpm run type-check`
- [ ] mockFiles, fileCategories, formatFileSize all exported

---

#### Step 2.2: Create Files Page (4 hours)

**File to Create:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/files/page.tsx`

**Action:** Create a new directory `/app/files/` and add `page.tsx` with the complete implementation.

**📖 Find the complete code in:** `Platform_Shell_Implementation_Guide.md` → Section "Code Implementations" → "Files Page - Complete Code"

**After creating the file, verify:**
- [ ] File created at `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/files/page.tsx`
- [ ] All imports resolve correctly (no red squiggly lines in IDE)
- [ ] TypeScript compiles: `pnpm run type-check`
- [ ] Build succeeds: `pnpm run build`
- [ ] Navigate to `/files` in browser - page renders
- [ ] Search functionality works
- [ ] Category filter works
- [ ] File icons display
- [ ] Storage stats calculate correctly

---

#### Step 2.3: Create Notifications Page (3 hours)

**File to Create:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/notifications/page.tsx`

**Action:** If directory `/app/notifications/` already exists from Phase 1 move, add `page.tsx` to it. Otherwise create the directory first.

**📖 Find the complete code in:** `Platform_Shell_Implementation_Guide.md` → Section "Code Implementations" → "Notifications Page - Complete Code"

**After creating the file, verify:**
- [ ] File created at `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/notifications/page.tsx`
- [ ] All imports resolve correctly
- [ ] TypeScript compiles: `pnpm run type-check`
- [ ] Navigate to `/notifications` - page renders
- [ ] Filter tabs work (All, Unread, Read)
- [ ] Mark as read button works
- [ ] Mark all as read button works
- [ ] Delete notification works
- [ ] Empty states display correctly

---

#### Step 2.4: Enhance Landing Page (8 hours)

**Overview:** Create 5 landing page components and update the root page to use them.

**Step 2.4.1: Create Hero Component (2 hours)**

**Directory:** Create `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/`

**File to Create:** `Hero.tsx`

```typescript
import { GlowButton, GlowBadge } from '@/components/glow-ui';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Microsoft 365 for Nonprofits
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            One Platform.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Every Tool You Need.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            VISION brings together 21 purpose-built apps to help nonprofits, foundations, and
            consultants plan, execute, and measure social impact—all in one connected workspace.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <GlowButton size="lg" variant="primary" glow="strong" rightIcon={<ArrowRight />}>
              Start Free Trial
            </GlowButton>
            <GlowButton size="lg" variant="outline" leftIcon={<Play />}>
              Watch Demo
            </GlowButton>
          </div>

          {/* Social Proof */}
          <p className="mt-8 text-sm text-gray-500">
            Trusted by 500+ organizations to manage $2B+ in social impact
          </p>
        </div>
      </div>
    </section>
  );
}
```

**Verification:**
- [ ] File created
- [ ] Imports resolve
- [ ] TypeScript compiles

**Step 2.4.2: Create Features Component (2 hours)**

**File to Create:** `/components/landing/Features.tsx`

```typescript
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge } from '@/components/glow-ui';
import { VISION_APPS } from '@/lib/vision-apps';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Features() {
  // Get first 6 apps as featured
  const featuredApps = VISION_APPS.filter(app => app.isPopular || app.isNew).slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            21 Apps. One Ecosystem.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Every tool you need to create lasting social impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredApps.map((app) => {
            const Icon = app.icon;
            return (
              <GlowCard key={app.id} variant="interactive">
                <GlowCardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon className="w-8 h-8 text-blue-600" />}
                    <div>
                      <GlowCardTitle>{app.name}</GlowCardTitle>
                      <GlowBadge variant="secondary" size="sm">
                        {app.moduleLabel}
                      </GlowBadge>
                    </div>
                  </div>
                </GlowCardHeader>
                <GlowCardContent>
                  <p className="text-sm text-gray-600 mb-4">{app.shortDescription}</p>
                  <Link
                    href="/auth/signup"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </GlowCardContent>
              </GlowCard>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/applications">
            <GlowButton variant="outline" size="lg">
              View All 21 Apps
            </GlowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Verification:**
- [ ] File created
- [ ] Imports resolve
- [ ] Apps display with icons

**Step 2.4.3: Create HowItWorks Component (1 hour)**

**File to Create:** `/components/landing/HowItWorks.tsx`

```typescript
import { GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Users, Sparkles, Rocket } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Team',
      description: 'Invite your team, set up your workspace, and define your organizational profile in minutes.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Choose Your Apps',
      description: 'Select from 21 purpose-built apps across 6 impact phases—from community listening to reporting.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Create Impact',
      description: 'Design programs, track outcomes, manage grants, and tell your impact story—all in one place.',
      icon: Rocket,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <GlowCard key={step.number} variant="elevated">
                <GlowCardContent className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-4">{step.number}</div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </GlowCardContent>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Verification:**
- [ ] File created
- [ ] 3 steps display correctly

**Step 2.4.4: Create Pricing Component (2 hours)**

**File to Create:** `/components/landing/Pricing.tsx`

```typescript
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowButton, GlowBadge } from '@/components/glow-ui';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 3 apps',
        '5 team members',
        'Basic support',
        '5GB storage',
        'Community resources',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$249',
      description: 'For growing organizations',
      features: [
        'All 21 apps',
        'Unlimited team members',
        'Priority support',
        '100GB storage',
        'Advanced analytics',
        'Custom integrations',
      ],
      cta: 'Start Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations and funders',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom training',
        'Unlimited storage',
        'SSO & advanced security',
        'SLA guarantees',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <GlowCard
              key={plan.name}
              variant={plan.highlighted ? 'elevated' : 'interactive'}
              className={plan.highlighted ? 'ring-2 ring-blue-500' : ''}
            >
              <GlowCardHeader>
                <div className="flex items-center justify-between mb-2">
                  <GlowCardTitle>{plan.name}</GlowCardTitle>
                  {plan.highlighted && (
                    <GlowBadge variant="primary" size="sm">
                      Popular
                    </GlowBadge>
                  )}
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </GlowCardHeader>
              <GlowCardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <GlowButton
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                  glow={plan.highlighted ? 'subtle' : undefined}
                >
                  {plan.cta}
                </GlowButton>
              </GlowCardContent>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Verification:**
- [ ] File created
- [ ] 3 pricing cards display

**Step 2.4.5: Create Footer Component (1 hour)**

**File to Create:** `/components/landing/Footer.tsx`

```typescript
import Link from 'next/link';

export function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/applications' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Apps', href: '/applications' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Status', href: '/status' },
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VISION Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

**Verification:**
- [ ] File created
- [ ] Footer displays correctly

**Step 2.4.6: Update Landing Page (0.5 hours)**

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/page.tsx`

**Replace entire content with:**

```typescript
import Link from 'next/link';
import { GlowButton } from '@/components/glow-ui';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600" />
              <span className="text-xl font-bold">VISION</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/applications" className="text-sm font-medium hover:text-blue-600">
                Apps
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/auth/signin">
                <GlowButton variant="ghost" size="sm">
                  Sign In
                </GlowButton>
              </Link>
              <Link href="/auth/signup">
                <GlowButton variant="primary" size="sm" glow="subtle">
                  Get Started
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <div id="pricing">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}
```

**Verification:**
- [ ] File updated
- [ ] All imports resolve
- [ ] Navigate to `/` - landing page displays
- [ ] All sections visible
- [ ] Navigation links work
- [ ] Responsive design works

---

### Phase 3: Complete Funder Portal (10 hours)

**Note:** The gap analysis report identified that funder portal pages exist but need completion/enhancement. Refer to `Platform_Shell_Implementation_Guide.md` for complete code implementations.

#### Step 3.1: Enhance Funder Dashboard (4 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/page.tsx`

**Required Enhancements:**
- Add DashboardHeader with time range and cohort filters
- Add 4 metric widgets (Active Grantees, Portfolio Health, At Risk, Total Investment)
- Add portfolio health chart using SimpleBarChart and mockPortfolioHealthData
- Add at-risk grantees widget
- Add recent activity feed using mockFunderActivities with type-based icons
- Add cohort overview cards

**📖 Find complete implementation code in:** `Platform_Shell_Implementation_Guide.md` → Section "Phase 3" → "Step 3.1"

**Verification after editing:**
- [ ] All sections render
- [ ] Filters affect displayed data
- [ ] Chart displays mockPortfolioHealthData
- [ ] Activity feed shows icons based on type
- [ ] Cohort cards display correctly

---

#### Step 3.2: Complete Grantee List Page (3 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/grantees/page.tsx`

**Required Features:**
- Search functionality
- Status, Risk, Cohort filter dropdowns
- Health score progress bars (green ≥80%, yellow ≥60%, red <60%)
- Risk level badges (green=low, yellow=medium, red=high)
- Export and Add grantee buttons
- View details navigation
- Empty state when no results

**📖 Find complete implementation code in:** `Platform_Shell_Implementation_Guide.md` → Section "Code Implementations" (or Phase 3, Step 3.2)

**Verification:**
- [ ] Search filters grantees by name
- [ ] All filter dropdowns work
- [ ] Progress bars display with correct colors
- [ ] Risk badges have correct colors
- [ ] Table displays all mockGrantees data
- [ ] Empty state displays when filters return no results

---

#### Step 3.3: Complete Cohort Management Page (3 hours)

**File to Edit:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/cohorts/page.tsx`

**Required Features:**
- Cohort cards grid
- Member avatars (first 5 members + "+N" indicator)
- Cohort stats (member count, avg health score)
- Create cohort modal
- Edit/delete buttons per cohort
- View details and Manage members buttons

**📖 Find complete implementation code in:** `Platform_Shell_Implementation_Guide.md` → Section "Code Implementations" (or Phase 3, Step 3.3)

**Verification:**
- [ ] Cohort cards display in grid
- [ ] Member avatars show (calculated from mockGrantees where cohort_id matches)
- [ ] Create modal opens
- [ ] Edit/delete buttons work
- [ ] Stats calculated correctly

---

### Phase 4: Settings Pages Verification (5 hours)

**Objective:** Verify each settings page matches specification requirements. DO NOT rewrite pages that are already correct—just verify they have all required features.

#### Step 4.1: Verify Profile Settings (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/profile/page.tsx`

**Open the file and check for:**
- [ ] AvatarUpload component used
- [ ] Display name, email (read-only), phone, title inputs
- [ ] Timezone selector with mockTimezones
- [ ] Password change section (current, new, confirm)
- [ ] Notification preferences toggles (product updates, security alerts, weekly summary)
- [ ] Delete account button with ConfirmDialog

**If ANY item is missing:** Add it. If all items present: Move to next step.

---

#### Step 4.2: Verify Organization Settings (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/organization/page.tsx`

**Check for:**
- [ ] LogoUpload component
- [ ] Org name, website, type selector (mockOrganizationTypes)
- [ ] Industry selector
- [ ] Annual budget input
- [ ] Country selector (mockCountries)
- [ ] Address fields
- [ ] Mission statement textarea
- [ ] Founded year, staff count inputs
- [ ] Focus areas (tags/chips)
- [ ] Brand colors section (primary, secondary color pickers)
- [ ] Danger zone (transfer ownership, delete org)

**If missing features:** Add them based on mockOrganizationSettings structure.

---

#### Step 4.3: Verify Team Management (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.tsx`

**Check for:**
- [ ] Invite member form (email + role selector)
- [ ] Pending invites list (mockPendingInvites) with Resend/Cancel
- [ ] Team members table (mockTeamMembers) with avatar, name, email, role, joined date
- [ ] Edit role dropdown per member
- [ ] Remove member button with confirmation
- [ ] PermissionsMatrix component displayed

**If missing:** Add components or features.

---

#### Step 4.4: Verify App Subscriptions (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/apps/page.tsx`

**Check for:**
- [ ] Current plan card (mockCurrentPlan)
- [ ] Enabled apps grid with Launch and Disable buttons
- [ ] Available apps grid with Enable button
- [ ] Usage stats (apps enabled count, monthly cost)

**Data sources:** mockApps, mockCurrentPlan, mockAppSubscriptions

---

#### Step 4.5: Verify Billing (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/billing/page.tsx`

**Check for:**
- [ ] Current subscription card (plan name, price, features, next billing date, change/cancel buttons)
- [ ] Payment method card (card icon, last 4, expiry, update button)
- [ ] Billing history table (mockBillingHistory with download invoices)
- [ ] AI usage section (mockAIUsageData with progress bar and per-app breakdown)
- [ ] Billing contact form (email, company name, tax ID)

---

### Phase 5: Final Validation (3 hours)

#### Step 5.1: Build Test (0.5 hours)

```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
pnpm run build
```

**Expected:** Build completes successfully with 0 errors.

**If build fails:**
1. Read error messages carefully
2. Fix TypeScript errors first (missing types, wrong imports)
3. Fix missing dependencies (run `pnpm install` if needed)
4. Re-run build until it succeeds

**🚨 DO NOT PROCEED until build succeeds.**

---

#### Step 5.2: Route Navigation Test (1 hour)

Start dev server:
```bash
pnpm dev
```

Open browser to `http://localhost:3000` and test every route:

| Route | Test | Pass? |
|-------|------|-------|
| `/` | Landing page displays with all sections | [ ] |
| `/dashboard` | Dashboard loads, shows apps | [ ] |
| `/applications` | Applications listing | [ ] |
| `/funder` | Funder dashboard with widgets | [ ] |
| `/funder/grantees` | Grantee list table | [ ] |
| `/funder/cohorts` | Cohort cards | [ ] |
| `/notifications` | Notifications page | [ ] |
| `/files` | Files page with table | [ ] |
| `/settings/profile` | Profile settings form | [ ] |
| `/settings/organization` | Org settings form | [ ] |
| `/settings/team` | Team table and invites | [ ] |
| `/settings/apps` | App subscriptions grid | [ ] |
| `/settings/billing` | Billing page with history | [ ] |
| `/onboarding` | Onboarding wizard | [ ] |

**Navigation Flow Test:**
- [ ] Click through all sidebar items - no broken links
- [ ] Click through breadcrumbs - navigation works
- [ ] Use browser back button - works correctly
- [ ] Paste URLs directly - deep linking works
- [ ] Active navigation states display correctly

**If ANY route fails:** Go back and fix it before proceeding.

---

#### Step 5.3: Mock Data Integration Test (0.5 hours)

Verify all mock data displays correctly:

- [ ] Dashboard shows mockApps (18 apps)
- [ ] Notifications dropdown shows mockNotifications
- [ ] Notifications page shows mockNotifications
- [ ] Files page shows mockFiles (8 files)
- [ ] Funder dashboard shows mockGrantees, mockCohorts, mockPortfolioHealthData, mockFunderActivities
- [ ] Grantees page shows mockGrantees in table
- [ ] Cohorts page shows mockCohorts as cards
- [ ] Team settings shows mockTeamMembers and mockPendingInvites
- [ ] Billing shows mockBillingHistory and mockAIUsageData
- [ ] Profile settings populated with mockProfileSettings
- [ ] Org settings populated with mockOrganizationSettings
- [ ] Search shows mockSearchResults

---

#### Step 5.4: Responsive Design Test (0.5 hours)

Use Chrome DevTools responsive mode to test:

**Mobile (375px):**
- [ ] Sidebar becomes hamburger menu
- [ ] Tables scroll horizontally
- [ ] Cards stack vertically
- [ ] Text readable
- [ ] Buttons accessible

**Tablet (768px):**
- [ ] Sidebar toggles
- [ ] 2-column grids work
- [ ] Tables display properly

**Desktop (1920px):**
- [ ] Sidebar fully expanded
- [ ] 3-4 column grids
- [ ] All content visible

---

#### Step 5.5: Console Error Check (0.5 hours)

Open browser DevTools console on each page and verify:
- [ ] No React errors
- [ ] No "missing key" warnings
- [ ] No 404 requests
- [ ] No TypeScript errors in console

---

## Success Criteria - Final Checklist

### Critical (Must Pass)

✅ **Routes**
- [ ] All routes are top-level (no `/dashboard/*` nesting except `/dashboard` itself)
- [ ] DashboardSidebar uses correct hrefs
- [ ] SettingsSidebar uses correct hrefs
- [ ] Mock data uses correct URLs
- [ ] Deep linking works for all pages

✅ **Pages**
- [ ] Landing page with Hero, Features, HowItWorks, Pricing, Footer
- [ ] Dashboard (/dashboard)
- [ ] Applications (/applications)
- [ ] Funder portal (/funder, /funder/grantees, /funder/cohorts)
- [ ] Notifications (/notifications)
- [ ] Files (/files)
- [ ] Settings (/settings/profile, /settings/organization, /settings/team, /settings/apps, /settings/billing)

✅ **Mock Data**
- [ ] mockFiles added to mock-data.ts
- [ ] All 20+ mock arrays display correctly
- [ ] No hardcoded data (except examples)

✅ **Build**
- [ ] `pnpm run build` succeeds with 0 errors
- [ ] `pnpm run type-check` passes
- [ ] No compilation errors

### High Priority

✅ **Navigation**
- [ ] Sidebar navigation works
- [ ] Breadcrumbs update correctly
- [ ] Active states display
- [ ] Mobile menu works

✅ **Interactions**
- [ ] Buttons clickable
- [ ] Forms submit
- [ ] Filters work
- [ ] Modals open/close

✅ **Responsive**
- [ ] Mobile (375px+) works
- [ ] Tablet (768px+) works
- [ ] Desktop (1024px+) works

---

## Emergency Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Install dependencies
pnpm install
```

**Error: "Type errors"**
- Check import paths are correct
- Verify all types are exported from their files
- Ensure mock data exports match their interfaces

### Pages Don't Load

**404 Errors**
- Verify directory structure matches routes exactly
- Check page.tsx files exist in correct locations
- Confirm no typos in directory names

**Blank Pages**
- Check browser console for errors
- Verify all imports resolve
- Confirm components are exported correctly

### Mock Data Not Displaying

- Verify export statement in mock-data.ts
- Check import path in component
- Confirm data structure matches interface
- Log data to console to debug

---

## Reporting Completion

When you have completed all phases and ALL success criteria pass, create a summary report with:

1. **Work Completed:**
   - Routes restructured (list files changed)
   - Pages created (list new files)
   - Pages enhanced (list modified files)
   - Features verified (list all verifications)

2. **Test Results:**
   - Build test: PASS/FAIL
   - All route tests: X/16 passed
   - Mock data tests: X/20 passed
   - Responsive tests: PASS/FAIL

3. **Known Issues:** (if any remain)

4. **Recommendations:** (for next steps)

---

## Final Notes for AI Agent

**DO NOT:**
- Skip Phase 1 (route restructuring is CRITICAL)
- Skip verification steps
- Proceed if build fails
- Make up code—use provided implementations
- Change files unnecessarily

**DO:**
- Follow phases in order
- Complete ALL verification checklists
- Run tests after each phase
- Use exact code from implementation guide
- Ask for clarification if specifications conflict

**Remember:**
- The route structure fix (Phase 1) is a BREAKING CHANGE that must be done first
- Every page MUST use mock data (never hardcode)
- All components must use Glow UI design system
- TypeScript must compile with 0 errors
- Build must succeed before declaring completion

**You have all the information and code needed to complete this task autonomously. Follow the guide step-by-step, verify your work, and deliver a production-ready Platform Shell frontend.**

---

**Document Version:** 1.0
**Created:** November 20, 2025
**For:** AI Development Agents (General-purpose)
**Expected Completion Time:** 38.5-41.5 hours
