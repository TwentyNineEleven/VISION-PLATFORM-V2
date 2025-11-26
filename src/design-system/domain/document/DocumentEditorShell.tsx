import React, { ReactNode, CSSProperties } from 'react';
import { Grid, GridItem } from '../../primitives/Grid';
import { spacing } from '../../theme';

export interface DocumentEditorShellProps {
  editor: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const DocumentEditorShell: React.FC<DocumentEditorShellProps> = ({
  editor,
  sidebar,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ height: '100%', ...style }}>
      <Grid columns={sidebar ? { md: 12 } : 12} gap="none" style={{ height: '100%' }}>
        <GridItem colSpan={sidebar ? { md: 9 } : 12} style={{ overflow: 'auto', padding: spacing['3xl'] }}>
          {editor}
        </GridItem>
        {sidebar && (
          <GridItem colSpan={{ md: 3 }} style={{ borderLeft: '1px solid var(--color-border-primary)', padding: spacing['3xl'], overflow: 'auto' }}>
            {sidebar}
          </GridItem>
        )}
      </Grid>
    </div>
  );
};

