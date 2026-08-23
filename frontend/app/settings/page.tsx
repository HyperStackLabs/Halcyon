'use client'
import { SettingsTabs } from '@/components/settings/settings-tab'
import { AppShell } from '@/components/app-shell'


export default function SettingsPage() {
  return (
    <AppShell>
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-160 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-3xl px-4 pb-20 pt-14 md:pt-20">
          <header className="mb-10">
            <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-tight text-glow md:text-6xl">
              Account <span className="text-primary">settings</span>
            </h1>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Keep your profile up to date and manage how you sign in to Halcyon.
            </p>
          </header>

          <SettingsTabs />
        </div>
      </section>
    </main>
    </AppShell>
  )
}
