import type { Meta, StoryObj } from '@storybook/react';
import { AssessmentSection } from './AssessmentSection';
import { HStack } from '../../primitives/Stack';
import { AssessmentProgressSidebar } from './AssessmentProgressSidebar';

const meta: Meta<typeof AssessmentSection> = {
  title: 'Domain/Assessment/AssessmentSection',
  component: AssessmentSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Assessment section component for surveys and evaluations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AssessmentSection>;

const sampleQuestions = [
  {
    id: '1',
    text: 'What is the primary goal of this program?',
    type: 'text' as const,
    required: true,
  },
  {
    id: '2',
    text: 'How many participants do you expect?',
    type: 'number' as const,
    required: true,
  },
  {
    id: '3',
    text: 'Select all that apply',
    type: 'checkbox' as const,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Section 1: Program Overview',
    description: 'Please provide information about your program',
    questions: sampleQuestions,
  },
};

export const WithProgress: Story = {
  render: () => (
    <HStack gap="lg" align="start">
      <div style={{ flex: 1 }}>
        <AssessmentSection
          title="Section 1: Program Overview"
          questions={sampleQuestions}
        />
      </div>
      <div style={{ width: '300px' }}>
        <AssessmentProgressSidebar
          totalQuestions={sampleQuestions.length}
          answeredQuestions={1}
          sections={[
            { id: '1', label: 'Section 1', completed: false },
            { id: '2', label: 'Section 2', completed: true },
          ]}
        />
      </div>
    </HStack>
  ),
};

