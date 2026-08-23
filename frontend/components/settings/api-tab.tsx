'use client'

import useFetchUser from '@/hooks/useFetchUser'
import XFetch from '@/lib/xfetch'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ApiSettings() {
  const [apiKey, setApiKey] = useState('')
  const [usageCap, setUsageCap] = useState(0.25)
  const [revealed, setRevealed] = useState(false)
  
  async function changeAPICredentials(){
    await XFetch('http://localhost:4000/api-changes', {
        method: 'PATCH',
        body: JSON.stringify({apiKey: String(apiKey), usageCap})
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50">
          <KeyRound className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight">API Settings</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Connect your own key and set a hard ceiling on spend.
          </p>
        </div>
      </div>

      <form className="mt-8 flex max-w-md flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-muted-foreground">
            API key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={revealed ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ey-••••••••••••••••••••••••"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 pr-11 font-mono text-sm text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-muted-foreground focus:border-primary/40"
            />
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? 'Hide API key' : 'Show API key'}
              className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Stored locally and never shared across sessions.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="usageCap" className="text-sm font-medium text-muted-foreground">
            Usage cap
          </label>
          <div className="relative w-32">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <input
              id="usageCap"
              type="number"
              min="0"
              step="0.05"
              value={usageCap}
              onChange={(e) => setUsageCap(e.target.valueAsNumber)}
              placeholder="0.25"
              className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-7 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Requests pause once this limit is reached.
          </p>
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={changeAPICredentials}
            className="rounded-full cursor-pointer bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            Save settings
          </button>
        </div>
      </form>
    </section>
  )
}
