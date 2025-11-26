/**
 * Loading state for methods library
 */

import { MethodCardSkeleton } from '../components/EngagementCardSkeleton';

export default function MethodsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Filter Skeleton */}
      <div className="flex flex-wrap gap-2 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
        ))}
      </div>

      {/* Methods Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <MethodCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
