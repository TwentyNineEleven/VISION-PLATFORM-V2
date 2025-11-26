'use client';

import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/lib/queryClient';

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [queryClient] = React.useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
