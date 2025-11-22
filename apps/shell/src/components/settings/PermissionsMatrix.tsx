'use client';

import * as React from 'react';
import { GlowBadge } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

interface PermissionsMatrixProps {
  roles?: string[];
  permissions?: { key: string; label: string; description?: string }[];
}

const DEFAULT_ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const DEFAULT_PERMISSIONS: PermissionsMatrixProps['permissions'] = [
  { key: 'manageBilling', label: 'Billing & plans' },
  { key: 'manageTeam', label: 'Invite & manage team' },
  { key: 'configureApps', label: 'Configure applications' },
  { key: 'editContent', label: 'Create & edit content' },
  { key: 'viewOnly', label: 'View data & reports' },
];

const ROLE_MATRIX: Record<string, Record<string, boolean>> = {
  Owner: {
    manageBilling: true,
    manageTeam: true,
    configureApps: true,
    editContent: true,
    viewOnly: true,
  },
  Admin: {
    manageBilling: true,
    manageTeam: true,
    configureApps: true,
    editContent: true,
    viewOnly: true,
  },
  Editor: {
    manageBilling: false,
    manageTeam: false,
    configureApps: true,
    editContent: true,
    viewOnly: true,
  },
  Viewer: {
    manageBilling: false,
    manageTeam: false,
    configureApps: false,
    editContent: false,
    viewOnly: true,
  },
};

export function PermissionsMatrix({
  roles = DEFAULT_ROLES,
  permissions = DEFAULT_PERMISSIONS,
}: PermissionsMatrixProps) {
  const resolvedRoles: string[] = roles ?? DEFAULT_ROLES;
  const resolvedPermissions = (permissions ?? DEFAULT_PERMISSIONS) as {
    key: string;
    label: string;
    description?: string;
  }[];

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[1.2fr,repeat(4,1fr)] bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
        <span>Permission</span>
        {resolvedRoles.map((role) => (
          <span key={role} className="text-center text-foreground">
            {role}
          </span>
        ))}
      </div>
      <div className="divide-y divide-border">
        {resolvedPermissions.map((permission) => (
          <div key={permission.key} className="grid grid-cols-[1.2fr,repeat(4,1fr)] items-center px-4 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{permission.label}</p>
              {permission.description && (
                <p className="text-xs text-muted-foreground">{permission.description}</p>
              )}
            </div>
            {resolvedRoles.map((role) => {
              const allowed = ROLE_MATRIX[role]?.[permission.key];
              return (
                <div key={role} className={cn('flex justify-center')}>
                  <GlowBadge variant={allowed ? 'success' : 'outline'} size="sm">
                    {allowed ? 'Allowed' : 'View'}
                  </GlowBadge>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
