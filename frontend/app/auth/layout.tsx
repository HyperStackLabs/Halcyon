import Link from 'next/link'
import { ArrowLeft, Quote } from 'lucide-react'
import { BrandLogo } from '@/components/brand'
import { AuthTabs } from '@/components/auth/auth-tabs'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full bg-background">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-10 top-16 h-40 w-40 rounded-full border border-primary/20 animate-float-slow"
          aria-hidden="true"
        />

        <div className="relative">
          <BrandLogo />
        </div>

        <div className="relative">
          <h1 className="font-display text-6xl uppercase leading-[0.86] tracking-tight text-balance text-glow xl:text-7xl">
            A calmer kind
            <br />
            of <span className="text-primary">AI chat.</span>
          </h1>
          <p className="mt-6 max-w-sm text-pretty text-base leading-relaxed text-sidebar-foreground/70">
            Sign in to pick up where you left off, or create an account to start exploring with
            Halcyon.
          </p>
        </div>

        <figure className="relative max-w-sm rounded-3xl border border-sidebar-border bg-background/40 p-6">
          <Quote className="h-6 w-6 text-primary" />
          <blockquote className="mt-3 text-pretty text-sm leading-relaxed text-sidebar-foreground/80">
            It feels less like a tool and more like a calm, brilliant colleague who never rushes
            you.
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase tracking-widest text-sidebar-foreground/50">
            Design Weekly
          </figcaption>
        </figure>
      </aside>

      {/* Form panel */}
      <main className="relative flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 md:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo />
            </div>
            <AuthTabs />
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
