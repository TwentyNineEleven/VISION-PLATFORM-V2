'use client';

import * as React from 'react';
import { GlowCard, GlowButton, Group, Stack, Text } from '@/components/glow-ui';
import { Sparkles } from 'lucide-react';
import type { Organization, User } from '@/lib/dashboard/mockDashboardData';

export interface HeroWelcomeProps {
  user: User;
  organization: Organization;
  onAskVisionAI?: () => void;
}

export function HeroWelcome({ user, organization, onAskVisionAI }: HeroWelcomeProps) {
  return (
    <GlowCard
      variant="glow"
      padding="lg"
      className="border-vision-gray-100"
      style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '16px',
      }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left side */}
        <Stack spacing="sm" className="flex-1">
          <Text size="xs" className="uppercase tracking-wider text-muted-foreground font-semibold">
            The Glow UI dashboard surfaces recommended next steps and curated actions across transformation phases so you stay ahead of deadlines.
          </Text>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {user.firstName}
          </h1>
          <Text size="sm" color="secondary">
            {organization.name} · Access to {organization.activeAppCount} active VISION apps
          </Text>
        </Stack>

        {/* Right side */}
        <Stack spacing="xs" className="flex-shrink-0 text-right lg:text-left">
          <Text size="sm" weight="medium" className="text-foreground">
            Need inspiration?
          </Text>
          <GlowButton
            variant="default"
            size="sm"
            onClick={onAskVisionAI}
            rightIcon={<Sparkles className="h-4 w-4" />}
            style={{
              backgroundColor: '#0047AB',
              color: '#FFFFFF',
            }}
          >
            Ask VISION AI
          </GlowButton>
        </Stack>
      </div>
    </GlowCard>
  );
}
