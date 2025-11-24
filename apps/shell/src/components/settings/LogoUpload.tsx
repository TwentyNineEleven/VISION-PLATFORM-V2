'use client';

import * as React from 'react';
import { GlowButton, GlowCard } from '@/components/glow-ui';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface LogoUploadProps {
  value?: string;
  onChange?: (file: File) => void | Promise<void>;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function LogoUpload({ value, onChange, label = 'Organization logo', helperText, disabled, isLoading }: LogoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file || !onChange) return;
    await onChange(file);
  };

  return (
    <GlowCard variant="flat" padding="md" className="flex items-center gap-4">
      <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Logo preview" className="h-full w-full object-contain" />
        ) : (
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {helperText || 'Upload a transparent PNG or SVG. Max 5MB.'}
        </p>
        <div className="flex gap-2">
          <GlowButton
            type="button"
            size="sm"
            variant="outline"
            leftIcon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </GlowButton>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={disabled || isLoading}
      />
    </GlowCard>
  );
}
