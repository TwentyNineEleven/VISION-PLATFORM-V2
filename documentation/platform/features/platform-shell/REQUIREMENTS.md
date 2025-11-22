# VISION Platform Layer - Complete Requirements & Implementation Guide

**Purpose:** This document defines ALL features and functionality that MUST be implemented in the platform-shell layer (apps/platform-shell).

**Status:** Implementation Guide
**Date:** November 12, 2025
**Based on:** Existing codebase analysis + PRD requirements

---

## 🎯 Platform Layer Purpose

The platform-shell is the **unified container and launcher** for all VISION Platform applications. It provides:

1. **Authentication & Authorization** - Single sign-on for all apps
2. **Organization Management** - Multi-tenant organization switching
3. **Unified Navigation** - Consistent header, navigation, and app launcher
4. **Centralized Document Management** - Shared document library
5. **Cross-App Integration** - Event bus for app-to-app communication
6. **User Settings & Preferences** - Profile, team, billing, app subscriptions
7. **Funder Portal** - Special dashboard for foundation program officers
8. **Global Search** - Search across all apps and documents
9. **Notification Center** - Real-time notifications from all apps

---

## ✅ Current Implementation Status

### Already Implemented (Keep & Enhance)

**✅ Authentication System**
- Location: [apps/platform-shell/src/middleware.ts](apps/platform-shell/src/middleware.ts)
- Status: Working with Supabase Auth
- Features:
  - Session-based authentication
  - Protected route middleware
  - Auto-redirect to login for unauthenticated users
  - Post-login redirect preservation

**✅ Organization Management**
- Location: [apps/platform-shell/src/providers/OrganizationProvider.tsx](apps/platform-shell/src/providers/OrganizationProvider.tsx)
- Status: Fully functional
- Features:
  - Multi-organization support
  - Organization switching
  - Role-based access per organization
  - Persistent organization selection (localStorage)
  - Auto-redirect to onboarding if no organizations
- **Related Feature:** [Organization Onboarding](../organization-onboarding/README.md) - Initial org setup flow

**✅ App Launcher Dashboard**
- Location: [apps/platform-shell/src/app/dashboard/page.tsx](apps/platform-shell/src/app/dashboard/page.tsx)
- Status: Fully functional with real-time events
- Features:
  - Grid display of available apps (CapacityIQ, FundingFramer, CRM Lite)
  - App access control (enabled/disabled, user permissions)
  - Real-time notifications from app events
  - AppNavigation component
  - UserMenu component
  - OrganizationSwitcher component

**✅ Document Management System**
- Location: [apps/platform-shell/src/app/dashboard/documents/page.tsx](apps/platform-shell/src/app/dashboard/documents/page.tsx)
- API: [apps/platform-shell/src/app/api/documents/](apps/platform-shell/src/app/api/documents/)
- Status: Fully functional
- Features:
  - Upload documents with drag-and-drop
  - List/view documents with filters (category, search)
  - Download documents
  - Delete documents
  - Document categorization
  - Multi-tenant isolation (RLS)
  - Pagination support

**✅ Event Bus System**
- Location: [apps/platform-shell/src/providers/EventBusProvider.tsx](apps/platform-shell/src/providers/EventBusProvider.tsx)
- Package: [@vision/events](packages/events/)
- Status: Production-ready
- Features:
  - Publish/subscribe pattern
  - Real-time cross-app communication
  - Type-safe event definitions
  - Supabase Realtime integration
  - Multi-tenant event isolation

**✅ Settings Pages (Partial)**
- Location: [apps/platform-shell/src/app/dashboard/settings/](apps/platform-shell/src/app/dashboard/settings/)
- Status: Structure exists, needs completion
- Existing Pages:
  - Profile settings
  - Organization settings
  - Team management
  - App subscriptions
  - Billing

**✅ Funder Dashboard (Partial)**
- Location: [apps/platform-shell/src/app/dashboard/funder/](apps/platform-shell/src/app/dashboard/funder/)
- Status: Structure exists, needs completion
- Existing Pages:
  - Funder dashboard overview
  - Grantee list
  - Cohort management

---

## 🚧 Missing Features (Must Implement)

### 1. **Onboarding Flow** ⚠️ CRITICAL

**Location:** [apps/platform-shell/src/app/onboarding/page.tsx](apps/platform-shell/src/app/onboarding/page.tsx)

**Status:** File exists but incomplete

**Requirements:**
```typescript
// Step 1: User Profile Completion
interface UserProfileStep {
  displayName: string;
  title: string;
  phoneNumber?: string;
  avatar?: File;
}

// Step 2: Organization Creation or Join
interface OrganizationStep {
  action: 'create' | 'join';
  // If creating:
  organizationName?: string;
  organizationType?: 'nonprofit' | 'foundation' | 'consultant' | 'other';
  ein?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  // If joining:
  inviteCode?: string;
}

// Step 3: App Selection
interface AppSelectionStep {
  selectedApps: string[]; // ['capacity-assessment', 'funding-framer', ...]
  plan: 'free' | 'pro' | 'enterprise';
}

// Step 4: Completion
interface OnboardingComplete {
  skipTour: boolean;
  enableNotifications: boolean;
}
```

**Implementation Requirements:**
- Multi-step wizard (4 steps minimum)
- Progress indicator
- Form validation with Zod
- Auto-create organization after profile completion
- Auto-add user to organization as owner
- Auto-provision default app subscriptions
- Redirect to dashboard after completion
- Skip button with confirmation

**Database Operations:**
```sql
-- Must create:
-- 1. user_profiles entry
-- 2. organizations entry (if creating)
-- 3. organization_members entry (link user to org)
-- 4. app_subscriptions entries (for selected apps)
```

---

### 2. **Global Search** ⚠️ HIGH PRIORITY

**Location:** Create [apps/platform-shell/src/components/GlobalSearch.tsx](apps/platform-shell/src/components/GlobalSearch.tsx)

**Requirements:**
- Accessible via keyboard shortcut (Cmd+K / Ctrl+K)
- Search across:
  - Documents (all categories)
  - Grant proposals (FundingFramer)
  - Assessments (CapacityIQ)
  - Contacts (CRM)
  - Organizations (if funder)
- Real-time search results
- Recent searches history
- Quick actions (e.g., "Create new proposal")
- Navigation to app routes

**UI Specifications:**
```typescript
interface GlobalSearchProps {
  // Opened via Spotlight component from Mantine
  opened: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'document' | 'proposal' | 'assessment' | 'contact' | 'organization';
  title: string;
  description?: string;
  appIcon: React.ReactNode;
  appName: string;
  url: string;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    category?: string;
  };
}
```

**Implementation:**
- Use Mantine Spotlight component
- Debounced search (300ms)
- Max 50 results
- Group results by type/app
- Keyboard navigation support
- Highlight matching text
- Show app context with icons

---

### 3. **Notification Center** ⚠️ HIGH PRIORITY

**Location:** Create [apps/platform-shell/src/components/NotificationCenter.tsx](apps/platform-shell/src/components/NotificationCenter.tsx)

**Requirements:**
- Bell icon in header (next to UserMenu)
- Badge showing unread count
- Dropdown panel with notifications
- Real-time updates via EventBus
- Mark as read/unread
- Clear all notifications
- Filter by app/type
- Notification history (last 30 days)

**Notification Types:**
```typescript
interface PlatformNotification {
  id: string;
  organizationId: string;
  userId?: string; // Null = all org members
  type: 'info' | 'success' | 'warning' | 'error';
  appId: string;
  appName: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}
```

**Notification Sources:**
- Proposal created (FundingFramer)
- Assessment completed (CapacityIQ)
- Grant deadline approaching (FundingFramer)
- New team member added (Platform)
- Document uploaded (Platform)
- Funder report due (FundingFramer)
- System announcements

**Database:**
```sql
CREATE TABLE platform_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id), -- Null = all members
  app_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_label TEXT,
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('info', 'success', 'warning', 'error'))
);

-- RLS policies
CREATE POLICY "Users see org notifications"
ON platform_notifications FOR SELECT
USING (
  organization_id = auth.organization_id() AND
  (user_id IS NULL OR user_id = auth.uid())
);
```

---

### 4. **Complete Settings Pages** ⚠️ MEDIUM PRIORITY

**4.1 Profile Settings**
Location: [apps/platform-shell/src/app/dashboard/settings/profile/page.tsx](apps/platform-shell/src/app/dashboard/settings/profile/page.tsx)

**Must Include:**
- Display name (editable)
- Email (read-only, verified badge)
- Phone number (editable)
- Title/Role (editable)
- Avatar upload (Supabase Storage)
- Password change form
- Email verification status
- 2FA enable/disable (future)
- Notification preferences:
  - Email notifications (on/off)
  - Push notifications (on/off)
  - Notification types (grant deadlines, team updates, etc.)
- Timezone selection
- Language preference (future)
- Delete account button (with confirmation)

**4.2 Organization Settings**
Location: [apps/platform-shell/src/app/dashboard/settings/organization/page.tsx](apps/platform-shell/src/app/dashboard/settings/organization/page.tsx)

**Must Include:**
- Organization name (editable by owner/admin)
- Organization type (nonprofit, foundation, etc.)
- EIN/Tax ID (editable by owner)
- Website URL
- Logo upload (Supabase Storage)
- Address (street, city, state, zip, country)
- Mission statement (textarea)
- Founded year
- Organization size (staff count, annual budget)
- Areas of focus (tags)
- Delete organization (owner only, with confirmation)

**4.3 Team Management**
Location: [apps/platform-shell/src/app/dashboard/settings/team/page.tsx](apps/platform-shell/src/app/dashboard/settings/team/page.tsx)

**Must Include:**
- List current team members with:
  - Name, email, role, join date
  - Edit role button (owner/admin only)
  - Remove member button (owner/admin only)
  - Pending invites list
- Invite new members:
  - Email input
  - Role selection (owner, admin, member, viewer)
  - Send invite button
- Role permissions matrix display
- Pending invites management:
  - Resend invite
  - Cancel invite
- Member activity log (future)

**Roles & Permissions:**
```typescript
type OrganizationRole = 'owner' | 'admin' | 'member' | 'viewer';

const ROLE_PERMISSIONS = {
  owner: {
    canEditOrg: true,
    canDeleteOrg: true,
    canManageMembers: true,
    canManageBilling: true,
    canManageApps: true,
    canViewAllData: true,
    canEditAllData: true,
  },
  admin: {
    canEditOrg: true,
    canDeleteOrg: false,
    canManageMembers: true,
    canManageBilling: false,
    canManageApps: true,
    canViewAllData: true,
    canEditAllData: true,
  },
  member: {
    canEditOrg: false,
    canDeleteOrg: false,
    canManageMembers: false,
    canManageBilling: false,
    canManageApps: false,
    canViewAllData: true,
    canEditAllData: true, // Own data only
  },
  viewer: {
    canEditOrg: false,
    canDeleteOrg: false,
    canManageMembers: false,
    canManageBilling: false,
    canManageApps: false,
    canViewAllData: true,
    canEditAllData: false,
  },
};
```

**4.4 App Subscriptions**
Location: [apps/platform-shell/src/app/dashboard/settings/apps/page.tsx](apps/platform-shell/src/app/dashboard/settings/apps/page.tsx)

**Must Include:**
- Grid/list of all available apps
- Current subscription status for each app:
  - Active (green badge)
  - Inactive (gray badge)
  - Trial (blue badge with days remaining)
- Enable/disable toggle for each app (owner/admin only)
- App usage statistics:
  - Last accessed date
  - Number of users
  - Data usage (documents, proposals, etc.)
- App-specific settings link
- Trial period information
- Upgrade/downgrade plan options

**4.5 Billing**
Location: [apps/platform-shell/src/app/dashboard/settings/billing/page.tsx](apps/platform-shell/src/app/dashboard/settings/billing/page.tsx)

**Must Include:**
- Current plan display (Free, Pro, Enterprise)
- Billing cycle (monthly/annually)
- Next billing date
- Payment method:
  - Credit card last 4 digits
  - Expiration date
  - Update payment method button (Stripe)
- Billing history table:
  - Date, description, amount, status, invoice PDF link
- Upgrade/downgrade plan buttons
- Cancel subscription button (with confirmation)
- AI usage costs breakdown:
  - Cost per app (CapacityIQ, FundingFramer)
  - Total tokens used
  - Total cost this month
  - Historical cost trend chart
- Stripe Customer Portal link (for invoices/receipts)

---

### 5. **Funder Portal (Complete)** ⚠️ MEDIUM PRIORITY

**5.1 Funder Dashboard Overview**
Location: [apps/platform-shell/src/app/dashboard/funder/page.tsx](apps/platform-shell/src/app/dashboard/funder/page.tsx)

**Must Include:**
- Portfolio summary:
  - Total grantee organizations
  - Total active grants
  - Total grant amount disbursed
  - Average organizational health score
- Recent grantee activity feed:
  - Assessments completed
  - Proposals submitted
  - Reports submitted
  - Risk alerts
- At-risk grantees list:
  - Organizations with declining scores
  - Missed report deadlines
  - Financial concerns
- Upcoming deadlines:
  - Grant reports due
  - Site visits scheduled
  - Grant renewals
- Portfolio health trends (chart):
  - Capacity scores over time
  - Grant success rates
  - Impact metrics

**5.2 Grantee List & Management**
Location: [apps/platform-shell/src/app/dashboard/funder/grantees/page.tsx](apps/platform-shell/src/app/dashboard/funder/grantees/page.tsx)

**Must Include:**
- Table of all grantee organizations:
  - Name, contact, grant amount, status, capacity score
  - Filter by: grant status, capacity score range, risk level
  - Sort by: name, grant amount, score, last activity
  - Search by name/EIN
- Grantee detail view (modal or page):
  - Organization profile
  - Current grants list
  - Capacity assessment history
  - Document repository access
  - Activity timeline
  - Contact information
  - Notes (funder-only)
- Add new grantee button
- Export grantee data (CSV/Excel)
- Bulk actions: send message, request report, etc.

**5.3 Cohort Management**
Location: [apps/platform-shell/src/app/dashboard/funder/cohorts/page.tsx](apps/platform-shell/src/app/dashboard/funder/cohorts/page.tsx)

**Must Include:**
- List of cohorts:
  - Name, description, member count, created date
- Create new cohort:
  - Name, description
  - Add grantee organizations (multi-select)
  - Set cohort goals/metrics
- Cohort detail view:
  - Member list
  - Aggregate capacity scores
  - Comparative analysis (benchmarking)
  - Cohort-wide announcements
  - Shared resources/documents
  - Progress tracking dashboard
- Edit/delete cohort

**Database Schema:**
```sql
CREATE TABLE funder_grantees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funder_org_id UUID NOT NULL REFERENCES organizations(id),
  grantee_org_id UUID NOT NULL REFERENCES organizations(id),
  grant_amount DECIMAL(12,2),
  grant_start_date DATE,
  grant_end_date DATE,
  status TEXT NOT NULL, -- 'active', 'completed', 'suspended'
  risk_level TEXT, -- 'low', 'medium', 'high'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_funder_grantee UNIQUE(funder_org_id, grantee_org_id)
);

CREATE TABLE funder_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funder_org_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE funder_cohort_members (
  cohort_id UUID NOT NULL REFERENCES funder_cohorts(id),
  grantee_org_id UUID NOT NULL REFERENCES organizations(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (cohort_id, grantee_org_id)
);
```

---

### 6. **App Routing & Deep Linking** ⚠️ CRITICAL

**Requirement:** Platform must support deep linking into sub-apps

**Current Structure:**
```
/dashboard → App launcher
/applications → Applications listing
/funder → Funder portal
/notifications → Notifications center
/files → File management
/settings → Settings (defaults to profile)
/apps/capacity-assessment → CapacityIQ app
/apps/funding-framer → FundingFramer app
/apps/crm-lite → CRM app (future)
```

**Sidebar Navigation Routes:**
All sidebar navigation items use **independent top-level routes** (not nested under `/dashboard`):
- Dashboard: `/dashboard`
- Applications: `/applications`
- Funder: `/funder`
- Notifications: `/notifications`
- Files: `/files`
- Settings: `/settings`

**Dashboard Submenu:**
The Dashboard item has an expandable submenu:
- Dashboard: `/dashboard`
- App Catalog: `/applications`
- Notifications: `/notifications`

**Must Support:**
```
/apps/funding-framer/proposals → List proposals
/apps/funding-framer/proposals/new → Create proposal
/apps/funding-framer/proposals/[id] → View/edit proposal
/apps/funding-framer/opportunities → List opportunities
/apps/funding-framer/opportunities/[id] → View opportunity
/apps/capacity-assessment/assessments → List assessments
/apps/capacity-assessment/assessments/[id] → View assessment
```

**Implementation:**
- Each app has its own route namespace
- Platform layout wraps all app routes
- Shared navigation header persists
- Sidebar navigation uses independent routes (see [Sidebar Navigation Documentation](./SIDEBAR_NAVIGATION.md))
- Breadcrumbs update based on current app/page
- Deep links from notifications/search work correctly
- Active state logic prevents multiple items from being selected simultaneously

---

### 7. **Landing Page** ⚠️ MEDIUM PRIORITY

**Location:** [apps/platform-shell/src/app/page.tsx](apps/platform-shell/src/app/page.tsx)

**Current:** Basic placeholder

**Must Include:**
- Hero section:
  - Headline: "Microsoft 365 for Nonprofits"
  - Subheadline: Value proposition
  - CTA buttons: "Get Started" (→ /signup), "Sign In" (→ /login)
  - Hero image/illustration
- Features section:
  - 3-4 key features with icons
  - CapacityIQ, FundingFramer, CRM Lite highlights
- How it works (3-step process)
- Testimonials (future)
- Pricing tiers (Free, Pro, Enterprise)
- FAQ section
- Footer:
  - About, Features, Pricing, Contact links
  - Social media icons
  - Privacy Policy, Terms of Service links
  - © 2025 TwentyNine Eleven

---

### 8. **Error Pages** ⚠️ LOW PRIORITY

**Must Create:**
- [apps/platform-shell/src/app/not-found.tsx](apps/platform-shell/src/app/not-found.tsx) - 404 page
- [apps/platform-shell/src/app/error.tsx](apps/platform-shell/src/app/error.tsx) - 500 page
- [apps/platform-shell/src/app/unauthorized.tsx](apps/platform-shell/src/app/unauthorized.tsx) - 401 page

**Requirements:**
- Branded design (match platform theme)
- Helpful error messages
- Navigation back to dashboard
- Search bar (global search)
- Contact support link

---

## 🔧 Technical Requirements

### Authentication Flow

**Login Flow:**
```typescript
1. User visits /login
2. Enter email + password
3. Supabase auth.signInWithPassword()
4. If MFA enabled → show MFA prompt
5. On success → redirect to /dashboard (or ?redirectTo param)
6. If no organizations → redirect to /onboarding
```

**Signup Flow:**
```typescript
1. User visits /signup
2. Enter email + password + display name
3. Supabase auth.signUp()
4. Verification email sent
5. User clicks email link → email verified
6. Redirect to /onboarding
7. Complete onboarding → redirect to /dashboard
```

**Session Management:**
```typescript
- Middleware checks session on every request
- Refresh tokens automatically (Supabase handles this)
- Session timeout: 30 minutes idle (configurable)
- "Remember me" extends session to 30 days
- On timeout → redirect to /login with ?redirectTo
```

---

### Multi-Tenant Architecture

**Organization Context:**
```typescript
// Every authenticated request must have organization context
const { activeOrganization } = useOrganization();

// All API calls include organization ID
fetch('/api/documents', {
  headers: {
    'x-organization-id': activeOrganization.id
  }
});

// All database queries filtered by org_id (RLS handles this)
```

**RLS Policies:**
```sql
-- Every table with organization_id MUST have RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own org data"
ON table_name FOR ALL
USING (organization_id = auth.organization_id());
```

---

### Event Bus Integration

**Publishing Events:**
```typescript
import { getEventBus } from '@vision/events';

// After creating a resource
const eventBus = getEventBus();
await eventBus.publish('resource.created', 'app-name', {
  resource_id: resource.id,
  resource_name: resource.name,
  organization_id: activeOrganization.id,
});
```

**Subscribing to Events:**
```typescript
import { getEventBus } from '@vision/events';

useEffect(() => {
  const eventBus = getEventBus();

  const unsubscribe = eventBus.subscribe('resource.created', (event) => {
    // Handle event
    notifications.show({
      title: 'New Resource',
      message: event.data.resource_name,
    });
  });

  return () => unsubscribe();
}, []);
```

**Standard Events:**
```typescript
// Proposal events (FundingFramer)
'proposal.created' | 'proposal.updated' | 'proposal.submitted' | 'proposal.approved'

// Assessment events (CapacityIQ)
'assessment.created' | 'assessment.updated' | 'assessment.completed'

// Opportunity events (FundingFramer)
'opportunity.added' | 'opportunity.deadline_approaching'

// Document events (Platform)
'document.uploaded' | 'document.shared'

// Team events (Platform)
'member.added' | 'member.removed' | 'member.role_changed'
```

---

### API Route Standards

**All API routes MUST:**

1. **Authenticate user:**
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

2. **Validate organization access:**
```typescript
const orgId = request.headers.get('x-organization-id');
if (!orgId) {
  return NextResponse.json({ error: 'Organization required' }, { status: 400 });
}

// Verify user belongs to organization
const { data: membership } = await supabase
  .from('organization_members')
  .select('role')
  .eq('organization_id', orgId)
  .eq('user_id', user.id)
  .single();

if (!membership) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}
```

3. **Validate input with Zod:**
```typescript
import { z } from 'zod';

const createDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(['grant', 'financial', 'legal', 'program', 'other']),
  file: z.instanceof(File),
});

const body = await request.json();
const result = createDocumentSchema.safeParse(body);

if (!result.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: result.error.format() },
    { status: 400 }
  );
}
```

4. **Use RLS-protected queries:**
```typescript
// RLS automatically filters by organization
const { data, error } = await supabase
  .from('documents')
  .select('*')
  .eq('organization_id', orgId); // RLS enforces this
```

5. **Handle errors gracefully:**
```typescript
try {
  // ... operation
} catch (error) {
  console.error('Operation failed:', error);
  // DON'T expose internal errors
  return NextResponse.json(
    { error: 'Operation failed. Please try again.' },
    { status: 500 }
  );
}
```

---

## 🎨 UI/UX Requirements

### Design System Compliance

**All pages MUST use:**

1. **Mantine Components:**
```typescript
import {
  AppShell, Container, Stack, Group, Paper, Title, Text,
  Button, TextInput, Select, Tabs, Badge, Avatar,
  Notification, Modal, Menu, Tooltip, Loader
} from '@mantine/core';
```

2. **@vision/ui Components:**
```typescript
import {
  AppLayout, StandardCard, HeroCard, CompactCard,
  PageTitle, SectionTitle, CardTitle,
  UserMenu, OrganizationSwitcher, Breadcrumbs,
  DocumentUpload, DocumentList,
  FormTextInput, FormSelect, FormTextarea,
  DESIGN_TOKENS
} from '@vision/ui';
```

3. **Design Tokens:**
```typescript
import { DESIGN_TOKENS } from '@vision/ui';

// Use tokens for consistency
<Container size={DESIGN_TOKENS.layout.maxWidth.xl}>
  <Title
    order={1}
    size={DESIGN_TOKENS.typography.pageTitle.size}
    fw={DESIGN_TOKENS.typography.pageTitle.fw}
  >
    Page Title
  </Title>

  <Button
    size={DESIGN_TOKENS.buttons.sizes.md.size}
    variant={DESIGN_TOKENS.buttons.variants.primary}
  >
    Action
  </Button>
</Container>
```

### Responsive Design

**All pages MUST support:**
- **Mobile:** 375px - 767px (single column)
- **Tablet:** 768px - 1023px (2 columns)
- **Desktop:** 1024px+ (3 columns for grids)

**Use Mantine responsive props:**
```typescript
<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
  {/* Grid items */}
</SimpleGrid>

<Group gap={{ base: 'xs', sm: 'sm', md: 'md' }}>
  {/* Group items */}
</Group>
```

### Accessibility

**All pages MUST:**
- Pass WCAG 2.1 AA compliance
- Keyboard navigation support (Tab, Enter, Esc)
- ARIA labels for interactive elements
- Focus indicators visible
- Color contrast ratios ≥ 4.5:1
- Screen reader friendly
- Alt text for images
- Form labels associated with inputs

---

## 📊 Performance Requirements

### Page Load Targets
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1

### Optimization Strategies
1. **Use Next.js Server Components by default**
2. **Client Components only when needed** (interactivity, browser APIs)
3. **Image optimization** (next/image, AVIF/WebP formats)
4. **Code splitting** (dynamic imports for heavy components)
5. **API route caching** (Supabase query caching)
6. **Lazy load below-the-fold content**
7. **Prefetch links** (next/link with prefetch)

---

## ✅ Testing Requirements

### Unit Tests (Vitest)
**Required for:**
- All utility functions
- All hooks (useAuth, useOrganization, etc.)
- Form validation functions
- API response parsers

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, validateEmail } from './utils';

describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('validates email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Integration Tests (Playwright)
**Required for:**
- Authentication flows (login, signup, logout)
- Organization switching
- Document upload/download
- Settings page updates
- App launcher navigation

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('user can login and access dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome to VISION Platform')).toBeVisible();
});
```

### RLS Policy Tests (SQL)
**Required for:**
- All tables with organization_id
- Cross-tenant isolation verification
- Role-based access control

**Example:**
```sql
-- Test: User from org1 cannot access org2 data
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims = '{"sub": "user1-id", "org_id": "org1-id"}';

  SELECT * FROM documents WHERE organization_id = 'org2-id';
  -- Should return 0 rows
END;
```

---

## 🚀 Deployment Checklist

**Before deploying to production:**

- [ ] All P0 issues fixed (middleware auth, auto-profile, org selection)
- [ ] Onboarding flow complete and tested
- [ ] All settings pages functional
- [ ] Notification center working
- [ ] Global search working
- [ ] Funder portal complete (if applicable)
- [ ] All RLS policies deployed
- [ ] All migrations applied
- [ ] Environment variables configured
- [ ] Supabase Realtime enabled
- [ ] API rate limiting configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (PostHog/Plausible)
- [ ] SSL certificates valid
- [ ] Domain configured
- [ ] Backup strategy in place
- [ ] Monitoring dashboards setup

---

## 📋 Implementation Priority

### P0 - Critical (Week 1-2)
1. ✅ Authentication system (complete)
2. ✅ Organization management (complete)
3. ✅ App launcher (complete)
4. ⚠️ Onboarding flow (must complete)
5. ⚠️ Fix P0 security issues (middleware, auto-profile, org selection)

### P1 - High Priority (Week 3-4)
6. Notification center
7. Global search
8. Complete settings pages (profile, org, team)
9. Document management enhancements
10. Landing page

### P2 - Medium Priority (Week 5-6)
11. App subscriptions management
12. Billing integration (Stripe)
13. Funder portal (if applicable)
14. Error pages (404, 500, 401)
15. Team management advanced features

### P3 - Low Priority (Week 7-8)
16. Advanced analytics dashboard
17. Multi-language support
18. Mobile app (future)
19. API documentation
20. White-label support

---

## 🎯 Success Criteria

**Platform layer is complete when:**

- ✅ User can sign up, verify email, complete onboarding, and access dashboard
- ✅ User can switch between multiple organizations
- ✅ User can launch apps (CapacityIQ, FundingFramer) from dashboard
- ✅ User can upload, view, download, delete documents
- ✅ User can search globally across all apps and documents
- ✅ User receives real-time notifications from all apps
- ✅ User can invite team members and manage permissions
- ✅ User can update profile, organization, and app settings
- ✅ User can manage billing and view AI usage costs
- ✅ Funder can view grantee dashboard and manage cohorts
- ✅ All pages pass WCAG 2.1 AA accessibility
- ✅ All pages load in < 3 seconds
- ✅ All RLS policies prevent cross-tenant data access
- ✅ All API routes validate input and handle errors
- ✅ All unit tests pass (80%+ coverage)
- ✅ All integration tests pass (critical flows)

---

**This document is the SOURCE OF TRUTH for platform-shell implementation.**

**Last Updated:** November 12, 2025
**Next Review:** After Week 2 implementation
**Owner:** Ford Aaro / TwentyNine Eleven
