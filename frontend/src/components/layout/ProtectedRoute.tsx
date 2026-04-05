import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authstore'
import Navbar from './Navbar'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="w-9 h-9">
          <svg viewBox="0 0 36 36" fill="none" className="animate-spin-slow">
            <circle cx="18" cy="18" r="15" stroke="hsl(var(--border))" strokeWidth="3" />
            <path d="M18 3a15 15 0 0 1 15 15" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          Loading…
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
