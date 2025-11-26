import React from 'react';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { spacing } from '../../theme';

export interface AssessmentProgressSidebarProps {
  totalQuestions: number;
  answeredQuestions: number;
  currentSection?: string;
  sections?: Array<{ id: string; label: string; completed: boolean }>;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

export const AssessmentProgressSidebar: React.FC<AssessmentProgressSidebarProps> = ({
  totalQuestions,
  answeredQuestions,
  currentSection,
  sections,
  onSectionClick,
  className = '',
}) => {
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <Card className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xl'] }}>
        <div>
          <div style={{ marginBottom: spacing.sm, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Progress
          </div>
          <ProgressBar value={progress} showLabel />
          <div style={{ marginTop: spacing.xs, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
            {answeredQuestions} of {totalQuestions} questions answered
          </div>
        </div>
        {sections && sections.length > 0 && (
          <div>
            <div style={{ marginBottom: spacing.md, fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
              Sections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick?.(section.id)}
                  style={{
                    padding: spacing.md,
                    textAlign: 'left',
                    border: 'none',
                    background: section.id === currentSection ? 'var(--color-background-surface-secondary)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {section.completed && '✓ '}
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

