"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[3/4] w-full rounded-3xl mb-4" />
      <div className="px-1 space-y-3">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-2/3 rounded-md" />
        </div>
        <Skeleton className="h-8 w-1/4 rounded-md mt-2" />
      </div>
    </div>
  );
}
