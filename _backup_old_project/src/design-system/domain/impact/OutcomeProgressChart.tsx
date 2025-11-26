import React from 'react';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface Outcome {
  id: string;
  label: string;
  target: number;
  current: number;
  unit?: string;
}

export interface OutcomeProgressChartProps {
  outcomes?: Outcome[];
  className?: string;
}

export const OutcomeProgressChart: React.FC<OutcomeProgressChartProps> = ({
  outcomes = [],
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Outcome Progress
      </div>
      <VStack gap="lg">
        {outcomes.map((outcome) => {
          const percentage = outcome.target > 0 ? (outcome.current / outcome.target) * 100 : 0;
          return (
            <div key={outcome.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                  {outcome.label}
                </div>
                <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {outcome.current} / {outcome.target} {outcome.unit || ''}
                </div>
              </div>
              <ProgressBar value={percentage} variant="success" />
            </div>
          );
        })}
      </VStack>
    </Card>
  );
};

