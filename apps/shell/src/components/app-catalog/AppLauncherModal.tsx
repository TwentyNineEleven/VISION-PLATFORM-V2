'use client';

/**
 * App Launcher Modal
 * 
 * Fast-access modal overlay for launching apps.
 * Accessed via header grid icon or CMD/CTRL+K.
 * 
 * Structure:
 * 1. Search Bar (Auto-Focused)
 * 2. Pinned Apps (Favorites Row)
 * 3. Recently Used Apps
 * 4. All Apps (Compact Grid/List)
 * 
 * Uses Glow UI modal patterns and 2911 Bold Color System.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Star, Clock, Grid3x3 } from 'lucide-react';
import { getPhaseColor } from '@/lib/apps/appMetadata';
import { cn } from '@/lib/utils';
import type { AppMetadata } from '@/lib/app-catalog-types';
import { AppIcon } from '@/components/apps/AppIcon';

export interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppMetadata[];
  onLaunchApp?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
}

export function AppLauncherModal({
  isOpen,
  onClose,
  apps,
  onLaunchApp,
  onToggleFavorite,
}: AppLauncherModalProps) {
  const router = useRouter();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle modal (handled by parent)
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus search on open
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Get favorites
  const favoriteApps = React.useMemo(
    () => apps.filter((app) => app.isFavorite).slice(0, 7),
    [apps]
  );

  // Get recently used
  const recentlyUsedApps = React.useMemo(
    () =>
      apps
        .filter((app) => app.lastUsed)
        .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
        .slice(0, 6),
    [apps]
  );

  // Filter apps by search
  const filteredApps = React.useMemo(() => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        (app.transformationArea?.toLowerCase().includes(query) ?? false)
    );
  }, [apps, searchQuery]);

  const handleLaunch = (app: AppMetadata) => {
    if (onLaunchApp) {
      onLaunchApp(app);
    } else if (app.launchPath) {
      router.push(app.launchPath as any);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:p-8">
        <div
          className="w-full max-w-4xl rounded-lg border border-[#E2E8F0] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
            <h2 className="text-lg font-semibold text-[#1F2937]">App Launcher</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
              aria-label="Close launcher"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {/* 1. Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search apps…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-10 py-3 text-base text-[#1F2937] placeholder:text-[#94A3B8] focus:border-[#0047AB] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <kbd className="rounded border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-1 text-xs text-[#64748B]">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* 2. Pinned Apps (Favorites) */}
            {favoriteApps.length > 0 && !searchQuery && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-[#1F2937]">Pinned</h3>
                <div className="flex flex-wrap gap-2">
                  {favoriteApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleLaunch(app)}
                      className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#1F2937] transition-all hover:border-[#0047AB] hover:bg-[#F1F5F9]"
                    >
                      <AppIcon app={app} size="sm" showBackground={false} className="h-8 w-8 shrink-0" />
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Recently Used Apps */}
            {recentlyUsedApps.length > 0 && !searchQuery && (
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                  <Clock size={16} />
                  Recently Used
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {recentlyUsedApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleLaunch(app)}
                      className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition-all hover:border-[#0047AB] hover:bg-[#F1F5F9]"
                    >
                      <AppIcon app={app} size="sm" showBackground={false} className="h-8 w-8 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#1F2937] truncate">
                          {app.name}
                        </div>
                        <div
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: app.phase ? getPhaseColor(app.phase) : '#0047AB' }}
                        >
                          {app.transformationArea || app.phase || ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. All Apps (Compact Grid/List) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#1F2937]">
                {searchQuery ? 'Search Results' : 'All Apps'}
              </h3>
              {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredApps.map((app) => {
                    const isFavorite = app.isFavorite ?? false;
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleLaunch(app)}
                        className="group flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3 text-left transition-all hover:border-[#0047AB] hover:bg-[#F1F5F9]"
                      >
                        <AppIcon app={app} size="md" className="h-10 w-10" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#1F2937] truncate">
                              {app.name}
                            </span>
                            {isFavorite && (
                              <Star
                                size={14}
                                className="flex-shrink-0 fill-[#C2410C] text-[#C2410C]"
                              />
                            )}
                          </div>
                          <div
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: app.phase ? getPhaseColor(app.phase) : '#0047AB' }}
                          >
                            {app.transformationArea || app.phase || ''}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#0047AB] opacity-0 transition-opacity group-hover:opacity-100">
                          Open →
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#64748B]">No apps found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
