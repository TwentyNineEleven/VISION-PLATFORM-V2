import React from 'react';
import { HStack } from '../../primitives/Stack';
import { Button } from '../../components/Button';
import { Icon } from '../../icons/Icon';
import { spacing } from '../../theme';

export interface CanvasToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToScreen?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  className = '',
}) => {
  return (
    <div className={className} style={{ padding: spacing.md, backgroundColor: 'var(--color-background-surface)', borderBottom: '1px solid var(--color-border-primary)' }}>
      <HStack gap="xs">
        {onZoomIn && (
          <IconButton icon={<Icon name="plus" size={16} />} onClick={onZoomIn} aria-label="Zoom in" />
        )}
        {onZoomOut && (
          <IconButton icon={<Icon name="minus" size={16} />} onClick={onZoomOut} aria-label="Zoom out" />
        )}
        {onFitToScreen && (
          <Button variant="subtle" size="sm" onClick={onFitToScreen}>
            Fit to Screen
          </Button>
        )}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border-primary)', margin: `0 ${spacing.xs}` }} />
        {onUndo && (
          <Button variant="subtle" size="sm" onClick={onUndo} disabled={!canUndo}>
            Undo
          </Button>
        )}
        {onRedo && (
          <Button variant="subtle" size="sm" onClick={onRedo} disabled={!canRedo}>
            Redo
          </Button>
        )}
      </HStack>
    </div>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode; onClick: () => void; 'aria-label': string }> = ({ icon, onClick, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    style={{
      padding: spacing.xs,
      border: '1px solid var(--color-border-primary)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--color-background-surface)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

