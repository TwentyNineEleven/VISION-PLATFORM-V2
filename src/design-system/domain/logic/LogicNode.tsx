import React, { CSSProperties } from 'react';
import { semanticColors, colors, radius, spacing } from '../../theme';

export type LogicNodeType = 'input' | 'activity' | 'output' | 'outcome' | 'impact';

export interface LogicNodeProps {
  id: string;
  type: LogicNodeType;
  label: string;
  description?: string;
  x?: number;
  y?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const typeStyles: Record<LogicNodeType, { bg: string; border: string }> = {
  input: { bg: colors.blue.light, border: colors.blue.mid },
  activity: { bg: colors.orange.light, border: colors.vibrantOrange },
  output: { bg: colors.green.light, border: colors.emeraldGreen },
  outcome: { bg: colors.green.mid, border: colors.green.dark },
  impact: { bg: semanticColors.fillPrimary, border: colors.deepBlue },
};

export const LogicNode: React.FC<LogicNodeProps> = ({
  id,
  type,
  label,
  description,
  x = 0,
  y = 0,
  onClick,
  className = '',
  style,
}) => {
  const styleForType = typeStyles[type];

  const nodeStyle: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    minWidth: '150px',
    padding: spacing.lg,
    backgroundColor: styleForType.bg,
    border: `2px solid ${styleForType.border}`,
    borderRadius: radius.md,
    cursor: onClick ? 'pointer' : 'move',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div
      id={id}
      className={className}
      style={nodeStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: description ? spacing.xs : 0 }}>
        {label}
      </div>
      {description && (
        <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {description}
        </div>
      )}
    </div>
  );
};

