'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PasswordField, TextField } from '@/components/auth/fields'
import useLoading from '@/hooks/useLoading'
import { AuthButton } from '@/components/ui/AuthButton'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const {loading, setLoading} = useLoading()
  const router =  useRouter()
  const [user, setCredentials] = useState({
    name: '',
    userName: '',
    email: '',
    password: ''
  })

  async function signUp(){
    try{
      setLoading(true)
      const result = await fetch('http://localhost:4000/sign-up', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      if(result.status == 201) router.push('/auth')
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col">
      <div className="mb-7">
        <h2 className="font-display text-4xl uppercase leading-none tracking-tight">
          Create account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Join Halcyon and start exploring in seconds.
        </p>
      </div>

      <form onSubmit={(e) => {e.preventDefault()}} className="flex flex-col gap-4">
        <TextField 
          label="User Name" 
          placeholder="@johndoe123..." 
          autoComplete="name" 
          value={user.userName}
          onChange={(e) => setCredentials({ ...user, userName: e.target.value })}
        />
        <TextField 
          label="Display Name" 
          placeholder="Ava Reyes" 
          autoComplete="name" 
          value={user.name}
          onChange={(e) => setCredentials({ ...user, name: e.target.value })}
        />
        
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={user.email}
          onChange={(e) => setCredentials({ ...user, email: e.target.value })}
        />
        
        <PasswordField
          placeholder="Create a password"
          autoComplete="new-password"
          value={user.password}
          onChange={(e) => setCredentials({ ...user, password: e.target.value })}
        />

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-pretty">
            I agree to the{' '}
            <span className="font-medium text-primary hover:underline">Terms</span> and{' '}
            <span className="font-medium text-primary hover:underline">Privacy Policy</span>.
          </span>
        </label>
        <AuthButton disabled={loading || Boolean(!user)} text={'Create account'} authFunction={signUp}/>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <span className="font-display text-lg leading-none text-primary">G</span>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}