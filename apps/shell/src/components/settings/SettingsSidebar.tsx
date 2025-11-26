'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, Stack, spacing } from '@/design-system';
import { GlowBadge, GlowButton } from '@/components/glow-ui';

const navItems = [
  { href: '/settings/profile', label: 'Profile' },
  { href: '/settings/organization', label: 'Organization' },
  { href: '/settings/team', label: 'Team' },
  { href: '/settings/apps', label: 'Applications', badge: 'New' },
  { href: '/settings/billing', label: 'Billing' },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <Card
      style={{
        borderRadius: spacing['4xl'],
        padding: spacing['3xl'],
        boxShadow: 'var(--shadow-ambient-card)',
      }}
    >
      <Stack gap="md">
        <p className="text-sm font-semibold text-muted-foreground">Sections</p>
        <nav>
          <Stack gap="sm">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <GlowButton
                  key={item.href}
                  asChild
                  variant={active ? 'default' : 'ghost'}
                  size="default"
                  className="w-full justify-between"
                  glow={active ? 'subtle' : 'none'}
                >
                  <Link href={item.href as any} className="flex w-full items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && <GlowBadge variant="info" size="sm">{item.badge}</GlowBadge>}
                  </Link>
                </GlowButton>
              );
            })}
          </Stack>
        </nav>
      </Stack>
    </Card>
  );
}
