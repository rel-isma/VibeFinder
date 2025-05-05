import WeatherInfoSkeleton from "@/components/weather-info-skeleton"
import PlaceCardSkeleton from "@/components/place-card-skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 bg-background border border-border rounded-full shadow-sm hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Loading Places...</h1>
        </div>

        {/* Weather skeleton */}
        <WeatherInfoSkeleton />

        {/* Loading message */}
        <div className="flex items-center mb-4 mt-6">
          <div className="h-4 w-4 rounded-full bg-primary/60 animate-pulse mr-2"></div>
          <p className="text-sm font-medium text-foreground">Finding the perfect places for you...</p>
        </div>

        {/* Place card skeletons */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <PlaceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  )
}
