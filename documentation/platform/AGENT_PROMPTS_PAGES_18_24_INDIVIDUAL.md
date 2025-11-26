# INDIVIDUAL AGENT PROMPTS: PAGES 18-24

Each page below is a complete standalone prompt that can be copied independently.

---

# PAGE 18: ADMIN — ORGANIZATIONS (`/admin/organizations`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/organizations/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- 2 inputs, 2 selects → Glow UI components
- Table caption accessibility

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 002 - Week 4 - 4 hours
3. Agent 003 - Week 5 - 1 hour

---

## ⚠️ MANDATORY AGENT ADHERENCE

1. ✅ Read complete agent-specific prompt
2. ✅ Follow ALL steps
3. ✅ Perform self-review
4. ✅ Fix ALL issues found
5. ✅ Run ALL validation commands

---

## ISSUE 2: COMPONENT MIGRATION (Week 4 - 4h)

**Agent 002**

### Components to Migrate
```typescript
// ❌ BEFORE
<input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search organizations..."
/>

<input
  type="text"
  value={orgName}
  onChange={(e) => setOrgName(e.target.value)}
  placeholder="Organization Name"
/>

<select value={industry} onChange={(e) => setIndustry(e.target.value)}>
  <option value="">All Industries</option>
  <option value="tech">Technology</option>
</select>

<select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="">All Status</option>
  <option value="active">Active</option>
  <option value="suspended">Suspended</option>
</select>

// ✅ AFTER
import { GlowInput, GlowSelect } from '@vision/design-system';

<GlowInput
  label="Search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search organizations..."
/>

<GlowInput
  label="Organization Name"
  value={orgName}
  onChange={(e) => setOrgName(e.target.value)}
  required
/>

<GlowSelect
  label="Industry"
  value={industry}
  onChange={(value) => setIndustry(value)}
  options={[
    { value: '', label: 'All Industries' },
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
  ]}
/>

<GlowSelect
  label="Status"
  value={status}
  onChange={(value) => setStatus(value)}
  options={[
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
  ]}
/>
```

---

## ISSUE 3: TABLE CAPTION (Week 5 - 1h)

**Agent 003**

```typescript
// ✅ Add table caption
<table className="min-w-full">
  <caption className="sr-only">
    List of organizations with name, industry, users, status, and actions
  </caption>
  <thead className="bg-vision-surface-secondary">
    <tr>
      <th scope="col" className="px-6 py-3 text-left">Organization</th>
      <th scope="col" className="px-6 py-3 text-left">Industry</th>
      <th scope="col" className="px-6 py-3 text-left">Users</th>
      <th scope="col" className="px-6 py-3 text-left">Status</th>
      <th scope="col" className="px-6 py-3 text-right">Actions</th>
    </tr>
  </thead>
</table>
```

---

## EXECUTION

```bash
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-18-admin-orgs
pnpm install
# Make changes
pnpm type-check && pnpm lint && pnpm validate:components && pnpm test && pnpm build
pnpm dev  # Manual test
git add . && git commit -m "fix(page-18): [work]" && git push && gh pr create
```

---

## SUCCESS CRITERIA

- ✅ All validation passes
- ✅ Components migrated
- ✅ Table accessible
- ✅ Tests ≥85% coverage

---

# PAGE 19: ADMIN — USERS (`/admin/users`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/users/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- text-emerald-500 color
- User status toggles (activate/deactivate/reset password)
- aria attributes

**Agents:**
1. Agent 001 - Week 3 Friday - 1 hour
2. Agent 004 - Week 4 - 3 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 1: COLOR (Week 3 Fri - 1h)

**Agent 001**

```typescript
// ❌ BEFORE
<span className="text-emerald-500">Active</span>

// ✅ AFTER
<span className="text-vision-success-600">Active</span>
```

---

## ISSUE 2: USER STATUS TOGGLES (Week 4 - 3h)

**Agent 004**

### Service
**File:** `apps/shell/src/services/userAdminService.ts`
```typescript
export const userAdminService = {
  async getUsers(): Promise<User[]> {
    const users = localStorage.getItem('admin_users');
    return users ? JSON.parse(users) : [];
  },

  async toggleUserStatus(userId: string, active: boolean): Promise<void> {
    const users = await this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) throw new Error('User not found');

    user.status = active ? 'active' : 'inactive';
    user.statusChangedAt = new Date().toISOString();
    user.statusChangedBy = 'admin';

    localStorage.setItem('admin_users', JSON.stringify(users));
  },

  async resetPassword(userId: string): Promise<string> {
    const tempPassword = `temp_${Math.random().toString(36).slice(2, 10)}`;

    // Log password reset
    const resets = JSON.parse(localStorage.getItem('password_resets') || '[]');
    resets.push({
      userId,
      tempPassword,
      resetAt: new Date().toISOString(),
      resetBy: 'admin',
    });
    localStorage.setItem('password_resets', JSON.stringify(resets));

    // In production: send email with reset link
    console.log(`Password reset for user ${userId}: ${tempPassword}`);

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

  async impersonateUser(userId: string): Promise<void> {
    // Store current admin session
    const adminSession = localStorage.getItem('admin_session');
    localStorage.setItem('impersonation_admin', adminSession || '');

    // Set impersonation
    localStorage.setItem('impersonating_user', userId);
    localStorage.setItem('impersonation_started', new Date().toISOString());
  },
};
```

### Component
```typescript
const handleToggleStatus = async (user: User) => {
  const action = user.status === 'active' ? 'deactivate' : 'activate';

  if (!confirm(`${action} user "${user.email}"?`)) return;

  setIsLoading(true);

  try {
    await userAdminService.toggleUserStatus(user.id, user.status !== 'active');
    await loadUsers();
    setSuccess(`User ${action}d successfully`);
  } catch (err) {
    setError(`Failed to ${action} user`);
  } finally {
    setIsLoading(false);
  }
};

const handleResetPassword = async (user: User) => {
  if (!confirm(`Reset password for "${user.email}"? A temporary password will be sent.`)) {
    return;
  }

  setIsLoading(true);

  try {
    const tempPassword = await userAdminService.resetPassword(user.id);
    alert(`Temporary password: ${tempPassword}\n\nIn production, this would be emailed to the user.`);
    setSuccess('Password reset email sent');
  } catch (err) {
    setError('Failed to reset password');
  } finally {
    setIsLoading(false);
  }
};
```

---

## ISSUE 3: ACCESSIBILITY (Week 5 - 2h)

**Agent 003**

```typescript
// ✅ All action buttons with aria-labels
<GlowButton
  variant="ghost"
  size="sm"
  onClick={() => handleToggleStatus(user)}
  aria-label={`${user.status === 'active' ? 'Deactivate' : 'Activate'} user ${user.email}`}
>
  {user.status === 'active' ? 'Deactivate' : 'Activate'}
</GlowButton>

<GlowButton
  variant="ghost"
  size="sm"
  onClick={() => handleResetPassword(user)}
  aria-label={`Reset password for ${user.email}`}
>
  Reset Password
</GlowButton>

// ✅ Status with sr-only text
<span className={statusClass}>
  {user.status}
  <span className="sr-only">user status</span>
</span>
```

---

## SUCCESS CRITERIA

- ✅ Color fixed
- ✅ Status toggles work
- ✅ Password reset works
- ✅ Delete works with confirmation
- ✅ All accessible

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
const handleToggleApp = async (app: App) => {
  const action = app.enabled ? 'disable' : 'enable';

  // CRITICAL: Require confirmation for admin actions
  const confirmed = confirm(
    `${action.toUpperCase()} "${app.name}"?\n\n` +
    `This will ${action} the app for ALL ${app.installedCount} organizations.\n\n` +
    `Are you sure you want to continue?`
  );

  if (!confirmed) return;

  setIsLoading(true);

  try {
    await adminAppService.toggleAppStatus(app.id, !app.enabled);
    await loadApps();
    setSuccess(`App ${action}d successfully`);
  } catch (err) {
    setError(`Failed to ${action} app`);
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteApp = async (app: App) => {
  // CRITICAL: Extra confirmation for delete
  const confirmed = confirm(
    `⚠️ DELETE "${app.name}"?\n\n` +
    `This will:\n` +
    `- Remove the app for ${app.installedCount} organizations\n` +
    `- Delete all user data and configurations\n` +
    `- This action CANNOT be undone\n\n` +
    `Type the app name to confirm:`
  );

  if (!confirmed) return;

  const typedName = prompt(`Type "${app.name}" to confirm deletion:`);

  if (typedName !== app.name) {
    alert('App name does not match. Deletion cancelled.');
    return;
  }

  setIsLoading(true);

  try {
    await adminAppService.deleteApp(app.id);
    await loadApps();
    setSuccess('App deleted successfully');
  } catch (err) {
    setError('Failed to delete app');
  } finally {
    setIsLoading(false);
  }
};
```

---

## SUCCESS CRITERIA

- ✅ Confirmation dialogs present
- ✅ Double confirmation for delete
- ✅ Clear warning messages
- ✅ All actions work

---

# PAGE 21: ADMIN — BILLING (`/admin/billing`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/admin/billing/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 6 hours
**Timeline:** Week 3-5

**Issues:**
- Minor color cleanup
- Billing admin actions (view subscriptions, manage invoices, reports)
- Table captions

**Agents:**
1. Agent 001 - Week 3 - 1 hour
2. Agent 004 - Week 4 - 3 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: BILLING ADMIN ACTIONS (Week 4 - 3h)

**Agent 004**

### Service
```typescript
export const adminBillingService = {
  async getOrganizationSubscriptions(): Promise<OrgSubscription[]> {
    const subs = localStorage.getItem('admin_subscriptions');
    return subs ? JSON.parse(subs) : [];
  },

  async viewOrgSubscription(orgId: string): Promise<OrgSubscription> {
    const subs = await this.getOrganizationSubscriptions();
    const sub = subs.find(s => s.organizationId === orgId);

    if (!sub) throw new Error('Subscription not found');

    return sub;
  },

  async cancelOrgSubscription(orgId: string, reason: string): Promise<void> {
    const subs = await this.getOrganizationSubscriptions();
    const sub = subs.find(s => s.organizationId === orgId);

    if (!sub) throw new Error('Subscription not found');

    sub.status = 'cancelled';
    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason;
    sub.cancelledBy = 'admin';

    localStorage.setItem('admin_subscriptions', JSON.stringify(subs));
  },

  async refundPayment(invoiceId: string, amount: number, reason: string): Promise<void> {
    const refund = {
      id: `refund_${Date.now()}`,
      invoiceId,
      amount,
      reason,
      processedAt: new Date().toISOString(),
      processedBy: 'admin',
    };

    const refunds = JSON.parse(localStorage.getItem('refunds') || '[]');
    refunds.push(refund);
    localStorage.setItem('refunds', JSON.stringify(refunds));
  },

  async generateBillingReport(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf';
  }): Promise<Blob> {
    const subs = await this.getOrganizationSubscriptions();

    // Filter by date range
    const filtered = subs.filter(sub => {
      const subDate = new Date(sub.createdAt);
      return subDate >= new Date(params.startDate) && subDate <= new Date(params.endDate);
    });

    if (params.format === 'csv') {
      const csv = this.generateCSV(filtered);
      return new Blob([csv], { type: 'text/csv' });
    } else {
      // Mock PDF generation
      return new Blob(['PDF Report Content'], { type: 'application/pdf' });
    }
  },

  generateCSV(data: any[]): string {
    const headers = ['Organization', 'Plan', 'Status', 'MRR', 'Created'];
    const rows = data.map(sub => [
      sub.organizationName,
      sub.plan,
      sub.status,
      sub.monthlyRevenue,
      new Date(sub.createdAt).toLocaleDateString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
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

## SUCCESS CRITERIA

- ✅ View subscriptions
- ✅ Cancel subscription with reason
- ✅ Process refunds
- ✅ Generate reports
- ✅ Download CSV/PDF

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

### Types & Service
```typescript
export interface PlatformSettings {
  // General
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;

  // Registration
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  allowedEmailDomains: string[];

  // Limits
  maxOrganizationsPerUser: number;
  maxUsersPerOrganization: number;
  maxAppsPerOrganization: number;

  // Security
  sessionTimeout: number; // minutes
  passwordMinLength: number;
  requireMFA: boolean;

  // Features
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

    // Validate
    if (updated.sessionTimeout < 5) {
      throw new Error('Session timeout must be at least 5 minutes');
    }

    if (updated.passwordMinLength < 8) {
      throw new Error('Password min length must be at least 8');
    }

    localStorage.setItem('platform_settings', JSON.stringify(updated));
  },

  getDefaultSettings(): PlatformSettings {
    return {
      platformName: 'VISION Platform',
      supportEmail: 'support@visionplatform.com',
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: true,
      allowedEmailDomains: [],
      maxOrganizationsPerUser: 3,
      maxUsersPerOrganization: 100,
      maxAppsPerOrganization: 50,
      sessionTimeout: 60,
      passwordMinLength: 8,
      requireMFA: false,
      enabledFeatures: ['ai', 'notifications', 'billing', 'analytics'],
    };
  },
};
```

---

## SUCCESS CRITERIA

- ✅ Settings load
- ✅ Settings save with validation
- ✅ All fields work
- ✅ Defaults work

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
// ❌ BEFORE - Arbitrary colors
const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

// ✅ AFTER - Bold Color System
const chartColors = [
  'rgb(59, 130, 246)',   // vision-blue-600
  'rgb(34, 197, 94)',    // vision-success-600
  'rgb(234, 179, 8)',    // vision-warning-600
  'rgb(239, 68, 68)',    // vision-error-600
  'rgb(168, 85, 247)',   // vision-purple-600
  'rgb(236, 72, 153)',   // vision-pink-600
];

// Use in Chart.js config
const chartConfig = {
  data: {
    datasets: [{
      backgroundColor: chartColors,
      borderColor: chartColors,
    }]
  }
};
```

---

## ISSUE 2: EXPORT REPORTS (Week 4 - 2h)

**Agent 004**

```typescript
export const analyticsService = {
  async exportUsersReport(format: 'csv' | 'pdf'): Promise<Blob> {
    const users = await this.getUserAnalytics();

    if (format === 'csv') {
      const csv = 'Email,Status,Created,Last Login\n' +
        users.map(u => `${u.email},${u.status},${u.createdAt},${u.lastLogin}`).join('\n');
      return new Blob([csv], { type: 'text/csv' });
    } else {
      return new Blob(['PDF Content'], { type: 'application/pdf' });
    }
  },

  async exportRevenueReport(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf';
  }): Promise<Blob> {
    const revenue = await this.getRevenueData(params.startDate, params.endDate);

    if (params.format === 'csv') {
      const csv = 'Date,Revenue,Subscriptions\n' +
        revenue.map(r => `${r.date},${r.amount},${r.subscriptions}`).join('\n');
      return new Blob([csv], { type: 'text/csv' });
    } else {
      return new Blob(['PDF Revenue Report'], { type: 'application/pdf' });
    }
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

## ISSUE 3: CHART ACCESSIBILITY (Week 5 - 1h)

**Agent 003**

```typescript
// ✅ Add descriptive labels and ARIA
<div role="img" aria-label="User growth chart showing monthly active users over the past year">
  <canvas ref={chartRef} />
</div>

// ✅ Provide data table alternative
<details className="mt-4">
  <summary className="text-vision-blue-600 cursor-pointer">
    View data table
  </summary>
  <table className="min-w-full mt-2">
    <caption>User growth data by month</caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        <th scope="col">Active Users</th>
      </tr>
    </thead>
    <tbody>
      {chartData.map((row, i) => (
        <tr key={i}>
          <td>{row.month}</td>
          <td>{row.users}</td>
        </tr>
      ))}
    </tbody>
  </table>
</details>
```

---

## SUCCESS CRITERIA

- ✅ Charts use Bold Color System
- ✅ Export CSV works
- ✅ Export PDF works
- ✅ Charts accessible

---

# PAGE 24: HELP (`/help`)

## 🔴 CRITICAL: 404 ERROR!

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/help/page.tsx`
**Priority:** P0 - Critical (404!)
**Total Effort:** 0.5-4 hours
**Timeline:** Week 1 Friday

**Problem:** Help page link exists but page returns 404

**Options:**
1. **Remove** link from navigation (0.5h)
2. **Redirect** to external docs (0.5h)
3. **Build** full help page (4h)

**Agent:** 001 or 004 - Week 1 Friday (after decision)

---

## OPTION 1: REMOVE (0.5h - RECOMMENDED IF NO DOCS)

```typescript
// File: apps/shell/src/components/Navigation.tsx
// Simply remove the help link from nav array

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Applications', href: '/applications' },
  // DELETE: { label: 'Help', href: '/help' },
];
```

---

## OPTION 2: REDIRECT (0.5h - RECOMMENDED IF EXTERNAL DOCS EXIST)

```typescript
// File: apps/shell/src/app/help/page.tsx
import { redirect } from 'next/navigation';

export default function HelpPage() {
  redirect('https://docs.visionplatform.com');
}
```

---

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
            <li>
              <a href="/help/faq" className="text-vision-blue-600 hover:text-vision-blue-700">
                Frequently Asked Questions
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-vision-surface-secondary rounded-lg p-6">
          <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
            Features
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
            <li>
              <a href="/help/notifications" className="text-vision-blue-600 hover:text-vision-blue-700">
                Notifications
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-vision-surface-secondary rounded-lg p-6">
          <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
            Support
          </h2>
          <p className="text-vision-text-secondary mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-3">
            <GlowButton onClick={() => window.open('mailto:support@visionplatform.com')}>
              Email Support
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => window.open('https://status.visionplatform.com')}>
              System Status
            </GlowButton>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## DECISION REQUIRED

**Before starting, decide which option:**
- Option 1 if no help docs exist
- Option 2 if external docs exist
- Option 3 if building in-app help

---

## SUCCESS CRITERIA

- ✅ 404 error resolved
- ✅ Users can access help (or link removed)
- ✅ Navigation updated accordingly
- ✅ All tests pass

---

# UNIVERSAL EXECUTION WORKFLOW (ALL PAGES 18-24)

```bash
# 1. Setup
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-[N]-[name]
pnpm install

# 2. Self-Review (MANDATORY)
cat [target-file]
grep -rn "[pattern]" [target-file]

# 3. Make Changes
# Follow your agent's code examples

# 4. Validate (ALL MUST PASS)
pnpm type-check
pnpm lint
pnpm validate:colors       # Agent 001
pnpm validate:components   # Agent 002
pnpm test [file]
pnpm build

# 5. Manual Test
pnpm dev

# 6. Create PR
git add [files]
git commit -m "fix(page-[N]): [work]"
git push && gh pr create
```

---

# UNIVERSAL SUCCESS CRITERIA

### All Agents Must Verify:
- ✅ Complete agent prompt read
- ✅ Self-review performed
- ✅ ALL issues fixed
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85%)
- ✅ `pnpm build` succeeds
- ✅ Manual testing complete
- ✅ PR created

---

# QUICK REFERENCE

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

### Files by Page
- **Page 18:** `apps/shell/src/app/admin/organizations/page.tsx`
- **Page 19:** `apps/shell/src/app/admin/users/page.tsx`
- **Page 20:** `apps/shell/src/app/admin/apps/page.tsx`
- **Page 21:** `apps/shell/src/app/admin/billing/page.tsx`
- **Page 22:** `apps/shell/src/app/admin/settings/page.tsx`
- **Page 23:** `apps/shell/src/app/admin/analytics/page.tsx`
- **Page 24:** `apps/shell/src/app/help/page.tsx`
