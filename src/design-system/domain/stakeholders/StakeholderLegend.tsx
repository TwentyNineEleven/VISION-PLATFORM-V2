import React from 'react';
import { Card } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { spacing, semanticColors, colors } from '../../theme';

export interface StakeholderLegendProps {
  categories?: Array<{ id: string; label: string; color: string }>;
  className?: string;
}

const defaultCategories = [
  { id: 'internal', label: 'Internal', color: colors.blue.mid },
  { id: 'external', label: 'External', color: colors.emeraldGreen },
  { id: 'partner', label: 'Partner', color: colors.vibrantOrange },
  { id: 'beneficiary', label: 'Beneficiary', color: semanticColors.fillPrimary },
];

export const StakeholderLegend: React.FC<StakeholderLegendProps> = ({
  categories = defaultCategories,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Legend
      </div>
      <VStack gap="sm">
        {categories.map((category) => (
          <div key={category.id} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: category.color,
              }}
            />
            <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
              {category.label}
            </span>
          </div>
        ))}
      </VStack>
    </Card>
  );
};

