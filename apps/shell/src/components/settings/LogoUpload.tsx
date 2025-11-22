'use client';

import * as React from 'react';
import { GlowButton, GlowCard } from '@/components/glow-ui';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface LogoUploadProps {
  value?: string;
  onChange?: (value?: string) => void;
  label?: string;
  helperText?: string;
}

export function LogoUpload({ value, onChange, label = 'Organization logo', helperText }: LogoUploadProps) {
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
      <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Logo preview" className="h-full w-full object-contain" />
        ) : (
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {helperText || 'Upload a transparent PNG or SVG. Max 2MB.'}
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
            <GlowButton type="button" size="sm" variant="ghost" onClick={() => { setPreview(undefined); onChange?.(undefined); }}>
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
