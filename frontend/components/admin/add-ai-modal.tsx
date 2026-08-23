'use client'

import { useState } from 'react'
import { X, ChevronDown, Zap, Brain, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import XFetch from '@/lib/xfetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const MODEL_IMAGES = [
  {
    id: 'img1',
    src: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/openai.svg',
    label: 'OpenAI',
  },
  {
    id: 'img2',
    src: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/grok-icon.png',
    label: 'Grok',
  },
  {
    id: 'img3',
    src: 'https://images.seeklogo.com/logo-png/61/2/deepseek-ai-icon-logo-png_seeklogo-611473.png',
    label: 'Deepseek',
  },
  {
    id: 'img4',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/500px-Google_Gemini_icon_2025.svg.png',
    label: 'Gemini',
  },
  {
    id: 'img5',
    src: 'https://logo-teka.com/wp-content/uploads/2026/06/qwen-ai-icon-logo.png',
    label: 'Qwen'
  },
  {
    id: 'img6',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Z.ai_%28company_logo%29.svg/3840px-Z.ai_%28company_logo%29.svg.png',
    label: 'Z.ai'
  }
]

const TIERS = [
  {
    value: 'Pro',
    label: 'Pro',
    icon: Brain,
    description: 'Best reasoning, slower responses',
  },
  {
    value: 'Nano',
    label: 'Nano',
    icon: Zap,
    description: 'Balanced speed and capability',
  },
] as const

export function AddModelModal({ onClose }: { onClose: () => void,}) {
  const [imageOpen, setImageOpen] = useState(true)
  const [tierOpen, setTierOpen] = useState(false)
  const [newAI, setAI] = useState({
    codename: '',
    soft_name: '',
    image: MODEL_IMAGES[0].id,
    tier: 'Nano',
  })
  const queryClient = useQueryClient()
  const selectedImage = MODEL_IMAGES.find((m) => m.id === newAI.image)
  const selectedTier = TIERS.find((tier) => tier.value === newAI.tier) ?? TIERS[1]

  const handleSubmit = async () => {
    try {
      await XFetch('http://localhost:4000/ai-models', {
        method: 'POST',
        body: JSON.stringify({
          codename: newAI.codename,
          soft_name: newAI.soft_name,
          image: selectedImage?.src ?? '',
          type: newAI.tier,
        }),
      })
    } catch (err) {
      console.error('Failed to add model:', err)
    } finally {
      onClose()
    }
  }

  const addLanguageModel = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['models']
      })
    }
  })


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-xl uppercase tracking-tight">
              Add AI Model
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure and register a new model.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          {/* Image accordion */}
          <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
            <button
              type="button"
              onClick={() => setImageOpen((p) => !p)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md border border-border">
                  {selectedImage && (
                    <img
                      src={selectedImage.src}
                      alt="selected"
                      className="h-4 w-4 object-cover"
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  Model Icon
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedImage?.label}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  imageOpen && 'rotate-180'
                )}
              />
            </button>

            {imageOpen && (
              <div className="flex flex-col gap-2 border-t border-border p-3 h-40 overflow-y-scroll">
                {MODEL_IMAGES.map((img) => {
                  const isSelected = img.id === newAI.image
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setAI({ ...newAI, image: img.id })}
                      className={cn(
                        'group relative flex items-center gap-1.5 rounded-lg border p-2 transition-all',
                        isSelected
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border bg-secondary/40 hover:border-border hover:bg-secondary/80'
                      )}
                    >
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md">
                        <img
                          src={img.src}
                          alt={img.label}
                          className="h-6 w-6 object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {img.label}
                      </span>
                      {isSelected && (
                        <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Display Name input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Display Name
            </label>
            <input
              type="text"
              value={newAI.soft_name}
              onChange={(e) => setAI({ ...newAI, soft_name: e.target.value })}
              placeholder="e.g. GPT-4o"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Codename
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                @
              </span>
              <input
                type="text"
                value={newAI.codename}
                onChange={(e) =>
                  setAI({
                    ...newAI,
                    codename: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                placeholder="gpt-4o"
                className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-8 pr-4 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
          </div>

          {/* Tier accordion */}
          <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
            <button
              type="button"
              onClick={() => setTierOpen((p) => !p)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                <selectedTier.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Tier
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedTier.label}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  tierOpen && 'rotate-180'
                )}
              />
            </button>

            {tierOpen && (
              <div className="flex flex-col gap-1.5 border-t border-border p-3">
                {TIERS.map((tier) => {
                  const Icon = tier.icon
                  const isSelected = tier.value === newAI.tier
                  return (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => {
                        setAI((current) => ({ ...current, tier: tier.value }))
                        setTierOpen(false)
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all',
                        isSelected
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border bg-secondary/40 hover:bg-secondary/80'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                          isSelected
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border bg-secondary text-muted-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {tier.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {tier.description}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => addLanguageModel.mutate()}
            disabled={!newAI.soft_name || !newAI.codename}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            Add Model
          </button>
        </div>
      </div>
    </div>
  )
}
