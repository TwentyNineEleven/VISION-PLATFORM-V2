# AGENT START PROMPT: PAGE 16 - FUNDER: COHORTS (`/funder/cohorts`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 16: Funder — Cohorts** (`/funder/cohorts`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/funder/cohorts/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 6 hours
- **Execution Timeline:** Week 3-5

**Issues to Fix:**
- Minor color cleanup
- Cohort actions (create, edit, archive)
- aria-labels for accessibility

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 3 - 1 hour
2. **Agent 004** (CTA Functionality) - Week 5 - 3 hours
3. **Agent 003** (Accessibility) - Week 5 - 2 hours

**Success Criteria:**
- ✅ All color violations fixed with Bold Color System tokens
- ✅ Create cohort functionality working
- ✅ Edit cohort functionality working
- ✅ Archive cohort functionality working
- ✅ All cohort data persists in localStorage
- ✅ All interactive elements have proper aria-labels
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## ⚠️ CRITICAL: MANDATORY AGENT ADHERENCE

1. ✅ Read your complete agent-specific prompt
2. ✅ Follow EVERY step (no skipping)
3. ✅ Run ALL validation commands
4. ✅ Perform self-review to find additional issues
5. ✅ Fix ALL issues found (not just listed ones)
6. ✅ Document all changes

---

## PRE-WORK: REQUIRED READING

1. **Master Plan:** `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md` - Page 16 section
2. **Your Agent Prompt:** Read your complete agent-specific prompt
3. **Execution Guide:** `AGENT_EXECUTION_GUIDE.md`
4. **Remediation Plan:** `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: COLOR CLEANUP (Week 3 - 1 hour)

**Agent:** 001 (Color Compliance Specialist)

#### ⚠️ MANDATORY SELF-REVIEW
```bash
cat apps/shell/src/app/funder/cohorts/page.tsx
grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(\|gray-\|slate-" apps/shell/src/app/funder/cohorts/page.tsx
pnpm validate:colors
```

**Expected Violations:**
```typescript
// ❌ BEFORE - Minor color issues
<div className="bg-gray-50 border-gray-200">
  <span className="text-gray-600">Cohort Details</span>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-surface-secondary border-vision-border-default">
  <span className="text-vision-text-secondary">Cohort Details</span>
</div>
```

**Success Criteria:**
- ✅ All color violations fixed
- ✅ `pnpm validate:colors` passes (0 violations)

---

### ISSUE 2: COHORT ACTIONS (Week 5 - 3 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement create, edit, and archive cohort functionality

#### Step 1: Create Types
**File:** `apps/shell/src/types/cohort.ts`

```typescript
export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'upcoming' | 'archived';
  granteeCount: number;
  totalFunding: number;
  fundingAllocated: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CohortFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CohortFormErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  _form?: string;
}
```

#### Step 2: Create Cohort Service
**File:** `apps/shell/src/services/cohortService.ts`

```typescript
import type { Cohort, CohortFormData } from '@/types/cohort';

export const cohortService = {
  /**
   * Get all cohorts
   */
  async getCohorts(): Promise<Cohort[]> {
    const cohorts = localStorage.getItem('cohorts');
    const parsed = cohorts ? JSON.parse(cohorts) : [];

    // Sort by start date (newest first)
    return parsed.sort((a: Cohort, b: Cohort) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },

  /**
   * Get cohort by ID
   */
  async getCohortById(id: string): Promise<Cohort | null> {
    const cohorts = await this.getCohorts();
    return cohorts.find(c => c.id === id) || null;
  },

  /**
   * Create new cohort
   */
  async createCohort(data: CohortFormData): Promise<Cohort> {
    // Validate
    const validation = this.validateCohort(data);
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      ...data,
      status: this.determineStatus(data.startDate, data.endDate),
      granteeCount: 0,
      totalFunding: 0,
      fundingAllocated: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // TODO: Get from auth context
    };

    const cohorts = await this.getCohorts();
    cohorts.push(newCohort);
    localStorage.setItem('cohorts', JSON.stringify(cohorts));

    return newCohort;
  },

  /**
   * Update existing cohort
   */
  async updateCohort(id: string, updates: Partial<CohortFormData>): Promise<Cohort> {
    const cohorts = await this.getCohorts();
    const index = cohorts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cohort not found');
    }

    // Validate if updating dates
    if (updates.startDate || updates.endDate) {
      const validation = this.validateCohort({
        name: cohorts[index].name,
        description: cohorts[index].description,
        startDate: updates.startDate || cohorts[index].startDate,
        endDate: updates.endDate || cohorts[index].endDate,
      });

      if (!validation.valid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
    }

    cohorts[index] = {
      ...cohorts[index],
      ...updates,
      status: updates.startDate || updates.endDate
        ? this.determineStatus(
            updates.startDate || cohorts[index].startDate,
            updates.endDate || cohorts[index].endDate
          )
        : cohorts[index].status,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('cohorts', JSON.stringify(cohorts));
    return cohorts[index];
  },

  /**
   * Archive a cohort
   */
  async archiveCohort(id: string): Promise<void> {
    const cohorts = await this.getCohorts();
    const index = cohorts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cohort not found');
    }

    cohorts[index] = {
      ...cohorts[index],
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('cohorts', JSON.stringify(cohorts));
  },

  /**
   * Delete a cohort
   */
  async deleteCohort(id: string): Promise<void> {
    const cohorts = await this.getCohorts();
    const filtered = cohorts.filter(c => c.id !== id);

    if (filtered.length === cohorts.length) {
      throw new Error('Cohort not found');
    }

    localStorage.setItem('cohorts', JSON.stringify(filtered));
  },

  /**
   * Validate cohort data
   */
  validateCohort(data: CohortFormData): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Cohort name is required';
    } else if (data.name.length < 3) {
      errors.name = 'Cohort name must be at least 3 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Cohort name must be less than 100 characters';
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      errors.description = 'Description is required';
    } else if (data.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (data.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Date validation
    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        errors.endDate = 'End date must be after start date';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Determine cohort status based on dates
   */
  determineStatus(startDate: string, endDate: string): 'active' | 'upcoming' | 'archived' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'upcoming';
    } else if (now > end) {
      return 'archived';
    } else {
      return 'active';
    }
  },
};
```

#### Step 3: Update Component
**File:** `apps/shell/src/app/funder/cohorts/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowButton, GlowInput, GlowTextarea, GlowModal } from '@vision/design-system';
import { cohortService } from '@/services/cohortService';
import type { Cohort, CohortFormData, CohortFormErrors } from '@/types/cohort';

export default function FunderCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [formData, setFormData] = useState<CohortFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<CohortFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const data = await cohortService.getCohorts();
      setCohorts(data);
    } catch (err) {
      setError('Failed to load cohorts');
    }
  };

  const handleCreateOpen = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEditOpen = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setFormData({
      name: cohort.name,
      description: cohort.description,
      startDate: cohort.startDate.split('T')[0], // Convert to YYYY-MM-DD
      endDate: cohort.endDate.split('T')[0],
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreate = async () => {
    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await cohortService.createCohort(formData);
      await loadCohorts();
      setIsCreateModalOpen(false);
      setSuccess('Cohort created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Failed to create cohort' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCohort) return;

    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await cohortService.updateCohort(selectedCohort.id, formData);
      await loadCohorts();
      setIsEditModalOpen(false);
      setSuccess('Cohort updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Failed to update cohort' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (cohort: Cohort) => {
    if (!confirm(`Archive cohort "${cohort.name}"? This action can be reversed later.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cohortService.archiveCohort(cohort.id);
      await loadCohorts();
      setSuccess('Cohort archived successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to archive cohort');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cohort: Cohort) => {
    if (!confirm(`Delete cohort "${cohort.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cohortService.deleteCohort(cohort.id);
      await loadCohorts();
      setSuccess('Cohort deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete cohort');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Cohort['status']) => {
    const styles = {
      active: 'bg-vision-success-100 text-vision-success-700',
      upcoming: 'bg-vision-blue-100 text-vision-blue-700',
      archived: 'bg-vision-text-tertiary text-vision-text-primary',
    };

    return (
      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-vision-text-primary text-3xl font-bold">
            Cohorts
          </h1>
          <p className="text-vision-text-secondary mt-1">
            Manage grantee cohorts and funding cycles
          </p>
        </div>

        <GlowButton onClick={handleCreateOpen} disabled={isLoading}>
          Create Cohort
        </GlowButton>
      </div>

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

      <div className="grid gap-6">
        {cohorts.length === 0 ? (
          <div className="bg-vision-surface-secondary rounded-lg p-8 text-center">
            <p className="text-vision-text-secondary">
              No cohorts yet. Create your first cohort to get started.
            </p>
          </div>
        ) : (
          cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="bg-vision-surface-secondary border border-vision-border-default rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-vision-text-primary text-xl font-semibold">
                      {cohort.name}
                    </h2>
                    {getStatusBadge(cohort.status)}
                  </div>
                  <p className="text-vision-text-secondary">
                    {cohort.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <GlowButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditOpen(cohort)}
                    disabled={isLoading}
                    aria-label={`Edit ${cohort.name}`}
                  >
                    Edit
                  </GlowButton>

                  {cohort.status !== 'archived' && (
                    <GlowButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(cohort)}
                      disabled={isLoading}
                      aria-label={`Archive ${cohort.name}`}
                    >
                      Archive
                    </GlowButton>
                  )}

                  <GlowButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cohort)}
                    disabled={isLoading}
                    aria-label={`Delete ${cohort.name}`}
                  >
                    Delete
                  </GlowButton>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-vision-border-subtle">
                <div>
                  <span className="text-vision-text-tertiary text-xs">Start Date</span>
                  <p className="text-vision-text-primary font-medium">
                    {new Date(cohort.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-vision-text-tertiary text-xs">End Date</span>
                  <p className="text-vision-text-primary font-medium">
                    {new Date(cohort.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-vision-text-tertiary text-xs">Grantees</span>
                  <p className="text-vision-text-primary font-medium">
                    {cohort.granteeCount}
                  </p>
                </div>
                <div>
                  <span className="text-vision-text-tertiary text-xs">Total Funding</span>
                  <p className="text-vision-text-primary font-medium">
                    ${cohort.totalFunding.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <GlowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Cohort"
      >
        <div className="space-y-4">
          {errors._form && (
            <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded">
              {errors._form}
            </div>
          )}

          <GlowInput
            label="Cohort Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isLoading}
            required
          />

          <GlowTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            rows={3}
            disabled={isLoading}
            required
          />

          <GlowInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
            disabled={isLoading}
            required
          />

          <GlowInput
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
            disabled={isLoading}
            required
          />

          <div className="flex justify-end gap-3">
            <GlowButton
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </GlowButton>
            <GlowButton onClick={handleCreate} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Cohort'}
            </GlowButton>
          </div>
        </div>
      </GlowModal>

      {/* Edit Modal */}
      <GlowModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Cohort"
      >
        <div className="space-y-4">
          {errors._form && (
            <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded">
              {errors._form}
            </div>
          )}

          <GlowInput
            label="Cohort Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isLoading}
            required
          />

          <GlowTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            rows={3}
            disabled={isLoading}
            required
          />

          <GlowInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
            disabled={isLoading}
            required
          />

          <GlowInput
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
            disabled={isLoading}
            required
          />

          <div className="flex justify-end gap-3">
            <GlowButton
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </GlowButton>
            <GlowButton onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Cohort'}
            </GlowButton>
          </div>
        </div>
      </GlowModal>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Create cohort works with validation
- ✅ Edit cohort works with validation
- ✅ Archive cohort works
- ✅ Delete cohort works with confirmation
- ✅ Cohort status auto-updates based on dates
- ✅ All data persists in localStorage
- ✅ Form validation prevents invalid data
- ✅ Error messages display properly

---

### ISSUE 3: ACCESSIBILITY (Week 5 - 2 hours)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Add proper aria-labels to all interactive elements

```typescript
// ✅ All buttons have descriptive aria-labels
<GlowButton
  onClick={handleCreateOpen}
  aria-label="Create new cohort"
>
  Create Cohort
</GlowButton>

<GlowButton
  variant="ghost"
  size="sm"
  onClick={() => handleEditOpen(cohort)}
  aria-label={`Edit cohort ${cohort.name}`}
>
  Edit
</GlowButton>

<GlowButton
  variant="ghost"
  size="sm"
  onClick={() => handleArchive(cohort)}
  aria-label={`Archive cohort ${cohort.name}`}
>
  Archive
</GlowButton>

<GlowButton
  variant="ghost"
  size="sm"
  onClick={() => handleDelete(cohort)}
  aria-label={`Delete cohort ${cohort.name}`}
>
  Delete
</GlowButton>

// ✅ Modals have proper ARIA attributes
<GlowModal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  title="Create New Cohort"
  aria-labelledby="create-cohort-title"
  aria-describedby="create-cohort-description"
>
  {/* Content */}
</GlowModal>

// ✅ Status badges have sr-only text
<span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
  {status.charAt(0).toUpperCase() + status.slice(1)}
  <span className="sr-only">cohort status</span>
</span>
```

**Success Criteria:**
- ✅ All buttons have aria-labels
- ✅ Modals have proper ARIA attributes
- ✅ Keyboard navigation works
- ✅ Focus management in modals
- ✅ WCAG 2.1 AA compliant

---

## EXECUTION WORKFLOW

```bash
# Setup
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-16-funder-cohorts
pnpm install

# Self-review
cat apps/shell/src/app/funder/cohorts/page.tsx

# Make changes

# Validate
pnpm type-check
pnpm lint
pnpm validate:colors       # Agent 001
pnpm test apps/shell/src/app/funder/cohorts/page.test.tsx
pnpm build

# Manual test
pnpm dev

# Create PR
git add [files]
git commit -m "fix(page-16): [work done]"
git push origin [branch]
gh pr create
```

---

## SUCCESS CRITERIA

### All Agents MUST Verify:
- ✅ All validation commands pass
- ✅ Self-review performed
- ✅ Additional issues documented
- ✅ ALL issues fixed (not just listed)
- ✅ Tests pass (≥85% coverage)
- ✅ Manual testing complete
- ✅ PR created

---

## QUICK REFERENCE

**Files:**
- `apps/shell/src/app/funder/cohorts/page.tsx`
- `apps/shell/src/services/cohortService.ts` (Agent 004)
- `apps/shell/src/types/cohort.ts` (Agent 004)

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
git checkout -b fix/[agent]-page-16-funder-cohorts
pnpm install
```
