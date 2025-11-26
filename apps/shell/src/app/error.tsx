'use client';

import React from 'react';
import { GlowButton, GlowBadge } from '@/components/glow-ui';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="bg-background">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <GlowCard variant="elevated" padding="lg" className="max-w-xl space-y-6 text-center">
          <GlowBadge variant="warning" size="sm">
            500 Error
          </GlowBadge>
          <GlowCardContent className="space-y-4">
            <div className="flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-glow-error-sm">
                <AlertTriangle className="h-6 w-6" />
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GlowButton glow="subtle" leftIcon={<RotateCw className="h-4 w-4" />} onClick={reset}>
                Try again
              </GlowButton>
              <GlowButton variant="outline" onClick={() => (window.location.href = '/dashboard')}>
                Go to Dashboard
              </GlowButton>
            </div>
          </GlowCardContent>
        </GlowCard>
      </div>
    </div>
  );
}
