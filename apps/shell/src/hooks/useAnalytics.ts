import { useCallback } from 'react';
import {
  trackEvent,
  identifyUser,
  resetUser,
  setUserProperties,
  isFeatureEnabled,
  getFeatureFlagValue,
  trackPageView,
} from '@/lib/analytics/posthog';

/**
 * useAnalytics Hook
 *
 * Provides easy access to analytics functions in React components
 *
 * Usage:
 * ```tsx
 * const { track, identify, reset } = useAnalytics();
 *
 * // Track event
 * track('Button Clicked', { buttonName: 'Submit' });
 *
 * // Identify user
 * identify(user.id, { name: user.name, email: user.email });
 *
 * // Reset on logout
 * reset();
 * ```
 */
export function useAnalytics() {
  // Track custom event
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, properties);
  }, []);

  // Identify user
  const identify = useCallback((userId: string, properties?: Record<string, any>) => {
    identifyUser(userId, properties);
  }, []);

  // Reset user (on logout)
  const reset = useCallback(() => {
    resetUser();
  }, []);

  // Set user properties
  const setProperties = useCallback((properties: Record<string, any>) => {
    setUserProperties(properties);
  }, []);

  // Track page view
  const pageView = useCallback((pageName?: string, properties?: Record<string, any>) => {
    trackPageView(pageName, properties);
  }, []);

  // Check feature flag
  const checkFeature = useCallback((flagKey: string): boolean => {
    return isFeatureEnabled(flagKey);
  }, []);

  // Get feature flag value
  const getFeatureValue = useCallback((flagKey: string): string | boolean | undefined => {
    return getFeatureFlagValue(flagKey);
  }, []);

  return {
    track,
    identify,
    reset,
    setProperties,
    pageView,
    checkFeature,
    getFeatureValue,
  };
}
