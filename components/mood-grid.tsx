"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MoodCard } from "./mood-card"

type Mood = {
  name: string
  emoji: string
  color: string
  hoverColor: string
  activeColor: string
  textColor: string
}

const moods: Mood[] = [
  {
    name: "Peaceful",
    emoji: "😌",
    color: "bg-blue-50 dark:bg-blue-950",
    hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900",
    activeColor: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    name: "Adventurous",
    emoji: "🧗",
    color: "bg-orange-50 dark:bg-orange-950",
    hoverColor: "hover:bg-orange-100 dark:hover:bg-orange-900",
    activeColor: "bg-orange-100 dark:bg-orange-900",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    name: "Social",
    emoji: "🧍",
    color: "bg-purple-50 dark:bg-purple-950",
    hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900",
    activeColor: "bg-purple-100 dark:bg-purple-900",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    name: "Sad",
    emoji: "😔",
    color: "bg-indigo-50 dark:bg-indigo-950",
    hoverColor: "hover:bg-indigo-100 dark:hover:bg-indigo-900",
    activeColor: "bg-indigo-100 dark:bg-indigo-900",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    name: "Hungry",
    emoji: "😋",
    color: "bg-red-50 dark:bg-red-950",
    hoverColor: "hover:bg-red-100 dark:hover:bg-red-900",
    activeColor: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    name: "Energetic",
    emoji: "⚡",
    color: "bg-yellow-50 dark:bg-yellow-950",
    hoverColor: "hover:bg-yellow-100 dark:hover:bg-yellow-900",
    activeColor: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  {
    name: "Creative",
    emoji: "🎨",
    color: "bg-green-50 dark:bg-green-950",
    hoverColor: "hover:bg-green-100 dark:hover:bg-green-900",
    activeColor: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    name: "Relaxed",
    emoji: "🧘",
    color: "bg-teal-50 dark:bg-teal-950",
    hoverColor: "hover:bg-teal-100 dark:hover:bg-teal-900",
    activeColor: "bg-teal-100 dark:bg-teal-900",
    textColor: "text-teal-700 dark:text-teal-300",
  },
  {
    name: "Trip",
    emoji: "✈️",
    color: "bg-cyan-50 dark:bg-cyan-950",
    hoverColor: "hover:bg-cyan-100 dark:hover:bg-cyan-900",
    activeColor: "bg-cyan-100 dark:bg-cyan-900",
    textColor: "text-cyan-700 dark:text-cyan-300",
  },
  {
    name: "Photography",
    emoji: "📸",
    color: "bg-pink-50 dark:bg-pink-950",
    hoverColor: "hover:bg-pink-100 dark:hover:bg-pink-900",
    activeColor: "bg-pink-100 dark:bg-pink-900",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    name: "Inspired",
    emoji: "✨",
    color: "bg-amber-50 dark:bg-amber-950",
    hoverColor: "hover:bg-amber-100 dark:hover:bg-amber-900",
    activeColor: "bg-amber-100 dark:bg-amber-900",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    name: "Romantic",
    emoji: "💖",
    color: "bg-rose-50 dark:bg-rose-950",
    hoverColor: "hover:bg-rose-100 dark:hover:bg-rose-900",
    activeColor: "bg-rose-100 dark:bg-rose-900",
    textColor: "text-rose-700 dark:text-rose-300",
  }
]

export default function MoodGrid() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMood, setLoadingMood] = useState<string | null>(null)
  const [locationStatus, setLocationStatus] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleMoodSelect = async (mood: Mood) => {
    setIsLoading(true)
    setLoadingMood(mood.name)
    setLocationStatus("Detecting your location...")
    setLocationError(null)

    try {
      // Get user's location
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords

      setLocationStatus("Location detected! Finding places...")

      // Navigate to results page with mood and location data
      router.push(`/results?mood=${encodeURIComponent(mood.name)}&lat=${latitude}&lng=${longitude}`)
    } catch (error) {
      console.error("Error getting location:", error)
      setIsLoading(false)
      setLoadingMood(null)
      setLocationStatus(null)

      // Provide more specific error messages
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services in your browser settings and try again.",
            )
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Unable to determine your location. Please try again later.")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please check your connection and try again.")
            break
          default:
            setLocationError("Unable to access your location. Please enable location services and try again.")
        }
      } else {
        setLocationError("Unable to access your location. Please enable location services and try again.")
      }
    }
  }

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0,
      })
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-3 text-foreground">How are you feeling today?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select a mood and we'll find places nearby that match your current vibe
        </p>
      </motion.div>

      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6 text-red-700 dark:text-red-300"
        >
          <p className="text-sm">{locationError}</p>
        </motion.div>
      )}

      {/* {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-4 rounded-lg shadow-sm border border-border mb-6 flex items-center"
        >
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" />
          <div>
            <p className="font-medium text-foreground">{loadingMood}</p>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {locationStatus}
            </p>
          </div>
        </motion.div>
      )} */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((mood, index) => (
          <MoodCard
            key={mood.name}
            {...mood}
            isLoading={isLoading && loadingMood === mood.name}
            isSelected={loadingMood === mood.name}
            onClick={() => handleMoodSelect(mood)}
          />
        ))}
      </div>
    </div>
  )
}
