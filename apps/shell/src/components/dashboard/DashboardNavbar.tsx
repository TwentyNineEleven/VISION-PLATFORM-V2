'use client';

import React from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Grid3x3, ChevronRight, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { UserMenu } from '@/components/layout/UserMenu';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from '@/components/search/GlobalSearch';

interface DashboardNavbarProps {
  onAppSwitcherClick?: () => void;
}

export function DashboardNavbar({ onAppSwitcherClick }: DashboardNavbarProps) {
  const pathname = usePathname();

  // Dynamic breadcrumbs based on pathname
  const formatLabel = (segment?: string) => {
    if (!segment) return '';
    return segment
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getBreadcrumbs = () => {
    if (pathname === '/dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard' }];
    }

    if (pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/')) {
      const crumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Admin Portal', href: '/dashboard/admin' },
      ];
      const parts = pathname.split('/').filter(Boolean).slice(2); // remove dashboard/admin
      if (parts.length) {
        let accumulator = '/dashboard/admin';
        parts.forEach((segment) => {
          accumulator += `/${segment}`;
          crumbs.push({ label: formatLabel(segment), href: accumulator });
        });
      }
      return crumbs;
    }

    if (pathname === '/applications' || pathname.startsWith('/applications/')) {
      const crumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'App Catalog', href: '/applications' },
      ];
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 1) {
        crumbs.push({ label: formatLabel(parts[1]), href: pathname });
      }
      return crumbs;
    }

    if (pathname === '/notifications' || pathname.startsWith('/notifications/')) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Notifications', href: '/notifications' },
      ];
    }

    if (pathname === '/files' || pathname.startsWith('/files/')) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Files', href: '/files' },
      ];
    }

    if (pathname.startsWith('/funder')) {
      const parts = pathname.split('/').filter(Boolean); // ['funder', 'grantees']
      const sub = parts[1];
      const labelMap: Record<string, string> = {
        grantees: 'Grantees',
        cohorts: 'Cohorts',
      };
      const crumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Funder', href: '/funder' },
      ];
      if (sub) {
        crumbs.push({ label: labelMap[sub] || formatLabel(sub), href: pathname });
      }
      return crumbs;
    }

    if (pathname.startsWith('/settings')) {
      const parts = pathname.split('/').filter(Boolean);
      const section = parts[1] || 'profile';
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/settings/profile' },
        { label: formatLabel(section), href: pathname },
      ];
    }

    return [{ label: 'Dashboard', href: '/dashboard' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-background border-b border-border h-18 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
              <Link
                href={crumb.href as any}
                className={cn(
                  'text-sm font-medium transition-colors',
                  index === breadcrumbs.length - 1
                    ? 'text-foreground'
                    : 'text-vision-gray-700 hover:text-foreground'
                )}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Search, Icons, Avatar */}
      <div className="flex items-center gap-3 sm:gap-6">
        <GlobalSearch
          showTrigger={false}
          renderTrigger={(_open, openSearch) => (
            <button
              type="button"
              onClick={openSearch}
              className="hidden lg:flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-vision-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search...</span>
              <span className="ml-1 flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </span>
            </button>
          )}
        />

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* App Switcher Button */}
          <button
            onClick={onAppSwitcherClick}
            className="p-2.5 rounded-full hover:bg-vision-gray-100 text-vision-gray-700 transition-colors relative group"
          title="Open app switcher (Cmd+K)"
          >
            <Grid3x3 className="w-5 h-5" />
            <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-vision-gray-950 text-primary-foreground rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>
          <NotificationDropdown />
        </div>

        {/* Avatar */}
        <UserMenu
          user={{
            name: 'John Smith',
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?img=6',
            role: 'Admin',
          }}
        />
      </div>
    </nav>
  );
}
