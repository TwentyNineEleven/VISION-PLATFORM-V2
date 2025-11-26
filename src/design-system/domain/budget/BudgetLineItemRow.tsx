import React from 'react';
import { BudgetLineItem } from './BudgetBuilder';
import { NumberInput } from '../../components/NumberInput';
import { TextInput } from '../../components/TextInput';
import { HStack } from '../../primitives/Stack';
import { Icon } from '../../icons/Icon';
import { semanticColors, spacing } from '../../theme';

export interface BudgetLineItemRowProps {
  item: BudgetLineItem;
  onChange?: (item: Partial<BudgetLineItem>) => void;
  onDelete?: () => void;
  className?: string;
}

export const BudgetLineItemRow: React.FC<BudgetLineItemRowProps> = ({
  item,
  onChange,
  onDelete,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        padding: spacing.lg,
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-background-surface)',
      }}
    >
      <HStack gap="md" align="start">
        <div style={{ flex: 1 }}>
          <TextInput
            label="Category"
            value={item.category}
            onChange={(e) => onChange?.({ category: e.target.value })}
            size="sm"
          />
        </div>
        <div style={{ flex: 2 }}>
          <TextInput
            label="Description"
            value={item.description}
            onChange={(e) => onChange?.({ description: e.target.value })}
            size="sm"
          />
        </div>
        <div style={{ width: '120px' }}>
          <NumberInput
            label="Amount"
            value={item.amount}
            onChange={(e) => onChange?.({ amount: Number(e.target.value) })}
            size="sm"
            min={0}
            step={0.01}
          />
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing.xs,
              marginTop: spacing['2xl'],
            }}
            aria-label="Delete item"
          >
            <Icon name="trash" size={20} color={semanticColors.textError} />
          </button>
        )}
      </HStack>
    </div>
  );
};

