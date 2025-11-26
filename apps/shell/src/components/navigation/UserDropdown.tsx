'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';
import { 
  Building2, 
  Check, 
  ChevronDown, 
  Settings, 
  Users, 
  LogOut,
  User,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserDropdownProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
    initials?: string;
  };
  onSignOut?: () => void;
  className?: string;
}

export function UserDropdown({ user, onSignOut, className }: UserDropdownProps) {
  const router = useRouter();
  const {
    activeOrganization,
    userOrganizations,
    switchOrganization,
    currentRole,
    isLoading,
  } = useOrganization();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSwitch = async (orgId: string) => {
    if (orgId === activeOrganization?.id) {
      setIsOpen(false);
      return;
    }

    try {
      setIsSwitching(true);
      await switchOrganization(orgId);
      setIsOpen(false);
      // Reload to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch organization:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut?.();
  };

  const userInitials = user.initials || 
    (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U');

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{userInitials}</span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                {user.avatar ?
 (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Organization */}
          {!isLoading && activeOrganization && (
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">Current Organization</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {activeOrganization.logo ? (
                    <Image
                      src={activeOrganization.logo}
                      alt={activeOrganization.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Building2 className="w-3 h-3 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activeOrganization.name}
                  </p>
                  {currentRole && (
                    <p className="text-xs text-muted-foreground">{currentRole}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Organization Switcher */}
          {!isLoading && userOrganizations.length > 1 && (
            <div className="border-b border-border">
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Switch Organization</p>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {userOrganizations.map((org) => {
                  const isActive = org.id === activeOrganization?.id;
                  
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSwitch(org.id)}
                      disabled={isSwitching || isActive}
                      className={cn(
                        'w-full flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors text-left',
                        isActive && 'bg-muted/50',
                        isSwitching && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {org.logo ? (
                          <Image
                            src={org.logo}
                            alt={org.name}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Building2 className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.role}</p>
                      </div>
                      {isActive && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/settings/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-foreground"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Profile Settings</span>
            </Link>
            
            {activeOrganization && (
              <>
                <Link
                  href="/settings/organization"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-foreground"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Organization Settings</span>
                </Link>
                
                <Link
                  href="/settings/team"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-foreground"
                >
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Team Management</span>
                </Link>
              </>
            )}
          </div>

          {/* Sign Out */}
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
