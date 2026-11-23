import { useQuery } from "@tanstack/react-query";
import useFetchUser from "./useFetchUser";
import { aiModelInterface } from "@/types/model_types";

export default function getAIModels(){
        async function fetchModels(){
            const res = await fetch('http://localhost:4000/ai-models')
            const response = await res.json()
            return response
        }
        let {data = [], isLoading, error} = useQuery({
            queryKey: ['models'],
            queryFn: fetchModels
        })
        const {user} = useFetchUser()
        if(user?.role.toLowerCase() !== 'admin'){
            data = data.filter((model: aiModelInterface) => model.type !== 'Agentic')
        }
    return {data, isLoading, error}
}