import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn, signInGoogle } from '../api/auth'
import { getProfile } from '../api/profile'
import { useAuthStore } from '../store/authstore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { showToast } from '../components/ui/Toast'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FD = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) })

  useEffect(() => { if (user) checkOnboarding() }, [user])

  const checkOnboarding = async () => {
    try {
      const { data } = await getProfile()
      navigate(data?.onboarding_complete ? '/dashboard' : '/onboarding')
    } catch { navigate('/onboarding') }
  }

  const onSubmit = async (data: FD) => {
    setLoading(true)
    const { error } = await signIn(data.email, data.password)
    setLoading(false)
    if (error) showToast.error(error.message)
    else showToast.success('Welcome back')
  }

  const handleGoogle = async () => {
    setGLoading(true)
    const { error } = await signInGoogle()
    setGLoading(false)
    if (error) showToast.error(error.message)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">

      <div className="w-full max-w-[440px] relative z-10 animate-fade-in">

        {/* Logo */}
        <Link to="/" className="no-underline flex justify-center mb-9">
          <span className="text-lg font-bold tracking-[-0.02em] text-primary">
            Job<span className="text-foreground">Digest</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-9 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            Sign in to see today's job matches
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="
              w-full flex items-center justify-center gap-2.5 py-2.5 bg-card border-[1.5px] border-border
              rounded-lg text-sm font-medium text-secondary-foreground cursor-pointer
              transition-all duration-150 hover:border-muted-foreground/30 hover:bg-secondary/50
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {gLoading ? (
              <svg className="animate-spin h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              {...register('email')}
              error={errors.email?.message}
            />
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-muted-foreground font-medium no-underline hover:text-primary transition-colors duration-150">
                  Forgot?
                </Link>
              </div>
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Your password"
                icon={<Lock size={16} />}
                rightEl={
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="bg-transparent border-none text-muted-foreground cursor-pointer p-0 flex items-center transition-colors hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            <Button type="submit" isLoading={loading} fullWidth size="lg">
              Sign in <ArrowRight size={15} />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary no-underline font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
