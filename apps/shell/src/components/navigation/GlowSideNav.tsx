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
 * Uses 2911 Bold Color System:
 * - Primary: #0047AB (Bold Royal Blue)
 * - Text Secondary: #64748B (Steel Gray)
 * - Brand Tertiary BG: #DBEAFE (Sky Light)
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlowIcon } from './GlowIcons';
import { navConfig, helpNavItem, getActiveNavItem, getActiveSubmenuItem } from '@/lib/nav-config';
import { Menu, X } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';

export interface GlowSideNavProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function GlowSideNav({ collapsed = false, onToggleCollapse, className }: GlowSideNavProps) {
  const pathname = usePathname() || '/';
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const activeNavId = getActiveNavItem(pathname);
  const activeSubmenuId = getActiveSubmenuItem(pathname);

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
      const parentItem = navConfig.find((item) =>
        item.submenu?.some((sub) => sub.id === activeSubmenuId)
      );
      if (parentItem) {
        setExpandedItems((prev) => new Set(prev).add(parentItem.id));
      }
    }
  }, [activeSubmenuId]);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white border-r border-[#E6E8EB] transition-all duration-300',
        collapsed ? 'w-20' : 'w-[280px]',
        className
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="flex items-center justify-between px-4 py-4 pb-5 flex-shrink-0">
        {!collapsed && (
          <div className="flex-1">
            {/* Logo placeholder - replace with actual logo */}
            <div className="h-8 w-[125px] bg-[#0047AB] rounded flex items-center justify-center">
              <span className="text-white font-semibold text-sm">VISION</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="h-8 w-8 bg-[#0047AB] rounded flex items-center justify-center">
              <span className="text-white font-semibold text-xs">V</span>
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
              'text-[#64748B] hover:text-[#1F2937]'
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
          {navConfig.map((item) => {
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
                    ? 'bg-[#DBEAFE] text-[#0047AB]' // Brand tertiary bg, brand text
                    : 'bg-white text-[#64748B] hover:bg-[#F9FAFB]', // Default state
                  collapsed && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <GlowIcon
                  name={item.icon}
                  size={20}
                  className="flex-shrink-0"
                  color={isActive ? '#0047AB' : '#64748B'}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {showBadgeCount && (
                      <span className="flex items-center justify-center min-w-[18px] min-h-[18px] px-1 rounded-full bg-[#0047AB] text-white text-xs font-semibold">
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
                            ? 'border-[#0047AB] text-[#0047AB]' // Brand border and text
                            : 'border-[#D7DBDF] text-[#64748B] hover:bg-[#F9FAFB]'
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
          <div className="bg-[#F9FAFB] rounded-lg p-2.5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-[#64748B]">Used space</p>
              <p className="text-xs text-[#94A3B8]">
                Your workspace has used <span className="font-semibold">782</span> of your{' '}
                <span className="font-semibold">1000</span> block storage limit
              </p>
            </div>
            <GlowButton
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 px-2.5 py-1.5 border-[#ADBFF5] text-[#0047AB]"
            >
              <GlowIcon name="crown-light" size={16} color="#0047AB" />
              <span>Upgrade</span>
            </GlowButton>
          </div>
        </div>
      )}

      {/* Divider */}
      {!collapsed && (
        <div className="px-4 py-4 flex-shrink-0">
          <div className="h-px bg-[#EBEDEF]" />
        </div>
      )}

      {/* Help & Support */}
      <div className="px-4 pb-4 flex-shrink-0">
          <Link
            href={{ pathname: helpNavItem.href }}
            className={cn(
            'flex items-center gap-2 h-10 px-[10px] rounded-lg transition-all',
            'text-sm font-medium bg-white text-[#64748B] hover:bg-[#F9FAFB]',
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
