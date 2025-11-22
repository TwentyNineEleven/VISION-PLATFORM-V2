import React, { useState, CSSProperties } from 'react';
import { Card } from '../../components/Card';
import { StakeholderBubble, StakeholderBubbleProps } from './StakeholderBubble';
import { spacing } from '../../theme';

export interface Stakeholder {
  id: string;
  name: string;
  category: string;
  influence: number; // 1-5
  interest: number; // 1-5
  x?: number;
  y?: number;
}

export interface StakeholderMapCanvasProps {
  stakeholders?: Stakeholder[];
  onStakeholderClick?: (stakeholderId: string) => void;
  onStakeholderMove?: (stakeholderId: string, x: number, y: number) => void;
  className?: string;
  style?: CSSProperties;
}

export const StakeholderMapCanvas: React.FC<StakeholderMapCanvasProps> = ({
  stakeholders = [],
  onStakeholderClick,
  onStakeholderMove,
  className = '',
  style,
}) => {
  return (
    <Card className={className} style={{ padding: spacing['3xl'], ...style }}>
      <div
        style={{
          width: '100%',
          height: '600px',
          position: 'relative',
          backgroundColor: 'var(--color-background-page)',
          border: '1px dashed var(--color-border-primary)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {stakeholders.map((stakeholder) => (
          <StakeholderBubble
            key={stakeholder.id}
            name={stakeholder.name}
            category={stakeholder.category}
            influence={stakeholder.influence}
            interest={stakeholder.interest}
            x={stakeholder.x ?? 100}
            y={stakeholder.y ?? 100}
            onClick={() => onStakeholderClick?.(stakeholder.id)}
          />
        ))}
      </div>
    </Card>
  );
};

