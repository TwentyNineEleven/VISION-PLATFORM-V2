'use client';

import React from 'react';
import Link from 'next/link';
import { GlowButton, GlowBadge } from '@/components/glow-ui';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <GlowCard variant="elevated" padding="lg" className="max-w-xl text-center space-y-6">
        <GlowBadge variant="info" size="sm">
          404 Not Found
        </GlowBadge>
        <GlowCardContent className="space-y-4">
          <h1 className="text-3xl font-semibold text-foreground">We couldn’t find that page</h1>
          <p className="text-muted-foreground">
            The link might be broken or the page may have been moved. Let’s get you back on track.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard">
              <GlowButton glow="subtle" leftIcon={<Home className="h-4 w-4" />}>
                Go to Dashboard
              </GlowButton>
            </Link>
            <GlowButton variant="outline" leftIcon={<Compass className="h-4 w-4" />} onClick={() => history.back()}>
              Go Back
            </GlowButton>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
