'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Log in', href: '/auth/login' },
  { label: 'Sign up', href: '/auth/signup' },
]

export function AuthTabs() {
  const pathname = usePathname()

  return (
    <div className="relative flex rounded-full border border-border bg-secondary/50 p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
