'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, ChangeEvent } from 'react'

type TextFieldProps = {
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function TextField({ 
  label, 
  type = 'text', 
  placeholder, 
  autoComplete,
  value,
  onChange 
}: TextFieldProps) {
  const id = useId()
  
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
    </div>
  )
}

type PasswordFieldProps = {
  label?: string
  placeholder?: string
  autoComplete?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function PasswordField({
  label = 'Password',
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  value,
  onChange,
}: PasswordFieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-input bg-background/60 pl-3.5 pr-11 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </div>
  )
}