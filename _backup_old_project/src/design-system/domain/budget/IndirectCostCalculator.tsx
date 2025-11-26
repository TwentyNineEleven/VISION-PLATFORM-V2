import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { NumberInput } from '../../components/NumberInput';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface IndirectCostCalculatorProps {
  directCosts?: number;
  indirectCostRate?: number;
  onRateChange?: (rate: number) => void;
  className?: string;
}

export const IndirectCostCalculator: React.FC<IndirectCostCalculatorProps> = ({
  directCosts = 0,
  indirectCostRate = 0,
  onRateChange,
  className = '',
}) => {
  const indirectCosts = directCosts * (indirectCostRate / 100);
  const total = directCosts + indirectCosts;

  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Indirect Cost Calculator
      </div>
      <VStack gap="lg">
        <NumberInput
          label="Indirect Cost Rate (%)"
          value={indirectCostRate}
          onChange={(e) => onRateChange?.(Number(e.target.value))}
          min={0}
          max={100}
          step={0.1}
        />
        <div style={{ padding: spacing.md, backgroundColor: 'var(--color-background-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Direct Costs</span>
            <span>${directCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Indirect Costs</span>
            <span>${indirectCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: spacing.xs, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
            <span>Total</span>
            <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </VStack>
    </Card>
  );
};

