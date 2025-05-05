"use client"

import { motion } from "framer-motion"
import { Navigation, Search, MapPin, Compass } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const floatingTags = [
    {
      icon: <Search className="h-4 w-4" />,
      text: "What’s around?",
      position: "top-[5%] left-[5%]",
      x: [0, 15, -10, 8, 0],
      y: [0, -12, 6, -8, 0],
      rotate: [0, 6, -4, 3, 0],
      duration: 14,
      delay: 0,
    },
    {
      icon: <Navigation className="h-4 w-4" />,
      text: "Guide me",
      position: "top-[10%] right-[5%]",
      x: [0, -12, 8, -6, 0],
      y: [0, 10, -8, 5, 0],
      rotate: [0, -4, 3, -2, 0],
      duration: 16,
      delay: 0.3,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: "Hot spots",
      position: "bottom-[8%] left-[5%]",
      x: [0, 10, -8, 5, 0],
      y: [0, -6, 4, -5, 0],
      rotate: [0, 3, -2, 1, 0],
      duration: 17,
      delay: 0.6,
    },
    {
      icon: <Compass className="h-4 w-4" />,
      text: "Mood match",
      position: "bottom-[8%] right-[5%]",
      x: [0, -8, 6, -7, 0],
      y: [0, 5, -6, 4, 0],
      rotate: [0, -2, 3, -2, 0],
      duration: 18,
      delay: 0.9,
    },
  ]

  return (
    <div className="relative overflow-hidden py-16 md:py-24 flex items-center justify-center">
      {/* Soft background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -right-[15%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-[15%] -left-[15%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Floating tags */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {floatingTags.map((tag, index) => (
          <motion.div
            key={index}
            className={`absolute ${tag.position} flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1.5 text-sm text-foreground shadow-md border border-border/30`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              x: tag.x,
              y: tag.y,
              rotate: tag.rotate,
            }}
            transition={{
              duration: tag.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: tag.delay,
            }}
          >
            {tag.icon}
            <span>{tag.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Main logo and content */}
      <div className="relative z-20 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/60 opacity-70 blur-sm" />
              <motion.div
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md overflow-hidden"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 5,
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
            className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            VibeFinder
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover places that match your mood and the weather
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
