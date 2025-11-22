'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/session';
import { isFunderAdmin } from '@/lib/auth';

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', href: '/dashboard/admin' },
  { id: 'organizations', label: 'Organizations', href: '/dashboard/admin/organizations' },
  { id: 'users', label: 'Users & Roles', href: '/dashboard/admin/users' },
  { id: 'apps', label: 'Apps', href: '/dashboard/admin/apps' },
  { id: 'billing', label: 'Billing', href: '/dashboard/admin/billing' },
  { id: 'settings', label: 'Settings', href: '/dashboard/admin/settings' },
  { id: 'cohorts', label: 'Cohorts', href: '/dashboard/admin/cohorts', requiresFunder: true },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentUser = getCurrentUser();
  const showCohorts = isFunderAdmin(currentUser.roleKey);

  const navItems = React.useMemo(
    () => ADMIN_NAV.filter((item) => !item.requiresFunder || showCohorts),
    [showCohorts]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard/admin' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href as any}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow-primary-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}

