# AGENT START PROMPT: PAGE 7 - NOTIFICATIONS (`/notifications`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 7: Notifications** (`/notifications`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/notifications/page.tsx`
- **Priority:** P1 - High
- **Total Effort:** 4 hours
- **Execution Timeline:** Week 2-5

**Issues to Fix:**
- 1 opacity hack (color violation)
- Missing persistence for mark as read/delete actions
- Missing icon button labels (accessibility)

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 2 Monday - 1 hour
2. **Agent 004** (CTA Functionality) - Week 4 - 2 hours
3. **Agent 003** (Accessibility) - Week 5 - 1 hour

**Success Criteria:**
- ✅ Opacity hack replaced with Bold Color System token
- ✅ Mark as read functionality working
- ✅ Delete notification functionality working
- ✅ Mark all as read functionality working
- ✅ Notifications persist in localStorage
- ✅ All icon buttons have proper aria-label
- ✅ Keyboard navigation works
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 7 section
- Understand all issues and priorities
- Note the agent assignments and timeline

### 2. Your Agent-Specific Prompt
**Determine which agent you are:**
- **Agent 001 (Colors)?** Read `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md`
- **Agent 003 (Accessibility)?** Read `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md`
- **Agent 004 (CTAs)?** Read `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

### 3. Execution Guide
**File:** `documentation/platform/AGENT_EXECUTION_GUIDE.md`
- Review conflict prevention matrix
- Understand handoff procedures
- Check scheduling requirements

### 4. Remediation Plan
**File:** `documentation/platform/VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`
- Review the 7-week roadmap
- Understand the 18-step workflow
- Review pre-merge quality gate (8 checks)

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: COLOR VIOLATION - OPACITY HACK (Week 2 Monday - 1 hour)

**Agent:** 001 (Color Compliance Specialist)

**Assignment:** Fix 1 opacity hack violation

**Current Violation:**
```typescript
// ❌ BEFORE - Opacity hack with inline color
<div className="bg-primary/10">
  <div className="p-4">
    <h3 className="text-gray-900">Notification Title</h3>
    <p className="text-gray-600">Notification message</p>
  </div>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-blue-50">
  <div className="p-4">
    <h3 className="text-vision-text-primary">Notification Title</h3>
    <p className="text-vision-text-secondary">Notification message</p>
  </div>
</div>
```

**Bold Color System v3.0 Tokens to Use:**

**Backgrounds:**
- `bg-vision-blue-50` - Subtle blue background (replaces bg-primary/10)
- `bg-vision-surface-primary` - Main background
- `bg-vision-surface-secondary` - Card backgrounds
- `bg-vision-blue-100` - Hover states

**Text:**
- `text-vision-text-primary` - Primary text (90% opacity)
- `text-vision-text-secondary` - Secondary text (60% opacity)
- `text-vision-text-tertiary` - Tertiary text (38% opacity)

**Interactive States:**
- `hover:bg-vision-blue-100` - Hover backgrounds
- `hover:bg-vision-surface-secondary` - Hover for unread items

**Validation Commands:**
```bash
# Run color validation
pnpm validate:colors

# Expected output: 0 violations in apps/shell/src/app/notifications/page.tsx

# Run type-check
pnpm type-check

# Run tests
pnpm test apps/shell/src/app/notifications/page.test.tsx
```

**Success Criteria:**
- ✅ Opacity hack removed (no bg-*/10, bg-*/20, etc.)
- ✅ Bold Color System tokens used
- ✅ No inline hex colors
- ✅ Color validation script passes
- ✅ Visual consistency maintained

---

### ISSUE 2: PERSISTENCE - MARK AS READ/DELETE (Week 4 - 2 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement mark as read, delete, and mark all as read functionality

#### Step 1: Create Types
**File:** `apps/shell/src/types/notification.ts`

```typescript
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationFilters {
  showRead: boolean;
  showUnread: boolean;
  type?: Notification['type'];
}
```

#### Step 2: Create Notification Service
**File:** `apps/shell/src/services/notificationService.ts`

```typescript
import type { Notification } from '@/types/notification';

export const notificationService = {
  /**
   * Get all notifications
   */
  async getNotifications(): Promise<Notification[]> {
    const notifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    );
    // Sort by createdAt descending (newest first)
    return notifications.sort(
      (a: Notification, b: Notification) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const filtered = notifications.filter((n) => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<void> {
    const notifications = await this.getNotifications();
    const filtered = notifications.filter((n) => !n.read);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const notifications = await this.getNotifications();
    return notifications.filter((n) => !n.read).length;
  },

  /**
   * Create a new notification (for testing/demo purposes)
   */
  async createNotification(
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const notifications = await this.getNotifications();
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    return newNotification;
  },
};
```

#### Step 3: Update Component
**File:** `apps/shell/src/app/notifications/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowButton } from '@vision/design-system';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types/notification';
import {
  CheckIcon,
  TrashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError('Failed to mark as read');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError('Failed to mark all as read');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;

    // Confirm before deleting
    if (
      !confirm(
        `Delete notification "${notification.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.deleteNotification(id);
      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllRead = async () => {
    const readCount = notifications.filter((n) => n.read).length;

    if (readCount === 0) {
      return;
    }

    if (!confirm(`Delete ${readCount} read notification(s)? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.deleteAllRead();
      // Update local state
      setNotifications((prev) => prev.filter((n) => !n.read));
    } catch (err) {
      setError('Failed to delete read notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-vision-success-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-vision-warning-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-vision-error-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-vision-blue-600" />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-vision-text-primary text-3xl font-bold">
            Notifications
          </h1>
          <p className="text-vision-text-secondary mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2">
          <GlowButton
            variant="ghost"
            onClick={handleMarkAllAsRead}
            disabled={isLoading || unreadCount === 0}
            aria-label="Mark all notifications as read"
          >
            Mark All Read
          </GlowButton>

          <GlowButton
            variant="ghost"
            onClick={handleDeleteAllRead}
            disabled={isLoading || notifications.filter((n) => n.read).length === 0}
            aria-label="Delete all read notifications"
          >
            Delete Read
          </GlowButton>
        </div>
      </div>

      {error && (
        <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <GlowButton
          variant={filter === 'all' ? 'primary' : 'ghost'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({notifications.length})
        </GlowButton>
        <GlowButton
          variant={filter === 'unread' ? 'primary' : 'ghost'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </GlowButton>
      </div>

      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-vision-surface-secondary rounded-lg p-8 text-center">
            <p className="text-vision-text-secondary">
              {filter === 'unread'
                ? 'No unread notifications'
                : 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                bg-vision-surface-secondary rounded-lg p-4
                ${!notification.read ? 'bg-vision-blue-50' : ''}
                hover:bg-vision-blue-100 transition-colors
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-vision-text-primary font-medium">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-vision-blue-100 text-vision-blue-700">
                          New
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <GlowButton
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={isLoading}
                          aria-label={`Mark "${notification.title}" as read`}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </GlowButton>
                      )}

                      <GlowButton
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(notification.id)}
                        disabled={isLoading}
                        aria-label={`Delete "${notification.title}" notification`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </GlowButton>
                    </div>
                  </div>

                  <p className="text-vision-text-secondary text-sm mt-1">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-vision-text-tertiary text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>

                    {notification.actionUrl && notification.actionLabel && (
                      <GlowButton
                        variant="link"
                        size="sm"
                        onClick={() => {
                          // Handle action
                          window.location.href = notification.actionUrl!;
                        }}
                      >
                        {notification.actionLabel}
                      </GlowButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Validation Commands:**
```bash
# Type-check
pnpm type-check

# Run tests
pnpm test apps/shell/src/app/notifications/page.test.tsx

# Test in browser
pnpm dev
# Navigate to /notifications and test all actions
```

**Success Criteria:**
- ✅ Mark as read works for individual notifications
- ✅ Mark all as read works
- ✅ Delete notification works
- ✅ Delete all read works
- ✅ Notifications persist in localStorage
- ✅ Unread count updates correctly
- ✅ Filter works (all/unread)
- ✅ Proper user feedback (confirmation dialogs)
- ✅ Error handling works
- ✅ Loading states work

---

### ISSUE 3: ACCESSIBILITY - ICON BUTTON LABELS (Week 5 - 1 hour)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Add proper aria-label to all icon buttons

**Current Problem:**
```typescript
// ❌ BEFORE - No aria-label
<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleMarkAsRead(notification.id)}
>
  <CheckIcon className="w-4 h-4" />
</GlowButton>

<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleDelete(notification.id)}
>
  <TrashIcon className="w-4 h-4" />
</GlowButton>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Descriptive aria-label
<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleMarkAsRead(notification.id)}
  aria-label={`Mark "${notification.title}" as read`}
>
  <CheckIcon className="w-4 h-4" />
</GlowButton>

<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleDelete(notification.id)}
  aria-label={`Delete "${notification.title}" notification`}
>
  <TrashIcon className="w-4 h-4" />
</GlowButton>
```

**Accessibility Checklist:**

1. **Icon Buttons:**
   - ✅ All icon buttons have descriptive aria-label
   - ✅ Labels include context (notification title)
   - ✅ Labels describe the action clearly

2. **Keyboard Navigation:**
   - ✅ All buttons accessible via Tab
   - ✅ Enter/Space trigger actions
   - ✅ Focus visible on all interactive elements
   - ✅ Logical tab order (filter → actions → notifications → individual actions)

3. **Screen Reader Support:**
   - ✅ Unread count announced
   - ✅ Notification type announced (via icon alt or sr-only text)
   - ✅ "New" badge announced for unread items
   - ✅ Confirmation dialogs work with screen readers

4. **Visual Indicators:**
   - ✅ Focus rings visible
   - ✅ Disabled states clear
   - ✅ Unread notifications visually distinct

**Additional Enhancements:**

```typescript
// Add sr-only text for unread badge
{!notification.read && (
  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-vision-blue-100 text-vision-blue-700">
    New
    <span className="sr-only">unread notification</span>
  </span>
)}

// Add live region for feedback
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {error && error}
  {isLoading && 'Processing...'}
</div>

// Ensure filter buttons have proper roles
<div role="tablist" aria-label="Notification filters" className="flex gap-2 mb-4">
  <GlowButton
    role="tab"
    aria-selected={filter === 'all'}
    aria-controls="notifications-list"
    variant={filter === 'all' ? 'primary' : 'ghost'}
    onClick={() => setFilter('all')}
    size="sm"
  >
    All ({notifications.length})
  </GlowButton>
  <GlowButton
    role="tab"
    aria-selected={filter === 'unread'}
    aria-controls="notifications-list"
    variant={filter === 'unread' ? 'primary' : 'ghost'}
    onClick={() => setFilter('unread')}
    size="sm"
  >
    Unread ({unreadCount})
  </GlowButton>
</div>

<div id="notifications-list" role="tabpanel">
  {/* Notification list */}
</div>
```

**Validation Commands:**
```bash
# Run accessibility tests
pnpm test apps/shell/src/app/notifications/page.test.tsx

# Manual keyboard testing:
# 1. Tab through all interactive elements
# 2. Verify focus indicators visible
# 3. Test Enter/Space on buttons
# 4. Verify screen reader announcements (use VoiceOver/NVDA)

# Run axe accessibility checker
# (Tests should include jest-axe checks)
```

**Success Criteria:**
- ✅ All icon buttons have aria-label
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Screen reader support complete
- ✅ WCAG 2.1 AA compliant
- ✅ No axe violations

---

## EXECUTION WORKFLOW

Follow these steps in order:

### Step 1: Setup
```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Create feature branch based on your agent
# Agent 001 (Colors):
git checkout -b fix/colors-page-7-notifications

# Agent 003 (Accessibility):
git checkout -b fix/a11y-page-7-notifications

# Agent 004 (CTAs):
git checkout -b fix/ctas-page-7-notifications

# Install dependencies
pnpm install
```

### Step 2: Identify Your Role
Determine which agent you are and what work you need to do:
- **Agent 001?** Fix opacity hack (Week 2 Monday - 1 hour)
- **Agent 004?** Implement persistence (Week 4 - 2 hours)
- **Agent 003?** Fix accessibility (Week 5 - 1 hour)

### Step 3: Read Your Specific Agent Prompt
Go to your agent-specific documentation:
- Agent 001: `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md`
- Agent 003: `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md`
- Agent 004: `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

Follow the exact workflow described in your agent prompt.

### Step 4: Make Changes
- Edit the files as specified in your section above
- Follow the code examples provided
- Ensure you're using Bold Color System tokens (Agent 001)
- Ensure proper service layer pattern (Agent 004)
- Ensure WCAG 2.1 AA compliance (Agent 003)

### Step 5: Run Validation
```bash
# Type-check
pnpm type-check

# Linting
pnpm lint

# Color validation (if Agent 001)
pnpm validate:colors

# Component validation
pnpm validate:components

# Run tests
pnpm test apps/shell/src/app/notifications/page.test.tsx

# Build
pnpm build
```

### Step 6: Manual Testing
```bash
# Start dev server
pnpm dev

# Test in browser:
# 1. Navigate to /notifications
# 2. Verify colors (Agent 001)
# 3. Test mark as read/delete (Agent 004)
# 4. Test keyboard navigation (Agent 003)
# 5. Test with screen reader if applicable
```

### Step 7: Create PR
```bash
# Stage changes
git add apps/shell/src/app/notifications/page.tsx
git add apps/shell/src/services/notificationService.ts  # If Agent 004
git add apps/shell/src/types/notification.ts  # If Agent 004

# Commit with descriptive message
git commit -m "fix(page-7): [Your agent's work]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Addresses Page 7 (Notifications) remediation
Agent: [Your agent number]
Effort: [X] hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
git push origin [your-branch-name]

# Create PR
gh pr create --title "fix(page-7): [Your agent's work]" --body "## Summary
[Describe changes]

## Testing
- [x] Type-check passes
- [x] Tests pass (≥85% coverage)
- [x] Build succeeds
- [x] Manual testing complete

## Agent
Agent [Your number]: [Your specialization]

Fixes Page 7 (Notifications) issues"
```

---

## SUCCESS CRITERIA

Before marking Page 7 complete, verify:

### Agent 001 (Colors):
- ✅ Opacity hack removed
- ✅ Bold Color System tokens used
- ✅ `pnpm validate:colors` passes

### Agent 004 (CTAs):
- ✅ Notification service created
- ✅ Mark as read works
- ✅ Delete notification works
- ✅ Mark all as read works
- ✅ Delete all read works
- ✅ localStorage persistence works
- ✅ Filter works (all/unread)

### Agent 003 (Accessibility):
- ✅ All icon buttons have aria-label
- ✅ Keyboard navigation works
- ✅ Screen reader support complete
- ✅ WCAG 2.1 AA compliant

### All Agents:
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85% coverage)
- ✅ `pnpm build` succeeds
- ✅ PR created with proper documentation
- ✅ Manual testing complete

---

## QUICK REFERENCE

### Files to Work On
- `apps/shell/src/app/notifications/page.tsx` - Main page component
- `apps/shell/src/services/notificationService.ts` - Service layer (Agent 004)
- `apps/shell/src/types/notification.ts` - Type definitions (Agent 004)
- `apps/shell/src/app/notifications/page.test.tsx` - Tests (Agent 006)

### Key Commands
```bash
pnpm type-check              # TypeScript validation
pnpm lint                    # ESLint
pnpm validate:colors         # Color compliance
pnpm validate:components     # Component compliance
pnpm test [file]             # Run tests
pnpm build                   # Production build
pnpm dev                     # Development server
```

### Design System References
- Bold Color System: `packages/design-system/src/tokens/colors.ts`
- Glow UI Components: `packages/design-system/src/components/`

---

## GETTING STARTED

1. Read the Pre-Work section (all 4 documents)
2. Create your feature branch
3. Identify your agent role
4. Read your agent-specific prompt
5. Make changes following the code examples above
6. Run all validation commands
7. Manual test in browser
8. Create PR with proper documentation

**Ready to start? Run:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-7-notifications
pnpm install
```

Then proceed to your section above based on your agent role.
