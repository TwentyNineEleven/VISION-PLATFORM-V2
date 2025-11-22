'use client';

import * as React from 'react';
import { GlowModal } from '@/components/glow-ui/GlowModal';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { Search, Command, Star, Clock, ArrowRight, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { App } from './AppLauncher';
import { getRecentApps, getFavoriteApps } from '@/lib/mock-data';
import { mockApps } from '@/lib/mock-data';
import Link from 'next/link';
import { AppIcon } from '@/components/apps/AppIcon';
import { getAppMeta } from '@/lib/apps/appMetadata';
import { getModuleTheme, moduleShortLabel } from '@/lib/module-utils';

export interface AppSwitcherProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  apps?: App[];
  onSelectApp?: (app: App) => void;
}

/**
 * App Switcher Modal Component
 * Quick navigation between applications using Cmd+K keyboard shortcut
 */
export function AppSwitcher({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  apps = mockApps,
  onSelectApp,
}: AppSwitcherProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const recentApps = React.useMemo(() => getRecentApps(apps, 5), [apps]);
  const favoriteApps = React.useMemo(() => getFavoriteApps(apps), [apps]);

  // Filter apps based on search query
  const filteredApps = React.useMemo(() => {
    if (!searchQuery) return apps;

    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query)
    );
  }, [apps, searchQuery]);

  // Group apps into sections
  const appSections = React.useMemo(() => {
    const sections: { title: string; apps: App[]; icon?: React.ReactNode }[] = [];

    if (searchQuery) {
      // When searching, show only filtered results
      if (filteredApps.length > 0) {
        sections.push({
          title: 'Search Results',
          apps: filteredApps,
          icon: <Search className="w-4 h-4" />,
        });
      }
    } else {
      // Show sections when not searching
      if (recentApps.length > 0) {
        sections.push({
          title: 'Recent Apps',
          apps: recentApps,
          icon: <Clock className="w-4 h-4" />,
        });
      }

      if (favoriteApps.length > 0) {
        sections.push({
          title: 'Favorites',
          apps: favoriteApps,
          icon: <Star className="w-4 h-4" />,
        });
      }

      // Show all apps if no recent/favorites
      if (sections.length === 0) {
        sections.push({
          title: 'All Apps',
          apps: apps,
          icon: <Grid3x3 className="w-4 h-4" />,
        });
      } else {
        // Add all apps section at the end
        sections.push({
          title: 'All Apps',
          apps: apps.filter(
            (app) =>
              !recentApps.find((r) => r.id === app.id) &&
              !favoriteApps.find((f) => f.id === app.id)
          ),
          icon: <Grid3x3 className="w-4 h-4" />,
        });
      }
    }

    return sections.filter((section) => section.apps.length > 0);
  }, [searchQuery, filteredApps, recentApps, favoriteApps, apps]);

  // Flatten all apps for keyboard navigation
  const allAppsFlat = React.useMemo(
    () => appSections.flatMap((section) => section.apps),
    [appSections]
  );

  // Reset selected index when search changes or modal opens
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, open]);

  const handleSelectApp = React.useCallback(
    (app: App) => {
      onSelectApp?.(app);
      setOpen(false);
      setSearchQuery('');

      // Navigate to app or launch
      if (app.status === 'active') {
        window.location.href = app.launchPath || `/apps/${app.id}`;
      }
    },
    [onSelectApp, setOpen, setSearchQuery]
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open/close
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
        return;
      }

      // Only handle keyboard navigation when modal is open
      if (!open) return;

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        setSearchQuery('');
        return;
      }

      // Arrow keys to navigate
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allAppsFlat.length - 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      // Enter to select
      if (e.key === 'Enter' && allAppsFlat[selectedIndex]) {
        e.preventDefault();
        handleSelectApp(allAppsFlat[selectedIndex]);
        return;
      }

      // Tab to cycle through sections
      if (e.key === 'Tab' && !searchQuery) {
        e.preventDefault();
        // Tab cycling logic could be added here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, allAppsFlat, searchQuery, setOpen, handleSelectApp]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  };

  // Auto-focus search input when modal opens
  React.useEffect(() => {
    if (open) {
      // Focus will be handled by the input's autoFocus or we can add a ref later
      const timer = setTimeout(() => {
        const input = document.querySelector('input[placeholder="Search apps..."]') as HTMLInputElement;
        input?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <GlowModal
      open={open}
      onOpenChange={handleOpenChange}
      size="xl"
      closeButton={false}
      closeOnOverlayClick={true}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <GlowInput
            variant="glow"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 rounded border border-border bg-muted font-mono">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <span className="text-xs">+</span>
            <kbd className="px-2 py-1 rounded border border-border bg-muted font-mono">
              K
            </kbd>
          </div>
        </div>

        {/* App Sections */}
        <div className="max-h-[500px] overflow-y-auto space-y-4">
          {appSections.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No apps found</h3>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            appSections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-2">
                  {section.icon && <span className="text-muted-foreground">{section.icon}</span>}
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    ({section.apps.length})
                  </span>
                </div>

                {/* Apps List */}
                <div className="space-y-1">
                  {section.apps.map((app, appIndex) => {
                    const flatIndex =
                      appSections.slice(0, sectionIndex).reduce((acc, s) => acc + s.apps.length, 0) + appIndex;
                    const isSelected = flatIndex === selectedIndex;
                    const moduleTheme = getModuleTheme(app.moduleKey);
                    const moduleLabel = moduleShortLabel[app.moduleKey] || app.moduleLabel;
                    const statusTone =
                      app.status === 'active'
                        ? { label: 'Active', variant: 'success' as const }
                        : app.status === 'available'
                          ? { label: 'Available', variant: 'info' as const }
                          : app.status === 'beta'
                            ? { label: 'Beta', variant: 'info' as const }
                            : app.status === 'restricted'
                              ? { label: 'Restricted', variant: 'warning' as const }
                              : app.status === 'coming-soon'
                                ? { label: 'Coming Soon', variant: 'warning' as const }
                                : undefined;

                    const appMeta = getAppMeta(app.slug || app.id);
                    return (
                      <GlowCard
                        key={app.id}
                        variant="default"
                        padding="sm"
                        className={cn(
                          'cursor-pointer transition-all border border-transparent',
                          isSelected && 'shadow-ambient-card-hover'
                        )}
                        style={
                          isSelected
                            ? {
                                borderColor: moduleTheme.soft,
                                boxShadow: `0 0 0 1px ${moduleTheme.solid}`,
                              }
                            : undefined
                        }
                        onClick={() => handleSelectApp(app)}
                        onMouseEnter={() => setSelectedIndex(flatIndex)}
                      >
                        <GlowCardContent className="p-0">
                          <div className="flex items-center gap-3">
                            {appMeta ? (
                              <AppIcon
                                app={appMeta}
                                size="sm"
                                showBackground={false}
                                className="h-8 w-8 shrink-0"
                              />
                            ) : (
                              <Grid3x3 className="h-6 w-6 text-[#64748B]" />
                            )}

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-foreground truncate">{app.name}</h4>
                                {app.isFavorite && (
                                  <Star className="w-3 h-3 fill-vision-orange text-vision-orange shrink-0" />
                                )}
                                <GlowBadge
                                  variant="outline"
                                  size="sm"
                                  className="text-[11px] font-semibold"
                                  style={{ backgroundColor: moduleTheme.soft, color: moduleTheme.solid }}
                                >
                                  {moduleLabel}
                                </GlowBadge>
                                {statusTone && (
                                  <GlowBadge variant={statusTone.variant} size="sm">
                                    {statusTone.label}
                                  </GlowBadge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{app.description}</p>
                            </div>

                            <div className="flex-shrink-0">
                              {isSelected && <ArrowRight className="w-4 h-4" style={{ color: moduleTheme.solid }} />}
                            </div>
                          </div>
                        </GlowCardContent>
                      </GlowCard>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
                ↓
              </kbd>
              {' '}Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
                Enter
              </kbd>
              {' '}Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
                Esc
              </kbd>
              {' '}Close
            </span>
          </div>
          <Link href="/applications" className="text-primary hover:underline">
            View all apps →
          </Link>
        </div>
      </div>
    </GlowModal>
  );
}
