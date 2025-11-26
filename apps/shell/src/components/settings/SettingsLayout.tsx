'use client';

import * as React from 'react';
import { Container, Stack, spacing } from '@/design-system';
import { SectionHeader } from '@/design-system/components/SectionHeader';

interface SettingsLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsLayout({ sidebar, children }: SettingsLayoutProps) {
  return (
    <div className="bg-background">
      <Container maxWidth="xl" padding>
        <Stack gap="5xl">
          <SectionHeader
            title="Platform preferences"
            description="Manage your profile, organization, team access, and billing in one centralized space."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px minmax(0, 1fr)',
              gap: spacing['4xl'],
            }}
          >
            <div style={{ position: 'sticky', top: 32 }}>{sidebar}</div>
            <Stack gap="6xl">{children}</Stack>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
