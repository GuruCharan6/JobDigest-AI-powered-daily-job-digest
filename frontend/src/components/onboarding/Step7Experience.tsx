import { useState, useEffect } from 'react'
import { TrendingUp, Zap, Star, Crown, GraduationCap } from 'lucide-react'

const LEVELS = [
  { min: 0,  max: 0,  label: 'Fresher',   desc: 'Entry-level, internships & graduate roles',     icon: GraduationCap, color: '#ec4899', tip: "Entry-level, fresher & graduate jobs filtered for 0–1yr roles."         },
  { min: 1,  max: 2,  label: 'Junior',    desc: 'Junior roles, early career positions',           icon: TrendingUp,    color: '#f97316', tip: "Junior roles matched, senior/lead excluded."                            },
  { min: 3,  max: 5,  label: 'Mid-level', desc: 'Mid-level & individual contributor roles',       icon: Zap,           color: '#8b5cf6', tip: "Mid-level positions suited to your experience."                         },
  { min: 6,  max: 10, label: 'Senior',    desc: 'Senior, lead & specialist positions',            icon: Star,          color: '#6366f1', tip: "Senior and lead roles prioritised in your digest."                      },
  { min: 11, max: 99, label: 'Expert',    desc: 'Principal, staff & architect-level roles',       icon: Crown,         color: '#eab308', tip: "Expert, principal and architect roles matched for you."                 },
]

function deriveLevel(years: number) {
  return LEVELS.find(l => years >= l.min && years <= l.max) ?? LEVELS[0]
}

interface Props { value: number; onChange: (years: number) => void }

export default function Step7Experience({ value, onChange }: Props) {
  const [raw, setRaw] = useState<string>(value === 0 ? '' : String(value))

  useEffect(() => { setRaw(value === 0 ? '' : String(value)) }, [])

  const years = raw === '' ? 0 : Math.max(0, Math.min(50, parseInt(raw, 10) || 0))
  const level = deriveLevel(years)
  const Icon  = level.icon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 2)
    setRaw(cleaned)
    const parsed = cleaned === '' ? 0 : Math.max(0, Math.min(50, parseInt(cleaned, 10) || 0))
    onChange(parsed)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Input */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-1.5">
          Years of experience
        </label>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Enter a number. Type <span className="text-foreground font-semibold">0</span> if you are a fresher or just graduated.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={raw}
            onChange={handleChange}
            maxLength={2}
            className="w-[72px] py-3 text-center text-2xl font-bold rounded-lg outline-none border-2 transition-colors duration-150"
            style={{
              borderColor: level.color,
              color: level.color,
              background: `${level.color}10`,
            }}
          />
          <span className="text-sm text-muted-foreground">
            year{years !== 1 ? 's' : ''} of experience
          </span>
        </div>
      </div>

      {/* Live level card */}
      <div
        className="flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-150"
        style={{
          background: `${level.color}08`,
          borderColor: `${level.color}25`,
        }}
      >
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
             style={{ background: `${level.color}12` }}>
          <Icon size={20} color={level.color} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full border"
                  style={{ background: `${level.color}15`, borderColor: `${level.color}30`, color: level.color }}>
              {level.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{level.tip}</p>
        </div>
      </div>

      {/* Quick chips */}
      <div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
          Quick select
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 5, 7, 10].map(yr => {
            const active = years === yr
            return (
              <button
                key={yr}
                onClick={() => { setRaw(yr === 0 ? '' : String(yr)); onChange(yr) }}
                className={`
                  px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer
                  transition-all duration-150
                  ${active ? 'border-[1.5px]'
                  : 'bg-card border-[1.5px] border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/10'
                }
                `}
                style={active ? {
                  background: `${level.color}12`,
                  borderColor: level.color,
                  color: level.color,
                } : {}}
              >
                {yr === 0 ? 'Fresher' : `${yr}yr`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2.5 p-4 bg-primary/10 border border-primary/15 rounded-lg">
        <Zap size={14} className="text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This sets your experience level and controls which jobs appear in your digest.
          You can update it anytime from your dashboard.
        </p>
      </div>
    </div>
  )
}
