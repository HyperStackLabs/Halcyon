import { IUser } from "@/types/auth_types";
import XFetch from "@/lib/xfetch";
import { useEffect, useState } from "react";

export default function useFetchUser(){
    const [user, setCurrentUser] = useState<IUser | null>()
    try{
        useEffect(() => {
        const fetchUser = async () => {
            const response = await XFetch('http://localhost:4000/verify-user')
            const res = await response.json()
            if(response.ok) setCurrentUser(res)
        }
        fetchUser()
        }, [])
    }catch(error){
        console.log(error)
    }
    return {user, setCurrentUser}
}