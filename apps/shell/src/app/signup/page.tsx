'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GlowButton, GlowCard, GlowInput, GlowSwitch } from '@/components/glow-ui';
import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';

const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.push('/signin?registered=true');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell>
      <GlowCard variant="elevated" padding="xl" className="w-full max-w-[420px] space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
          <div className="flex flex-wrap items-center gap-2 text-base text-foreground">
            <span className="font-medium">Already a member?</span>
            <Link href="/signin" className="flex items-center gap-1 text-primary hover:text-primary/80">
              <span className="font-medium">Login</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
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
            placeholder="Your email"
            variant={errors.email ? 'error' : 'glow'}
            error={errors.email?.message}
            autoComplete="email"
            disabled={isSubmitting}
          />

          <GlowInput
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Create a password"
            variant={errors.password ? 'error' : 'default'}
            error={errors.password?.message}
            helperText={
              !errors.password && passwordValue
                ? 'Use at least 8 characters, including uppercase, lowercase, and numbers.'
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
            placeholder="Confirm your password"
            variant={errors.confirmPassword ? 'error' : 'default'}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="transition-colors hover:text-foreground"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <GlowSwitch
              checked={watch('rememberMe')}
              onCheckedChange={(checked) => setValue('rememberMe', checked)}
              label="Remember me"
              disabled={isSubmitting}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>

          <GlowButton
            type="submit"
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </GlowButton>

          <div className="space-y-3 pt-1">
            <p className="text-center text-base font-medium text-muted-foreground">
              Or continue with:
            </p>
            <AuthSocialButtons disabled={isSubmitting} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            By clicking Register, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      </GlowCard>
    </AuthPageShell>
  );
}
