'use client';

/**
 * Glow UI Top Header / Navigation Bar Component
 * 
 * Implements the exact Glow UI header design from Figma:
 * - Breadcrumbs on the left
 * - Search input in the center
 * - Action buttons (dots, bell) and avatar on the right
 * - Height: 64px
 * - White background with subtle border
 * 
 * Uses Bold Color System v3.0:
 * - Primary actions and branding
 * - Vision gray tokens for text and backgrounds
 * - Semantic tokens for borders and surfaces
 */

import * as React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlowIcon } from './GlowIcons';
import { Search, Bell, MoreVertical, ChevronRight, Grid3x3 } from 'lucide-react';
import Link from 'next/link';

export interface GlowTopHeaderProps {
  onMenuToggle?: () => void;
  onSearch?: (query: string) => void;
  onAppLauncherOpen?: () => void;
  notifications?: number;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    initials?: string;
  };
  className?: string;
}

export function GlowTopHeader({
  onMenuToggle,
  onSearch,
  onAppLauncherOpen,
  notifications = 0,
  user,
  className,
}: GlowTopHeaderProps) {
  const pathname = usePathname() || '/';
  const [searchQuery, setSearchQuery] = React.useState('');

  // Generate breadcrumbs from pathname
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: Array<{ label: string; href: string }> = [
      { label: 'Link', href: '/' },
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({
        label: index === segments.length - 1 ? label : segment,
        href: currentPath,
      });
    });

    // If we have more than 3 segments, collapse middle ones
    if (crumbs.length > 4) {
      return [
        crumbs[0],
        { label: '...', href: '#' },
        ...crumbs.slice(-2),
      ];
    }

    return crumbs;
  }, [pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const userInitials = user?.initials || 
    (user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U');

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-6 bg-background border-b border-border',
        className
      )}
    >
      {/* Left Section: Breadcrumbs */}
      <div className="flex items-center gap-8 flex-shrink-0">
        {/* Mobile Menu Toggle */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-vision-gray-100 transition-colors text-vision-gray-700"
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <GlowIcon name="line-3-light" size={20} />
          </button>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isCollapsed = crumb.label === '...';

            return (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-3 h-3 text-vision-gray-400 flex-shrink-0" />
                )}
                {isCollapsed ? (
                  <span className="text-base font-medium text-muted-foreground px-1.5 py-0 rounded">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={{ pathname: crumb.href }}
                    className={cn(
                      'text-base font-medium px-1.5 py-0 rounded transition-colors',
                      isLast
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-vision-gray-700'
                    )}
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Section: Search, Actions, Avatar */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* Search Input */}
        <div className="hidden md:block w-[209px]">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-8 pl-10 pr-3 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* App Launcher */}
          {onAppLauncherOpen && (
            <button
              onClick={onAppLauncherOpen}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-vision-gray-100 transition-colors text-foreground"
              aria-label="Open app launcher"
              title="Open app launcher (⌘K)"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          )}
          {/* More Options */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-vision-gray-100 transition-colors text-foreground"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-vision-gray-100 transition-colors text-foreground"
            aria-label={`Notifications${notifications > 0 ? ` (${notifications} unread)` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        {user && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-vision-blue-50 flex items-center justify-center text-sm font-semibold text-primary">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
