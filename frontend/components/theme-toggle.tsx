'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className={cn(
        'group relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-secondary/60 px-1 transition-colors hover:bg-secondary',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 ease-out',
          isDark ? 'translate-x-0' : 'translate-x-7',
        )}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="sr-only">{isDark ? 'Dark theme active' : 'Light theme active'}</span>
    </button>
  )
}
