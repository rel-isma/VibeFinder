import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhereToGo? - Find Places Based on Your Mood",
  description: "Discover nearby locations that match your current mood, weather, and location.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <footer className="py-4 text-center text-sm text-gray-500">
              <p>WhereToGo? - Find places based on your mood</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
