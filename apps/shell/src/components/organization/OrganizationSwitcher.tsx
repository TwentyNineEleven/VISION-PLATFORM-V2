'use client';

import React, { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { Check, ChevronDown, Building2, Plus } from 'lucide-react';

interface OrganizationSwitcherProps {
  onCreateNew?: () => void;
  className?: string;
}

export function OrganizationSwitcher({ onCreateNew, className = '' }: OrganizationSwitcherProps) {
  const {
    activeOrganization,
    userOrganizations,
    switchOrganization,
    currentRole,
    isLoading,
  } = useOrganization();

  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (orgId: string) => {
    if (orgId === activeOrganization?.id) {
      setIsOpen(false);
      return;
    }

    try {
      setIsSwitching(true);
      await switchOrganization(orgId);
      setIsOpen(false);
      // Optionally reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch organization:', error);
      // TODO: Show error toast
    } finally {
      setIsSwitching(false);
    }
  };

  const handleCreateNew = () => {
    setIsOpen(false);
    onCreateNew?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vulcan-800/50 animate-pulse">
        <div className="w-6 h-6 rounded bg-vulcan-700" />
        <div className="w-32 h-4 rounded bg-vulcan-700" />
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <button
        onClick={handleCreateNew}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vulcan-800/50 hover:bg-vulcan-800 transition-colors"
      >
        <Plus className="w-4 h-4 text-glow-400" />
        <span className="text-sm font-medium text-white">Create Organization</span>
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vulcan-800/50 hover:bg-vulcan-800 transition-colors w-full min-w-[200px] group"
      >
        {/* Organization Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-glow-500 to-glow-600 flex items-center justify-center">
          {activeOrganization.logo ? (
            <img
              src={activeOrganization.logo}
              alt={activeOrganization.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Building2 className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Organization Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {activeOrganization.name}
          </div>
          {currentRole && (
            <div className="text-xs text-gray-400">
              {currentRole}
            </div>
          )}
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          } ${isSwitching ? 'animate-spin' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-vulcan-900 border border-vulcan-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Organizations List */}
            <div className="max-h-[300px] overflow-y-auto">
              {userOrganizations.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No organizations found
                </div>
              ) : (
                userOrganizations.map((org) => {
                  const isActive = org.id === activeOrganization?.id;
                  
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSwitch(org.id)}
                      disabled={isSwitching}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-vulcan-800 transition-colors ${
                        isActive ? 'bg-vulcan-800/50' : ''
                      } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Organization Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-glow-500 to-glow-600 flex items-center justify-center">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Organization Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {org.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {org.role}
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <Check className="w-4 h-4 text-glow-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Create New Organization */}
            {onCreateNew && (
              <>
                <div className="border-t border-vulcan-700" />
                <button
                  onClick={handleCreateNew}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-vulcan-800 transition-colors text-glow-400"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Create New Organization</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact version for mobile/narrow spaces
 */
export function OrganizationSwitcherCompact({ onCreateNew, className = '' }: OrganizationSwitcherProps) {
  const { activeOrganization, isLoading } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !activeOrganization) {
    return (
      <button className="w-10 h-10 rounded-lg bg-vulcan-800/50 animate-pulse" />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-gradient-to-br from-glow-500 to-glow-600 flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {activeOrganization.logo ? (
          <img
            src={activeOrganization.logo}
            alt={activeOrganization.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Building2 className="w-5 h-5 text-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-vulcan-900 border border-vulcan-700 rounded-lg shadow-xl z-50">
            <OrganizationSwitcher onCreateNew={onCreateNew} />
          </div>
        </>
      )}
    </div>
  );
}
