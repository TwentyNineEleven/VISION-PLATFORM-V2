import React, { ReactNode } from 'react';
import { Card } from '../../components/Card';
import { spacing } from '../../theme';

/**
 * AssessmentSection Component
 * 
 * Displays a section of assessment questions
 * 
 * @example
 * <AssessmentSection
 *   title="Section 1: Program Overview"
 *   description="Please answer the following questions"
 *   questions={questionList}
 *   onAnswerChange={(questionId, answer) => handleAnswer(questionId, answer)}
 * />
 */

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
}

export interface AssessmentSectionProps {
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  onAnswerChange?: (questionId: string, answer: any) => void;
  className?: string;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  title,
  description,
  questions,
  onAnswerChange,
  className = '',
}) => {
  return (
    <Card className={className}>
      <h2 style={{ marginBottom: spacing.md }}>{title}</h2>
      {description && <p style={{ marginBottom: spacing['3xl'] }}>{description}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xl'] }}>
        {questions.map((question) => (
          <div key={question.id}>
            <label style={{ display: 'block', marginBottom: spacing.sm }}>
              {question.text}
              {question.required && <span style={{ color: 'var(--color-text-error)' }}> *</span>}
            </label>
            {/* Question input rendering would go here */}
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
              Question type: {question.type}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

