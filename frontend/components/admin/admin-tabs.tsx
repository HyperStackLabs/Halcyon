'use client'
import { useState } from 'react'
import { Bot, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UsersTab } from './users-tab'
import { ModelsTab } from './models'

const TABS = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'models', label: 'AI Models', icon: Bot },
] as const

type TabId = (typeof TABS)[number]['id']

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('users')

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Admin sections"
        className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-card/60 p-1"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'users' ? <UsersTab /> : <ModelsTab />}
    </div>
  )
}
