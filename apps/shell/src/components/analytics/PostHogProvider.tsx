'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, trackPageView } from '@/lib/analytics/posthog';

/**
 * PostHog Provider Component
 *
 * Initializes PostHog analytics and tracks page views automatically.
 * Wrap your app with this component in the root layout.
 *
 * Features:
 * - Automatic PostHog initialization
 * - Automatic page view tracking on route changes
 * - Client-side only rendering
 */

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(pathname, { url });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
