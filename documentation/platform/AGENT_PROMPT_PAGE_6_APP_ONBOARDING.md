# AGENT START PROMPT: PAGE 6 - APP ONBOARDING (`/apps/[slug]/onboarding`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 6: App Onboarding** (`/apps/[slug]/onboarding`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/apps/[slug]/onboarding/page.tsx`
- **Priority:** P1 - High
- **Total Effort:** 6 hours
- **Execution Timeline:** Week 2-4

**Issues to Fix:**
- Mock/non-functional stepper (no state management)
- Missing form validation
- Non-functional "Continue" and "Complete" buttons

**Agents Involved:**
1. **Agent 002** (Component Migration) - Week 3 - 2 hours
2. **Agent 004** (CTA Functionality) - Week 4 - 4 hours

**Success Criteria:**
- ✅ Multi-step stepper fully functional with state management
- ✅ Form validation implemented with Zod
- ✅ All CTA buttons working (Continue, Back, Complete)
- ✅ Onboarding data persists in localStorage
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 6 section
- Understand all issues and priorities
- Note the agent assignments and timeline

### 2. Your Agent-Specific Prompt
**Determine which agent you are:**
- **Agent 002 (Components)?** Read `AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md`
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

### ISSUE 1: STEPPER COMPONENT (Week 3 - 2 hours)

**Agent:** 002 (Component Migration Specialist)

**Assignment:** Migrate native HTML stepper to Glow UI Stepper component

**Current Problem:**
```typescript
// ❌ BEFORE - Native HTML with no state management
<div className="flex items-center">
  <div className="flex items-center">
    <div className="w-8 h-8 bg-blue-600 text-white rounded-full">1</div>
    <span className="ml-2">Basic Info</span>
  </div>
  <div className="w-16 h-1 bg-gray-300 mx-2"></div>
  <div className="flex items-center">
    <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full">2</div>
    <span className="ml-2">Configuration</span>
  </div>
  <div className="w-16 h-1 bg-gray-300 mx-2"></div>
  <div className="flex items-center">
    <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full">3</div>
    <span className="ml-2">Permissions</span>
  </div>
</div>
```

**Expected Implementation:**

#### Step 1: Install Glow UI Stepper
```typescript
// Import from design system
import { GlowStepper } from '@vision/design-system';
```

#### Step 2: Define Steps Configuration
```typescript
const onboardingSteps = [
  {
    id: 'basic-info',
    label: 'Basic Info',
    description: 'Provide basic app information',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    description: 'Configure app settings',
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Select required permissions',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Review and complete setup',
  },
];
```

#### Step 3: Implement State Management
```typescript
'use client';

import { useState } from 'react';
import { GlowStepper } from '@vision/design-system';

export default function AppOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or the next step
    if (completedSteps.includes(stepIndex) || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <GlowStepper
        steps={onboardingSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step content will be rendered below */}
    </div>
  );
}
```

**Validation Commands:**
```bash
# Type-check
pnpm type-check

# Component validation
pnpm validate:components

# Run tests
pnpm test apps/shell/src/app/apps/[slug]/onboarding/page.test.tsx
```

**Success Criteria:**
- ✅ Glow UI Stepper component used
- ✅ Native HTML stepper removed
- ✅ State management for current/completed steps
- ✅ Visual feedback for active/completed states
- ✅ Type-check passes

---

### ISSUE 2: FORM VALIDATION & CTA FUNCTIONALITY (Week 4 - 4 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement form validation and functional Continue/Back/Complete buttons

#### Step 1: Install and Configure Zod
```bash
# Zod should already be installed, but verify
pnpm list zod
```

#### Step 2: Create Validation Schemas
**File:** `apps/shell/src/schemas/onboardingSchema.ts`

```typescript
import { z } from 'zod';

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  appName: z
    .string()
    .min(1, 'App name is required')
    .max(50, 'App name must be less than 50 characters'),
  appDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters'),
  category: z.string().min(1, 'Please select a category'),
});

// Step 2: Configuration
export const configurationSchema = z.object({
  apiKey: z
    .string()
    .min(10, 'API key must be at least 10 characters')
    .max(100, 'API key is too long'),
  webhookUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  environment: z.enum(['development', 'staging', 'production'], {
    errorMap: () => ({ message: 'Please select an environment' }),
  }),
  autoSync: z.boolean().default(false),
});

// Step 3: Permissions
export const permissionsSchema = z.object({
  permissions: z
    .array(z.string())
    .min(1, 'Select at least one permission')
    .max(10, 'Too many permissions selected'),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    inApp: z.boolean().default(true),
    webhook: z.boolean().default(false),
  }),
});

// Complete onboarding schema
export const onboardingSchema = z.object({
  basicInfo: basicInfoSchema,
  configuration: configurationSchema,
  permissions: permissionsSchema,
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type ConfigurationData = z.infer<typeof configurationSchema>;
export type PermissionsData = z.infer<typeof permissionsSchema>;
```

#### Step 3: Create Onboarding Service
**File:** `apps/shell/src/services/onboardingService.ts`

```typescript
import type { OnboardingData } from '@/schemas/onboardingSchema';

export interface OnboardingProgress {
  appSlug: string;
  currentStep: number;
  completedSteps: number[];
  data: Partial<OnboardingData>;
  startedAt: string;
  lastUpdatedAt: string;
}

export const onboardingService = {
  /**
   * Save onboarding progress to localStorage
   */
  async saveProgress(
    appSlug: string,
    currentStep: number,
    completedSteps: number[],
    data: Partial<OnboardingData>
  ): Promise<void> {
    const progress: OnboardingProgress = {
      appSlug,
      currentStep,
      completedSteps,
      data,
      startedAt: this.getExistingProgress(appSlug)?.startedAt || new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    const allProgress = JSON.parse(
      localStorage.getItem('onboarding_progress') || '{}'
    );
    allProgress[appSlug] = progress;
    localStorage.setItem('onboarding_progress', JSON.stringify(allProgress));
  },

  /**
   * Get saved onboarding progress
   */
  getExistingProgress(appSlug: string): OnboardingProgress | null {
    const allProgress = JSON.parse(
      localStorage.getItem('onboarding_progress') || '{}'
    );
    return allProgress[appSlug] || null;
  },

  /**
   * Complete onboarding
   * Saves final configuration to installed apps
   */
  async completeOnboarding(
    appSlug: string,
    data: OnboardingData
  ): Promise<void> {
    // Save to installed apps configuration
    const installations = JSON.parse(
      localStorage.getItem('app_installations') || '{}'
    );

    installations[appSlug] = {
      installedAt: new Date().toISOString(),
      configuration: data,
      status: 'active',
    };

    localStorage.setItem('app_installations', JSON.stringify(installations));

    // Clear onboarding progress
    const allProgress = JSON.parse(
      localStorage.getItem('onboarding_progress') || '{}'
    );
    delete allProgress[appSlug];
    localStorage.setItem('onboarding_progress', JSON.stringify(allProgress));

    // Add to installed apps list
    const installedApps = JSON.parse(
      localStorage.getItem('installed_apps') || '[]'
    );
    if (!installedApps.includes(appSlug)) {
      installedApps.push(appSlug);
      localStorage.setItem('installed_apps', JSON.stringify(installedApps));
    }
  },

  /**
   * Cancel onboarding and clear progress
   */
  async cancelOnboarding(appSlug: string): Promise<void> {
    const allProgress = JSON.parse(
      localStorage.getItem('onboarding_progress') || '{}'
    );
    delete allProgress[appSlug];
    localStorage.setItem('onboarding_progress', JSON.stringify(allProgress));
  },
};
```

#### Step 4: Implement Full Component with Validation
**File:** `apps/shell/src/app/apps/[slug]/onboarding/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GlowStepper, GlowButton, GlowInput, GlowSelect, GlowCheckbox } from '@vision/design-system';
import {
  basicInfoSchema,
  configurationSchema,
  permissionsSchema,
  type OnboardingData,
} from '@/schemas/onboardingSchema';
import { onboardingService } from '@/services/onboardingService';
import { z } from 'zod';

const onboardingSteps = [
  { id: 'basic-info', label: 'Basic Info', description: 'Provide basic app information' },
  { id: 'configuration', label: 'Configuration', description: 'Configure app settings' },
  { id: 'permissions', label: 'Permissions', description: 'Select required permissions' },
  { id: 'review', label: 'Review', description: 'Review and complete setup' },
];

export default function AppOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const appSlug = params.slug as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Form data for each step
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    basicInfo: { appName: '', appDescription: '', category: '' },
    configuration: { apiKey: '', webhookUrl: '', environment: 'development', autoSync: false },
    permissions: { permissions: [], notificationPreferences: { email: true, inApp: true, webhook: false } },
  });

  // Load existing progress on mount
  useEffect(() => {
    const progress = onboardingService.getExistingProgress(appSlug);
    if (progress) {
      setCurrentStep(progress.currentStep);
      setCompletedSteps(progress.completedSteps);
      setFormData(progress.data);
    }
  }, [appSlug]);

  // Save progress whenever step or data changes
  useEffect(() => {
    const saveProgress = async () => {
      await onboardingService.saveProgress(
        appSlug,
        currentStep,
        completedSteps,
        formData
      );
    };
    saveProgress();
  }, [currentStep, completedSteps, formData, appSlug]);

  const validateStep = async (step: number): Promise<boolean> => {
    setErrors({});

    try {
      if (step === 0) {
        basicInfoSchema.parse(formData.basicInfo);
      } else if (step === 1) {
        configurationSchema.parse(formData.configuration);
      } else if (step === 2) {
        permissionsSchema.parse(formData.permissions);
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      }
      return false;
    }
  };

  const handleContinue = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid) {
      // Mark current step as complete
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Move to next step
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Validate all data
      const isValid = await validateStep(currentStep);
      if (!isValid) {
        return;
      }

      // Complete onboarding
      await onboardingService.completeOnboarding(appSlug, formData as OnboardingData);

      // Navigate to app detail page
      router.push(`/apps/${appSlug}?onboarding=complete`);
    } catch (err) {
      setErrors({
        _form: ['Failed to complete onboarding. Please try again.'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (step: keyof OnboardingData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-vision-text-primary text-2xl font-bold">Basic Information</h2>

            <GlowInput
              label="App Name"
              value={formData.basicInfo?.appName || ''}
              onChange={(e) => updateFormData('basicInfo', { appName: e.target.value })}
              error={errors.appName?.[0]}
              required
            />

            <GlowInput
              label="Description"
              value={formData.basicInfo?.appDescription || ''}
              onChange={(e) => updateFormData('basicInfo', { appDescription: e.target.value })}
              error={errors.appDescription?.[0]}
              multiline
              rows={3}
              required
            />

            <GlowSelect
              label="Category"
              value={formData.basicInfo?.category || ''}
              onChange={(value) => updateFormData('basicInfo', { category: value })}
              error={errors.category?.[0]}
              options={[
                { value: 'productivity', label: 'Productivity' },
                { value: 'communication', label: 'Communication' },
                { value: 'analytics', label: 'Analytics' },
                { value: 'finance', label: 'Finance' },
              ]}
              required
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-vision-text-primary text-2xl font-bold">Configuration</h2>

            <GlowInput
              label="API Key"
              value={formData.configuration?.apiKey || ''}
              onChange={(e) => updateFormData('configuration', { apiKey: e.target.value })}
              error={errors.apiKey?.[0]}
              type="password"
              required
            />

            <GlowInput
              label="Webhook URL (Optional)"
              value={formData.configuration?.webhookUrl || ''}
              onChange={(e) => updateFormData('configuration', { webhookUrl: e.target.value })}
              error={errors.webhookUrl?.[0]}
              placeholder="https://example.com/webhook"
            />

            <GlowSelect
              label="Environment"
              value={formData.configuration?.environment || 'development'}
              onChange={(value) => updateFormData('configuration', { environment: value })}
              error={errors.environment?.[0]}
              options={[
                { value: 'development', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'production', label: 'Production' },
              ]}
              required
            />

            <GlowCheckbox
              label="Enable automatic synchronization"
              checked={formData.configuration?.autoSync || false}
              onChange={(checked) => updateFormData('configuration', { autoSync: checked })}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-vision-text-primary text-2xl font-bold">Permissions</h2>

            <div className="space-y-2">
              <label className="text-vision-text-primary font-medium">
                Required Permissions
              </label>
              {errors.permissions && (
                <p className="text-vision-error-600 text-sm">{errors.permissions[0]}</p>
              )}

              <GlowCheckbox
                label="Read user profile"
                checked={formData.permissions?.permissions?.includes('read:profile') || false}
                onChange={(checked) => {
                  const current = formData.permissions?.permissions || [];
                  const updated = checked
                    ? [...current, 'read:profile']
                    : current.filter((p) => p !== 'read:profile');
                  updateFormData('permissions', { permissions: updated });
                }}
              />

              <GlowCheckbox
                label="Write user data"
                checked={formData.permissions?.permissions?.includes('write:data') || false}
                onChange={(checked) => {
                  const current = formData.permissions?.permissions || [];
                  const updated = checked
                    ? [...current, 'write:data']
                    : current.filter((p) => p !== 'write:data');
                  updateFormData('permissions', { permissions: updated });
                }}
              />

              <GlowCheckbox
                label="Send notifications"
                checked={formData.permissions?.permissions?.includes('send:notifications') || false}
                onChange={(checked) => {
                  const current = formData.permissions?.permissions || [];
                  const updated = checked
                    ? [...current, 'send:notifications']
                    : current.filter((p) => p !== 'send:notifications');
                  updateFormData('permissions', { permissions: updated });
                }}
              />
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-vision-text-primary font-medium">
                Notification Preferences
              </label>

              <GlowCheckbox
                label="Email notifications"
                checked={formData.permissions?.notificationPreferences?.email || false}
                onChange={(checked) =>
                  updateFormData('permissions', {
                    notificationPreferences: {
                      ...formData.permissions?.notificationPreferences,
                      email: checked,
                    },
                  })
                }
              />

              <GlowCheckbox
                label="In-app notifications"
                checked={formData.permissions?.notificationPreferences?.inApp || false}
                onChange={(checked) =>
                  updateFormData('permissions', {
                    notificationPreferences: {
                      ...formData.permissions?.notificationPreferences,
                      inApp: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-vision-text-primary text-2xl font-bold">Review & Complete</h2>

            <div className="bg-vision-surface-secondary rounded-lg p-4 space-y-3">
              <div>
                <h3 className="text-vision-text-secondary text-sm font-medium">Basic Info</h3>
                <p className="text-vision-text-primary">{formData.basicInfo?.appName}</p>
                <p className="text-vision-text-secondary text-sm">{formData.basicInfo?.appDescription}</p>
              </div>

              <div>
                <h3 className="text-vision-text-secondary text-sm font-medium">Configuration</h3>
                <p className="text-vision-text-primary">Environment: {formData.configuration?.environment}</p>
                <p className="text-vision-text-secondary text-sm">
                  Auto-sync: {formData.configuration?.autoSync ? 'Enabled' : 'Disabled'}
                </p>
              </div>

              <div>
                <h3 className="text-vision-text-secondary text-sm font-medium">Permissions</h3>
                <p className="text-vision-text-primary">
                  {formData.permissions?.permissions?.length || 0} permissions selected
                </p>
              </div>
            </div>

            {errors._form && (
              <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded">
                {errors._form[0]}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <GlowStepper
        steps={onboardingSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(index) => {
          // Allow navigation to completed steps
          if (completedSteps.includes(index)) {
            setCurrentStep(index);
          }
        }}
      />

      <div className="mt-8 bg-vision-surface-primary rounded-lg p-6">
        {renderStepContent()}

        <div className="flex justify-between mt-8">
          <GlowButton
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
          >
            Back
          </GlowButton>

          {currentStep < onboardingSteps.length - 1 ? (
            <GlowButton onClick={handleContinue} disabled={isLoading}>
              Continue
            </GlowButton>
          ) : (
            <GlowButton onClick={handleComplete} disabled={isLoading}>
              {isLoading ? 'Completing...' : 'Complete Setup'}
            </GlowButton>
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
pnpm test apps/shell/src/app/apps/[slug]/onboarding/page.test.tsx

# Test in browser
pnpm dev
# Navigate to /apps/test-app/onboarding
```

**Success Criteria:**
- ✅ All form fields validated with Zod
- ✅ Error messages display inline
- ✅ Cannot advance with invalid data
- ✅ Continue button validates and advances
- ✅ Back button works properly
- ✅ Complete button saves and redirects
- ✅ Progress persists in localStorage
- ✅ Can resume onboarding from saved progress
- ✅ Success feedback on completion

---

## EXECUTION WORKFLOW

Follow these steps in order:

### Step 1: Setup
```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Create feature branch based on your agent
# Agent 002 (Components):
git checkout -b fix/components-page-6-app-onboarding

# Agent 004 (CTAs):
git checkout -b fix/ctas-page-6-app-onboarding

# Install dependencies
pnpm install
```

### Step 2: Identify Your Role
Determine which agent you are and what work you need to do:
- **Agent 002?** Migrate stepper to Glow UI component (Week 3 - 2 hours)
- **Agent 004?** Implement form validation and CTAs (Week 4 - 4 hours)

### Step 3: Read Your Specific Agent Prompt
Go to your agent-specific documentation:
- Agent 002: `AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md`
- Agent 004: `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

Follow the exact workflow described in your agent prompt.

### Step 4: Make Changes
- Edit the files as specified in your section above
- Follow the code examples provided
- Ensure proper Glow UI components (Agent 002)
- Ensure proper validation and service layer (Agent 004)

### Step 5: Run Validation
```bash
# Type-check
pnpm type-check

# Linting
pnpm lint

# Component validation
pnpm validate:components

# Run tests
pnpm test apps/shell/src/app/apps/[slug]/onboarding/page.test.tsx

# Build
pnpm build
```

### Step 6: Manual Testing
```bash
# Start dev server
pnpm dev

# Test in browser:
# 1. Navigate to /apps/test-app/onboarding
# 2. Test stepper component (Agent 002)
# 3. Test form validation (Agent 004)
# 4. Test Continue/Back/Complete buttons (Agent 004)
# 5. Verify localStorage persistence
# 6. Test error handling
```

### Step 7: Create PR
```bash
# Stage changes
git add apps/shell/src/app/apps/[slug]/onboarding/page.tsx
git add apps/shell/src/schemas/onboardingSchema.ts  # If Agent 004
git add apps/shell/src/services/onboardingService.ts  # If Agent 004

# Commit with descriptive message
git commit -m "fix(page-6): [Your agent's work]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Addresses Page 6 (App Onboarding) remediation
Agent: [Your agent number]
Effort: [X] hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
git push origin [your-branch-name]

# Create PR
gh pr create --title "fix(page-6): [Your agent's work]" --body "## Summary
[Describe changes]

## Testing
- [x] Type-check passes
- [x] Tests pass (≥85% coverage)
- [x] Build succeeds
- [x] Manual testing complete

## Agent
Agent [Your number]: [Your specialization]

Fixes Page 6 (App Onboarding) issues"
```

---

## SUCCESS CRITERIA

Before marking Page 6 complete, verify:

### Agent 002 (Components):
- ✅ Glow UI Stepper component used
- ✅ Native HTML stepper removed
- ✅ State management implemented
- ✅ `pnpm validate:components` passes

### Agent 004 (CTAs):
- ✅ Zod validation schemas created
- ✅ All form fields validated
- ✅ Error messages display inline
- ✅ Continue button works
- ✅ Back button works
- ✅ Complete button works
- ✅ Progress persists in localStorage
- ✅ Onboarding service created

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
- `apps/shell/src/app/apps/[slug]/onboarding/page.tsx` - Main page component
- `apps/shell/src/schemas/onboardingSchema.ts` - Zod validation (Agent 004)
- `apps/shell/src/services/onboardingService.ts` - Service layer (Agent 004)
- `apps/shell/src/app/apps/[slug]/onboarding/page.test.tsx` - Tests (Agent 006)

### Key Commands
```bash
pnpm type-check              # TypeScript validation
pnpm lint                    # ESLint
pnpm validate:components     # Component compliance
pnpm test [file]             # Run tests
pnpm build                   # Production build
pnpm dev                     # Development server
```

### Design System References
- Glow UI Components: `packages/design-system/src/components/`
- Stepper: `GlowStepper`
- Form Components: `GlowInput`, `GlowSelect`, `GlowCheckbox`
- Buttons: `GlowButton`

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
git checkout -b fix/[your-agent]-page-6-app-onboarding
pnpm install
```

Then proceed to your section above based on your agent role.
