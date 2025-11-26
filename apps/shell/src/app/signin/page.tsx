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
import { createClient } from '@/lib/supabase/client';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    setError(null);

    console.log('🔐 Attempting sign in with:', data.email);

    try {
      const supabase = createClient();

      console.log('📡 Supabase client created');

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log('📨 Sign in response:', {
        success: !signInError,
        error: signInError?.message,
        hasSession: !!signInData?.session,
        hasUser: !!signInData?.user
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        setError(signInError.message || 'Invalid email or password. Please try again.');
        return;
      }

      console.log('✅ Sign in successful, redirecting...');

      // Success! Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('❌ Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell background="image" backgroundImageSrc="/assets/images/login-bg.png">
      <GlowCard
        variant="elevated"
        padding="xl"
        className="w-full max-w-[420px] space-y-6 backdrop-blur-[1px]"
      >
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Login</h1>
          <div className="flex flex-wrap items-center gap-2 text-base text-foreground">
            <span className="font-medium">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
            >
              <span className="font-medium">Register now</span>
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
            placeholder="Enter your email"
            variant={errors.email ? 'error' : 'glow'}
            error={errors.email?.message}
            autoComplete="email"
            disabled={isSubmitting}
          />

          <GlowInput
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            variant={errors.password ? 'error' : 'default'}
            error={errors.password?.message}
            autoComplete="current-password"
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            {isSubmitting ? 'Signing in...' : 'Login'}
          </GlowButton>

          <div className="space-y-3 pt-1">
            <p className="text-center text-base font-medium text-muted-foreground">
              Or continue with:
            </p>
            <AuthSocialButtons disabled={isSubmitting} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            By clicking Login, you agree to our{' '}
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
