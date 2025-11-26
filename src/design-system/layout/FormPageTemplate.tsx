import React, { ReactNode, CSSProperties } from 'react';
import { Container } from '../primitives/Container';
import { PageHeader, PageHeaderProps } from '../components/PageHeader';
import { FormSection } from '../components/FormField';
import { FormActions } from '../components/FormField';
import { spacing } from '../theme';

export interface FormPageTemplateProps {
  pageHeader?: PageHeaderProps;
  sections?: Array<{ title: string; description?: string; content: ReactNode }>;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const FormPageTemplate: React.FC<FormPageTemplateProps> = ({
  pageHeader,
  sections,
  actions,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ minHeight: '100vh', ...style }}>
      <Container maxWidth="lg">
        {pageHeader && <PageHeader {...pageHeader} />}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {sections?.map((section, index) => (
            <FormSection key={index} title={section.title} description={section.description}>
              {section.content}
            </FormSection>
          ))}
          {actions && <FormActions>{actions}</FormActions>}
        </div>
      </Container>
    </div>
  );
};

