import React, { ReactNode, CSSProperties } from 'react';
import { Card } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { BudgetLineItemRow } from './BudgetLineItemRow';
import { BudgetSummaryPanel } from './BudgetSummaryPanel';
import { Grid, GridItem } from '../../primitives/Grid';
import { spacing } from '../../theme';

export interface BudgetLineItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  quantity?: number;
  unitCost?: number;
}

export interface BudgetBuilderProps {
  items?: BudgetLineItem[];
  onItemAdd?: () => void;
  onItemChange?: (itemId: string, item: Partial<BudgetLineItem>) => void;
  onItemDelete?: (itemId: string) => void;
  summary?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const BudgetBuilder: React.FC<BudgetBuilderProps> = ({
  items = [],
  onItemAdd,
  onItemChange,
  onItemDelete,
  summary,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={style}>
      <Grid columns={{ md: 12 }} gap="3xl">
        <GridItem colSpan={{ md: 8 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['3xl'] }}>
              <h2 style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-xl)', margin: 0 }}>
                Budget Items
              </h2>
              {onItemAdd && (
                <button
                  onClick={onItemAdd}
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    backgroundColor: 'var(--color-fill-primary)',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Add Item
                </button>
              )}
            </div>
            <VStack gap="md">
              {items.map((item) => (
                <BudgetLineItemRow
                  key={item.id}
                  item={item}
                  onChange={(updatedItem) => onItemChange?.(item.id, updatedItem)}
                  onDelete={() => onItemDelete?.(item.id)}
                />
              ))}
            </VStack>
          </Card>
        </GridItem>
        <GridItem colSpan={{ md: 4 }}>
          {summary || <BudgetSummaryPanel items={items} />}
        </GridItem>
      </Grid>
    </div>
  );
};

