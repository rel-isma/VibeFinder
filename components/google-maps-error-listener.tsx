"use client"

import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export default function GoogleMapsErrorListener() {
  useEffect(() => {
    function handleGoogleMapsError(event: ErrorEvent) {
      if (
        typeof event.message === "string" &&
        (event.message.includes("Google Maps JavaScript API error") ||
          event.message.includes("InvalidKeyMapError") ||
          event.message.toLowerCase().includes("api key") ||
          event.message.toLowerCase().includes("key") ||
          event.message.toLowerCase().includes("quota"))
      ) {
        toast({
          title: "Google Maps API Key Issue",
          description:
            "VibeFinder uses a Google Maps API key to show places near you. The current API key is no longer working because it is out of the free trial or has exceeded its quota. To see places, a new API key is needed. Please keep using VibeFinder—I am working on getting a new API key so this feature will work again soon!",
        });
      }
    }
    window.addEventListener("error", handleGoogleMapsError);
    return () => {
      window.removeEventListener("error", handleGoogleMapsError);
    };
  }, []);
  return null;
} 