import useLoading from '@/hooks/useLoading'
import React from 'react'
import { LoaderCircle } from 'lucide-react'
import { Button } from './button'
import useFetchUser from '@/hooks/useFetchUser'

export const AuthButton = ({text, authFunction, disabled}: {text: string, authFunction: () => void, disabled: boolean}) => {
    const {loading} = useLoading()
    const {user} = useFetchUser()
  return (
    <Button
          type="submit"
          disabled={disabled}
          onClick={authFunction}
          className={`disabled:opacity-50 $ flex justify-center items-center disabled:cursor-not-allowed mt-2 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]`}
        >
          {!loading ? text : <LoaderCircle className='animate-spin'/>}
        </Button>
  )
}
