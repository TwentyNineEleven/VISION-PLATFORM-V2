import React, { ReactNode, CSSProperties, useState } from 'react';
import { semanticColors, radius, spacing, spacingPatterns, fontSizes, fontWeights, lineHeights } from '../theme';

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
  // Optional alert card props
  alertCard?: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: ReactNode;
  };
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
  alertCard,
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

  // Base nav item style matching Figma design
  const navItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md, // 8px gap
    height: spacingPatterns.navItemHeight, // 40px
    padding: `${spacingPatterns.navItemPaddingY} ${spacingPatterns.navItemPaddingX}`, // 0px 10px
    borderRadius: radius.md, // 8px
    fontFamily: 'var(--font-family-body)',
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm, // 14px
    lineHeight: lineHeights.sm, // 20px
    color: semanticColors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: semanticColors.backgroundSurface,
  };

  // Active nav item style - using design system brand colors
  const activeNavItemStyle: CSSProperties = {
    ...navItemStyle,
    backgroundColor: semanticColors.backgroundInfoLight, // Light blue from design system
    color: semanticColors.textBrand,
  };

  // Submenu item style
  const submenuItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.md} ${spacing.sm} ${spacing.md} ${spacing['2xl']}`, // 8px 6px 8px 18px
    borderLeft: `2px solid ${semanticColors.borderPrimary}`,
    fontFamily: 'var(--font-family-body)',
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    color: semanticColors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  };

  // Active submenu item style
  const activeSubmenuItemStyle: CSSProperties = {
    ...submenuItemStyle,
    borderLeftColor: semanticColors.borderBrand,
    color: semanticColors.textBrand,
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.active || false;

    return (
      <div key={item.id} style={{ width: '100%' }}>
        <div
          style={isActive ? activeNavItemStyle : navItemStyle}
          onClick={() => {
            if (hasSubmenu) {
              toggleExpand(item.id);
            }
            onItemClick?.(item);
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = semanticColors.backgroundSurface;
            }
          }}
        >
          {item.icon && (
            <span style={{ 
              display: 'flex', 
              width: 20, 
              height: 20, 
              flexShrink: 0,
              color: isActive ? semanticColors.textBrand : semanticColors.textSecondary,
            }}>
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: semanticColors.fillPrimary,
                    color: semanticColors.textInverse,
                    borderRadius: radius.full,
                    fontSize: fontSizes.xs, // 12px
                    fontWeight: fontWeights.semibold,
                    minWidth: 18,
                    minHeight: 18,
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
          <div style={{ 
            paddingLeft: spacing['5xl'], // 20px
            paddingTop: spacing.sm, // 6px
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            {item.submenu?.map((subItem) => {
              const isSubActive = subItem.active || false;
              return (
                <div
                  key={subItem.id}
                  style={isSubActive ? activeSubmenuItemStyle : submenuItemStyle}
                  onClick={() => onItemClick?.(subItem)}
                  onMouseEnter={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ flex: 1 }}>{subItem.label}</span>
                </div>
              );
            })}
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
    width: collapsed ? 60 : 260,
    padding: `${spacing['3xl']} 0`, // 16px vertical, 0 horizontal
    transition: 'width 0.2s ease',
    ...style,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${spacing['3xl']} ${spacing['5xl']} ${spacing['3xl']}`, // 0 16px 20px 16px
    flexShrink: 0,
  };

  const navContainerStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs, // 2px gap between items
    padding: `0 ${spacing['3xl']}`, // 0 16px
    overflowY: 'auto',
    minHeight: 0,
  };

  const alertCardStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.lg, // 10px
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['2xl'], // 16px
    margin: `0 ${spacing.xl}`, // 0 12px
    flexShrink: 0,
  };

  const alertTitleStyle: CSSProperties = {
    fontFamily: 'var(--font-family-body)',
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    color: semanticColors.textSecondary,
    margin: 0,
  };

  const alertDescriptionStyle: CSSProperties = {
    fontFamily: 'var(--font-family-body)',
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: semanticColors.textTertiary,
    margin: 0,
  };

  const alertButtonStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurface,
    border: `1px solid ${semanticColors.borderBrandLight}`,
    borderRadius: radius.sm, // 6px
    padding: `${spacing.sm} ${spacing.lg}`, // 6px 10px
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    fontFamily: 'var(--font-family-body)',
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    color: semanticColors.textBrand,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const dividerStyle: CSSProperties = {
    height: 1,
    backgroundColor: semanticColors.borderTertiary,
    margin: `${spacing['3xl']} ${spacing['3xl']}`, // 16px
    flexShrink: 0,
  };

  return (
    <div className={className} style={sidebarStyle}>
      {/* Header with Logo and Collapse Button */}
      {logo && (
        <div style={headerStyle}>
          {!collapsed && <div style={{ flex: 1 }}>{logo}</div>}
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
                width: 40,
                height: 40,
                color: semanticColors.textSecondary,
              }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <nav style={navContainerStyle}>
        {items.map((item) => renderNavItem(item))}
      </nav>

      {/* Alert Card (Used Space) */}
      {alertCard && !collapsed && (
        <div style={{ 
          padding: `${spacing['3xl']} 0 0 0`, 
          flexShrink: 0,
        }}>
          <div style={alertCardStyle}>
            <div>
              <p style={alertTitleStyle}>{alertCard.title}</p>
              <p style={alertDescriptionStyle}>{alertCard.description}</p>
            </div>
            {alertCard.actionLabel && (
              <button
                style={alertButtonStyle}
                onClick={alertCard.onAction}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = semanticColors.backgroundInfoLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = semanticColors.backgroundSurface;
                }}
              >
                {alertCard.actionIcon && (
                  <span style={{ display: 'flex', width: 16, height: 16 }}>
                    {alertCard.actionIcon}
                  </span>
                )}
                <span>{alertCard.actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      {!collapsed && (
        <div style={dividerStyle} />
      )}

      {/* Help & Support / Footer */}
      {footer && !collapsed && (
        <div style={{ 
          padding: `0 ${spacing['3xl']}`, 
          flexShrink: 0,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};
