import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react'
import { uploadResume } from '../../api/profile'

interface ParsedData {
  skills: string[]
  target_roles: string[]
  locations: string[]
  full_name?: string
  summary?: string
}

interface Props {
  onParsed: (data: ParsedData) => void
  parsedData: ParsedData | null
}

const PARSE_STAGES = ['Reading document…', 'Extracting skills…', 'Identifying roles…', 'Organizing data…']

function Tag({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary rounded-full">
      {children}
      {onRemove && (
        <button onClick={onRemove} className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors p-0 flex items-center">
          <X size={10} />
        </button>
      )}
    </span>
  )
}

export default function Step1Resume({ onParsed, parsedData }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [stage, setStage] = useState<'idle' | 'parsing' | 'done' | 'error'>('idle')
  const [stageIdx, setStageIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return }
    setFile(f); setError(''); setIsUploading(true); setStage('parsing')
    let i = 0
    const interval = setInterval(() => {
      i++; if (i < PARSE_STAGES.length) setStageIdx(i); else clearInterval(interval)
    }, 900)
    try {
      const res = await uploadResume(f)
      clearInterval(interval); setStageIdx(3)
      await new Promise(r => setTimeout(r, 400))
      onParsed(res.data); setStage('done')
    } catch {
      clearInterval(interval)
      setError('Failed to parse resume. Try again or fill manually.')
      setStage('error')
    } finally { setIsUploading(false) }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }, [])

  const reset = () => {
    setFile(null); setStage('idle'); setError(''); setStageIdx(0)
    onParsed({ skills: [], target_roles: [], locations: [] })
  }

  /* ── DONE state ── */
  if (stage === 'done' && parsedData) {
    return (
      <div className="flex flex-col gap-3">
        {/* Success banner */}
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-300 mb-0.5">
              Resume parsed successfully
            </p>
            <p className="text-xs text-muted-foreground">
              Review extracted info below. Edit in next steps.
            </p>
          </div>
          <button
            onClick={reset}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-border rounded-md text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all duration-150"
          >
            <RefreshCw size={12} /> Re-upload
          </button>
        </div>

        {/* File chip */}
        <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-lg">
          <FileText size={16} className="text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {file?.name}
          </span>
          <span className="text-xs text-muted-foreground/60">{((file?.size || 0) / 1024).toFixed(0)} KB</span>
        </div>

        {/* Parsed preview */}
        <div className="flex flex-col gap-[2px] bg-secondary/50 rounded-xl p-0.5">
          {parsedData.full_name && (
            <div className="p-3.5 bg-card rounded-t-lg">
              <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-1">
                Name
              </div>
              <span className="text-sm font-semibold text-foreground">{parsedData.full_name}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-[2px]">
            <div className="p-3.5 bg-card rounded-l-[6px]">
              <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-2">
                Skills ({parsedData.skills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.skills.slice(0, 8).map(s => <Tag key={s}>{s}</Tag>)}
                {parsedData.skills.length > 8 && (
                  <span className="text-xs text-muted-foreground self-center">+{parsedData.skills.length - 8} more</span>
                )}
              </div>
            </div>
            <div className="p-3.5 bg-card rounded-r-[6px]">
              <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-2">
                Roles
              </div>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.target_roles.map(r => <Tag key={r}>{r}</Tag>)}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center tracking-wide">
          You can add, remove or edit these in the next steps
        </p>
      </div>
    )
  }

  /* ── PARSING state ── */
  if (stage === 'parsing') {
    return (
      <div className="py-12 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
          <Sparkles size={28} className="text-primary" />
        </div>

        <div className="text-center">
          <div className="text-xs font-semibold text-primary mb-1.5">
            AI is reading your resume
          </div>
          <p className="text-sm text-muted-foreground">{PARSE_STAGES[stageIdx]}</p>
        </div>

        {/* Progress */}
        <div className="w-60 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all rounded-full"
            style={{ width: `${((stageIdx + 1) / PARSE_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Stage dots */}
        <div className="flex gap-2">
          {PARSE_STAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= stageIdx ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  /* ── IDLE / ERROR state ── */
  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center p-12 rounded-xl cursor-pointer
          border-2 border-dashed transition-all duration-150
            ${isDragging ? 'bg-primary/10 border-primary' : 'bg-card border-border'}
          `}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

        <div className={`
          w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-150
          ${isDragging ? 'bg-primary/10' : 'bg-secondary border border-border'}
        `}>
          <Upload size={24} className={isDragging ? 'text-primary' : 'text-muted-foreground'} />
        </div>

        <p className="text-sm font-semibold text-foreground mb-1">
          {isDragging ? 'Drop it here' : 'Drag & drop your resume'}
        </p>
        <p className="text-sm text-muted-foreground mb-3.5">or click to browse</p>
        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
          <span>PDF only</span>
          <span>·</span>
          <span>Max 5MB</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2.5 p-4 bg-primary/10 border border-primary/15 rounded-lg">
        <Sparkles size={15} className="text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          AI will extract your skills, roles, and locations automatically.
          You can review and edit everything before saving.
        </p>
      </div>
    </div>
  )
}
