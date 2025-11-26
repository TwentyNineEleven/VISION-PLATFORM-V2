# AGENT START PROMPTS: PAGES 11-15

This document contains individual agent prompts for Pages 11-15. Each section is standalone and can be used independently.

---

# PAGE 11: SETTINGS — TEAM (`/settings/team`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/settings/team/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 8 hours
**Timeline:** Week 2-4

**Issues:**
- 3 color violations
- 2 selects, 1 input, 3 buttons → Glow UI
- Invite/resend/remove team member functionality

**Agents:**
1. Agent 001 - Week 2 Thursday - 2 hours
2. Agent 002 - Week 2 Friday - 4 hours
3. Agent 004 - Week 4 Tuesday - 2 hours

---

## ⚠️ MANDATORY: AGENT ADHERENCE

1. ✅ Read complete agent-specific prompt
2. ✅ Follow ALL steps
3. ✅ Perform self-review for additional issues
4. ✅ Fix ALL issues found
5. ✅ Run ALL validation commands

---

## PRE-WORK READING

1. `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md` - Page 11
2. Your agent-specific prompt (COMPLETE reading required)
3. `AGENT_EXECUTION_GUIDE.md`
4. `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## ISSUE 1: 3 COLOR VIOLATIONS (Week 2 Thu - 2h)

**Agent 001**

### Self-Review
```bash
cat apps/shell/src/app/settings/team/page.tsx
grep -rn "gray-\|#[0-9a-fA-F]" apps/shell/src/app/settings/team/page.tsx
pnpm validate:colors
```

### Expected Fixes
```typescript
// ❌ BEFORE
<div className="bg-gray-100 border-gray-300">
  <span className="text-gray-700">Team Members</span>
</div>

// ✅ AFTER
<div className="bg-vision-surface-secondary border-vision-border-default">
  <span className="text-vision-text-secondary">Team Members</span>
</div>
```

---

## ISSUE 2: COMPONENT MIGRATION (Week 2 Fri - 4h)

**Agent 002**

### Components to Migrate
- 2 native selects (role selector, status filter)
- 1 native input (email input for invite)
- 3 native buttons (Invite, Resend, Remove)

### Self-Review
```bash
grep -rn "<select\|<input\|<button" apps/shell/src/app/settings/team/page.tsx
pnpm validate:components
```

### Expected Migration
```typescript
// ❌ BEFORE
<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="admin">Admin</option>
  <option value="member">Member</option>
</select>

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="team@example.com"
/>

<button onClick={handleInvite}>Invite</button>
<button onClick={handleResend}>Resend</button>
<button onClick={handleRemove}>Remove</button>

// ✅ AFTER
import { GlowSelect, GlowInput, GlowButton } from '@vision/design-system';

<GlowSelect
  label="Role"
  value={role}
  onChange={(value) => setRole(value)}  // Note: direct value, not event
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>

<GlowInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="team@example.com"
  error={errors.email}
/>

<GlowButton onClick={handleInvite}>Invite Member</GlowButton>
<GlowButton variant="ghost" onClick={handleResend}>Resend Invite</GlowButton>
<GlowButton variant="destructive" onClick={handleRemove}>Remove Member</GlowButton>
```

---

## ISSUE 3: TEAM ACTIONS (Week 4 Tue - 2h)

**Agent 004**

### Types & Service Layer

**File:** `apps/shell/src/types/team.ts`
```typescript
export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'invited';
  invitedAt?: string;
  joinedAt?: string;
}

export interface TeamInvite {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}
```

**File:** `apps/shell/src/services/teamService.ts`
```typescript
import type { TeamMember, TeamInvite } from '@/types/team';

export const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const members = localStorage.getItem('team_members');
    return members ? JSON.parse(members) : [];
  },

  async inviteMember(invite: TeamInvite): Promise<TeamMember> {
    // Validate email
    if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
      throw new Error('Invalid email address');
    }

    // Check for duplicate
    const members = await this.getTeamMembers();
    if (members.some(m => m.email === invite.email)) {
      throw new Error('This email is already invited or is a member');
    }

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      email: invite.email,
      name: invite.email.split('@')[0],
      role: invite.role,
      status: 'invited',
      invitedAt: new Date().toISOString(),
    };

    members.push(newMember);
    localStorage.setItem('team_members', JSON.stringify(members));
    return newMember;
  },

  async resendInvite(memberId: string): Promise<void> {
    const members = await this.getTeamMembers();
    const member = members.find(m => m.id === memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    if (member.status !== 'invited' && member.status !== 'pending') {
      throw new Error('Can only resend invites to pending members');
    }

    // Update invited timestamp
    member.invitedAt = new Date().toISOString();
    localStorage.setItem('team_members', JSON.stringify(members));
  },

  async removeMember(memberId: string): Promise<void> {
    const members = await this.getTeamMembers();
    const filtered = members.filter(m => m.id !== memberId);

    if (filtered.length === members.length) {
      throw new Error('Member not found');
    }

    localStorage.setItem('team_members', JSON.stringify(filtered));
  },

  async updateMemberRole(memberId: string, newRole: TeamMember['role']): Promise<void> {
    const members = await this.getTeamMembers();
    const member = members.find(m => m.id === memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    member.role = newRole;
    localStorage.setItem('team_members', JSON.stringify(members));
  },
};
```

### Component Implementation
```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowButton, GlowInput, GlowSelect } from '@vision/design-system';
import { teamService } from '@/services/teamService';
import type { TeamMember } from '@/types/team';

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await teamService.getTeamMembers();
    setMembers(data);
  };

  const handleInvite = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await teamService.inviteMember({ email, role });
      setEmail('');
      setRole('member');
      await loadMembers();
      setSuccess(`Invitation sent to ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (memberId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      await teamService.resendInvite(memberId);
      setSuccess('Invitation resent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Remove ${memberEmail} from the team?`)) return;

    setError(null);
    setIsLoading(true);

    try {
      await teamService.removeMember(memberId);
      await loadMembers();
      setSuccess('Member removed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-vision-text-primary text-2xl font-bold mb-6">
        Team Members
      </h1>

      {error && (
        <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-vision-success-50 border border-vision-success-200 text-vision-success-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-vision-surface-secondary rounded-lg p-6 mb-6">
        <h2 className="text-vision-text-primary font-semibold mb-4">
          Invite New Member
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GlowInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <GlowSelect
              label="Role"
              value={role}
              onChange={(value) => setRole(value as any)}
              options={[
                { value: 'viewer', label: 'Viewer' },
                { value: 'member', label: 'Member' },
                { value: 'admin', label: 'Admin' },
              ]}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-4">
          <GlowButton
            onClick={handleInvite}
            disabled={isLoading || !email}
          >
            Send Invitation
          </GlowButton>
        </div>
      </div>

      <div className="bg-vision-surface-primary rounded-lg border border-vision-border-default">
        <table className="min-w-full">
          <thead className="bg-vision-surface-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-vision-text-secondary">Name</th>
              <th className="px-6 py-3 text-left text-vision-text-secondary">Email</th>
              <th className="px-6 py-3 text-left text-vision-text-secondary">Role</th>
              <th className="px-6 py-3 text-left text-vision-text-secondary">Status</th>
              <th className="px-6 py-3 text-right text-vision-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vision-border-subtle">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 text-vision-text-primary">{member.name}</td>
                <td className="px-6 py-4 text-vision-text-secondary">{member.email}</td>
                <td className="px-6 py-4 text-vision-text-secondary capitalize">{member.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    member.status === 'active'
                      ? 'bg-vision-success-100 text-vision-success-700'
                      : 'bg-vision-warning-100 text-vision-warning-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {(member.status === 'invited' || member.status === 'pending') && (
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResend(member.id)}
                        disabled={isLoading}
                      >
                        Resend
                      </GlowButton>
                    )}
                    <GlowButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(member.id, member.email)}
                      disabled={isLoading}
                    >
                      Remove
                    </GlowButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## EXECUTION WORKFLOW

```bash
# Setup
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-11-settings-team
pnpm install

# Self-review
cat apps/shell/src/app/settings/team/page.tsx

# Make changes

# Validate
pnpm type-check
pnpm lint
pnpm validate:colors       # Agent 001
pnpm validate:components   # Agent 002
pnpm test apps/shell/src/app/settings/team/page.test.tsx
pnpm build

# Manual test
pnpm dev

# Create PR
git add [files]
git commit -m "fix(page-11): [work]"
git push && gh pr create
```

---

## SUCCESS CRITERIA

- ✅ All validation commands pass
- ✅ Self-review performed
- ✅ All issues fixed
- ✅ Tests ≥85% coverage
- ✅ Manual testing complete

---

# PAGE 12: SETTINGS — APPS (`/settings/apps`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/settings/apps/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 4 hours
**Timeline:** Week 2-4

**Issues:**
- 1 color violation (text-emerald-500)
- 1 native switch → GlowSwitch
- Enable/disable apps persistence

**Agents:**
1. Agent 001 - Week 2 Thursday - 1 hour
2. Agent 002 - Week 2 - 2 hours
3. Agent 004 - Week 4 - 1 hour

---

## ISSUE 1: COLOR VIOLATION (1h)

**Agent 001**

```typescript
// ❌ BEFORE
<span className="text-emerald-500">Enabled</span>

// ✅ AFTER
<span className="text-vision-success-600">Enabled</span>
```

---

## ISSUE 2: SWITCH COMPONENT (2h)

**Agent 002**

```typescript
// ❌ BEFORE
<input
  type="checkbox"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>

// ✅ AFTER
import { GlowSwitch } from '@vision/design-system';

<GlowSwitch
  checked={enabled}
  onCheckedChange={(checked) => setEnabled(checked)}
  aria-label={`${enabled ? 'Disable' : 'Enable'} ${app.name}`}
/>
```

---

## ISSUE 3: TOGGLE PERSISTENCE (1h)

**Agent 004**

**Service:** `apps/shell/src/services/appSettingsService.ts`
```typescript
export const appSettingsService = {
  async getAppSettings(): Promise<Record<string, boolean>> {
    const settings = localStorage.getItem('app_settings');
    return settings ? JSON.parse(settings) : {};
  },

  async toggleApp(appId: string, enabled: boolean): Promise<void> {
    const settings = await this.getAppSettings();
    settings[appId] = enabled;
    localStorage.setItem('app_settings', JSON.stringify(settings));
  },
};
```

---

# PAGE 13: SETTINGS — BILLING (`/settings/billing`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/settings/billing/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 11 hours (COMPLEX)
**Timeline:** Week 2-5

**Issues:**
- Minor color cleanup
- Table caption, status labels (accessibility)
- ALL billing actions (upgrade, downgrade, update payment, cancel - Week 4 Monday FULL DAY)

**Agents:**
1. Agent 001 - Week 2 - 1 hour
2. Agent 003 - Week 5 - 2 hours
3. Agent 004 - Week 4 Monday - 8 hours (COMPLEX)

---

## ISSUE 3: BILLING ACTIONS (Week 4 Mon - 8h)

**Agent 004** - FULL DAY COMPLEX TASK

### Types
```typescript
export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  billingCycle: 'monthly' | 'yearly';
  price: number;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
}
```

### Service Layer
```typescript
export const billingService = {
  async getSubscription(): Promise<Subscription | null> {
    const sub = localStorage.getItem('subscription');
    return sub ? JSON.parse(sub) : null;
  },

  async upgradePlan(newPlan: 'pro' | 'enterprise'): Promise<Subscription> {
    const sub = await this.getSubscription();
    const updated: Subscription = {
      ...sub!,
      plan: newPlan,
      price: newPlan === 'pro' ? 29 : 99,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('subscription', JSON.stringify(updated));
    return updated;
  },

  async downgradePlan(newPlan: 'free' | 'pro'): Promise<Subscription> {
    const sub = await this.getSubscription();
    const updated: Subscription = {
      ...sub!,
      plan: newPlan,
      price: newPlan === 'free' ? 0 : 29,
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('subscription', JSON.stringify(updated));
    return updated;
  },

  async updatePaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<void> {
    const methods = await this.getPaymentMethods();
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...paymentMethod,
      isDefault: true,
    };
    methods.forEach(m => m.isDefault = false);
    methods.push(newMethod);
    localStorage.setItem('payment_methods', JSON.stringify(methods));
  },

  async cancelSubscription(): Promise<void> {
    const sub = await this.getSubscription();
    if (sub) {
      sub.cancelAtPeriodEnd = true;
      sub.status = 'cancelled';
      localStorage.setItem('subscription', JSON.stringify(sub));
    }
  },

  async getInvoices(): Promise<Invoice[]> {
    const invoices = localStorage.getItem('invoices');
    return invoices ? JSON.parse(invoices) : [];
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const methods = localStorage.getItem('payment_methods');
    return methods ? JSON.parse(methods) : [];
  },
};
```

**Success Criteria:**
- ✅ Upgrade plan works
- ✅ Downgrade plan works
- ✅ Update payment method works
- ✅ Cancel subscription works
- ✅ View invoices works
- ✅ All data persists
- ✅ Error handling complete
- ✅ Loading states work

---

# PAGE 14: FUNDER DASHBOARD (`/funder`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/funder/page.tsx`
**Priority:** P1 - High
**Total Effort:** 8 hours
**Timeline:** Week 3-5

**Issues:**
- 5 inline colors
- Review grant applications CTAs
- Labels and keyboard navigation

**Agents:**
1. Agent 001 - Week 3 Tuesday - 2 hours
2. Agent 004 - Week 5 - 4 hours
3. Agent 003 - Week 5 - 2 hours

---

## ISSUE 2: REVIEW ACTIONS (Week 5 - 4h)

**Agent 004**

### Service Layer
```typescript
export interface GrantApplication {
  id: string;
  applicantName: string;
  organizationName: string;
  amountRequested: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  description: string;
}

export const grantReviewService = {
  async getApplications(): Promise<GrantApplication[]> {
    const apps = localStorage.getItem('grant_applications');
    return apps ? JSON.parse(apps) : [];
  },

  async approveApplication(appId: string, notes?: string): Promise<void> {
    const apps = await this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = 'approved';
      app.reviewedAt = new Date().toISOString();
      app.reviewNotes = notes;
      localStorage.setItem('grant_applications', JSON.stringify(apps));
    }
  },

  async rejectApplication(appId: string, reason: string): Promise<void> {
    const apps = await this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = 'rejected';
      app.reviewedAt = new Date().toISOString();
      app.rejectionReason = reason;
      localStorage.setItem('grant_applications', JSON.stringify(apps));
    }
  },

  async requestMoreInfo(appId: string, message: string): Promise<void> {
    const apps = await this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = 'under_review';
      app.infoRequest = message;
      localStorage.setItem('grant_applications', JSON.stringify(apps));
    }
  },
};
```

---

# PAGE 15: FUNDER — GRANTEES (`/funder/grantees`)

## EXECUTIVE SUMMARY

**File:** `apps/shell/src/app/funder/grantees/page.tsx`
**Priority:** P0 - Critical
**Total Effort:** 10 hours
**Timeline:** Week 3-5

**Issues:**
- 3 RGB color bars
- 2 selects, 1 input → Glow UI
- Invite grantee form
- Table caption accessibility

**Agents:**
1. Agent 001 - Week 3 Tuesday - 3 hours
2. Agent 002 - Week 4 - 3 hours
3. Agent 004 - Week 4 Wednesday - 2 hours
4. Agent 003 - Week 5 - 2 hours

---

## ISSUE 1: RGB COLOR BARS (3h)

**Agent 001**

```typescript
// ❌ BEFORE - RGB progress bars
<div style={{
  backgroundColor: `rgb(${Math.round(progress * 255)}, ${Math.round((1-progress) * 255)}, 0)`
}}>
  Progress: {progress}%
</div>

// ✅ AFTER - Use proper color classes
<div className="bg-vision-success-600">
  <div
    className="bg-vision-success-200 h-2 rounded transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## ISSUE 3: INVITE GRANTEE (Week 4 Wed - 2h)

**Agent 004**

```typescript
export interface Grantee {
  id: string;
  name: string;
  email: string;
  organizationName: string;
  status: 'active' | 'invited' | 'inactive';
  totalGranted: number;
  invitedAt?: string;
}

export const granteeService = {
  async inviteGrantee(data: {
    name: string;
    email: string;
    organizationName: string;
  }): Promise<Grantee> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email address');
    }

    const grantees = await this.getGrantees();
    if (grantees.some(g => g.email === data.email)) {
      throw new Error('Grantee with this email already exists');
    }

    const newGrantee: Grantee = {
      id: `grantee_${Date.now()}`,
      ...data,
      status: 'invited',
      totalGranted: 0,
      invitedAt: new Date().toISOString(),
    };

    grantees.push(newGrantee);
    localStorage.setItem('grantees', JSON.stringify(grantees));
    return newGrantee;
  },

  async getGrantees(): Promise<Grantee[]> {
    const grantees = localStorage.getItem('grantees');
    return grantees ? JSON.parse(grantees) : [];
  },
};
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
pnpm validate:colors       # or validate:components

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
# Navigate to page and test thoroughly

# 6. Create PR
git add [files]
git commit -m "fix(page-[N]): [description]

- [change 1]
- [change 2]

Agent: [number]
Effort: [X] hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin [branch]
gh pr create --title "fix(page-[N]): [title]"
```

---

## UNIVERSAL SUCCESS CRITERIA (ALL PAGES, ALL AGENTS)

### Required for ALL Agents:
- ✅ Complete agent-specific prompt read
- ✅ Self-review performed
- ✅ Additional issues documented
- ✅ ALL issues fixed (not just listed)
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85% coverage)
- ✅ `pnpm build` succeeds
- ✅ Manual testing complete
- ✅ PR created with documentation

### Agent-Specific:
**Agent 001:**
- ✅ `pnpm validate:colors` passes (0 violations)
- ✅ All colors use Bold Color System tokens
- ✅ No hex, RGB, or Tailwind gray colors

**Agent 002:**
- ✅ `pnpm validate:components` passes (0 violations)
- ✅ All native HTML replaced with Glow UI
- ✅ onChange signatures correct

**Agent 003:**
- ✅ All interactive elements keyboard accessible
- ✅ All icon buttons have aria-labels
- ✅ WCAG 2.1 AA compliant
- ✅ Screen reader tested

**Agent 004:**
- ✅ Service layer implemented
- ✅ Data persists in localStorage
- ✅ Form validation works
- ✅ Error handling complete
- ✅ Loading states work

---

## QUICK REFERENCE

### Files by Page
- **Page 11:** `apps/shell/src/app/settings/team/page.tsx`
- **Page 12:** `apps/shell/src/app/settings/apps/page.tsx`
- **Page 13:** `apps/shell/src/app/settings/billing/page.tsx`
- **Page 14:** `apps/shell/src/app/funder/page.tsx`
- **Page 15:** `apps/shell/src/app/funder/grantees/page.tsx`

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

### Documentation
- Master Plan: `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Agent Prompts: `AGENT_PROMPT_[SPECIALTY]_SPECIALIST.md`
- Execution Guide: `AGENT_EXECUTION_GUIDE.md`
- Remediation Plan: `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## READY TO START?

```bash
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-[number]
pnpm install
```

**Then proceed based on your agent role and page assignment.**
