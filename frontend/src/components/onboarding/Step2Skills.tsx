import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

const SUGGESTIONS = [
  'React','Node.js','TypeScript','Python','Java','Go','Rust','Vue.js','Angular',
  'Next.js','GraphQL','PostgreSQL','MongoDB','Redis','Docker','Kubernetes',
  'AWS','GCP','Azure','CI/CD','Machine Learning','Data Science','Figma',
  'Swift','Kotlin','Flutter','Django','FastAPI','Spring Boot','Terraform',
]

interface Props { value: string[]; onChange: (v: string[]) => void }

export default function Step2Skills({ value, onChange }: Props) {
  const [input, setInput] = useState('')

  const add = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !value.includes(trimmed) && value.length < 20) onChange([...value, trimmed])
    setInput('')
  }
  const remove = (skill: string) => onChange(value.filter(s => s !== skill))
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1])
  }

  const filtered = SUGGESTIONS.filter(s => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="flex flex-col gap-4">

      {/* Tag input box */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Your Skills <span className="text-muted-foreground">({value.length}/20)</span>
        </label>
        <div
          className="min-h-[52px] p-2.5 bg-card border border-border rounded-lg flex flex-wrap gap-1.5 items-center cursor-text transition-colors duration-150"
          onClick={() => document.getElementById('skill-input')?.focus()}
        >
          {value.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary rounded-full">
              {skill}
              <button type="button" onClick={() => remove(skill)} className="text-muted-foreground hover:text-destructive cursor-pointer p-0 flex items-center transition-colors">
                <X size={10} strokeWidth={2} />
              </button>
            </span>
          ))}
          <input
            id="skill-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={value.length === 0 ? 'Type a skill and press Enter…' : 'Add more…'}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-foreground py-0.5 placeholder:text-muted-foreground"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">
          Press Enter or comma to add · Backspace to remove last
        </p>
      </div>

      {/* Suggestions */}
      {filtered.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
            Quick add
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filtered.slice(0, 16).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-card border border-border text-muted-foreground rounded-full hover:border-primary/30 hover:text-primary hover:bg-primary/10 transition-all duration-150 cursor-pointer"
              >
                <Plus size={11} strokeWidth={2.5} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      {value.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          {value.length} skill{value.length > 1 ? 's' : ''} added
        </div>
      )}
    </div>
  )
}
