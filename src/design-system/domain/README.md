# Domain Components

This directory contains domain-specific components for the VISION platform.

## Structure

- `assessment/` - Assessment and survey components
- `logic/` - Logic Model / Theory of Change components
- `stakeholders/` - Stakeholder mapping components
- `document/` - Document and grant writing components
- `budget/` - Budget and financial components
- `compliance/` - Compliance and reporting components
- `impact/` - Impact and analytics components

## Usage

Domain components are built on top of the core design system components and follow the same patterns and styling guidelines.

Example:
```tsx
import { AssessmentSection } from '@2911/design-system/domain/assessment';

<AssessmentSection
  title="Section 1"
  questions={questions}
  onAnswerChange={handleAnswerChange}
/>
```

## Implementation Status

Domain components are being developed incrementally. Check individual component files for implementation status and API documentation.

