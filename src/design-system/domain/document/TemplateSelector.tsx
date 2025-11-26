import React from 'react';
import { Card } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface TemplateSelectorProps {
  templates?: Template[];
  onSelect?: (templateId: string) => void;
  className?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates = [],
  onSelect,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Select Template
      </div>
      <VStack gap="sm">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect?.(template.id)}
            style={{
              width: '100%',
              padding: spacing.md,
              textAlign: 'left',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-background-surface)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-background-surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-background-surface)';
            }}
          >
            <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: spacing.xs }}>
              {template.name}
            </div>
            <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              {template.description}
            </div>
          </button>
        ))}
      </VStack>
    </Card>
  );
};

