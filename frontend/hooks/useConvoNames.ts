import XFetch from "@/lib/xfetch"
import { Conversation } from "@/types/types"
import { useEffect, useState } from "react"

export default function useConvoNames(){
    const [collection, setCollection] = useState<Conversation[] | undefined>()
    useEffect(() => {
       async function getConversations(){
            try{
                const response = await XFetch('http://localhost:4000/get-conversations')
                const res = await response.json()
                if(response.ok) setCollection(res)
                console.log(collection)
            }catch(error){
                console.log(error)
            }
        }
        getConversations()
    }, [])
    return collection
}