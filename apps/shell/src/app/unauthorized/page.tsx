'use client';

import React from 'react';
import Link from 'next/link';
import { GlowButton, GlowBadge } from '@/components/glow-ui';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { Lock, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <GlowCard variant="elevated" padding="lg" className="max-w-xl space-y-6 text-center">
        <GlowBadge variant="warning" size="sm">
          401 Unauthorized
        </GlowBadge>
        <GlowCardContent className="space-y-4">
          <div className="flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-glow-primary-sm">
              <Lock className="h-6 w-6" />
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Access requires permission</h1>
          <p className="text-muted-foreground">
            You may need to sign in with a different account or request access from your administrator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signin">
              <GlowButton glow="subtle" leftIcon={<LogIn className="h-4 w-4" />}>
                Sign in
              </GlowButton>
            </Link>
            <GlowButton variant="outline" onClick={() => history.back()}>
              Go Back
            </GlowButton>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
