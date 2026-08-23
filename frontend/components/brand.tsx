import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M3 12c4.5 0 6.5-3 6.5-9 0 6 2 9 6.5 9-4.5 0-6.5 3-6.5 9 0-6-2-9-6.5-9Z"
          fill="currentColor"
        />
        <circle cx="18.5" cy="5.5" r="2" fill="currentColor" opacity="0.85" />
      </svg>
    </span>
  )
}

export function BrandLogo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2.5 group', className)}>
      <BrandMark />
      <span className="font-display text-2xl leading-none tracking-wide">HALCYON</span>
    </Link>
  )
}
