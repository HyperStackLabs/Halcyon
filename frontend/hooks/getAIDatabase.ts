import { useQuery } from "@tanstack/react-query";

export default function getAIModels(){
        async function fetchModels(){
            const res = await fetch('http://localhost:4000/ai-models')
            const response = await res.json()
            return response
        }
        const {data = []} = useQuery({
            queryKey: ['models'],
            queryFn: fetchModels
        })
    return {data}
}