'use client'
import XFetch from '@/lib/xfetch'
import { KeyRound } from 'lucide-react'
import { useState } from 'react'

const FIELDS = [
  { id: 'currentPassword', label: 'Current password', placeholder: 'Enter your current password' },
  { id: 'newPassword', label: 'New password', placeholder: 'At least 6 characters' },
  { id: 'confirmPassword', label: 'Confirm new password', placeholder: 'Repeat your new password' },
]

export function PasswordTab() {
  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  async function changePassword(){
    if(credentials.newPassword !== credentials.confirmPassword) return
    await XFetch('http://localhost:4000/change-password',
      {
        method: 'PATCH',
        body: JSON.stringify({currentPassword: credentials.currentPassword, newPassword: credentials.newPassword })
      }
    )
  }
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50">
          <KeyRound className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight">Password</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Choose a strong password you haven&apos;t used elsewhere.
          </p>
        </div>
      </div>

      <form className="mt-8 flex max-w-md flex-col gap-5">
        {FIELDS.map((field) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label htmlFor={field.id} className="text-sm font-medium text-muted-foreground">
              {field.label}
            </label>
            <input
              id={field.id}
              type="password"
              value={credentials[field.id as keyof typeof credentials]}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  [field.id]: e.target.value,
                }))
              }
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>
        ))}
        <div className="mt-2">
          <button
            type="button"
            onClick={changePassword}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            Update password
          </button>
        </div>
      </form>
    </section>
  )
}
