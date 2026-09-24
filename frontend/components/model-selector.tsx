'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, Check, Sparkles, Zap, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiModelInterface } from '@/types/model_types'
import getAIModels from '@/hooks/getAIDatabase'

const MIN_LIST_HEIGHT = 220

const Selector = ({
  modelID,
  setOpen,
  setModel,
}: {
  modelID: string
  setOpen: (open: boolean) => void
  setModel: (modelID: string) => void
}) => {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'pro' | 'nano'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { data } = getAIModels()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Safely filter models based on search query AND model.type
  const filteredModels = useMemo(() => {
    const modelsList: aiModelInterface[] = data ?? []

    return modelsList.filter((model: aiModelInterface) => {
      const name = (model.soft_name || '').toLowerCase()
      const search = query.trim().toLowerCase()
      const modelType = (model.type || '').toLowerCase()

      // 1. Filter by search input
      const matchesSearch = search === '' || name.includes(search)

      // 2. Filter by selected tab (All, Pro, Nano)
      let matchesType = true
      if (selectedType === 'pro') {
        matchesType = modelType === 'pro'
      } else if (selectedType === 'nano') {
        matchesType = modelType === 'nano'
      }

      return matchesSearch && matchesType
    })
  }, [data, query, selectedType])

  return (
    <div
      role="listbox"
      className={cn(
        'absolute left-0 bottom-full z-50 mb-1.5 flex flex-col',
        'w-[min(92vw,320px)] sm:w-80',
        'overflow-hidden rounded-xl border border-border bg-popover shadow-lg',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150'
      )}
    >
      {/* Header UI: All / Pro / Nano Switch + Search Bar */}
      <div className="flex flex-col gap-2 border-b border-border bg-muted/20 p-2">
        {/* Toggle UI */}
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all cursor-pointer',
              selectedType === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Sparkles className={cn('h-3.5 w-3.5', selectedType === 'all' ? 'text-primary' : 'text-muted-foreground')} />
            <span>All</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('pro')}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all cursor-pointer',
              selectedType === 'pro'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Zap className={cn('h-3.5 w-3.5', selectedType === 'pro' ? 'text-primary' : 'text-muted-foreground')} />
            <span>Pro</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('nano')}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all cursor-pointer',
              selectedType === 'nano'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Cpu className={cn('h-3.5 w-3.5', selectedType === 'nano' ? 'text-primary' : 'text-muted-foreground')} />
            <span>Nano</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
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
      </div>

      {/* Options list */}
      <div
        className="flex flex-col gap-0.5 overflow-y-auto p-1 sm:max-h-80"
        style={{ minHeight: MIN_LIST_HEIGHT, maxHeight: 320 }}
      >
        {filteredModels.length > 0 ? (
          filteredModels.map((model: aiModelInterface) => {
            const currentId = String(model._id || model.id)
            const isSelected = currentId === modelID

            return (
              <button
                key={currentId}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setModel(currentId)
                  setOpen(false)
                }}
                className={cn(
                  'flex cursor-pointer w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
                  isSelected
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {model.image && (
                  <Image
                    alt={model.soft_name}
                    height={16}
                    width={16}
                    src={model.image}
                    className="shrink-0 rounded-sm"
                  />
                )}
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
  )
}

export default Selector