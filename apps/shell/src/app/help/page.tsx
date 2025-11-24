'use client';

import * as React from 'react';
import { GlowButton, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Help & Documentation</h1>
        <p className="text-sm text-muted-foreground">
          Get help with using the VISION Platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlowCard variant="interactive">
          <GlowCardHeader>
            <GlowCardTitle>Getting Started</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              New to VISION? Start here to learn the basics.
            </p>
            <div className="space-y-2">
              <Link
                href="/help/quickstart"
                className="block text-sm text-vision-blue-600 hover:text-vision-blue-700"
              >
                Quick Start Guide
              </Link>
              <Link
                href="/help/tutorials"
                className="block text-sm text-vision-blue-600 hover:text-vision-blue-700"
              >
                Video Tutorials
              </Link>
            </div>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="interactive">
          <GlowCardHeader>
            <GlowCardTitle>Support</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Need assistance? Our support team is here to help.
            </p>
            <GlowButton
              variant="outline"
              onClick={() => window.open('mailto:support@visionplatform.com')}
              className="w-full"
            >
              Email Support
            </GlowButton>
          </GlowCardContent>
        </GlowCard>
      </div>
    </div>
  );
}
