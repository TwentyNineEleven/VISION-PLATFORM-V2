import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Button } from './Button';
import { Icon } from '../icons/Icon';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Sortable, selectable data table component with row selection and actions.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleData = [
  { id: '1', name: 'Program A', status: 'Active', budget: 50000, participants: 120 },
  { id: '2', name: 'Program B', status: 'Planning', budget: 75000, participants: 0 },
  { id: '3', name: 'Program C', status: 'Active', budget: 30000, participants: 85 },
  { id: '4', name: 'Program D', status: 'Completed', budget: 100000, participants: 200 },
];

const columns = [
  { key: 'name', header: 'Program Name' },
  { key: 'status', header: 'Status' },
  { key: 'budget', header: 'Budget', render: (value: number) => `$${value.toLocaleString()}` },
  { key: 'participants', header: 'Participants' },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    selectable: false,
    sortable: true,
  },
};

export const Selectable: Story = {
  args: {
    columns,
    data: sampleData,
    selectable: true,
    sortable: true,
  },
};

export const WithActions: Story = {
  render: () => {
    const actionColumns = [
      ...columns,
      {
        key: 'actions',
        header: 'Actions',
        render: () => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="subtle">
              <Icon name="edit" size={16} />
            </Button>
            <Button size="sm" variant="subtle">
              <Icon name="trash" size={16} />
            </Button>
          </div>
        ),
      },
    ];
    return <DataTable columns={actionColumns} data={sampleData} />;
  },
};

