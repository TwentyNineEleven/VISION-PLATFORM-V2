import * as React from 'react';
import { cn } from '@/lib/utils';

export type AuthPageShellProps = {
  children: React.ReactNode;
  /**
   * muted - solid soft background color
   * image - full screen background image with subtle overlay
   */
  background?: 'muted' | 'image';
  /**
   * Optional path to an image in /public when using background="image"
   */
  backgroundImageSrc?: string;
  /**
   * Allows callers to tweak the overlay color/opacity on top of the background image
   */
  overlayClassName?: string;
  /**
   * Class names for the inner content wrapper
   */
  contentClassName?: string;
};

export function AuthPageShell({
  children,
  background = 'muted',
  backgroundImageSrc,
  overlayClassName,
  contentClassName,
}: AuthPageShellProps) {
  if (background === 'image') {
    return (
      <div className="relative min-h-screen" data-testid="auth-shell-image">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImageSrc ?? '/assets/images/login-bg.png'})`,
          }}
          aria-hidden="true"
        />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/80 backdrop-blur-[1px]',
            overlayClassName
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'relative flex min-h-screen w-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8',
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-vision-gray-50 px-4 py-10 text-vision-gray-950',
        contentClassName
      )}
      data-testid="auth-shell-muted"
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default AuthPageShell;

