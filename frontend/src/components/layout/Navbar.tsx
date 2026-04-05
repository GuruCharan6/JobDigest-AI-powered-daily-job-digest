import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authstore'
import { signOut } from '../../api/auth'
import { LogOut, User } from 'lucide-react'
import { showToast } from '../ui/Toast'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      logout()
      showToast.success('Signed out')
      navigate('/login')
    } catch {
      showToast.error('Failed to sign out')
    }
  }

  return (
    <nav className="sticky top-0 z-50 liquid-glass">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-lg font-bold tracking-[-0.02em] text-primary no-underline"
        >
          Job<span className="text-foreground">Digest</span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-4 ml-auto">
            {/* User email */}
            <div
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <User size={14} className="text-muted-foreground/60 flex-shrink-0" />
              <span className="truncate max-w-40">{user.email}</span>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3.5 py-1.5 hover:border-primary/30 hover:text-foreground hover:bg-secondary/50 transition-all duration-150 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
      {/* Gradient divider */}
      <div className="gradient-divider" />
    </nav>
  )
}
