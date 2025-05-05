"use client"

import { motion } from "framer-motion"
import { Navigation, Search } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/60 opacity-75 blur-sm" />
                <motion.div
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm overflow-hidden"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 4,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/VibeFinder.png"
                    alt="VibeFinder Logo"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              VibeFinder
            </h1>

            <p className="mb-8 text-xl text-muted-foreground">Discover places that match your mood and the weather</p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center rounded-full bg-muted px-4 py-1 text-sm text-muted-foreground">
                <Search className="mr-2 h-4 w-4" />
                <span>Find nearby places</span>
              </div>
              <div className="flex items-center rounded-full bg-muted px-4 py-1 text-sm text-muted-foreground">
                <Navigation className="mr-2 h-4 w-4" />
                <span>Get directions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
