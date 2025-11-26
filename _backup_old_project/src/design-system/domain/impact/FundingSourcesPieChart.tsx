import React from 'react';
import { Card } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { spacing, semanticColors, colors } from '../../theme';

export interface FundingSource {
  id: string;
  label: string;
  amount: number;
  color?: string;
}

export interface FundingSourcesPieChartProps {
  sources?: FundingSource[];
  className?: string;
}

const defaultColors = [
  semanticColors.fillPrimary,
  colors.emeraldGreen,
  colors.vibrantOrange,
  colors.blue.mid,
  colors.green.mid,
];

export const FundingSourcesPieChart: React.FC<FundingSourcesPieChartProps> = ({
  sources = [],
  className = '',
}) => {
  const total = sources.reduce((sum, source) => sum + source.amount, 0);

  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Funding Sources
      </div>
      <VStack gap="sm">
        {sources.map((source, index) => {
          const percentage = total > 0 ? (source.amount / total) * 100 : 0;
          const color = source.color || defaultColors[index % defaultColors.length];
          return (
            <div key={source.id} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {source.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    ${source.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--color-background-surface-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: color,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </VStack>
      <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: '1px solid var(--color-border-primary)', fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Total</span>
        <span>${total.toLocaleString()}</span>
      </div>
    </Card>
  );
};

