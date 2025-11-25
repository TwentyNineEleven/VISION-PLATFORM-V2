'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlowButton, GlowCard, GlowInput } from '@/components/glow-ui';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';

// Force dynamic rendering for this page (uses useSearchParams)
export const dynamic = 'force-dynamic';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!token || token === 'invalid') {
        throw new Error('Invalid or expired reset token');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/signin?passwordReset=true');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthPageShell>
        <GlowCard variant="elevated" padding="xl" className="w-full max-w-[420px] space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Password updated!</h1>
            <p className="text-base text-foreground">
              Your password has been reset successfully. You can now sign in with your new details.
            </p>
          </div>

          <GlowButton
            onClick={() => router.push('/signin')}
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
          >
            Go to sign in
          </GlowButton>
        </GlowCard>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <GlowCard variant="elevated" padding="xl" className="w-full max-w-[420px] space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Reset password</h1>
          <p className="text-base text-foreground">Create a new password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              <p>{error}</p>
              {error.toLowerCase().includes('expired') && (
                <Link href="/forgot-password" className="mt-2 inline-block text-primary hover:underline">
                  Request a new reset link
                </Link>
              )}
            </div>
          )}

          <GlowInput
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="New password"
            placeholder="Enter new password"
            variant={errors.password ? 'error' : 'glow'}
            error={errors.password?.message}
            helperText={
              !errors.password && passwordValue
                ? 'Password must include uppercase, lowercase, and numbers.'
                : undefined
            }
            autoComplete="new-password"
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <GlowInput
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm password"
            placeholder="Repeat your password"
            variant={errors.confirmPassword ? 'error' : 'default'}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="transition-colors hover:text-foreground"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <div className="rounded-md border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium text-foreground">Password requirements:</p>
            <ul className="mt-2 list-disc space-y-1 text-sm text-muted-foreground pl-5">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          <GlowButton
            type="submit"
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Updating password...' : 'Confirm'}
          </GlowButton>

          <div className="flex items-center justify-center">
            <Link
              href="/signin"
              className="flex items-center gap-2 text-base font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ChevronLeft className="h-5 w-5" />
              Return back
            </Link>
          </div>
        </form>
      </GlowCard>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
