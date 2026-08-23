import XFetch from "@/lib/xfetch"
import { useQuery } from "@tanstack/react-query"
export default function useConvoNames(){
    async function getConversations(){
        const response = await XFetch('http://localhost:4000/get-conversations')
        const result = await response.json()
        return result
    }
    const {data = []} = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations
    })
    return {data}
}