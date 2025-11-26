import React, { useState, CSSProperties } from 'react';
import { semanticColors, radius, spacing } from '../theme';
import { Icon } from '../icons/Icon';
import { Checkbox } from './Checkbox';
import { SimpleTableColumn } from './SimpleTable';

export interface DataTableProps {
  columns: SimpleTableColumn[];
  data: Record<string, any>[];
  selectable?: boolean;
  sortable?: boolean;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  onSelectionChange?: (selectedRows: Record<string, any>[]) => void;
  selectedRows?: Record<string, any>[];
  className?: string;
  style?: CSSProperties;
}

type SortState = {
  column: string | null;
  direction: 'asc' | 'desc';
};

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  selectable = false,
  sortable = true,
  onSort,
  onSelectionChange,
  selectedRows: controlledSelectedRows,
  className = '',
  style,
}) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<Record<string, any>[]>([]);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: 'asc' });

  const selectedRows = controlledSelectedRows !== undefined ? controlledSelectedRows : internalSelectedRows;

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection: 'asc' | 'desc' =
      sortState.column === columnKey && sortState.direction === 'asc' ? 'desc' : 'asc';
    const newSortState: SortState = { column: columnKey, direction: newDirection };
    setSortState(newSortState);
    onSort?.(columnKey, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? [...data] : [];
    if (controlledSelectedRows === undefined) {
      setInternalSelectedRows(newSelection);
    }
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (row: Record<string, any>, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r !== row);
    if (controlledSelectedRows === undefined) {
      setInternalSelectedRows(newSelection);
    }
    onSelectionChange?.(newSelection);
  };

  const isRowSelected = (row: Record<string, any>) => {
    return selectedRows.some((r) => r === row);
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  const enhancedColumns: SimpleTableColumn[] = selectable
    ? [
        {
          key: '__select',
          header: '',
          render: () => null,
        },
        ...columns,
      ]
    : columns;

  const tableData = data.map((row, index) => ({
    ...row,
    __select: (
      <Checkbox
        checked={isRowSelected(row)}
        onChange={(e) => handleSelectRow(row, e.target.checked)}
        aria-label={`Select row ${index + 1}`}
      />
    ),
  }));

  const headerStyle = (column: SimpleTableColumn): CSSProperties => ({
    backgroundColor: semanticColors.backgroundSurfaceSecondary,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    color: semanticColors.textPrimary,
    textAlign: 'left',
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `2px solid ${semanticColors.borderPrimary}`,
    cursor: sortable && column.key !== '__select' ? 'pointer' : 'default',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  });

  return (
    <div style={{ width: '100%', ...style }}>
      {selectable && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: semanticColors.backgroundSurfaceSecondary,
            borderBottom: `1px solid ${semanticColors.borderPrimary}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <Checkbox
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            aria-label="Select all rows"
          />
          <span
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              color: semanticColors.textSecondary,
            }}
          >
            {selectedRows.length} of {data.length} selected
          </span>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className={className} style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-family-body)' }}>
          <thead>
            <tr>
              {enhancedColumns.map((column) => (
                <th
                  key={column.key}
                  style={headerStyle(column)}
                  onClick={() => column.key !== '__select' && handleSort(column.key)}
                >
                  {column.key === '__select' ? (
                    <Checkbox
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Select all"
                    />
                  ) : (
                    <>
                      {column.header}
                      {sortable && sortState.column === column.key && (
                        <Icon
                          name={sortState.direction === 'asc' ? 'chevronUp' : 'chevronDown'}
                          size={16}
                          color={semanticColors.textPrimary}
                        />
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? semanticColors.backgroundSurface : semanticColors.backgroundSurfaceSecondary,
                }}
              >
                {enhancedColumns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderBottom: `1px solid ${semanticColors.borderPrimary}`,
                      color: semanticColors.textPrimary,
                    }}
                  >
                    {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

