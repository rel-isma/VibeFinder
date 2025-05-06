import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeFinder - Find Places Based on Your Mood",
  description: "Discover the best places nearby tailored to your mood, current weather, and location with VibeFinder.",
  icons: {
    icon: "/VibeFinder.png",
    shortcut: "/VibeFinder.png",
    apple: "/VibeFinder.png",
  },
  keywords: ["VibeFinder", "mood based places", "nearby activities", "location suggestions", "weather mood suggestions", "travel mood app"],
  authors: [{ name: "VibeFinder Team", url: "https://vibefinder-pink.vercel.app/" }],
  creator: "VibeFinder",
  openGraph: {
    title: "VibeFinder - Discover Places by Mood",
    description: "Let your mood guide you. VibeFinder helps you find spots that match your vibe.",
    url: "https://vibefinder-pink.vercel.app/",
    siteName: "VibeFinder",
    images: [
      {
        url: "https://vibefinder-pink.vercel.app/VibeFinder.png",
        width: 1200,
        height: 630,
        alt: "VibeFinder preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeFinder - Discover Places by Mood",
    description: "Let your mood guide you. Find the best spots based on your vibe.",
    images: ["https://vibefinder-pink.vercel.app/VibeFinder.png"],
    creator: "@vibefinder",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Support */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/VibeFinder.png" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
