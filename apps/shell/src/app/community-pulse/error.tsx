/**
 * CommunityPulse Error Boundary
 * Handles runtime errors in the CommunityPulse app
 */

'use client';

import { useEffect } from 'react';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPulseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('CommunityPulse Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <GlowCard className="max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="mt-6 text-xl font-semibold text-foreground">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          We encountered an error while loading CommunityPulse. This has been
          logged and we&apos;re working on a fix.
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <GlowButton variant="default" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </GlowButton>

          <Link href="/community-pulse">
            <GlowButton variant="outline">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </GlowButton>
          </Link>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            If this problem persists, please contact support at{' '}
            <a
              href="mailto:support@visionplatform.com"
              className="text-primary hover:underline"
            >
              support@visionplatform.com
            </a>
          </p>
        </div>
      </GlowCard>
    </div>
  );
}
