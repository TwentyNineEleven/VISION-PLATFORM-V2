import posthog from 'posthog-js';

/**
 * PostHog Analytics Client
 *
 * Provides client-side analytics tracking for user behavior, feature usage,
 * and product metrics.
 *
 * Features:
 * - User identification and properties
 * - Event tracking with properties
 * - Feature flags
 * - Session recording
 * - A/B testing support
 */

let posthogInitialized = false;

/**
 * Initialize PostHog client
 *
 * Call this once in your app initialization (e.g., root layout or _app.tsx)
 */
export function initPostHog() {
  if (typeof window === 'undefined') {
    return; // PostHog only runs on client-side
  }

  if (posthogInitialized) {
    return; // Already initialized
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.warn('PostHog API key not configured. Analytics will be disabled.');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,

    // Privacy settings
    respect_dnt: true, // Respect Do Not Track browser setting
    opt_out_capturing_by_default: false,

    // Session recording settings
    session_recording: {
      maskAllInputs: true, // Mask all input fields (PII protection)
      maskTextSelector: '[data-ph-mask]', // Custom selector for masking
      recordCrossOriginIframes: false,
    },

    // Autocapture settings
    autocapture: {
      dom_event_allowlist: ['click', 'change', 'submit'], // Only capture specific events
      element_allowlist: ['button', 'a'], // Only capture specific elements
      css_selector_allowlist: ['[data-ph-capture]'], // Custom selector for autocapture
    },

    // Performance
    capture_pageview: true, // Automatically capture page views
    capture_pageleave: true, // Capture when users leave pages

    // Development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug(); // Enable debug mode in development
      }
    },
  });

  posthogInitialized = true;
}

/**
 * Get PostHog client instance
 *
 * @returns PostHog client or null if not initialized
 */
export function getPostHog() {
  if (typeof window === 'undefined') {
    return null;
  }
  return posthog;
}

/**
 * Identify user in PostHog
 *
 * @param userId - Unique user identifier
 * @param properties - Additional user properties
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  const ph = getPostHog();
  if (!ph) return;

  ph.identify(userId, {
    ...properties,
    identified_at: new Date().toISOString(),
  });
}

/**
 * Reset user identification (on logout)
 */
export function resetUser() {
  const ph = getPostHog();
  if (!ph) return;

  ph.reset();
}

/**
 * Set user properties
 *
 * @param properties - User properties to set
 */
export function setUserProperties(properties: Record<string, any>) {
  const ph = getPostHog();
  if (!ph) return;

  ph.people.set(properties);
}

/**
 * Track custom event
 *
 * @param eventName - Name of the event
 * @param properties - Event properties
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track page view
 *
 * @param pageName - Name of the page
 * @param properties - Additional properties
 */
export function trackPageView(pageName?: string, properties?: Record<string, any>) {
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('$pageview', {
    page_name: pageName,
    ...properties,
  });
}

/**
 * Check if feature flag is enabled
 *
 * @param flagKey - Feature flag key
 * @returns Boolean indicating if flag is enabled
 */
export function isFeatureEnabled(flagKey: string): boolean {
  const ph = getPostHog();
  if (!ph) return false;

  return ph.isFeatureEnabled(flagKey) || false;
}

/**
 * Get feature flag value (for multivariate flags)
 *
 * @param flagKey - Feature flag key
 * @returns Flag value or undefined
 */
export function getFeatureFlagValue(flagKey: string): string | boolean | undefined {
  const ph = getPostHog();
  if (!ph) return undefined;

  return ph.getFeatureFlag(flagKey);
}

/**
 * Start session recording
 */
export function startSessionRecording() {
  const ph = getPostHog();
  if (!ph) return;

  ph.startSessionRecording();
}

/**
 * Stop session recording
 */
export function stopSessionRecording() {
  const ph = getPostHog();
  if (!ph) return;

  ph.stopSessionRecording();
}

/**
 * Opt out of analytics tracking
 */
export function optOut() {
  const ph = getPostHog();
  if (!ph) return;

  ph.opt_out_capturing();
}

/**
 * Opt in to analytics tracking
 */
export function optIn() {
  const ph = getPostHog();
  if (!ph) return;

  ph.opt_in_capturing();
}

/**
 * Check if user has opted out
 */
export function hasOptedOut(): boolean {
  const ph = getPostHog();
  if (!ph) return true;

  return ph.has_opted_out_capturing();
}

export default posthog;
