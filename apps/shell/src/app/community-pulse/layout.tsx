/**
 * CommunityPulse Layout
 * Top navigation for all CommunityPulse pages
 * Uses Glow UI design system and 2911 Bold Color System
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { Plus, Sparkles } from 'lucide-react';

interface CommunityPulseTab {
  id: string;
  label: string;
  href: string;
}

const communityPulseTabs: CommunityPulseTab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/community-pulse' },
  { id: 'templates', label: 'Templates', href: '/community-pulse/templates' },
  { id: 'methods', label: 'Methods Library', href: '/community-pulse/methods' },
];

export default function CommunityPulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActiveTab = (href: string) => {
    if (href === '/community-pulse') {
      return pathname === '/community-pulse';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top Navigation */}
      <div className="border-b border-border bg-background shadow-ambient-card">
        <div className="px-6">
          {/* App Title */}
          <div className="flex items-center justify-between border-b border-border pb-4 pt-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                CommunityPulse
              </h1>
              <p className="text-sm text-muted-foreground">
                Community Engagement Strategy Builder
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/community-pulse/new">
                <GlowButton variant="default" size="default" glow="medium">
                  <Plus className="h-4 w-4" />
                  New Strategy
                </GlowButton>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 pt-2" aria-label="CommunityPulse navigation">
            {communityPulseTabs.map((tab) => {
              const active = isActiveTab(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href as any}
                  className={`
                    rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all
                    ${
                      active
                        ? 'bg-muted text-primary shadow-glow-primary-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </div>
    </div>
  );
}
