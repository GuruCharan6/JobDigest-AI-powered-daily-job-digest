import { useState, KeyboardEvent } from 'react'
import { MapPin, X, Wifi } from 'lucide-react'

const POPULAR = [
  'Bangalore','Mumbai','Delhi','Hyderabad','Chennai','Pune',
  'Kolkata','Noida','Gurgaon','Ahmedabad',
  'San Francisco','New York','London','Singapore','Dubai',
]

interface Props {
  locations: string[]
  remote: boolean
  onChange: (locations: string[], remote: boolean) => void
}

export default function Step4Location({ locations, remote, onChange }: Props) {
  const [input, setInput] = useState('')

  const add = (loc: string) => {
    const trimmed = loc.trim()
    if (trimmed && !locations.includes(trimmed) && locations.length < 5) onChange([...locations, trimmed], remote)
    setInput('')
  }
  const remove = (loc: string) => onChange(locations.filter(l => l !== loc), remote)
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && locations.length) remove(locations[locations.length - 1])
  }

  const filtered = POPULAR.filter(p => !locations.includes(p) && p.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="flex flex-col gap-4">

      {/* Location tag input */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Preferred Locations <span className="text-muted-foreground">({locations.length}/5)</span>
        </label>
        <div
          className="min-h-[52px] p-2.5 bg-card border border-border rounded-lg flex flex-wrap gap-1.5 items-center cursor-text transition-colors duration-150"
          onClick={() => document.getElementById('loc-input')?.focus()}
        >
          {locations.map(loc => (
            <span key={loc} className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary rounded-full">
              <MapPin size={10} /> {loc}
              <button type="button" onClick={() => remove(loc)} className="text-muted-foreground hover:text-destructive cursor-pointer p-0 flex items-center transition-colors">
                <X size={10} strokeWidth={2} />
              </button>
            </span>
          ))}
          <input
            id="loc-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={locations.length === 0 ? 'e.g. Bangalore, Mumbai…' : 'Add another…'}
            disabled={locations.length >= 5}
            className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-sm text-foreground py-0.5 placeholder:text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">
          Press Enter to add · Up to 5 cities
        </p>
      </div>

      {/* Popular cities */}
      {filtered.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
            Popular cities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filtered.slice(0, 10).map(loc => (
              <button key={loc} type="button" onClick={() => add(loc)}
                disabled={locations.length >= 5}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-card border border-border text-muted-foreground rounded-full hover:border-primary/30 hover:text-primary hover:bg-primary/10 transition-all duration-150 cursor-pointer disabled:opacity-40"
              >
                <MapPin size={10} /> {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Remote toggle */}
      <button
        type="button"
        onClick={() => onChange(locations, !remote)}
        className={`
          flex items-center justify-between p-4 rounded-xl border-[1.5px] w-full cursor-pointer
          transition-all duration-150 text-left
          ${remote ? 'bg-primary/10 border-primary/25' : 'bg-card border-border hover:bg-secondary/50'}
        `}
      >
        <div className="flex items-center gap-3.5">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150
            ${remote ? 'bg-primary/10' : 'bg-secondary border border-border'}
          `}>
            <Wifi size={18} className={remote ? 'text-primary' : 'text-muted-foreground'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">Include Remote Jobs</p>
            <p className="text-xs text-muted-foreground">Get remote-friendly opportunities worldwide</p>
          </div>
        </div>

        {/* Toggle */}
        <div className={`
          w-11 h-6 rounded-full relative transition-all duration-150 flex-shrink-0
          ${remote ? 'bg-primary' : 'bg-secondary'}
          ${remote ? 'shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]' : ''}
        `}>
          <div className={`
            absolute top-0.5 w-[18px] h-[18px] rounded-full bg-foreground transition-all duration-150
            ${remote ? 'left-[19px]' : 'left-[3px]'}
          `} />
        </div>
      </button>

      {/* Summary */}
      {(locations.length > 0 || remote) && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          {locations.length > 0 && <span>{locations.length} location{locations.length > 1 ? 's' : ''}</span>}
          {locations.length > 0 && remote && <span className="text-muted-foreground/40">·</span>}
          {remote && <span>Remote included</span>}
        </div>
      )}
    </div>
  )
}
