import type { Meta, StoryObj } from '@storybook/react';
import { LogicCanvas } from './LogicCanvas';
import { LogicNode } from './LogicNode';
import { useState } from 'react';
import { HStack } from '../../primitives/Stack';
import { NodePalette } from './NodePalette';
import { CanvasToolbar } from './CanvasToolbar';

const meta: Meta<typeof LogicCanvas> = {
  title: 'Domain/Logic Model/LogicCanvas',
  component: LogicCanvas,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Canvas for building logic models and theory of change diagrams.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LogicCanvas>;

export const Default: Story = {
  render: () => {
    const [nodes, setNodes] = useState([
      { id: '1', type: 'input' as const, x: 100, y: 100, label: 'Input Node' },
      { id: '2', type: 'activity' as const, x: 300, y: 100, label: 'Activity Node' },
      { id: '3', type: 'output' as const, x: 500, y: 100, label: 'Output Node' },
    ]);

    return (
      <div>
        <CanvasToolbar />
        <HStack gap="md" align="start">
          <NodePalette
            onNodeTypeSelect={(type) => {
              const newNode = {
                id: String(nodes.length + 1),
                type,
                x: Math.random() * 400 + 100,
                y: Math.random() * 300 + 100,
                label: `${type} Node`,
              };
              setNodes([...nodes, newNode]);
            }}
          />
          <div style={{ flex: 1 }}>
            <LogicCanvas
              nodes={nodes}
              onNodeClick={(nodeId) => {
                console.log('Clicked node:', nodeId);
              }}
            />
          </div>
        </HStack>
      </div>
    );
  },
};

