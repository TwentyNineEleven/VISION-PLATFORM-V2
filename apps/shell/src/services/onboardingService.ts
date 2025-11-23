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
    if (typeof window === 'undefined') return;

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
    if (typeof window === 'undefined') return null;

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
    if (typeof window === 'undefined') return;

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
    if (typeof window === 'undefined') return;

    const allProgress = JSON.parse(
      localStorage.getItem('onboarding_progress') || '{}'
    );
    delete allProgress[appSlug];
    localStorage.setItem('onboarding_progress', JSON.stringify(allProgress));
  },
};
