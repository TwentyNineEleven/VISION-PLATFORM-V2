# VISION Platform Shell - Complete Implementation Guide

**Version:** 2.0
**Date:** November 20, 2025
**Status:** 85-90% Complete (41.5 hours remaining)
**Owner:** Ford Aaro / TwentyNine Eleven

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Reference Documents](#critical-reference-documents)
3. [Current State Assessment](#current-state-assessment)
4. [Gap Analysis Summary](#gap-analysis-summary)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Phase-by-Phase Instructions](#phase-by-phase-instructions)
7. [Code Implementations](#code-implementations)
8. [Testing & Validation](#testing--validation)
9. [Success Criteria](#success-criteria)

---

## Executive Summary

### Project Overview

**VISION Platform V2** is a comprehensive SaaS platform for nonprofits, foundations, and social impact organizations. The Platform Shell is the core infrastructure that provides:

- Multi-tenant workspace management
- Unified navigation and routing
- Application launcher for 18 VISION apps
- Settings management (profile, organization, team, billing)
- Funder portal for grantmaking organizations
- Notifications and file management

### Current Completion Status

**Overall Progress: 85-90%**

✅ **Completed (85%)**
- Dashboard with app launcher
- Onboarding wizard (4-step flow)
- Authentication pages (sign-in, sign-up, reset password)
- Settings pages structure
- Funder portal foundation
- Glow UI design system
- Mock data system
- 46+ reusable components

❌ **Critical Gaps (15%)**
- Route structure mismatch (P0 - CRITICAL)
- Missing pages: Files, enhanced Notifications, Landing
- Incomplete funder portal features
- Settings pages need verification

### Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (alpha)
- **UI Components:** Custom Glow UI library
- **Icons:** Lucide React
- **State:** React 19 with hooks
- **Validation:** Zod
- **Monorepo:** pnpm workspaces + Turborepo

---

## Critical Reference Documents

**AI agents MUST reference these files as source of truth:**

### Primary Specifications

1. **Platform Shell Frontend Complete Specification v2.0**
   - **Location:** `/Users/fordaaro/Downloads/Platform_Shell_Frontend_Complete_Specification_v2.0.md`
   - **Purpose:** Complete UI/UX specifications for all pages and components
   - **Size:** ~31,000 tokens (comprehensive)
   - **Sections:** Navigation, Dashboard, Settings, Funder Portal, Notifications, Files, Landing Page

2. **Platform Shell Requirements (Source of Truth)**
   - **Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/features/platform-shell/REQUIREMENTS.md`
   - **Purpose:** Technical requirements and implementation specifications
   - **Key Sections:**
     - Lines 549-600: Route Structure (CRITICAL)
     - Lines 96-103: Funder Dashboard requirements
     - Lines 1067-1075: Sign-off criteria

### Current Codebase

3. **Project Root**
   - **Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/`
   - **Structure:**
     ```
     /apps/shell/           → Platform Shell application
     /packages/             → Shared packages
     /documentation/        → All documentation
     ```

4. **Shell Application**
   - **Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/`
   - **Key Directories:**
     - `/src/app/` → Next.js pages and routes
     - `/src/components/` → React components
     - `/src/lib/` → Utilities and data

5. **Mock Data System**
   - **Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`
   - **Exports:** 20+ mock data arrays
   - **Status:** ✅ Comprehensive (just needs mockFiles added)

6. **VISION Apps Definitions**
   - **Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/vision-apps.ts`
   - **Exports:** VISION_APPS (18 apps), APP_MODULES, APP_CATEGORIES
   - **Status:** ✅ Complete with icons directly embedded

### Gap Analysis Report

7. **Comprehensive Gap Analysis**
   - **Generated:** By Plan agent during analysis phase
   - **Contains:**
     - File-by-file comparison between spec and current state
     - Priority matrix of missing features
     - Exact line numbers where issues exist
     - Complete code snippets for missing pages

---

## Current State Assessment

### Project Structure

```
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/
├── apps/
│   └── shell/                          ← Platform Shell (main focus)
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/          ← PROBLEM: Nested routes (needs restructuring)
│       │   │   │   ├── settings/       ❌ Should be /app/settings/
│       │   │   │   ├── funder/         ❌ Should be /app/funder/
│       │   │   │   ├── apps/           ❌ Should be /app/applications/
│       │   │   │   └── page.tsx        ✅ Dashboard page (complete)
│       │   │   ├── onboarding/         ✅ Onboarding wizard (complete)
│       │   │   ├── auth/               ✅ Auth pages (complete)
│       │   │   └── page.tsx            ⚠️ Landing page (just redirects)
│       │   ├── components/
│       │   │   ├── dashboard/          ✅ 10+ components
│       │   │   ├── settings/           ✅ 8+ components
│       │   │   ├── funder/             ✅ 6+ components
│       │   │   ├── glow-ui/            ✅ Design system
│       │   │   └── ...                 ✅ 46+ total components
│       │   └── lib/
│       │       ├── mock-data.ts        ✅ 20+ mock arrays (needs mockFiles)
│       │       └── vision-apps.ts      ✅ 18 VISION apps defined
│       └── package.json                ✅ glow-ui v0.1.7 installed
├── documentation/
│   └── platform/
│       └── features/
│           └── platform-shell/
│               └── REQUIREMENTS.md     ✅ Source of truth
└── package.json                        ✅ Monorepo config
```

### What Works (85%)

1. **Dashboard** (`/app/dashboard/page.tsx`) ✅
   - Welcome banner
   - Quick stats
   - Recent apps grid
   - Favorites section
   - App launcher integration
   - Notifications widget

2. **Onboarding** (`/app/onboarding/page.tsx`) ✅
   - 4-step wizard
   - Organization setup
   - Team invitations
   - App selection
   - Completion redirect

3. **Authentication** ✅
   - Sign in page
   - Sign up page
   - Password reset flow
   - Email verification

4. **Settings Pages** (exist but need verification) ⚠️
   - Profile settings (`/app/dashboard/settings/profile/page.tsx`)
   - Organization settings (location: `/app/dashboard/settings/organization/page.tsx`)
   - Team management (location: `/app/dashboard/settings/team/page.tsx`)
   - App subscriptions (location: `/app/dashboard/settings/apps/page.tsx`)
   - Billing (location: `/app/dashboard/settings/billing/page.tsx`)

5. **Funder Portal** (partial) ⚠️
   - Dashboard page (`/app/dashboard/funder/page.tsx`) - needs enhancement
   - Grantees page (`/app/dashboard/funder/grantees/page.tsx`) - needs completion
   - Cohorts page (`/app/dashboard/funder/cohorts/page.tsx`) - needs completion

6. **Components** ✅
   - 46+ reusable components built
   - Glow UI design system complete
   - All funder widgets exist

7. **Mock Data** ✅
   - mockApps (18 apps)
   - mockNotifications (6 items)
   - mockUser, mockOrganization
   - mockTeamMembers, mockPendingInvites
   - mockBillingHistory, mockAIUsageData
   - mockGrantees (4 items), mockCohorts (3 items)
   - mockSearchResults, mockTimezones, mockOrganizationTypes, mockCountries
   - mockPortfolioHealthData, mockFunderActivities
   - mockDocuments, mockProfileSettings, mockOrganizationSettings
   - mockAppSubscriptions, mockCurrentPlan

### What's Broken/Missing (15%)

#### 1. Route Structure Mismatch (P0 - CRITICAL)

**Problem:** All routes are nested under `/dashboard/*` but specifications require independent top-level routes.

**Current (WRONG):**
```
/dashboard/settings/*     → Settings pages
/dashboard/funder/*      → Funder portal
/dashboard/apps          → Applications
/dashboard/notifications → Notifications
/dashboard/files         → Files
```

**Required (CORRECT):**
```
/settings/*       → Settings pages (TOP LEVEL)
/funder/*        → Funder portal (TOP LEVEL)
/applications    → Applications (TOP LEVEL)
/notifications   → Notifications center (TOP LEVEL)
/files          → File management (TOP LEVEL)
```

**Evidence:**
- REQUIREMENTS.md lines 567-573 explicitly state "independent top-level routes (not nested under /dashboard)"
- Platform_Shell_Frontend_Complete_Specification_v2.0.md Section 2.2 confirms top-level routing

**Impact:** Breaking change affecting all navigation, breadcrumbs, and deep linking

**Files Affected (7 files):**
1. `/apps/shell/src/components/dashboard/DashboardSidebar.tsx` (lines 35-77)
2. `/apps/shell/src/components/dashboard/DashboardNavbar.tsx`
3. `/apps/shell/src/components/settings/SettingsSidebar.tsx`
4. `/apps/shell/src/app/dashboard/settings/page.tsx`
5. `/apps/shell/src/components/onboarding/CompletionStep.tsx`
6. `/apps/shell/src/components/dashboard/AppSwitcher.tsx`
7. `/apps/shell/src/lib/constants.ts`

#### 2. Missing Pages (P1 - HIGH PRIORITY)

**A. Files Page** ❌
- **Location:** `/app/files/page.tsx` (does NOT exist)
- **Specification:** Platform_Shell_Frontend_Complete_Specification_v2.0.md Section 5.2
- **Features Needed:**
  - File upload functionality
  - File list table
  - Search and filter (by category, type)
  - Download/delete actions
  - Storage usage indicator
  - Empty states

**B. Notifications Page (standalone)** ❌
- **Location:** `/app/notifications/page.tsx` (exists at wrong location)
- **Current:** Only NotificationDropdown component exists
- **Specification:** Platform_Shell_Frontend_Complete_Specification_v2.0.md Section 5.1
- **Features Needed:**
  - Filter tabs (All, Unread, Read)
  - Mark as read/unread
  - Delete notifications
  - Clear all functionality
  - Action buttons with navigation

**C. Landing Page** ⚠️
- **Location:** `/app/page.tsx` (exists but just redirects to /dashboard)
- **Current Code:**
  ```typescript
  import { redirect } from 'next/navigation';
  export default function HomePage() {
    redirect('/dashboard');
  }
  ```
- **Specification:** Platform_Shell_Frontend_Complete_Specification_v2.0.md Section 6
- **Components Needed:**
  - Hero section with value proposition
  - Features showcase (21 VISION apps)
  - How It Works section
  - Pricing tiers
  - Footer with links

#### 3. Incomplete Funder Portal (P1)

**A. Funder Dashboard** ⚠️
- **Location:** `/app/dashboard/funder/page.tsx` (needs to move to `/app/funder/page.tsx`)
- **Current:** ~135 lines, basic structure
- **Missing:**
  - DashboardHeader with time range and cohort filters
  - Portfolio health chart (SimpleBarChart with mockPortfolioHealthData)
  - At-risk grantees widget
  - Recent activity feed (mockFunderActivities with icons)
  - Cohort overview cards

**B. Grantee List Page** ⚠️
- **Location:** `/app/dashboard/funder/grantees/page.tsx` (needs to move to `/app/funder/grantees/page.tsx`)
- **Status:** File exists but needs verification
- **Must Verify:**
  - Search functionality works
  - All filter dropdowns (Status, Risk, Cohort)
  - Health score progress bars with colors
  - Risk level badges (green/yellow/red)
  - Export functionality
  - View details navigation

**C. Cohort Management Page** ⚠️
- **Location:** `/app/dashboard/funder/cohorts/page.tsx` (needs to move to `/app/funder/cohorts/page.tsx`)
- **Status:** File exists but needs verification
- **Must Verify:**
  - Cohort cards grid displays
  - Member avatars (first 5 + count)
  - Cohort stats calculated
  - Create cohort modal functional
  - Edit/delete functionality

#### 4. Settings Pages Verification (P1)

All settings pages exist but need verification against spec requirements:

- **Profile:** Verify avatar upload, password change, notification preferences
- **Organization:** Verify logo upload, brand color pickers, danger zone
- **Team:** Verify invite form, permissions matrix, role management
- **Apps:** Verify enable/disable toggles, usage stats
- **Billing:** Verify payment method, billing history, AI usage chart

#### 5. Mock Data Gap (P2 - LOW PRIORITY)

**Missing:** `mockFiles` array for Files page

**Location:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Needed:**
```typescript
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
  // 10-15 files with different types
];
```

---

## Gap Analysis Summary

### Priority Matrix

| Priority | Gap Description | Effort | Impact | Files Affected |
|----------|----------------|--------|--------|----------------|
| **P0** | Route structure mismatch | 8h | Critical | 7 files + directory moves |
| **P1** | Create Files page | 4h | High | 1 new page + mock data |
| **P1** | Create Notifications page | 3h | High | 1 new page |
| **P1** | Complete Funder Dashboard | 4h | High | 1 file enhancement |
| **P1** | Complete Grantee List | 3h | High | 1 file verification |
| **P1** | Complete Cohorts Page | 3h | High | 1 file verification |
| **P1** | Verify Settings Pages | 5h | High | 5 files verification |
| **P2** | Build Landing Page | 8h | Medium | 1 page + 5 components |
| **P2** | Add mockFiles data | 0.5h | Low | 1 file update |

**Total Estimated Effort:** 38.5 - 41.5 hours (1 week full-time or 2 weeks part-time)

---

## Implementation Roadmap

### Critical Path

```
Phase 1: Route Restructuring (8h)
    ↓
Phase 2: Missing Pages (15h)
    ↓
Phase 3: Funder Portal (10h)
    ↓
Phase 4: Settings Verification (5h)
    ↓
Phase 5: Final Validation (3h)
```

### Timeline

**Week 1 (40 hours - full-time)**
- Days 1-2 (16h): Phase 1 + Phase 2 (Routes + Pages)
- Days 3-4 (16h): Phase 3 + Phase 4 (Funder + Settings)
- Day 5 (8h): Phase 5 (Testing + Polish)

**Week 2 (Part-time or buffer)**
- Polish and fixes
- Documentation updates
- Final testing

---

## Phase-by-Phase Instructions

### Phase 1: Critical Route Restructuring (8 hours) - MUST DO FIRST

#### Overview
This phase fixes the route structure mismatch by moving all nested routes from `/dashboard/*` to independent top-level routes as required by the specification.

#### Prerequisites
- Backup current codebase
- Ensure git working directory is clean
- Have REQUIREMENTS.md open for reference

#### Step 1.1: Backup and Move Directory Structure (2 hours)

**Working Directory:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app
```

**Commands:**
```bash
# Create backup
cp -r dashboard dashboard.backup

# Move settings to top level
mv dashboard/settings ./settings

# Move funder portal to top level
mv dashboard/funder ./funder

# Rename apps to applications
mv dashboard/apps ./applications

# Move notifications to top level (if exists)
mv dashboard/notifications ./notifications

# Verify directory structure
ls -la settings/
ls -la funder/
ls -la applications/
ls -la notifications/
```

**Verification Checklist:**
- [ ] `/app/settings/` directory exists with subdirectories: profile/, organization/, team/, apps/, billing/
- [ ] `/app/funder/` directory exists with subdirectories: grantees/, cohorts/
- [ ] `/app/applications/` directory exists
- [ ] `/app/notifications/` directory exists
- [ ] `/app/dashboard/` still contains: page.tsx, layout.tsx (NOT the moved directories)

**Expected Result:**
```
/app/
├── dashboard/
│   ├── page.tsx        ✅ Keep
│   └── layout.tsx      ✅ Keep
├── settings/           ✅ Moved from dashboard/settings/
│   ├── profile/
│   ├── organization/
│   ├── team/
│   ├── apps/
│   └── billing/
├── funder/             ✅ Moved from dashboard/funder/
│   ├── page.tsx
│   ├── grantees/
│   └── cohorts/
├── applications/       ✅ Moved (renamed from dashboard/apps)
├── notifications/      ✅ Moved from dashboard/notifications/
├── onboarding/         ✅ Already top-level
└── page.tsx            ✅ Already top-level (landing page)
```

---

#### Step 1.2: Update DashboardSidebar Navigation (1.5 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/dashboard/DashboardSidebar.tsx`

**Current Code (Lines 35-77):**
```typescript
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/dashboard/apps' }, // ❌ WRONG
      { id: 'notifications', label: 'Notifications', href: '/dashboard/notifications' }, // ❌ WRONG
    ],
  },
  {
    id: 'funder',
    label: 'Funder',
    icon: <Handshake className="w-5 h-5" />,
    href: '/dashboard/funder', // ❌ WRONG
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/dashboard/settings/profile', // ❌ WRONG
  },
];
```

**Updated Code:**
```typescript
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/applications' }, // ✅ FIXED
      { id: 'notifications', label: 'Notifications', href: '/notifications' }, // ✅ FIXED
    ],
  },
  {
    id: 'apps',
    label: 'Applications',
    icon: <Layers3 className="w-5 h-5" />,
    href: '/applications', // ✅ FIXED
  },
  {
    id: 'funder',
    label: 'Funder',
    icon: <Handshake className="w-5 h-5" />,
    href: '/funder', // ✅ FIXED
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/notifications', // ✅ FIXED
    badge: 3,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <UploadCloud className="w-5 h-5" />,
    href: '/files', // ✅ FIXED
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings/profile', // ✅ FIXED
  },
];
```

**Verification:**
- [ ] All href values updated to top-level routes
- [ ] No `/dashboard/` prefix except for Dashboard item itself
- [ ] Files item added (will create page in Phase 2)

---

#### Step 1.3: Update SettingsSidebar Navigation (0.5 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/settings/SettingsSidebar.tsx`

**Search and Replace:**
```typescript
// Find all instances and replace:
'/dashboard/settings/profile'      → '/settings/profile'
'/dashboard/settings/organization' → '/settings/organization'
'/dashboard/settings/team'         → '/settings/team'
'/dashboard/settings/apps'         → '/settings/apps'
'/dashboard/settings/billing'      → '/settings/billing'
```

**Verification:**
- [ ] All settings routes use `/settings/` prefix (no `/dashboard/`)

---

#### Step 1.4: Update Mock Data URLs (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Update mockNotifications:**
```typescript
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'CapacityIQ: New assessment ready',
    message: 'Your organizational capacity assessment has been generated.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'high',
    actionUrl: '/applications/capacityiq', // ✅ CHANGE from /apps/capacityiq
    actionLabel: 'View Assessment',
  },
  {
    id: '2',
    type: 'organization',
    title: 'New team member joined',
    message: 'Alex Rivera has accepted the invitation to join your workspace.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/settings/team', // ✅ CHANGE from /dashboard/settings/team
    actionLabel: 'View Team',
  },
  // ... update all other notifications similarly
];
```

**Update mockSearchResults:**
```typescript
export const mockSearchResults: SearchResult[] = [
  {
    type: 'document',
    title: 'Grant Application 2024',
    category: 'Grant',
    app: 'FundingFramer',
    url: '/applications/fundingframer/documents/1', // ✅ CHANGE from /apps/fundingframer/
    badge: 'Grant',
    group: 'Documents',
  },
  // ... update all other search results similarly
];
```

**Verification:**
- [ ] All notification actionUrl values updated
- [ ] All search result url values updated
- [ ] No `/dashboard/` prefix in any URLs except for `/dashboard` itself

---

#### Step 1.5: Global Search & Replace (2 hours)

**Commands to find all old route references:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src

# Find all files with old routes
grep -r "/dashboard/settings" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/funder" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/apps" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/notifications" . --exclude-dir=node_modules --exclude-dir=.next
grep -r "/dashboard/files" . --exclude-dir=node_modules --exclude-dir=.next
```

**Files that likely need updates:**
1. `components/dashboard/DashboardNavbar.tsx`
2. `components/dashboard/AppSwitcher.tsx`
3. `components/onboarding/CompletionStep.tsx`
4. `components/navigation/NavigationSidebar.tsx` (if exists)
5. `lib/constants.ts` (if contains route definitions)

**For each file found:**
1. Open the file
2. Replace old route patterns with new top-level routes
3. Save and verify no TypeScript errors

**Verification:**
- [ ] All files updated
- [ ] No compilation errors
- [ ] TypeScript check passes: `pnpm run type-check`

---

#### Step 1.6: Phase 1 Verification (1 hour)

**Build Test:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
pnpm run build
```

**Expected:** Build completes successfully with 0 errors

**Development Server Test:**
```bash
pnpm dev
```

**Navigation Test Checklist:**
- [ ] Navigate to `/dashboard` - loads correctly
- [ ] Click "Settings" in sidebar - goes to `/settings/profile`
- [ ] Click "Funder" in sidebar - goes to `/funder`
- [ ] Click "Applications" in sidebar - goes to `/applications`
- [ ] Click "Notifications" in sidebar - goes to `/notifications`
- [ ] All breadcrumbs display correctly
- [ ] No console errors in browser
- [ ] No 404 errors

**If any test fails:** Stop and fix before proceeding to Phase 2

---

### Phase 2: Create Missing Pages (15 hours)

#### Step 2.1: Add mockFiles to Mock Data (0.5 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts`

**Add at end of file (before final export):**
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

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
```

**Verification:**
- [ ] mockFiles array added with 8+ files
- [ ] fileCategories array added
- [ ] formatFileSize helper function added
- [ ] No TypeScript errors

---

#### Step 2.2: Create Files Page (4 hours)

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/files/page.tsx`

**Full Implementation:** (See Code Implementations section for complete code)

**Verification Checklist:**
- [ ] File created at correct location
- [ ] All imports resolve correctly
- [ ] Page renders without errors
- [ ] Search functionality works
- [ ] Category filter dropdown works
- [ ] File type icons display correctly
- [ ] Download buttons work (open # link)
- [ ] Delete buttons work (show confirmation)
- [ ] Empty state displays when no files
- [ ] Upload button present (can be non-functional for now)

---

#### Step 2.3: Create Notifications Page (3 hours)

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/notifications/page.tsx`

**Full Implementation:** (See Code Implementations section for complete code)

**Verification Checklist:**
- [ ] File created at correct location
- [ ] All imports resolve correctly
- [ ] Page renders without errors
- [ ] Filter tabs work (All, Unread, Read)
- [ ] Mark as read functionality works
- [ ] Mark all as read button works
- [ ] Delete notification works
- [ ] Clear all button works
- [ ] Empty states display correctly
- [ ] Action buttons navigate to correct routes

---

#### Step 2.4: Enhance Landing Page (8 hours)

**Step 2.4.1: Create Hero Component (2 hours)**

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/Hero.tsx`

(See Code Implementations section for complete code)

**Step 2.4.2: Create Features Component (2 hours)**

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/Features.tsx`

(See Code Implementations section for complete code)

**Step 2.4.3: Create HowItWorks Component (1 hour)**

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/HowItWorks.tsx`

(See Code Implementations section for complete code)

**Step 2.4.4: Create Pricing Component (2 hours)**

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/Pricing.tsx`

(See Code Implementations section for complete code)

**Step 2.4.5: Create Footer Component (1 hour)**

**Create File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/components/landing/Footer.tsx`

(See Code Implementations section for complete code)

**Step 2.4.6: Update Landing Page (0.5 hours)**

**Update File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/page.tsx`

(See Code Implementations section for complete code)

**Verification:**
- [ ] All landing components created
- [ ] Landing page updated to use components
- [ ] Navigation bar displays
- [ ] All sections render correctly
- [ ] CTAs link to appropriate pages
- [ ] Responsive design works (test mobile, tablet, desktop)

---

### Phase 3: Complete Funder Portal (10 hours)

#### Step 3.1: Enhance Funder Dashboard (4 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/page.tsx`

(See Code Implementations section for complete code with all enhancements)

**Verification Checklist:**
- [ ] DashboardHeader with filters displays
- [ ] 4 metric widgets render correctly
- [ ] Portfolio health chart displays data
- [ ] At-risk grantees widget shows filtered list
- [ ] Recent activity feed displays with icons
- [ ] Cohort overview cards display
- [ ] All data comes from mock data
- [ ] Filters affect displayed data

---

#### Step 3.2: Complete Grantee List Page (3 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/grantees/page.tsx`

(See Code Implementations section for complete code)

**Verification Checklist:**
- [ ] Search functionality filters grantees
- [ ] Status filter dropdown works
- [ ] Risk filter dropdown works
- [ ] Cohort filter dropdown works
- [ ] Health score progress bars display with correct colors
- [ ] Risk level badges have correct colors (green/yellow/red)
- [ ] Export button displays
- [ ] Add grantee button displays
- [ ] View details navigation works
- [ ] Empty state displays when no results

---

#### Step 3.3: Complete Cohort Management Page (3 hours)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/funder/cohorts/page.tsx`

(See Code Implementations section for complete code)

**Verification Checklist:**
- [ ] Cohort cards grid displays
- [ ] Member avatars show (first 5 + count)
- [ ] Cohort stats calculated correctly
- [ ] Create cohort modal opens
- [ ] Edit cohort button works
- [ ] Delete cohort confirmation works
- [ ] View details navigation works
- [ ] Manage members button present

---

### Phase 4: Settings Pages Verification (5 hours)

#### Step 4.1: Verify Profile Settings (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/profile/page.tsx`

**Verification Checklist:**
- [ ] AvatarUpload component integrated
- [ ] Display name input present
- [ ] Email input (read-only) present
- [ ] Phone input present
- [ ] Title input present
- [ ] Timezone selector with mockTimezones
- [ ] Password change section (3 fields)
- [ ] Notification preferences toggles:
  - [ ] Product updates toggle
  - [ ] Security alerts toggle
  - [ ] Weekly summary toggle
- [ ] Notification channels display
- [ ] Save button works
- [ ] Delete account button with confirmation
- [ ] Form submission works (mock)

---

#### Step 4.2: Verify Organization Settings (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/organization/page.tsx`

**Verification Checklist:**
- [ ] LogoUpload component integrated
- [ ] Organization name input
- [ ] Website input (URL validation)
- [ ] Organization type selector (mockOrganizationTypes)
- [ ] Industry selector
- [ ] Annual budget input
- [ ] Country selector (mockCountries)
- [ ] Address fields (street, city, state, postal, country)
- [ ] Mission statement textarea
- [ ] Founded year input
- [ ] Staff count input
- [ ] Focus areas tags/chips
- [ ] Branding section:
  - [ ] Primary color picker
  - [ ] Secondary color picker
- [ ] Danger Zone section:
  - [ ] Transfer ownership button
  - [ ] Delete organization button with confirmation
- [ ] Save button works
- [ ] Form populated with mockOrganizationSettings

---

#### Step 4.3: Verify Team Management (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.tsx`

**Verification Checklist:**
- [ ] Invite member form:
  - [ ] Email input
  - [ ] Role selector (Owner, Admin, Editor, Viewer)
  - [ ] Send invitation button
- [ ] Pending invites section:
  - [ ] List displays mockPendingInvites
  - [ ] Shows email, role, invited date
  - [ ] Resend button works
  - [ ] Cancel button works
- [ ] Team members table:
  - [ ] Displays mockTeamMembers
  - [ ] Shows avatar, name, email
  - [ ] Shows role badge
  - [ ] Shows joined date
  - [ ] Edit role dropdown works
  - [ ] Remove member button with confirmation
- [ ] PermissionsMatrix component displays
- [ ] Shows role capabilities (Owner, Admin, Editor, Viewer)

---

#### Step 4.4: Verify App Subscriptions (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/apps/page.tsx`

**Verification Checklist:**
- [ ] Current plan card displays:
  - [ ] Plan name (from mockCurrentPlan)
  - [ ] Price
  - [ ] Apps included count
  - [ ] Change plan button
- [ ] Enabled apps section:
  - [ ] Grid/list of enabled apps
  - [ ] App icon, name, description
  - [ ] Category badge
  - [ ] Launch button (navigates to app)
  - [ ] Disable button
- [ ] Available apps section:
  - [ ] Grid/list of available apps
  - [ ] App icon, name, description
  - [ ] Category badge
  - [ ] Price display
  - [ ] Enable button
- [ ] Usage stats card:
  - [ ] Apps enabled count
  - [ ] Monthly cost calculation
  - [ ] Usage trend

---

#### Step 4.5: Verify Billing (1 hour)

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/billing/page.tsx`

**Verification Checklist:**
- [ ] Current subscription card:
  - [ ] Plan name, price
  - [ ] Features list
  - [ ] Next billing date
  - [ ] Change plan button
  - [ ] Cancel subscription button
- [ ] Payment method card:
  - [ ] Card brand icon
  - [ ] Last 4 digits
  - [ ] Expiry date
  - [ ] Update payment method button
- [ ] Billing history table:
  - [ ] Displays mockBillingHistory
  - [ ] Columns: Date, Invoice #, Amount, Status
  - [ ] Download invoice button per row
  - [ ] Status badges (Paid/Due)
- [ ] AI usage section:
  - [ ] Total AI requests vs limit
  - [ ] Progress bar
  - [ ] Usage by app breakdown (mockAIUsageData)
  - [ ] Cost per app
- [ ] Billing contact form:
  - [ ] Billing email input
  - [ ] Company name input
  - [ ] Tax ID input
  - [ ] Save button

---

### Phase 5: Final Validation (3 hours)

#### Step 5.1: Build Test (0.5 hours)

**Command:**
```bash
cd /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2
pnpm run build
```

**Pass Criteria:**
- [ ] Build completes successfully
- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] All pages compile
- [ ] No missing dependencies

**If build fails:**
1. Read error messages carefully
2. Fix TypeScript errors first
3. Fix import errors
4. Fix missing dependencies
5. Re-run build

---

#### Step 5.2: Route Navigation Test (1 hour)

**Start Dev Server:**
```bash
pnpm dev
```

**Test All Routes:**

| Route | Expected Result | Pass/Fail |
|-------|----------------|-----------|
| `/` | Landing page displays | [ ] |
| `/dashboard` | Dashboard loads | [ ] |
| `/applications` | Applications listing | [ ] |
| `/funder` | Funder dashboard | [ ] |
| `/funder/grantees` | Grantee list | [ ] |
| `/funder/cohorts` | Cohort management | [ ] |
| `/notifications` | Notifications page | [ ] |
| `/files` | Files page | [ ] |
| `/settings/profile` | Profile settings | [ ] |
| `/settings/organization` | Org settings | [ ] |
| `/settings/team` | Team management | [ ] |
| `/settings/apps` | App subscriptions | [ ] |
| `/settings/billing` | Billing page | [ ] |
| `/onboarding` | Onboarding wizard | [ ] |
| `/auth/signin` | Sign in page | [ ] |
| `/auth/signup` | Sign up page | [ ] |

**Navigation Flow Test:**
- [ ] Click through all sidebar items
- [ ] Test breadcrumb navigation
- [ ] Test back button
- [ ] Test deep linking (paste URL directly)
- [ ] Verify active nav states

---

#### Step 5.3: Component Integration Test (0.5 hours)

**Verify Critical Components Render:**

| Component Type | Location | Pass/Fail |
|---------------|----------|-----------|
| GlowButton | All pages | [ ] |
| GlowCard | All pages | [ ] |
| GlowInput | Settings pages | [ ] |
| GlowBadge | Dashboard, Apps | [ ] |
| DashboardSidebar | All authenticated pages | [ ] |
| SettingsSidebar | Settings pages | [ ] |
| NotificationDropdown | Header | [ ] |
| GlobalSearch | Header | [ ] |
| AppLauncher | Dashboard | [ ] |
| AvatarUpload | Profile settings | [ ] |
| LogoUpload | Org settings | [ ] |
| PermissionsMatrix | Team settings | [ ] |

---

#### Step 5.4: Mock Data Integration Test (0.5 hours)

**Verify Mock Data Displays:**

| Mock Data | Where Used | Pass/Fail |
|-----------|-----------|-----------|
| mockApps | Dashboard, Applications | [ ] |
| mockNotifications | Notifications page, dropdown | [ ] |
| mockFiles | Files page | [ ] |
| mockGrantees | Funder dashboard, Grantees | [ ] |
| mockCohorts | Funder dashboard, Cohorts | [ ] |
| mockTeamMembers | Team settings | [ ] |
| mockPendingInvites | Team settings | [ ] |
| mockBillingHistory | Billing page | [ ] |
| mockAIUsageData | Billing page | [ ] |
| mockPortfolioHealthData | Funder dashboard chart | [ ] |
| mockFunderActivities | Funder dashboard feed | [ ] |
| mockSearchResults | Global search | [ ] |
| mockProfileSettings | Profile settings | [ ] |
| mockOrganizationSettings | Org settings | [ ] |
| mockTimezones | Profile settings | [ ] |
| mockOrganizationTypes | Org settings | [ ] |
| mockCountries | Org settings | [ ] |
| mockCurrentPlan | Settings apps, Billing | [ ] |
| mockAppSubscriptions | Settings apps | [ ] |
| mockDocuments | Dashboard | [ ] |

---

#### Step 5.5: Responsive Design Test (0.5 hours)

**Test Breakpoints:**

**Mobile (375px - 767px):**
- [ ] Sidebar collapses to hamburger menu
- [ ] Tables scroll horizontally
- [ ] Cards stack vertically
- [ ] Text remains readable
- [ ] Buttons stack vertically
- [ ] Forms display correctly

**Tablet (768px - 1023px):**
- [ ] Sidebar shows/hides toggle
- [ ] 2-column grids work
- [ ] Tables display with horizontal scroll if needed
- [ ] Cards in 2 columns

**Desktop (1024px+):**
- [ ] Sidebar fully expanded
- [ ] 3-4 column grids
- [ ] Full tables visible
- [ ] All features accessible

**Tools:**
- Chrome DevTools responsive mode
- Test on actual devices if available

---

## Code Implementations

### Files Page - Complete Code

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/files/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
  GlowButton,
  GlowInput,
  GlowBadge,
} from '@/components/glow-ui';
import { mockFiles, fileCategories, formatFileSize } from '@/lib/mock-data';
import {
  Upload,
  Download,
  Trash,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Search,
  Filter,
  HardDrive,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';

export default function FilesPage() {
  const [files, setFiles] = useState(mockFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter files based on search and category
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get file type icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('document')) return <FileText className="w-8 h-8 text-blue-600" />;
    if (type.includes('spreadsheet')) return <FileText className="w-8 h-8 text-green-600" />;
    if (type.includes('presentation')) return <FileText className="w-8 h-8 text-orange-600" />;
    return <FileIcon className="w-8 h-8 text-gray-500" />;
  };

  // Handle file deletion
  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Calculate total storage used
  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);
  const storageLimit = 10 * 1024 * 1024 * 1024; // 10 GB
  const storagePercentage = (totalStorage / storageLimit) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Files</h1>
          <p className="text-gray-600">Manage and organize your documents</p>
        </div>
        <GlowButton variant="primary" leftIcon={<Upload />}>
          Upload Files
        </GlowButton>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <GlowCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <FileIcon className="w-10 h-10 text-blue-500" />
            </div>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{formatFileSize(totalStorage)}</p>
              </div>
              <HardDrive className="w-10 h-10 text-green-500" />
            </div>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardContent className="p-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Storage Limit</p>
                <p className="text-sm font-medium">{formatFileSize(storageLimit)}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{storagePercentage.toFixed(1)}% used</p>
            </div>
          </GlowCardContent>
        </GlowCard>
      </div>

      {/* Filters */}
      <GlowCard>
        <GlowCardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlowInput
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Categories</option>
              {fileCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Files Table */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Your Files ({filteredFiles.length})</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">File</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Size</th>
                    <th className="text-left p-3">Uploaded By</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.type.split('/')[1]?.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <GlowBadge variant="secondary">
                          {fileCategories.find((c) => c.value === file.category)?.label || file.category}
                        </GlowBadge>
                      </td>
                      <td className="p-3 text-sm">{formatFileSize(file.size)}</td>
                      <td className="p-3 text-sm">{file.uploaded_by}</td>
                      <td className="p-3 text-sm">{new Date(file.uploaded_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <GlowButton variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                            Download
                          </GlowButton>
                          <ConfirmDialog
                            title="Delete File"
                            description={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
                            triggerLabel="Delete"
                            onConfirm={() => handleDelete(file.id)}
                            triggerVariant="ghost"
                            triggerSize="sm"
                            triggerIcon={<Trash className="w-4 h-4" />}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No files found matching your filters.</p>
              <GlowButton variant="outline" className="mt-4" onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}>
                Clear Filters
              </GlowButton>
            </div>
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
```

---

### Notifications Page - Complete Code

**File:** `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/notifications/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
  GlowButton,
  GlowBadge,
  GlowTabs,
} from '@/components/glow-ui';
import { mockNotifications, type Notification } from '@/lib/mock-data';
import {
  Bell,
  Check,
  CheckCheck,
  Trash,
  ArrowRight,
  AlertCircle,
  Info,
  Users,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Filter notifications based on selected tab
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Get notification icon
  const getNotificationIcon = (type: Notification['type'], priority?: string) => {
    const iconClass = priority === 'high' ? 'text-red-500' : 'text-blue-500';

    switch (type) {
      case 'system':
        return <Settings className={`w-5 h-5 ${iconClass}`} />;
      case 'organization':
        return <Users className={`w-5 h-5 ${iconClass}`} />;
      case 'application':
        return <Bell className={`w-5 h-5 ${iconClass}`} />;
      case 'personal':
        return <Info className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Bell className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <GlowButton
            variant="outline"
            leftIcon={<CheckCheck />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </GlowButton>
          <GlowButton
            variant="ghost"
            leftIcon={<Trash />}
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </GlowButton>
        </div>
      </div>

      {/* Tabs */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Notifications List */}
      <GlowCard>
        <GlowCardContent>
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {notification.priority === 'high' && (
                              <GlowBadge variant="danger" size="sm">
                                Urgent
                              </GlowBadge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <GlowBadge variant="secondary" size="sm">
                              {notification.type}
                            </GlowBadge>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <GlowButton
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              leftIcon={<Check className="w-4 h-4" />}
                            >
                              Mark Read
                            </GlowButton>
                          )}
                          <GlowButton
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            leftIcon={<Trash className="w-4 h-4" />}
                          >
                            Delete
                          </GlowButton>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && notification.actionLabel && (
                        <Link href={notification.actionUrl} className="mt-3 inline-block">
                          <GlowButton
                            variant="outline"
                            size="sm"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            {notification.actionLabel}
                          </GlowButton>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : filter === 'read'
                  ? 'No read notifications'
                  : 'No notifications yet'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You'll see notifications here when something important happens.
              </p>
            </div>
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
```

---

## Testing & Validation

### Automated Testing Commands

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Build test
pnpm run build

# Run dev server
pnpm dev
```

### Manual Testing Checklist

See Phase 5 sections above for complete testing procedures.

---

## Success Criteria

### Definition of Done

The Platform Shell frontend is considered 100% complete when ALL of the following criteria are met:

#### Critical Requirements (Must Pass)

✅ **1. Route Structure**
- [ ] All routes follow top-level pattern (no `/dashboard/*` nesting)
- [ ] Navigation components use correct routes
- [ ] Deep linking works for all pages
- [ ] Breadcrumbs update correctly

✅ **2. All Pages Exist and Function**
- [ ] Dashboard (/)
- [ ] Landing page with all sections
- [ ] Applications listing
- [ ] Funder dashboard, grantees, cohorts
- [ ] Notifications page
- [ ] Files page
- [ ] Settings: profile, organization, team, apps, billing
- [ ] Onboarding wizard
- [ ] Auth pages

✅ **3. Mock Data Integration**
- [ ] All 20+ mock data arrays in use
- [ ] Data displays correctly on all pages
- [ ] No hardcoded data (except examples)

✅ **4. Component Library**
- [ ] All 46+ components functional
- [ ] Glow UI design system complete
- [ ] No console errors from components

✅ **5. Build Quality**
- [ ] `pnpm run build` succeeds with 0 errors
- [ ] `pnpm run type-check` passes with 0 errors
- [ ] `pnpm run lint` passes with 0 critical errors
- [ ] No unused imports or variables

#### High Priority

✅ **6. Navigation**
- [ ] Sidebar navigation works on all pages
- [ ] Settings sidebar works on settings pages
- [ ] Active states display correctly
- [ ] Mobile hamburger menu works

✅ **7. Interactions**
- [ ] All buttons functional (even if mock)
- [ ] Forms submit (even if mock)
- [ ] Filters and search work
- [ ] Modals/dialogs open and close

✅ **8. Responsive Design**
- [ ] Mobile (375px+) displays correctly
- [ ] Tablet (768px+) displays correctly
- [ ] Desktop (1024px+) displays correctly

#### Polish

✅ **9. User Experience**
- [ ] Empty states display when no data
- [ ] Loading states (if applicable)
- [ ] Error states (if applicable)
- [ ] Confirmation dialogs for destructive actions

✅ **10. Documentation**
- [ ] This implementation guide is complete
- [ ] REQUIREMENTS.md is up to date
- [ ] All code is commented where needed

### Final Sign-Off

Once all criteria above are met, the Platform Shell frontend is ready for:
- Backend integration
- Production deployment preparation
- User acceptance testing

---

## Emergency Resources

### Key File Paths Reference

```
Working Directory:
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/

Specifications:
/Users/fordaaro/Downloads/Platform_Shell_Frontend_Complete_Specification_v2.0.md
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/features/platform-shell/REQUIREMENTS.md

Source Code:
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/

Mock Data:
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/mock-data.ts

App Definitions:
/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/lib/vision-apps.ts
```

### Common Issues and Solutions

**Issue: Build fails with module not found**
- Solution: Run `pnpm install` to install dependencies

**Issue: Routes return 404**
- Solution: Check directory structure matches route paths exactly

**Issue: TypeScript errors in components**
- Solution: Verify all imports resolve, check for missing type definitions

**Issue: Mock data not displaying**
- Solution: Verify import paths, check mock data is exported correctly

### Getting Help

If stuck:
1. Re-read the specification document
2. Check REQUIREMENTS.md for source of truth
3. Review gap analysis report
4. Compare against existing working pages
5. Check console for errors

---

**Document Version:** 2.0
**Last Updated:** November 20, 2025
**Maintained By:** Ford Aaro / TwentyNine Eleven
