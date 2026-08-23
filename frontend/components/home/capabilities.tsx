import { Gauge, Languages, Lock, Sparkles } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'

const STATS = [
  { value: '2.5s', label: 'Median response' },
  { value: '128k', label: 'Context window' },
  { value: '95+', label: 'Languages' },
  { value: '99.9%', label: 'Uptime' },
]

const FEATURES = [
  {
    icon: Gauge,
    title: 'Fast where it counts',
    body: 'Responses stream instantly so momentum never breaks mid-thought.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    body: 'Your conversations stay yours. Encrypted end to end, never sold.',
  },
  {
    icon: Languages,
    title: 'Fluent everywhere',
    body: 'Switch between dozens of languages inside a single conversation.',
  },
]

export function Capabilities() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24">
      <ScrollReveal className="relative overflow-hidden rounded-4xl border border-border bg-card p-8 md:p-14">
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Built to feel effortless
          </span>
          <h2 className="max-w-2xl font-display text-4xl uppercase leading-none tracking-tight text-balance md:text-6xl">
            Premium intelligence, kept calm and clear
          </h2>
        </div>

        <div className="relative mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <ScrollReveal
                key={f.title}
                delay={i * 100}
                className="rounded-3xl border border-border bg-background/60 p-6"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </ScrollReveal>
            )
          })}
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80} className="text-center md:text-left">
              <p className="font-display text-4xl leading-none text-primary md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Halcyon Labs. A calmer kind of AI.</p>
        <div className="flex items-center gap-6">
          <span className="cursor-default transition-colors hover:text-foreground">Privacy</span>
          <span className="cursor-default transition-colors hover:text-foreground">Terms</span>
          <span className="cursor-default transition-colors hover:text-foreground">Careers</span>
        </div>
      </footer>
    </section>
  )
}
