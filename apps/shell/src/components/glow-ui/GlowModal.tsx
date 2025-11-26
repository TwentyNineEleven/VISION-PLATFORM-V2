'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { GlowButton } from './GlowButton';
import { X } from 'lucide-react';

/**
 * Glow Modal Props
 */
export interface GlowModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

/**
 * Glow Modal Component
 * Beautiful modal dialog with glow effects and animations
 */
export function GlowModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeButton = true,
  closeOnOverlayClick = true,
  className,
}: GlowModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'
          )}
          onClick={closeOnOverlayClick ? () => onOpenChange?.(false) : undefined}
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            'rounded-lg border border-border bg-card shadow-ambient-elevated',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
            sizeClasses[size],
            className
          )}
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault();
            }
          }}
        >
          {/* Header */}
          {(title || description || closeButton) && (
            <div className="flex flex-col space-y-1.5 px-6 py-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="text-sm text-muted-foreground mt-2">
                      {description}
                    </Dialog.Description>
                  )}
                </div>

                {closeButton && (
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        'rounded-sm opacity-70 ring-offset-background transition-opacity',
                        'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'disabled:pointer-events-none'
                      )}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Glow Modal Trigger
 * Button to open the modal
 */
export const GlowModalTrigger = Dialog.Trigger;

/**
 * Glow Modal Close
 * Component to close the modal
 */
export const GlowModalClose = Dialog.Close;

/**
 * Example Usage Component
 */
export function ExampleModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <GlowModal
      open={open}
      onOpenChange={setOpen}
      title="Confirm Action"
      description="This action cannot be undone. Are you sure you want to continue?"
      size="md"
      footer={
        <>
          <GlowModalClose asChild>
            <GlowButton variant="outline">Cancel</GlowButton>
          </GlowModalClose>
          <GlowButton variant="default" glow="medium">
            Confirm
          </GlowButton>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This is the modal content. You can put any content here including
          forms, images, or other components.
        </p>
      </div>
    </GlowModal>
  );
}
