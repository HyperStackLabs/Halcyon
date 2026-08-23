'use client'

import Link from 'next/link'
import { PasswordField, TextField } from '@/components/auth/fields'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import XFetch from '@/lib/xfetch'
import { AuthButton } from '@/components/ui/AuthButton'
import useFetchUser from '@/hooks/useFetchUser'
import useLoading from '@/hooks/useLoading'
import { ErrorToast } from '@/components/ui/errorToaster'

export default function LoginPage() {
  const router = useRouter()
  const {loading, setLoading} = useLoading()
  const [errorMessage, setError] = useState('')
  const {user} = useFetchUser()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  async function Login() {
    try {
      if(user) return
      setLoading(true)
      const response = await XFetch('http://localhost:4000/log-in', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      if(!response.ok){
        setError(data.message || 'Login failed.')
      }
      else{
        setLoading(false)
        router.push('/')
        return
      }
      setCredentials({
        email: '',
        password: '',
        rememberMe: true
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setError(message)
      console.error('Failed to log in:', message)
    }finally{
      setLoading(false)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    Login()
  }

  return (
    <div className="flex flex-col">
      <div className="mb-7">
        <h2 className="font-display text-4xl uppercase leading-none tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to continue your conversations with Halcyon.
        </p>
      </div>
      {errorMessage && (
        <ErrorToast
          onClose={() => setError('')}
          message={errorMessage}
        />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        
        <PasswordField 
          autoComplete="current-password" 
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={credentials.rememberMe}
              onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
            />
            Remember me
          </label>
          <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
            Forgot password?
          </span>
        </div>

        <AuthButton disabled={Boolean(user) || loading} text={'Log in'} authFunction={Login}/>
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
        New to Halcyon?{' '}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>

  )
}