'use client';

import * as React from 'react';
import { GlowCard, GlowButton, Group, Stack, Text } from '@/components/glow-ui';
import { ArrowRight, BookOpen } from 'lucide-react';

export interface CatalogBannerProps {
  totalApps: number;
  onOpenCatalog?: () => void;
  onLearnMore?: () => void;
}

export function CatalogBanner({
  totalApps,
  onOpenCatalog,
  onLearnMore,
}: CatalogBannerProps) {
  return (
    <GlowCard
      variant="glow"
      padding="lg"
      className="relative overflow-hidden bg-gradient-to-br from-vision-blue-950/5 via-vision-green-900/5 to-vision-orange-900/5"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <Stack spacing="sm" className="flex-1">
          <Text size="xl" weight="bold" className="text-foreground">
            Explore the full VISION app catalog
          </Text>
          <Text size="sm" color="secondary" className="max-w-2xl">
            Browse {totalApps} interconnected tools across VOICE, INSPIRE, STRATEGIZE, INITIATE, OPERATE, and NARRATE.
          </Text>
        </Stack>
        <Group spacing="md" className="flex-shrink-0">
          <GlowButton
            variant="default"
            size="default"
            onClick={onOpenCatalog}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Open App Catalog
          </GlowButton>
          <GlowButton
            variant="outline"
            size="default"
            onClick={onLearnMore}
            rightIcon={<BookOpen className="h-4 w-4" />}
          >
            Learn about transformation areas
          </GlowButton>
        </Group>
      </div>
    </GlowCard>
  );
}

