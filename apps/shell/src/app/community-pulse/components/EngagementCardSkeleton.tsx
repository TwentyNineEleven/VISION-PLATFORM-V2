/**
 * Skeleton loading state for engagement cards
 */

export function EngagementCardSkeleton() {
  return (
    <div className="flex items-center justify-between px-6 py-4 animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="flex items-center gap-3 mt-1">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-white shadow animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <EngagementCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg bg-white shadow animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-lg bg-white shadow">
        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
        <div className="flex gap-3">
          <div className="h-10 w-20 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function MethodCardSkeleton() {
  return (
    <div className="p-6 rounded-lg bg-white shadow animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-3 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
