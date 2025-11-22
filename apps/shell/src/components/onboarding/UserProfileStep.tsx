'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { GlowInput, GlowButton, GlowCard } from '@/components/glow-ui';
import { Upload, User } from 'lucide-react';
import type { OnboardingFormValues } from './types';

export function UserProfileStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<OnboardingFormValues>();

  const avatar = watch('avatar');
  const [preview, setPreview] = React.useState<string | undefined>(avatar);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString();
      if (result) {
        setPreview(result);
        setValue('avatar', result, { shouldValidate: false, shouldDirty: true });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <GlowInput
            {...register('displayName')}
            label="Display name"
            placeholder="Taylor Kim"
            variant={errors.displayName ? 'error' : 'glow'}
            error={errors.displayName?.message}
            leftIcon={<User className="h-4 w-4" />}
          />
          <GlowInput
            {...register('title')}
            label="Title / Role"
            placeholder="Program Director"
            variant={errors.title ? 'error' : 'glow'}
            error={errors.title?.message}
          />
        </div>

        <GlowInput
          {...register('phone')}
          label="Phone number"
          placeholder="+1 (555) 123-4567"
          helperText="Optional"
        />
      </div>

      <GlowCard variant="flat" padding="md" className="flex flex-col items-center justify-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full ring-2 ring-primary/30" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-foreground">Profile photo</p>
          <p className="text-xs text-muted-foreground">
            Upload a square image (JPG or PNG) to personalize your profile.
          </p>
        </div>
        <label className="w-full">
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <GlowButton type="button" variant="outline" className="w-full" leftIcon={<Upload className="h-4 w-4" />}>
            Upload avatar
          </GlowButton>
        </label>
      </GlowCard>
    </div>
  );
}
