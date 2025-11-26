# 2911 Design System

A complete React + TypeScript design system for **TwentyNine Eleven Impact Partners, LLC ("2911")**, built to match the visual language of Glow UI while using the official 2911 brand color system.

## Overview

This design system provides a comprehensive set of reusable components, design tokens, and patterns for building consistent user interfaces across 30+ applications in the VISION platform.

### Key Features

- **2911 Brand Colors**: All components use the official 2911 color palette (Deep Blue, Emerald Green, Vibrant Orange, etc.)
- **Glow UI Visual Language**: Matches Glow UI's spacing, typography, elevation, and interaction patterns
- **TypeScript**: Fully typed for better developer experience
- **Accessible**: WCAG-compliant components with proper ARIA attributes
- **Responsive**: Mobile-first design with breakpoint system
- **Themeable**: Centralized design tokens via CSS custom properties

## Installation

```bash
npm install @2911/design-system
# or
yarn add @2911/design-system
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from '@2911/design-system';
import '@2911/design-system/global.css';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use Components

```tsx
import { Button, Card, TextInput, AppShell } from '@2911/design-system';

function MyComponent() {
  return (
    <Card>
      <TextInput label="Email" placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Design Tokens

### Colors

The design system uses the **2911 brand color system** exclusively:

- **Deep Blue** (`#002C55`) - Primary anchor color
- **Emerald Green** (`#2BAE66`) - Success/progress/impact
- **Vibrant Orange** (`#F7931E`) - CTAs, highlights, activation
- **Warm Gray** (`#6E7781`) - Neutral content
- **Light Gray** (`#E6E8EB`) - Borders, backgrounds

All colors are available as CSS custom properties and TypeScript tokens.

### Typography

- **Headings**: Poppins (Bold / SemiBold)
- **Body**: Open Sans (Regular)
- Font sizes: xs (12px), sm (14px), md (16px), lg (18px), xl (20px), 2xl (24px), 3xl (32px)

### Spacing

4/8/12/16/24/32/48/64 system, aligned with Glow UI:
- `spacing.xs` = 4px
- `spacing.sm` = 6px
- `spacing.md` = 8px
- `spacing.lg` = 10px
- `spacing.xl` = 12px
- `spacing.2xl` = 16px
- `spacing.3xl` = 16px
- `spacing.6xl` = 24px
- `spacing.8xl` = 32px

### Radius

- `radius.xs` = 4px
- `radius.sm` = 6px
- `radius.md` = 8px
- `radius.lg` = 12px
- `radius.full` = 999px (pill)

### Shadows

- `shadows.sm` - Card elevation
- `shadows.md` - Dropdown elevation
- `shadows.lg` - Modal elevation

## Components

### Core Components

- **Button** - Primary, accent, secondary, subtle, destructive variants
- **TextInput** - Text input with floating labels, validation, addons
- **TextArea** - Multi-line text input
- **Select** - Dropdown select
- **Checkbox** - Checkbox with label
- **Radio** - Radio button with group support
- **Switch** - Toggle switch
- **Card** - Container with header/footer slots
- **StatCard** - KPI/metric display card
- **Tag/Badge** - Label/badge component
- **Alert** - Info, success, warning, error alerts
- **Modal** - Dialog/modal overlay
- **Icon** - SVG icon component

### Layout Components

- **AppShell** - Main application shell with sidebar and top bar
- **SidebarNav** - Collapsible sidebar navigation
- **TopBar** - Top navigation bar
- **Stack** - Flex container (HStack, VStack)
- **Grid** - Responsive grid system
- **Container** - Page-width wrapper
- **ScrollArea** - Scrollable container

### Form Components

- **FormField** - Label + helper + error wrapper
- **FormSection** - Grouped form fields
- **FormActions** - Button group for forms

### Navigation

- **Breadcrumbs** - Breadcrumb navigation
- **Tabs** - Tab navigation
- **Pagination** - Page navigation
- **Stepper** - Multi-step flow indicator

### Data Display

- **DataTable** - Sortable, selectable table
- **List** - List component
- **DescriptionList** - Label/value pairs
- **Avatar** - User avatar
- **PageHeader** - Page title with breadcrumbs and actions

### Feedback

- **Toast** - Notification system
- **ProgressBar** - Progress indicator
- **Spinner** - Loading spinner

### States

- **Skeleton** - Loading skeleton
- **EmptyState** - Empty state display
- **ErrorState** - Error state display

### Accessibility

- **VisuallyHidden** - Screen reader only content
- **SkipToContent** - Skip to main content link

## Usage Examples

### Button

```tsx
import { Button } from '@2911/design-system';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="accent" leftIcon={<Icon name="plus" />}>
  Add Item
</Button>
```

### TextInput

```tsx
import { TextInput } from '@2911/design-system';

<TextInput
  label="Email"
  placeholder="Enter your email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Card

```tsx
import { Card } from '@2911/design-system';

<Card
  header={<h2>Card Title</h2>}
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

### AppShell

```tsx
import { AppShell } from '@2911/design-system';

<AppShell
  sidebarItems={[
    { id: '1', label: 'Dashboard', icon: <Icon name="home" /> },
    { id: '2', label: 'Settings', icon: <Icon name="gear" /> },
  ]}
  topBarProps={{
    title: "My App",
    userMenuSlot: <UserMenu />
  }}
>
  <YourPageContent />
</AppShell>
```

## Domain Components

The design system includes domain-specific components for:

- **Assessment/Survey** - AssessmentSection, AssessmentQuestionBlock
- **Logic Model** - LogicCanvas, LogicNode, Connector
- **Stakeholder Mapping** - StakeholderMapCanvas, StakeholderBubble
- **Document/Grant Writing** - DocumentEditorShell, SectionSummaryPanel
- **Budget & Financial** - BudgetBuilder, BudgetLineItemRow
- **Compliance & Reporting** - RequirementChecklist, DeadlineList
- **Impact & Analytics** - OutcomeProgressChart, KpiSparkline

## Styling

Components use inline styles with CSS custom properties. The design system provides:

- CSS custom properties for all design tokens
- Global styles in `global.css`
- No external CSS dependencies
- Themeable via CSS variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This design system is maintained by the 2911 development team. For questions or contributions, please contact the team.

## License

MIT © TwentyNine Eleven Impact Partners, LLC

