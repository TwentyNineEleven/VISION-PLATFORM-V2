'use client';

import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import type { ReactNode } from 'react';

export function PostHogProviderWrapper({ children }: { children: ReactNode }) {
    return <PostHogProvider>{children}</PostHogProvider>;
}

export default PostHogProviderWrapper;
