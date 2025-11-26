import React, { CSSProperties } from 'react';
import { EmptyState, EmptyStateProps } from './EmptyState';
import { Icon } from '../icons/Icon';
import { semanticColors } from '../theme';

export interface ErrorStateProps extends Omit<EmptyStateProps, 'icon'> {
  retry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We encountered an error. Please try again.',
  retry,
  ...props
}) => {
  return (
    <EmptyState
      {...props}
      title={title}
      description={description}
      icon={<Icon name="alert" size={48} color={semanticColors.textError} />}
      action={retry ? { label: 'Try again', onClick: retry } : undefined}
    />
  );
};

