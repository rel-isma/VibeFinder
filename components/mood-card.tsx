"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

type MoodProps = {
  name: string
  emoji: string
  color: string
  hoverColor: string
  activeColor: string
  textColor: string
  isLoading: boolean
  isSelected: boolean
  onClick: () => void
}

export function MoodCard({
  name,
  emoji,
  color,
  hoverColor,
  activeColor,
  textColor,
  isLoading,
  isSelected,
  onClick,
}: MoodProps) {
  return (
    <motion.button
      className={`${color} ${hoverColor} rounded-xl p-6 flex flex-col items-center justify-center h-32 transition-all shadow-sm border border-gray-100 dark:border-gray-800 relative ${textColor} ${
        isSelected ? activeColor : ""
      }`}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={isLoading}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <>
          <span className="text-4xl mb-3">{emoji}</span>
          <span className="font-medium">{name}</span>
        </>
      )}
    </motion.button>
  )
}
