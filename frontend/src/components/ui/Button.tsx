import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'hero' | 'heroSecondary'
  isLoading?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

const SIZE_CLASSES: Record<string, string> = {
  xs:  'h-7 px-3 text-xs rounded-md',
  sm:  'h-8 px-4 text-sm rounded-lg',
  md:  'h-10 px-5 text-sm rounded-lg',
  lg:  'h-12 px-6 text-base rounded-xl',
  xl:  'h-14 px-10 text-lg rounded-full',
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  secondary: 'bg-secondary text-secondary-foreground border border-border hover:border-primary/30 hover:text-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  danger: 'text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  hero: 'bg-primary text-primary-foreground rounded-full px-6 py-3 text-base font-medium hover:bg-primary/90 transition-all duration-150 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_32px_hsl(var(--primary)/0.5)] disabled:opacity-40 disabled:cursor-not-allowed',
  heroSecondary: 'liquid-glass text-foreground rounded-full px-6 py-3 text-base font-medium hover:bg-white/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
}

export default function Button({
  children,
  variant = 'primary',
  isLoading,
  size = 'md',
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-sans cursor-pointer select-none
        ${SIZE_CLASSES[size]}
        ${VARIANT_CLASSES[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>Processing…</span>
        </>
      ) : children}
    </button>
  )
}
