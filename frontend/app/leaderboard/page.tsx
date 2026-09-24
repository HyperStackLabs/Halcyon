import { AppShell } from '@/components/app-shell'
import Leaderboard from '@/components/leaderboard/leaderboard'
import React from 'react'

const Page = () => {
  return <>
    <AppShell>
        <Leaderboard />
    </AppShell>
  </>
}

export default Page