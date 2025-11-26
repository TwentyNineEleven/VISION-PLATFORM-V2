import React, { ReactNode } from 'react';
import { semanticColors, radius, spacing } from '../theme';
import { Icon } from '../icons/Icon';

export interface Step {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
  style,
}) => {
  const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  if (orientation === 'vertical') {
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xl'], ...style }}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && (status === 'completed' || status === 'current');

          return (
            <div key={step.id} style={{ display: 'flex', gap: spacing.lg }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(index)}
                  disabled={!isClickable}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: radius.round,
                    border: `2px solid ${
                      status === 'completed'
                        ? semanticColors.fillSuccess
                        : status === 'current'
                        ? semanticColors.fillPrimary
                        : semanticColors.borderPrimary
                    }`,
                    backgroundColor:
                      status === 'completed'
                        ? semanticColors.fillSuccess
                        : status === 'current'
                        ? semanticColors.fillPrimary
                        : semanticColors.backgroundSurface,
                    color:
                      status === 'completed' || status === 'current'
                        ? semanticColors.textInverse
                        : semanticColors.textTertiary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-family-body)',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    border: 'none',
                  }}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {status === 'completed' ? (
                    <Icon name="check" size={20} color={semanticColors.textInverse} />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '40px',
                      backgroundColor:
                        status === 'completed' ? semanticColors.fillSuccess : semanticColors.borderPrimary,
                      marginTop: spacing.xs,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: index < steps.length - 1 ? spacing['3xl'] : 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontWeight: status === 'current' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-md)',
                    color:
                      status === 'completed' || status === 'current'
                        ? semanticColors.textPrimary
                        : semanticColors.textTertiary,
                    marginBottom: step.description ? spacing.xs : 0,
                  }}
                >
                  {step.label}
                  {step.optional && (
                    <span style={{ color: semanticColors.textTertiary, fontWeight: 'var(--font-weight-regular)', marginLeft: spacing.xs }}>
                      (Optional)
                    </span>
                  )}
                </div>
                {step.description && (
                  <div
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--font-size-sm)',
                      color: semanticColors.textSecondary,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', width: '100%', ...style }}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isClickable = onStepClick && (status === 'completed' || status === 'current');

        return (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: radius.round,
                  border: `2px solid ${
                    status === 'completed'
                      ? semanticColors.fillSuccess
                      : status === 'current'
                      ? semanticColors.fillPrimary
                      : semanticColors.borderPrimary
                  }`,
                  backgroundColor:
                    status === 'completed'
                      ? semanticColors.fillSuccess
                      : status === 'current'
                      ? semanticColors.fillPrimary
                      : semanticColors.backgroundSurface,
                  color:
                    status === 'completed' || status === 'current'
                      ? semanticColors.textInverse
                      : semanticColors.textTertiary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  marginBottom: spacing.xs,
                }}
                aria-label={`Step ${index + 1}: ${step.label}`}
              >
                {status === 'completed' ? (
                  <Icon name="check" size={20} color={semanticColors.textInverse} />
                ) : (
                  index + 1
                )}
              </button>
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: status === 'current' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  fontSize: 'var(--font-size-sm)',
                  color:
                    status === 'completed' || status === 'current'
                      ? semanticColors.textPrimary
                      : semanticColors.textTertiary,
                  textAlign: 'center',
                }}
              >
                {step.label}
              </div>
              {step.description && (
                <div
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--font-size-xs)',
                    color: semanticColors.textSecondary,
                    textAlign: 'center',
                    marginTop: spacing.xs,
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor:
                    status === 'completed' ? semanticColors.fillSuccess : semanticColors.borderPrimary,
                  margin: `0 ${spacing.lg} ${spacing['2xl']} ${spacing.lg}`,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

