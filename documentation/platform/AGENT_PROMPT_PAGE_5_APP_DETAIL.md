# AGENT START PROMPT: PAGE 5 - APP DETAIL (`/apps/[slug]`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 5: App Detail** (`/apps/[slug]`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/apps/[slug]/page.tsx`
- **Priority:** P1 - High
- **Total Effort:** 6 hours
- **Execution Timeline:** Week 2-4

**Issues to Fix:**
- 4 color violations (inline hex colors)
- Broken launch paths (non-functional CTAs)
- Missing keyboard navigation support

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 2 Monday - 2 hours
2. **Agent 004** (CTA Functionality) - Week 4 - 3 hours
3. **Agent 003** (Accessibility) - Week 5 - 1 hour

**Success Criteria:**
- ✅ All 4 color violations fixed (Bold Color System tokens)
- ✅ App launch functionality working with service layer
- ✅ Keyboard navigation fully functional
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 5 section
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

### ISSUE 1: COLOR VIOLATIONS (Week 2 Monday - 2 hours)

**Agent:** 001 (Color Compliance Specialist)

**Assignment:** Fix 4 inline hex/Tailwind color violations

**Current Violations:**
```typescript
// ❌ BEFORE - Example violations
<div className="bg-gray-100 border-gray-300">
  <h1 className="text-blue-600">App Name</h1>
  <span className="text-gray-500">Status</span>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-surface-primary border-vision-border-default">
  <h1 className="text-vision-blue-600">App Name</h1>
  <span className="text-vision-text-secondary">Status</span>
</div>
```

**Bold Color System v3.0 Tokens to Use:**

**Backgrounds:**
- `bg-vision-surface-primary` - Main content background
- `bg-vision-surface-secondary` - Card backgrounds
- `bg-vision-blue-50` - Subtle blue backgrounds
- `bg-vision-blue-100` - Hover states

**Text:**
- `text-vision-text-primary` - Primary text (90% opacity)
- `text-vision-text-secondary` - Secondary text (60% opacity)
- `text-vision-text-tertiary` - Tertiary text (38% opacity)
- `text-vision-blue-600` - Primary blue text
- `text-vision-blue-700` - Darker blue text

**Borders:**
- `border-vision-border-default` - Default borders
- `border-vision-border-subtle` - Subtle borders
- `border-vision-blue-200` - Blue borders

**Interactive States:**
- `hover:bg-vision-blue-100` - Hover backgrounds
- `focus-visible:ring-vision-blue-500` - Focus rings

**Validation Commands:**
```bash
# Run color validation
pnpm validate:colors

# Expected output: 0 violations in apps/shell/src/app/apps/[slug]/page.tsx

# Run type-check
pnpm type-check

# Run tests
pnpm test apps/shell/src/app/apps/[slug]/page.test.tsx
```

**Success Criteria:**
- ✅ All 4 color violations resolved
- ✅ Only Bold Color System tokens used
- ✅ No inline hex colors (#xxxxxx)
- ✅ No Tailwind gray-* colors
- ✅ Color validation script passes
- ✅ Visual consistency maintained

---

### ISSUE 2: LAUNCH PATH FUNCTIONALITY (Week 4 - 3 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement app launch functionality with service layer

**Current Problem:**
```typescript
// ❌ BEFORE - Non-functional CTA
<GlowButton
  onClick={() => {
    // No implementation
    console.log('Launch app');
  }}
>
  Launch App
</GlowButton>
```

**Expected Implementation:**

#### Step 1: Create Service Layer
**File:** `apps/shell/src/services/appService.ts`

```typescript
import { App, AppLaunchResult } from '@/types/app';

export const appService = {
  /**
   * Get app details by slug
   */
  async getAppBySlug(appSlug: string): Promise<App> {
    const apps = JSON.parse(localStorage.getItem('apps') || '[]');
    const app = apps.find((a: App) => a.slug === appSlug);

    if (!app) {
      throw new Error(`App with slug "${appSlug}" not found`);
    }

    return app;
  },

  /**
   * Launch an app
   * Currently uses localStorage stub
   * TODO: Replace with API call when backend ready
   */
  async launchApp(appSlug: string): Promise<AppLaunchResult> {
    const app = await this.getAppBySlug(appSlug);

    // Check if app is available
    if (app.status === 'coming_soon') {
      throw new Error('This app is coming soon and cannot be launched yet');
    }

    if (app.status === 'maintenance') {
      throw new Error('This app is currently under maintenance');
    }

    // Record launch in localStorage
    const launches = JSON.parse(localStorage.getItem('app_launches') || '[]');
    launches.push({
      appSlug,
      timestamp: new Date().toISOString(),
      userId: 'current-user', // TODO: Get from auth context
    });
    localStorage.setItem('app_launches', JSON.stringify(launches));

    return {
      launchUrl: `/apps/${appSlug}/launch`,
      status: 'success',
      message: `Launching ${app.name}...`,
    };
  },

  /**
   * Get app installation status
   */
  async getInstallationStatus(appSlug: string): Promise<boolean> {
    const installations = JSON.parse(
      localStorage.getItem('installed_apps') || '[]'
    );
    return installations.includes(appSlug);
  },

  /**
   * Install an app
   */
  async installApp(appSlug: string): Promise<void> {
    const app = await this.getAppBySlug(appSlug);
    const installations = JSON.parse(
      localStorage.getItem('installed_apps') || '[]'
    );

    if (!installations.includes(appSlug)) {
      installations.push(appSlug);
      localStorage.setItem('installed_apps', JSON.stringify(installations));
    }
  },
};
```

#### Step 2: Create Types
**File:** `apps/shell/src/types/app.ts` (add these types)

```typescript
export interface AppLaunchResult {
  launchUrl: string;
  status: 'success' | 'error';
  message?: string;
}

export interface App {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'coming_soon' | 'maintenance';
  category: string;
  installed?: boolean;
}
```

#### Step 3: Update Component
**File:** `apps/shell/src/app/apps/[slug]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GlowButton } from '@vision/design-system';
import { appService } from '@/services/appService';
import type { App } from '@/types/app';

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appSlug = params.slug as string;

  const [app, setApp] = useState<App | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppData();
  }, [appSlug]);

  const loadAppData = async () => {
    try {
      const [appData, installStatus] = await Promise.all([
        appService.getAppBySlug(appSlug),
        appService.getInstallationStatus(appSlug),
      ]);
      setApp(appData);
      setIsInstalled(installStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app');
    }
  };

  const handleLaunch = async () => {
    if (!app) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await appService.launchApp(appSlug);

      if (result.status === 'success') {
        // Navigate to launch URL
        router.push(result.launchUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch app');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!app) return;

    setIsLoading(true);
    setError(null);

    try {
      await appService.installApp(appSlug);
      setIsInstalled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install app');
    } finally {
      setIsLoading(false);
    }
  };

  if (!app) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-vision-surface-secondary rounded-lg p-6">
        <h1 className="text-vision-text-primary text-3xl font-bold mb-4">
          {app.name}
        </h1>

        <p className="text-vision-text-secondary mb-6">
          {app.description}
        </p>

        {error && (
          <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          {isInstalled ? (
            <GlowButton
              onClick={handleLaunch}
              disabled={isLoading || app.status !== 'active'}
              aria-label={`Launch ${app.name}`}
            >
              {isLoading ? 'Launching...' : 'Launch App'}
            </GlowButton>
          ) : (
            <GlowButton
              onClick={handleInstall}
              disabled={isLoading}
              variant="secondary"
              aria-label={`Install ${app.name}`}
            >
              {isLoading ? 'Installing...' : 'Install App'}
            </GlowButton>
          )}

          {app.status === 'coming_soon' && (
            <span className="text-vision-text-tertiary inline-flex items-center">
              Coming Soon
            </span>
          )}
        </div>
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
pnpm test apps/shell/src/app/apps/[slug]/page.test.tsx

# Test in browser
pnpm dev
# Navigate to /apps/test-app and test launch functionality
```

**Success Criteria:**
- ✅ Service layer created with proper types
- ✅ Launch button works and navigates correctly
- ✅ Install button works and persists state
- ✅ Error handling for coming_soon/maintenance states
- ✅ Loading states work properly
- ✅ localStorage persistence works
- ✅ Proper user feedback (error messages)

---

### ISSUE 3: KEYBOARD NAVIGATION (Week 5 - 1 hour)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Ensure full keyboard navigation support

**Expected Implementation:**

```typescript
// Ensure all interactive elements are keyboard accessible
<GlowButton
  onClick={handleLaunch}
  disabled={isLoading || app.status !== 'active'}
  aria-label={`Launch ${app.name}`}
  // GlowButton already handles keyboard events (Enter/Space)
>
  {isLoading ? 'Launching...' : 'Launch App'}
</GlowButton>

// Add keyboard navigation for back button
<button
  onClick={() => router.back()}
  className="inline-flex items-center text-vision-blue-600 hover:text-vision-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue-500 focus-visible:ring-offset-2 rounded"
  aria-label="Go back to app catalog"
>
  <ArrowLeftIcon className="w-4 h-4 mr-2" />
  Back to Apps
</button>

// Ensure proper focus order
<div className="flex flex-col gap-4">
  {/* Focus order: Back button → Launch/Install button → Secondary actions */}
  <div className="mb-4">
    <button onClick={() => router.back()} aria-label="Go back to app catalog">
      Back to Apps
    </button>
  </div>

  <div className="flex gap-4">
    <GlowButton onClick={handleLaunch}>Launch App</GlowButton>
    <GlowButton variant="ghost" onClick={handleShare}>Share</GlowButton>
  </div>
</div>
```

**Accessibility Checklist:**
- ✅ All buttons keyboard accessible (Tab navigation)
- ✅ Enter/Space trigger button actions
- ✅ Focus visible on all interactive elements
- ✅ Logical tab order (back → primary → secondary)
- ✅ ARIA labels on all buttons
- ✅ Disabled states properly communicated
- ✅ Skip links if needed for long content

**Validation Commands:**
```bash
# Run accessibility tests
pnpm test apps/shell/src/app/apps/[slug]/page.test.tsx

# Manual keyboard testing:
# 1. Tab through all interactive elements
# 2. Verify focus indicators visible
# 3. Test Enter/Space on buttons
# 4. Verify screen reader announcements
```

**Success Criteria:**
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators visible
- ✅ Logical tab order
- ✅ WCAG 2.1 AA compliant

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
git checkout -b fix/colors-page-5-app-detail

# Agent 003 (Accessibility):
git checkout -b fix/a11y-page-5-app-detail

# Agent 004 (CTAs):
git checkout -b fix/ctas-page-5-app-detail

# Install dependencies
pnpm install
```

### Step 2: Identify Your Role
Determine which agent you are and what work you need to do:
- **Agent 001?** Fix the 4 color violations (Week 2 Monday - 2 hours)
- **Agent 004?** Implement launch functionality (Week 4 - 3 hours)
- **Agent 003?** Fix keyboard navigation (Week 5 - 1 hour)

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
pnpm test apps/shell/src/app/apps/[slug]/page.test.tsx

# Build
pnpm build
```

### Step 6: Manual Testing
```bash
# Start dev server
pnpm dev

# Test in browser:
# 1. Navigate to /apps/test-app
# 2. Verify colors (Agent 001)
# 3. Test launch functionality (Agent 004)
# 4. Test keyboard navigation (Agent 003)
# 5. Test with screen reader if applicable
```

### Step 7: Create PR
```bash
# Stage changes
git add apps/shell/src/app/apps/[slug]/page.tsx
git add apps/shell/src/services/appService.ts  # If Agent 004
git add apps/shell/src/types/app.ts  # If Agent 004

# Commit with descriptive message
git commit -m "fix(page-5): [Your agent's work]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Addresses Page 5 (App Detail) remediation
Agent: [Your agent number]
Effort: [X] hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
git push origin [your-branch-name]

# Create PR
gh pr create --title "fix(page-5): [Your agent's work]" --body "## Summary
[Describe changes]

## Testing
- [x] Type-check passes
- [x] Tests pass (≥85% coverage)
- [x] Build succeeds
- [x] Manual testing complete

## Agent
Agent [Your number]: [Your specialization]

Fixes Page 5 (App Detail) issues"
```

---

## SUCCESS CRITERIA

Before marking Page 5 complete, verify:

### Agent 001 (Colors):
- ✅ All 4 color violations fixed
- ✅ Only Bold Color System tokens used
- ✅ `pnpm validate:colors` passes
- ✅ Visual consistency maintained

### Agent 004 (CTAs):
- ✅ Service layer created (`appService.ts`)
- ✅ Launch functionality works
- ✅ Install functionality works
- ✅ Error handling complete
- ✅ Loading states work
- ✅ localStorage persistence works

### Agent 003 (Accessibility):
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ ARIA labels on all buttons
- ✅ Logical tab order
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
- `apps/shell/src/app/apps/[slug]/page.tsx` - Main page component
- `apps/shell/src/services/appService.ts` - Service layer (Agent 004)
- `apps/shell/src/types/app.ts` - Type definitions (Agent 004)
- `apps/shell/src/app/apps/[slug]/page.test.tsx` - Tests (Agent 006)

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
git checkout -b fix/[your-agent]-page-5-app-detail
pnpm install
```

Then proceed to your section above based on your agent role.
