'use client'

import { useState } from 'react'
import { KeyRound, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileTab } from './profile.tab'
import { PasswordTab } from '@/components/settings/password-tab'
import { ApiSettings } from './api-tab'

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'password', label: 'Password', icon: KeyRound },
  { id: 'api', label: 'API', icon: KeyRound },
] as const

type TabId = (typeof TABS)[number]['id']

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Settings sections"
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
      {activeTab === 'profile' ? (
        <ProfileTab />
      ) : activeTab === 'password' ? (
        <PasswordTab />
      ) : (
        <ApiSettings />
      )}
    </div>
  )
}
