import React, { ReactNode, CSSProperties } from 'react';
import { Container } from '../primitives/Container';
import { Grid, GridItem } from '../primitives/Grid';
import { PageHeader, PageHeaderProps } from '../components/PageHeader';
import { spacing } from '../theme';

export interface DetailPageTemplateProps {
  pageHeader?: PageHeaderProps;
  mainContent: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  pageHeader,
  mainContent,
  sidebar,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ minHeight: '100vh', ...style }}>
      <Container>
        {pageHeader && <PageHeader {...pageHeader} />}
        <Grid columns={sidebar ? { md: 12 } : 12} gap="3xl">
          <GridItem colSpan={sidebar ? { md: 8 } : 12}>{mainContent}</GridItem>
          {sidebar && (
            <GridItem colSpan={{ md: 4 }}>
              <div style={{ position: 'sticky', top: spacing['3xl'] }}>{sidebar}</div>
            </GridItem>
          )}
        </Grid>
      </Container>
    </div>
  );
};

