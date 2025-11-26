# Multi-App Platform Best Practices
# Enterprise-Grade Architecture Guide for VISION Platform

**Last Updated:** 2025-11-12
**Status:** Reference Guide
**Audience:** Development Team, Technical Leadership

---

## Executive Summary

This document provides comprehensive best practices for building enterprise-grade multi-app SaaS platforms, drawing from industry leaders (Microsoft 365, Google Workspace, Salesforce) and modern architectural patterns. These recommendations are specifically tailored for VISION Platform's unique requirements as a nonprofit-focused, AI-powered, multi-tenant platform.

**Key Takeaways:**
- Multi-app platforms require careful balance between app isolation and integration
- Permission systems must support organization-level, app-level, and feature-level access control
- Navigation architecture should provide context awareness while enabling seamless app switching
- Monorepo structure with shared packages is optimal for maintaining consistency
- Progressive disclosure and contextual onboarding are critical for user adoption

---

## Table of Contents

1. [Multi-App Architecture Patterns](#1-multi-app-architecture-patterns)
2. [Permission & Access Control](#2-permission--access-control)
3. [Navigation Architecture](#3-navigation-architecture)
4. [UX Best Practices](#4-ux-best-practices)
5. [Technical Implementation](#5-technical-implementation)
6. [VISION Platform Recommendations](#6-vision-platform-recommendations)

---

## 1. Multi-App Architecture Patterns

### 1.1 Monorepo Structure for Multi-App Platforms

**Industry Standard (2025):**
Large tech companies (Google, Meta, Microsoft, Uber, Airbnb, Twitter) all employ monorepos for multi-app platforms because they enable:
- Centralized dependency management across all apps
- Shared code and component libraries
- Atomic cross-app changes
- Consistent tooling and standards
- Easier refactoring and maintenance

**VISION Platform Structure:**

```
vision-platform/
├── apps/                          # Individual applications (micro-frontends)
│   ├── platform-shell/            # App launcher & global shell
│   ├── capacity-assessment/       # CapacityIQ
│   ├── funding-framer/            # Grant management
│   ├── crm-lite/                  # Donor CRM
│   ├── impact-tracker/            # Outcomes
│   ├── compliance-hub/            # Regulatory
│   ├── board-portal/              # Governance
│   ├── event-manager/             # Events/Volunteers
│   └── funder-portal/             # Funder dashboard
│
├── packages/                      # Shared packages (the glue)
│   ├── ui/                        # Component library
│   ├── database/                  # Data access layer
│   ├── documents/                 # Document management
│   ├── ai-functions/              # AI utilities
│   ├── auth/                      # Authentication
│   ├── utils/                     # Shared utilities
│   └── config/                    # Shared configs
│
├── supabase/                      # Backend services
│   ├── functions/                 # Edge functions
│   ├── migrations/                # Database schema
│   └── seed/                      # Seed data
```

**Key Principles:**
1. **App Independence:** Each app in `apps/` can be developed, tested, and deployed independently
2. **Shared Foundation:** All apps use common packages for consistency
3. **Clear Boundaries:** Apps don't directly access each other's code (only through shared packages)
4. **Single Source of Truth:** Shared packages define contracts between apps

### 1.2 App Launcher Patterns

**Microsoft 365 Pattern:**
- Waffle menu (app launcher icon) in top-left corner
- Grid view of all available apps
- Search functionality for quick access
- Recent apps shown first
- Favorites/pinning capability
- Consistent across all apps

**Google Workspace Pattern:**
- App switcher in top-right corner
- Icon-based grid layout
- Direct links to web apps
- Seamless context switching
- Apps open in same browser tab (maintaining context)

**Salesforce Pattern:**
- App Launcher button opens full-screen modal
- Search-first approach
- Apps grouped by category
- "All Apps" vs "Recent" views
- User permissions determine visibility
- Role-based app access

**Best Practices Synthesis:**
```typescript
// Platform Shell - App Launcher Component
interface AppLauncherProps {
  apps: App[]
  recentApps: App[]
  favoriteApps: App[]
  userPermissions: Permission[]
}

interface App {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string
  category: AppCategory
  requiredPermission?: string
  isNew?: boolean
  isBeta?: boolean
}

// Example implementation
const AppLauncher = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AppLauncherIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        {/* Search */}
        <CommandInput placeholder="Search apps..." />

        {/* Recent Apps */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Recent</DropdownMenuLabel>
          {recentApps.map(app => (
            <AppMenuItem key={app.id} app={app} />
          ))}
        </DropdownMenuGroup>

        {/* Favorites */}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Favorites</DropdownMenuLabel>
          {favoriteApps.map(app => (
            <AppMenuItem key={app.id} app={app} />
          ))}
        </DropdownMenuGroup>

        {/* All Apps by Category */}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>All Apps</DropdownMenuLabel>
          {groupedApps.map(group => (
            <DropdownMenuSub key={group.category}>
              <DropdownMenuSubTrigger>
                {group.category}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {group.apps.map(app => (
                  <AppMenuItem key={app.id} app={app} />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 1.3 Module/App Isolation vs Integration

**Isolation Strategy:**
- Each app is independently deployable
- Apps have their own routes (`/capacity-assessment/*`, `/funding-framer/*`)
- Local state is app-specific
- Business logic is encapsulated

**Integration Points:**
- Shared UI components from `packages/ui`
- Shared data access through `packages/database`
- Shared authentication state via `packages/auth`
- Cross-app data through database views (not direct table access)

**Integration Patterns:**

```typescript
// ❌ BAD: Direct app-to-app dependency
// apps/funding-framer/src/components/ProposalEditor.tsx
import { getAssessmentData } from '../../../capacity-assessment/src/lib/assessments'

// ✅ GOOD: Shared package provides the contract
// packages/database/src/views/organization-context.ts
export async function getOrganizationContext(orgId: string) {
  return supabase
    .from('organization_profiles_view') // Shared view
    .select('*')
    .eq('id', orgId)
    .single()
}

// apps/funding-framer/src/components/ProposalEditor.tsx
import { getOrganizationContext } from '@vision/database'

const ProposalEditor = () => {
  const { data: context } = useQuery({
    queryKey: ['org-context', orgId],
    queryFn: () => getOrganizationContext(orgId)
  })

  // Context includes data from multiple apps:
  // - Latest assessment score (from CapacityIQ)
  // - Total grants submitted (from FundingFramer)
  // - Donor statistics (from CRM Lite)
  // - Impact metrics (from ImpactTracker)
}
```

**Database Integration Pattern:**

```sql
-- Shared view aggregates data from multiple apps
CREATE VIEW organization_profiles_view AS
SELECT
  o.id,
  o.name,
  o.mission,
  o.budget_size,

  -- From CapacityIQ
  a.latest_score as capacity_score,
  a.assessment_date,

  -- From FundingFramer
  g.grants_submitted,
  g.grants_awarded,
  g.total_funding,

  -- From CRM Lite
  c.total_donations,
  c.active_donors,

  -- From ImpactTracker
  i.impact_score,
  i.outcomes_tracked

FROM organizations o
LEFT JOIN LATERAL (
  SELECT score as latest_score, created_at as assessment_date
  FROM assessments
  WHERE org_id = o.id
  ORDER BY created_at DESC
  LIMIT 1
) a ON true
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE status = 'submitted') as grants_submitted,
    COUNT(*) FILTER (WHERE status = 'awarded') as grants_awarded,
    SUM(amount) FILTER (WHERE status = 'awarded') as total_funding
  FROM proposals
  WHERE org_id = o.id
) g ON true
LEFT JOIN LATERAL (
  SELECT
    SUM(amount) as total_donations,
    COUNT(DISTINCT contact_id) as active_donors
  FROM donations
  WHERE org_id = o.id
    AND date > NOW() - INTERVAL '12 months'
) c ON true
LEFT JOIN LATERAL (
  SELECT AVG(score) as impact_score, COUNT(*) as outcomes_tracked
  FROM outcomes
  WHERE org_id = o.id
    AND recorded_at > NOW() - INTERVAL '12 months'
) i ON true;

-- Enable RLS on the view
ALTER VIEW organization_profiles_view SET (security_barrier = true);

-- RLS policy
CREATE POLICY "Users can only see their org profile"
ON organization_profiles_view
FOR SELECT
USING (id = auth.organization_id());
```

### 1.4 Shared vs App-Specific Navigation

**Global Navigation (Always Visible):**
- App launcher/switcher
- Organization selector (for multi-org users)
- User profile menu
- Global search
- Notification center
- Help/support

**App-Specific Navigation (Contextual):**
- App-level sidebar or top nav
- App-specific actions
- Local search within app
- App settings

**Example Layout Structure:**

```typescript
// packages/ui/src/layouts/PlatformLayout.tsx
export const PlatformLayout = ({
  appName,
  appColor,
  children
}: PlatformLayoutProps) => {
  return (
    <div className="flex h-screen">
      {/* Global Navigation Bar */}
      <GlobalNavBar>
        <AppLauncher />
        <OrganizationSwitcher />
        <GlobalSearch />
        <NotificationCenter />
        <UserMenu />
      </GlobalNavBar>

      {/* App Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* App-Specific Sidebar */}
        <AppSidebar appName={appName} color={appColor} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs />

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  )
}

// Usage in an app
// apps/funding-framer/src/app/layout.tsx
export default function FundingFramerLayout({ children }) {
  return (
    <PlatformLayout appName="FundingFramer" appColor="blue">
      {children}
    </PlatformLayout>
  )
}
```

---

## 2. Permission & Access Control

### 2.1 Multi-Layer Permission Architecture

Enterprise SaaS platforms require multiple layers of permissions:

**Layer 1: Organization-Level Access**
- Which organizations can a user access?
- What role do they have in each organization?

**Layer 2: App-Level Access**
- Which apps can this organization access? (subscription tier)
- Which apps can this user access within their organization? (role-based)

**Layer 3: Feature-Level Access**
- Within an app, which features can this user access?
- Admin-only features, role-specific features

**Layer 4: Data-Level Access**
- Which specific records can this user view/edit?
- Row Level Security (RLS) in database

### 2.2 Role-Based Access Control (RBAC) Best Practices

**Standard Role Hierarchy:**

```typescript
// packages/auth/src/types/roles.ts
export enum OrganizationRole {
  OWNER = 'owner',           // Full control, billing access
  ADMIN = 'admin',           // Full app access, user management
  MANAGER = 'manager',       // Edit access to most features
  MEMBER = 'member',         // Standard user access
  VIEWER = 'viewer',         // Read-only access
  FUNDER = 'funder',         // Special role for funder portal users
}

export enum AppPermission {
  // CapacityIQ
  'capacity:view' = 'capacity:view',
  'capacity:create' = 'capacity:create',
  'capacity:edit' = 'capacity:edit',
  'capacity:delete' = 'capacity:delete',

  // FundingFramer
  'grants:view' = 'grants:view',
  'grants:create' = 'grants:create',
  'grants:edit' = 'grants:edit',
  'grants:submit' = 'grants:submit',
  'grants:approve' = 'grants:approve',

  // CRM Lite
  'crm:view' = 'crm:view',
  'crm:edit' = 'crm:edit',
  'crm:export' = 'crm:export',

  // ImpactTracker
  'impact:view' = 'impact:view',
  'impact:edit' = 'impact:edit',

  // ComplianceHub
  'compliance:view' = 'compliance:view',
  'compliance:edit' = 'compliance:edit',

  // BoardPortal
  'board:view' = 'board:view',
  'board:manage' = 'board:manage',

  // EventManager
  'events:view' = 'events:view',
  'events:manage' = 'events:manage',

  // Settings
  'org:settings' = 'org:settings',
  'org:users' = 'org:users',
  'org:billing' = 'org:billing',
}

// Role-to-Permission mapping
export const ROLE_PERMISSIONS: Record<OrganizationRole, AppPermission[]> = {
  [OrganizationRole.OWNER]: [
    // Full access to everything
    ...Object.values(AppPermission)
  ],

  [OrganizationRole.ADMIN]: [
    // All app permissions, except billing
    ...Object.values(AppPermission).filter(p => !p.includes('billing'))
  ],

  [OrganizationRole.MANAGER]: [
    // Edit access to most apps
    'capacity:view', 'capacity:edit',
    'grants:view', 'grants:create', 'grants:edit',
    'crm:view', 'crm:edit',
    'impact:view', 'impact:edit',
    'compliance:view', 'compliance:edit',
    'events:view', 'events:manage',
  ],

  [OrganizationRole.MEMBER]: [
    // Standard user access
    'capacity:view',
    'grants:view', 'grants:create',
    'crm:view',
    'impact:view',
    'compliance:view',
    'events:view',
  ],

  [OrganizationRole.VIEWER]: [
    // Read-only
    'capacity:view',
    'grants:view',
    'crm:view',
    'impact:view',
    'compliance:view',
    'board:view',
    'events:view',
  ],

  [OrganizationRole.FUNDER]: [
    // Limited access to grantee data
    'capacity:view',
    'grants:view',
    'impact:view',
  ],
}
```

### 2.3 Subscription Tier-Based App Access

**Best Practice:** Combine RBAC with feature flags for subscription tiers.

```typescript
// packages/auth/src/types/subscriptions.ts
export enum SubscriptionTier {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export const TIER_APP_ACCESS: Record<SubscriptionTier, string[]> = {
  [SubscriptionTier.FREE]: [
    'capacity-assessment',  // Limited assessments
  ],

  [SubscriptionTier.STARTER]: [
    'capacity-assessment',
    'funding-framer',       // Limited proposals
    'document-library',
  ],

  [SubscriptionTier.PROFESSIONAL]: [
    'capacity-assessment',
    'funding-framer',
    'crm-lite',
    'impact-tracker',
    'compliance-hub',
    'document-library',
  ],

  [SubscriptionTier.ENTERPRISE]: [
    // All apps
    'capacity-assessment',
    'funding-framer',
    'crm-lite',
    'impact-tracker',
    'compliance-hub',
    'board-portal',
    'event-manager',
    'document-library',
  ],
}

// Feature limits by tier
export const TIER_LIMITS: Record<SubscriptionTier, Record<string, number>> = {
  [SubscriptionTier.FREE]: {
    assessments_per_year: 1,
    grant_proposals: 5,
    users: 1,
    storage_gb: 1,
    ai_requests_per_month: 10,
  },

  [SubscriptionTier.STARTER]: {
    assessments_per_year: 4,
    grant_proposals: 25,
    users: 5,
    storage_gb: 10,
    ai_requests_per_month: 100,
  },

  [SubscriptionTier.PROFESSIONAL]: {
    assessments_per_year: 999,  // Unlimited
    grant_proposals: 999,        // Unlimited
    users: 15,
    storage_gb: 50,
    ai_requests_per_month: 500,
  },

  [SubscriptionTier.ENTERPRISE]: {
    assessments_per_year: 999,
    grant_proposals: 999,
    users: 999,                  // Unlimited
    storage_gb: 250,
    ai_requests_per_month: 2000,
  },
}
```

### 2.4 Permission Checking Patterns

**Frontend Permission Checks:**

```typescript
// packages/auth/src/hooks/usePermissions.ts
export function usePermissions() {
  const { user, organization } = useAuthStore()

  const hasPermission = useCallback((permission: AppPermission) => {
    if (!user || !organization) return false

    const userRole = user.role_in_org
    const allowedPermissions = ROLE_PERMISSIONS[userRole] || []

    return allowedPermissions.includes(permission)
  }, [user, organization])

  const hasAppAccess = useCallback((appSlug: string) => {
    if (!organization) return false

    const tier = organization.subscription_tier
    const allowedApps = TIER_APP_ACCESS[tier] || []

    return allowedApps.includes(appSlug)
  }, [organization])

  const canAccessFeature = useCallback((feature: string) => {
    // Check both permissions and feature flags
    return hasPermission(feature as AppPermission) &&
           hasFeatureEnabled(feature)
  }, [hasPermission])

  return {
    hasPermission,
    hasAppAccess,
    canAccessFeature,
  }
}

// Usage in component
const GrantProposalEditor = () => {
  const { hasPermission } = usePermissions()

  const canEdit = hasPermission('grants:edit')
  const canSubmit = hasPermission('grants:submit')

  return (
    <div>
      <ProposalContent />

      {canEdit && (
        <Button onClick={handleEdit}>Edit</Button>
      )}

      {canSubmit && (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
    </div>
  )
}
```

**Backend Permission Checks (RLS):**

```sql
-- Row Level Security for multi-tenant isolation
-- packages/database/migrations/001_rls_setup.sql

-- Enable RLS on all tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Helper function to get current user's organization
CREATE FUNCTION auth.user_organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id
  FROM user_organizations
  WHERE user_id = auth.uid()
    AND status = 'active'
  LIMIT 1;
$$;

-- Helper function to check user role
CREATE FUNCTION auth.user_has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_organizations
    WHERE user_id = auth.uid()
      AND org_id = auth.user_organization_id()
      AND role::text = required_role
  );
$$;

-- Example RLS policy: Users can only see their org's assessments
CREATE POLICY "Users can view their org assessments"
ON assessments
FOR SELECT
USING (org_id = auth.user_organization_id());

-- Example RLS policy: Only admins can delete assessments
CREATE POLICY "Only admins can delete assessments"
ON assessments
FOR DELETE
USING (
  org_id = auth.user_organization_id()
  AND (
    auth.user_has_role('admin')
    OR auth.user_has_role('owner')
  )
);

-- Funder cross-organization access
CREATE POLICY "Funders can view grantee assessments"
ON assessments
FOR SELECT
USING (
  org_id IN (
    SELECT grantee_org_id
    FROM funder_access
    WHERE funder_org_id = auth.user_organization_id()
      AND 'capacity:view' = ANY(permissions)
      AND status = 'active'
  )
);
```

### 2.5 Custom Roles for Enterprise Customers

**Best Practice from Industry:**
Enterprise customers often need custom roles beyond standard RBAC. Implement a flexible permission system that allows:
- Creating custom roles
- Assigning specific permissions to custom roles
- Tenant-defined roles stored in database

```typescript
// Database schema for custom roles
interface CustomRole {
  id: string
  org_id: string
  name: string                    // e.g., "Grant Writer"
  description: string
  permissions: AppPermission[]    // Array of permission strings
  is_system_role: boolean         // false for custom roles
  created_at: Date
  updated_at: Date
}

// User assignment
interface UserOrganization {
  user_id: string
  org_id: string
  system_role: OrganizationRole   // Standard role
  custom_role_id?: string         // Optional custom role
  status: 'active' | 'invited' | 'suspended'
}

// Permission resolution
function getUserPermissions(userId: string, orgId: string): AppPermission[] {
  const userOrg = getUserOrganization(userId, orgId)

  // Start with system role permissions
  let permissions = ROLE_PERMISSIONS[userOrg.system_role]

  // Add custom role permissions if assigned
  if (userOrg.custom_role_id) {
    const customRole = getCustomRole(userOrg.custom_role_id)
    permissions = [...permissions, ...customRole.permissions]
  }

  // Deduplicate
  return [...new Set(permissions)]
}
```

### 2.6 Admin Controls for Managing App Access

**Enterprise Feature:** Organization admins should be able to:
- Enable/disable apps for their organization
- Control which users can access which apps
- Set app-specific permissions per user
- View audit logs of app access

```typescript
// Admin UI Component
const AppAccessManagement = () => {
  const { organization } = useAuthStore()
  const { data: apps } = useQuery({
    queryKey: ['org-apps', organization.id],
    queryFn: () => getOrganizationApps(organization.id)
  })

  return (
    <div>
      <h2>Manage App Access</h2>

      {apps.map(app => (
        <AppAccessCard key={app.id} app={app}>
          {/* Toggle app enabled/disabled */}
          <Switch
            checked={app.enabled}
            onCheckedChange={(enabled) => toggleApp(app.id, enabled)}
          />

          {/* Configure per-user access */}
          <UserAppAccessTable appId={app.id} />
        </AppAccessCard>
      ))}
    </div>
  )
}
```

---

## 3. Navigation Architecture

### 3.1 Global vs App-Specific Navigation

**Best Practice:** Use a three-tier navigation structure:

1. **Platform Navigation** (Global - Always Visible)
2. **App Navigation** (App-Specific - Contextual)
3. **Page Navigation** (Breadcrumbs - Hierarchical)

**Visual Hierarchy:**

```
┌────────────────────────────────────────────────────────────┐
│ [Logo] [AppLauncher] [GlobalSearch] [Notifications] [User]│ ← Platform Nav
├───────┬────────────────────────────────────────────────────┤
│       │ [Breadcrumbs: Home > Grants > Proposals]          │ ← Breadcrumbs
│  App  ├────────────────────────────────────────────────────┤
│  Nav  │                                                    │
│       │              Main Content Area                     │
│ [📊]  │                                                    │
│ [📝]  │                                                    │
│ [⚙️]  │                                                    │
│       │                                                    │
└───────┴────────────────────────────────────────────────────┘
```

### 3.2 Breadcrumb Patterns for Multi-Level Navigation

**Industry Best Practices:**

1. **Path Breadcrumbs** - Show hierarchy of pages
2. **Attribute Breadcrumbs** - Show characteristics of current object
3. **Interactive Breadcrumbs** - Allow quick navigation to siblings

```typescript
// packages/ui/src/components/navigation/Breadcrumbs.tsx
interface Breadcrumb {
  label: string
  href?: string
  icon?: ReactNode
  isCurrentPage?: boolean

  // For interactive breadcrumbs
  siblings?: Breadcrumb[]  // Sibling pages at same level
  actions?: BreadcrumbAction[]
}

interface BreadcrumbAction {
  label: string
  icon: ReactNode
  onClick: () => void
}

// Example usage in FundingFramer
const ProposalDetailPage = ({ proposalId }) => {
  const { data: proposal } = useProposal(proposalId)
  const { data: proposals } = useProposals() // For siblings

  const breadcrumbs: Breadcrumb[] = [
    {
      label: 'Home',
      href: '/funding-framer',
      icon: <HomeIcon />
    },
    {
      label: 'Proposals',
      href: '/funding-framer/proposals',
      // Siblings: Other top-level pages
      siblings: [
        { label: 'Opportunities', href: '/funding-framer/opportunities' },
        { label: 'Applications', href: '/funding-framer/applications' },
        { label: 'Reports', href: '/funding-framer/reports' },
      ]
    },
    {
      label: proposal.title,
      isCurrentPage: true,
      // Siblings: Other proposals
      siblings: proposals.map(p => ({
        label: p.title,
        href: `/funding-framer/proposals/${p.id}`
      })),
      // Actions on current proposal
      actions: [
        { label: 'Edit', icon: <EditIcon />, onClick: handleEdit },
        { label: 'Duplicate', icon: <CopyIcon />, onClick: handleDuplicate },
        { label: 'Delete', icon: <TrashIcon />, onClick: handleDelete },
      ]
    }
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <ProposalContent proposal={proposal} />
    </div>
  )
}
```

**Implementation with Dropdown Navigation:**

```typescript
const Breadcrumbs = ({ items }: { items: Breadcrumb[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <ChevronRightIcon className="w-4 h-4" />}

          <BreadcrumbItem
            item={item}
            isLast={index === items.length - 1}
          />
        </Fragment>
      ))}
    </nav>
  )
}

const BreadcrumbItem = ({ item, isLast }: BreadcrumbItemProps) => {
  const hasSiblings = item.siblings && item.siblings.length > 0
  const hasActions = item.actions && item.actions.length > 0

  // Interactive breadcrumb with dropdown
  if (hasSiblings || hasActions) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {item.icon}
            <span>{item.label}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {/* Current item actions */}
          {hasActions && (
            <>
              {item.actions.map(action => (
                <DropdownMenuItem
                  key={action.label}
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Sibling navigation */}
          {hasSiblings && (
            <>
              <DropdownMenuLabel>Switch to:</DropdownMenuLabel>
              {item.siblings.map(sibling => (
                <DropdownMenuItem key={sibling.label} asChild>
                  <Link href={sibling.href}>
                    {sibling.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Simple breadcrumb link
  if (item.href && !isLast) {
    return (
      <Link href={item.href} className="hover:underline">
        {item.icon}
        <span>{item.label}</span>
      </Link>
    )
  }

  // Current page (not linked)
  return (
    <span className="font-medium">
      {item.icon}
      {item.label}
    </span>
  )
}
```

### 3.3 Context Switching Between Apps

**Preserve User Context When Switching:**

```typescript
// packages/auth/src/stores/navigation-store.ts
interface NavigationContext {
  previousApp?: string
  previousRoute?: string
  returnContext?: any       // Data to restore when returning
  breadcrumbTrail?: string[] // Full navigation path
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  context: {},

  // Save context before switching apps
  saveContext: (appSlug: string, route: string, data?: any) => {
    set({
      context: {
        previousApp: appSlug,
        previousRoute: route,
        returnContext: data,
        breadcrumbTrail: [...get().context.breadcrumbTrail || [], route]
      }
    })
  },

  // Return to previous app with context restored
  returnToPrevious: () => {
    const { previousApp, previousRoute, returnContext } = get().context

    if (previousApp && previousRoute) {
      // Navigate and restore context
      router.push(previousRoute)
      // Trigger context restoration in target app
      window.postMessage({
        type: 'RESTORE_CONTEXT',
        data: returnContext
      }, '*')
    }
  }
}))

// Usage: Cross-app workflow
const GrantProposalEditor = () => {
  const { saveContext } = useNavigationStore()
  const router = useRouter()

  const handleOpenAssessmentData = () => {
    // Save current context
    saveContext('funding-framer', router.asPath, {
      proposalId: proposal.id,
      section: 'capacity-narrative'
    })

    // Navigate to assessment app
    router.push('/capacity-assessment/latest')
  }

  const handleReturnFromAssessment = () => {
    const { returnToPrevious } = useNavigationStore()
    returnToPrevious()
  }

  return (
    <div>
      <Button onClick={handleOpenAssessmentData}>
        View Assessment Data
      </Button>
    </div>
  )
}
```

### 3.4 Persistent vs Contextual Navigation

**Persistent Navigation (Always Visible):**
- App launcher
- Global search
- Notifications
- User menu
- Organization switcher

**Contextual Navigation (Changes by App/Page):**
- App sidebar
- Secondary navigation
- Tabs
- Action buttons

**Best Practice:** Keep persistent navigation minimal to maximize content space.

```typescript
// packages/ui/src/layouts/AppLayout.tsx
const AppLayout = ({ app, children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Persistent: Thin left bar with app launcher */}
      <PersistentNavBar collapsed={sidebarCollapsed}>
        <AppLauncherButton />
        <NotificationBadge />
        <UserAvatar />
      </PersistentNavBar>

      {/* Contextual: Collapsible app sidebar */}
      <AppSidebar
        app={app}
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
      >
        <AppNavItems app={app} />
      </AppSidebar>

      {/* Main content */}
      <MainContent>
        {children}
      </MainContent>
    </div>
  )
}
```

---

## 4. UX Best Practices

### 4.1 Consistent Experience Across Apps

**Design System Approach:**

All apps must use the shared component library (`packages/ui`) to ensure:
- Consistent visual language
- Predictable interactions
- Reduced cognitive load
- Faster development

**Key Consistency Elements:**

```typescript
// packages/ui/src/design-tokens.ts
export const designTokens = {
  // Colors (consistent across all apps)
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    // App-specific colors
    apps: {
      capacityAssessment: 'hsl(265, 90%, 60%)', // Purple
      fundingFramer: 'hsl(210, 90%, 55%)',      // Blue
      crmLite: 'hsl(150, 70%, 45%)',            // Green
      impactTracker: 'hsl(25, 90%, 55%)',       // Orange
      complianceHub: 'hsl(350, 85%, 60%)',      // Red
      boardPortal: 'hsl(280, 70%, 50%)',        // Deep purple
      eventManager: 'hsl(190, 85%, 50%)',       // Cyan
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    }
  },

  // Spacing (8px grid)
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
  },

  // Consistent component patterns
  components: {
    button: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
      },
      borderRadius: '0.375rem',
    },
    input: {
      height: '2.5rem',
      borderRadius: '0.375rem',
    },
    card: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
    }
  }
}
```

**App Identification Pattern:**

```typescript
// Each app has consistent visual identification
interface AppTheme {
  name: string
  slug: string
  color: string          // Primary color for app
  icon: ReactNode        // App icon
  accentColor: string    // Secondary color
}

// Usage in app header
const AppHeader = ({ app }: { app: AppTheme }) => {
  return (
    <header
      className="border-b"
      style={{
        borderTopColor: app.color,
        borderTopWidth: '3px'
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-10 h-10 rounded flex items-center justify-center"
          style={{ backgroundColor: app.color }}
        >
          {app.icon}
        </div>
        <h1 className="text-xl font-semibold">{app.name}</h1>
      </div>
    </header>
  )
}
```

### 4.2 App Switching Patterns

**Best Practice from Microsoft 365:**
- Maintain user's place when switching apps
- Show loading states during app transitions
- Preload frequently-used apps
- Cache app state

```typescript
// packages/ui/src/components/AppLauncher.tsx
const AppLauncher = () => {
  const [apps] = useApps()
  const { prefetchApp } = usePrefetch()
  const router = useRouter()

  const handleAppHover = (appSlug: string) => {
    // Prefetch app on hover for instant switching
    prefetchApp(appSlug)
  }

  const handleAppClick = async (appSlug: string) => {
    // Show loading state
    showAppTransitionLoader(appSlug)

    // Navigate to app
    await router.push(`/${appSlug}`)

    // Hide loader
    hideAppTransitionLoader()
  }

  return (
    <DropdownMenu>
      <DropdownMenuContent>
        {apps.map(app => (
          <DropdownMenuItem
            key={app.slug}
            onMouseEnter={() => handleAppHover(app.slug)}
            onClick={() => handleAppClick(app.slug)}
          >
            <AppIcon app={app} />
            <span>{app.name}</span>
            {app.hasUnreadNotifications && <Badge>New</Badge>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 4.3 User Onboarding for Multi-App Platforms

**Progressive Disclosure Strategy:**

**Stage 1: Platform Orientation (First Login)**
- Show platform overview
- Introduce app launcher
- Explain primary apps available
- Set up organization profile

**Stage 2: App-Specific Onboarding (First App Visit)**
- Brief tour of app capabilities
- Empty state guidance
- Quick start actions
- Sample data option

**Stage 3: Feature Discovery (As Needed)**
- Contextual tooltips
- In-app announcements for new features
- Suggested workflows

```typescript
// packages/ui/src/components/Onboarding/PlatformTour.tsx
const PlatformTour = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { organization } = useAuthStore()

  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="app-launcher"]',
      title: 'Welcome to VISION Platform',
      content: 'This is your app launcher. Click here anytime to switch between apps.',
      placement: 'right'
    },
    {
      target: '[data-tour="global-search"]',
      title: 'Global Search',
      content: 'Search across all your documents, grants, and contacts from anywhere.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="first-app"]',
      title: 'Your First App',
      content: 'Let\'s start with CapacityIQ to assess your organization\'s strengths.',
      placement: 'left'
    }
  ]

  return (
    <Joyride
      steps={tourSteps}
      run={!organization.has_completed_onboarding}
      continuous
      showProgress
      showSkipButton
      callback={handleTourCallback}
    />
  )
}

// App-specific onboarding
const FundingFramerOnboarding = () => {
  const { data: proposals } = useProposals()
  const hasProposals = proposals && proposals.length > 0

  // Show empty state with guidance
  if (!hasProposals) {
    return (
      <EmptyState
        icon={<DocumentPlusIcon />}
        title="Welcome to FundingFramer"
        description="AI-powered grant writing to help you secure more funding."
        actions={[
          {
            label: 'Create Your First Proposal',
            variant: 'primary',
            onClick: handleCreateFirstProposal
          },
          {
            label: 'Take a Quick Tour',
            variant: 'secondary',
            onClick: handleStartTour
          },
          {
            label: 'Load Sample Data',
            variant: 'ghost',
            onClick: handleLoadSampleData
          }
        ]}
      />
    )
  }

  return <ProposalList proposals={proposals} />
}
```

### 4.4 Progressive Disclosure Patterns

**Best Practice:** Don't overwhelm users with all features at once.

**Implementation Patterns:**

1. **Staged Forms** - Multi-step flows with clear progress
2. **Expandable Sections** - Collapse advanced options
3. **Empty States** - Guide users to first actions
4. **Contextual Help** - Show help when needed, hide when not
5. **Smart Defaults** - Pre-fill with intelligent defaults

```typescript
// Example: Multi-step grant proposal creation
const CreateProposalWizard = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Proposal>>({})

  const steps = [
    {
      title: 'Basic Information',
      description: 'Grant opportunity details',
      component: <BasicInfoStep data={formData} onChange={setFormData} />
    },
    {
      title: 'Organization Story',
      description: 'Your mission and impact',
      component: <OrganizationStoryStep data={formData} onChange={setFormData} />
    },
    {
      title: 'Project Details',
      description: 'What you\'ll do with the funding',
      component: <ProjectDetailsStep data={formData} onChange={setFormData} />
    },
    {
      title: 'Budget',
      description: 'How funds will be used',
      component: <BudgetStep data={formData} onChange={setFormData} />
    },
    {
      title: 'Review & Generate',
      description: 'AI will draft your proposal',
      component: <ReviewStep data={formData} />
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <StepProgress steps={steps} currentStep={step} />

      {/* Current step content */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{steps[step - 1].title}</CardTitle>
          <CardDescription>{steps[step - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {steps[step - 1].component}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>

          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === steps.length}
          >
            {step === steps.length ? 'Generate Proposal' : 'Next'}
          </Button>
        </CardFooter>
      </Card>

      {/* Optional: Collapsible advanced options */}
      <Collapsible className="mt-4">
        <CollapsibleTrigger>
          <Button variant="ghost" size="sm">
            Advanced Options
            <ChevronDownIcon />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <AdvancedOptionsForm />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
```

### 4.5 Contextual Help and Guidance

**Tiered Help System:**

1. **Inline Help** - Tooltips, helper text
2. **Contextual Panels** - Side panels with relevant docs
3. **Interactive Guides** - Step-by-step walkthroughs
4. **Help Center** - Searchable documentation
5. **AI Assistant** - Natural language help

```typescript
// packages/ui/src/components/Help/ContextualHelp.tsx
const ContextualHelp = ({ topic }: { topic: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: helpContent } = useHelpContent(topic)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircleIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>{helpContent.title}</SheetTitle>
          <SheetDescription>
            Quick guide to help you with this feature
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Quick tips */}
          <div>
            <h4 className="font-medium mb-2">Quick Tips</h4>
            <ul className="space-y-2">
              {helpContent.tips.map(tip => (
                <li key={tip} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Video tutorial */}
          {helpContent.videoUrl && (
            <div>
              <h4 className="font-medium mb-2">Video Tutorial</h4>
              <video src={helpContent.videoUrl} controls />
            </div>
          )}

          {/* Related articles */}
          <div>
            <h4 className="font-medium mb-2">Related Articles</h4>
            <ul className="space-y-2">
              {helpContent.relatedArticles.map(article => (
                <li key={article.slug}>
                  <Link
                    href={`/help/${article.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Assistant */}
          <Separator />
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openAIAssistant(topic)}
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 5. Technical Implementation

### 5.1 Route Structure for Multi-App Platforms

**URL Structure Best Practice:**

```
Format: /[app-slug]/[feature]/[resource-id]/[action]

Examples:
/capacity-assessment/assessments/new
/capacity-assessment/assessments/abc123/results
/funding-framer/proposals
/funding-framer/proposals/def456/edit
/funding-framer/opportunities
/crm-lite/contacts
/crm-lite/contacts/ghi789
/impact-tracker/metrics
/compliance-hub/deadlines
```

**Next.js App Router Implementation:**

```
apps/funding-framer/src/app/
├── layout.tsx                    # App-level layout
├── page.tsx                      # /funding-framer (dashboard)
├── proposals/
│   ├── layout.tsx               # Proposals section layout
│   ├── page.tsx                 # /funding-framer/proposals (list)
│   ├── new/
│   │   └── page.tsx            # /funding-framer/proposals/new
│   └── [id]/
│       ├── page.tsx            # /funding-framer/proposals/[id] (view)
│       ├── edit/
│       │   └── page.tsx        # /funding-framer/proposals/[id]/edit
│       └── versions/
│           └── page.tsx        # /funding-framer/proposals/[id]/versions
├── opportunities/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── applications/
│   └── page.tsx
└── settings/
    └── page.tsx
```

**Route Organization Pattern:**

```typescript
// packages/config/src/routes.ts
export const APP_ROUTES = {
  platformShell: {
    home: '/',
    apps: '/apps',
    settings: '/settings',
  },

  capacityAssessment: {
    home: '/capacity-assessment',
    assessments: '/capacity-assessment/assessments',
    newAssessment: '/capacity-assessment/assessments/new',
    assessmentDetail: (id: string) => `/capacity-assessment/assessments/${id}`,
    results: (id: string) => `/capacity-assessment/assessments/${id}/results`,
    benchmarks: '/capacity-assessment/benchmarks',
  },

  fundingFramer: {
    home: '/funding-framer',
    proposals: '/funding-framer/proposals',
    newProposal: '/funding-framer/proposals/new',
    proposalDetail: (id: string) => `/funding-framer/proposals/${id}`,
    editProposal: (id: string) => `/funding-framer/proposals/${id}/edit`,
    opportunities: '/funding-framer/opportunities',
    applications: '/funding-framer/applications',
  },

  // ... other apps
} as const

// Type-safe navigation helper
export function getRoute<T extends keyof typeof APP_ROUTES>(
  app: T,
  route: keyof typeof APP_ROUTES[T],
  ...args: any[]
): string {
  const routeValue = APP_ROUTES[app][route]

  if (typeof routeValue === 'function') {
    return routeValue(...args)
  }

  return routeValue as string
}

// Usage
const proposalRoute = getRoute('fundingFramer', 'proposalDetail', 'abc123')
// Returns: "/funding-framer/proposals/abc123"
```

### 5.2 State Management Across Apps

**Separation of Concerns:**

- **Global State** (Cross-app): User, organization, authentication
- **App State** (App-specific): Current app's data and UI state
- **Shared State** (Between apps): Rarely needed, use URL params or localStorage

```typescript
// packages/auth/src/stores/auth-store.ts (Global)
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganization: (organization) => set({ organization }),
  logout: () => set({ user: null, organization: null, isAuthenticated: false })
}))

// apps/funding-framer/src/stores/proposal-store.ts (App-specific)
export const useProposalStore = create<ProposalState>((set) => ({
  currentProposal: null,
  drafts: [],

  setCurrentProposal: (proposal) => set({ currentProposal: proposal }),
  saveDraft: (draft) => set((state) => ({
    drafts: [...state.drafts, draft]
  })),
  clearDrafts: () => set({ drafts: [] })
}))

// Usage in component
const ProposalEditor = () => {
  const { user, organization } = useAuthStore()     // Global state
  const { currentProposal, saveDraft } = useProposalStore()  // App state

  // Server state (TanStack Query)
  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals', organization.id],
    queryFn: () => fetchProposals(organization.id),
    enabled: !!organization
  })

  return (
    // Component JSX
  )
}
```

**State Persistence Strategy:**

```typescript
// packages/utils/src/storage.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Persist specific app state to localStorage
export const createPersistedStore = <T>(
  name: string,
  initialState: T
) => {
  return create<T>()(
    persist(
      (set) => ({
        ...initialState,
        // Store methods here
      }),
      {
        name: `vision-${name}`, // Storage key
        partialize: (state) => ({
          // Only persist specific fields
          // Don't persist sensitive data
        })
      }
    )
  )
}

// Usage
export const useProposalStore = createPersistedStore('funding-framer-proposals', {
  drafts: [],
  preferences: {
    defaultTemplate: 'standard',
    autoSave: true
  }
})
```

### 5.3 Shared Component Library Best Practices

**Component Library Structure:**

```
packages/ui/src/
├── components/
│   ├── forms/               # Form components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Checkbox.tsx
│   │   └── index.ts
│   │
│   ├── layouts/             # Layout components
│   │   ├── PlatformLayout.tsx
│   │   ├── AppLayout.tsx
│   │   ├── PageLayout.tsx
│   │   └── index.ts
│   │
│   ├── navigation/          # Navigation components
│   │   ├── Breadcrumbs.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   └── index.ts
│   │
│   ├── data-display/        # Data display
│   │   ├── Table.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   │
│   ├── feedback/            # User feedback
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   │
│   └── nonprofit-specific/  # Domain-specific components
│       ├── AssessmentCard.tsx
│       ├── GrantOpportunityCard.tsx
│       ├── ImpactMetric.tsx
│       └── index.ts
│
├── hooks/                   # Shared React hooks
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   ├── usePagination.ts
│   └── index.ts
│
├── utils/                   # UI utilities
│   ├── cn.ts               # className merger
│   ├── format.ts           # Formatters
│   └── validators.ts
│
└── styles/                  # Global styles
    ├── globals.css
    └── themes.css
```

**Component API Design Best Practices:**

```typescript
// ✅ Good: Flexible, typed, accessible
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean  // Composition pattern
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" />}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**Component Documentation:**

```typescript
/**
 * Button component with multiple variants and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 *
 * <Button
 *   variant="secondary"
 *   isLoading
 *   leftIcon={<PlusIcon />}
 * >
 *   Create Proposal
 * </Button>
 * ```
 */
```

### 5.4 App Configuration and Feature Flags

**Feature Flag System:**

```typescript
// packages/config/src/feature-flags.ts
export interface FeatureFlags {
  // Platform features
  'platform:global-search': boolean
  'platform:ai-assistant': boolean
  'platform:realtime-collab': boolean

  // App availability by tier
  'app:capacity-assessment': SubscriptionTier[]
  'app:funding-framer': SubscriptionTier[]
  'app:crm-lite': SubscriptionTier[]
  'app:impact-tracker': SubscriptionTier[]
  'app:compliance-hub': SubscriptionTier[]
  'app:board-portal': SubscriptionTier[]
  'app:event-manager': SubscriptionTier[]

  // Feature-specific flags
  'grants:ai-proposal-generation': boolean
  'grants:compliance-checking': boolean
  'assessment:benchmarking': boolean
  'crm:email-integration': boolean

  // Beta features
  'beta:voice-input': boolean
  'beta:mobile-app': boolean
}

export const DEFAULT_FLAGS: FeatureFlags = {
  'platform:global-search': true,
  'platform:ai-assistant': true,
  'platform:realtime-collab': false,  // Beta

  'app:capacity-assessment': ['free', 'starter', 'professional', 'enterprise'],
  'app:funding-framer': ['starter', 'professional', 'enterprise'],
  'app:crm-lite': ['professional', 'enterprise'],
  'app:impact-tracker': ['professional', 'enterprise'],
  'app:compliance-hub': ['professional', 'enterprise'],
  'app:board-portal': ['enterprise'],
  'app:event-manager': ['enterprise'],

  'grants:ai-proposal-generation': true,
  'grants:compliance-checking': true,
  'assessment:benchmarking': true,
  'crm:email-integration': false,  // Coming soon

  'beta:voice-input': false,
  'beta:mobile-app': false,
}

// Hook to check feature flags
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const { organization } = useAuthStore()
  const flagValue = organization?.feature_flags?.[flag] ?? DEFAULT_FLAGS[flag]

  // If flag is array of tiers, check if user's tier is included
  if (Array.isArray(flagValue)) {
    return flagValue.includes(organization?.subscription_tier)
  }

  return Boolean(flagValue)
}

// Usage in component
const ProposalEditor = () => {
  const hasAIGeneration = useFeatureFlag('grants:ai-proposal-generation')

  return (
    <div>
      {hasAIGeneration && (
        <Button onClick={generateProposal}>
          Generate with AI
        </Button>
      )}
    </div>
  )
}
```

### 5.5 Performance Considerations

**Code Splitting Strategy:**

```typescript
// apps/platform-shell/src/app/layout.tsx
import dynamic from 'next/dynamic'

// Lazy load apps only when accessed
const CapacityAssessmentApp = dynamic(
  () => import('../../capacity-assessment'),
  { ssr: false }
)

const FundingFramerApp = dynamic(
  () => import('../../funding-framer'),
  { ssr: false, loading: () => <AppLoadingSpinner /> }
)

// Route-based code splitting
export default function PlatformLayout() {
  return (
    <Routes>
      <Route path="/capacity-assessment/*" element={<CapacityAssessmentApp />} />
      <Route path="/funding-framer/*" element={<FundingFramerApp />} />
      {/* ... other apps */}
    </Routes>
  )
}
```

**Bundle Size Optimization:**

```typescript
// packages/ui/src/index.ts
// ❌ Bad: Exports everything, large bundle
export * from './components'

// ✅ Good: Individual exports for tree-shaking
export { Button } from './components/forms/Button'
export { Input } from './components/forms/Input'
export { Card } from './components/data-display/Card'
// ...
```

**Turborepo Caching:**

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  },
  "globalDependencies": [
    "**/.env",
    "tsconfig.json",
    ".eslintrc.js"
  ]
}
```

**Image Optimization:**

```typescript
// Use Next.js Image component with optimization
import Image from 'next/image'

const GrantOpportunityCard = ({ opportunity }) => {
  return (
    <Card>
      <Image
        src={opportunity.funder.logo}
        alt={opportunity.funder.name}
        width={120}
        height={60}
        loading="lazy"
        placeholder="blur"
      />
      {/* Card content */}
    </Card>
  )
}
```

**Data Fetching Optimization:**

```typescript
// Prefetch data for instant navigation
const AppLauncher = () => {
  const queryClient = useQueryClient()

  const handleAppHover = (appSlug: string) => {
    // Prefetch app's initial data on hover
    if (appSlug === 'funding-framer') {
      queryClient.prefetchQuery({
        queryKey: ['proposals'],
        queryFn: fetchProposals
      })
    }
  }

  return (
    // App launcher UI
  )
}

// Use React Query with staleTime for caching
const { data: proposals } = useQuery({
  queryKey: ['proposals', orgId],
  queryFn: () => fetchProposals(orgId),
  staleTime: 5 * 60 * 1000,  // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
})
```

---

## 6. VISION Platform Recommendations

### 6.1 Recommended Architecture

Based on industry best practices and VISION Platform's unique requirements:

**Monorepo Structure: ✅ Confirmed Optimal**
- Turborepo for build orchestration
- pnpm workspaces for dependency management
- Shared packages for consistency
- Independent app deployments

**App Organization: ✅ Confirmed Optimal**
- Each app in `apps/` directory
- Platform shell as central launcher
- Shared packages for common functionality
- Clear separation of concerns

**Permission System: Recommended Implementation**

```typescript
// Implement four-layer permission system:

// 1. Organization Access (implemented in auth table)
CREATE TABLE user_organizations (
  user_id uuid REFERENCES users(id),
  org_id uuid REFERENCES organizations(id),
  role organization_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  PRIMARY KEY (user_id, org_id)
);

// 2. App Access (implement in organization settings)
CREATE TABLE organization_app_access (
  org_id uuid REFERENCES organizations(id),
  app_slug text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  tier_required subscription_tier,
  PRIMARY KEY (org_id, app_slug)
);

// 3. Feature Access (implement with feature flags)
CREATE TABLE organization_feature_flags (
  org_id uuid REFERENCES organizations(id),
  flag_name text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  PRIMARY KEY (org_id, flag_name)
);

// 4. Data Access (implement with RLS)
-- Already covered in existing architecture
```

**Navigation System: Recommended Implementation**

```typescript
// Implement three-tier navigation:

// 1. Platform Navigation (Global)
const PlatformNav = () => (
  <nav className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-50">
    <AppLauncher />
    <GlobalSearch />
    <NotificationCenter />
    <OrganizationSwitcher />
    <UserMenu />
  </nav>
)

// 2. App Navigation (Contextual Sidebar)
const AppNav = ({ app }) => (
  <aside className="fixed left-0 top-14 bottom-0 w-64 border-r">
    <AppHeader app={app} />
    <AppNavItems app={app} />
    <AppSettings />
  </aside>
)

// 3. Page Navigation (Breadcrumbs)
const PageNav = () => (
  <div className="px-6 py-4 border-b">
    <Breadcrumbs />
  </div>
)

// Layout composition
const AppLayout = ({ app, children }) => (
  <>
    <PlatformNav />
    <div className="flex pt-14">
      <AppNav app={app} />
      <main className="flex-1 ml-64">
        <PageNav />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  </>
)
```

### 6.2 Implementation Priorities

**Phase 1: Foundation (Immediate)**

1. **Platform Shell**
   - Implement app launcher with search
   - Global navigation bar
   - User menu and organization switcher
   - Authentication flows

2. **Shared Component Library**
   - Set up `packages/ui` with Mantine UI
   - Implement core components using Mantine (Button, Input, Card, etc.)
   - Create layout components (PlatformLayout, AppLayout)
   - Configure Mantine theme with brand colors and design tokens
   - Design system tokens

3. **Permission System Foundation**
   - Database schema for multi-layer permissions
   - RLS policies for data isolation
   - Frontend permission hooks
   - Admin UI for user management

**Phase 2: Core Apps (Next)**

4. **CapacityIQ Migration**
   - Implement AppLayout for CapacityIQ
   - Migrate to shared component library
   - Add app-specific navigation
   - Integrate with platform permissions

5. **FundingFramer Build**
   - Apply same patterns as CapacityIQ
   - Implement cross-app data integration
   - Add progressive disclosure onboarding
   - Context-aware help system

**Phase 3: Enhancement (Later)**

6. **Advanced Features**
   - Real-time collaboration
   - Advanced search across all apps
   - AI assistant integration
   - Mobile-responsive refinements

### 6.3 Key Implementation Patterns for VISION

**App Registration Pattern:**

```typescript
// packages/config/src/apps.ts
export interface AppDefinition {
  slug: string
  name: string
  description: string
  icon: ReactNode
  color: string
  category: AppCategory
  requiredTier: SubscriptionTier[]
  routes: Record<string, string>
  permissions: string[]
}

export const PLATFORM_APPS: AppDefinition[] = [
  {
    slug: 'capacity-assessment',
    name: 'CapacityIQ',
    description: 'Organizational capacity assessment',
    icon: <ChartBarIcon />,
    color: 'hsl(265, 90%, 60%)',
    category: 'assessment',
    requiredTier: ['free', 'starter', 'professional', 'enterprise'],
    routes: {
      home: '/capacity-assessment',
      assessments: '/capacity-assessment/assessments',
      benchmarks: '/capacity-assessment/benchmarks',
    },
    permissions: ['capacity:view', 'capacity:create', 'capacity:edit']
  },
  {
    slug: 'funding-framer',
    name: 'FundingFramer',
    description: 'AI-powered grant management',
    icon: <DocumentTextIcon />,
    color: 'hsl(210, 90%, 55%)',
    category: 'fundraising',
    requiredTier: ['starter', 'professional', 'enterprise'],
    routes: {
      home: '/funding-framer',
      proposals: '/funding-framer/proposals',
      opportunities: '/funding-framer/opportunities',
    },
    permissions: ['grants:view', 'grants:create', 'grants:edit', 'grants:submit']
  },
  // ... other apps
]
```

**Cross-App Integration Pattern:**

```typescript
// packages/database/src/integration/organization-context.ts

/**
 * Get comprehensive organization context from all apps
 * Used by AI and cross-app features
 */
export async function getOrganizationContext(orgId: string) {
  const [
    profile,
    capacityData,
    grantData,
    impactData,
    crmData
  ] = await Promise.all([
    getOrganizationProfile(orgId),
    getLatestCapacityAssessment(orgId),
    getGrantStatistics(orgId),
    getImpactMetrics(orgId),
    getDonorStatistics(orgId)
  ])

  return {
    organization: profile,
    capacity: {
      score: capacityData?.score,
      strengths: capacityData?.strengths,
      areasForGrowth: capacityData?.areas_for_growth,
      lastAssessmentDate: capacityData?.created_at
    },
    grants: {
      totalSubmitted: grantData.total_submitted,
      totalAwarded: grantData.total_awarded,
      totalFunding: grantData.total_funding,
      successRate: grantData.success_rate
    },
    impact: {
      outcomesTracked: impactData.outcomes_count,
      impactScore: impactData.average_score,
      beneficiariesServed: impactData.beneficiaries_count
    },
    fundraising: {
      totalDonations: crmData.total_donations,
      activeDonors: crmData.active_donors,
      retentionRate: crmData.retention_rate
    }
  }
}

// Usage in AI proposal generation
const generateProposal = async (proposalData: ProposalInput) => {
  const context = await getOrganizationContext(proposalData.org_id)

  const prompt = `
    Generate a grant proposal for:
    Organization: ${context.organization.name}
    Mission: ${context.organization.mission}

    Recent Capacity Assessment:
    - Score: ${context.capacity.score}/100
    - Strengths: ${context.capacity.strengths.join(', ')}

    Track Record:
    - ${context.grants.totalAwarded} grants awarded
    - ${context.grants.successRate}% success rate
    - $${context.grants.totalFunding} in funding secured

    Impact:
    - ${context.impact.beneficiariesServed} beneficiaries served
    - ${context.impact.outcomesTracked} outcomes tracked

    Write a compelling proposal that highlights these strengths...
  `

  return await callClaude(prompt)
}
```

### 6.4 Nonprofit-Specific Considerations

**Accessibility Priority:**
Nonprofits serve diverse communities - prioritize WCAG 2.1 AA compliance:
- Keyboard navigation for all features
- Screen reader compatibility
- High contrast mode
- Adjustable font sizes
- Clear focus indicators

**Cost Transparency:**
Nonprofits are budget-conscious - show AI costs clearly:

```typescript
const AIGenerateButton = ({ estimatedCost, onGenerate }) => {
  return (
    <div>
      <Button onClick={onGenerate}>
        Generate with AI
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Estimated cost: ${estimatedCost.toFixed(2)}
      </p>
      <p className="text-xs text-muted-foreground">
        Monthly remaining: ${monthlyBudget - monthlyUsage}
      </p>
    </div>
  )
}
```

**Simplified Onboarding:**
Many nonprofit users are not tech-savvy:
- Use plain language, avoid jargon
- Provide sample data for exploration
- Video tutorials for complex features
- Step-by-step wizards for common tasks

**Collaborative Features:**
Nonprofits have small teams that need to collaborate:
- Real-time co-editing
- Comments and feedback
- Version history
- Share links with funders

---

## Summary: Key Takeaways

### Architecture
✅ Monorepo with Turborepo is optimal for VISION Platform
✅ Separate apps in `apps/`, shared code in `packages/`
✅ Each app independently deployable but shares foundation

### Permissions
✅ Implement four-layer permission system
✅ Combine RBAC with subscription tier-based access
✅ Use Row Level Security for data isolation
✅ Support custom roles for enterprise customers

### Navigation
✅ Three-tier navigation: Platform > App > Page
✅ Interactive breadcrumbs with sibling navigation
✅ Persistent app launcher for quick switching
✅ Context preservation across app switches

### UX
✅ Shared component library for consistency
✅ Progressive disclosure for feature complexity
✅ Contextual onboarding per app
✅ Accessibility as a priority

### Performance
✅ Code splitting per app
✅ Lazy loading with React.lazy()
✅ Turborepo caching for fast builds
✅ Next.js optimizations (Image, fonts, etc.)

---

**Next Steps:**
1. Implement platform shell with app launcher
2. Build shared component library
3. Set up permission system
4. Create navigation patterns
5. Migrate CapacityIQ using these patterns
6. Apply learnings to remaining apps

---

**References:**
- Microsoft 365 App Launcher Documentation
- Google Workspace Platform Architecture
- Salesforce Lightning Design System
- AWS Multi-Tenant SaaS Architecture
- Aserto Multi-Tenant RBAC Guide
- Turborepo Best Practices
- Next.js Performance Optimization

---

**Last Updated:** 2025-11-12
**Maintained By:** VISION Platform Development Team
**Review Schedule:** Quarterly
