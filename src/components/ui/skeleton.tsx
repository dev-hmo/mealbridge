interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-xl ${className}`}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
