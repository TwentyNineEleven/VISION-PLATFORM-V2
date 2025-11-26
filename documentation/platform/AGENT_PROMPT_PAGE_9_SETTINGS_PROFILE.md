# AGENT START PROMPT: PAGE 9 - SETTINGS: PROFILE (`/settings/profile`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 9: Settings — Profile** (`/settings/profile`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/settings/profile/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 7 hours
- **Execution Timeline:** Week 1-4

**Issues to Fix:**
- 4 color violations
- 3 native input elements + 1 textarea → Glow UI components
- Non-functional "Save" button

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 1 Thursday AM - 2 hours
2. **Agent 002** (Component Migration) - Week 1 Thursday PM - 3 hours
3. **Agent 004** (CTA Functionality) - Week 4 - 2 hours

**Success Criteria:**
- ✅ All 4 color violations fixed with Bold Color System tokens
- ✅ All 3 inputs + 1 textarea replaced with Glow UI components
- ✅ Save button working with form validation
- ✅ Profile data persists in localStorage
- ✅ Form validation with proper error messages
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
1. Read the target file (`apps/shell/src/app/settings/profile/page.tsx`)
2. Identify ALL issues related to your specialty (not just the ones listed)
3. Document any additional issues you find
4. Include fixes for ALL issues in your PR

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 9 section
- Understand all issues and priorities
- Note the agent assignments and timeline

### 2. Your Agent-Specific Prompt (MANDATORY)
- **Agent 001 (Colors)?** Read `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md` - Follow ALL steps
- **Agent 002 (Components)?** Read `AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md` - Follow ALL steps
- **Agent 004 (CTAs)?** Read `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md` - Follow ALL steps

### 3. Execution Guide
**File:** `documentation/platform/AGENT_EXECUTION_GUIDE.md`
- Review conflict prevention matrix
- Understand handoff procedures

### 4. Remediation Plan
**File:** `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`
- Review the 7-week roadmap
- Understand the 18-step workflow
- Review pre-merge quality gate (8 checks)

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: COLOR VIOLATIONS (Week 1 Thursday AM - 2 hours)

**Agent:** 001 (Color Compliance Specialist)

**Assignment:** Fix 4 color violations + any additional violations found during self-review

#### ⚠️ MANDATORY SELF-REVIEW
```bash
# Read entire file
cat apps/shell/src/app/settings/profile/page.tsx

# Search for ALL color violations
grep -rn "gray-\|slate-\|#[0-9a-fA-F]\{3,6\}\|rgb(\|bg-blue-\|text-blue-\|border-blue-" apps/shell/src/app/settings/profile/page.tsx

# Run validation
pnpm validate:colors
```

**Expected Violations (minimum 4, find ALL):**
```typescript
// ❌ BEFORE
<div className="bg-gray-50 border border-gray-200">
  <h2 className="text-gray-900">Profile Settings</h2>
  <p className="text-gray-600">Update your profile information</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white">
    Save Changes
  </button>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER
<div className="bg-vision-surface-secondary border border-vision-border-default">
  <h2 className="text-vision-text-primary">Profile Settings</h2>
  <p className="text-vision-text-secondary">Update your profile information</p>
  <button className="bg-vision-blue-600 hover:bg-vision-blue-700 text-white">
    Save Changes
  </button>
</div>
```

**Validation Commands:**
```bash
pnpm validate:colors  # MUST show 0 violations
pnpm type-check       # MUST pass
pnpm test apps/shell/src/app/settings/profile/page.test.tsx
pnpm build           # MUST succeed
```

---

### ISSUE 2: COMPONENT MIGRATION - 3 INPUTS + 1 TEXTAREA (Week 1 Thursday PM - 3 hours)

**Agent:** 002 (Component Migration Specialist)

**Assignment:** Replace 3 native inputs + 1 textarea with Glow UI components

#### ⚠️ MANDATORY SELF-REVIEW
```bash
# Search for ALL native form elements
grep -rn "<input\|<textarea\|<select\|<button" apps/shell/src/app/settings/profile/page.tsx

# Run validation
pnpm validate:components
```

**Expected Native Components:**
```typescript
// ❌ BEFORE - Native HTML inputs
<input
  type="text"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  className="border border-gray-300 rounded-md"
  placeholder="Full Name"
/>

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="border border-gray-300 rounded-md"
  placeholder="Email"
/>

<input
  type="text"
  value={jobTitle}
  onChange={(e) => setJobTitle(e.target.value)}
  className="border border-gray-300 rounded-md"
  placeholder="Job Title"
/>

<textarea
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  className="border border-gray-300 rounded-md"
  placeholder="Bio"
  rows={4}
/>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Glow UI components
import { GlowInput, GlowTextarea } from '@vision/design-system';

<GlowInput
  label="Full Name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  error={errors.fullName}
  required
/>

<GlowInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>

<GlowInput
  label="Job Title"
  value={jobTitle}
  onChange={(e) => setJobTitle(e.target.value)}
  error={errors.jobTitle}
/>

<GlowTextarea
  label="Bio"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  error={errors.bio}
  rows={4}
  placeholder="Tell us about yourself"
/>
```

**Validation Commands:**
```bash
pnpm validate:components  # MUST show 0 violations
pnpm type-check          # MUST pass
pnpm build              # MUST succeed
```

---

### ISSUE 3: SAVE FUNCTIONALITY (Week 4 - 2 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement save functionality with validation and persistence

#### Step 1: Create Types
**File:** `apps/shell/src/types/profile.ts`

```typescript
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  updatedAt: string;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  jobTitle?: string;
  bio?: string;
}

export interface ProfileFormErrors {
  fullName?: string;
  email?: string;
  jobTitle?: string;
  bio?: string;
  _form?: string;
}
```

#### Step 2: Create Profile Service
**File:** `apps/shell/src/services/profileService.ts`

```typescript
import type { UserProfile, ProfileFormData } from '@/types/profile';

export const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile | null> {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileFormData): Promise<UserProfile> {
    const existingProfile = await this.getProfile();

    const updatedProfile: UserProfile = {
      id: existingProfile?.id || 'user_1',
      ...existingProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    return updatedProfile;
  },

  /**
   * Validate profile data
   */
  validateProfile(data: ProfileFormData): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Full name validation
    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.fullName = 'Full name is required';
    } else if (data.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (data.fullName.length > 100) {
      errors.fullName = 'Full name must be less than 100 characters';
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Job title validation (optional)
    if (data.jobTitle && data.jobTitle.length > 100) {
      errors.jobTitle = 'Job title must be less than 100 characters';
    }

    // Bio validation (optional)
    if (data.bio && data.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
```

#### Step 3: Update Component
**File:** `apps/shell/src/app/settings/profile/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { GlowInput, GlowTextarea, GlowButton } from '@vision/design-system';
import { profileService } from '@/services/profileService';
import type { ProfileFormData, ProfileFormErrors } from '@/types/profile';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    jobTitle: '',
    bio: '',
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile) {
        setFormData({
          fullName: profile.fullName,
          email: profile.email,
          jobTitle: profile.jobTitle || '',
          bio: profile.bio || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setIsSaved(false);
    // Clear field error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      // Validate
      const validation = profileService.validateProfile(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      // Save
      await profileService.updateProfile(formData);
      setIsSaved(true);
      setHasChanges(false);

      // Hide success message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setErrors({
        _form: 'Failed to save profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-vision-surface-primary rounded-lg border border-vision-border-default p-6">
        <h1 className="text-vision-text-primary text-2xl font-bold mb-2">
          Profile Settings
        </h1>
        <p className="text-vision-text-secondary mb-6">
          Update your personal information and profile details
        </p>

        {errors._form && (
          <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
            {errors._form}
          </div>
        )}

        {isSaved && (
          <div className="bg-vision-success-50 border border-vision-success-200 text-vision-success-700 px-4 py-3 rounded mb-4">
            Profile saved successfully!
          </div>
        )}

        <div className="space-y-4">
          <GlowInput
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            required
            disabled={isLoading}
          />

          <GlowInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <GlowInput
            label="Job Title"
            value={formData.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            error={errors.jobTitle}
            disabled={isLoading}
            placeholder="e.g., Software Engineer"
          />

          <GlowTextarea
            label="Bio"
            value={formData.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            error={errors.bio}
            rows={4}
            disabled={isLoading}
            placeholder="Tell us about yourself"
            helperText={`${formData.bio?.length || 0}/500 characters`}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <GlowButton
            variant="ghost"
            onClick={loadProfile}
            disabled={isLoading || !hasChanges}
          >
            Cancel
          </GlowButton>

          <GlowButton
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
```

**Validation Commands:**
```bash
pnpm type-check
pnpm test apps/shell/src/app/settings/profile/page.test.tsx
pnpm build

# Manual testing
pnpm dev
# Navigate to /settings/profile
# Test form validation
# Test save functionality
# Verify persistence after page reload
```

**Success Criteria:**
- ✅ Save button validates all fields
- ✅ Proper error messages display
- ✅ Profile data persists in localStorage
- ✅ Success message displays after save
- ✅ Cancel button resets form
- ✅ Has changes detection works

---

## EXECUTION WORKFLOW

### Step 1: Setup
```bash
git checkout main && git pull origin main

# Agent 001:
git checkout -b fix/colors-page-9-settings-profile

# Agent 002:
git checkout -b fix/components-page-9-settings-profile

# Agent 004:
git checkout -b fix/ctas-page-9-settings-profile

pnpm install
```

### Step 2: Identify Your Role
- **Agent 001?** Fix 4 color violations (Week 1 Thursday AM - 2 hours)
- **Agent 002?** Migrate 3 inputs + 1 textarea (Week 1 Thursday PM - 3 hours)
- **Agent 004?** Implement save functionality (Week 4 - 2 hours)

### Step 3: READ YOUR COMPLETE AGENT PROMPT
**MANDATORY**: Read your agent-specific prompt completely and follow ALL steps

### Step 4: Perform Self-Review
1. Read target file completely
2. Search for ALL issues in your specialty
3. Document findings
4. Plan fixes for ALL issues

### Step 5: Make Changes
Follow code examples above and fix ALL issues found

### Step 6: Run ALL Validation Commands
```bash
pnpm type-check              # MUST pass
pnpm lint                    # MUST pass
pnpm validate:colors         # MUST pass (Agent 001)
pnpm validate:components     # MUST pass (Agent 002)
pnpm test apps/shell/src/app/settings/profile/page.test.tsx  # MUST pass
pnpm build                   # MUST succeed
```

### Step 7: Manual Testing
```bash
pnpm dev
# Navigate to /settings/profile
# Test all functionality based on your agent role
```

### Step 8: Create PR
```bash
git add [modified files]
git commit -m "fix(page-9): [Your agent's work]

- [Changes made]

Addresses Page 9 (Settings - Profile) remediation
Agent: [Your agent number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin [branch-name]
gh pr create --title "fix(page-9): [Your agent's work]"
```

---

## SUCCESS CRITERIA

### Agent 001:
- ✅ All 4 color violations fixed
- ✅ Additional violations found and fixed
- ✅ `pnpm validate:colors` passes

### Agent 002:
- ✅ All 3 inputs + 1 textarea replaced
- ✅ Additional native components found and replaced
- ✅ `pnpm validate:components` passes

### Agent 004:
- ✅ Save button works with validation
- ✅ Profile service created
- ✅ Data persists in localStorage
- ✅ Form validation works
- ✅ Error handling complete

### All Agents:
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85% coverage)
- ✅ `pnpm build` succeeds
- ✅ Manual testing complete
- ✅ PR created with documentation

---

## QUICK REFERENCE

### Files to Work On
- `apps/shell/src/app/settings/profile/page.tsx`
- `apps/shell/src/services/profileService.ts` (Agent 004)
- `apps/shell/src/types/profile.ts` (Agent 004)

### Key Commands
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

## GETTING STARTED

**Ready to start? Run:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-9-settings-profile
pnpm install
```

Then proceed based on your agent role.
