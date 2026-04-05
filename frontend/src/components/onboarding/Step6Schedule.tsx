import { Sun, Clock, Zap } from 'lucide-react'

interface Props {
  digestType: 'daily' | 'custom'
  digestTime: string
  onTypeChange: (t: 'daily' | 'custom') => void
  onTimeChange: (t: string) => void
}

const QUICK_TIMES = [
  { label: 'Early Bird', time: '07:00', desc: '7:00 AM'  },
  { label: 'Morning',    time: '09:00', desc: '9:00 AM'  },
  { label: 'Noon',       time: '12:00', desc: '12:00 PM' },
  { label: 'Evening',    time: '18:00', desc: '6:00 PM'  },
]

function formatTime(t: string) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export default function Step6Schedule({ digestType, onTypeChange, digestTime, onTimeChange }: Props) {
  return (
    <div className="flex flex-col gap-4">

      {/* Type selection */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'daily'  as const, label: 'Daily Digest',  desc: 'Every morning at your chosen time', icon: Sun   },
          { key: 'custom' as const, label: 'Custom Time',   desc: 'Pick your exact preferred time',    icon: Clock },
        ].map(({ key, label, desc, icon: Icon }) => {
          const active = digestType === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTypeChange(key)}
              className={`
                relative p-5 rounded-xl border-[1.5px] text-left cursor-pointer
                transition-all duration-150
                ${active
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-muted-foreground/30 hover:bg-secondary/50'
                }
              `}
            >
              {active && (
                <div className="absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-150
                ${active ? 'bg-primary/10' : 'bg-secondary border border-border'}
              `}>
                <Icon size={18} className={active ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <h3 className={`text-sm font-semibold mb-0.5 ${active ? 'text-foreground' : 'text-secondary-foreground/80'}`}>{label}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </button>
          )
        })}
</div>

      {/* Quick presets */}
      <div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
          Quick select
        </p>
        <div className="grid grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {QUICK_TIMES.map(({ label, time, desc }) => {
            const active = digestTime === time
            return (
              <button
                key={time}
                type="button"
                onClick={() => onTimeChange(time)}
                className={`
                  py-3.5 px-2 cursor-pointer text-center transition-all duration-150
                  ${active ? 'bg-primary/10 border-b-2 border-b-primary' : 'bg-card hover:bg-secondary/50'}
                `}
              >
                <p className={`text-sm font-bold mb-0.5 ${active ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom time picker */}
      {digestType === 'custom' && (
        <div>
          <label className="text-xs font-medium text-muted-foreground tracking-wider block mb-1.5">
            Set exact time
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="time"
              value={digestTime}
              onChange={e => onTimeChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-all duration-150"
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {digestTime && (
        <div className="flex items-center gap-3 p-4 bg-card border border-primary/15 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-primary" />
          </div>
          <p className="text-sm text-secondary-foreground">
            Your digest arrives every day at{' '}
            <span className="text-primary font-bold">{formatTime(digestTime)}</span>
          </p>
        </div>
      )}
    </div>
  )
}
