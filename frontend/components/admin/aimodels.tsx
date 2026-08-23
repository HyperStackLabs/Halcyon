import { Trash2 } from 'lucide-react'
import { aiModelInterface } from '@/types/model_types'
import XFetch from '@/lib/xfetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const ModelComponent = ({model}: {model: aiModelInterface}) => {
  const queryClient = useQueryClient()
  const deleteModel = useMutation({
    mutationFn: async (_id: string) => {
      await XFetch('http://localhost:4000/ai-models', {
        method: 'DELETE',
        body: JSON.stringify({_id})
      })
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['models']
    }),
    onError: (error) => {
      console.log(error)
    }
  })
  return (
    <li
            key={model._id}
            className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/30 md:px-8"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary/50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.image || '/placeholder.svg'}
                  alt={`${model.soft_name} logo`}
                  className="h-full w-full object-contain"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{model.soft_name}</p>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {model.codename} · id: {model._id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteModel.mutate(model._id)}
              aria-label={`Delete ${model.soft_name}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
  )
}

export default ModelComponent