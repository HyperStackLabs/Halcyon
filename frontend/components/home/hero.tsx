'use client'

import Link from 'next/link'
import { ArrowUpRight, Code2, Compass, PenLine, Plane } from 'lucide-react'
import { ChatInput } from '@/components/chat-input'
import { cn } from '@/lib/utils'

const CHIPS = [
  { label: 'Draft an email', icon: PenLine },
  { label: 'Plan a trip', icon: Plane },
  { label: 'Explain a concept', icon: Compass },
  { label: 'Debug my code', icon: Code2 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center md:pt-28">
        <Link
          href="/auth/login"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1.5 pl-4 pr-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Halcyon - Gateway to AI models you love
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <h1 className="font-display text-6xl uppercase leading-[0.86] tracking-tight text-balance text-glow sm:text-7xl md:text-8xl">
          What should we
          <br />
          <span className="text-primary">explore today?</span>
        </h1>

        <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A calmer kind of AI chat. Ask anything, think out loud, and let Halcyon do the heavy
          lifting — beautifully.
        </p>

        <div className="mt-10 w-full">
          <ChatInput />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {CHIPS.map((chip) => {
            const Icon = chip.icon
            return (
              <button
                key={chip.label}
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 text-primary" />
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
