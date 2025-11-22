import React from 'react';
import { Card } from '../../components/Card';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface Section {
  id: string;
  title: string;
  wordCount: number;
  completed: boolean;
}

export interface SectionSummaryPanelProps {
  sections?: Section[];
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

export const SectionSummaryPanel: React.FC<SectionSummaryPanelProps> = ({
  sections = [],
  onSectionClick,
  className = '',
}) => {
  const totalWords = sections.reduce((sum, section) => sum + section.wordCount, 0);

  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Document Sections
      </div>
      <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: spacing.lg }}>
        Total: {totalWords} words
      </div>
      <VStack gap="xs">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick?.(section.id)}
            style={{
              width: '100%',
              padding: spacing.md,
              textAlign: 'left',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              background: section.completed ? 'var(--color-background-surface-secondary)' : 'var(--color-background-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{section.title}</span>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                {section.wordCount} words
              </span>
            </div>
          </button>
        ))}
      </VStack>
    </Card>
  );
};

