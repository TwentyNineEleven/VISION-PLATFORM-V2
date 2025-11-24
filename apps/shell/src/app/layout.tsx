import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VISION Platform',
  description: 'Comprehensive SaaS suite for nonprofit organizations',
  keywords: ['nonprofit', 'capacity building', 'grant writing', 'saas'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>
          <ErrorBoundary>
            <AppShell>{children}</AppShell>
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
              duration={4000}
              toastOptions={{
                classNames: {
                  toast: 'border border-border bg-background text-foreground',
                  title: 'text-foreground font-semibold',
                  description: 'text-muted-foreground',
                  actionButton: 'bg-primary text-primary-foreground',
                  cancelButton: 'bg-muted text-muted-foreground',
                  closeButton: 'bg-background border-border text-foreground hover:bg-muted',
                },
              }}
            />
          </ErrorBoundary>
        </PostHogProvider>
      </body>
    </html>
  );
}
