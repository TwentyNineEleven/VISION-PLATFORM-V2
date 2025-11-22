import React from 'react';
import { Card } from '../../components/Card';
import { CheckboxGroup, Checkbox } from '../../components/Checkbox';
import { Select } from '../../components/Select';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface StakeholderFiltersProps {
  categories?: string[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  influenceRange?: { min: number; max: number };
  onInfluenceRangeChange?: (range: { min: number; max: number }) => void;
  className?: string;
}

export const StakeholderFilters: React.FC<StakeholderFiltersProps> = ({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  influenceRange = { min: 1, max: 5 },
  onInfluenceRangeChange,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Filters
      </div>
      <VStack gap="lg">
        {categories.length > 0 && (
          <CheckboxGroup label="Categories">
            {categories.map((category) => (
              <Checkbox
                key={category}
                label={category}
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...selectedCategories, category]
                    : selectedCategories.filter((c) => c !== category);
                  onCategoryChange?.(newCategories);
                }}
              />
            ))}
          </CheckboxGroup>
        )}
        <div>
          <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', marginBottom: spacing.xs }}>
            Influence Range
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            <Select
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ]}
              value={String(influenceRange.min)}
              onChange={(e) =>
                onInfluenceRangeChange?.({ min: Number(e.target.value), max: influenceRange.max })
              }
            />
            <span>to</span>
            <Select
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ]}
              value={String(influenceRange.max)}
              onChange={(e) =>
                onInfluenceRangeChange?.({ min: influenceRange.min, max: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </VStack>
    </Card>
  );
};

