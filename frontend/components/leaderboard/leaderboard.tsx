'use client'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Crown, Moon, Sun, ThumbsUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import getAIModels from '@/hooks/getAIDatabase'
import type { aiModelInterface } from '@/types/model_types'

type TypeFilter = 'all' | 'Pro' | 'Flash'

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All models' },
  { value: 'Flash', label: 'Flash' },
  { value: 'Pro', label: 'Pro' },
]

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return n.toString()
}

/** Small track used inside each row. */
function Bar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex h-1.5 w-full overflow-hidden rounded-full bg-secondary/80', className)}>
      {children}
    </div>
  )
}

/** Logo from `image`, falling back to the first letter of `soft_name`. */
function ModelAvatar({ model }: { model: aiModelInterface }) {
  const [broken, setBroken] = useState(false)
  const initial = (model.soft_name || model.codename || '?').charAt(0).toUpperCase()

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/60 font-display text-lg text-primary">
      {model.image && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={model.image}
          alt=""
          className="h-6 w-6 object-contain"
          onError={() => setBroken(true)}
        />
      ) : (
        initial
      )}
    </div>
  )
}

export default function Leaderboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [type, setType] = useState<TypeFilter>('all')
  const { data, isLoading, error } = getAIModels()

  const ranked = useMemo(() => {
    const list = type === 'all' ? data : data.filter((m: aiModelInterface) => m.tier === type)
    return [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  }, [data, type])

  const max = Math.max(ranked[0]?.likes ?? 0, 1)
  const totalLikes = ranked.reduce((sum, m) => sum + (m.likes ?? 0), 0)

  return (
    <div className={cn(theme, 'min-h-screen bg-background text-foreground transition-colors')}>
      <section className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="animate-glow-breathe pointer-events-none absolute -top-32 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-10 pt-16 text-center md:pt-24">
          <a
            href="#leaderboard"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1.5 pl-4 pr-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Halcyon - Gateway to AI models you love
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>

          <h1 className="font-display text-glow text-balance text-6xl uppercase leading-[0.86] tracking-tight sm:text-7xl md:text-8xl">
            The models
            <br />
            <span className="text-primary">people love</span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            A live look at which models Halcyon users like the most.
          </p>
        </div>
      </section>

      {/* Leaderboard */}
      <main id="leaderboard" className="relative mx-auto w-full max-w-3xl px-4 pb-24">
        {/* Filters */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4 text-primary" />
            Ranked by likes
          </div>

          {/* Type chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TYPE_FILTERS.map((f) => {
              const active = type === f.value
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setType(f.value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all hover:-translate-y-0.5',
                    active
                      ? 'border-primary/60 bg-primary/15 text-foreground'
                      : 'border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {f.value === 'Flash' && <Zap className="h-4 w-4 text-primary" />}
                  {f.value === 'Pro' && <Crown className="h-4 w-4 text-primary" />}
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* List */}
        <div className="glass overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[2.5rem_1fr_9rem] items-center gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid-cols-[2.5rem_1fr_11rem]">
            <span>#</span>
            <span>Model</span>
            <span className="text-right">Likes</span>
          </div>

          {isLoading && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Loading models…</p>
          )}
          {error && !isLoading && (
            <p className="px-5 py-10 text-center text-sm text-rose-400">
              Couldn&apos;t load models: {error}
            </p>
          )}
          {!isLoading && !error && ranked.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No models of this type yet.
            </p>
          )}

          <ul>
            {ranked.map((m, i) => {
              const likes = m.likes ?? 0
              const share = Math.round((likes / max) * 100)
              const portion = totalLikes > 0 ? Math.round((likes / totalLikes) * 100) : 0
              const isTop = i === 0
              const isPro = m.type === 'Pro'

              return (
                <li
                  key={`${type}-${m._id}`}
                  className="animate-msg-in border-b border-border transition-colors last:border-b-0 hover:bg-accent/40"
                  style={{ '--msg-delay': `${i * 45}ms` } as React.CSSProperties}
                >
                  <div className="grid grid-cols-[2.5rem_1fr_9rem] items-center gap-4 px-5 py-4 sm:grid-cols-[2.5rem_1fr_11rem]">
                    {/* Rank */}
                    <span
                      className={cn(
                        'font-display text-2xl leading-none tabular-nums',
                        isTop ? 'text-glow text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {i + 1}
                    </span>

                    {/* Model */}
                    <div className="flex min-w-0 items-center gap-3">
                      <ModelAvatar model={m} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-medium">{m.soft_name}</span>
                          <span
                            className={cn(
                              'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                              isPro
                                ? 'border-primary/40 bg-primary/10 text-primary'
                                : 'border-border bg-secondary/60 text-muted-foreground',
                            )}
                          >
                            {isPro ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                            {m.type}
                          </span>
                        </div>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">
                          {m.codename}
                        </span>
                      </div>
                    </div>

                    {/* Likes + progress bar */}
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
                        <h1 className="text-xl text-emerald-400">+</h1>
                        {formatCount(likes)}
                      </div>
                      <Bar className="w-28 sm:w-36">
                        <div
                          className={cn(
                            'h-full rounded-full bg-primary transition-[width] duration-700 ease-out',
                            isTop && 'shadow-[0_0_10px_var(--primary)]',
                          )}
                          style={{ width: `${Math.max(likes > 0 ? 4 : 0, share)}%` }}
                        />
                      </Bar>
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {portion}% of all likes
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Rankings update hourly · Total of {data.length} models
        </p>
      </main>
    </div>
  )
}
