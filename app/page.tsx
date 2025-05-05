import { HeroSection } from "@/components/hero-section"
import MoodGrid from "@/components/mood-grid"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function MoodGridSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-3" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="py-12 md:py-16">
        <Suspense fallback={<MoodGridSkeleton />}>
          <MoodGrid />
        </Suspense>
      </section>
    </main>
  )
}
