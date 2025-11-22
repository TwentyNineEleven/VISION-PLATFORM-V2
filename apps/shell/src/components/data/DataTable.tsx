'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlowButton, GlowInput, GlowBadge, GlowCard } from '../glow-ui';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

/**
 * Column Definition
 */
export interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  cell?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Data Table Props
 */
export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter?: (columnId: string, value: string) => void;
  onExport?: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showExport?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  rowActions?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive';
  }>;
}

/**
 * Data Table Component
 * Feature-rich table with sorting, filtering, pagination, and actions
 */
export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  onSort,
  onFilter,
  onExport,
  showSearch = true,
  showFilters = false,
  showExport = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  rowActions = [],
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(
    new Set()
  );
  const [showActionsMenu, setShowActionsMenu] = React.useState<
    string | number | null
  >(null);

  // Filter data by search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        const value =
          typeof column.accessor === 'function'
            ? column.accessor(row)
            : row[column.accessor];

        return String(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue =
        typeof column.accessor === 'function'
          ? column.accessor(a)
          : a[column.accessor];
      const bValue =
        typeof column.accessor === 'function'
          ? column.accessor(b)
          : b[column.accessor];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnId: string) => {
    const newDirection =
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnId);
    setSortDirection(newDirection);
    onSort?.(columnId, newDirection);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)));
    }
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <GlowCard variant="default" padding="none" className="overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          {showSearch && (
            <div className="w-full sm:w-64">
              <GlowInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                variant="glow"
                inputSize="sm"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showFilters && (
              <GlowButton variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </GlowButton>
            )}

            {showExport && (
              <GlowButton
                variant="outline"
                size="sm"
                onClick={onExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </GlowButton>
            )}
          </div>
        </div>

        {/* Selected Count */}
        {selectedRows.size > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <GlowBadge variant="info">
              {selectedRows.size} selected
            </GlowBadge>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows(new Set())}
            >
              Clear selection
            </GlowButton>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {/* Select All Checkbox */}
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.size === paginatedData.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                />
              </th>

              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-4 py-3 text-sm font-semibold',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    !column.align && 'text-left'
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.id)}
                      className="flex items-center gap-2 hover:text-foreground transition-colors group"
                    >
                      {column.header}
                      {sortColumn === column.id ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}

              {/* Actions Column */}
              {rowActions.length > 0 && (
                <th className="w-20 px-4 py-3 text-sm font-semibold text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions.length > 0 ? 2 : 1)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions.length > 0 ? 2 : 1)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-accent/50',
                    selectedRows.has(row.id) && 'bg-accent/30'
                  )}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(row.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                    />
                  </td>

                  {/* Data Cells */}
                  {columns.map((column) => {
                    const value =
                      typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor];

                    return (
                      <td
                        key={column.id}
                        className={cn(
                          'px-4 py-3 text-sm',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.cell ? column.cell(value, row) : value}
                      </td>
                    );
                  })}

                  {/* Actions Cell */}
                  {rowActions.length > 0 && (
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <GlowButton
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(
                              showActionsMenu === row.id ? null : row.id
                            );
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </GlowButton>

                        {showActionsMenu === row.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-ambient-elevated z-10 animate-fade-in">
                            {rowActions.map((action) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={action.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                    setShowActionsMenu(null);
                                  }}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent transition-colors',
                                    action.variant === 'destructive' &&
                                      'text-destructive hover:bg-destructive/10'
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                  {action.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </p>

          <div className="flex items-center gap-2">
            <GlowButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </GlowButton>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <GlowButton
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  glow={currentPage === page ? 'subtle' : 'none'}
                >
                  {page}
                </GlowButton>
              );
            })}

            {totalPages > 5 && <span className="px-2">...</span>}

            <GlowButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </GlowButton>
          </div>
        </div>
      )}
    </GlowCard>
  );
}

/**
 * Example Row Actions
 */
export const exampleRowActions = [
  {
    id: 'view',
    label: 'View Details',
    icon: Eye,
    onClick: (row: any) => console.log('View', row),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: Edit,
    onClick: (row: any) => console.log('Edit', row),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    onClick: (row: any) => console.log('Delete', row),
    variant: 'destructive' as const,
  },
];
