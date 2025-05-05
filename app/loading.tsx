import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-md text-center mb-8 mt-8">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </header>

      <div className="w-full max-w-md">
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-5 w-80 mb-6" />

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  )
}
