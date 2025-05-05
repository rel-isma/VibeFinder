"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
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
    </div>
  )
}
