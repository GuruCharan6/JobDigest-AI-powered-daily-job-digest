import { Building2, Rocket, Wifi, Landmark, Heart, Globe } from 'lucide-react'

const TYPES = [
  { id: 'mnc',     label: 'MNC / Enterprise',  desc: 'Google, Microsoft, Amazon, Infosys…',  icon: Building2 },
  { id: 'startup', label: 'Startups',           desc: 'Seed to Series D, fast-growth',         icon: Rocket    },
  { id: 'remote',  label: 'Remote-first',       desc: 'Fully distributed, async-first teams',  icon: Wifi      },
  { id: 'govt',    label: 'Government / PSU',   desc: 'ISRO, DRDO, public sector enterprises', icon: Landmark  },
  { id: 'ngo',     label: 'NGO / Non-profit',   desc: 'Social impact, mission-driven orgs',    icon: Heart     },
  { id: 'all',     label: 'All Companies',      desc: 'Show me everything — no filter',        icon: Globe     },
]

interface Props { value: string[]; onChange: (v: string[]) => void }

export default function Step5Companies({ value, onChange }: Props) {
  const toggle = (id: string) => {
    if (id === 'all') { onChange(value.includes('all') ? [] : ['all']); return }
    const without = value.filter(v => v !== 'all')
    onChange(without.includes(id) ? without.filter(v => v !== id) : [...without, id])
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {TYPES.map(({ id, label, desc, icon: Icon }) => {
          const active = value.includes(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`
                relative flex items-start gap-3 p-4 rounded-xl border-[1.5px] text-left cursor-pointer
                transition-all duration-150
                ${active
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-muted-foreground/30 hover:bg-secondary/50'
                }
              `}
            >
              {active && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <div className={`
                w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 mt-[2px]
                ${active ? 'bg-primary/10' : 'bg-secondary border border-border'}
              `}>
                <Icon size={16} className={active ? 'text-primary' : 'text-muted-foreground'} />
              </div>

              <div>
                <p className={`text-sm font-semibold mb-0.5 ${active ? 'text-foreground' : 'text-secondary-foreground/80'}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {value.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          {value.includes('all') ? 'All company types selected' : `${value.length} type${value.length > 1 ? 's' : ''} selected`}
        </div>
      )}
    </div>
  )
}