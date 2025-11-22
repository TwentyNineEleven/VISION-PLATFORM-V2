import React, { ReactNode, CSSProperties } from 'react';
import { Container } from '../primitives/Container';
import { Stepper, Step } from './Stepper';
import { PageHeader, PageHeaderProps } from '../components/PageHeader';
import { FormActions } from '../components/FormField';
import { spacing } from '../theme';

export interface WizardTemplateProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  pageHeader?: PageHeaderProps;
  content: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const WizardTemplate: React.FC<WizardTemplateProps> = ({
  steps,
  currentStep,
  onStepClick,
  pageHeader,
  content,
  actions,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ minHeight: '100vh', ...style }}>
      <Container maxWidth="lg">
        {pageHeader && <PageHeader {...pageHeader} />}
        <div style={{ marginBottom: spacing['6xl'] }}>
          <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>{content}</div>
        {actions && (
          <div style={{ marginTop: spacing['6xl'] }}>
            <FormActions>{actions}</FormActions>
          </div>
        )}
      </Container>
    </div>
  );
};

