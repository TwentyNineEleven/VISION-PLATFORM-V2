'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Stepper, type Step } from '@/design-system/layout';
import {
  GlowButton,
  GlowInput,
  GlowSelect,
  GlowCheckbox,
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from '@/components/glow-ui';
import {
  basicInfoSchema,
  configurationSchema,
  permissionsSchema,
  type OnboardingData,
} from '@/schemas/onboardingSchema';
import { onboardingService } from '@/services/onboardingService';
import { z } from 'zod';

const onboardingSteps: Step[] = [
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

export default function AppOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const appSlug = params.slug as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Form data for each step
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    basicInfo: { appName: '', appDescription: '', category: '' },
    configuration: {
      apiKey: '',
      webhookUrl: '',
      environment: 'development',
      autoSync: false,
    },
    permissions: {
      permissions: [],
      notificationPreferences: { email: true, inApp: true, webhook: false },
    },
  });

  // Load existing progress on mount
  useEffect(() => {
    const progress = onboardingService.getExistingProgress(appSlug);
    if (progress) {
      setCurrentStep(progress.currentStep);
      setFormData(progress.data);
    }
  }, [appSlug]);

  // Save progress whenever step or data changes
  useEffect(() => {
    const saveProgress = async () => {
      await onboardingService.saveProgress(
        appSlug,
        currentStep,
        Array.from({ length: currentStep }, (_, i) => i),
        formData
      );
    };
    saveProgress();
  }, [currentStep, formData, appSlug]);

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
        setErrors(err.flatten().fieldErrors as Record<string, string[]>);
      }
      return false;
    }
  };

  const handleContinue = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid) {
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
        setIsLoading(false);
        return;
      }

      // Complete onboarding
      await onboardingService.completeOnboarding(
        appSlug,
        formData as OnboardingData
      );

      // Navigate to app detail page
      router.push(`/apps/${appSlug}?onboarding=complete`);
    } catch (err) {
      setErrors({
        _form: ['Failed to complete onboarding. Please try again.'],
      });
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
            <h2 className="text-foreground text-2xl font-bold">
              Basic Information
            </h2>

            <GlowInput
              label="App Name"
              value={formData.basicInfo?.appName || ''}
              onChange={(e) =>
                updateFormData('basicInfo', { appName: e.target.value })
              }
              error={errors.appName?.[0]}
              required
            />

            <GlowInput
              label="Description"
              value={formData.basicInfo?.appDescription || ''}
              onChange={(e) =>
                updateFormData('basicInfo', { appDescription: e.target.value })
              }
              error={errors.appDescription?.[0]}
              helperText="At least 10 characters"
              required
            />

            <GlowSelect
              label="Category"
              value={formData.basicInfo?.category || ''}
              onChange={(e) =>
                updateFormData('basicInfo', { category: e.target.value })
              }
              error={errors.category?.[0]}
              required
            >
              <option value="">Select a category</option>
              <option value="productivity">Productivity</option>
              <option value="communication">Communication</option>
              <option value="analytics">Analytics</option>
              <option value="finance">Finance</option>
            </GlowSelect>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-foreground text-2xl font-bold">Configuration</h2>

            <GlowInput
              label="API Key"
              value={formData.configuration?.apiKey || ''}
              onChange={(e) =>
                updateFormData('configuration', { apiKey: e.target.value })
              }
              error={errors.apiKey?.[0]}
              type="password"
              required
            />

            <GlowInput
              label="Webhook URL (Optional)"
              value={formData.configuration?.webhookUrl || ''}
              onChange={(e) =>
                updateFormData('configuration', { webhookUrl: e.target.value })
              }
              error={errors.webhookUrl?.[0]}
              placeholder="https://example.com/webhook"
            />

            <GlowSelect
              label="Environment"
              value={formData.configuration?.environment || 'development'}
              onChange={(e) =>
                updateFormData('configuration', { environment: e.target.value })
              }
              error={errors.environment?.[0]}
              required
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </GlowSelect>

            <GlowCheckbox
              label="Enable automatic synchronization"
              checked={formData.configuration?.autoSync || false}
              onChange={(checked) =>
                updateFormData('configuration', { autoSync: checked })
              }
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-foreground text-2xl font-bold">Permissions</h2>

            <div className="space-y-2">
              <label className="text-foreground font-medium">
                Required Permissions
              </label>
              {errors.permissions && (
                <p className="text-destructive text-sm">
                  {errors.permissions[0]}
                </p>
              )}

              <GlowCheckbox
                label="Read user profile"
                checked={
                  formData.permissions?.permissions?.includes('read:profile') ||
                  false
                }
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
                checked={
                  formData.permissions?.permissions?.includes('write:data') ||
                  false
                }
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
                checked={
                  formData.permissions?.permissions?.includes(
                    'send:notifications'
                  ) || false
                }
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
              <label className="text-foreground font-medium">
                Notification Preferences
              </label>

              <GlowCheckbox
                label="Email notifications"
                checked={
                  formData.permissions?.notificationPreferences?.email || false
                }
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
                checked={
                  formData.permissions?.notificationPreferences?.inApp || false
                }
                onChange={(checked) =>
                  updateFormData('permissions', {
                    notificationPreferences: {
                      ...formData.permissions?.notificationPreferences,
                      inApp: checked,
                    },
                  })
                }
              />

              <GlowCheckbox
                label="Webhook notifications"
                checked={
                  formData.permissions?.notificationPreferences?.webhook ||
                  false
                }
                onChange={(checked) =>
                  updateFormData('permissions', {
                    notificationPreferences: {
                      ...formData.permissions?.notificationPreferences,
                      webhook: checked,
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
            <h2 className="text-foreground text-2xl font-bold">
              Review & Complete
            </h2>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  Basic Info
                </h3>
                <p className="text-foreground">{formData.basicInfo?.appName}</p>
                <p className="text-muted-foreground text-sm">
                  {formData.basicInfo?.appDescription}
                </p>
              </div>

              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  Configuration
                </h3>
                <p className="text-foreground">
                  Environment: {formData.configuration?.environment}
                </p>
                <p className="text-muted-foreground text-sm">
                  Auto-sync:{' '}
                  {formData.configuration?.autoSync ? 'Enabled' : 'Disabled'}
                </p>
              </div>

              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  Permissions
                </h3>
                <p className="text-foreground">
                  {formData.permissions?.permissions?.length || 0} permissions
                  selected
                </p>
              </div>
            </div>

            {errors._form && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded">
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
      <Stepper
        steps={onboardingSteps}
        currentStep={currentStep}
        onStepClick={(index) => {
          // Allow navigation to previous steps only
          if (index < currentStep) {
            setCurrentStep(index);
          }
        }}
      />

      <GlowCard variant="default" className="mt-8">
        <GlowCardContent className="p-6">
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <GlowButton
              variant="outline"
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
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
