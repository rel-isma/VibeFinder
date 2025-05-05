"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <div className="flex">
          <Link href="/" className="flex items-end space-x-2">
            <motion.div
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 1.5,
              }}
              className="relative w-7 h-7"
            >
              <Image
                src="/VibeFinder.png"
                alt="VibeFinder Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </motion.div>
            <span className="font-bold sm:inline-block">VibeFinder</span>
          </Link>
        </div>
        <div className="flex items-center">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
