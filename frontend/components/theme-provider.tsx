'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('halcyon-theme')
    } catch {
      // ignore
    }
    const isLight = saved === 'light'
    document.documentElement.classList.toggle('light', isLight)
    setTheme(isLight ? 'light' : 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.toggle('light', next === 'light')
      try {
        localStorage.setItem('halcyon-theme', next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
