import React from 'react';
import { semanticColors, radius, spacing } from '../theme';
import { Icon } from '../icons/Icon';
import { Button } from '../components/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 5,
  className = '',
  style,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    if (currentPage <= half + 1) {
      for (let i = 1; i <= maxVisible - 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - half) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    minWidth: '40px',
    height: '40px',
    padding: `0 ${spacing.md}`,
    backgroundColor: isActive ? semanticColors.fillPrimary : semanticColors.backgroundSurface,
    color: isActive ? semanticColors.textInverse : semanticColors.textPrimary,
    border: `1px solid ${isActive ? semanticColors.fillPrimary : semanticColors.borderPrimary}`,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <nav className={className} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, ...style }} aria-label="Pagination">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            ...buttonStyle(false),
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          aria-label="First page"
        >
          <Icon name="chevronLeft" size={16} color={currentPage === 1 ? semanticColors.textTertiary : semanticColors.textPrimary} />
          <Icon name="chevronLeft" size={16} color={currentPage === 1 ? semanticColors.textTertiary : semanticColors.textPrimary} style={{ marginLeft: '-8px' }} />
        </button>
      )}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...buttonStyle(false),
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          aria-label="Previous page"
        >
          <Icon name="chevronLeft" size={16} color={currentPage === 1 ? semanticColors.textTertiary : semanticColors.textPrimary} />
        </button>
      )}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              style={{
                padding: `0 ${spacing.md}`,
                color: semanticColors.textTertiary,
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={buttonStyle(isActive)}
            aria-label={`Page ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...buttonStyle(false),
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          aria-label="Next page"
        >
          <Icon name="chevronRight" size={16} color={currentPage === totalPages ? semanticColors.textTertiary : semanticColors.textPrimary} />
        </button>
      )}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            ...buttonStyle(false),
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          aria-label="Last page"
        >
          <Icon name="chevronRight" size={16} color={currentPage === totalPages ? semanticColors.textTertiary : semanticColors.textPrimary} />
          <Icon name="chevronRight" size={16} color={currentPage === totalPages ? semanticColors.textTertiary : semanticColors.textPrimary} style={{ marginLeft: '-8px' }} />
        </button>
      )}
    </nav>
  );
};

