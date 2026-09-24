'use client'

import XFetch from '@/lib/xfetch'
import { Trash2, X } from 'lucide-react'

export function DeleteConversationModal({
  conversationId,
  onClose,
  onConfirm
}: {
  conversationId: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-conversation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-background/70 backdrop-blur-sm"
      />

      <div className="animate-msg-in relative w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
          <Trash2 className="h-5 w-5" />
        </span>

        <h2 id="delete-conversation-title" className="mt-4 font-display text-2xl uppercase tracking-tight">
          Delete conversation?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This will permanently remove{' '}
          <span className="font-medium text-foreground">{conversationId} conversation</span>.
          This action cannot be undone.
        </p>

        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="truncate text-sm text-muted-foreground">{conversationId}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-border bg-secondary/50 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition-all hover:-translate-y-0.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete conversation
          </button>
        </div>
      </div>
    </div>
  )
}
