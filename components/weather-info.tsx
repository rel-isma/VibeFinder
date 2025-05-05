"use client"

import { Cloud, CloudRain, CloudSnow, Sun, Wind, Umbrella, Thermometer, MapPin } from "lucide-react"

type WeatherProps = {
  weather: {
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
    name: string // City name
    sys?: {
      country?: string
    }
  }
}

export default function WeatherInfo({ weather }: WeatherProps) {
  const weatherType = weather.weather[0]?.main || ""
  const weatherDesc = weather.weather[0]?.description || ""
  const temp = Math.round(weather.main.temp)
  const feelsLike = weather.main.feels_like ? Math.round(weather.main.feels_like) : null
  const humidity = weather.main.humidity
  const windSpeed = weather.wind?.speed
  const cityName = weather.name || "Unknown location"
  const country = weather.sys?.country || ""

  const getWeatherIcon = () => {
    switch (weatherType.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-500 dark:text-blue-400" />
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-300 dark:text-blue-200" />
      default:
        return <Wind className="h-8 w-8 text-gray-500 dark:text-gray-400" />
    }
  }

  const getWeatherMessage = () => {
    if (weatherType === "Rain" || weatherType === "Snow") {
      return "Showing indoor recommendations"
    } else if (weatherType === "Clear" && temp > 25) {
      return "Great weather for outdoor activities!"
    } else if (weatherType === "Clear" || weatherType === "Clouds") {
      return "Perfect weather for exploring"
    } else {
      return "Showing all recommendations"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <div className="mr-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-full">{getWeatherIcon()}</div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <MapPin className="h-4 w-4 mr-1 text-primary dark:text-primary" />
            {cityName}
            {country && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({country})</span>}
          </h2>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{temp}°C</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{weatherDesc}</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        <p className="text-sm text-primary dark:text-primary font-medium mb-2">{getWeatherMessage()}</p>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-300">
          {feelsLike !== null && (
            <div className="flex items-center">
              <Thermometer className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              <span>Feels: {feelsLike}°C</span>
            </div>
          )}

          {humidity !== undefined && (
            <div className="flex items-center">
              <Umbrella className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              <span>Humidity: {humidity}%</span>
            </div>
          )}

          {windSpeed !== undefined && (
            <div className="flex items-center">
              <Wind className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
              <span>Wind: {windSpeed} m/s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
