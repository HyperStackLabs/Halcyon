'use client'
import { Trash2, X } from 'lucide-react'
import type { IUser } from '@/types/auth_types'

export function DeleteUserModal({
  user,
  onClose,
  CloseModal
}: {
  user: IUser
  onClose: () => void,
  CloseModal: () => void,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      <div className="animate-msg-in relative w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
        <button
          type="button"
          onClick={CloseModal}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10">
          <Trash2 className="h-5 w-5 text-destructive" />
        </span>

        <h2 id="delete-user-title" className="mt-4 font-display text-2xl uppercase tracking-tight">
          Delete account
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You&apos;re about to permanently delete{' '}
          <span className="font-medium text-foreground">{user.name}</span>{' '}
          <span className="text-muted-foreground">(@{user.userName})</span>. This action cannot be
          undone and all of their data will be removed.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3">
          <p className="truncate font-mono text-xs text-muted-foreground">id: {user._id}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={CloseModal}
            className="rounded-full border border-border bg-secondary/50 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete user
          </button>
        </div>
      </div>
    </div>
  )
}
