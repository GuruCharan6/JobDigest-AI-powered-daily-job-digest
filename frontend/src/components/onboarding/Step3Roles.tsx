import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

const SUGGESTIONS = [
  'Frontend Developer','Backend Developer','Full Stack Developer','Software Engineer',
  'DevOps Engineer','Data Scientist','Data Analyst','ML Engineer','AI Engineer',
  'Product Manager','UI/UX Designer','Mobile Developer','iOS Developer','Android Developer',
  'Cloud Architect','Site Reliability Engineer','QA Engineer','Security Engineer',
  'Tech Lead','Engineering Manager','CTO','Solutions Architect','Database Administrator',
  'Blockchain Developer','Game Developer',
]

interface Props { value: string[]; onChange: (v: string[]) => void }

export default function Step3Roles({ value, onChange }: Props) {
  const [input, setInput] = useState('')

  const add = (role: string) => {
    const trimmed = role.trim()
    if (trimmed && !value.includes(trimmed) && value.length < 10) onChange([...value, trimmed])
    setInput('')
  }
  const remove = (role: string) => onChange(value.filter(r => r !== role))
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1])
  }

  const filtered = SUGGESTIONS.filter(s => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="flex flex-col gap-4">

      {/* Tag input */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Target Roles <span className="text-muted-foreground">({value.length}/10)</span>
        </label>
        <div
          className="min-h-[52px] p-2.5 bg-card border border-border rounded-lg flex flex-wrap gap-1.5 items-center cursor-text transition-colors duration-150"
          onClick={() => document.getElementById('role-input')?.focus()}
        >
          {value.map(role => (
            <span key={role} className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary rounded-full">
              {role}
              <button type="button" onClick={() => remove(role)} className="text-muted-foreground hover:text-destructive cursor-pointer p-0 flex items-center transition-colors">
                <X size={10} strokeWidth={2} />
              </button>
            </span>
          ))}
          <input
            id="role-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={value.length === 0 ? 'e.g. Frontend Developer…' : 'Add more…'}
            className="flex-1 min-w-[160px] bg-transparent border-none outline-none text-sm text-foreground py-0.5 placeholder:text-muted-foreground"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">
          Press Enter to add · Backspace to remove last
        </p>
      </div>

      {/* Suggestions */}
      {filtered.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filtered.slice(0, 14).map(r => (
              <button key={r} type="button" onClick={() => add(r)} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-card border border-border text-muted-foreground rounded-full hover:border-primary/30 hover:text-primary hover:bg-primary/10 transition-all duration-150 cursor-pointer">
                <Plus size={11} strokeWidth={2.5} /> {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          {value.length} role{value.length > 1 ? 's' : ''} targeted
        </div>
      )}
    </div>
  )
}