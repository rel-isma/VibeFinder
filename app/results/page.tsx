"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, RefreshCw, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"
import PlaceCard from "@/components/place-card"
import WeatherInfo from "@/components/weather-info"
import PlaceCardSkeleton from "@/components/place-card-skeleton"
import WeatherInfoSkeleton from "@/components/weather-info-skeleton"

// Enhanced type definitions
type Place = {
  place_id: string
  name: string
  types: string[]
  vicinity: string
  formatted_address?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: Array<{
    photo_reference: string
    width: number
    height: number
  }>
  opening_hours?: {
    open_now: boolean | null
    weekday_text?: string[]
    periods?: Array<{
      open: { day: number; time: string }
      close: { day: number; time: string }
    }>
    isOpen?: () => boolean | undefined
  }
  formatted_phone_number?: string
  website?: string
  rating?: number
  price_level?: number
  distance?: number
  user_ratings_total?: number
}

type Weather = {
  main: {
    temp: number
    humidity?: number
    feels_like?: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind?: {
    speed?: number
  }
  name: string
  sys?: {
    country?: string
  }
}

type ErrorType = "location" | "api" | "weather" | "no_results" | "maps"

interface AppError {
  type: ErrorType
  message: string
  retryable?: boolean
}

// Improved mood to Google place type mapping
const moodGoogleTypes: Record<string, string[]> = {
  Peaceful: ["park", "library", "book_store", "spa"],
  Adventurous: ["tourist_attraction", "amusement_park", "museum"],
  Social: ["cafe", "bar", "restaurant"],
  Sad: ["cafe", "book_store", "art_gallery", "museum"], // Fixed sad mood types
  Hungry: ["restaurant", "cafe", "bakery"],
  Energetic: ["gym", "park", "stadium"],
  Creative: ["art_gallery", "museum", "library"],
  Relaxed: ["spa", "park", "cafe"],
}

// Fallback types if specific mood types fail
const fallbackTypes = ["restaurant", "cafe", "park", "shopping_mall", "tourist_attraction"]

// Declare google variable
declare global {
  interface Window {
    google?: any
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mood = searchParams.get("mood")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  const [places, setPlaces] = useState<Place[]>([])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loadingPhase, setLoadingPhase] = useState<"maps" | "weather" | "places" | "done">("maps")
  const [error, setError] = useState<AppError | null>(null)
  const [searchRadius, setSearchRadius] = useState(5000)
  const [retryCount, setRetryCount] = useState(0)
  const [usedFallback, setUsedFallback] = useState(false)

  // Enhanced Google Maps loader with timeout and retry
  const loadGoogleMaps = async (): Promise<void> => {
    if (window.google?.maps?.places) return Promise.resolve()

    return new Promise((resolve, reject) => {
      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkGoogleExists = setInterval(() => {
          if (window.google?.maps?.places) {
            clearInterval(checkGoogleExists)
            resolve()
          }
        }, 100)

        // Set a timeout in case Google never loads
        setTimeout(() => {
          clearInterval(checkGoogleExists)
          reject(new Error("Google Maps loading timeout"))
        }, 10000)

        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true

      const timeoutId = setTimeout(() => {
        reject(new Error("Google Maps loading timeout"))
      }, 10000)

      script.onload = () => {
        clearTimeout(timeoutId)
        resolve()
      }

      script.onerror = () => {
        clearTimeout(timeoutId)
        reject(new Error("Failed to load Google Maps"))
      }

      document.head.appendChild(script)
    })
  }

  // Calculate distance with proper typing
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  // Fetch weather with error typing
  const fetchWeather = async (): Promise<Weather> => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`,
      )
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
      return await res.json()
    } catch (err) {
      console.error("Weather fetch error:", err)
      throw {
        type: "weather" as const,
        message: "Failed to fetch weather data",
        retryable: true,
      }
    }
  }

  // Fetch places with proper typing and error handling
  const fetchPlaces = async (types: string[], radius: number): Promise<google.maps.places.PlaceResult[]> => {
    try {
      if (!window.google?.maps?.places) {
        throw new Error("Google Maps Places API not loaded")
      }

      const service = new google.maps.places.PlacesService(document.createElement("div"))

      if (!service) {
        throw new Error("Failed to create Places service")
      }

      const location = new google.maps.LatLng(Number(lat), Number(lng))
      console.log(`Searching for place types: ${types.join(", ")} within ${radius}m`)

      // Use Promise.allSettled to handle partial failures
      const requests = types.map(
        (type) =>
          new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
            try {
              service.nearbySearch(
                {
                  location,
                  radius,
                  type: type as google.maps.places.PlaceType,
                },
                (results, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    console.log(`Found ${results.length} places for type: ${type}`)
                    resolve(results)
                  } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    console.log(`No results for type: ${type}`)
                    resolve([])
                  } else {
                    console.error(`Places API error for type ${type}:`, status)
                    reject(new Error(`Places API error: ${status}`))
                  }
                },
              )
            } catch (err) {
              console.error(`Error in nearbySearch for type ${type}:`, err)
              reject(err)
            }
          }),
      )

      const results = await Promise.allSettled(requests)

      // Filter out successful results and flatten the array
      const places = results
        .filter(
          (result): result is PromiseFulfilledResult<google.maps.places.PlaceResult[]> => result.status === "fulfilled",
        )
        .flatMap((result) => result.value)

      // If we got some results but not from all types, that's still a success
      if (places.length > 0) {
        return places
      }

      // If all requests failed, throw an error
      if (results.every((result) => result.status === "rejected")) {
        throw new Error("All place type requests failed")
      }

      return places
    } catch (err) {
      console.error("Error fetching places:", err)
      throw {
        type: "api" as const,
        message: err instanceof Error ? err.message : "Failed to fetch places",
        retryable: true,
      }
    }
  }

  // Get place details with proper opening hours handling
  const getPlaceDetails = async (place: google.maps.places.PlaceResult): Promise<Place | null> => {
    return new Promise((resolve) => {
      try {
        if (!window.google?.maps?.places || !place.place_id) {
          console.error("Missing Google Maps or place_id")
          return resolve(null)
        }

        const service = new google.maps.places.PlacesService(document.createElement("div"))

        service.getDetails(
          {
            placeId: place.place_id,
            fields: [
              "name",
              "geometry",
              "photos",
              "formatted_phone_number",
              "opening_hours",
              "website",
              "rating",
              "types",
              "vicinity",
              "formatted_address",
              "price_level",
              "user_ratings_total",
            ],
          },
          (result, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
              console.log(`Failed to get details for place: ${place.name || place.place_id}`)
              return resolve(null)
            }

            try {
              const distance = calculateDistance(
                Number(lat),
                Number(lng),
                result.geometry?.location?.lat() || 0,
                result.geometry?.location?.lng() || 0,
              )

              // Use isOpen() method instead of deprecated open_now property
              const openingHours = result.opening_hours
              let openNow = null
              if (openingHours) {
                if (typeof openingHours.isOpen === "function") {
                  openNow = openingHours.isOpen()
                }
              }

              resolve({
                place_id: place.place_id,
                name: result.name!,
                types: result.types || [],
                vicinity: result.vicinity || "",
                formatted_address: result.formatted_address,
                geometry: {
                  location: {
                    lat: result.geometry?.location?.lat() || 0,
                    lng: result.geometry?.location?.lng() || 0,
                  },
                },
                photos: result.photos?.map((p) => ({
                  photo_reference: p.getUrl(),
                  width: p.width,
                  height: p.height,
                })),
                opening_hours: {
                  open_now: openNow,
                  weekday_text: openingHours?.weekday_text,
                },
                formatted_phone_number: result.formatted_phone_number,
                website: result.website,
                rating: result.rating,
                price_level: result.price_level,
                distance,
                user_ratings_total: result.user_ratings_total,
              })
            } catch (err) {
              console.error("Error processing place details:", err)
              resolve(null)
            }
          },
        )
      } catch (err) {
        console.error("Error in getPlaceDetails:", err)
        resolve(null)
      }
    })
  }

  // Main data loading function with proper error handling
  const loadAllData = useCallback(async () => {
    try {
      if (!lat || !lng) {
        throw {
          type: "location",
          message: "Missing location coordinates",
          retryable: false,
        }
      }

      setLoadingPhase("maps")
      await loadGoogleMaps()

      setLoadingPhase("weather")
      const weatherData = await fetchWeather()
      setWeather(weatherData)

      setLoadingPhase("places")

      // Determine which place types to search for
      let types: string[] = []

      if (usedFallback) {
        // If we've already tried the mood-specific types and failed, use fallback types
        types = fallbackTypes
        console.log("Using fallback place types:", types)
      } else if (mood && mood in moodGoogleTypes) {
        // Use mood-specific types
        types = moodGoogleTypes[mood as keyof typeof moodGoogleTypes]
        console.log(`Using ${mood} place types:`, types)
      } else {
        // Default types if no mood or unknown mood
        types = fallbackTypes.slice(0, 3)
        console.log("Using default place types:", types)
      }

      try {
        const rawPlaces = await fetchPlaces(types, searchRadius)

        // Deduplicate places by place_id
        const uniquePlaces = Array.from(new Map(rawPlaces.map((place) => [place.place_id, place])).values())

        console.log(`Found ${uniquePlaces.length} unique places`)

        // Get details for a reasonable number of places
        const placesToFetch = uniquePlaces.slice(0, 20)
        const detailedPlacesPromises = placesToFetch.map(getPlaceDetails)

        const detailedPlaces = (await Promise.all(detailedPlacesPromises)).filter(Boolean) as Place[]

        if (detailedPlaces.length === 0) {
          if (!usedFallback) {
            // If we haven't tried fallback types yet, try them
            setUsedFallback(true)
            throw {
              type: "no_results",
              message: "No places found with mood-specific types - trying fallback types",
              retryable: true,
            }
          } else if (searchRadius < 15000) {
            // If we've tried fallback types but radius is still small, increase it
            setSearchRadius((prev) => prev + 5000)
            throw {
              type: "no_results",
              message: `No places found within ${searchRadius}m - expanding search radius`,
              retryable: true,
            }
          } else {
            // We've tried everything and still no results
            throw {
              type: "no_results",
              message: "No places found after trying all options",
              retryable: false,
            }
          }
        }

        // Sort places by distance
        detailedPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        setPlaces(detailedPlaces)
        console.log("Places loaded successfully:", detailedPlaces.length)

        // Reset error state and retry counters on success
        setError(null)
        setRetryCount(0)
        setUsedFallback(false)
      } catch (err) {
        // Handle place fetching errors
        if (err && typeof err === "object" && "type" in err) {
          throw err // Rethrow AppError objects
        }

        // For other errors, try fallback if we haven't yet
        if (!usedFallback) {
          setUsedFallback(true)
          throw {
            type: "api",
            message: "Failed to fetch places with mood types - trying fallback types",
            retryable: true,
          }
        } else {
          throw {
            type: "api",
            message: err instanceof Error ? err.message : "Failed to fetch places",
            retryable: true,
          }
        }
      }
    } catch (err: unknown) {
      console.error("Error in loadAllData:", err)

      if (typeof err === "object" && err !== null && "type" in err) {
        setError(err as AppError)

        // Auto-retry for certain errors
        if ((err as AppError).retryable && retryCount < 2) {
          setRetryCount((prev) => prev + 1)
          console.log(`Auto-retrying (${retryCount + 1}/3)...`)
          setTimeout(() => loadAllData(), 1000)
          return
        }
      } else {
        setError({
          type: "api",
          message: err instanceof Error ? err.message : "Unknown error occurred",
          retryable: true,
        })
      }
    } finally {
      setLoadingPhase("done")
    }
  }, [lat, lng, mood, searchRadius, usedFallback, retryCount])

  // Weather-based filtering
  const filteredPlaces = useMemo(() => {
    if (!weather) return places

    const weatherType = weather.weather[0]?.main
    const outdoorTypes = ["park", "hiking", "beach", "outdoor"]

    return places.filter((place) => {
      if (["Rain", "Snow"].includes(weatherType || "")) {
        return !place.types?.some((t) => outdoorTypes.some((type) => t.includes(type)))
      }
      return true
    })
  }, [places, weather])

  // Initial load
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // Handlers
  const handleRetry = () => {
    setError(null)
    setRetryCount(0)
    setUsedFallback(false)
    loadAllData()
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <>
        <WeatherInfoSkeleton />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <PlaceCardSkeleton key={index} />
          ))}
        </div>
      </>
    )
  }

  if (!lat || !lng) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Location Required</h1>
        <p className="text-muted-foreground text-center mb-6">We need your location to provide recommendations.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Back
        </Link>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-foreground">{mood ? `${mood} Places` : "Recommended Places"}</h1>
        </div>

        {/* Loading State */}
        {loadingPhase !== "done" ? (
          <div>
            <div className="flex items-center mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <p className="text-sm font-medium text-foreground">
                {loadingPhase === "maps" && "Loading maps..."}
                {loadingPhase === "weather" && "Checking weather..."}
                {loadingPhase === "places" && "Finding places..."}
              </p>
            </div>
            {renderSkeletons()}
          </div>
        ) : (
          <>
            {/* Weather */}
            {weather && <WeatherInfo weather={weather} />}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                      {error.type === "location" && "Location Error"}
                      {error.type === "weather" && "Weather Error"}
                      {error.type === "api" && "Service Error"}
                      {error.type === "no_results" && "No Results Found"}
                      {error.type === "maps" && "Maps Error"}
                    </h3>
                    <p className="text-red-700 dark:text-red-400 mt-1">{error.message}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  {error.retryable && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center px-4 py-2 bg-background dark:bg-gray-800 border border-red-300 dark:border-red-800/50 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </button>
                  )}
                  <Link
                    href="/"
                    className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                  >
                    {error.type === "no_results" ? "Change Mood" : "Go Back"}
                  </Link>
                </div>
              </div>
            )}

            {/* Results */}
            {!error && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredPlaces.length} {mood?.toLowerCase()} places
                  </p>
                  <button
                    onClick={handleRetry}
                    className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </button>
                </div>

                {filteredPlaces.length > 0 ? (
                  <motion.div
                    className="grid gap-4 sm:grid-cols-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {filteredPlaces.map((place, index) => (
                      <PlaceCard
                        key={`${place.place_id}-${index}`}
                        place={place}
                        index={index}
                        userLocation={{ lat: Number(lat), lng: Number(lng) }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">No Matching Places Found</h2>
                    <p className="text-muted-foreground mb-6">
                      We couldn&apos;t find any {mood?.toLowerCase()} places within {searchRadius / 1000}km.
                    </p>
                    <div className="flex gap-3 justify-center">
                      {searchRadius <= 15000 ? (
                        <button
                          onClick={() => {
                            setSearchRadius((prev) => prev + 5000)
                            handleRetry()
                          }}
                          className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Expand Search
                        </button>
                      ) : null}
                      <Link
                        href="/"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Change Mood
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
