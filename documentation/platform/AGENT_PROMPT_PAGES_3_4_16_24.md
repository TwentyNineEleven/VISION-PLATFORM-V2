# AGENT START PROMPTS: PAGES 3-4, 16-24

This document contains individual agent prompts for the remaining pages. Each section is standalone.

---

# PAGE 3: APPS (DUPLICATE) (`/apps`) - REDIRECT

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/apps/page.tsx`
**Priority:** P0 - Critical (DELETE/REDIRECT)
**Total Effort:** 1 hour
**Timeline:** Week 3 Monday

**Action:** Create redirect to `/applications` and remove from navigation

**Agent:** 004 (CTA Functionality Specialist)

---

## IMPLEMENTATION

### Step 1: Create Redirect

**File:** `apps/shell/src/app/apps/page.tsx`
```typescript
import { redirect } from 'next/navigation';

export default function AppsRedirectPage() {
  redirect('/applications');
}
```

### Step 2: Update Navigation

**File:** `apps/shell/src/components/Navigation.tsx` (or similar)
```typescript
// ❌ REMOVE this navigation item
{
  label: 'Apps',
  href: '/apps',
  icon: AppIcon,
}

// ✅ Keep only the applications link
{
  label: 'Applications',
  href: '/applications',
  icon: AppIcon,
}
```

### Step 3: Find and Update Internal Links

```bash
# Search for all references to /apps
grep -r "href=\"/apps\"" apps/shell/src/
grep -r "href='/apps'" apps/shell/src/
grep -r "router.push('/apps')" apps/shell/src/
grep -r "router.push(\"/apps\")" apps/shell/src/

# Update each to /applications
```

### Success Criteria
- ✅ `/apps` redirects to `/applications`
- ✅ Zero direct links to `/apps` remain
- ✅ Navigation updated
- ✅ All tests pass
- ✅ Build succeeds

---

# PAGE 4: APP CATALOG (LEGACY) (`/app-catalog`) - REDIRECT

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/app-catalog/page.tsx`
**Priority:** P0 - Critical (DELETE/REDIRECT)
**Total Effort:** 1 hour
**Timeline:** Week 3 Monday

**Action:** Create redirect to `/applications` and remove from navigation

**Agent:** 004

---

## IMPLEMENTATION

Same as Page 3, but for `/app-catalog` route.

**File:** `apps/shell/src/app/app-catalog/page.tsx`
```typescript
import { redirect } from 'next/navigation';

export default function AppCatalogRedirectPage() {
  redirect('/applications');
}
```

Update all internal links from `/app-catalog` to `/applications`.

---

# PAGE 16: FUNDER — COHORTS (`/funder/cohorts`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/funder/cohorts/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- Cohort actions (create, edit, archive)
- aria-labels for accessibility

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 004 - Week 5 - 3 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: COHORT ACTIONS (Week 5 - 3h)

**Agent 004**

### Types
```typescript
export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'archived';
  granteeCount: number;
  totalFunding: number;
  createdAt: string;
}
```

### Service
```typescript
export const cohortService = {
  async getCohorts(): Promise<Cohort[]> {
    const cohorts = localStorage.getItem('cohorts');
    return cohorts ? JSON.parse(cohorts) : [];
  },

  async createCohort(data: Omit<Cohort, 'id' | 'createdAt' | 'granteeCount' | 'totalFunding'>): Promise<Cohort> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Cohort name is required');
    }

    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      ...data,
      granteeCount: 0,
      totalFunding: 0,
      createdAt: new Date().toISOString(),
    };

    const cohorts = await this.getCohorts();
    cohorts.push(newCohort);
    localStorage.setItem('cohorts', JSON.stringify(cohorts));

    return newCohort;
  },

  async updateCohort(id: string, updates: Partial<Cohort>): Promise<void> {
    const cohorts = await this.getCohorts();
    const index = cohorts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cohort not found');
    }

    cohorts[index] = { ...cohorts[index], ...updates };
    localStorage.setItem('cohorts', JSON.stringify(cohorts));
  },

  async archiveCohort(id: string): Promise<void> {
    await this.updateCohort(id, { status: 'archived' });
  },
};
```

---

# PAGE 17: ADMIN DASHBOARD (`/admin`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/page.tsx`
**Priority:** P0 - Critical (NAVIGATION BROKEN!)
**Total Effort:** 6 hours
**Timeline:** Week 1-4

**Issues:**
- text-emerald color violation + **BROKEN NAVIGATION** (CRITICAL)
- Platform stats and quick actions

**Agents:**
1. Agent 001 - Week 1 Friday (CRITICAL - nav broken) - 3 hours
2. Agent 004 - Week 4 Thursday - 3 hours

---

## ISSUE 1: NAVIGATION FIX + COLORS (Week 1 Fri - 3h)

**Agent 001** - CRITICAL PRIORITY

### Problem
The admin navigation is completely broken, preventing access to admin features.

### Fix
```typescript
// ❌ BEFORE - Broken navigation
<nav className="broken-nav-class">
  {/* Navigation not rendering */}
</nav>

// ✅ AFTER - Working navigation with proper colors
<nav className="bg-vision-surface-secondary border-b border-vision-border-default">
  <div className="flex items-center gap-4 px-6 py-3">
    <a
      href="/admin"
      className="text-vision-text-primary hover:text-vision-blue-600"
    >
      Dashboard
    </a>
    <a
      href="/admin/organizations"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Organizations
    </a>
    <a
      href="/admin/users"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Users
    </a>
    <a
      href="/admin/apps"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Apps
    </a>
    <a
      href="/admin/billing"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Billing
    </a>
    <a
      href="/admin/settings"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Settings
    </a>
    <a
      href="/admin/analytics"
      className="text-vision-text-secondary hover:text-vision-blue-600"
    >
      Analytics
    </a>
  </div>
</nav>
```

### Color Fix
```typescript
// ❌ BEFORE
<span className="text-emerald-500">Active</span>

// ✅ AFTER
<span className="text-vision-success-600">Active</span>
```

---

# PAGE 18: ADMIN — ORGANIZATIONS (`/admin/organizations`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/organizations/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- 2 inputs, 2 selects → Glow UI
- Table caption accessibility

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 002 - Week 4 - 4 hours
3. Agent 003 - Week 5 - 1 hour

**Component Migration:**
- Organization name input
- Industry select
- Search input
- Status filter select

---

# PAGE 19: ADMIN — USERS (`/admin/users`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/users/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- text-emerald-500 color
- User status toggles (activate/deactivate)
- aria attributes

**Agents:**
1. Agent 001 - Week 3 Friday - 1 hour
2. Agent 004 - Week 4 - 3 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: USER STATUS TOGGLES (Week 4 - 3h)

**Agent 004**

```typescript
export const userAdminService = {
  async toggleUserStatus(userId: string, active: boolean): Promise<void> {
    const users = await this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.status = active ? 'active' : 'inactive';
    user.statusChangedAt = new Date().toISOString();

    localStorage.setItem('admin_users', JSON.stringify(users));
  },

  async resetPassword(userId: string): Promise<string> {
    // Generate temporary password
    const tempPassword = `temp_${Math.random().toString(36).slice(2, 10)}`;

    // In production, this would send an email
    console.log(`Password reset link sent to user ${userId}`);

    return tempPassword;
  },

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== userId);

    if (filtered.length === users.length) {
      throw new Error('User not found');
    }

    localStorage.setItem('admin_users', JSON.stringify(filtered));
  },
};
```

---

# PAGE 20: ADMIN — APPS (`/admin/apps`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/apps/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 5 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- Confirmation dialogs for enable/disable
- Labels for accessibility

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 004 - Week 4 - 2 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: CONFIRMATION DIALOGS (Week 4 - 2h)

**Agent 004**

```typescript
const handleToggleApp = async (appId: string, currentlyEnabled: boolean) => {
  const action = currentlyEnabled ? 'disable' : 'enable';
  const app = apps.find(a => a.id === appId);

  if (!confirm(`Are you sure you want to ${action} "${app?.name}"? This will affect all users.`)) {
    return;
  }

  setIsLoading(true);

  try {
    await adminAppService.toggleAppStatus(appId, !currentlyEnabled);
    await loadApps();
  } catch (err) {
    setError(`Failed to ${action} app`);
  } finally {
    setIsLoading(false);
  }
};
```

---

# PAGE 21: ADMIN — BILLING (`/admin/billing`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/billing/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- Billing admin actions (view org subscriptions, manage invoices)
- Table captions

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 004 - Week 4 - 3 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: BILLING ADMIN ACTIONS (Week 4 - 3h)

**Agent 004**

```typescript
export const adminBillingService = {
  async getOrganizationSubscriptions(): Promise<OrgSubscription[]> {
    const subs = localStorage.getItem('admin_subscriptions');
    return subs ? JSON.parse(subs) : [];
  },

  async viewInvoice(invoiceId: string): Promise<Invoice> {
    const invoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
    const invoice = invoices.find((i: Invoice) => i.id === invoiceId);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  },

  async generateReport(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf';
  }): Promise<string> {
    // Mock report generation
    const reportId = `report_${Date.now()}`;

    // Simulate report generation
    setTimeout(() => {
      console.log(`Report ${reportId} generated`);
    }, 2000);

    return reportId;
  },
};
```

---

# PAGE 22: ADMIN — SETTINGS (`/admin/settings`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/settings/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 5 hours
**Timeline:** Week 3-4

**Issues:**
- Arbitrary hex colors
- Wire platform settings save

**Agents:**
1. Agent 001 - Week 3 Friday - 2 hours
2. Agent 004 - Week 4 - 3 hours

---

## ISSUE 2: PLATFORM SETTINGS (Week 4 - 3h)

**Agent 004**

```typescript
export interface PlatformSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  maxOrganizationsPerUser: number;
  sessionTimeout: number;
  enabledFeatures: string[];
}

export const platformSettingsService = {
  async getSettings(): Promise<PlatformSettings> {
    const settings = localStorage.getItem('platform_settings');
    return settings ? JSON.parse(settings) : this.getDefaultSettings();
  },

  async updateSettings(updates: Partial<PlatformSettings>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };

    localStorage.setItem('platform_settings', JSON.stringify(updated));
  },

  getDefaultSettings(): PlatformSettings {
    return {
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: true,
      maxOrganizationsPerUser: 3,
      sessionTimeout: 3600,
      enabledFeatures: ['ai', 'notifications', 'billing'],
    };
  },
};
```

---

# PAGE 23: ADMIN — ANALYTICS (`/admin/analytics`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/analytics/page.tsx`
**Priority:** P1 - High
**Total Effort:** 5 hours
**Timeline:** Week 3-5

**Issues:**
- Chart colors (use Bold Color System)
- Export reports functionality
- Chart labels for accessibility

**Agents:**
1. Agent 001 - Week 3 - 2 hours
2. Agent 004 - Week 4 - 2 hours
3. Agent 003 - Week 5 - 1 hour

---

## ISSUE 1: CHART COLORS (Week 3 - 2h)

**Agent 001**

```typescript
// ❌ BEFORE - Arbitrary chart colors
const chartData = {
  datasets: [{
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  }]
};

// ✅ AFTER - Bold Color System for charts
const chartData = {
  datasets: [{
    backgroundColor: [
      'rgb(59, 130, 246)',   // vision-blue-600
      'rgb(34, 197, 94)',    // vision-success-600
      'rgb(234, 179, 8)',    // vision-warning-600
      'rgb(239, 68, 68)',    // vision-error-600
      'rgb(168, 85, 247)',   // vision-purple-600
    ],
  }]
};
```

## ISSUE 2: EXPORT REPORTS (Week 4 - 2h)

**Agent 004**

```typescript
export const analyticsService = {
  async exportReport(type: 'users' | 'apps' | 'revenue', format: 'csv' | 'pdf'): Promise<Blob> {
    const data = await this.getReportData(type);

    if (format === 'csv') {
      return this.generateCSV(data);
    } else {
      return this.generatePDF(data);
    }
  },

  generateCSV(data: any[]): Blob {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },

  downloadReport(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
```

---

# PAGE 24: HELP (`/help`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/help/page.tsx`
**Priority:** P0 - Critical (404!)
**Total Effort:** 4 hours OR 0.5 hours
**Timeline:** Week 1 Friday

**Options:**
1. **Remove:** Delete link from navigation (0.5h)
2. **Redirect:** Point to external docs (0.5h)
3. **Build:** Create help page (4h)

**Agent:** 001 or 004 - Week 1 Friday (after decision)

---

## OPTION 1: REMOVE (0.5h)

```typescript
// Remove from navigation
// File: apps/shell/src/components/Navigation.tsx
// Delete the help link entry
```

## OPTION 2: REDIRECT (0.5h)

```typescript
// File: apps/shell/src/app/help/page.tsx
import { redirect } from 'next/navigation';

export default function HelpPage() {
  redirect('https://docs.visionplatform.com');
}
```

## OPTION 3: BUILD HELP PAGE (4h)

```typescript
// File: apps/shell/src/app/help/page.tsx
export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-vision-text-primary text-3xl font-bold mb-6">
        Help & Documentation
      </h1>

      <div className="grid gap-6">
        <section className="bg-vision-surface-secondary rounded-lg p-6">
          <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
            Getting Started
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="/help/quickstart" className="text-vision-blue-600 hover:text-vision-blue-700">
                Quick Start Guide
              </a>
            </li>
            <li>
              <a href="/help/tutorials" className="text-vision-blue-600 hover:text-vision-blue-700">
                Video Tutorials
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-vision-surface-secondary rounded-lg p-6">
          <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
            Common Topics
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="/help/applications" className="text-vision-blue-600 hover:text-vision-blue-700">
                Managing Applications
              </a>
            </li>
            <li>
              <a href="/help/team" className="text-vision-blue-600 hover:text-vision-blue-700">
                Team Management
              </a>
            </li>
            <li>
              <a href="/help/billing" className="text-vision-blue-600 hover:text-vision-blue-700">
                Billing & Subscriptions
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-vision-surface-secondary rounded-lg p-6">
          <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
            Need More Help?
          </h2>
          <p className="text-vision-text-secondary mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
          <GlowButton onClick={() => window.open('mailto:support@visionplatform.com')}>
            Contact Support
          </GlowButton>
        </section>
      </div>
    </div>
  );
}
```

---

## UNIVERSAL EXECUTION WORKFLOW (ALL PAGES)

```bash
# 1. Setup
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-[number]-[name]
pnpm install

# 2. Self-Review (MANDATORY)
cat [target-file]
grep -rn "[search-pattern]" [target-file]

# 3. Make Changes
# Follow code examples for your agent

# 4. Validate (ALL MUST PASS)
pnpm type-check
pnpm lint
pnpm validate:colors       # if Agent 001
pnpm validate:components   # if Agent 002
pnpm test [file]
pnpm build

# 5. Manual Test
pnpm dev

# 6. Create PR
git add [files]
git commit -m "fix(page-[N]): [description]

- [change 1]
- [change 2]

Agent: [number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin [branch]
gh pr create
```

---

## UNIVERSAL SUCCESS CRITERIA

### All Agents:
- ✅ Complete agent-specific prompt read
- ✅ Self-review performed
- ✅ ALL issues fixed (not just listed)
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85% coverage)
- ✅ `pnpm build` succeeds
- ✅ Manual testing complete
- ✅ PR created

---

## QUICK REFERENCE

### Files by Page
- **Page 3:** `apps/shell/src/app/apps/page.tsx`
- **Page 4:** `apps/shell/src/app/app-catalog/page.tsx`
- **Page 16:** `apps/shell/src/app/funder/cohorts/page.tsx`
- **Page 17:** `apps/shell/src/app/admin/page.tsx`
- **Page 18:** `apps/shell/src/app/admin/organizations/page.tsx`
- **Page 19:** `apps/shell/src/app/admin/users/page.tsx`
- **Page 20:** `apps/shell/src/app/admin/apps/page.tsx`
- **Page 21:** `apps/shell/src/app/admin/billing/page.tsx`
- **Page 22:** `apps/shell/src/app/admin/settings/page.tsx`
- **Page 23:** `apps/shell/src/app/admin/analytics/page.tsx`
- **Page 24:** `apps/shell/src/app/help/page.tsx`

### Commands
```bash
pnpm type-check
pnpm lint
pnpm validate:colors
pnpm validate:components
pnpm test [file]
pnpm build
pnpm dev
```

---

## READY TO START?

```bash
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-[number]
pnpm install
```

**Then proceed based on your agent role and page assignment.**
