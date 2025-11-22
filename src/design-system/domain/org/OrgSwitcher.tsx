import React, { useState, useRef, useEffect } from 'react';
import { semanticColors, radius, spacing, shadows, zIndex } from '../../theme';
import { Icon } from '../../icons/Icon';
import { Avatar } from '../../components/Avatar';

export interface Organization {
  id: string;
  name: string;
  logo?: string;
}

export interface OrgSwitcherProps {
  organizations: Organization[];
  currentOrg?: Organization;
  onOrgChange?: (org: Organization) => void;
  className?: string;
}

export const OrgSwitcher: React.FC<OrgSwitcherProps> = ({
  organizations,
  currentOrg,
  onOrgChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOrg = currentOrg || organizations[0];

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          padding: `${spacing.sm} ${spacing.md}`,
          border: `1px solid ${semanticColors.borderPrimary}`,
          borderRadius: radius.sm,
          backgroundColor: semanticColors.backgroundSurface,
          cursor: 'pointer',
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-sm)',
          color: semanticColors.textPrimary,
        }}
      >
        {selectedOrg.logo ? (
          <img src={selectedOrg.logo} alt={selectedOrg.name} style={{ width: 24, height: 24, borderRadius: radius.sm }} />
        ) : (
          <Avatar name={selectedOrg.name} size="sm" />
        )}
        <span>{selectedOrg.name}</span>
        <Icon name="chevronDown" size={16} color={semanticColors.textSecondary} />
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: spacing.xs,
            backgroundColor: semanticColors.backgroundSurface,
            border: `1px solid ${semanticColors.borderPrimary}`,
            borderRadius: radius.md,
            boxShadow: shadows.lg,
            zIndex: zIndex.dropdown,
            overflow: 'hidden',
          }}
        >
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                onOrgChange?.(org);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: spacing.md,
                textAlign: 'left',
                border: 'none',
                background: org.id === selectedOrg.id ? semanticColors.backgroundSurfaceSecondary : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-sm)',
                color: semanticColors.textPrimary,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (org.id !== selectedOrg.id) {
                  e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (org.id !== selectedOrg.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {org.logo ? (
                <img src={org.logo} alt={org.name} style={{ width: 24, height: 24, borderRadius: radius.sm }} />
              ) : (
                <Avatar name={org.name} size="sm" />
              )}
              <span>{org.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

