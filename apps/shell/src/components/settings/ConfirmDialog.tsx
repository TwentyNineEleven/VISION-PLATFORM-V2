'use client';

import * as React from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton as Button } from '@/components/glow-ui/GlowButton';

interface ConfirmDialogProps {
  title: string;
  description: string;
  triggerLabel: string;
  triggerVariant?: React.ComponentProps<typeof Button>['variant'];
  triggerSize?: React.ComponentProps<typeof Button>['size'];
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
      <Button
        variant={triggerVariant}
        size={triggerSize}
        leftIcon={triggerLeftIcon}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>
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
              <Button variant="outline">Cancel</Button>
            </GlowModalClose>
            <Button
              variant={destructive ? 'destructive' : 'default'}
              glow={destructive ? 'subtle' : 'none'}
              onClick={handleConfirm}
              loading={loading}
            >
              Confirm
            </Button>
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
