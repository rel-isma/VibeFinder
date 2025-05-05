import { HeroSection } from "@/components/hero-section"
import MoodGrid from "@/components/mood-grid"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function MoodGridSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-3" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 sm:h-32 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="py-8 md:py-12">
        <Suspense fallback={<MoodGridSkeleton />}>
          <MoodGrid />
        </Suspense>
      </section>
    </main>
  )
}
