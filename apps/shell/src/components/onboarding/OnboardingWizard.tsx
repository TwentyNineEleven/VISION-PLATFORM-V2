'use client';

import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlowBadge, GlowButton, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingStep } from './OnboardingStep';
import { UserProfileStep } from './UserProfileStep';
import { OrganizationStep } from './OrganizationStep';
import { AppSelectionStep } from './AppSelectionStep';
import { CompletionStep } from './CompletionStep';
import { onboardingSchema, type OnboardingFormValues } from './types';
import { mockApps } from '@/lib/mock-data';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useRouter } from 'next/navigation';

const steps: { id: string; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'organization', label: 'Organization' },
  { id: 'apps', label: 'App Selection' },
  { id: 'complete', label: 'Completion' },
];

export function OnboardingWizard() {
  const router = useRouter();
  const defaultSelectedApps = React.useMemo(
    () => mockApps.filter((app) => app.status === 'active').slice(0, 3).map((a) => a.id),
    []
  );

  const formMethods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      displayName: 'Sarah Johnson',
      title: 'Executive Director',
      phone: '',
      avatar: undefined,
      organizationChoice: 'create',
      organizationName: 'Hope Community Foundation',
      organizationType: 'nonprofit',
      inviteCode: '',
      ein: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      selectedApps: defaultSelectedApps,
      plan: 'pro',
      skipTour: false,
      enableEmailNotifications: true,
    },
  });

  const [currentStep, setCurrentStep] = React.useState(0);

  const [displayName, title, organizationChoice, organizationName, organizationType, inviteCode] =
    formMethods.watch([
      'displayName',
      'title',
      'organizationChoice',
      'organizationName',
      'organizationType',
      'inviteCode',
    ]);

  const goToDashboard = () => router.push('/dashboard');

  const fieldsByStep: Record<string, string[]> = {
    profile: ['displayName', 'title', 'phone', 'avatar'],
    organization:
      organizationChoice === 'join'
        ? ['organizationChoice', 'inviteCode']
        : [
            'organizationChoice',
            'organizationName',
            'organizationType',
            'ein',
            'website',
            'address.street',
            'address.city',
            'address.state',
            'address.postalCode',
            'address.country',
          ],
    apps: ['selectedApps', 'plan'],
    complete: [],
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return Boolean(displayName && title);
    }
    if (currentStep === 1) {
      return organizationChoice === 'create'
        ? Boolean(organizationName && organizationType)
        : Boolean(inviteCode);
    }
    return true;
  };

  const handleNext = async () => {
    const currentStepId = steps[currentStep].id;
    const fields = fieldsByStep[currentStepId] || [];
    const valid = fields.length ? await formMethods.trigger(fields as any, { shouldFocus: true }) : true;

    if (!valid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      goToDashboard();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepTitles: Record<(typeof steps)[number]['id'], { title: string; description: string }> = {
    profile: {
      title: 'Tell us about yourself',
      description: 'Personalize your account so teammates know who you are.',
    },
    organization: {
      title: 'Organization setup',
      description: 'Create or join an organization to collaborate with your team.',
    },
    apps: {
      title: 'Select your apps',
      description: 'Pick the tools you want to roll out first. You can change this anytime.',
    },
    complete: {
      title: 'You are all set',
      description: 'Review your preferences and jump into the platform.',
    },
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'profile':
        return <UserProfileStep />;
      case 'organization':
        return <OrganizationStep />;
      case 'apps':
        return <AppSelectionStep />;
      case 'complete':
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Onboarding</h1>
            <p className="text-sm text-muted-foreground">
              Guided setup to tailor VISION to your organization.
            </p>
          </div>
          <GlowBadge variant="info" size="sm">
            Guided wizard
          </GlowBadge>
        </div>

        <GlowCard variant="interactive" padding="lg" className="space-y-8">
          <GlowCardContent className="space-y-8 p-0">
            <OnboardingProgress steps={steps as any} currentStep={currentStep} />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              <OnboardingStep
                title={stepTitles[steps[currentStep].id].title}
                description={stepTitles[steps[currentStep].id].description}
              >
                {renderStep()}
              </OnboardingStep>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Progress</span>
                  <div className="flex h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-primary"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <GlowButton
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      leftIcon={<ArrowLeft className="h-4 w-4" />}
                    >
                      Back
                    </GlowButton>
                  )}

                  {currentStep < steps.length - 1 && (
                    <GlowButton
                      type="button"
                      variant="outline"
                      onClick={handleSkip}
                      rightIcon={<SkipForward className="h-4 w-4" />}
                    >
                      Skip
                    </GlowButton>
                  )}

                  <GlowButton
                    type="submit"
                    glow="subtle"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    disabled={!isStepValid()}
                  >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </GlowButton>
                </div>
              </div>
            </form>
          </GlowCardContent>
        </GlowCard>
      </div>
    </FormProvider>
  );
}
