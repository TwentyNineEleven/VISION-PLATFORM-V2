import React, { ReactNode, CSSProperties, useState } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
  style?: CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveId,
  onTabChange,
  variant = 'underline',
  className = '',
  style,
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveId(tabId);
    onTabChange?.(tabId);
  };

  const activeTab = items.find((item) => item.id === activeId);

  const tabListStyle: CSSProperties = {
    display: 'flex',
    gap: variant === 'pill' ? spacing.xs : 0,
    borderBottom: variant === 'underline' ? `2px solid ${semanticColors.borderPrimary}` : 'none',
    marginBottom: spacing['3xl'],
    ...style,
  };

  const tabButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: `${spacing.md} ${spacing.lg}`,
    fontFamily: 'var(--font-family-body)',
    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-md)',
    color: isActive ? semanticColors.textPrimary : semanticColors.textSecondary,
    backgroundColor: variant === 'pill' && isActive ? semanticColors.backgroundSurfaceSecondary : 'transparent',
    border: 'none',
    borderBottom: variant === 'underline' && isActive ? `2px solid ${semanticColors.fillPrimary}` : '2px solid transparent',
    borderRadius: variant === 'pill' ? radius.full : 0,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: variant === 'underline' ? '-2px' : 0,
  });

  return (
    <div className={className}>
      <div style={tabListStyle} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeId === item.id}
            aria-controls={`tabpanel-${item.id}`}
            disabled={item.disabled}
            style={tabButtonStyle(activeId === item.id)}
            onClick={() => handleTabClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          id={`tabpanel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

