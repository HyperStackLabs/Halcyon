'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck, Trash2, UserRound, ChevronDown } from 'lucide-react'
import { DeleteUserModal } from '@/components/admin/delete-user-modal'
import { cn } from '@/lib/utils'
import { IUser } from '@/types/auth_types'
import XFetch from '@/lib/xfetch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

export function UsersTab() {
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null)
  const [ban, setRemovalType] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const query = useQueryClient()
    async function FetchUsers() {
      try {
        const res = await XFetch('http://localhost:4000/users', {
          method: 'POST',
        })
        const response = await res.json()
        return response
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    const {data} = useQuery({
      queryKey: ['users'],
      queryFn: FetchUsers,
    })

  const removeUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await XFetch('http://localhost:4000/delete-user', {
          method: 'DELETE',
          body: JSON.stringify({ id, ban })
      })
      if(!res.ok){
        throw new Error("Deleting user failed")
      }
    },
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ['users']
      })
      setUserToDelete(null)
    }},
)

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-start md:justify-between md:p-8 md:pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl uppercase tracking-tight">Users</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data?.length} registered accounts. Manage roles, limits, and removal.
            </p>
          </div>

          {/* Small Kick/Ban Accordion */}
          <div className="w-full shrink-0 md:w-56 rounded-xl border border-border bg-background shadow-sm">
            <button
              type="button"
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/40 rounded-xl"
            >
              <span>Action Mode: {ban ? 'Ban' : 'Kick'}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  accordionOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200 ease-in-out',
                accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 border-t border-border p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRemovalType(false)
                      setAccordionOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary/60 text-left',
                      !ban && 'bg-secondary/40 font-medium'
                    )}
                  >
                    Kick (Remove User)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRemovalType(true)
                      setAccordionOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 text-left',
                      ban && 'bg-destructive/10 font-medium'
                    )}
                  >
                    Ban (Permanent)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {data?.length > 0 && data.map((user: IUser) => (
            <li
              key={user._id}
              className="flex flex-col gap-4 p-5 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between md:px-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 font-display text-sm uppercase text-primary">
                  {user.profilePicture ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.profilePicture || '/placeholder.svg'}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                        user.role === 'admin'
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border bg-secondary/50 text-muted-foreground'
                      )}
                    >
                      {user.role === 'admin' ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <UserRound className="h-3 w-3" />
                      )}
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    @{user.userName} · {user.email}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground/70">
                    id: {user._id}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setUserToDelete(user)}
                  className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                  {ban ? 'Ban' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {userToDelete && (
        <DeleteUserModal CloseModal={() => setUserToDelete(null)} user={userToDelete} onClose={() => removeUser.mutate(userToDelete._id)} />
      )}
    </>
  )
}