import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';

export interface SimpleTableColumn {
  key: string;
  header: string;
  render?: (value: any, row: any) => ReactNode;
}

export interface SimpleTableProps {
  columns: SimpleTableColumn[];
  data: Record<string, any>[];
  className?: string;
  style?: CSSProperties;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  className = '',
  style,
}) => {
  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-md)',
    ...style,
  };

  const headerStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurfaceSecondary,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    color: semanticColors.textPrimary,
    textAlign: 'left',
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `2px solid ${semanticColors.borderPrimary}`,
  };

  const cellStyle: CSSProperties = {
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid ${semanticColors.borderPrimary}`,
    color: semanticColors.textPrimary,
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className={className} style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={headerStyle}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? semanticColors.backgroundSurface : semanticColors.backgroundSurfaceSecondary,
                }}
              >
                {columns.map((column) => (
                  <td key={column.key} style={cellStyle}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ ...cellStyle, textAlign: 'center', color: semanticColors.textTertiary }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

