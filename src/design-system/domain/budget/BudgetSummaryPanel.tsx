import React from 'react';
import { Card } from '../../components/Card';
import { StatCard } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { BudgetLineItem } from './BudgetBuilder';
import { spacing } from '../../theme';

export interface BudgetSummaryPanelProps {
  items?: BudgetLineItem[];
  indirectCostRate?: number;
  className?: string;
}

export const BudgetSummaryPanel: React.FC<BudgetSummaryPanelProps> = ({
  items = [],
  indirectCostRate = 0,
  className = '',
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const indirectCost = subtotal * (indirectCostRate / 100);
  const total = subtotal + indirectCost;

  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Budget Summary
      </div>
      <VStack gap="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        {indirectCostRate > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Indirect Costs ({indirectCostRate}%)</span>
            <span>${indirectCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: spacing.md, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
          <span>Total</span>
          <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </VStack>
    </Card>
  );
};

