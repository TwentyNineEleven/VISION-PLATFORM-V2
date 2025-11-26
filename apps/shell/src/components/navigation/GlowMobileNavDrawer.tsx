'use client';

/**
 * Glow UI Mobile Navigation Drawer
 * 
 * Slide-in drawer for mobile devices that reuses the GlowSideNav layout.
 * Opens from the left when hamburger is clicked.
 * Can be closed by:
 * - Tapping the close icon
 * - Tapping the backdrop
 * 
 * Uses the same nav items, icons, and active states as desktop sidebar.
 */

import * as React from 'react';
import FocusTrap from 'focus-trap-react';
import { cn } from '@/lib/utils';
import { GlowSideNav } from './GlowSideNav';
import { NavItem } from '@/lib/nav-config';
import { X } from 'lucide-react';

export interface GlowMobileNavDrawerProps {
  navItems?: NavItem[];
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function GlowMobileNavDrawer({
  navItems,
  open,
  onClose,
  className,
}: GlowMobileNavDrawerProps) {
  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <FocusTrap
        active={open}
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
          onDeactivate: onClose,
        }}
      >
        <div
          className={cn(
            'fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-300 ease-out outline-none',
            open ? 'translate-x-0' : '-translate-x-full',
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-vision-gray-100 transition-colors text-vision-gray-700 hover:text-foreground"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Side Navigation (always expanded in mobile) */}
          <GlowSideNav collapsed={false} navItems={navItems} />
        </div>
        </div>
      </FocusTrap>
    </>
  );
}

