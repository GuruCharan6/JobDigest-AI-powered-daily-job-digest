import { FileText, PenLine, Sparkles, Zap } from 'lucide-react'

interface Props {
  value: 'resume' | 'manual' | null
  onChange: (v: 'resume' | 'manual') => void
}

export default function Step0Method({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Resume upload */}
      <button
        type="button"
        onClick={() => onChange('resume')}
        className={`
          relative p-6 rounded-xl border-[1.5px] text-left cursor-pointer
          transition-all duration-150
          ${value === 'resume'
            ? 'bg-primary/10 border-primary'
            : 'bg-card border-border hover:border-muted-foreground/30 hover:bg-secondary/50'
          }
        `}
      >
        {value === 'resume' && (
          <div className="absolute top-3.5 right-3.5 w-5.5 h-5.5 rounded-full bg-primary flex items-center justify-center w-5 h-5">
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        <div className={`
          w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-all duration-150
          ${value === 'resume'
            ? 'bg-primary/10'
            : 'bg-secondary border border-border'
          }
        `}>
          <FileText size={20} className={value === 'resume' ? 'text-primary' : 'text-muted-foreground'} />
        </div>

        <h3 className={`text-sm font-semibold mb-1 ${value === 'resume' ? 'text-foreground' : 'text-secondary-foreground/80'}`}>
          Upload Resume
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3.5">
          Upload your PDF and AI will auto-fill everything for you
        </p>

        <span className={`inline-flex items-center gap-1 text-xs font-medium ${value === 'resume' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Sparkles size={12} /> AI-powered · saves 5 mins
        </span>
      </button>

      {/* Manual */}
      <button
        type="button"
        onClick={() => onChange('manual')}
        className={`
          relative p-6 rounded-xl border-[1.5px] text-left cursor-pointer
          transition-all duration-150
          ${value === 'manual'
            ? 'bg-primary/10 border-primary'
            : 'bg-card border-border hover:border-muted-foreground/30 hover:bg-secondary/50'
          }
        `}
      >
        {value === 'manual' && (
          <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        <div className={`
          w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-all duration-150
          ${value === 'manual'
            ? 'bg-primary/10'
            : 'bg-secondary border border-border'
          }
        `}>
          <PenLine size={20} className={value === 'manual' ? 'text-primary' : 'text-muted-foreground'} />
        </div>

        <h3 className={`text-sm font-semibold mb-1 ${value === 'manual' ? 'text-foreground' : 'text-secondary-foreground/80'}`}>
          Fill Manually
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3.5">
          Enter your skills, roles, and preferences step-by-step yourself
        </p>

        <span className={`inline-flex items-center gap-1 text-xs font-medium ${value === 'manual' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Zap size={12} /> Full control · ~3 mins
        </span>
      </button>
    </div>
  )
}
