import { Skeleton } from "@/components/ui/skeleton"

export default function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-4">
      {/* Header with name, category and distance */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex items-center mt-1 flex-wrap gap-2">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      {/* Rating */}
      <div className="mb-3 w-full">
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="h-px bg-gray-100 my-3"></div>

      {/* Details section */}
      <div className="space-y-3 mb-3">
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
