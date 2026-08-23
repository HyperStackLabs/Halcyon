'use client'

import { AlertCircle, X } from 'lucide-react'

interface ErrorToastProps {
  message: string
  onClose: () => void
}

export function ErrorToast({ message, onClose }: ErrorToastProps) {
    
  return (
    <div
      className="
        fixed bottom-6 right-6 z-50
        w-[min(380px,calc(100vw-2rem))]
        animate-in slide-in-from-right-5 fade-in
        rounded-2xl
        border border-destructive/30
        bg-background/95
        p-4
        shadow-2xl shadow-destructive/10
        backdrop-blur-xl
      "
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-full
          bg-destructive/10
          text-destructive
        ">
          <AlertCircle className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">
              Something went wrong
            </h3>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss error"
              className="
                rounded-md p-1
                text-muted-foreground
                transition-colors
                hover:bg-accent
                hover:text-foreground
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="
            mt-1
            text-sm
            leading-relaxed
            text-muted-foreground
            break-words
          ">
            {message}
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="
        absolute bottom-0 left-4 right-4
        h-px
        bg-destructive/30
      " />
    </div>
  )
}