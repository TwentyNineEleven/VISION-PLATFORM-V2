'use client';

import * as React from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';

interface ConfirmDialogProps {
  title: string;
  description: string;
  triggerLabel: string;
  triggerVariant?: React.ComponentProps<typeof GlowButton>['variant'];
  triggerSize?: React.ComponentProps<typeof GlowButton>['size'];
  triggerLeftIcon?: React.ReactNode;
  triggerClassName?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  triggerLabel,
  triggerVariant = 'destructive',
  triggerSize,
  triggerLeftIcon,
  triggerClassName,
  onConfirm,
  destructive = true,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await Promise.resolve(onConfirm());
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <GlowButton
        variant={triggerVariant}
        size={triggerSize}
        leftIcon={triggerLeftIcon}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </GlowButton>
      <GlowModal
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        size="md"
        closeOnOverlayClick
        footer={
          <>
            <GlowModalClose asChild>
              <GlowButton variant="outline">Cancel</GlowButton>
            </GlowModalClose>
            <GlowButton
              variant={destructive ? 'destructive' : 'default'}
              glow={destructive ? 'subtle' : 'none'}
              onClick={handleConfirm}
              loading={loading}
            >
              Confirm
            </GlowButton>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Please confirm to continue.
        </p>
      </GlowModal>
    </>
  );
}
