"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      {/* Back to Home button with logo */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-sm hover:bg-muted transition-colors"
        >
          <div className="relative w-8 h-8">
            <img src="/VibeFinder.png" alt="VibeFinder Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-medium text-foreground">VibeFinder</span>
        </Link>
      </div>
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-foreground">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">{error.message || "An unexpected error occurred"}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Try again
          </button>
          <Link href="/" className="border border-input bg-background px-4 py-2 rounded-md">
            Go back home
          </Link>
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
    </div>
  )
}
