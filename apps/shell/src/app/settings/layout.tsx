'use client';

import React from 'react';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';

export default function SettingsSectionLayout({ children }: { children: React.ReactNode }) {
  return <SettingsLayout sidebar={<SettingsSidebar />}>{children}</SettingsLayout>;
}
