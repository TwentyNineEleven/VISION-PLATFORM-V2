import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { semanticColors, radius, spacing, shadows, zIndex } from '../../theme';
import { Icon } from '../../icons/Icon';
import { Avatar } from '../../components/Avatar';
import { DropdownMenu, DropdownMenuItem } from '../../components/DropdownMenu';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserMenuProps {
  user: User;
  menuItems?: DropdownMenuItem[];
  onLogout?: () => void;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  menuItems = [],
  onLogout,
  className = '',
}) => {
  const defaultItems: DropdownMenuItem[] = [...menuItems];
  defaultItems.push(
    { label: 'Profile', icon: <Icon name="menu" size={16} />, onClick: () => {} },
    { label: 'Settings', icon: <Icon name="menu" size={16} />, onClick: () => {} },
    { divider: true },
    { label: 'Logout', icon: <Icon name="menu" size={16} />, onClick: onLogout }
  );

  return (
    <DropdownMenu
      trigger={
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.xs,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderRadius: radius.sm,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <Icon name="chevronDown" size={16} color={semanticColors.textSecondary} />
        </button>
      }
      items={defaultItems}
      className={className}
    />
  );
};

