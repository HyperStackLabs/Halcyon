'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, ComputerIcon, Crown, Moon, Sun, ThumbsUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import getAIModels from '@/hooks/getAIDatabase'
import type { aiModelInterface } from '@/types/model_types'

type TypeFilter = 'all' | 'Pro' | 'Nano' | 'Agentic'
type Ranking = 'likes' | 'interactions'

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All models' },
  { value: 'Nano', label: 'Nano' },
  { value: 'Pro', label: 'Pro' },
  { value: 'Agentic', label: 'Agentic' },
]

const RANKING_OPTIONS: { value: Ranking; label: string }[] = [
  { value: 'likes', label: 'Likes' },
  { value: 'interactions', label: 'Interactions' },
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
  const [theme] = useState<'dark' | 'light'>('dark')
  const [type, setType] = useState<TypeFilter>('all')
  const [ranking, setRankingBy] = useState<Ranking>('likes')
  const [isRankingOpen, setIsRankingOpen] = useState(false)
  const rankingRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = getAIModels()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rankingRef.current && !rankingRef.current.contains(event.target as Node)) {
        setIsRankingOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const ranked = useMemo(() => {
    const list = type === 'all' ? data : data.filter((m: aiModelInterface) => m.type === type)
    return [...list].sort((a, b) => {
      const aValue = ranking === 'likes' ? (a.likes?.length ?? 0) : (a.interactions ?? 0)
      const bValue = ranking === 'likes' ? (b.likes?.length ?? 0) : (b.interactions ?? 0)
      return bValue - aValue
    })
  }, [data, type, ranking])

  const rankingLabel = ranking === 'likes' ? 'Likes' : 'Interactions'
  const valueFor = (model?: aiModelInterface) =>
    ranking === 'likes' ? (model?.likes?.length ?? 0) : (model?.interactions ?? 0)
  const total = ranked.reduce((sum, model) => sum + valueFor(model), 0)

  return (
    <div className={cn(theme, 'min-h-screen bg-background text-foreground transition-colors')}>
      <style>{`
        @keyframes dropdownEnter {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown {
          transform-origin: top center;
          animation: dropdownEnter 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <section className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="animate-glow-breathe pointer-events-none absolute -top-32 left-1/2 h-96 w-183px -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
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
            <span>Ranked by</span>
            <div className="relative inline-block" ref={rankingRef}>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setIsRankingOpen((prev) => !prev)
                }}
                className="flex cursor-pointer select-none items-center rounded-md border border-transparent bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-foreground transition-all duration-200 hover:border-input hover:bg-accent/50 focus:outline-none"
              >
                {RANKING_OPTIONS.find((option) => option.value === ranking)?.label}
              </div>
              <svg
                className={cn(
                  'pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition-transform duration-200',
                  isRankingOpen && 'rotate-180'
                )}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>

              {/* Dropdown */}
              {isRankingOpen && (
                <div className="animate-dropdown absolute left-1/2 top-full z-50 mt-2 w-36 -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                  {RANKING_OPTIONS.map((option) => {
                    const isSelected = ranking === option.value
                    return (
                      <div
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          setRankingBy(option.value)
                          setIsRankingOpen(false)
                        }}
                        className={cn(
                          'relative flex cursor-pointer select-none items-center justify-between whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors',
                          isSelected
                            ? 'bg-accent font-medium text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                      >
                        {option.label}
                        {isSelected && (
                          <svg
                            className="h-3.5 w-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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
                  {f.value === 'Nano' && <Zap className="h-4 w-4 text-primary" />}
                  {f.value === 'Pro' && <Crown className="h-4 w-4 text-primary" />}
                  {f.value === 'Agentic' && <ComputerIcon className="h-4 w-4 text-primary" />}
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
            <span className="text-right">{rankingLabel}</span>
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
              const value = valueFor(m)
              const portion = total > 0 ? Math.round((value / total) * 100) : 0
              const isTop = i === 0
              const isPro = m.type == 'Pro'

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

                    {/* Ranking value + progress bar */}
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
                        <span className="text-xl leading-none text-emerald-400">+</span>
                        {formatCount(value)}
                      </div>
                      <Bar className="w-28 sm:w-36">
                        <div
                          className={cn(
                            'h-full rounded-full bg-primary transition-[width] duration-700 ease-out',
                            isTop && 'shadow-[0_0_10px_var(--primary)]',
                          )}
                          style={{ width: `${Math.max(value > 0 ? 4 : 0, portion)}%` }}
                        />
                      </Bar>
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {portion}% of all {ranking.toLowerCase()}
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