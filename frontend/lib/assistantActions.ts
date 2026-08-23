import XFetch from "./xfetch"

export async function deleteMessage(messageID: string){
    try{
        const response = await XFetch('http://localhost:4000/chat', {
            method: 'DELETE',
            body: JSON.stringify({messageID})
        })
        const res = await response.json()
        return res
    }catch(error){
        console.log(error)
    }
}
export async function reprompt({messageID, user, LLM, userMessage}: {messageID: string, LLM: string, userMessage: string, user: string}){
    try{
        await XFetch('http://localhost:4000/reprompt-message', {
            method: 'POST',
            body: JSON.stringify({messageID, user, LLM, userMessage})
        })
    }catch(error){
        console.log(error)
    }
}