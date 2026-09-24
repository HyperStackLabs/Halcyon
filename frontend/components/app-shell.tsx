'use client'

import Link from 'next/link'
import {
  ChevronUp,
  Compass,
  Library,
  LogOut,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
  Pencil,
  Settings,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BrandLogo, BrandMark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import useFetchUser from '@/hooks/useFetchUser'
import { AuthButton } from './ui/AuthButton'
import XFetch from '@/lib/xfetch'
import useConvoNames from '@/hooks/useConvoNames'
import { Conversation } from '@/types/types'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { DeleteConversationModal } from './delete-conversation-modal'

const NAV = [
  { label: 'New chat', href: '/', icon: MessageSquarePlus },
  { label: 'Discover', href: '/', icon: Compass },
  { label: 'Leaderboard', href: '/', icon: Library },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [conversationMenu, setConversationMenu] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const conversationListRef = useRef<HTMLDivElement>(null)
  const { user, setCurrentUser } = useFetchUser()
  const {data} = useConvoNames()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [deleteTrigger, setDeleteTrigger] = useState(false)
  const [convoDetails, setConvoDetails] = useState({
    title: '',
    id: ''
  })
  const path = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleConversationMenuOutside(e: MouseEvent) {
      if (
        conversationListRef.current &&
        !conversationListRef.current.contains(e.target as Node)
      ) {
        setConversationMenu(null)
      }
    }
    document.addEventListener('mousedown', handleConversationMenuOutside)
    return () => document.removeEventListener('mousedown', handleConversationMenuOutside)
  }, [])

  async function signOut(){
    setUserMenuOpen(false)
    const response = await XFetch('http://localhost:4000/sign-out', {
      method: 'POST'
    })
    if(response.ok) setCurrentUser(null)
  }
  async function deleteConvo(_id: string){
    const response = await XFetch('http://localhost:4000/delete-conversation', {
      method: 'DELETE',
      body: JSON.stringify({_id}),
    })
    if (!response.ok) {
      throw new Error('Failed to delete conversation')
    }

    queryClient.removeQueries({ queryKey: ['messages', _id] })
    await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    setDeleteTrigger(false)
    setConversationMenu(null)

    if (path === `/chat/${_id}`) {
      router.push('/')
    }
  }
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.userName?.[0]?.toUpperCase()

  return (
    <div className="flex min-h-svh w-full bg-background">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-300 ease-out lg:sticky lg:top-0 lg:h-svh lg:self-start lg:translate-x-0',
          collapsed ? 'lg:w-19' : 'lg:w-72',
          mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-5">
          {collapsed ? <BrandMark className="mx-auto" /> : <BrandLogo />}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user?.userName ? (
          <>
            <nav
              className={`${
                user.userName ? 'min-h-0 flex-1' : 'h-screen items-end p-2 justify-center'
              } flex flex-col gap-1 px-3`}
            >
              {NAV.map((item, i) => {
                const Icon = item.icon
                const primary = i === 0
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      collapsed && 'lg:justify-center lg:px-0',
                      primary
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
                  </Link>
                )
              })}

              {/* Conversation list — empty by design, no mock chats */}
              <div ref={conversationListRef} className={cn('sidebar-scrollbar mt-6 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto', collapsed && 'lg:hidden')}>
                <p className="px-3 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                  Recent
                </p>
                {data?.length !== 0 ? data?.map((chat: Conversation)  => {
                  const menuOpen = conversationMenu === chat._id
                  return <div key={chat._id} className="group relative">
                    <Link
                        href={`/chat/${chat._id}`}
                        onClick={() => setConversationMenu(null)}
                        className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2.5 pr-10 text-sm font-medium transition-colors",
                            path === `/chat/${chat._id}` && "bg-accent text-accent-foreground",
                            "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <span className="truncate">
                            {chat.title || "Untitled conversation"}
                        </span>
                    </Link>
                    <button
                      type="button"
                      aria-label={`Conversation actions for ${chat.title || 'Untitled conversation'}`}
                      aria-expanded={menuOpen}
                      onClick={() => setConversationMenu(menuOpen ? null : chat._id)}
                      className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/50 opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-sidebar-foreground group-hover:opacity-100 focus:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen && (
                      <div
                        role="menu"
                        className="absolute right-1 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => setConversationMenu(null)}
                          className="flex cursor-pointer w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Rename
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {chat._id && setDeleteTrigger(true), setConvoDetails({
                            id: chat._id,
                            title: chat.title
                          }), console.log(convoDetails)}}
                          className="flex cursor-pointer w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                }) : <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sidebar-border/80 px-4 py-8 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground/60">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-sidebar-foreground/55 text-balance">
                    Your conversations will appear here once you start chatting.
                  </p>
                </div>}
              </div>
            </nav>
            <div
              ref={userMenuRef}
              className="relative flex items-center gap-2 border-t border-sidebar-border p-3"
            >
              {/* Dropup menu */}
              {userMenuOpen && (
                <div
                  role="menu"
                  className={cn(
                    'absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg',
                    'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150',
                    collapsed && 'lg:left-3 lg:right-auto lg:w-56',
                  )}
                >
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex cursor-pointer min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left transition-colors hover:bg-sidebar-accent"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {initials}
                  </span>
                )}
                <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-sidebar-foreground/50">
                    @{user?.userName}
                  </p>
                </div>
                <ChevronUp
                  className={cn(
                    'h-4 w-4 shrink-0 text-sidebar-foreground/40 transition-transform duration-200',
                    userMenuOpen && 'rotate-180',
                    collapsed && 'lg:hidden',
                  )}
                />
              </button>

              {/* Collapse toggle */}
              <button
                type="button"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setCollapsed((v) => !v)}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:inline-flex"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-end justify-center px-3 py-4 flex-col">
            <AuthButton text="Register" type="primary" authFunction={() => {}} />
            <AuthButton text="Register" type="secondary" authFunction={() => {}} />
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 [animation:pulse-ring_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Halcyon · online
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Theme</span>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
      {deleteTrigger && <DeleteConversationModal onConfirm={() => deleteConvo(convoDetails.id)} conversationId={convoDetails.id} onClose={() => setDeleteTrigger(false)}/>}
    </div>
  )
}
