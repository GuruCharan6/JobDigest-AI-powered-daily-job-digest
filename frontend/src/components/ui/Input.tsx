import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  rightEl?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, rightEl, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          className={`
            w-full bg-input/50 border rounded-lg h-10 text-sm text-foreground
            placeholder:text-muted-foreground transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            disabled:opacity-40 disabled:cursor-not-allowed
            ${icon ? 'pl-9' : 'px-3'}
            ${rightEl ? 'pr-10' : 'pr-3'}
            ${error
              ? 'border-destructive focus:ring-destructive/30'
              : 'border-border hover:border-muted-foreground/30'
            }
            ${className}
          `.trim()}
          {...props}
        />

        {/* Right element */}
        {rightEl && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightEl}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-destructive tracking-wide">
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
)

Input.displayName = 'Input'
export default Input
