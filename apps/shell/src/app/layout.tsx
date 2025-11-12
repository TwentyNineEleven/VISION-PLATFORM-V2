import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
const PostHogProviderWrapper = dynamic(() => import('@/components/PostHogProviderWrapper'), { ssr: false });
// const inter = Inter({ subsets: ['latin'] });


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
      <body className="font-sans">{/* Changed from inter.className to font-sans */}
        <PostHogProviderWrapper>
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
        </PostHogProviderWrapper>
      </body>
    </html>
  );
}
