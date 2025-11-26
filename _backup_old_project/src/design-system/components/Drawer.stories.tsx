import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Side drawer/panel component that slides in from any side.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightDrawer: Story = {
  render: function RightDrawerStory() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Right Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Right Drawer" placement="right">
          <Card>
            <p>This is a drawer that slides in from the right side.</p>
            <p>You can place any content here.</p>
          </Card>
        </Drawer>
      </>
    );
  },
};

export const LeftDrawer: Story = {
  render: function LeftDrawerStory() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Left Drawer" placement="left">
          <Card>
            <p>This drawer slides in from the left.</p>
          </Card>
        </Drawer>
      </>
    );
  },
};

export const BottomDrawer: Story = {
  render: function BottomDrawerStory() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Bottom Drawer" placement="bottom" size="md">
          <Card>
            <p>This drawer slides up from the bottom.</p>
          </Card>
        </Drawer>
      </>
    );
  },
};

