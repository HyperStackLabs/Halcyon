'use client'
import { AppShell } from '@/components/app-shell'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { useRouter } from 'next/navigation'
import useFetchUser from '@/hooks/useFetchUser'

export default function AdminPage() {
  const router = useRouter()
  const {user, setCurrentUser} = useFetchUser()
  if(user?.role == 'user'){
    router.push('/')
  }
  return (
    <AppShell>
        <main className="min-h-screen">
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
            <div
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            aria-hidden="true"
            />
            <div className="relative mx-auto w-full max-w-4xl px-4 pb-20 pt-14 md:pt-20">
            <header className="mb-10">
                <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-tight text-glow md:text-6xl">
                Admin <span className="text-primary">panel</span>
                </h1>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                Manage user accounts and configure the AI models available across Halcyon.
                </p>
            </header>
            <AdminTabs />
            </div>
        </section>
        </main>
    </AppShell>
  )
}