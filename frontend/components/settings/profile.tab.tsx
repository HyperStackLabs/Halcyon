'use client'

import useFetchUser from '@/hooks/useFetchUser'
import XFetch from '@/lib/xfetch'
import { Camera, ShieldCheck, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DeleteAccountModal } from './delete-account-modal'

type ProfileState = {
  profilePicture: string
  displayName: string
  userName: string
  email: string
}

export function ProfileTab() {
  const {user, setCurrentUser} = useFetchUser()
  const router = useRouter()
  const [open, setModalState] = useState(false)
  const [profile, setProfile] = useState({
    profilePicture: '',
    displayName: '',
    userName: '',
    email: ''
  })
  useEffect(() => {
    if(!user) return
      setProfile({
        profilePicture: user?.profilePicture ?? '',
        displayName: user.name ?? '',
        userName: user.userName ?? '',
        email: user.email ?? '',
      })
      console.log(profile)
  }, [user])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateField = (field: keyof ProfileState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size (max 2MB)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (file.size > 6 * 1024 * 1024) {
      alert('File size must be less than 6MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePicture: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }
  const goAdmin = async () => {
    const response = await XFetch('http://localhost:4000/go-admin', {
      method: 'PATCH',
      body: JSON.stringify({role: 'admin'})
    })
    if(response.ok) setCurrentUser({...user, role: 'admin'})
  }

  const handleRemovePicture = () => {
    setProfile((prev) => ({ ...prev, profilePicture: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function changeProfile(){
    const response = await XFetch('http://localhost:4000/change-profile', {
      method: 'PATCH',
      body: JSON.stringify({id: user?._id, profile})
    })
    if(response.ok) setProfile({
      userName: '',
      displayName: '',
      email: '',
      profilePicture: String(user?.profilePicture)
    })
  }
  async function deleteUser(){
    const response = await XFetch('http://localhost:4000/delete-account', {
      method: 'DELETE'
    })
    if(response.ok){
      setModalState(false)
      setCurrentUser(null)
      router.push('/auth/signup')
    }
  }

  const initials = profile.profilePicture
    ? null
    : profile?.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'AR'

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
        <h2 className="font-display text-2xl uppercase tracking-tight">Profile</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Update your personal information and how others see you.
        </p>

        <div className="mt-8 flex items-center gap-5">
          <div className="relative">
            {profile.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-border object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary/50 font-display text-2xl uppercase text-primary">
                {initials}
              </span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">Profile picture</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              PNG or JPG, up to 3MB. Square works best.
            </p>
            {profile.profilePicture && (
              <button
                type="button"
                onClick={handleRemovePicture}
                className="mt-1 w-fit text-xs text-destructive transition-colors hover:underline"
              >
                Remove picture
              </button>
            )}
          </div>
        </div>

        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            changeProfile()
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <input
              id="displayName"
              type="text"
              value={profile.displayName}
              onChange={updateField('displayName')}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="userName" className="text-sm font-medium text-muted-foreground">
              Username
            </label>
            <input
              id="userName"
              type="text"
              value={profile.userName}
              onChange={updateField('userName')}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={updateField('email')}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h3 className="text-base font-medium">Account actions</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Request elevated access or permanently remove your account.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={goAdmin}
            disabled={user?.role == 'admin'}
            className="inline-flex disabled:cursor-not-allowed disabled:opacity-50 disabled:animate-none cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground"
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            Go admin
          </button>
          <button
            type="button"
            onClick={() => setModalState(!open)}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
          {open && <DeleteAccountModal setOpen={setModalState} username={user?.userName} onClose={deleteUser}/>}
        </div>
      </section>
    </div>
  )
}