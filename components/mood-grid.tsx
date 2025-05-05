"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Loader2, MapPin } from "lucide-react"

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
    color: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    activeColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    name: "Adventurous",
    emoji: "🧗",
    color: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
    activeColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    name: "Social",
    emoji: "🧍",
    color: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    activeColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    name: "Sad",
    emoji: "😔",
    color: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
    activeColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    name: "Hungry",
    emoji: "😋",
    color: "bg-red-50",
    hoverColor: "hover:bg-red-100",
    activeColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    name: "Energetic",
    emoji: "⚡",
    color: "bg-yellow-50",
    hoverColor: "hover:bg-yellow-100",
    activeColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  {
    name: "Creative",
    emoji: "🎨",
    color: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    activeColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    name: "Relaxed",
    emoji: "🧘",
    color: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    activeColor: "bg-teal-100",
    textColor: "text-teal-700",
  },
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
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-900">How are you feeling today?</h2>
      <p className="text-gray-600 mb-6">Select a mood to discover places that match your vibe</p>

      {locationError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <p className="text-red-700 text-sm">{locationError}</p>
        </div>
      )}

      {isLoading && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex items-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" />
          <div>
            <p className="font-medium text-gray-900">{loadingMood}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {locationStatus}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {moods.map((mood) => (
          <motion.button
            key={mood.name}
            className={`${mood.color} ${mood.hoverColor} rounded-lg p-6 flex flex-col items-center justify-center h-32 transition-colors shadow-sm border border-gray-100 relative ${mood.textColor}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97, backgroundColor: mood.activeColor }}
            onClick={() => handleMoodSelect(mood)}
            disabled={isLoading}
          >
            {isLoading && loadingMood === mood.name ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <span className="text-4xl mb-2">{mood.emoji}</span>
                <span className="font-medium">{mood.name}</span>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
