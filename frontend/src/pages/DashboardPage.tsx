import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getProfile, saveProfile } from '../api/profile'
import { useAuthStore } from '../store/authstore'
import { showToast } from '../components/ui/Toast'
import {
  Mail, MapPin, Clock, Edit2, X,
  Wifi, Plus, Zap, Sparkles,
  Activity, Target, Globe, Building2,
} from 'lucide-react'

// Hide number input spinners globally for this page
const hideSpinnersStyle = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; appearance: textfield; }
`

// ── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  full_name:           string
  email:               string
  skills:              string[]
  target_roles:        string[]
  locations:           string[]
  location:            string
  remote:              boolean
  company_pref:        string[]
  years_of_experience: number
  is_fresher:          boolean
  experience_level:    string
  digest_enabled:      boolean
  digest_time:         string
  digest_type:         string
  onboarding_complete: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COMPANY_OPTIONS = [
  { id: 'mnc',     label: 'MNC / Enterprise' },
  { id: 'startup', label: 'Startups'          },
  { id: 'remote',  label: 'Remote-first'      },
  { id: 'govt',    label: 'Government / PSU'  },
  { id: 'ngo',     label: 'NGO / Non-profit'  },
]

function deriveLevel(years: number) {
  if (years === 0)   return { label: 'Fresher',   color: '#ef4444', bg: 'rgba(239,68,68,0.05)',  bgBorder: 'rgba(239,68,68,0.2)', hint: 'Entry-level & fresher jobs only'    }
  if (years <= 2)    return { label: 'Junior',    color: '#f59e0b', bg: 'rgba(245,158,11,0.05)', bgBorder: 'rgba(245,158,11,0.2)', hint: 'Junior roles, 0–2 years experience' }
  if (years <= 5)    return { label: 'Mid-level', color: '#8b5cf6', bg: 'rgba(139,92,246,0.05)', bgBorder: 'rgba(139,92,246,0.2)', hint: 'Mid-level positions matched'        }
  if (years <= 10)   return { label: 'Senior',    color: '#6366f1', bg: 'rgba(99,102,241,0.05)', bgBorder: 'rgba(99,102,241,0.2)', hint: 'Senior & lead roles in your digest' }
  return               { label: 'Expert',    color: '#eab308', bg: 'rgba(234,179,8,0.05)',  bgBorder: 'rgba(234,179,8,0.2)', hint: 'Principal & expert-level positions'  }
}

function formatTime(t: string) {
  if (!t) return '9:00 AM'
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

// ── Digest Toggle ─────────────────────────────────────────────────────────────

function DigestToggle({ enabled, saving, onToggle }: {
  enabled: boolean
  saving: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      disabled={saving}
      title={enabled ? 'Pause digest' : 'Activate digest'}
      className={`
        flex items-center gap-2.5 px-3.5 py-2 rounded-lg border transition-all duration-150
        ${enabled ? 'bg-emerald-500/[0.06] border-emerald-500/30' : 'bg-transparent border-border'}
      `}
    >
      {/* Track */}
      <div className="relative w-9 h-5 rounded-full transition-all duration-150 flex-shrink-0" style={{
        background: enabled ? '#10b981' : 'hsl(var(--border))',
        border: `1px solid ${enabled ? '#10b981' : 'hsl(var(--muted-foreground) / 0.3)'}`,
      }}>
        {/* Thumb */}
        <div className="absolute top-0.5 rounded-full transition-all duration-150" style={{
          left: enabled ? '19px' : '2px',
          width: '14px',
          height: '14px',
          background: enabled ? '#ffffff' : 'hsl(var(--muted-foreground))',
          boxShadow: enabled ? '0 0 6px rgba(16,185,129,0.4)' : '0 1px 2px rgba(0,0,0,0.1)',
        }} />
      </div>

      <span className="text-[10px] font-bold uppercase tracking-[0.14em] min-w-[42px] transition-colors duration-150"
        style={{ color: enabled ? '#10b981' : 'hsl(var(--muted-foreground))' }}>
        {saving ? '...' : enabled ? 'Active' : 'Paused'}
      </span>
    </button>
  )
}

// ── Shared Modal Shell ────────────────────────────────────────────────────────

function ModalShell({ title, prefix, children, onClose, onSave }: {
  title: string; prefix: string
  children: React.ReactNode
  onClose: () => void; onSave: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-[440px] overflow-hidden animate-fade-in">
        {/* Accent top border */}
        <div className="h-[2px] bg-primary" />

        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] text-primary uppercase tracking-[0.18em] font-semibold mb-1">
                {prefix}
              </div>
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors duration-150 cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <div className="mb-5">{children}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 px-4 bg-transparent border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground cursor-pointer text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-150">
              Cancel
            </button>
            <button onClick={onSave} className="flex-1 py-2.5 px-4 bg-primary text-white cursor-pointer text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all duration-150">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Tag Input ─────────────────────────────────────────────────────────────────

function TagInput({ items, onAdd, onRemove, placeholder }: {
  items: string[]; onAdd: (v: string) => void
  onRemove: (v: string) => void; placeholder: string
}) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !items.includes(v)) { onAdd(v); setInput('') }
  }
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex">
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-card border border-border border-r-0 text-foreground outline-none rounded-l-lg focus:z-10 focus:border-primary/50 hover:border-muted-foreground/30 transition-colors placeholder:text-muted-foreground"
        />
        <button onClick={add} className="px-3.5 py-2 bg-primary text-white cursor-pointer flex items-center hover:bg-primary/90 transition-colors rounded-r-lg border border-primary">
          <Plus size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 p-3 bg-secondary/50 border border-border rounded-lg min-h-[64px]">
        {items.length === 0
          ? <span className="text-xs text-muted-foreground">Nothing added yet</span>
          : items.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-full">
              {item}
              <button onClick={() => onRemove(item)} className="bg-transparent border-none text-muted-foreground hover:text-destructive cursor-pointer flex items-center p-0 transition-colors">
                <X size={11} />
              </button>
            </span>
          ))}
      </div>
    </div>
  )
}

// ── Modals ────────────────────────────────────────────────────────────────────

function SkillsModal({ isOpen, skills, onSave, onClose }: { isOpen: boolean; skills: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [items, setItems] = useState(skills)
  useEffect(() => { if (isOpen) setItems(skills) }, [isOpen])
  if (!isOpen) return null
  return (
    <ModalShell title="Edit Skills" prefix="// skills" onClose={onClose} onSave={() => { onSave(items); onClose() }}>
      <TagInput items={items} onAdd={v => setItems(p => [...p, v])} onRemove={v => setItems(p => p.filter(x => x !== v))} placeholder="e.g. React, Python…" />
    </ModalShell>
  )
}

function RolesModal({ isOpen, roles, onSave, onClose }: { isOpen: boolean; roles: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [items, setItems] = useState(roles)
  useEffect(() => { if (isOpen) setItems(roles) }, [isOpen])
  if (!isOpen) return null
  return (
    <ModalShell title="Edit Target Roles" prefix="// target_roles" onClose={onClose} onSave={() => { onSave(items); onClose() }}>
      <TagInput items={items} onAdd={v => setItems(p => [...p, v])} onRemove={v => setItems(p => p.filter(x => x !== v))} placeholder="e.g. Frontend Engineer…" />
    </ModalShell>
  )
}

function LocationsModal({ isOpen, locations, remote, onSave, onClose }: {
  isOpen: boolean; locations: string[]; remote: boolean
  onSave: (locs: string[], remote: boolean) => void; onClose: () => void
}) {
  const [items, setItems] = useState(locations)
  const [rem, setRem] = useState(remote)
  useEffect(() => { if (isOpen) { setItems(locations); setRem(remote) } }, [isOpen])
  if (!isOpen) return null
  return (
    <ModalShell title="Edit Locations" prefix="// locations" onClose={onClose} onSave={() => { onSave(items, rem); onClose() }}>
      <TagInput items={items} onAdd={v => setItems(p => [...p, v])} onRemove={v => setItems(p => p.filter(x => x !== v))} placeholder="e.g. Bangalore, Mumbai…" />
      <label className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer mt-2 transition-colors duration-150 ${rem ? 'bg-emerald-500/[0.04] border-emerald-500/25' : 'bg-transparent border-border'}`}>
        <input type="checkbox" checked={rem} onChange={e => setRem(e.target.checked)} className="accent-primary cursor-pointer" />
        <Wifi size={13} className="text-primary" />
        <span className="text-xs text-foreground">Open to Remote</span>
      </label>
    </ModalShell>
  )
}

function CompaniesModal({ isOpen, selected, onSave, onClose }: {
  isOpen: boolean; selected: string[]; onSave: (v: string[]) => void; onClose: () => void
}) {
  const [items, setItems] = useState(selected)
  useEffect(() => { if (isOpen) setItems(selected) }, [isOpen])
  if (!isOpen) return null
  const toggle = (id: string) => setItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  return (
    <ModalShell title="Company Preferences" prefix="// company_pref" onClose={onClose} onSave={() => { onSave(items); onClose() }}>
      <div className="flex flex-col gap-px rounded-lg overflow-hidden border border-border">
        {COMPANY_OPTIONS.map(opt => (
          <label key={opt.id} className="flex items-center gap-3 p-3 cursor-pointer transition-colors duration-150"
            style={{ background: items.includes(opt.id) ? 'rgba(139,92,246,0.04)' : 'hsl(var(--card))' }}>
            <input type="checkbox" checked={items.includes(opt.id)} onChange={() => toggle(opt.id)} className="accent-primary cursor-pointer" />
            <span className="text-xs flex-1 transition-colors" style={{ color: items.includes(opt.id) ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
              {opt.label}
            </span>
            {items.includes(opt.id) && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </label>
        ))}
      </div>
    </ModalShell>
  )
}

function ExperienceModal({ isOpen, years, onSave, onClose }: {
  isOpen: boolean; years: number; onSave: (y: number) => void; onClose: () => void
}) {
  const [raw, setRaw] = useState(years === 0 ? '' : String(years))
  useEffect(() => { if (isOpen) setRaw(years === 0 ? '' : String(years)) }, [isOpen])
  if (!isOpen) return null
  const parsed = raw === '' ? 0 : Math.max(0, Math.min(50, parseInt(raw) || 0))
  const level = deriveLevel(parsed)
  return (
    <ModalShell title="Your Experience" prefix="// experience" onClose={onClose} onSave={() => { onSave(parsed); onClose() }}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.14em] font-semibold block mb-2">
            Years of experience (0 = fresher)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text" inputMode="numeric" pattern="[0-9]*"
              placeholder="0" value={raw} maxLength={2}
              onChange={e => setRaw(e.target.value.replace(/\D/g, '').slice(0, 2))}
              className="w-16 py-2.5 text-center text-xl font-bold outline-none rounded-lg transition-colors"
              style={{
                background: level.bg,
                border: `2px solid ${level.color}`,
                color: level.color,
              }}
            />
            <span className="text-xs text-muted-foreground">years of experience</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-lg" style={{
          background: level.bg,
          border: `1px solid ${level.bgBorder}`,
        }}>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{
            background: 'hsl(var(--card))',
            border: `1px solid ${level.bgBorder}`,
            color: level.color,
          }}>{level.label}</span>
          <p className="text-[11px] text-muted-foreground">{level.hint}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 5, 7, 10].map(yr => (
            <button key={yr} onClick={() => setRaw(yr === 0 ? '' : String(yr))} className="px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all duration-150 cursor-pointer"
              style={{
                background: parsed === yr ? level.bg : 'transparent',
                border: `1px solid ${parsed === yr ? level.color : 'hsl(var(--border))'}`,
                color: parsed === yr ? level.color : 'hsl(var(--muted-foreground))',
              }}>
              {yr === 0 ? 'Fresher' : `${yr}yr`}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  )
}

function DigestTimeModal({ isOpen, time, onSave, onClose }: {
  isOpen: boolean; time: string; onSave: (t: string) => void; onClose: () => void
}) {
  const parse = (t: string) => {
    const [h, m] = (t || '09:00').split(':').map(Number)
    return { hour: h % 12 || 12, minute: m, period: (h >= 12 ? 'PM' : 'AM') as 'AM' | 'PM' }
  }

  const [hourRaw, setHourRaw] = useState('')
  const [minRaw, setMinRaw] = useState('')
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')

  useEffect(() => {
    if (isOpen) {
      const p = parse(time)
      setHourRaw(String(p.hour).padStart(2, '0'))
      setMinRaw(String(p.minute).padStart(2, '0'))
      setPeriod(p.period)
    }
  }, [isOpen])

  if (!isOpen) return null

  const toHHMM = () => {
    const h = Math.max(1, Math.min(12, parseInt(hourRaw) || 12))
    const m = Math.max(0, Math.min(59, parseInt(minRaw) || 0))
    const h24 = period === 'AM' ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12)
    return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const displayHour = parseInt(hourRaw) || 0
  const displayMin = parseInt(minRaw) || 0

  return (
    <ModalShell title="Edit Digest Time" prefix="// digest_time" onClose={onClose} onSave={() => { onSave(toHHMM()); onClose() }}>
      <style>{hideSpinnersStyle}</style>
      <p className="text-xs text-muted-foreground tracking-wide mb-4">
        What time should your daily digest arrive?
      </p>

      {/* Editable HH : MM  +  AM/PM */}
      <div className="flex items-center justify-center p-4 bg-primary/10 border border-primary/20 rounded-xl mb-5 gap-1">
        {/* Hour */}
        <input
          type="text" inputMode="numeric" maxLength={2}
          value={hourRaw}
          onFocus={e => e.target.select()}
          onChange={e => setHourRaw(e.target.value.replace(/\D/g, '').slice(0, 2))}
          onBlur={() => {
            const v = parseInt(hourRaw)
            const clamped = isNaN(v) || v < 1 ? 1 : v > 12 ? 12 : v
            setHourRaw(String(clamped).padStart(2, '0'))
          }}
          className="w-[70px] bg-transparent border-none outline-none text-3xl font-bold text-primary tracking-wide text-center caret-primary"
        />

        <span className="text-3xl font-bold text-primary/30 leading-none select-none">:</span>

        {/* Minute */}
        <input
          type="text" inputMode="numeric" maxLength={2}
          value={minRaw}
          onFocus={e => e.target.select()}
          onChange={e => setMinRaw(e.target.value.replace(/\D/g, '').slice(0, 2))}
          onBlur={() => {
            const v = parseInt(minRaw)
            const clamped = isNaN(v) || v < 0 ? 0 : v > 59 ? 59 : v
            setMinRaw(String(clamped).padStart(2, '0'))
          }}
          className="w-[70px] bg-transparent border-none outline-none text-3xl font-bold text-primary tracking-wide text-center caret-primary"
        />

        {/* AM/PM */}
        <div className="flex flex-col gap-1 ml-2">
          {(['AM', 'PM'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className="px-2 py-0.5 text-[10px] font-bold tracking-wider cursor-pointer rounded-lg transition-all duration-150"
              style={{
                background: period === p ? 'rgba(139,92,246,0.15)' : 'transparent',
                border: `1px solid ${period === p ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                color: period === p ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Quick select</div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '8:00 AM',  h: 8,  m: 0,  p: 'AM' as const },
            { label: '9:00 AM',  h: 9,  m: 0,  p: 'AM' as const },
            { label: '12:00 PM', h: 12, m: 0,  p: 'PM' as const },
            { label: '3:00 PM',  h: 3,  m: 0,  p: 'PM' as const },
            { label: '6:00 PM',  h: 6,  m: 0,  p: 'PM' as const },
            { label: '9:00 PM',  h: 9,  m: 0,  p: 'PM' as const },
          ].map(preset => {
            const active = displayHour === preset.h && displayMin === preset.m && period === preset.p
            return (
              <button key={preset.label} onClick={() => {
                setHourRaw(String(preset.h).padStart(2, '0'))
                setMinRaw(String(preset.m).padStart(2, '0'))
                setPeriod(preset.p)
              }} className="px-3 py-1.5 text-xs font-semibold cursor-pointer rounded-lg transition-all duration-150"
                style={{
                  background: active ? 'hsl(var(--primary) / 0.08)' : 'transparent',
                  border: `1px solid ${active ? 'hsl(var(--border))' : 'hsl(var(--border))'}`,
                  color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                }}>
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>
    </ModalShell>
  )
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({ title, prefix, icon, onEdit, saving, children }: {
  title: string; prefix: string; icon?: React.ReactNode
  onEdit: () => void; saving: boolean; children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="bg-card border border-border rounded-xl p-5 transition-all duration-150 cursor-default"
      style={{ borderLeft: `3px solid ${hovered ? 'hsl(var(--primary))' : 'transparent' }` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {icon && <span className="text-primary/70 flex items-center">{icon}</span>}
            <div className="text-[10px] text-primary uppercase tracking-wider font-semibold">
              {prefix}
            </div>
          </div>
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        </div>
        <button
          onClick={onEdit} disabled={saving}
          className={`flex items-center gap-1 px-2 py-1 bg-transparent border border-border text-muted-foreground cursor-pointer text-[10px] uppercase tracking-wider rounded-md transition-all duration-150 hover:border-primary/30 hover:text-primary ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <Edit2 size={11} /> Edit
        </button>
      </div>
      {children}
    </div>
  )
}

// ── Tag Badge ─────────────────────────────────────────────────────────────────

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-primary/10 border border-primary/20 text-primary tracking-wide rounded-full">
      {children}
    </span>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

type ModalKey = 'skills' | 'roles' | 'locations' | 'companies' | 'experience' | 'time'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingDigest, setTogglingDigest] = useState(false)
  const [openModal, setOpenModal] = useState<ModalKey | null>(null)

  // Inline name editing
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [savingName, setSavingName] = useState(false)

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const { data } = await getProfile()
      setProfile(data)
    } catch {
      showToast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const save = async (updates: Partial<Profile>) => {
    if (!profile) return
    setSaving(true)
    let localUpdates = { ...updates }
    if ('years_of_experience' in updates) {
      const y = updates.years_of_experience ?? 0
      localUpdates = {
        ...localUpdates,
        is_fresher: y === 0,
        experience_level: y === 0 ? 'fresher' : y <= 2 ? 'junior' : y <= 5 ? 'mid' : y <= 10 ? 'senior' : 'expert',
      }
    }
    setProfile(prev => prev ? { ...prev, ...localUpdates } : null)
    try {
      await saveProfile(updates)
      showToast.success('Saved')
    } catch {
      setProfile(profile)
      showToast.error('Failed to save — changes reverted')
    } finally {
      setSaving(false)
    }
  }

  const toggleDigest = async () => {
    if (!profile || togglingDigest) return
    const newValue = !profile.digest_enabled
    setTogglingDigest(true)
    setProfile(prev => prev ? { ...prev, digest_enabled: newValue } : null)
    try {
      await saveProfile({ digest_enabled: newValue })
      showToast.success(newValue ? 'Digest activated' : 'Digest paused')
    } catch {
      setProfile(prev => prev ? { ...prev, digest_enabled: !newValue } : null)
      showToast.error('Failed to update digest — try again')
    } finally {
      setTogglingDigest(false)
    }
  }

  const startEditingName = () => {
    setDraftName(profile.full_name ?? '')
    setEditingName(true)
  }

  const cancelEditingName = () => {
    setEditingName(false)
  }

  const saveName = async () => {
    if (!profile || !draftName.trim()) return
    setSavingName(true)
    setProfile(prev => prev ? { ...prev, full_name: draftName.trim() } : null)
    try {
      await saveProfile({ full_name: draftName.trim() })
      showToast.success('Name updated')
      setEditingName(false)
    } catch {
      setProfile(profile)
      showToast.error('Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  const displayLocations = profile?.locations?.length
    ? profile.locations
    : profile?.location ? [profile.location] : []

  const expYears = profile?.years_of_experience ?? 0
  const expLevel = deriveLevel(expYears)
  const digestOn = profile?.digest_enabled ?? true

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tracking-wide font-medium">Loading your profile</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-[960px] mx-auto pb-16 animate-fade-in">

      {/* ══════════════════════════════════════════════════════
          HEADER — Name · Email · Digest Toggle
          ══════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-7 mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Row 1: identity + toggle */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {editingName ? (
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="text"
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEditingName(); }}
                  autoFocus
                  className="text-[28px] lg:text-[32px] font-bold text-foreground bg-input/50 border border-border rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-ring w-auto min-w-[200px]"
                />
                <button
                  onClick={saveName}
                  disabled={savingName}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all duration-150 cursor-pointer disabled:opacity-40 whitespace-nowrap"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditingName}
                  disabled={savingName}
                  className="px-3 py-1.5 bg-transparent border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-primary/30 hover:text-foreground transition-all duration-150 cursor-pointer disabled:opacity-40 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-[28px] lg:text-[32px] font-bold text-foreground">
                  {profile.full_name ? profile.full_name.split(' ')[0] : 'Dashboard'}
                </h1>
                <button
                  onClick={startEditingName}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors duration-150 cursor-pointer flex-shrink-0"
                  title="Edit display name"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail size={13} className="text-muted-foreground/60" /> {user?.email}
            </p>
          </div>

          {/* Digest toggle */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Digest Status
            </div>
            <DigestToggle
              enabled={digestOn}
              saving={togglingDigest}
              onToggle={toggleDigest}
            />
          </div>
        </div>

        {/* Row 2: digest status banner */}
        <div className={`mt-5 p-4 rounded-lg border transition-colors duration-300 ${
          digestOn ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-transparent border-border'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: digestOn ? '#10b981' : 'hsl(var(--muted-foreground) / 0.3)',
                  boxShadow: digestOn ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                }} />
              <div>
                <div className={`text-xs font-semibold mb-0.5 ${digestOn ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {digestOn ? 'Daily digest is running' : 'Digest paused — no emails will be sent'}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {digestOn
                    ? <>Delivers at <span className="text-primary font-medium">{formatTime(profile.digest_time)}</span> · top matched jobs daily</>
                    : 'Toggle on above to resume your job feed'
                  }
                </div>
              </div>
            </div>

            {/* Edit Time */}
            {digestOn && (
              <button
                onClick={() => setOpenModal('time')}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-border text-muted-foreground cursor-pointer text-[10px] uppercase tracking-wider rounded-md transition-colors duration-150 hover:border-primary/30 hover:text-primary"
              >
                <Clock size={11} /> Edit Time
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PROFILE GRID
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

        {/* Skills */}
        <SectionCard title="Your Skills" prefix="// skills" icon={<Zap size={13} />} onEdit={() => setOpenModal('skills')} saving={saving}>
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {profile.skills?.map(s => <Tag key={s}>{s}</Tag>)}
            {!profile.skills?.length && <span className="text-[11px] text-muted-foreground">No skills added yet</span>}
          </div>
        </SectionCard>

        {/* Target Roles */}
        <SectionCard title="Target Roles" prefix="// target_roles" icon={<Target size={13} />} onEdit={() => setOpenModal('roles')} saving={saving}>
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {profile.target_roles?.map(r => <Tag key={r}>{r}</Tag>)}
            {!profile.target_roles?.length && <span className="text-[11px] text-muted-foreground">No roles added yet</span>}
          </div>
        </SectionCard>

        {/* Experience */}
        <SectionCard title="Experience Level" prefix="// experience" icon={<Activity size={13} />} onEdit={() => setOpenModal('experience')} saving={saving}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full"
              style={{
                background: expLevel.bg,
                border: `1px solid ${expLevel.bgBorder}`,
                color: expLevel.color,
              }}>
              {expLevel.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {expYears === 0 ? '0 years' : `${expYears} year${expYears !== 1 ? 's' : ''}`}
            </span>
            <span className="text-[11px] text-muted-foreground w-full">{expLevel.hint}</span>
          </div>
        </SectionCard>

        {/* Locations */}
        <SectionCard title="Locations" prefix="// locations" icon={<Globe size={13} />} onEdit={() => setOpenModal('locations')} saving={saving}>
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {displayLocations.map(l => (
              <Tag key={l}><MapPin size={10} className="mr-1" />{l}</Tag>
            ))}
            {profile.remote && <Tag><Wifi size={10} className="mr-1" />Remote</Tag>}
            {!displayLocations.length && !profile.remote && (
              <span className="text-[11px] text-muted-foreground">No locations set</span>
            )}
          </div>
        </SectionCard>

        {/* Company Preferences */}
        <SectionCard title="Company Preferences" prefix="// company_pref" icon={<Building2 size={13} />} onEdit={() => setOpenModal('companies')} saving={saving}>
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {profile.company_pref?.map(c => {
              const info = COMPANY_OPTIONS.find(o => o.id === c)
              return info ? <Tag key={c}>{info.label}</Tag> : null
            })}
            {!profile.company_pref?.length && <span className="text-[11px] text-muted-foreground">No preferences set</span>}
          </div>
        </SectionCard>

        {/* Digest Time */}
        <SectionCard title="Digest Time" prefix="// digest_time" icon={<Clock size={13} />} onEdit={() => setOpenModal('time')} saving={saving}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-primary tracking-wide leading-none">
              {formatTime(profile.digest_time)}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">
            {digestOn
              ? 'Daily job digest delivery time'
              : <span className="text-muted-foreground">Digest is paused — no emails sent</span>}
          </div>
        </SectionCard>
      </div>

      {/* ══════════════════════════════════════════════════════
          AI INSIGHTS
          ══════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ borderLeft: '3px solid hsl(var(--primary))' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={13} className="text-primary" />
          <span className="text-[10px] text-primary uppercase tracking-wider font-bold">
            AI Insights
          </span>
        </div>
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {[
            {
              idx: '01',
              text: `${profile.skills?.length ?? 0} skills match across ${Math.min(3, profile.target_roles?.length ?? 1)} active job categories`,
            },
            {
              idx: '02',
              text: profile.remote
                ? 'Remote enabled — your job reach is 3× wider than location-only searches'
                : 'Tip: Enable remote in Locations to 3× your job matches instantly',
            },
            {
              idx: '03',
              text: expYears === 0
                ? 'Fresher mode on — entry-level, graduate, and junior positions only'
                : `${expLevel.label} filter active — targeting ${expLevel.label.toLowerCase()} positions for ${expYears}yr experience`,
            },
            {
              idx: '04',
              text: digestOn
                ? `Digest active — job matches arriving daily at ${formatTime(profile.digest_time)}`
                : 'Digest is paused — toggle on to resume your daily job feed',
            },
          ].map(({ idx, text }) => (
            <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-card">
              <span className="text-[10px] text-primary font-bold min-w-[20px] tracking-wide">{idx}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      <SkillsModal     isOpen={openModal === 'skills'}     skills={profile.skills || []}         onSave={skills => save({ skills })}                                           onClose={() => setOpenModal(null)} />
      <RolesModal      isOpen={openModal === 'roles'}      roles={profile.target_roles || []}    onSave={target_roles => save({ target_roles })}                               onClose={() => setOpenModal(null)} />
      <LocationsModal  isOpen={openModal === 'locations'}  locations={profile.locations || []}   remote={profile.remote || false} onSave={(locations, remote) => save({ locations, remote })} onClose={() => setOpenModal(null)} />
      <CompaniesModal  isOpen={openModal === 'companies'}  selected={profile.company_pref || []} onSave={company_pref => save({ company_pref })}                               onClose={() => setOpenModal(null)} />
      <ExperienceModal isOpen={openModal === 'experience'} years={profile.years_of_experience ?? 0} onSave={years_of_experience => save({ years_of_experience })}              onClose={() => setOpenModal(null)} />
      <DigestTimeModal isOpen={openModal === 'time'}       time={profile.digest_time || '09:00'} onSave={digest_time => save({ digest_time })}                                 onClose={() => setOpenModal(null)} />
    </div>
  )
}
