import { AppShell } from '@/components/app-shell'
import { ChatInput } from '@/components/chat-input'
import { BrandMark } from '@/components/brand'
import { SkyBackground } from '@/components/sky-background'
import { ChatMessages } from '@/components/chat-messages'
export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  return (
    <AppShell>
      <div className="relative flex h-[calc(100svh-61px)] flex-col overflow-hidden bg-background">
        {/* Animated vector sky scene with 70/30 triangular split */}
        <SkyBackground />

        {/* Conversation title bar */}

        {/* Message thread */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-10">
          <ChatMessages chatID={chatId} />
        </div>

        {/* Composer — anchored in the dark lower triangle */}
        <div className="relative z-10 px-4 pb-5 pt-2 md:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <ChatInput chatID={chatId} />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Halcyon can make mistakes. Double-check anything important.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
