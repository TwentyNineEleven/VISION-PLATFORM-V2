'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { GlowButton } from './glow-ui/GlowButton';
import { GlowCard } from './glow-ui/GlowCard';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors to Sentry, and displays a fallback UI.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * With custom fallback:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
          <GlowCard className="max-w-2xl w-full p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-vision-red-50">
                <AlertTriangle className="w-8 h-8 text-vision-red-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-vision-gray-900">
                  Something went wrong
                </h1>
                <p className="text-vision-gray-600 mt-1">
                  We’ve been notified and are working to fix the issue.
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-vision-red-50 border border-vision-red-200 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-vision-red-900">Error Details</h3>
                <p className="text-sm text-vision-red-800 font-mono">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-sm text-vision-red-700">
                    <summary className="cursor-pointer font-semibold">
                      Component Stack
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <GlowButton
                variant="default"
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </GlowButton>
              <GlowButton
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </GlowButton>
            </div>

            <div className="text-sm text-vision-gray-500">
              <p>
                If this problem persists, please contact support with the error
                reference ID from your browser console.
              </p>
            </div>
          </GlowCard>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
