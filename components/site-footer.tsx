import { Github, Heart } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} VibeFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/rel-isma/VibeFinder/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="mx-1 h-3 w-3 text-red-500" />
              <span>
                by{" "}
                <Link
                  href="https://rachidelismaiyly.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Rachid Elismaiyly
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
