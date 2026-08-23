'use client'
import { Copy, RefreshCcw, Trash } from 'lucide-react'
import { BrandMark } from '@/components/brand'
import { cn } from '@/lib/utils'
import useChatLog from '@/hooks/useChatLog'
import useLoading from '@/hooks/useLoading'
import useFetchUser from '@/hooks/useFetchUser'
import { deleteMessage } from '@/lib/assistantActions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
function AssistantActions({ assignedFunction }: { assignedFunction: () => void }) {

  return (

    <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

      <button

        type="button"

        aria-label="Copy message"

        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"

      >

        <Copy className="h-3.5 w-3.5" />

      </button>

      <button

        type="button"
        aria-label="Good response"
        onClick={() => assignedFunction()}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Trash className="h-3.5 w-3.5" />

      </button>

      <button

        type="button"

        aria-label="Regenerate response"

        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"

      >

        <RefreshCcw className="h-3.5 w-3.5" />

      </button>

    </div>
  )
}

export function ChatMessages({ chatID }: { chatID: string }) {
    const {data} = useChatLog(chatID)
    const {loading} = useLoading()
    const queryClient = useQueryClient()
    const {user} = useFetchUser()
  function renderFormattedText(text: string) {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0
    if(!text) return null
    for (const match of text.matchAll(regex)) {
      const fullMatch = match[0];
      const index = match.index ?? 0;
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }
      if (fullMatch.startsWith("**")) {
        parts.push(
          <h1 className='font-bold' key={index}>{fullMatch.slice(2, -2)}</h1>,
        );
      } else {
        parts.push(<em key={index}>{fullMatch.slice(1, -1)}</em>);
      }
      lastIndex = index + fullMatch.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  }

  const deleteQuery = useMutation({
    mutationFn: (messageId: string) => deleteMessage(String(messageId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', chatID]
      })
    }
  })

  return (
    <div className={`mx-auto flex w-full max-w-3xl flex-col gap-6`}>
      {Array.isArray(data) ? data.map((msg, i) => {
        const isUser = msg.role === `user`
        const timeString = new Date(msg.createdAt).toLocaleTimeString([], { 
          hour: `2-digit`, 
          minute: `2-digit` 
        })
        return (
          <div
            key={msg._id}
            className={cn(
              `animate-msg-in group flex w-full gap-3`,
              isUser ? `justify-end` : `justify-start`,
            )}
            style={{ '--msg-delay': `${0.15 + i * 0.14}s` } as React.CSSProperties}
          >
            {!isUser && <BrandMark className={`mt-1 h-8 w-8 shadow-lg shadow-primary/25`} />}

            <div className={cn(`flex max-w-[82%] flex-col md:max-w-[72%]`, isUser && `items-end`)}>
              <div
                className={cn(
                  `rounded-2xl border bg-[var(--bubble-bg)] px-4 py-3 text-[15px] leading-relaxed text-[var(--bubble-fg)] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5`,
                  isUser
                    ? `rounded-br-md border-primary/40 shadow-primary/15 hover:border-primary/60 hover:shadow-primary/25`
                    : `rounded-bl-md border-[var(--bubble-border)] shadow-black/30 hover:border-primary/25`,
                )}
              >
                {renderFormattedText(msg.content)}
              </div>
              <div
                className={cn(
                  `mt-1.5 flex items-center justify-between gap-2 px-1`,
                  isUser ? `flex-row-reverse` : `flex-row`,
                )}
              >
                <span className={`text-[11px] font-medium text-muted-foreground/80`}>
                  {`${!isUser ? `${msg.model ? msg.model : 'UNDEFINED'} -` : ''} ${timeString}`}
                </span>
                {!isUser && <AssistantActions assignedFunction={() => deleteQuery.mutate(String(msg._id))}/>}
              </div>
            </div>
            {isUser && (
              <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground shadow-lg shadow-black/20`}>
                {user?.name && user?.name[0]}{user?.name.indexOf(' ') !== -1 ? user?.name[user.name.indexOf(' ') + 1] : null}
              </span>
            )}
          </div>
        )
      }) : <></>}
      {loading ? <div
        className={`animate-msg-in flex w-full gap-3`}
        style={{ '--msg-delay': `${0.15 + data.length * 0.14}s` } as React.CSSProperties}
      >
        <BrandMark className={`mt-1 h-8 w-8 shadow-lg shadow-primary/25`} />
        <div className={`flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--bubble-border)] bg-[var(--bubble-bg)] px-4 py-3.5 shadow-xl shadow-black/30 backdrop-blur-md`}>
          <span className={`sr-only`}>Halcyon is typing</span>
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className={`animate-typing-dot h-2 w-2 rounded-full bg-primary`}
              style={{ '--dot-delay': `${d * 0.18}s` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      :
      <></>
      }
    </div>
  )
}

