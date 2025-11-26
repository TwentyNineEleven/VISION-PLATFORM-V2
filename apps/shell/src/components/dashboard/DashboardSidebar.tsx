'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  Handshake,
  HelpCircle,
  Home,
  Layers3,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { semanticColors } from '@/design-system/theme';
import { ADMIN_PORTAL_ENABLED, userCanAccessAdmin } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';

interface SubItem {
  id: string;
  label: string;
  href: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  subItems?: SubItem[];
}

const baseSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/applications' },
      { id: 'notifications', label: 'Notifications', href: '/notifications' },
    ],
  },
  {
    id: 'apps',
    label: 'Applications',
    icon: <Layers3 className="w-5 h-5" />,
    href: '/applications',
  },
  {
    id: 'funder',
    label: 'Funder',
    icon: <Handshake className="w-5 h-5" />,
    href: '/funder',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/notifications',
    badge: 3,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <UploadCloud className="w-5 h-5" />,
    href: '/files',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings/profile',
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const currentUser = getCurrentUser();
  const showAdminLink = ADMIN_PORTAL_ENABLED && userCanAccessAdmin(currentUser.roleKey);

  const navItems = React.useMemo(() => {
    const cloned = baseSidebarItems.map((item) => ({
      ...item,
      subItems: item.subItems ? item.subItems.map((sub) => ({ ...sub })) : undefined,
    }));

    if (showAdminLink) {
      const dashboardItem = cloned.find((item) => item.id === 'dashboard');
      if (dashboardItem) {
        dashboardItem.subItems = dashboardItem.subItems || [];
        const alreadyHasAdmin = dashboardItem.subItems.some((sub) => sub.id === 'admin');
        if (!alreadyHasAdmin) {
          dashboardItem.subItems.push({
            id: 'admin',
            label: 'Admin Portal',
            href: '/admin',
          });
        }
      } else {
        cloned.unshift({
          id: 'admin',
          label: 'Admin Portal',
          icon: <Shield className="w-5 h-5" />,
          href: '/admin',
          subItems: undefined,
        });
      }
    }

    return cloned;
  }, [showAdminLink]);

  // More precise active detection - exact match or starts with, but not for parent items when submenu is active
  const isActive = React.useCallback(
    (href: string, isSubItem = false) => {
      if (isSubItem) {
        // For subitems, use exact match or starts with
        return pathname === href || pathname.startsWith(`${href}/`);
      }
      // For parent items, only match if it's an exact match or the path starts with it
      // But don't match if a submenu item would also match
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  // Check if any submenu item is active
  const hasActiveSubItem = React.useCallback(
    (item: SidebarItem) => {
      if (!item.subItems) return false;
      return item.subItems.some((sub) => isActive(sub.href, true));
    },
    [isActive]
  );

  // Check if parent should be active (only if no submenu or if submenu item is active)
  const isParentActive = React.useCallback(
    (item: SidebarItem) => {
      if (item.subItems) {
        return hasActiveSubItem(item);
      }
      if (item.href) {
        // For items without submenus, check if this exact item is active
        // But exclude if it's also a submenu item of another parent
        const isThisActive = isActive(item.href);
        // Check if this href is also a submenu item of another parent
        const isSubmenuOfAnother = navItems.some(
          (otherItem) =>
            otherItem.id !== item.id &&
            otherItem.subItems?.some((sub) => sub.href === item.href && isActive(sub.href, true))
        );
        return isThisActive && !isSubmenuOfAnother;
      }
      return false;
    },
    [hasActiveSubItem, isActive, navItems]
  );

  // Auto-expand parent if any submenu item is active
  React.useEffect(() => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      navItems.forEach((item) => {
        if (item.subItems && hasActiveSubItem(item)) {
          next.add(item.id);
        }
      });
      return next;
    });
  }, [hasActiveSubItem, navItems]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'flex flex-col fixed top-0 left-0 h-screen shrink-0 z-10 hidden lg:flex',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      style={{
        backgroundColor: semanticColors.backgroundSurface,
        borderRight: `1px solid ${semanticColors.borderSecondary}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{
          borderBottom: `1px solid ${semanticColors.borderSecondary}`,
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: semanticColors.fillPrimary }}
          >
            V
          </div>
          {!isCollapsed && (
            <span
              className="text-xl font-bold"
              style={{ color: semanticColors.textPrimary }}
            >
              VISION
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: semanticColors.textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const parentActive = isParentActive(item);

          if (hasSubItems) {
            return (
              <div key={item.id} className="space-y-1">
                {/* Parent Item */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors h-10 cursor-pointer'
                  )}
                  style={{
                    backgroundColor: parentActive
                      ? semanticColors.backgroundInfoLight
                      : 'transparent',
                    color: parentActive
                      ? semanticColors.textBrand
                      : semanticColors.textSecondary,
                  }}
                  onClick={() => toggleExpand(item.id)}
                  onMouseEnter={(e) => {
                    if (!parentActive) {
                      e.currentTarget.style.backgroundColor =
                        semanticColors.backgroundSurfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!parentActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span
                    className="shrink-0 w-5 h-5"
                    style={{
                      color: parentActive
                        ? semanticColors.textBrand
                        : semanticColors.textSecondary,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  )}
                </div>

                {/* Submenu Items */}
                {!isCollapsed && isExpanded && (
                  <div className="ml-5 space-y-0 pl-5 border-l-2" style={{ borderColor: semanticColors.borderPrimary }}>
                    {item.subItems?.map((subItem) => {
                      const isSubActive = isActive(subItem.href, true);
                      // Don't show left border for the first submenu item when active
                      const isFirstSubItem = subItem.id === item.subItems?.[0]?.id;
                      const showLeftBorder = isSubActive && !isFirstSubItem;

                      return (
                        <Link
                          key={subItem.id}
                          href={subItem.href as any}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors'
                          )}
                          style={{
                            color: isSubActive
                              ? semanticColors.textBrand
                              : semanticColors.textSecondary,
                            borderLeft: showLeftBorder
                              ? `2px solid ${semanticColors.borderBrand}`
                              : 'none',
                            marginLeft: showLeftBorder ? '-21px' : '0',
                            paddingLeft: showLeftBorder ? '21px' : '18px',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor =
                                semanticColors.backgroundSurfaceSecondary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span className="flex-1">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular item without submenu
          const active = isParentActive(item);

          return (
            <Link
              key={item.id}
              href={item.href as any}
              className={cn(
                'flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors relative h-10'
              )}
              style={{
                backgroundColor: active
                  ? semanticColors.backgroundInfoLight
                  : 'transparent',
                color: active ? semanticColors.textBrand : semanticColors.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor =
                    semanticColors.backgroundSurfaceSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span
                className="shrink-0 w-5 h-5"
                style={{
                  color: active ? semanticColors.textBrand : semanticColors.textSecondary,
                }}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                      style={{
                        backgroundColor: semanticColors.fillPrimary,
                        color: semanticColors.textInverse,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span
                  className="absolute top-1 right-1 rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: semanticColors.fillPrimary,
                    color: semanticColors.textInverse,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Storage Alert */}
      {!isCollapsed && (
        <div
          className="p-4"
          style={{
            borderTop: `1px solid ${semanticColors.borderSecondary}`,
          }}
        >
          <div
            className="rounded-lg p-3 space-y-3"
            style={{
              backgroundColor: semanticColors.backgroundSurfaceSecondary,
            }}
          >
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: semanticColors.textSecondary }}
              >
                Used space
              </p>
              <p
                className="text-xs"
                style={{ color: semanticColors.textTertiary }}
              >
                Your workspace has used <span className="font-semibold">782</span> of your{' '}
                <span className="font-semibold">1000</span> block storage limit
              </p>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: semanticColors.backgroundSurface,
                border: `1px solid ${semanticColors.borderBrandLight}`,
                color: semanticColors.textBrand,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = semanticColors.backgroundInfoLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = semanticColors.backgroundSurface;
              }}
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Help & Support */}
      <div
        className="px-4 py-4"
        style={{
          borderTop: `1px solid ${semanticColors.borderSecondary}`,
        }}
      >
        <Link
          href={'/help' as any}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          style={{
            color: semanticColors.textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Help & Support</span>}
        </Link>
      </div>
    </aside>
  );
}
