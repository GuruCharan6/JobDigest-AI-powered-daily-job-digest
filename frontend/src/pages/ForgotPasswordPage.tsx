import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { resetPassword } from '../api/auth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { showToast } from '../components/ui/Toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FD = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FD) => {
    setLoading(true)
    const { error } = await resetPassword(data.email)
    setLoading(false)
    if (error) showToast.error(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <Link to="/" className="no-underline flex justify-center mb-9">
          <span className="text-lg font-bold tracking-[-0.02em] text-primary">
            Job<span className="text-foreground">Digest</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-9 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {sent ? (
            /* ── Sent state ── */
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1.5">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-10">
                A reset link has been sent to your email address. Follow the instructions to reset your password.
              </p>
              <Link to="/login" className="no-underline">
                <button className="
                  inline-flex items-center gap-1.5 bg-card border-[1.5px] border-border rounded-lg
                  text-sm font-medium text-secondary-foreground px-5 py-2.5 cursor-pointer
                  transition-all duration-150 hover:border-muted-foreground/30 hover:bg-secondary/50
                ">
                  <ArrowLeft size={15} /> Back to sign in
                </button>
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 className="text-xl font-bold text-foreground mb-1.5 tracking-[-0.02em]">
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Enter your email and we'll send a reset link
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Button type="submit" isLoading={loading} fullWidth size="lg">
                  Send reset link
                </Button>
              </form>
            </>
          )}
        </div>

        {!sent && (
          <div className="mt-6 text-center">
            <Link to="/login" className="
              inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline font-medium
              hover:text-primary transition-colors duration-150
            ">
              <ArrowLeft size={15} /> Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
