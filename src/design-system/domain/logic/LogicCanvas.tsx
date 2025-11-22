import React, { useState, useRef, CSSProperties } from 'react';
import { Card } from '../../components/Card';
import { spacing } from '../../theme';

export interface LogicNode {
  id: string;
  type: 'input' | 'activity' | 'output' | 'outcome' | 'impact';
  x: number;
  y: number;
  label: string;
}

export interface LogicCanvasProps {
  nodes?: LogicNode[];
  onNodeAdd?: (type: LogicNode['type'], x: number, y: number) => void;
  onNodeMove?: (nodeId: string, x: number, y: number) => void;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
  style?: CSSProperties;
}

export const LogicCanvas: React.FC<LogicCanvasProps> = ({
  nodes = [],
  onNodeAdd,
  onNodeMove,
  onNodeClick,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  return (
    <Card className={className} style={{ padding: 0, ...style }}>
      <div
        ref={canvasRef}
        style={{
          width: '100%',
          height: '600px',
          position: 'relative',
          backgroundColor: 'var(--color-background-page)',
          overflow: 'auto',
        }}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onNodeClick?.(node.id)}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              padding: spacing.md,
              backgroundColor: 'var(--color-background-surface)',
              border: '2px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'move',
              minWidth: '120px',
            }}
          >
            {node.label}
          </div>
        ))}
      </div>
    </Card>
  );
};

