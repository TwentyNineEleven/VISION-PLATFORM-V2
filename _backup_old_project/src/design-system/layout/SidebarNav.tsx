import React, { ReactNode, CSSProperties, useState } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  submenu?: NavItem[];
  active?: boolean;
}

export interface SidebarNavProps {
  items: NavItem[];
  onItemClick?: (item: NavItem) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  logo?: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  onItemClick,
  collapsed = false,
  onToggleCollapse,
  logo,
  footer,
  className = '',
  style,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const navItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    height: spacingPatterns.navItemHeight,
    padding: `${spacing.md} ${spacing.xl}`, // 8px 12px (Glow UI pattern)
    borderRadius: radius.md,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
    color: semanticColors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  };

  const activeNavItemStyle: CSSProperties = {
    ...navItemStyle,
    backgroundColor: semanticColors.backgroundSurfaceSecondary,
    borderLeft: `3px solid ${semanticColors.fillPrimary}`,
    paddingLeft: `calc(${spacing.xl} - 3px)`, // Adjust for border
    color: semanticColors.textPrimary,
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id} style={{ width: '100%' }}>
        <div
          style={item.active ? activeNavItemStyle : navItemStyle}
          onClick={() => {
            if (hasSubmenu) {
              toggleExpand(item.id);
            }
            onItemClick?.(item);
          }}
          onMouseEnter={(e) => {
            if (!item.active) {
              e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
            }
          }}
          onMouseLeave={(e) => {
            if (!item.active) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {item.icon && (
            <span style={{ display: 'flex', width: 20, height: 20, flexShrink: 0 }}>
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  style={{
                    backgroundColor: semanticColors.fillPrimary,
                    color: semanticColors.textInverse,
                    borderRadius: radius.full,
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    minWidth: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `0 ${spacing.xs}`,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
        {hasSubmenu && isExpanded && !collapsed && (
          <div style={{ paddingLeft: spacing['5xl'], marginTop: spacing.xs }}>
            {item.submenu?.map((subItem) => (
              <div
                key={subItem.id}
                style={{
                  ...navItemStyle,
                  borderLeft: `2px solid ${semanticColors.borderPrimary}`,
                  paddingLeft: spacing['2xl'],
                  height: 'auto',
                  paddingTop: spacing.md,
                  paddingBottom: spacing.md,
                }}
                onClick={() => onItemClick?.(subItem)}
              >
                {subItem.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurface,
    borderRight: `1px solid ${semanticColors.borderSecondary}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: collapsed ? 60 : 260, // Glow UI standard widths
    padding: spacing['3xl'],
    transition: 'width 0.2s ease',
    ...style,
  };

  return (
    <div className={className} style={sidebarStyle}>
      {logo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing['5xl'],
          }}
        >
          {!collapsed && logo}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.sm,
                borderRadius: radius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke={semanticColors.textSecondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {items.map((item) => renderNavItem(item))}
      </nav>
      {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
    </div>
  );
};

