import React from 'react';
import { Card } from '../../components/Card';
import { List, ListItem } from '../../components/List';
import { Tag } from '../../components/Tag';
import { spacing } from '../../theme';
import { semanticColors } from '../../theme';

export interface Deadline {
  id: string;
  title: string;
  dueDate: Date;
  status: 'upcoming' | 'due-soon' | 'overdue' | 'completed';
  category?: string;
}

export interface DeadlineListProps {
  deadlines?: Deadline[];
  onDeadlineClick?: (deadlineId: string) => void;
  className?: string;
}

const getStatusColor = (status: Deadline['status']): 'default' | 'warning' | 'error' | 'success' => {
  switch (status) {
    case 'overdue':
      return 'error';
    case 'due-soon':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getDaysUntil = (dueDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const DeadlineList: React.FC<DeadlineListProps> = ({
  deadlines = [],
  onDeadlineClick,
  className = '',
}) => {
  const sortedDeadlines = [...deadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <Card className={className}>
      <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', marginBottom: spacing.md }}>
        Upcoming Deadlines
      </div>
      <List>
        {sortedDeadlines.map((deadline) => {
          const daysUntil = getDaysUntil(deadline.dueDate);
          const statusLabel =
            deadline.status === 'completed'
              ? 'Completed'
              : deadline.status === 'overdue'
              ? 'Overdue'
              : deadline.status === 'due-soon'
              ? 'Due Soon'
              : daysUntil === 0
              ? 'Due Today'
              : daysUntil === 1
              ? 'Due Tomorrow'
              : `${daysUntil} days`;

          return (
            <ListItem
              key={deadline.id}
              onClick={() => onDeadlineClick?.(deadline.id)}
              selected={deadline.status === 'due-soon' || deadline.status === 'overdue'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: spacing.xs }}>
                    {deadline.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {deadline.dueDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <Tag variant={getStatusColor(deadline.status)} size="sm">
                  {statusLabel}
                </Tag>
              </div>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};

