import React, { ReactNode, CSSProperties, useState } from 'react';
import { SidebarNav, NavItem } from './SidebarNav';
import { TopBar, TopBarProps } from './TopBar';

export interface AppShellProps {
  sidebarItems: NavItem[];
  onSidebarItemClick?: (item: NavItem) => void;
  sidebarLogo?: ReactNode;
  sidebarFooter?: ReactNode;
  topBarProps?: TopBarProps;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const AppShell: React.FC<AppShellProps> = ({
  sidebarItems,
  onSidebarItemClick,
  sidebarLogo,
  sidebarFooter,
  topBarProps,
  children,
  className = '',
  style,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const shellStyle: CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    ...style,
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const contentAreaStyle: CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--spacing-3xl)',
  };

  return (
    <div className={className} style={shellStyle}>
      <SidebarNav
        items={sidebarItems}
        onItemClick={onSidebarItemClick}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        logo={sidebarLogo}
        footer={sidebarFooter}
      />
      <div style={mainContentStyle}>
        {topBarProps && <TopBar {...topBarProps} />}
        <main id="main-content" style={contentAreaStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};

