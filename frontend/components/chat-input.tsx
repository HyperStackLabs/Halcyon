'use client'
import { ArrowUp, Globe, Paperclip } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import useFetchUser from '@/hooks/useFetchUser'
import { aiModelInterface } from '@/types/model_types'
import getAIModels from '@/hooks/getAIDatabase'
import XFetch from '@/lib/xfetch'
import Selector from './model-selector'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChatMessage } from '@/types/types'
import { ErrorToast } from './ui/errorToaster'

export function ChatInput({chatID}: {chatID?: string}) {
  const [modelID, setModel] = useState('')
  const router = useRouter()
  const [errorMessage, setError] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const {data = []} = getAIModels()
  const [userMessage, editMessage] = useState('')
  const {user} = useFetchUser()
  const [searchMode, setSearchMode] = useState(false)
  const currentModel = data.find((model: aiModelInterface) => model._id === modelID) ?? data[0]
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function assignableFunction(message: string, LLM: string) {
    const response = await XFetch('http://localhost:4000/send-prompt', {
      method: 'POST',
      body: JSON.stringify({ userMessage: message, LLM, user: user?.name, convoId: chatID}),
    })
    const res = await response.json()
    if (!response.ok) {
      throw new Error(res.message ?? 'Unable to send message.')
    }
    router.push(`/chat/${res.convoId}`)
  }

  const sendPrompt = useMutation({
    mutationFn: ({ message, llm }: { message: string; llm: string }) =>
      assignableFunction(message, llm),
    onMutate: () => {
      queryClient.setQueryData(
        ['messages', chatID],
        (messages: ChatMessage[] = []) => [
          ...messages,
          {
          _id: `temp-${Date.now()}`,
          role: 'user',
          content: userMessage,
          createdAt: new Date().toISOString(),
        }
        ]
      )
    },
    onSuccess: () => {
      editMessage('')
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: (error) => {
      setError(error.message)
      console.log(error.message)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!currentModel) return

        sendPrompt.mutate({
          message: userMessage,
          llm: currentModel.codename,
        })
      }}
      className="glass w-full rounded-3xl border border-border p-2.5 shadow-2xl shadow-primary/5"
    >
      <label htmlFor="prompt" className="sr-only">
        Message Halcyon
      </label>
      <textarea
        id="prompt"
        value={userMessage}
        onChange={(e) => editMessage(e.target.value)}
        rows={1}
        placeholder="Ask Halcyon anything..."
        className="max-h-40 disabled:opacity-50 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Attach a file"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setSearchMode(!searchMode)}
            aria-label="Search the web"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground cursor-pointer transition-colors ${searchMode && 'bg-accent text-foreground'}`}
          >
            <Globe className="h-4.5 w-4.5" />
          </button>
          <div
            ref={wrapperRef}
            className="relative inline-block"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen((open) => !open)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors',
                open
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <img className="h-4 w-4" src={currentModel?.image} alt={currentModel?.soft_name} />
              {currentModel?.soft_name}
            </button>

            {open && (
              <Selector AIModels={data} modelID={modelID} setModel={setModel} setOpen={setOpen}/>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={sendPrompt.isPending || !userMessage || !currentModel}
          aria-label="Send message"
          className={`inline-flex ${sendPrompt.isPending ? 'cursor-not-allowed opacity-50' : 'opacity-100 cursor-pointer'} h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-100 disabled:hover:scale-105 disabled:active:scale-95`}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        {errorMessage && (
          <ErrorToast message={errorMessage} onClose={() => setError('')}/>
        )}
      </div>
    </form>
  )
}
