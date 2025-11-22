import React, { ReactNode, CSSProperties } from 'react';
import { Container } from '../primitives/Container';
import { Grid, GridItem } from '../primitives/Grid';
import { PageHeader, PageHeaderProps } from '../components/PageHeader';
import { SectionHeader } from '../components/SectionHeader';
import { spacing } from '../theme';

export interface DashboardTemplateProps {
  pageHeader?: PageHeaderProps;
  sidebar?: ReactNode;
  mainContent: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  pageHeader,
  sidebar,
  mainContent,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ minHeight: '100vh', ...style }}>
      <Container>
        {pageHeader && <PageHeader {...pageHeader} />}
        <Grid columns={sidebar ? { md: 12 } : 12} gap="3xl">
          {sidebar && (
            <GridItem colSpan={{ md: 3 }}>
              <div style={{ position: 'sticky', top: spacing['3xl'] }}>{sidebar}</div>
            </GridItem>
          )}
          <GridItem colSpan={sidebar ? { md: 9 } : 12}>{mainContent}</GridItem>
        </Grid>
      </Container>
    </div>
  );
};

