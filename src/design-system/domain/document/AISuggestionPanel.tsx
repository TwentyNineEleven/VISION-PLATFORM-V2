import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VStack } from '../../primitives/Stack';
import { spacing } from '../../theme';

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'completion' | 'grammar';
  text: string;
  originalText?: string;
}

export interface AISuggestionPanelProps {
  suggestions?: AISuggestion[];
  onApply?: (suggestionId: string) => void;
  onDismiss?: (suggestionId: string) => void;
  className?: string;
}

export const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({
  suggestions = [],
  onApply,
  onDismiss,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        AI Suggestions
      </div>
      {suggestions.length > 0 ? (
        <VStack gap="md">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              style={{
                padding: spacing.md,
                backgroundColor: 'var(--color-background-surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: spacing.xs, textTransform: 'uppercase' }}>
                {suggestion.type}
              </div>
              <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: spacing.sm }}>
                {suggestion.text}
              </div>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                {onApply && (
                  <Button size="sm" variant="primary" onClick={() => onApply(suggestion.id)}>
                    Apply
                  </Button>
                )}
                {onDismiss && (
                  <Button size="sm" variant="subtle" onClick={() => onDismiss(suggestion.id)}>
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
          ))}
        </VStack>
      ) : (
        <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', textAlign: 'center', padding: spacing['3xl'] }}>
          No suggestions at this time
        </div>
      )}
    </Card>
  );
};

