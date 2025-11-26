# AGENT START PROMPT: PAGE 2 - APPLICATIONS CATALOG (`/applications`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 2: Applications Catalog** (`/applications`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/applications/page.tsx`
- **Priority:** P1 - High
- **Total Effort:** 12 hours
- **Execution Timeline:** Week 1-5

**Issues to Fix:**
- 7 inline color violations → Bold Color System tokens
- 2 native select elements → GlowSelect components
- Non-functional "Enable app" and "Add to favorites" CTAs
- Missing aria-pressed on filter toggles

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 1 Tuesday - 4 hours
2. **Agent 002** (Component Migration) - Week 1 Wednesday - 2 hours
3. **Agent 004** (CTA Functionality) - Week 3 Thursday - 4 hours
4. **Agent 003** (Accessibility) - Week 5 - 2 hours

**Success Criteria:**
- ✅ All 7 color violations fixed with Bold Color System tokens
- ✅ Both native selects replaced with GlowSelect
- ✅ Enable/disable app toggles working and persisting
- ✅ Favorites functionality working and persisting
- ✅ Filter toggles have aria-pressed attributes
- ✅ Keyboard navigation works
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## ⚠️ CRITICAL: AGENT ADHERENCE REQUIREMENTS

### YOU MUST FOLLOW ALL STEPS IN YOUR AGENT PROMPT

**This is MANDATORY:**
1. ✅ Read your agent-specific prompt document COMPLETELY
2. ✅ Follow EVERY step in your agent's workflow (no skipping)
3. ✅ Run ALL validation commands specified in your agent prompt
4. ✅ Complete ALL quality checks before marking work complete
5. ✅ Review the codebase yourself for additional errors beyond what's listed
6. ✅ Document any additional issues you find
7. ✅ Fix all issues found (both listed and discovered)

### SELF-REVIEW REQUIREMENT

**Before starting work, you MUST:**
1. Read the target file (`apps/shell/src/app/applications/page.tsx`)
2. Identify ALL issues related to your specialty (not just the ones listed)
3. Document any additional issues you find
4. Include fixes for ALL issues in your PR

**Example Self-Review Process for Agent 001 (Colors):**
```bash
# Step 1: Read the file
cat apps/shell/src/app/applications/page.tsx

# Step 2: Search for ALL color violations (not just the 7 listed)
grep -n "gray-\|#[0-9a-fA-F]\{3,6\}\|rgb(\|rgba(" apps/shell/src/app/applications/page.tsx

# Step 3: Run color validation
pnpm validate:colors

# Step 4: Document findings
# List includes original 7 + any additional violations found

# Step 5: Fix ALL violations (not just the original 7)
```

**You are accountable for:**
- ❌ NOT just fixing the issues listed in this prompt
- ✅ Finding and fixing ALL issues related to your agent's specialty
- ✅ Running comprehensive checks before committing
- ✅ Ensuring zero violations remain in your area

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 2 section
- Understand all issues and priorities
- Note the agent assignments and timeline

### 2. Your Agent-Specific Prompt (MANDATORY READING)
**Determine which agent you are and READ YOUR ENTIRE PROMPT:**
- **Agent 001 (Colors)?** Read `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md` - Follow ALL steps
- **Agent 002 (Components)?** Read `AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md` - Follow ALL steps
- **Agent 003 (Accessibility)?** Read `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md` - Follow ALL steps
- **Agent 004 (CTAs)?** Read `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md` - Follow ALL steps

### 3. Execution Guide
**File:** `documentation/platform/AGENT_EXECUTION_GUIDE.md`
- Review conflict prevention matrix
- Understand handoff procedures
- Check scheduling requirements
- Follow the prescribed execution order

### 4. Remediation Plan
**File:** `documentation/platform/VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`
- Review the 7-week roadmap
- Understand the 18-step workflow
- Review pre-merge quality gate (8 checks)
- Ensure you complete ALL checks before PR

### 5. Validation Agent Prompt
**File:** `VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md`
- Understand the validation requirements
- Know what Agent 005 will check
- Ensure your work will pass validation

### 6. Testing Coverage Specialist Prompt
**File:** `AGENT_PROMPT_TESTING_COVERAGE_SPECIALIST.md`
- Understand testing requirements
- Know what Agent 006 expects
- Ensure ≥85% coverage for all modified files

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: COLOR VIOLATIONS - 7 INLINE COLORS (Week 1 Tuesday - 4 hours)

**Agent:** 001 (Color Compliance Specialist)

**Assignment:** Fix 7 inline hex/arbitrary color violations + any additional violations found during review

#### ⚠️ CRITICAL: BEFORE YOU START

**You MUST perform a comprehensive review:**

```bash
# Step 1: Read the entire file
pnpm exec cat apps/shell/src/app/applications/page.tsx

# Step 2: Search for ALL color violations
grep -rn "gray-\|slate-\|zinc-\|neutral-\|stone-\|#[0-9a-fA-F]\{3,6\}\|rgb(\|rgba(\|bg-blue-\|text-blue-\|border-blue-" apps/shell/src/app/applications/page.tsx

# Step 3: Run color validation script
pnpm validate:colors

# Step 4: Document ALL findings (not just the 7 mentioned)
# Create a list of every violation found

# Step 5: Plan your fixes for ALL violations
```

**Expected Violations (minimum 7, but find ALL):**

```typescript
// ❌ BEFORE - Example violations (these may not be exhaustive)
<div className="bg-gray-50 border-gray-200">
  <h2 className="text-gray-900">Applications</h2>
  <div className="bg-blue-100">
    <span className="text-blue-600">Featured</span>
  </div>
  <button className="bg-gray-100 hover:bg-gray-200">
    <span className="text-gray-700">Filter</span>
  </button>
  <div className="border-gray-300">
    <p className="text-gray-600">Description text</p>
  </div>
</div>
```

**Expected Fix (using Bold Color System v3.0):**

```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-surface-secondary border-vision-border-default">
  <h2 className="text-vision-text-primary">Applications</h2>
  <div className="bg-vision-blue-100">
    <span className="text-vision-blue-600">Featured</span>
  </div>
  <button className="bg-vision-surface-secondary hover:bg-vision-blue-100">
    <span className="text-vision-text-secondary">Filter</span>
  </button>
  <div className="border-vision-border-default">
    <p className="text-vision-text-secondary">Description text</p>
  </div>
</div>
```

**Bold Color System v3.0 Tokens Reference:**

**Backgrounds:**
- `bg-vision-surface-primary` - Main content background (replaces `bg-white`)
- `bg-vision-surface-secondary` - Card/section backgrounds (replaces `bg-gray-50`, `bg-gray-100`)
- `bg-vision-blue-50` - Subtle blue backgrounds
- `bg-vision-blue-100` - Light blue backgrounds (replaces `bg-blue-100`)
- `bg-vision-blue-600` - Primary blue (button backgrounds)

**Text:**
- `text-vision-text-primary` - Primary text (90% opacity) (replaces `text-gray-900`, `text-black`)
- `text-vision-text-secondary` - Secondary text (60% opacity) (replaces `text-gray-600`, `text-gray-700`)
- `text-vision-text-tertiary` - Tertiary text (38% opacity) (replaces `text-gray-500`, `text-gray-400`)
- `text-vision-blue-600` - Primary blue text (replaces `text-blue-600`)
- `text-vision-blue-700` - Darker blue text (replaces `text-blue-700`)

**Borders:**
- `border-vision-border-default` - Default borders (replaces `border-gray-200`, `border-gray-300`)
- `border-vision-border-subtle` - Subtle borders (replaces `border-gray-100`)
- `border-vision-blue-200` - Blue borders

**Interactive States:**
- `hover:bg-vision-blue-100` - Hover backgrounds (replaces `hover:bg-gray-100`, `hover:bg-gray-200`)
- `hover:bg-vision-surface-secondary` - Subtle hover
- `focus-visible:ring-vision-blue-500` - Focus rings
- `active:bg-vision-blue-700` - Active states

**Workflow (from your agent prompt):**

1. ✅ Read the target file completely
2. ✅ Identify ALL color violations (not just the 7 listed)
3. ✅ Create a comprehensive list of violations with line numbers
4. ✅ Replace each violation with appropriate Bold Color System token
5. ✅ Verify visual consistency after changes
6. ✅ Run `pnpm validate:colors` - must show 0 violations
7. ✅ Run `pnpm type-check` - must pass
8. ✅ Run tests - must pass
9. ✅ Manual visual review in browser
10. ✅ Document all changes in PR

**Validation Commands (ALL MUST PASS):**
```bash
# Color validation - MUST show 0 violations
pnpm validate:colors

# Type-check - MUST pass
pnpm type-check

# Linting - MUST pass
pnpm lint

# Tests - MUST pass with ≥85% coverage
pnpm test apps/shell/src/app/applications/page.test.tsx

# Build - MUST succeed
pnpm build
```

**Success Criteria (ALL REQUIRED):**
- ✅ Original 7 color violations fixed
- ✅ ANY additional color violations found and fixed
- ✅ Only Bold Color System tokens used
- ✅ No inline hex colors (#xxxxxx)
- ✅ No Tailwind gray-*, slate-*, zinc-*, neutral-*, stone-* colors
- ✅ No arbitrary blue colors (must use vision-blue-*)
- ✅ `pnpm validate:colors` shows 0 violations
- ✅ Visual consistency maintained
- ✅ All validation commands pass

---

### ISSUE 2: COMPONENT MIGRATION - 2 NATIVE SELECTS (Week 1 Wednesday - 2 hours)

**Agent:** 002 (Component Migration Specialist)

**Assignment:** Replace 2 native select elements with GlowSelect + find any other native HTML components

#### ⚠️ CRITICAL: BEFORE YOU START

**You MUST perform a comprehensive review:**

```bash
# Step 1: Read the entire file
pnpm exec cat apps/shell/src/app/applications/page.tsx

# Step 2: Search for ALL native HTML form elements
grep -rn "<select\|<input\|<button\|<textarea" apps/shell/src/app/applications/page.tsx

# Step 3: Run component validation
pnpm validate:components

# Step 4: Document ALL findings (not just the 2 selects mentioned)
# List every native component that should be migrated

# Step 5: Plan migration for ALL components
```

**Expected Native Components (minimum 2 selects, but find ALL):**

```typescript
// ❌ BEFORE - Native HTML select
<select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border border-gray-300 rounded-md"
>
  <option value="">All Categories</option>
  <option value="productivity">Productivity</option>
  <option value="communication">Communication</option>
  <option value="analytics">Analytics</option>
</select>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-gray-300 rounded-md"
>
  <option value="name">Name</option>
  <option value="popular">Most Popular</option>
  <option value="recent">Recently Added</option>
</select>
```

**Expected Fix (using Glow UI components):**

```typescript
// ✅ AFTER - GlowSelect component
import { GlowSelect } from '@vision/design-system';

<GlowSelect
  label="Category"
  value={selectedCategory}
  onChange={(value) => setSelectedCategory(value)}
  options={[
    { value: '', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'communication', label: 'Communication' },
    { value: 'analytics', label: 'Analytics' },
  ]}
/>

<GlowSelect
  label="Sort By"
  value={sortBy}
  onChange={(value) => setSortBy(value)}
  options={[
    { value: 'name', label: 'Name' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Recently Added' },
  ]}
/>
```

**⚠️ CRITICAL: onChange Signature Difference**

Native HTML select:
```typescript
onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
```

GlowSelect component:
```typescript
onChange={(value: string) => setSelectedCategory(value)}
// Note: GlowSelect passes the value directly, NOT an event object
```

**Workflow (from your agent prompt):**

1. ✅ Read the target file completely
2. ✅ Identify ALL native HTML form components (not just the 2 selects listed)
3. ✅ Create a comprehensive list with line numbers
4. ✅ Import required Glow UI components
5. ✅ Replace each native component with Glow UI equivalent
6. ✅ Update onChange handlers (critical for selects)
7. ✅ Verify functionality after changes
8. ✅ Run `pnpm validate:components` - must show 0 violations
9. ✅ Run `pnpm type-check` - must pass
10. ✅ Run tests - must pass
11. ✅ Manual functional testing in browser
12. ✅ Document all changes in PR

**Validation Commands (ALL MUST PASS):**
```bash
# Component validation - MUST show 0 violations
pnpm validate:components

# Type-check - MUST pass
pnpm type-check

# Linting - MUST pass
pnpm lint

# Tests - MUST pass
pnpm test apps/shell/src/app/applications/page.test.tsx

# Build - MUST succeed
pnpm build
```

**Success Criteria (ALL REQUIRED):**
- ✅ Original 2 native selects replaced
- ✅ ANY additional native components found and replaced
- ✅ All imports added correctly
- ✅ onChange handlers updated correctly
- ✅ Component validation passes
- ✅ TypeScript types correct
- ✅ Functionality works identically
- ✅ All validation commands pass

---

### ISSUE 3: CTA FUNCTIONALITY - ENABLE & FAVORITES (Week 3 Thursday - 4 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement "Enable app" toggle and "Add to favorites" functionality with persistence

#### ⚠️ CRITICAL: BEFORE YOU START

**You MUST perform a comprehensive review:**

```bash
# Step 1: Read the entire file
pnpm exec cat apps/shell/src/app/applications/page.tsx

# Step 2: Search for ALL non-functional CTAs
grep -rn "onClick\|onSubmit\|href" apps/shell/src/app/applications/page.tsx | grep -v "http"

# Step 3: Identify ALL buttons/links that need functionality
# List every CTA that currently does nothing or has placeholder code

# Step 4: Plan service layer implementation for ALL CTAs
```

#### Step 1: Create Types
**File:** `apps/shell/src/types/application.ts`

```typescript
export interface Application {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'communication' | 'analytics' | 'finance' | 'other';
  status: 'active' | 'coming_soon' | 'maintenance';
  enabled: boolean;
  isFavorite: boolean;
  popularity: number;
  addedAt: string; // ISO timestamp
  tags?: string[];
}

export interface AppSettings {
  [appSlug: string]: {
    enabled: boolean;
    enabledAt?: string;
    disabledAt?: string;
  };
}

export interface Favorites {
  appSlugs: string[];
  updatedAt: string;
}
```

#### Step 2: Create Application Service
**File:** `apps/shell/src/services/applicationService.ts`

```typescript
import type { Application, AppSettings, Favorites } from '@/types/application';

export const applicationService = {
  /**
   * Get all applications
   */
  async getApplications(): Promise<Application[]> {
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    const settings = await this.getAppSettings();
    const favorites = await this.getFavorites();

    // Merge enabled state and favorites
    return apps.map((app: Application) => ({
      ...app,
      enabled: settings[app.slug]?.enabled ?? false,
      isFavorite: favorites.appSlugs.includes(app.slug),
    }));
  },

  /**
   * Get app settings
   */
  async getAppSettings(): Promise<AppSettings> {
    return JSON.parse(localStorage.getItem('app_settings') || '{}');
  },

  /**
   * Enable an application
   */
  async enableApp(appSlug: string): Promise<void> {
    const settings = await this.getAppSettings();

    settings[appSlug] = {
      enabled: true,
      enabledAt: new Date().toISOString(),
    };

    localStorage.setItem('app_settings', JSON.stringify(settings));
  },

  /**
   * Disable an application
   */
  async disableApp(appSlug: string): Promise<void> {
    const settings = await this.getAppSettings();

    settings[appSlug] = {
      enabled: false,
      disabledAt: new Date().toISOString(),
    };

    localStorage.setItem('app_settings', JSON.stringify(settings));
  },

  /**
   * Toggle app enabled state
   */
  async toggleApp(appSlug: string): Promise<boolean> {
    const settings = await this.getAppSettings();
    const currentState = settings[appSlug]?.enabled ?? false;

    if (currentState) {
      await this.disableApp(appSlug);
      return false;
    } else {
      await this.enableApp(appSlug);
      return true;
    }
  },

  /**
   * Get favorites
   */
  async getFavorites(): Promise<Favorites> {
    const favorites = localStorage.getItem('app_favorites');
    if (!favorites) {
      return { appSlugs: [], updatedAt: new Date().toISOString() };
    }
    return JSON.parse(favorites);
  },

  /**
   * Add to favorites
   */
  async addToFavorites(appSlug: string): Promise<void> {
    const favorites = await this.getFavorites();

    if (!favorites.appSlugs.includes(appSlug)) {
      favorites.appSlugs.push(appSlug);
      favorites.updatedAt = new Date().toISOString();
      localStorage.setItem('app_favorites', JSON.stringify(favorites));
    }
  },

  /**
   * Remove from favorites
   */
  async removeFromFavorites(appSlug: string): Promise<void> {
    const favorites = await this.getFavorites();

    favorites.appSlugs = favorites.appSlugs.filter((slug) => slug !== appSlug);
    favorites.updatedAt = new Date().toISOString();
    localStorage.setItem('app_favorites', JSON.stringify(favorites));
  },

  /**
   * Toggle favorite state
   */
  async toggleFavorite(appSlug: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const isFavorite = favorites.appSlugs.includes(appSlug);

    if (isFavorite) {
      await this.removeFromFavorites(appSlug);
      return false;
    } else {
      await this.addToFavorites(appSlug);
      return true;
    }
  },

  /**
   * Get enabled applications
   */
  async getEnabledApps(): Promise<Application[]> {
    const apps = await this.getApplications();
    return apps.filter((app) => app.enabled);
  },

  /**
   * Get favorite applications
   */
  async getFavoriteApps(): Promise<Application[]> {
    const apps = await this.getApplications();
    return apps.filter((app) => app.isFavorite);
  },
};
```

#### Step 3: Update Component
**File:** `apps/shell/src/app/applications/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowButton, GlowSelect, GlowSwitch } from '@vision/design-system';
import { applicationService } from '@/services/applicationService';
import type { Application } from '@/types/application';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterAndSortApps();
  }, [applications, selectedCategory, sortBy, showFavoritesOnly]);

  const loadApplications = async () => {
    try {
      const apps = await applicationService.getApplications();
      setApplications(apps);
    } catch (err) {
      setError('Failed to load applications');
    }
  };

  const filterAndSortApps = () => {
    let filtered = [...applications];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((app) => app.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((app) => app.isFavorite);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'popular') {
        return b.popularity - a.popularity;
      } else if (sortBy === 'recent') {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      return 0;
    });

    setFilteredApps(filtered);
  };

  const handleToggleApp = async (appSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newState = await applicationService.toggleApp(appSlug);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.slug === appSlug ? { ...app, enabled: newState } : app
        )
      );
    } catch (err) {
      setError('Failed to update app state');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (appSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newState = await applicationService.toggleFavorite(appSlug);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.slug === appSlug ? { ...app, isFavorite: newState } : app
        )
      );
    } catch (err) {
      setError('Failed to update favorite state');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-vision-text-primary text-3xl font-bold">
            Applications
          </h1>
          <p className="text-vision-text-secondary mt-1">
            {filteredApps.length} application{filteredApps.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 bg-vision-surface-secondary p-4 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <GlowSelect
            label="Category"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'productivity', label: 'Productivity' },
              { value: 'communication', label: 'Communication' },
              { value: 'analytics', label: 'Analytics' },
              { value: 'finance', label: 'Finance' },
            ]}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <GlowSelect
            label="Sort By"
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'recent', label: 'Recently Added' },
            ]}
          />
        </div>

        <div className="flex items-end">
          <GlowButton
            variant={showFavoritesOnly ? 'primary' : 'ghost'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            aria-pressed={showFavoritesOnly}
          >
            <StarSolid className="w-4 h-4 mr-2" />
            Favorites Only
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.length === 0 ? (
          <div className="col-span-full bg-vision-surface-secondary rounded-lg p-8 text-center">
            <p className="text-vision-text-secondary">
              {showFavoritesOnly
                ? 'No favorite applications yet. Click the star icon on an app to add it to favorites.'
                : 'No applications found matching your filters.'}
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-vision-surface-secondary border border-vision-border-default rounded-lg p-6 hover:border-vision-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{app.icon}</div>
                  <div>
                    <h3 className="text-vision-text-primary font-semibold">
                      {app.name}
                    </h3>
                    <span className="text-vision-text-tertiary text-xs">
                      {app.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFavorite(app.slug)}
                  disabled={isLoading}
                  className="text-vision-blue-600 hover:text-vision-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue-500 rounded"
                  aria-label={
                    app.isFavorite
                      ? `Remove ${app.name} from favorites`
                      : `Add ${app.name} to favorites`
                  }
                >
                  {app.isFavorite ? (
                    <StarSolid className="w-6 h-6" />
                  ) : (
                    <StarOutline className="w-6 h-6" />
                  )}
                </button>
              </div>

              <p className="text-vision-text-secondary text-sm mb-4">
                {app.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-vision-text-tertiary text-xs">
                    {app.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <GlowSwitch
                    checked={app.enabled}
                    onCheckedChange={() => handleToggleApp(app.slug)}
                    disabled={isLoading || app.status !== 'active'}
                    aria-label={`${app.enabled ? 'Disable' : 'Enable'} ${app.name}`}
                  />
                </div>

                {app.status === 'coming_soon' && (
                  <span className="text-vision-text-tertiary text-xs bg-vision-blue-50 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Workflow (from your agent prompt):**

1. ✅ Read the target file completely
2. ✅ Identify ALL non-functional CTAs (not just enable/favorites)
3. ✅ Create types for all data structures
4. ✅ Create service layer with localStorage persistence
5. ✅ Implement ALL CTA functionality
6. ✅ Update component with proper state management
7. ✅ Add error handling for all operations
8. ✅ Add loading states
9. ✅ Verify persistence across page reloads
10. ✅ Run all validation commands
11. ✅ Manual testing of ALL functionality
12. ✅ Document all changes in PR

**Validation Commands (ALL MUST PASS):**
```bash
# Type-check - MUST pass
pnpm type-check

# Linting - MUST pass
pnpm lint

# Tests - MUST pass
pnpm test apps/shell/src/app/applications/page.test.tsx

# Build - MUST succeed
pnpm build

# Manual testing:
pnpm dev
# 1. Navigate to /applications
# 2. Test enable/disable toggle for each app
# 3. Verify state persists after page reload
# 4. Test add/remove favorites
# 5. Verify favorites persist after page reload
# 6. Test "Favorites Only" filter
# 7. Test category and sort filters
```

**Success Criteria (ALL REQUIRED):**
- ✅ Enable/disable toggles work for all apps
- ✅ App enabled state persists in localStorage
- ✅ Favorites functionality works
- ✅ Favorites persist in localStorage
- ✅ "Favorites Only" filter works
- ✅ Category filter works
- ✅ Sort functionality works
- ✅ Service layer properly implemented
- ✅ Error handling works
- ✅ Loading states work
- ✅ All validation commands pass

---

### ISSUE 4: ACCESSIBILITY - FILTER TOGGLE ARIA (Week 5 - 2 hours)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Add aria-pressed to filter toggles + comprehensive accessibility review

#### ⚠️ CRITICAL: BEFORE YOU START

**You MUST perform a comprehensive accessibility review:**

```bash
# Step 1: Read the entire file
pnpm exec cat apps/shell/src/app/applications/page.tsx

# Step 2: Run accessibility checks
pnpm test apps/shell/src/app/applications/page.test.tsx -- --testNamePattern="accessibility"

# Step 3: Manual review checklist:
# - All buttons have proper aria-labels?
# - All interactive elements keyboard accessible?
# - Focus indicators visible?
# - Screen reader announcements correct?
# - Color contrast sufficient?
# - Form inputs have labels?
# - Images have alt text?

# Step 4: Document ALL findings (not just aria-pressed)
```

**Expected Issues (minimum aria-pressed, but find ALL):**

```typescript
// ❌ BEFORE - Missing aria-pressed
<GlowButton
  variant={showFavoritesOnly ? 'primary' : 'ghost'}
  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
  // Missing aria-pressed attribute
>
  <StarSolid className="w-4 h-4 mr-2" />
  Favorites Only
</GlowButton>

// Missing aria-label on favorite button
<button onClick={() => handleToggleFavorite(app.slug)}>
  {app.isFavorite ? <StarSolid /> : <StarOutline />}
</button>

// Missing aria-label on switch
<GlowSwitch
  checked={app.enabled}
  onCheckedChange={() => handleToggleApp(app.slug)}
  // Missing aria-label
/>
```

**Expected Fix:**

```typescript
// ✅ AFTER - Complete accessibility
<GlowButton
  variant={showFavoritesOnly ? 'primary' : 'ghost'}
  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
  aria-pressed={showFavoritesOnly}
  aria-label="Show only favorite applications"
>
  <StarSolid className="w-4 h-4 mr-2" aria-hidden="true" />
  Favorites Only
</GlowButton>

// Proper aria-label with context
<button
  onClick={() => handleToggleFavorite(app.slug)}
  disabled={isLoading}
  className="text-vision-blue-600 hover:text-vision-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue-500 rounded"
  aria-label={
    app.isFavorite
      ? `Remove ${app.name} from favorites`
      : `Add ${app.name} to favorites`
  }
>
  {app.isFavorite ? (
    <StarSolid className="w-6 h-6" aria-hidden="true" />
  ) : (
    <StarOutline className="w-6 h-6" aria-hidden="true" />
  )}
</button>

// Proper aria-label on switch
<GlowSwitch
  checked={app.enabled}
  onCheckedChange={() => handleToggleApp(app.slug)}
  disabled={isLoading || app.status !== 'active'}
  aria-label={`${app.enabled ? 'Disable' : 'Enable'} ${app.name}`}
/>

// Add sr-only status text
<span className="sr-only">
  {app.enabled ? 'Currently enabled' : 'Currently disabled'}
</span>

// Add live region for updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {error && error}
  {isLoading && 'Processing...'}
</div>

// Ensure empty state is accessible
{filteredApps.length === 0 && (
  <div
    className="col-span-full bg-vision-surface-secondary rounded-lg p-8 text-center"
    role="status"
    aria-live="polite"
  >
    <p className="text-vision-text-secondary">
      {showFavoritesOnly
        ? 'No favorite applications yet. Click the star icon on an app to add it to favorites.'
        : 'No applications found matching your filters.'}
    </p>
  </div>
)}
```

**Accessibility Checklist (ALL REQUIRED):**

1. **Interactive Elements:**
   - ✅ All buttons have aria-label or visible text
   - ✅ Filter toggle has aria-pressed
   - ✅ Favorite buttons have contextual aria-label
   - ✅ Switches have descriptive aria-label
   - ✅ Icons have aria-hidden="true"

2. **Keyboard Navigation:**
   - ✅ All interactive elements accessible via Tab
   - ✅ Enter/Space trigger actions
   - ✅ Focus indicators visible
   - ✅ Logical tab order
   - ✅ No keyboard traps

3. **Screen Reader Support:**
   - ✅ Filter states announced
   - ✅ App count announced
   - ✅ Empty state announced
   - ✅ Error messages announced (aria-live)
   - ✅ Loading states announced
   - ✅ Switch states announced

4. **Form Accessibility:**
   - ✅ All GlowSelect components have labels
   - ✅ Labels properly associated
   - ✅ Error messages linked to inputs

5. **Content Structure:**
   - ✅ Heading hierarchy correct
   - ✅ Landmark regions used appropriately
   - ✅ Lists structured properly

**Workflow (from your agent prompt):**

1. ✅ Read the target file completely
2. ✅ Run automated accessibility tests
3. ✅ Manual keyboard navigation testing
4. ✅ Manual screen reader testing (VoiceOver/NVDA)
5. ✅ Identify ALL accessibility issues (not just aria-pressed)
6. ✅ Fix all issues found
7. ✅ Verify WCAG 2.1 AA compliance
8. ✅ Run jest-axe tests
9. ✅ Document all changes in PR

**Validation Commands (ALL MUST PASS):**
```bash
# Run accessibility tests
pnpm test apps/shell/src/app/applications/page.test.tsx

# Type-check
pnpm type-check

# Manual testing checklist:
# 1. Tab through entire page
# 2. Test with VoiceOver (macOS) or NVDA (Windows)
# 3. Test keyboard-only interaction
# 4. Verify focus indicators
# 5. Test with browser accessibility tools
```

**Success Criteria (ALL REQUIRED):**
- ✅ Filter toggle has aria-pressed
- ✅ ALL buttons have proper aria-labels
- ✅ ALL switches have aria-labels
- ✅ Icons have aria-hidden
- ✅ Live regions for status updates
- ✅ Keyboard navigation works perfectly
- ✅ Screen reader support complete
- ✅ WCAG 2.1 AA compliant
- ✅ No axe violations
- ✅ All validation commands pass

---

## EXECUTION WORKFLOW

### Step 1: Setup
```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Create feature branch based on your agent
# Agent 001 (Colors):
git checkout -b fix/colors-page-2-app-catalog

# Agent 002 (Components):
git checkout -b fix/components-page-2-app-catalog

# Agent 003 (Accessibility):
git checkout -b fix/a11y-page-2-app-catalog

# Agent 004 (CTAs):
git checkout -b fix/ctas-page-2-app-catalog

# Install dependencies
pnpm install
```

### Step 2: Identify Your Role
Determine which agent you are and what work you need to do:
- **Agent 001?** Fix colors (Week 1 Tuesday - 4 hours)
- **Agent 002?** Migrate components (Week 1 Wednesday - 2 hours)
- **Agent 004?** Implement CTAs (Week 3 Thursday - 4 hours)
- **Agent 003?** Fix accessibility (Week 5 - 2 hours)

### Step 3: READ YOUR COMPLETE AGENT PROMPT (MANDATORY)
Go to your agent-specific documentation and READ IT COMPLETELY:
- Agent 001: `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md`
- Agent 002: `AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md`
- Agent 003: `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md`
- Agent 004: `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

**You MUST follow EVERY step in your agent prompt. No exceptions.**

### Step 4: Perform Self-Review (MANDATORY)
Before making ANY changes:
1. Read the target file completely
2. Search for ALL issues in your specialty
3. Document findings (not just what's listed above)
4. Plan fixes for ALL issues found

### Step 5: Make Changes
- Edit the files as specified in your section above
- Follow the code examples provided
- Fix ALL issues found (not just the ones listed)
- Ensure you're following your agent's specific patterns

### Step 6: Run ALL Validation Commands (MANDATORY)
```bash
# Type-check - MUST pass
pnpm type-check

# Linting - MUST pass
pnpm lint

# Color validation (if Agent 001) - MUST show 0 violations
pnpm validate:colors

# Component validation (if Agent 002) - MUST show 0 violations
pnpm validate:components

# Run tests - MUST pass with ≥85% coverage
pnpm test apps/shell/src/app/applications/page.test.tsx

# Build - MUST succeed
pnpm build
```

**If ANY validation fails, you MUST fix it before proceeding.**

### Step 7: Manual Testing (MANDATORY)
```bash
# Start dev server
pnpm dev

# Navigate to /applications

# Test based on your agent:
# Agent 001: Verify all colors use Bold Color System
# Agent 002: Test all GlowSelect components work
# Agent 004: Test enable/disable and favorites persist
# Agent 003: Test keyboard navigation and screen reader
```

### Step 8: Create PR
```bash
# Stage ALL modified files
git add apps/shell/src/app/applications/page.tsx
git add apps/shell/src/services/applicationService.ts  # If Agent 004
git add apps/shell/src/types/application.ts  # If Agent 004

# Commit with descriptive message
git commit -m "fix(page-2): [Your agent's work]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]
- [Additional changes found during review]

Addresses Page 2 (Applications Catalog) remediation
Agent: [Your agent number]
Effort: [X] hours

All validation commands pass:
- Type-check: ✅
- Linting: ✅
- Color validation: ✅ (if applicable)
- Component validation: ✅ (if applicable)
- Tests: ✅ (≥85% coverage)
- Build: ✅

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
git push origin [your-branch-name]

# Create PR with comprehensive description
gh pr create --title "fix(page-2): [Your agent's work]" --body "## Summary
[Describe changes including additional issues found]

## Issues Fixed
- [Original issue 1]
- [Original issue 2]
- [Additional issue found during review]

## Testing
- [x] Type-check passes
- [x] Linting passes
- [x] Color validation passes (0 violations)
- [x] Component validation passes (0 violations)
- [x] Tests pass (≥85% coverage)
- [x] Build succeeds
- [x] Manual testing complete
- [x] Keyboard navigation tested
- [x] Screen reader tested (if applicable)

## Agent
Agent [Your number]: [Your specialization]

Fixes Page 2 (Applications Catalog) issues

## Validation Evidence
\`\`\`bash
$ pnpm validate:colors
✅ 0 violations found

$ pnpm type-check
✅ No errors

$ pnpm test
✅ All tests passing, 87% coverage

$ pnpm build
✅ Build successful
\`\`\`"
```

---

## SUCCESS CRITERIA

### Before marking Page 2 complete, ALL of the following MUST be verified:

### Agent 001 (Colors):
- ✅ Original 7 color violations fixed
- ✅ ALL additional color violations found and fixed
- ✅ Only Bold Color System tokens used
- ✅ No inline hex, RGB, or Tailwind gray colors
- ✅ `pnpm validate:colors` shows 0 violations
- ✅ Visual consistency maintained

### Agent 002 (Components):
- ✅ Original 2 native selects replaced
- ✅ ALL additional native components found and replaced
- ✅ All imports correct
- ✅ onChange handlers updated correctly
- ✅ `pnpm validate:components` shows 0 violations
- ✅ Functionality works identically

### Agent 004 (CTAs):
- ✅ Enable/disable functionality works
- ✅ Favorites functionality works
- ✅ ALL non-functional CTAs found and implemented
- ✅ Service layer created
- ✅ localStorage persistence works
- ✅ Error handling complete
- ✅ Loading states work

### Agent 003 (Accessibility):
- ✅ Filter toggles have aria-pressed
- ✅ ALL buttons have proper aria-labels
- ✅ ALL switches have aria-labels
- ✅ Keyboard navigation works perfectly
- ✅ Screen reader support complete
- ✅ WCAG 2.1 AA compliant
- ✅ No axe violations

### All Agents (MANDATORY):
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes with ≥85% coverage
- ✅ `pnpm build` succeeds
- ✅ Manual testing complete
- ✅ PR created with comprehensive documentation
- ✅ ALL validation commands pass
- ✅ ALL agent prompt steps followed
- ✅ Self-review performed
- ✅ Additional issues documented

---

## QUICK REFERENCE

### Files to Work On
- `apps/shell/src/app/applications/page.tsx` - Main page component
- `apps/shell/src/services/applicationService.ts` - Service layer (Agent 004)
- `apps/shell/src/types/application.ts` - Type definitions (Agent 004)
- `apps/shell/src/app/applications/page.test.tsx` - Tests (Agent 006)

### Key Commands
```bash
pnpm type-check              # TypeScript validation - MUST pass
pnpm lint                    # ESLint - MUST pass
pnpm validate:colors         # Color compliance - MUST show 0 violations
pnpm validate:components     # Component compliance - MUST show 0 violations
pnpm test [file]             # Run tests - MUST pass with ≥85% coverage
pnpm build                   # Production build - MUST succeed
pnpm dev                     # Development server
```

### Design System References
- Bold Color System: `packages/design-system/src/tokens/colors.ts`
- Glow UI Components: `packages/design-system/src/components/`

### Documentation References (READ THESE)
- Your Agent Prompt: `AGENT_PROMPT_[YOUR_SPECIALTY]_SPECIALIST.md`
- Master Plan: `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Execution Guide: `AGENT_EXECUTION_GUIDE.md`
- Remediation Plan: `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`
- Validation Agent: `VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md`
- Testing Coverage: `AGENT_PROMPT_TESTING_COVERAGE_SPECIALIST.md`

---

## GETTING STARTED

### Pre-Flight Checklist:
1. ✅ Read this entire document
2. ✅ Read your agent-specific prompt COMPLETELY
3. ✅ Read the master plan Page 2 section
4. ✅ Understand your specific responsibilities
5. ✅ Understand the validation requirements
6. ✅ Understand the testing requirements

### Ready to Start:
```bash
# Step 1: Update and branch
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-2-app-catalog

# Step 2: Install dependencies
pnpm install

# Step 3: Read target file and perform self-review
cat apps/shell/src/app/applications/page.tsx
# Search for ALL issues in your specialty
# Document findings

# Step 4: Begin work following your agent prompt
# Fix ALL issues found (not just the ones listed)

# Step 5: Run ALL validation commands
# Fix any failures before proceeding

# Step 6: Manual test thoroughly

# Step 7: Create PR with comprehensive documentation
```

**Remember: You are accountable for finding and fixing ALL issues in your specialty, not just the ones explicitly listed. Perform a thorough self-review before starting work.**
