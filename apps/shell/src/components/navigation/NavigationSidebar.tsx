'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlowButton, GlowBadge } from '../glow-ui';
import {
  Home,
  LayoutGrid,
  FileText,
  Settings,
  Users,
  TrendingUp,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VISION_APPS } from '@/lib/vision-apps';

/**
 * Navigation Item Interface
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
  isActive?: boolean;
  children?: NavItem[];
}

/**
 * Navigation Sidebar Props
 */
export interface NavigationSidebarProps {
  items: NavItem[];
  currentPath?: string;
  onNavigate?: (item: NavItem) => void;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  organization?: {
    name: string;
    logo?: string;
    plan?: string;
  };
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

/**
 * Navigation Sidebar Component
 * Collapsible sidebar navigation with organization branding and user profile
 */
export function NavigationSidebar({
  items,
  currentPath,
  onNavigate,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  organization,
  user,
}: NavigationSidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const toggleItemExpansion = (itemId: string) => {
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
        'flex flex-col h-screen bg-card border-r border-border transition-all duration-300 shadow-ambient-card',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Organization Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && organization && (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {organization.logo ? (
                <Image
                  src={organization.logo}
                  alt={organization.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg shadow-glow-primary-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center shadow-glow-primary-sm">
                  <span className="text-xl font-bold text-white">
                    {organization.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate">
                  {organization.name}
                </h2>
                {organization.plan && (
                  <GlowBadge variant="info" size="sm" className="mt-1">
                    {organization.plan}
                  </GlowBadge>
                )}
              </div>
            </div>
          )}

          {collapsed && organization && (
            <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center shadow-glow-primary-sm mx-auto">
              <span className="text-xl font-bold text-white">
                {organization.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'mt-3 w-full p-2 rounded-md hover:bg-accent transition-colors flex items-center justify-center',
              collapsed && 'justify-center'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            currentPath={currentPath}
            collapsed={collapsed}
            isExpanded={expandedItems.has(item.id)}
            onToggleExpand={() => toggleItemExpansion(item.id)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* User Profile & Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Help Button */}
        <GlowButton
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={cn('w-full', !collapsed && 'justify-start')}
        >
          <HelpCircle className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Help & Support</span>}
        </GlowButton>

        {/* Settings Button */}
        <GlowButton
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={cn('w-full', !collapsed && 'justify-start')}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Settings</span>}
        </GlowButton>

        {/* User Profile */}
        {user && !collapsed && (
          <div className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ambient-interactive">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shadow-glow-primary-sm">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        {onLogout && (
          <GlowButton
            variant="outline"
            size={collapsed ? 'icon' : 'default'}
            className={cn('w-full', !collapsed && 'justify-start')}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </GlowButton>
        )}
      </div>
    </aside>
  );
}

/**
 * Navigation Item Component
 */
function NavItemComponent({
  item,
  currentPath,
  collapsed,
  isExpanded,
  onToggleExpand,
  onNavigate,
  level = 0,
}: {
  item: NavItem;
  currentPath?: string;
  collapsed: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigate?: (item: NavItem) => void;
  level?: number;
}) {
  const matchesPath = (href?: string) => {
    if (!href || !currentPath) return false;
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const isActive = item.isActive || matchesPath(item.href);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      onToggleExpand();
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate(item);
    }
  };

  return (
    <div>
      <Link
        href={item.href as any}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group',
          isActive
            ? 'bg-primary text-primary-foreground shadow-glow-primary-sm'
            : 'hover:bg-accent hover:shadow-ambient-card',
          collapsed && 'justify-center px-2',
          level > 0 && !collapsed && 'ml-4'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5 flex-shrink-0',
            isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>

            {item.badge && (
              <GlowBadge
                variant={item.badgeVariant || 'default'}
                size="sm"
                className="ml-auto"
              >
                {item.badge}
              </GlowBadge>
            )}

            {hasChildren && (
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded && 'rotate-90'
                )}
              />
            )}
          </>
        )}
      </Link>

      {/* Children */}
      {hasChildren && !collapsed && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              currentPath={currentPath}
              collapsed={collapsed}
              isExpanded={false}
              onToggleExpand={() => {}}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Default Navigation Items
 * Common navigation structure for VISION Platform
 */
export const defaultNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'apps',
    label: 'Apps',
    href: '/apps',
    icon: LayoutGrid,
    badge: VISION_APPS.length,
    badgeVariant: 'info',
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/documents',
    icon: FileText,
    badge: 'New',
    badgeVariant: 'success',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team',
    icon: Users,
    children: [
      {
        id: 'team-members',
        label: 'Members',
        href: '/team/members',
        icon: Users,
      },
      {
        id: 'team-roles',
        label: 'Roles & Permissions',
        href: '/team/roles',
        icon: Users,
      },
    ],
  },
];
