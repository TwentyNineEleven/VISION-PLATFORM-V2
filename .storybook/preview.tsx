import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../src/design-system/theme/ThemeProvider';
import '../src/global.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F8FAFC', // Mist (Bold Color System)
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'smoke',
          value: '#F1F5F9', // Smoke (Bold Color System)
        },
        {
          name: 'dark',
          value: '#1F2937', // Slate Gray (Bold Color System)
        },
        {
          name: 'bold-blue',
          value: '#0047AB', // Bold Royal Blue
        },
      ],
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div id="app-container" style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;

