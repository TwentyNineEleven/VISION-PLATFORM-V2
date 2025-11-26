'use client';

/**
 * AppShell Component - Glow UI Implementation
 * 
 * Standard, reusable layout shell that implements:
 * - Glow UI side navigation (collapsible)
 * - Glow UI top header
 * - Mobile responsive with hamburger menu
 * - Consistent across ALL pages
 * 
 * Uses 2911 Bold Color System:
 * - Primary: #0047AB (Bold Royal Blue)
 * - Backgrounds: #F8FAFC / #F1F5F9 (Mist / Smoke)
 * - Sidebar: White with border
 * - Header: White with border
 */

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlowSideNav } from '@/components/navigation/GlowSideNav';
import { GlowTopHeader } from '@/components/navigation/GlowTopHeader';
import { GlowMobileNavDrawer } from '@/components/navigation/GlowMobileNavDrawer';
import { AppLauncherModal } from '@/components/app-catalog/AppLauncherModal';
import { mockUser, mockNotifications, getUnreadNotificationCount } from '@/lib/mock-data';
import { buildNavConfig, NavItem } from '@/lib/nav-config';
import { APP_CATALOG_DATA } from '@/lib/app-catalog-data';
import { useRouter } from 'next/navigation';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { createClient } from '@/lib/supabase/client';

const PUBLIC_ROUTES = new Set([
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/demo',
]);

interface AppShellContextValue {
  isShellRoute: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  appLauncherOpen: boolean;
  openAppLauncher: () => void;
  closeAppLauncher: () => void;
}

const AppShellContext = React.createContext<AppShellContextValue | undefined>(
  undefined
);

export function useAppShell() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within AppShell');
  }
  return context;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [appLauncherOpen, setAppLauncherOpen] = React.useState(false);
  const [user, setUser] = React.useState<{ name: string; email: string; initials: string } | null>(null);
  const [navItems, setNavItems] = React.useState<NavItem[]>(() => buildNavConfig());

  const isShellRoute = React.useMemo(() => {
    return !PUBLIC_ROUTES.has(pathname);
  }, [pathname]);

  // Load authenticated user
  React.useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          // Get user details from public.users table
          const { data: userData } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', authUser.id)
            .single();

          if (userData) {
            setUser({
              name: userData.name,
              email: userData.email,
              initials: userData.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }

    if (isShellRoute) {
      loadUser();
    }
  }, [isShellRoute]);

  // Update notification badge count
  React.useEffect(() => {
    const unreadCount = getUnreadNotificationCount(mockNotifications);
    setNavItems(buildNavConfig({ notificationsCount: unreadCount }));
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const openMobileNav = React.useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = React.useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const openAppLauncher = React.useCallback(() => {
    setAppLauncherOpen(true);
  }, []);

  const closeAppLauncher = React.useCallback(() => {
    setAppLauncherOpen(false);
  }, []);

  const handleLaunchApp = React.useCallback((app: { launchPath?: string; route?: string }) => {
    if (app.launchPath) {
      router.push(app.launchPath as any);
    } else if (app.route) {
      router.push(app.route as any);
    }
  }, [router]);

  const handleToggleFavorite = React.useCallback((appId: string) => {
    // TODO: Implement favorite toggle with backend
    console.log('Toggle favorite:', appId);
  }, []);

  const contextValue = React.useMemo<AppShellContextValue>(
    () => ({
      isShellRoute,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      appLauncherOpen,
      openAppLauncher,
      closeAppLauncher,
    }),
    [isShellRoute, sidebarCollapsed, toggleSidebar, mobileNavOpen, openMobileNav, closeMobileNav, appLauncherOpen, openAppLauncher, closeAppLauncher]
  );

  // If not a shell route, render children without shell
  if (!isShellRoute) {
    return <>{children}</>;
  }

  return (
    <AppShellContext.Provider value={contextValue}>
      <OrganizationProvider>
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:fixed lg:inset-y-0">
            <GlowSideNav
              navItems={navItems}
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
          </aside>

          {/* Mobile Navigation Drawer */}
          <GlowMobileNavDrawer
            navItems={navItems}
            open={mobileNavOpen}
            onClose={closeMobileNav}
          />

          {/* Main Content Area */}
          <div
            className={cn(
              'flex min-h-screen flex-1 flex-col bg-background text-foreground',
              sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
            )}
          >
            {/* Top Header */}
            <GlowTopHeader
              className="sticky top-0 z-20"
              onMenuToggle={openMobileNav}
              onAppLauncherOpen={openAppLauncher}
              user={user || {
                name: mockUser.name,
                email: mockUser.email,
                initials: mockUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2),
              }}
              notifications={getUnreadNotificationCount(mockNotifications)}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6 lg:px-8 overscroll-contain">
              {children}
            </main>
          </div>

          {/* App Launcher Modal */}
          <AppLauncherModal
            isOpen={appLauncherOpen}
            onClose={closeAppLauncher}
            apps={APP_CATALOG_DATA}
            onLaunchApp={handleLaunchApp}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </OrganizationProvider>
    </AppShellContext.Provider>
  );
}
