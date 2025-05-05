import { Skeleton } from "@/components/ui/skeleton"

export default function WeatherInfoSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
      <div className="flex items-center mb-3">
        <Skeleton className="h-14 w-14 rounded-full mr-4" />
        <div className="flex-1">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-md">
        <Skeleton className="h-5 w-48 mb-3" />

        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}
