'use client'

import React, { useEffect, useRef } from 'react'
import { Copy, RefreshCcw, ThumbsDown, ThumbsUp, Trash } from 'lucide-react'
import { BrandMark } from '@/components/brand'
import { cn } from '@/lib/utils'
import useChatLog from '@/hooks/useChatLog'
import useLoading from '@/hooks/useLoading'
import useFetchUser from '@/hooks/useFetchUser'
import { deleteMessage, modelRating } from '@/lib/assistantActions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function InlineText({ text }: { text: string }) {
  if (!text) return null

  const inlineRegex = /(<a>[\s\S]*?<\/a>|\[[^\]]+\]\([^)]+\)|`[^`\n]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(inlineRegex)) {
    const fullMatch = match[0]
    const index = match.index ?? 0

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index))
    }

    if (fullMatch.startsWith('`') && fullMatch.endsWith('`')) {
      parts.push(
        <code
          key={index}
          className="rounded border border-border/50 bg-black/20 px-1.5 py-0.5 font-mono text-[13px] font-medium text-primary"
        >
          {fullMatch.slice(1, -1)}
        </code>
      )
    } else if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
      parts.push(
        <strong key={index} className="font-semibold text-foreground">
          {fullMatch.slice(2, -2)}
        </strong>
      )
    } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
      parts.push(
        <em key={index} className="italic">
          {fullMatch.slice(1, -1)}
        </em>
      )
    } else if (fullMatch.startsWith('<a>') && fullMatch.endsWith('</a>')) {
      const rawUrl = fullMatch.slice(3, -4).trim()
      const href = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
      parts.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
        >
          {rawUrl}
        </a>
      )
    } else if (fullMatch.startsWith('[') && fullMatch.includes('](')) {
      const label = fullMatch.slice(1, fullMatch.indexOf(']('))
      const url = fullMatch.slice(fullMatch.indexOf('](') + 2, -1).trim()
      const href = /^https?:\/\//i.test(url) ? url : `https://${url}`
      parts.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
        >
          {label}
        </a>
      )
    }

    lastIndex = index + fullMatch.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

type Block =
  | { type: 'code'; language?: string; content: string }
  | { type: 'header'; content: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'paragraph'; content: string }

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', language: lang, content: codeLines.join('\n') })
      continue
    }

    const headerMatch = line.match(/^<header>(.*?)<\/header>$/) || line.match(/^#{1,3}\s+(.*)$/)
    if (headerMatch) {
      blocks.push({ type: 'header', content: headerMatch[1] })
      i++
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^<header>(.*?)<\/header>$/) &&
      !lines[i].match(/^#{1,3}\s+(.*)$/) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join('\n') })
    }
  }

  return blocks
}

function FormattedMessage({ content }: { content: string }) {
  const blocks = parseBlocks(content)

  return (
    <div className="flex flex-col gap-2.5 text-[14.5px] leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header':
            return (
              <h3 key={idx} className="pt-1 text-base font-bold tracking-tight text-foreground">
                <InlineText text={block.content} />
              </h3>
            )

          case 'ul':
            return (
              <ul key={idx} className="my-1 list-disc space-y-1.5 pl-5 marker:text-primary/70">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            )

          case 'ol':
            return (
              <ol key={idx} className="my-1 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-primary/70">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    <InlineText text={item} />
                  </li>
                ))}
              </ol>
            )

          case 'code':
            return (
              <div
                key={idx}
                className="my-1.5 overflow-hidden rounded-lg border border-border/40 bg-black/40 text-xs shadow-inner"
              >
                {block.language && (
                  <div className="border-b border-border/30 bg-muted/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {block.language}
                  </div>
                )}
                <pre className="overflow-x-auto p-3 font-mono leading-normal text-foreground/90">
                  <code>{block.content}</code>
                </pre>
              </div>
            )

          case 'paragraph':
          default:
            return (
              <p key={idx} className="whitespace-pre-wrap">
                <InlineText text={block.content} />
              </p>
            )
        }
      })}
    </div>
  )
}

function AssistantActions({ assignedFunction }: { assignedFunction: () => void }) {
  const buttonStyle =
    'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'

  return (
    <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <button type="button" aria-label="Thumbs up" onClick={assignedFunction} className={buttonStyle}>
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="Thumbs down" className={buttonStyle}>
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="Copy message" className={buttonStyle}>
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="Delete message" onClick={assignedFunction} className={buttonStyle}>
        <Trash className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="Regenerate message" className={buttonStyle}>
        <RefreshCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ChatMessages({ chatID }: { chatID: string }) {
  const { data } = useChatLog(chatID)
  const { loading } = useLoading()
  const queryClient = useQueryClient()
  const { user } = useFetchUser()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data?.length) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [data])

  const deleteQuery = useMutation({
    mutationFn: (messageId: string) => deleteMessage(String(messageId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatID] })
    },
  })

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {Array.isArray(data) &&
        data.map((msg, i) => {
          const isUser = msg.role === 'user'
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div
              key={msg._id}
              className={cn(
                'animate-msg-in group flex w-full gap-3',
                isUser ? 'justify-end' : 'justify-start'
              )}
              style={{ '--msg-delay': `${0.15 + i * 0.14}s` } as React.CSSProperties}
            >
              {!isUser && <BrandMark className="mt-1 h-8 w-8 shadow-lg shadow-primary/25" />}

              <div className={cn('flex max-w-[82%] flex-col md:max-w-[75%]', isUser && 'items-end')}>
                <div
                  className={cn(
                    'break-words rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5',
                    isUser
                      ? 'rounded-br-md border-primary/40 bg-[var(--bubble-bg)] text-[var(--bubble-fg)] shadow-primary/15 hover:border-primary/60 hover:shadow-primary/25'
                      : 'rounded-bl-md border-[var(--bubble-border)] bg-[var(--bubble-bg)] text-[var(--bubble-fg)] shadow-black/30 hover:border-primary/25'
                  )}
                >
                  <FormattedMessage content={msg.content} />
                </div>

                <div
                  className={cn(
                    'mt-1.5 flex items-center justify-between gap-2 px-1',
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <span className="text-[11px] font-medium text-muted-foreground/80">
                    {!isUser && `${msg.model || 'Halcyon'} • `}
                    {timeString}
                  </span>
                  {!isUser && i === data.length - 1 && (
                    <AssistantActions assignedFunction={() => deleteQuery.mutate(String(msg._id))} />
                  )}
                </div>
              </div>

              {isUser && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground shadow-lg shadow-black/20">
                  {userInitials}
                </span>
              )}
            </div>
          )
        })}

      {loading && (
        <div
          className="animate-msg-in flex w-full gap-3"
          style={{ '--msg-delay': `${0.15 + (data?.length || 0) * 0.14}s` } as React.CSSProperties}
        >
          <BrandMark className="mt-1 h-8 w-8 shadow-lg shadow-primary/25" />
          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--bubble-border)] bg-[var(--bubble-bg)] px-4 py-3.5 shadow-xl shadow-black/30 backdrop-blur-md">
            <span className="sr-only">Halcyon is typing</span>
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="animate-typing-dot h-2 w-2 rounded-full bg-primary"
                style={{ '--dot-delay': `${d * 0.18}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}