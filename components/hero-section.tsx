"use client"

import { motion } from "framer-motion"
import { Navigation, Search, MapPin, Compass } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const floatingTags = [
    {
      icon: <Search className="h-4 w-4" />,
      text: "Find nearby",
      x: [0, 10, 5, -5, 0],
      y: [0, -8, 5, -3, 0],
      rotate: [0, 3, -2, 1, 0],
      duration: 12,
      delay: 0,
      position: "top-[15%] left-[15%]"
    },
    {
      icon: <Navigation className="h-4 w-4" />,
      text: "Get directions",
      x: [0, -8, 5, 3, 0],
      y: [0, 5, -3, 8, 0],
      rotate: [0, -2, 1, 3, 0],
      duration: 14,
      delay: 0.5,
      position: "top-[25%] right-[10%]"
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: "Explore",
      x: [0, 5, -3, 7, 0],
      y: [0, -3, 6, -4, 0],
      rotate: [0, 1, -3, 2, 0],
      duration: 16,
      delay: 1,
      position: "bottom-[20%] left-[20%]"
    },
    {
      icon: <Compass className="h-4 w-4" />,
      text: "Discover",
      x: [0, -5, 3, -7, 0],
      y: [0, 4, -6, 3, 0],
      rotate: [0, -1, 2, -3, 0],
      duration: 15,
      delay: 1.5,
      position: "bottom-[15%] right-[15%]"
    }
  ]

  return (
    <div className="relative overflow-hidden py-10 md:py-16 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Free-floating tags */}
      {floatingTags.map((tag, index) => (
        <motion.div
          key={index}
          className={`absolute ${tag.position} z-10 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1.5 text-sm text-foreground shadow-sm border border-border/30`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.8, 1, 0.8],
            x: tag.x,
            y: tag.y,
            rotate: tag.rotate
          }}
          transition={{
            duration: tag.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: tag.delay
          }}
        >
          {tag.icon}
          <span>{tag.text}</span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
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

            <motion.h1 
              className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              VibeFinder
            </motion.h1>

            <motion.p 
              className="mb-8 text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover places that match your mood and the weather
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}