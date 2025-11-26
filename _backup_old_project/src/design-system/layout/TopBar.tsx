import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';

export interface TopBarProps {
  title?: string;
  searchSlot?: ReactNode;
  orgSwitcherSlot?: ReactNode;
  userMenuSlot?: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  searchSlot,
  orgSwitcherSlot,
  userMenuSlot,
  actions,
  className = '',
  style,
}) => {
  const topBarStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurface,
    borderBottom: `1px solid ${semanticColors.borderSecondary}`,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${spacing['3xl']}`,
    gap: spacing['3xl'],
    ...style,
  };

  return (
    <div className={className} style={topBarStyle}>
      {title && (
        <div
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-xl)',
            color: semanticColors.textPrimary,
          }}
        >
          {title}
        </div>
      )}
      {searchSlot && <div style={{ flex: 1, maxWidth: 400 }}>{searchSlot}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
        {orgSwitcherSlot}
        {actions}
        {userMenuSlot}
      </div>
    </div>
  );
};

