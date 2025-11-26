# Storybook Setup Guide

## ✅ Storybook Configuration Complete

Storybook has been configured for the 2911 Design System. Here's what was set up:

### Files Created

1. **`.storybook/main.ts`** - Main Storybook configuration
   - Configured for React + Vite
   - Stories pattern: `src/design-system/**/*.stories.@(js|jsx|ts|tsx|mdx)`
   - Essential addons included

2. **`.storybook/preview.ts`** - Preview configuration
   - ThemeProvider wrapper for all stories
   - Global CSS imported
   - Background colors configured
   - Default decorators set up

3. **Story Files Created:**
   - `src/design-system/components/Button.stories.tsx`
   - `src/design-system/components/Card.stories.tsx`
   - `src/design-system/components/TextInput.stories.tsx`
   - `src/design-system/layout/AppShell.stories.tsx`

### Package.json Updates

✅ Added Storybook scripts:
- `npm run storybook` - Start Storybook dev server
- `npm run build-storybook` - Build static Storybook

✅ Added Storybook dependencies:
- `@storybook/react-vite`
- `@storybook/addon-essentials`
- `@storybook/addon-links`
- `@storybook/addon-interactions`
- `@storybook/addon-a11y`
- `@storybook/addon-viewport`
- `@storybook/addon-docs`
- `storybook`

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Storybook:**
   ```bash
   npm run storybook
   ```

3. **View in browser:**
   - Storybook will open at `http://localhost:6006`

## Story Structure

All stories follow CSF3 (Component Story Format 3) and include:

- ✅ TypeScript types
- ✅ ThemeProvider wrapper (via preview decorator)
- ✅ Multiple variants and states
- ✅ Interactive controls
- ✅ Documentation via autodocs
- ✅ Accessibility testing (via addon-a11y)

## Next Steps: Add More Stories

To add stories for other components, create files following this pattern:

```typescript
// src/design-system/components/YourComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // component props
  },
};
```

## Recommended Stories to Add Next

1. **Core Components:**
   - Alert.stories.tsx
   - Select.stories.tsx
   - Checkbox.stories.tsx
   - Switch.stories.tsx
   - Tabs.stories.tsx
   - Breadcrumbs.stories.tsx
   - Modal.stories.tsx

2. **Layout:**
   - SidebarNav.stories.tsx
   - TopBar.stories.tsx

3. **Domain Components:**
   - AssessmentSection.stories.tsx
   - (Other domain components as they're implemented)

## Storybook Features Enabled

- ✅ **Autodocs** - Automatic documentation generation
- ✅ **Controls** - Interactive prop editing
- ✅ **Actions** - Event logging
- ✅ **Accessibility** - A11y testing
- ✅ **Viewport** - Responsive testing
- ✅ **Interactions** - User interaction testing

## Troubleshooting

If Storybook doesn't start:

1. Ensure all dependencies are installed: `npm install`
2. Check Node.js version (requires Node 18+)
3. Clear cache: `rm -rf node_modules/.cache`
4. Reinstall: `rm -rf node_modules && npm install`

