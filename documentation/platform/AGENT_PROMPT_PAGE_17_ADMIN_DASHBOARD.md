# AGENT START PROMPT: PAGE 17 - ADMIN DASHBOARD (`/admin`)

## 🔴 CRITICAL PRIORITY - BROKEN NAVIGATION!

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 17: Admin Dashboard** (`/admin`) as part of the VISION Platform V2 remediation project.

**⚠️ CRITICAL ISSUE:** The admin navigation is completely broken, preventing access to all admin features!

**Key Details:**
- **File:** `apps/shell/src/app/admin/page.tsx`
- **Priority:** P0 - Critical (NAVIGATION BROKEN!)
- **Total Effort:** 6 hours
- **Execution Timeline:** Week 1-4

**Issues to Fix:**
- **CRITICAL:** Broken admin navigation (Week 1 Friday)
- text-emerald color violation
- Platform stats and quick actions functionality

**Agents Involved:**
1. **Agent 001** (Color Compliance + Nav Fix) - Week 1 Friday (URGENT) - 3 hours
2. **Agent 004** (CTA Functionality) - Week 4 Thursday - 3 hours

**Success Criteria:**
- ✅ **CRITICAL: Admin navigation working**
- ✅ text-emerald color fixed
- ✅ Platform stats displaying
- ✅ Quick actions functional
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## ⚠️ CRITICAL: MANDATORY AGENT ADHERENCE

1. ✅ Read your complete agent-specific prompt
2. ✅ Follow EVERY step (no skipping)
3. ✅ **FIX NAVIGATION FIRST - THIS IS BLOCKING**
4. ✅ Run ALL validation commands
5. ✅ Perform self-review to find additional issues
6. ✅ Fix ALL issues found (not just listed ones)

---

## PRE-WORK: REQUIRED READING

1. **Master Plan:** `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md` - Page 17 section
2. **Your Agent Prompt:** Read your complete agent-specific prompt
3. **Execution Guide:** `AGENT_EXECUTION_GUIDE.md`
4. **Remediation Plan:** `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## 🔴 ISSUE 1: BROKEN NAVIGATION FIX + COLORS (Week 1 Friday - 3h) - CRITICAL!

**Agent:** 001 (Color Compliance Specialist)

**⚠️ THIS IS THE MOST CRITICAL ISSUE IN THE ENTIRE PROJECT**

The admin navigation is completely broken. Users cannot access any admin features. This MUST be fixed immediately.

### Navigation Fix

**Current Problem:**
```typescript
// ❌ BEFORE - Navigation not rendering or broken
<nav className="broken-nav-class">
  {/* Links not working or not rendering */}
</nav>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Working navigation with proper structure
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Organizations', href: '/admin/organizations', icon: '🏛️' },
    { label: 'Users', href: '/admin/users', icon: '👤' },
    { label: 'Apps', href: '/admin/apps', icon: '📱' },
    { label: 'Billing', href: '/admin/billing', icon: '💵' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  ];

  return (
    <nav className="bg-vision-surface-secondary border-b border-vision-border-default">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'text-vision-blue-600 border-b-2 border-vision-blue-600'
                      : 'text-vision-text-secondary hover:text-vision-text-primary hover:bg-vision-surface-primary'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
```

**Use in Admin Layout:**
```typescript
// File: apps/shell/src/app/admin/layout.tsx
import { AdminNavigation } from '@/components/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-vision-surface-primary">
      <AdminNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Color Violations

```typescript
// ❌ BEFORE
<span className="text-emerald-500">Active</span>
<div className="bg-gray-100">Stats</div>

// ✅ AFTER
<span className="text-vision-success-600">Active</span>
<div className="bg-vision-surface-secondary">Stats</div>
```

**Validation:**
```bash
pnpm validate:colors  # MUST pass
pnpm type-check      # MUST pass
pnpm build          # MUST succeed

# Manual test CRITICAL
pnpm dev
# Navigate to /admin
# Click every navigation link - ALL must work
```

**Success Criteria:**
- ✅ **CRITICAL: All admin nav links work**
- ✅ **CRITICAL: Can navigate to all admin pages**
- ✅ Active page highlighted correctly
- ✅ text-emerald color fixed
- ✅ All colors use Bold Color System

---

## ISSUE 2: PLATFORM STATS & QUICK ACTIONS (Week 4 Thursday - 3h)

**Agent:** 004 (CTA Functionality Specialist)

### Types
**File:** `apps/shell/src/types/admin.ts`
```typescript
export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalApps: number;
  revenue: number;
  revenueGrowth: number;
}
```

### Service
**File:** `apps/shell/src/services/adminService.ts`
```typescript
export const adminService = {
  async getPlatformStats(): Promise<PlatformStats> {
    // Mock data - in production, fetch from API
    return {
      totalUsers: 1247,
      activeUsers: 892,
      totalOrganizations: 156,
      totalApps: 24,
      revenue: 125400,
      revenueGrowth: 12.5,
    };
  },

  async getRecentActivity(): Promise<any[]> {
    const activities = localStorage.getItem('admin_activity');
    return activities ? JSON.parse(activities) : [];
  },

  async broadcastMessage(message: string): Promise<void> {
    const broadcast = {
      id: `msg_${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      sentBy: 'admin',
    };

    const messages = JSON.parse(localStorage.getItem('broadcasts') || '[]');
    messages.unshift(broadcast);
    localStorage.setItem('broadcasts', JSON.stringify(messages));
  },
};
```

### Component
```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowButton } from '@vision/design-system';
import { adminService } from '@/services/adminService';
import type { PlatformStats } from '@/types/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getPlatformStats();
      setStats(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-vision-text-primary text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-vision-text-secondary mt-1">
          Platform overview and quick actions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-vision-surface-secondary rounded-lg p-6">
          <p className="text-vision-text-tertiary text-sm">Total Users</p>
          <p className="text-vision-text-primary text-3xl font-bold mt-2">
            {stats?.totalUsers.toLocaleString()}
          </p>
          <p className="text-vision-success-600 text-sm mt-2">
            {stats?.activeUsers} active
          </p>
        </div>

        <div className="bg-vision-surface-secondary rounded-lg p-6">
          <p className="text-vision-text-tertiary text-sm">Organizations</p>
          <p className="text-vision-text-primary text-3xl font-bold mt-2">
            {stats?.totalOrganizations}
          </p>
        </div>

        <div className="bg-vision-surface-secondary rounded-lg p-6">
          <p className="text-vision-text-tertiary text-sm">Total Apps</p>
          <p className="text-vision-text-primary text-3xl font-bold mt-2">
            {stats?.totalApps}
          </p>
        </div>

        <div className="bg-vision-surface-secondary rounded-lg p-6">
          <p className="text-vision-text-tertiary text-sm">Revenue</p>
          <p className="text-vision-text-primary text-3xl font-bold mt-2">
            ${(stats?.revenue || 0).toLocaleString()}
          </p>
          <p className="text-vision-success-600 text-sm mt-2">
            +{stats?.revenueGrowth}% this month
          </p>
        </div>
      </div>

      <div className="bg-vision-surface-secondary rounded-lg p-6">
        <h2 className="text-vision-text-primary text-xl font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <GlowButton onClick={() => window.location.href = '/admin/users'}>
            Manage Users
          </GlowButton>
          <GlowButton onClick={() => window.location.href = '/admin/organizations'} variant="secondary">
            Manage Organizations
          </GlowButton>
          <GlowButton onClick={() => window.location.href = '/admin/apps'} variant="secondary">
            Manage Apps
          </GlowButton>
          <GlowButton onClick={() => window.location.href = '/admin/analytics'} variant="secondary">
            View Analytics
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Platform stats load and display
- ✅ Quick action buttons navigate correctly
- ✅ Data updates in real-time
- ✅ All CTAs functional

---

## EXECUTION WORKFLOW

```bash
# Setup - URGENT
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-17-admin-dashboard-CRITICAL
pnpm install

# Self-review
cat apps/shell/src/app/admin/page.tsx

# Make changes - FIX NAVIGATION FIRST!

# Validate
pnpm type-check
pnpm lint
pnpm validate:colors
pnpm test apps/shell/src/app/admin/page.test.tsx
pnpm build

# Manual test - CRITICAL
pnpm dev
# Test EVERY admin navigation link

# Create PR
git add [files]
git commit -m "fix(page-17): CRITICAL - Fix broken admin navigation + colors

- Fix broken admin navigation (BLOCKING ISSUE)
- Replace text-emerald with Bold Color System
- Add platform stats
- Add quick actions

CRITICAL FIX: Admin navigation now works
Agent: [number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin [branch]
gh pr create --title "fix(page-17): 🔴 CRITICAL - Fix broken admin navigation"
```

---

## SUCCESS CRITERIA

- ✅ **CRITICAL: Admin navigation works**
- ✅ **CRITICAL: All admin pages accessible**
- ✅ Colors use Bold Color System
- ✅ Stats display correctly
- ✅ Quick actions work
- ✅ All validation passes
- ✅ Tests pass (≥85% coverage)
- ✅ Manual testing complete

---

## QUICK REFERENCE

**Files:**
- `apps/shell/src/app/admin/page.tsx`
- `apps/shell/src/app/admin/layout.tsx` (create if needed)
- `apps/shell/src/components/AdminNavigation.tsx` (create)
- `apps/shell/src/services/adminService.ts` (Agent 004)
- `apps/shell/src/types/admin.ts` (Agent 004)

**Commands:**
```bash
pnpm type-check
pnpm lint
pnpm validate:colors
pnpm test [file]
pnpm build
pnpm dev
```

**Ready to start:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-17-admin-dashboard-CRITICAL
pnpm install
```

## ⚠️ REMEMBER: FIX THE NAVIGATION FIRST - THIS IS BLOCKING ALL ADMIN FUNCTIONALITY!
