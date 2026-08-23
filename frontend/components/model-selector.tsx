'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, Check, Sparkles, Bot, Brain, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiModelInterface } from '@/types/model_types'
import getAIModels from '@/hooks/getAIDatabase'

type Brand = {
  id: string
  label: string
  icon: React.ElementType
  match: (name: string) => boolean
}

const BRANDS: Brand[] = [
  { id: 'all', label: 'All', icon: Sparkles, match: () => true },
  { id: 'gpt', label: 'GPT', icon: Bot, match: (n) => n.includes('gpt') || n.includes('openai') },
  { id: 'gemini', label: 'Gemini', icon: Brain, match: (n) => n.includes('gemini') },
  { id: 'deepseek', label: 'DeepSeek', icon: Zap, match: (n) => n.includes('deepseek') },
  { id: 'grok', label: 'Grok', icon: Sparkles, match: (n) => n.includes('grok') },
]

const MIN_LIST_HEIGHT = 220

const Selector = ({
  AIModels,
  modelID,
  setOpen,
  setModel,
}: {
  AIModels: aiModelInterface[]
  modelID: string
  setOpen: (open: boolean) => void
  setModel: (modelID: string) => void
}) => {
  const [query, setQuery] = useState('')
  const [activeBrand, setActiveBrand] = useState('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const {data} = getAIModels()
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredModels = useMemo(() => {
    const brand = BRANDS.find((b) => b.id === activeBrand) ?? BRANDS[0]
    return AIModels.filter((model) => {
      const name = model.soft_name.toLowerCase()
      const matchesBrand = brand.match(name)
      const matchesQuery = query.trim()
        ? name.includes(query.toLowerCase())
        : true
      return matchesBrand && matchesQuery
    })
  }, [AIModels, query, activeBrand])

  return (
    <div
      role="listbox"
      className={cn(
        'absolute left-0 bottom-full z-50 mb-1.5 flex',
        'w-[min(92vw,320px)] sm:w-80',
        'overflow-hidden rounded-xl border border-border bg-popover shadow-lg',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150'
      )}
    >
      {/* Brand sidebar */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/30 p-1.5 sm:w-12">
        {BRANDS.map((brand) => {
          const Icon = brand.icon
          const isActive = brand.id === activeBrand
          return (
            <button
              key={brand.id}
              type="button"
              title={brand.label}
              onClick={() => setActiveBrand(brand.id)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Search bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models..."
            className="w-full bg-transparent text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Options list */}
        <div
          className="flex flex-col gap-0.5 overflow-y-auto p-1 sm:max-h-80"
          style={{ minHeight: MIN_LIST_HEIGHT, maxHeight: 320 }}
        >
          {filteredModels.length > 0 ? (
            filteredModels.map((model: aiModelInterface) => {
              const isSelected = model._id === modelID
              return (
                <button
                  key={model._id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setModel(String(model._id))
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
                    isSelected
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Image
                    alt={model.soft_name}
                    height={16}
                    width={16}
                    src={model.image}
                    className="shrink-0 rounded-sm"
                  />
                  <span className="flex-1 truncate">{model.soft_name}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </button>
              )
            })
          ) : (
            <div className="flex flex-1 items-center justify-center px-2.5 py-6 text-center text-[13px] text-muted-foreground">
              No models found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Selector