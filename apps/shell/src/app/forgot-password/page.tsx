'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlowButton, GlowCard, GlowInput } from '@/components/glow-ui';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { ChevronLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendEmail = async () => {
    const email = submittedEmail || getValues('email');
    if (!email) {
      return;
    }

    await onSubmit({ email });
  };

  if (isSuccess) {
    return (
      <AuthPageShell>
        <GlowCard variant="elevated" padding="xl" className="w-full max-w-[420px] space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
            <p className="text-base text-foreground">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-semibold">{submittedEmail}</span>. Follow the instructions to
              create a new password.
            </p>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t see it? Check your spam folder or resend the email below.
            </p>
          </div>

          <GlowButton
            onClick={() => router.push('/signin')}
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
          >
            Back to sign in
          </GlowButton>

          <button
            type="button"
            onClick={() => void resendEmail()}
            disabled={isSubmitting}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-60"
          >
            Didn&apos;t receive the email? Resend
          </button>
        </GlowCard>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <GlowCard variant="elevated" padding="xl" className="w-full max-w-[420px] space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Forgot password</h1>
          <p className="text-base text-foreground">
            Please enter your email address. You will receive a link to create a new password via
            email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <GlowInput
            {...register('email')}
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant={errors.email ? 'error' : 'glow'}
            error={errors.email?.message}
            helperText="If you don’t remember your email please contact support."
            autoComplete="email"
            disabled={isSubmitting}
          />

          <GlowButton
            type="submit"
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
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

