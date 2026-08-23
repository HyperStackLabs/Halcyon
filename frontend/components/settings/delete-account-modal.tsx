'use client'

import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DeleteAccountModal({
  username,
  onClose,
  setOpen
}: {
  username: string
  onClose: () => void
  setOpen: (open: boolean) => void
}) {
  const [confirmText, setConfirmText] = useState('')
  
  var isMatch = confirmText === username

  return (
    <div
      className="fixed inset-0 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-destructive/30 bg-card shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5 pt-0.5">
              <h2 className="font-display text-xl uppercase tracking-tight text-destructive">
                Delete Account
              </h2>
              <p className="text-sm text-muted-foreground">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              All of your data, models, and settings will be{' '}
              <span className="font-medium text-destructive">
                permanently deleted
              </span>
              . This cannot be reversed.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Type{' '}
              <span className="font-mono font-semibold text-foreground">
                {username}
              </span>{' '}
              to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={username}
              autoComplete="off"
              className={cn(
                'rounded-xl border bg-secondary/50 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50',
                confirmText.length === 0
                  ? 'border-border focus:border-destructive/40'
                  : isMatch
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border focus:border-destructive/40'
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border p-6 pt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isMatch}
            onClick={onClose}
            className="inline-flex items-center cursor-pointer gap-2 rounded-full bg-destructive px-5 py-2 text-sm font-medium text-destructive-foreground transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}