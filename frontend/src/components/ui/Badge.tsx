import { X } from 'lucide-react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline'
  onRemove?: () => void
  className?: string
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:   'bg-primary/15 text-primary border-primary/30',
  success:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error:     'bg-red-500/15 text-red-400 border-red-500/30',
  outline:   'bg-transparent border-border text-muted-foreground hover:text-foreground',
}

export default function Badge({ children, variant = 'primary', onRemove, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all duration-150 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 cursor-pointer text-muted-foreground hover:text-destructive transition-colors duration-150 p-0 flex items-center"
          aria-label="Remove"
        >
          <X size={10} strokeWidth={2} />
        </button>
      )}
    </span>
  )
}
