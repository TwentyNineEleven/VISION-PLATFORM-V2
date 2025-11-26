'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GlowCard,
  GlowButton,
  Stack,
  Group,
  Text,
  Title,
} from '@/components/glow-ui';
import { Grid3x3, ExternalLink } from 'lucide-react';
import { visionGradients } from '@/design-system/theme/visionTheme';

export interface CatalogTeaserCardProps {
  totalApps?: number;
  onOpenCatalog?: () => void;
}

export function CatalogTeaserCard({
  totalApps = 21,
  onOpenCatalog,
}: CatalogTeaserCardProps) {
  return (
    <GlowCard
      variant="glow"
      padding="lg"
      className="w-full border"
      style={{
        background: visionGradients.blueLight,
      }}
    >
      <Group justify="between" align="center" className="flex-col gap-6 lg:flex-row">
        <Stack spacing="sm" className="flex-1">
          <Title level={2} className="text-3xl tracking-tight">
            Explore the full VISION app catalog
          </Title>
          <Text size="sm" color="secondary">
            Browse {totalApps} interconnected tools across VOICE, INSPIRE, STRATEGIZE, INITIATE, OPERATE, and NARRATE.
          </Text>
        </Stack>
        <Group spacing="md" wrap="wrap" className="flex-shrink-0">
          <GlowButton
            glow="subtle"
            size="lg"
            onClick={onOpenCatalog}
            rightIcon={<Grid3x3 className="h-4 w-4" />}
          >
            Open App Catalog
          </GlowButton>
          <Link
            href={"/transformation-areas" as any}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn about the transformation areas
            <ExternalLink size={14} />
          </Link>
        </Group>
      </Group>
    </GlowCard>
  );
}
