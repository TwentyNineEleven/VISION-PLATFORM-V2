'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';

interface OnboardingStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function OnboardingStep({ title, description, children, footer }: OnboardingStepProps) {
  return (
    <GlowCard variant="elevated" padding="lg" className="w-full">
      <GlowCardHeader className="space-y-2">
        <GlowCardTitle className="text-2xl">{title}</GlowCardTitle>
        <GlowCardDescription className="text-base">{description}</GlowCardDescription>
      </GlowCardHeader>
      <GlowCardContent className="space-y-6">{children}</GlowCardContent>
      {footer && <div className="border-t border-border px-6 py-4">{footer}</div>}
    </GlowCard>
  );
}
