import Link from 'next/link'
import { ArrowUpRight, BrainCircuit, Feather, Rocket, Telescope } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'

const CARDS = [
  {
    tag: 'Create',
    title: 'Write something worth reading',
    body: 'Long-form essays, launch copy, or a birthday toast — with the tone dialed exactly where you want it.',
    icon: Feather,
  },
  {
    tag: 'Reason',
    title: 'Think through hard problems',
    body: 'Step-by-step reasoning that shows its work, weighs trade-offs, and never rushes the answer.',
    icon: BrainCircuit,
  },
  {
    tag: 'Explore',
    title: 'Go down the rabbit hole',
    body: 'From deep-sea currents to distant galaxies, ask the follow-up questions you were too shy to ask.',
    icon: Telescope,
  },
  {
    tag: 'Build',
    title: 'Ship your next idea faster',
    body: 'Scaffold apps, debug tricky functions, and turn rough notes into a plan you can act on today.',
    icon: Rocket,
  },
]

export function PromptCards() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <ScrollReveal className="mb-10 flex flex-col items-start gap-3 md:mb-14">
        <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Starting points
        </span>
        <h2 className="font-display text-4xl uppercase leading-none tracking-tight text-balance md:text-6xl">
          A canvas for every kind of question
        </h2>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <ScrollReveal key={card.title} delay={i * 90}>
              <Link
                href="/auth/login"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
                <div className="mt-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    {card.tag}
                  </p>
                  <h3 className="text-xl font-semibold text-balance">{card.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
