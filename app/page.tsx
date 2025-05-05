import MoodGrid from "@/components/mood-grid"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-md text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">WhereToGo?</h1>
        <p className="text-gray-600 mt-2">Find places that match your mood and the weather</p>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <MoodGrid />
      </Suspense>
    </main>
  )
}
