'use client';

import * as React from 'react';
import { GlowButton, GlowCard } from '@/components/glow-ui';
import { UploadCloud, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: string;
  onChange?: (value?: string) => void;
  label?: string;
  helperText?: string;
}

export function AvatarUpload({ value, onChange, label = 'Avatar', helperText }: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | undefined>(value);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result?.toString();
      setPreview(data);
      onChange?.(data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <GlowCard variant="flat" padding="md" className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <User className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {helperText || 'Upload a square image (JPG or PNG). Max 2MB.'}
        </p>
        <div className="flex gap-2">
          <GlowButton
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<UploadCloud className="h-4 w-4" />}
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </GlowButton>
          {preview && (
            <GlowButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setPreview(undefined);
                onChange?.(undefined);
              }}
            >
              Remove
            </GlowButton>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </GlowCard>
  );
}
