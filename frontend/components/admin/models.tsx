'use client'
import { Plus, Search } from 'lucide-react'
import { aiModelInterface } from '@/types/model_types'
import ModelComponent from './aimodels'
import { useState } from 'react'
import getAIModels from '@/hooks/getAIDatabase'
import { AddModelModal } from './add-ai-modal'

export function ModelsTab() {
  const { data } = getAIModels()
  const [showModal, setShowModal] = useState(false)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
      <div className="flex flex-col gap-5 border-b border-border p-6 md:p-8 md:pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl uppercase tracking-tight">AI Models</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {data?.length} models available to users.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search models by name or codename..."
              aria-label="Search models"
              className="w-full rounded-full border border-border bg-secondary/50 py-2.5 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add model
          </button>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {data.map((model: aiModelInterface) => (
          <ModelComponent key={model._id} model={model} />
        ))}
      </ul>

      {showModal && <AddModelModal onClose={() => setShowModal(false)} />}
    </section>
  )
}