'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GlowButton, GlowInput, GlowCard } from '../glow-ui';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * Login Form Validation Schema
 */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Form Props
 */
export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  error?: string;
}

/**
 * Login Form Component
 * Beautiful, accessible login form with glow effects
 */
export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  loading = false,
  error,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center shadow-glow-primary text-white">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to access the VISION Platform
        </p>
      </div>

      {/* Login Card */}
      <GlowCard variant="elevated" padding="lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 shadow-glow-error-sm">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <GlowInput
            {...register('email')}
            type="email"
            label="Email Address"
            placeholder="you@organization.org"
            variant={errors.email ? 'error' : 'glow'}
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            disabled={isSubmitting || loading}
          />

          {/* Password Input */}
          <div className="space-y-2">
            <GlowInput
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              variant={errors.password ? 'error' : 'glow'}
              error={errors.password?.message}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
              disabled={isSubmitting || loading}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all cursor-pointer"
                disabled={isSubmitting || loading}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isSubmitting || loading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <GlowButton
            type="submit"
            variant="default"
            size="lg"
            glow="medium"
            className="w-full"
            loading={isSubmitting || loading}
            rightIcon={!isSubmitting && !loading && <ArrowRight className="h-4 w-4" />}
          >
            {isSubmitting || loading ? 'Signing in...' : 'Sign In'}
          </GlowButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <GlowButton
              type="button"
              variant="outline"
              size="default"
              disabled={isSubmitting || loading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </GlowButton>

            <GlowButton
              type="button"
              variant="outline"
              size="default"
              disabled={isSubmitting || loading}
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </GlowButton>
          </div>
        </form>
      </GlowCard>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button
          onClick={onSignUp}
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Sign up for free
        </button>
      </p>
    </div>
  );
}
