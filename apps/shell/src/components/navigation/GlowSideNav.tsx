'use client';

/**
 * Glow UI Side Navigation Component
 * 
 * Implements the exact Glow UI side navigation pattern from Figma:
 * - Logo at top with collapse button
 * - Navigation items with icons and labels
 * - Submenu support (e.g., Dashboard submenu)
 * - Alert card (Used space)
 * - Divider
 * - Help & Support at bottom
 * - Collapsible behavior (expanded: ~280px, collapsed: ~80px)
 * 
 * Uses Bold Color System v3.0:
 * - Primary actions and branding
 * - Vision gray tokens for text and backgrounds
 * - Semantic tokens for borders and surfaces
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlowIcon } from './GlowIcons';
import { helpNavItem, getActiveNavItem, getActiveSubmenuItem, NavItem, navConfig } from '@/lib/nav-config';
import { Menu, X } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';

export interface GlowSideNavProps {
  navItems?: NavItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function GlowSideNav({ navItems, collapsed = false, onToggleCollapse, className }: GlowSideNavProps) {
  const pathname = usePathname() || '/';
  const items = navItems ?? [...navConfig];
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const activeNavId = getActiveNavItem(pathname, items);
  const activeSubmenuId = getActiveSubmenuItem(pathname, items);

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

  // Auto-expand parent if submenu item is active
  React.useEffect(() => {
    if (activeSubmenuId) {
      const parentItem = items.find((item) =>
        item.submenu?.some((sub) => sub.id === activeSubmenuId)
      );
      if (parentItem) {
        setExpandedItems((prev) => new Set(prev).add(parentItem.id));
      }
    }
  }, [activeSubmenuId, items]);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-background border-r border-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-[280px]',
        className
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="flex items-center justify-between px-4 py-4 pb-5 flex-shrink-0">
        {!collapsed && (
          <div className="flex-1">
            {/* Logo placeholder - replace with actual logo */}
            <div className="h-8 w-[125px] bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">VISION</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">V</span>
            </div>
          </div>
        )}
        {onToggleCollapse && (
          <GlowButton
            variant="ghost"
            size="icon"
            glow="none"
            onClick={onToggleCollapse}
            className={cn(
              'text-vision-gray-700 hover:text-foreground'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <GlowIcon name="line-3-light" size={20} />
          </GlowButton>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-0 flex flex-col gap-3 min-h-0">
          {items.map((item) => {
            const isActive = activeNavId === item.id;
            const isExpanded = expandedItems.has(item.id);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const badgeNumber =
              typeof item.badge === 'number'
                ? item.badge
                : Number(item.badge);
            const showBadgeCount =
              Number.isFinite(badgeNumber) && badgeNumber > 0;
            const badgeLabel = Number.isFinite(badgeNumber)
              ? badgeNumber > 9
                ? '9+'
                : `${badgeNumber}`
              : String(item.badge);

            return (
              <div key={item.id} className="flex flex-col">
              <Link
                href={{ pathname: item.href }}
                onClick={(e) => {
                  if (hasSubmenu) {
                    e.preventDefault();
                    toggleExpand(item.id);
                  }
                  // If no submenu, navigate normally (Link handles it)
                }}
                className={cn(
                  'flex items-center gap-2 h-10 px-[10px] rounded-lg transition-all',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-vision-blue-50 text-primary'
                    : 'bg-background text-vision-gray-700 hover:bg-vision-gray-100',
                  collapsed && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <GlowIcon
                  name={item.icon}
                  size={20}
                  className={cn(
                    'flex-shrink-0',
                    isActive ? 'text-primary' : 'text-vision-gray-700'
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {showBadgeCount && (
                      <span className="flex items-center justify-center min-w-[18px] min-h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {badgeLabel}
                      </span>
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {hasSubmenu && isExpanded && !collapsed && (
                <div className="flex flex-col gap-0 pl-5 pt-1.5">
                  {item.submenu?.map((subItem) => {
                    const isSubActive = activeSubmenuId === subItem.id;
                    return (
                      <Link
                        key={subItem.id}
                        href={{ pathname: subItem.href }}
                        className={cn(
                          'flex items-center pl-[18px] pr-1.5 py-2 border-l-2 transition-colors',
                          'text-sm font-medium',
                          isSubActive
                            ? 'border-primary text-primary'
                            : 'border-border text-vision-gray-700 hover:bg-vision-gray-100'
                        )}
                        aria-current={isSubActive ? 'page' : undefined}
                      >
                        <span className="flex-1">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Alert Card (Used Space) */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-0 flex-shrink-0">
          <div className="bg-vision-gray-50 rounded-lg p-2.5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-vision-gray-700">Used space</p>
              <p className="text-xs text-muted-foreground">
                Your workspace has used <span className="font-semibold">782</span> of your{' '}
                <span className="font-semibold">1000</span> block storage limit
              </p>
            </div>
            <GlowButton
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 px-2.5 py-1.5 border-vision-blue-200 text-primary"
            >
              <GlowIcon name="crown-light" size={16} className="text-primary" />
              <span>Upgrade</span>
            </GlowButton>
          </div>
        </div>
      )}

      {/* Divider */}
      {!collapsed && (
        <div className="px-4 py-4 flex-shrink-0">
          <div className="h-px bg-border" />
        </div>
      )}

      {/* Help & Support */}
      <div className="px-4 pb-4 flex-shrink-0">
          <Link
            href={{ pathname: helpNavItem.href }}
            className={cn(
            'flex items-center gap-2 h-10 px-[10px] rounded-lg transition-all',
            'text-sm font-medium bg-background text-vision-gray-700 hover:bg-vision-gray-100',
            collapsed && 'justify-center px-2'
          )}
        >
          <GlowIcon name={helpNavItem.icon} size={20} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1">{helpNavItem.label}</span>}
        </Link>
      </div>
    </aside>
  );
}
