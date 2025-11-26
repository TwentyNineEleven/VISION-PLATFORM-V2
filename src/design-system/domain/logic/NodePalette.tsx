import React from 'react';
import { Card } from '../../components/Card';
import { LogicNodeType } from './LogicNode';
import { spacing } from '../../theme';
import { VStack } from '../../primitives/Stack';

export interface NodePaletteProps {
  onNodeTypeSelect?: (type: LogicNodeType) => void;
  className?: string;
}

const nodeTypes: Array<{ type: LogicNodeType; label: string }> = [
  { type: 'input', label: 'Input' },
  { type: 'activity', label: 'Activity' },
  { type: 'output', label: 'Output' },
  { type: 'outcome', label: 'Outcome' },
  { type: 'impact', label: 'Impact' },
];

export const NodePalette: React.FC<NodePaletteProps> = ({
  onNodeTypeSelect,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Add Node
      </div>
      <VStack gap="xs">
        {nodeTypes.map((nodeType) => (
          <button
            key={nodeType.type}
            onClick={() => onNodeTypeSelect?.(nodeType.type)}
            style={{
              width: '100%',
              padding: spacing.md,
              textAlign: 'left',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-background-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
            }}
          >
            {nodeType.label}
          </button>
        ))}
      </VStack>
    </Card>
  );
};

