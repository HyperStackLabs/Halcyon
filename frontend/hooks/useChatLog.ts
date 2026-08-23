'use client'
import XFetch from "@/lib/xfetch"
import { useQuery } from "@tanstack/react-query"

export default function useChatLog(chatID?: string){
    if (!chatID) return
    const convoId = chatID

    async function getChatlog(){
      const request = await XFetch(`http://localhost:4000/chat?convoId=${encodeURIComponent(convoId)}`)
      const response = await request.json()
      if (request.ok) return response
    }
    const {data = []} = useQuery({
      queryKey: ['messages', chatID],
      queryFn: getChatlog
    })
  return {data}
}
