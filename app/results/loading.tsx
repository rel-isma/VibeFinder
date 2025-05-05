"use client"

import WeatherInfoSkeleton from "@/components/weather-info-skeleton"
import PlaceCardSkeleton from "@/components/place-card-skeleton"
import { Home, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header with enhanced Back to Home button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-sm hover:bg-muted transition-colors"
          >
            <div className="relative w-8 h-8">
              <img src="/VibeFinder.png" alt="VibeFinder Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-medium text-foreground">VibeFinder</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Loading Places...</h1>
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
          {Array.from({ length: 10 }).map((_, index) => (
            <PlaceCardSkeleton key={index} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <Button variant="outline" disabled className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

          <Button variant="outline" disabled className="flex items-center gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Fixed Back to Home Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Home</span>
        </Link>
      </motion.div>
    </main>
  )
}
