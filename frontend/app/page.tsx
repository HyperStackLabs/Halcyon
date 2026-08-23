import { AppShell } from '@/components/app-shell'
import { Capabilities } from '@/components/home/capabilities'
import { Hero } from '@/components/home/hero'
import { PromptCards } from '@/components/home/prompt-cards'

export default function HomePage() {
  return (
    <AppShell>
      <Hero />
      <PromptCards />
      <Capabilities />
    </AppShell>
  )
}
