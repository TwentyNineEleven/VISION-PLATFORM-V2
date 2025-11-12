'use client';

import * as React from 'react';
import { NavigationSidebar } from '@/components/navigation/NavigationSidebar';
import { DashboardHeader } from '@/components/navigation/DashboardHeader';
import { Map, LayoutDashboard, FileText, Settings, HelpCircle } from 'lucide-react';

const navItems = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        href: '/community-compass',
        exact: true,
    },
    {
        label: 'Assessments',
        icon: FileText,
        href: '/community-compass/assessments',
    },
    {
        label: 'Map View',
        icon: Map,
        href: '/community-compass/map',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/community-compass/settings',
    },
    {
        label: 'Help & Guide',
        icon: HelpCircle,
        href: '/community-compass/help',
    },
];

export default function CommunityCompassLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = React.useState(false);
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    return (
        <div className="flex h-screen w-full bg-background text-foreground">
            <NavigationSidebar
                items={navItems}
                currentPath="/community-compass" // This would ideally be dynamic
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
                organization={{
                    name: 'Community Compass',
                    plan: 'Module',
                }}
                user={{
                    name: 'Demo User',
                    email: 'demo@example.com',
                }}
                onLogout={() => console.log('Logout')}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader
                    theme={theme}
                    onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    notifications={[]}
                    onNotificationClick={() => { }}
                    showSearch
                    showAppSwitcher
                    showNotifications
                    showThemeToggle
                />
                <main className="flex-1 overflow-y-auto bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
