import { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Button from '../ui/Button'

interface WizardShellProps {
  step: number
  totalSteps: number
  title: string
  subtitle: string
  children: ReactNode
  onNext: () => void
  onBack?: () => void
  isLast?: boolean
  isLoading?: boolean
  canProceed?: boolean
  stepLabels: string[]
}

export default function WizardShell({
  step, totalSteps, title, subtitle, children,
  onNext, onBack, isLast, isLoading, canProceed = true, stepLabels,
}: WizardShellProps) {
  const pct = ((step - 1) / Math.max(totalSteps - 1, 1)) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <span className="text-lg font-bold tracking-[-0.02em] text-primary">
          Job<span className="text-foreground">Digest</span>
        </span>
      </div>

      {/* Wizard card */}
      <div className="w-full max-w-[640px] relative z-10">

        {/* Top area: step dots + progress + labels */}
        <div className="mb-7 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const done   = i + 1 < step
              const active = i === step - 1
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-150 ${
                    done ? 'w-1.5 bg-emerald-400' :
                    active ? 'w-3 bg-primary' : 'w-1.5 bg-border'
                  }`}
                />
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary transition-all duration-400 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Step labels */}
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-primary">{stepLabels[step - 1]}</span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
              Setup · Step {step}/{totalSteps}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-[-0.02em]">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Step content */}
          <div className="mb-7">{children}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-5 border-t border-border">
            <div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="cursor-pointer inline-flex items-center gap-1 px-3.5 py-2 bg-transparent border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              )}
            </div>
            <Button onClick={onNext} isLoading={isLoading} disabled={!canProceed} size="lg">
              {isLast ? (
                <><Check size={15} /> Complete Setup</>
              ) : (
                <>Continue <ChevronRight size={14} /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
