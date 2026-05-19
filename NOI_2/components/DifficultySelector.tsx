'use client'

// ============================================================
// NOI² – DifficultySelector
// Scelta del livello: Facile / Medio / Difficile
// Livello = contesto emotivo + apertura del personaggio
// ============================================================

import { Difficulty } from '@/lib/types'

interface DifficultySelectorProps {
  selected: Difficulty | null
  onSelect: (d: Difficulty) => void
  onConfirm: () => void
  onBack: () => void
}

interface DifficultyOption {
  id: Difficulty
  label: string
  tagline: string
  description: string
  contextNote: string
  characterNote: string
  accent: string
  accentBg: string
  accentBorder: string
  symbol: string
}

const OPTIONS: DifficultyOption[] = [
  {
    id: 'facile',
    label: 'Facile',
    tagline: 'Uno spazio aperto',
    description: "Il contesto è neutro, senza tensioni accumulate. L'altra persona ha qualcosa da dire ma è raggiungibile: basta mostrare un po' di presenza.",
    contextNote: 'Situazioni quotidiane, poco cariche emotivamente',
    characterNote: 'Si apre già con una risposta attenta',
    accent: '#34d399',
    accentBg: 'rgba(52,211,153,0.1)',
    accentBorder: 'rgba(52,211,153,0.35)',
    symbol: '◎',
  },
  {
    id: 'medio',
    label: 'Medio',
    tagline: 'Qualcosa non detto',
    description: "C'è attrito sotto la superficie. L'altra persona ha delle difese ma non è chiusa: ci vuole curiosità reale per raggiungerla.",
    contextNote: 'Relazioni con storia, qualche frizione latente',
    characterNote: 'Si apre solo con curiosità o presenza',
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.1)',
    accentBorder: 'rgba(167,139,250,0.35)',
    symbol: '◑',
  },
  {
    id: 'difficile',
    label: 'Difficile',
    tagline: 'Alta attivazione emotiva',
    description: "Il contesto è carico, la tensione personale è alta. L'altra persona è in difesa: solo una presenza piena e autentica può aprire uno spazio.",
    contextNote: 'Situazioni di forte attivazione relazionale',
    characterNote: 'Si apre soltanto con presenza vera',
    accent: '#f97316',
    accentBg: 'rgba(249,115,22,0.1)',
    accentBorder: 'rgba(249,115,22,0.35)',
    symbol: '◉',
  },
]

export default function DifficultySelector({
  selected,
  onSelect,
  onConfirm,
  onBack,
}: DifficultySelectorProps) {
  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Che livello vuoi affrontare?</h2>
          <p className="text-sm" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Il livello definisce quanto sarà difficile aprire un dialogo vero.
          </p>
        </div>
      </div>

      {/* Difficulty cards */}
      <div className="flex-1 flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="text-left transition-all duration-200"
              style={{
                background: isSelected ? opt.accentBg : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isSelected ? opt.accentBorder : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px',
                padding: '1.1rem 1.25rem',
                cursor: 'pointer',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isSelected ? `0 4px 20px ${opt.accentBg}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                  background: isSelected ? opt.accentBg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isSelected ? opt.accentBorder : 'rgba(255,255,255,0.08)'}`,
                  color: opt.accent,
                  transition: 'all 0.2s ease',
                }}>
                  {opt.symbol}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{
                      fontSize: '1rem', fontWeight: 700,
                      color: isSelected ? opt.accent : 'rgba(240,238,255,0.9)',
                      transition: 'color 0.2s ease',
                    }}>
                      {opt.label}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      color: isSelected ? opt.accent : 'rgba(240,238,255,0.4)',
                      letterSpacing: '0.04em',
                      transition: 'color 0.2s ease',
                    }}>
                      {opt.tagline}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.83rem', lineHeight: 1.6,
                    color: isSelected ? 'rgba(240,238,255,0.75)' : 'rgba(240,238,255,0.45)',
                    margin: 0,
                    transition: 'color 0.2s ease',
                  }}>
                    {opt.description}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.65rem', color: opt.accent, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Contesto</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.55)' }}>{opt.contextNote}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.65rem', color: opt.accent, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Personaggio</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.55)' }}>{opt.characterNote}</span>
                      </div>
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: opt.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Confirm button */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          className="btn-primary"
          style={{ width: '100%' }}
          disabled={!selected}
          onClick={onConfirm}
        >
          Inizia l&apos;allenamento
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

    </div>
  )
}
