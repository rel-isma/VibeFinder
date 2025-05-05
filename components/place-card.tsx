"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation, Clock, Phone, ExternalLink, Info, Tag, Star } from "lucide-react"
import { useState } from "react"

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
    open_now?: boolean
    weekday_text?: string[]
  }
  formatted_phone_number?: string
  website?: string
  rating?: number
  price_level?: number
  distance?: number
  user_ratings_total?: number
}

type PlaceCardProps = {
  place: Place
  index: number
  userLocation: {
    lat: number
    lng: number
  }
}

export default function PlaceCard({ place, index, userLocation }: PlaceCardProps) {
  const [isDirectionsLoading, setIsDirectionsLoading] = useState(false)
  const [directionsError, setDirectionsError] = useState<string | null>(null)
  const [showAllHours, setShowAllHours] = useState(false)

  console.log("PlaceCard props:", { place, index, userLocation })

  const openInGoogleMaps = () => {
    try {
      setIsDirectionsLoading(true)
      setDirectionsError(null)

      const { lat, lng } = place.geometry.location
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&destination_place_id=${place.place_id}&travelmode=driving`
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error opening directions:", error)
      setDirectionsError("Could not open directions")
    } finally {
      setIsDirectionsLoading(false)
    }
  }

  const formatDistance = (meters?: number) => {
    if (!meters || isNaN(meters)) {
      const { lat: lat2, lng: lon2 } = place.geometry.location
      if (!isNaN(userLocation.lat) && !isNaN(userLocation.lng)) {
        meters = calculateDistance(userLocation.lat, userLocation.lng, lat2, lon2)
      } else {
        return "Unknown"
      }
    }
    return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const getCategoryName = () => {
    if (!place.types?.length) return "Place"

    const typeMapping: Record<string, string> = {
      restaurant: "Restaurant",
      cafe: "Café",
      bar: "Bar",
      park: "Park",
      museum: "Museum",
      // ... (keep your existing mappings)
    }

    for (const type of place.types) {
      if (type in typeMapping) return typeMapping[type]
    }

    return place.types[0].replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatOpenHours = () => {
    if (!place.opening_hours) return null

    // Determine if the place is open based on the opening_hours data
    const isOpen = place.opening_hours.open_now
    console.log("isOpen:", isOpen)

    const status = isOpen ? (
      <span className="text-green-600">Open now</span>
    ) : (
      <span className="text-red-600">Closed now</span>
    )

    if (!place.opening_hours.weekday_text?.length) {
      return <p className="text-sm">{status}</p>
    }

    return (
      <div>
        <p className="text-sm font-medium">{status}</p>
        {showAllHours && (
          <div className="mt-1 text-xs text-gray-600">
            {place.opening_hours.weekday_text.map((day, i) => (
              <p key={i}>{day}</p>
            ))}
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowAllHours(!showAllHours)
          }}
          className="text-xs text-primary mt-1 hover:underline"
        >
          {showAllHours ? "Show less" : "Show hours"}
        </button>
      </div>
    )
  }

  const formatPriceLevel = () => {
    if (place.price_level === undefined) return null
    return (
      <span className="text-xs">
        <span className="text-primary">{"€".repeat(place.price_level)}</span>
        <span className="text-gray-300">{"€".repeat(4 - place.price_level)}</span>
      </span>
    )
  }

  const formatRating = () => {
    if (!place.rating) return null
    return (
      <div className="flex items-center">
        <Star className="h-3 w-3 text-yellow-500 mr-1" />
        <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
        {place.user_ratings_total && <span className="text-xs text-gray-500 ml-1">({place.user_ratings_total})</span>}
      </div>
    )
  }

  const address = place.formatted_address || place.vicinity || ""
  const categoryName = getCategoryName()

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }} // Mobile-friendly tap feedback
    >
      <div className="p-4">
        {/* Header - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            {" "}
            {/* Prevent text overflow */}
            <h3 className="font-bold text-lg text-gray-900 truncate">{place.name}</h3>
            <div className="flex items-center mt-1 flex-wrap gap-2">
              <div className="flex items-center">
                <Tag className="h-3 w-3 mr-1 text-primary" />
                <p className="text-sm text-primary truncate">{categoryName}</p>
              </div>
              {formatPriceLevel()}
            </div>
          </div>

          <div className="flex items-center text-sm bg-primary/10 px-2 py-1 rounded-full text-primary whitespace-nowrap">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{formatDistance(place.distance)}</span>
          </div>
        </div>

        {/* Rating - Full width on mobile */}
        {place.rating && <div className="mb-3 w-full">{formatRating()}</div>}

        <div className="h-px bg-gray-100 my-3"></div>

        {/* Details section - Collapsible on mobile */}
        <div className={`space-y-2 mb-3  sm:max-h-none`}>
          {address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 break-words">{address}</p>
            </div>
          )}

          {place.opening_hours && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">{formatOpenHours()}</div>
            </div>
          )}

          {place.formatted_phone_number && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 break-all">{place.formatted_phone_number}</p>
            </div>
          )}
        </div>

        {/* Footer buttons - Centered layout */}
        <div className="flex flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={openInGoogleMaps}
              className={`flex items-center justify-center text-sm text-primary font-medium hover:underline ${
                isDirectionsLoading ? "opacity-70" : ""
              }`}
              disabled={isDirectionsLoading}
            >
              {isDirectionsLoading ? (
                <span className="animate-spin">...</span>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-1" />
                  Directions
                </>
              )}
            </button>

            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-primary font-medium hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="sm:hidden">Site</span>
                <span className="hidden sm:inline">Website</span>
              </a>
            )}
          </div>

          {(place.photos?.length || place.rating) && (
            <a
              href={`https://maps.google.com/?q=${place.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary font-medium hover:underline"
            >
              <Info className="h-4 w-4 mr-1" />
              More
            </a>
          )}
        </div>

        {directionsError && <p className="text-red-500 text-xs mt-2 text-center">{directionsError}</p>}
      </div>
    </motion.div>
  )
}
