/**
 * CommunityPulse Analytics Hook
 * Track engagement events for analytics and reporting
 */

import { useCallback } from 'react';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';

// Analytics event types
export type CommunityPulseEvent =
  | 'engagement_created'
  | 'engagement_updated'
  | 'engagement_completed'
  | 'engagement_exported'
  | 'engagement_archived'
  | 'stage_started'
  | 'stage_completed'
  | 'method_selected'
  | 'method_viewed'
  | 'material_generated'
  | 'material_downloaded'
  | 'template_used'
  | 'ai_recommendation_viewed'
  | 'ai_recommendation_accepted'
  | 'equity_checklist_completed';

interface EventProperties {
  engagementId?: string;
  organizationId?: string;
  stage?: number;
  methodSlug?: string;
  materialType?: string;
  templateId?: string;
  completionPercentage?: number;
  equityScore?: number;
  duration?: number;
  [key: string]: unknown;
}

interface AnalyticsProvider {
  track: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
}

// Default no-op provider for when analytics is not configured
const noopProvider: AnalyticsProvider = {
  track: () => {},
  identify: () => {},
};

// Get analytics provider (PostHog, etc.)
function getAnalyticsProvider(): AnalyticsProvider {
  // Check if PostHog is available
  if (typeof window !== 'undefined' && (window as { posthog?: AnalyticsProvider }).posthog) {
    return (window as { posthog: AnalyticsProvider }).posthog;
  }
  return noopProvider;
}

export function useCommunityPulseAnalytics() {
  const provider = getAnalyticsProvider();

  /**
   * Track a CommunityPulse event
   */
  const trackEvent = useCallback(
    (event: CommunityPulseEvent, properties?: EventProperties) => {
      try {
        provider.track(`community_pulse.${event}`, {
          ...properties,
          timestamp: new Date().toISOString(),
          source: 'community_pulse',
        });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    [provider]
  );

  /**
   * Track when user creates a new engagement
   */
  const trackEngagementCreated = useCallback(
    (engagement: Engagement) => {
      trackEvent('engagement_created', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        goalType: engagement.goalType,
      });
    },
    [trackEvent]
  );

  /**
   * Track when user completes a stage
   */
  const trackStageCompleted = useCallback(
    (engagement: Engagement, stage: number, duration?: number) => {
      trackEvent('stage_completed', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        stage,
        duration,
        completionPercentage: Math.round((stage / 7) * 100),
      });
    },
    [trackEvent]
  );

  /**
   * Track when user starts a stage
   */
  const trackStageStarted = useCallback(
    (engagementId: string, stage: number) => {
      trackEvent('stage_started', {
        engagementId,
        stage,
      });
    },
    [trackEvent]
  );

  /**
   * Track when user selects an engagement method
   */
  const trackMethodSelected = useCallback(
    (engagement: Engagement, method: EngagementMethod, isAiRecommended: boolean) => {
      trackEvent('method_selected', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        methodSlug: method.slug,
        methodCategory: method.category,
        isAiRecommended,
        goalType: engagement.goalType,
      });

      if (isAiRecommended) {
        trackEvent('ai_recommendation_accepted', {
          engagementId: engagement.id,
          methodSlug: method.slug,
        });
      }
    },
    [trackEvent]
  );

  /**
   * Track when user views AI recommendations
   */
  const trackAiRecommendationsViewed = useCallback(
    (engagementId: string, recommendedMethods: string[]) => {
      trackEvent('ai_recommendation_viewed', {
        engagementId,
        recommendedMethods,
        count: recommendedMethods.length,
      });
    },
    [trackEvent]
  );

  /**
   * Track when user generates a material
   */
  const trackMaterialGenerated = useCallback(
    (engagementId: string, materialType: string) => {
      trackEvent('material_generated', {
        engagementId,
        materialType,
      });
    },
    [trackEvent]
  );

  /**
   * Track when user downloads a material
   */
  const trackMaterialDownloaded = useCallback(
    (engagementId: string, materialType: string) => {
      trackEvent('material_downloaded', {
        engagementId,
        materialType,
      });
    },
    [trackEvent]
  );

  /**
   * Track when user completes equity checklist
   */
  const trackEquityChecklistCompleted = useCallback(
    (engagement: Engagement, score: number, totalItems: number) => {
      trackEvent('equity_checklist_completed', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        equityScore: Math.round((score / totalItems) * 100),
        itemsCompleted: score,
        totalItems,
      });
    },
    [trackEvent]
  );

  /**
   * Track when engagement is exported
   */
  const trackEngagementExported = useCallback(
    (engagement: Engagement, exportTargets: string[]) => {
      trackEvent('engagement_exported', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        exportTargets,
        methodUsed: engagement.primaryMethod,
        participationModel: engagement.participationModel,
      });
    },
    [trackEvent]
  );

  /**
   * Track when a template is used
   */
  const trackTemplateUsed = useCallback(
    (templateId: string, templateName: string, organizationId: string) => {
      trackEvent('template_used', {
        templateId,
        templateName,
        organizationId,
      });
    },
    [trackEvent]
  );

  /**
   * Calculate and track engagement completion metrics
   */
  const trackEngagementCompleted = useCallback(
    (engagement: Engagement, totalDuration?: number) => {
      // Calculate equity score
      const checklist = engagement.equityChecklist || {};
      let equityScore = 0;
      let totalItems = 0;

      Object.values(checklist).forEach((category) => {
        if (typeof category === 'object' && category !== null) {
          Object.values(category).forEach((value) => {
            if (typeof value === 'boolean') {
              totalItems++;
              if (value) equityScore++;
            }
          });
        }
      });

      trackEvent('engagement_completed', {
        engagementId: engagement.id,
        organizationId: engagement.organizationId,
        methodUsed: engagement.primaryMethod,
        participationModel: engagement.participationModel,
        estimatedParticipants: engagement.estimatedParticipants,
        budgetEstimate: engagement.budgetEstimate,
        equityScore: totalItems > 0 ? Math.round((equityScore / totalItems) * 100) : 0,
        totalDuration,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackEngagementCreated,
    trackStageCompleted,
    trackStageStarted,
    trackMethodSelected,
    trackAiRecommendationsViewed,
    trackMaterialGenerated,
    trackMaterialDownloaded,
    trackEquityChecklistCompleted,
    trackEngagementExported,
    trackTemplateUsed,
    trackEngagementCompleted,
  };
}
