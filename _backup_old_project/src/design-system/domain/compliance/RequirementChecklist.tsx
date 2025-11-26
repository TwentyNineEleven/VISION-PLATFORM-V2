import React from 'react';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Checkbox';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface Requirement {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  category?: string;
}

export interface RequirementChecklistProps {
  requirements?: Requirement[];
  onRequirementToggle?: (requirementId: string, completed: boolean) => void;
  className?: string;
}

export const RequirementChecklist: React.FC<RequirementChecklistProps> = ({
  requirements = [],
  onRequirementToggle,
  className = '',
}) => {
  const completedCount = requirements.filter((r) => r.completed).length;
  const totalCount = requirements.length;

  return (
    <Card className={className}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)' }}>
          Requirements
        </div>
        <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {completedCount} / {totalCount} completed
        </div>
      </div>
      <VStack gap="sm">
        {requirements.map((requirement) => (
          <div
            key={requirement.id}
            style={{
              padding: spacing.md,
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: requirement.completed ? 'var(--color-background-surface-secondary)' : 'var(--color-background-surface)',
            }}
          >
            <Checkbox
              label={requirement.label}
              checked={requirement.completed}
              onChange={(e) => onRequirementToggle?.(requirement.id, e.target.checked)}
            />
            {requirement.description && (
              <div style={{ marginTop: spacing.xs, marginLeft: spacing['2xl'], fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                {requirement.description}
              </div>
            )}
            {requirement.dueDate && (
              <div style={{ marginTop: spacing.xs, marginLeft: spacing['2xl'], fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                Due: {requirement.dueDate.toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </VStack>
    </Card>
  );
};

