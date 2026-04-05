import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          const data = await res.json()
          navigate(data.onboarding_complete ? '/dashboard' : '/onboarding')
        } catch {
          navigate('/onboarding')
        }
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-6">
      {/* Logo */}
      <div className="text-lg font-bold tracking-[-0.02em]">
        <span className="text-primary">Job</span>
        <span className="text-foreground">Digest</span>
      </div>

      {/* Spinner */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9">
          <svg viewBox="0 0 36 36" fill="none" className="animate-spin-slow">
            <circle cx="18" cy="18" r="15" stroke="hsl(var(--border))" strokeWidth="3" />
            <path d="M18 3a15 15 0 0 1 15 15" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-sm text-muted-foreground font-medium">
          Signing you in…
        </div>
      </div>
    </div>
  )
}
