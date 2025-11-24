# AGENT START PROMPT: PAGE 10 - SETTINGS: ORGANIZATION (`/settings/organization`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 10: Settings — Organization** (`/settings/organization`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/settings/organization/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 10 hours
- **Execution Timeline:** Week 2-4

**Issues to Fix:**
- 8 arbitrary hex colors → Bold Color System tokens
- 2 native inputs, 1 select, 1 color picker → Glow UI components
- Non-functional "Save" button

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 2 - 4 hours
2. **Agent 002** (Component Migration) - Week 2 - 5 hours
3. **Agent 004** (CTA Functionality) - Week 4 - 1 hour

**Success Criteria:**
- ✅ All 8 hex color violations fixed
- ✅ All native form components replaced with Glow UI
- ✅ Color picker component migrated
- ✅ Save button working with validation
- ✅ Organization data persists in localStorage
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

1. **Master Plan:** `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md` - Page 10 section
2. **Your Agent Prompt:** Read your complete agent-specific prompt
3. **Execution Guide:** `AGENT_EXECUTION_GUIDE.md`
4. **Remediation Plan:** `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: 8 HEX COLOR VIOLATIONS (Week 2 - 4 hours)

**Agent:** 001 (Color Compliance Specialist)

#### ⚠️ MANDATORY SELF-REVIEW
```bash
cat apps/shell/src/app/settings/organization/page.tsx
grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(\|gray-" apps/shell/src/app/settings/organization/page.tsx
pnpm validate:colors
```

**Expected Violations (minimum 8, find ALL):**
```typescript
// ❌ BEFORE - Arbitrary hex colors
<div style={{ backgroundColor: '#F3F4F6' }}>
  <h2 style={{ color: '#111827' }}>Organization Settings</h2>
  <div style={{ borderColor: '#E5E7EB' }}>
    <span style={{ color: '#6B7280' }}>Description</span>
  </div>
  <div className="bg-gray-50 border-gray-200">
    <button className="bg-#3B82F6">Save</button>
  </div>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-surface-secondary">
  <h2 className="text-vision-text-primary">Organization Settings</h2>
  <div className="border-vision-border-default">
    <span className="text-vision-text-secondary">Description</span>
  </div>
  <div className="bg-vision-surface-secondary border-vision-border-default">
    <button className="bg-vision-blue-600">Save</button>
  </div>
</div>
```

**Success Criteria:**
- ✅ All 8+ hex colors replaced
- ✅ No inline styles with colors
- ✅ `pnpm validate:colors` passes (0 violations)

---

### ISSUE 2: COMPONENT MIGRATION - 2 INPUTS, 1 SELECT, 1 COLOR PICKER (Week 2 - 5 hours)

**Agent:** 002 (Component Migration Specialist)

#### ⚠️ MANDATORY SELF-REVIEW
```bash
grep -rn "<input\|<select\|<button" apps/shell/src/app/settings/organization/page.tsx
pnpm validate:components
```

**Expected Native Components:**
```typescript
// ❌ BEFORE
<input
  type="text"
  value={orgName}
  onChange={(e) => setOrgName(e.target.value)}
  placeholder="Organization Name"
/>

<input
  type="text"
  value={website}
  onChange={(e) => setWebsite(e.target.value)}
  placeholder="Website URL"
/>

<select value={industry} onChange={(e) => setIndustry(e.target.value)}>
  <option value="">Select Industry</option>
  <option value="tech">Technology</option>
  <option value="finance">Finance</option>
</select>

<input
  type="color"
  value={brandColor}
  onChange={(e) => setBrandColor(e.target.value)}
/>
```

**Expected Fix:**
```typescript
// ✅ AFTER
import { GlowInput, GlowSelect, GlowColorPicker } from '@vision/design-system';

<GlowInput
  label="Organization Name"
  value={orgName}
  onChange={(e) => setOrgName(e.target.value)}
  error={errors.orgName}
  required
/>

<GlowInput
  label="Website URL"
  type="url"
  value={website}
  onChange={(e) => setWebsite(e.target.value)}
  error={errors.website}
  placeholder="https://example.com"
/>

<GlowSelect
  label="Industry"
  value={industry}
  onChange={(value) => setIndustry(value)}
  options={[
    { value: '', label: 'Select Industry' },
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
  ]}
  error={errors.industry}
  required
/>

<GlowColorPicker
  label="Brand Color"
  value={brandColor}
  onChange={(color) => setBrandColor(color)}
  error={errors.brandColor}
/>
```

**Success Criteria:**
- ✅ All native inputs replaced
- ✅ Select migrated with correct onChange signature
- ✅ Color picker migrated to GlowColorPicker
- ✅ `pnpm validate:components` passes

---

### ISSUE 3: SAVE FUNCTIONALITY (Week 4 - 1 hour)

**Agent:** 004 (CTA Functionality Specialist)

#### Types & Service Layer

**File:** `apps/shell/src/types/organization.ts`
```typescript
export interface Organization {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  brandColor?: string;
  logo?: string;
  updatedAt: string;
}
```

**File:** `apps/shell/src/services/organizationService.ts`
```typescript
import type { Organization } from '@/types/organization';

export const organizationService = {
  async getOrganization(): Promise<Organization | null> {
    const org = localStorage.getItem('organization');
    return org ? JSON.parse(org) : null;
  },

  async updateOrganization(data: Partial<Organization>): Promise<Organization> {
    const existing = await this.getOrganization();
    const updated: Organization = {
      id: existing?.id || 'org_1',
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('organization', JSON.stringify(updated));
    return updated;
  },

  validateOrganization(data: Partial<Organization>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Organization name is required';
    }

    if (data.website && !/^https?:\/\/.+/.test(data.website)) {
      errors.website = 'Please enter a valid URL';
    }

    if (!data.industry) {
      errors.industry = 'Please select an industry';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  },
};
```

**Success Criteria:**
- ✅ Save validates all fields
- ✅ Data persists in localStorage
- ✅ Success/error messages display
- ✅ Form resets after save

---

## EXECUTION WORKFLOW

```bash
# Setup
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-10-settings-org
pnpm install

# Perform self-review
cat apps/shell/src/app/settings/organization/page.tsx

# Make changes following your agent prompt

# Validate
pnpm type-check
pnpm lint
pnpm validate:colors       # Agent 001
pnpm validate:components   # Agent 002
pnpm test apps/shell/src/app/settings/organization/page.test.tsx
pnpm build

# Manual test
pnpm dev

# Create PR
git add [files]
git commit -m "fix(page-10): [work done]"
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
- `apps/shell/src/app/settings/organization/page.tsx`
- `apps/shell/src/services/organizationService.ts` (Agent 004)
- `apps/shell/src/types/organization.ts` (Agent 004)

**Commands:**
```bash
pnpm type-check
pnpm lint
pnpm validate:colors
pnpm validate:components
pnpm test [file]
pnpm build
pnpm dev
```

**Ready to start:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-10-settings-org
pnpm install
```
