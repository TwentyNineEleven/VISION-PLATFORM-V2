import React from 'react';
import { Card } from '../../components/Card';
import { AssessmentQuestion } from './AssessmentSection';
import { FormField } from '../../components/FormField';
import { spacing } from '../../theme';

export interface AssessmentQuestionBlockProps {
  question: AssessmentQuestion;
  answer?: any;
  onAnswerChange?: (answer: any) => void;
  className?: string;
}

export const AssessmentQuestionBlock: React.FC<AssessmentQuestionBlockProps> = ({
  question,
  answer,
  onAnswerChange,
  className = '',
}) => {
  return (
    <Card className={className} style={{ marginBottom: spacing['3xl'] }}>
      <FormField
        label={question.text}
        required={question.required}
        helperText={question.type === 'text' ? 'Enter your answer' : undefined}
      >
        {/* Render appropriate input based on question type */}
        <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
          Question type: {question.type}
        </div>
      </FormField>
    </Card>
  );
};

