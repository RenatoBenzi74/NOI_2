'use client'

// ============================================================
// NOI² – FeedbackPanel v2
// Dialogue mode: per-turn comparison + inline alternative
// Single-response mode: 4 blocks with reflection textareas
// ============================================================

import { useState } from 'react'
import { FeedbackBlocks, DialogueTurn, ListeningState } from '@/lib/types'

interface FeedbackPanelProps {
  feedback: FeedbackBlocks           // aggregated (single-response mode)
  turns?: DialogueTurn[]             // dialogue mode: full history
  onContinue: () => void             // single-response: go to alternative
  onSave?: (reflection: string) => void  // dialogue mode: save & go to summary
  onBack: () => void
}

// ── Visual config ─────────────────────────────────────────────

const STATE_CONFIG: Record<ListeningState, {
  label: string; bg: string; border: string; text: string; icon: string
}> = {
  difesa:    { label: 'Difesa',    bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   text: '#fca5a5', icon: '🛡' },
  risposta:  { label: 'Risposta',  bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.4)',  text: '#fdba74', icon: '↩' },
  curiosità: { label: 'Curiosità', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#c4b5fd', icon: '◎' },
  presenza:  { label: 'Presenza',  bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.4)',  text: '#6ee7b7', icon: '✦' },
}

const FEEDBACK_BLOCKS = [
  {
    key: 'closure' as keyof FeedbackBlocks,
    title: 'Dove ti stai chiudendo',
    icon: '🔒',
    color: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    text: '#fca5a5',
    placeholder: 'Cosa noti in questa risposta…',
  },
  {
    key: 'opening' as keyof FeedbackBlocks,
    title: 'Dove si intravede apertura',
    icon: '🌿',
    color: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    text: '#86efac',
    placeholder: 'Cosa avresti voluto fare diversamente…',
  },
  {
    key: 'unheard' as keyof FeedbackBlocks,
    title: 'Cosa non hai ancora ascoltato',
    icon: '👂',
    color: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
    text: '#d8b4fe',
    placeholder: 'Cosa non avevi sentito…',
  },
  {
    key: 'horizon' as keyof FeedbackBlocks,
    title: "Come potresti aprire l'orizzonte",
    icon: '🔭',
    color: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    text: '#fcd34d',
    placeholder: 'La prossima volta…',
  },
]

// ── Types ─────────────────────────────────────────────────────

type TurnReflection = { closure: string; opening: string; unheard: string; horizon: string }
type ReflectionsMap = Record<number, TurnReflection>

function emptyReflection(): TurnReflection {
  return { closure: '', opening: '', unheard: '', horizon: '' }
}

// ── Back arrow icon ───────────────────────────────────────────

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

// ── Reusable textarea ─────────────────────────────────────────

function ReflectionTextarea({
  value, onChange, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      style={{
        width: '100%',
        background: 'rgba(0,0,0,0.18)',
        border: '1px solid rgba(240,238,255,0.1)',
        borderRadius: '8px',
        padding: '8px 10px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: 'rgba(240,238,255,0.85)',
        resize: 'none',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box' as const,
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(240,238,255,0.28)' }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(240,238,255,0.1)' }}
    />
  )
}
// ── Single feedback+reflection block ─────────────────────────

function FeedbackBlock({
  icon, title, content, colorBg, colorBorder, colorText, placeholder, value, onChange,
}: {
  icon: string; title: string; content: string
  colorBg: string; colorBorder: string; colorText: string
  placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{
      background: colorBg,
      border: `1px solid ${colorBorder}`,
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '13px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px' }}>{icon}</span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.05em', color: colorText,
          }}>
            {title}
          </span>
        </div>
        <p style={{
          fontSize: '12.5px', lineHeight: '1.65',
          color: 'rgba(240,238,255,0.78)', margin: 0,
        }}>
          {content}
        </p>
      </div>
      <div style={{ padding: '0 14px 12px' }}>
        <ReflectionTextarea value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export default function FeedbackPanel({
  feedback, turns, onContinue, onSave, onBack,
}: FeedbackPanelProps) {
  const [reflections, setReflections] = useState<ReflectionsMap>({})

  const getRef = (idx: number): TurnReflection => reflections[idx] ?? emptyReflection()

  const setField = (idx: number, field: keyof TurnReflection, value: string) => {
    setReflections(prev => ({
      ...prev,
      [idx]: { ...getRef(idx), [field]: value },
    }))
  }

  const buildReflectionText = (): string => {
    if (!turns || turns.length === 0) {
      const r = getRef(0)
      return [
        r.closure  && `Chiusura: ${r.closure}`,
        r.opening  && `Apertura: ${r.opening}`,
        r.unheard  && `Non ascoltato: ${r.unheard}`,
        r.horizon  && `Orizzonte: ${r.horizon}`,
      ].filter(Boolean).join('\n\n')
    }
    return turns.map((turn, i) => {
      const r = getRef(turn.turnIndex)
      const lines = [`Momento ${i + 1}:`]
      if (r.closure) lines.push(`  Chiusura: ${r.closure}`)
      if (r.opening) lines.push(`  Apertura: ${r.opening}`)
      if (r.unheard) lines.push(`  Non ascoltato: ${r.unheard}`)
      if (r.horizon) lines.push(`  Orizzonte: ${r.horizon}`)
      return lines.join('\n')
    }).join('\n\n')
  }

  const handlePrimary = () => {
    if (onSave) {
      onSave(buildReflectionText())
    } else {
      onContinue()
    }
  }

  // ── DIALOGUE MODE ──────────────────────────────────────────
  if (turns && turns.length > 0) {
    return (
      <div style={{
        height: '100dvh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '2rem 1.25rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-ghost"
              style={{ padding: 0, flexShrink: 0 }}
              onClick={onBack}
            >
              <BackArrow />
            </button>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                Il tuo ascolto, passo per passo
              </h2>
              <p style={{ fontSize: '11px', color: 'rgba(240,238,255,0.45)', margin: '2px 0 0' }}>
                {turns.length} {turns.length === 1 ? 'scambio' : 'scambi'} · riflessioni opzionali
              </p>
            </div>
          </div>
        </div>
        {/* Scrollable turns */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '1rem' }}>

            {turns.map((turn, i) => {
              const cfg = STATE_CONFIG[turn.analysis.globalState]
              const r = getRef(turn.turnIndex)

              return (
                <div key={turn.turnIndex}>

                  {/* Step divider */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(240,238,255,0.07)',
                      border: '1px solid rgba(240,238,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color: 'rgba(240,238,255,0.55)',
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'rgba(240,238,255,0.07)' }} />
                  </div>

                  {/* Chat exchange */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        maxWidth: '85%',
                        background: 'rgba(240,238,255,0.07)',
                        border: '1px solid rgba(240,238,255,0.11)',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 14px',
                        fontSize: '13px', lineHeight: '1.55',
                        color: 'rgba(240,238,255,0.82)',
                      }}>
                        {turn.otherPersonMessage}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <div style={{
                        maxWidth: '85%',
                        background: 'rgba(100,80,220,0.22)',
                        border: '1px solid rgba(140,120,255,0.28)',
                        borderRadius: '18px 18px 4px 18px',
                        padding: '10px 14px',
                        fontSize: '13px', lineHeight: '1.55',
                        color: 'rgba(240,238,255,0.9)',
                      }}>
                        {turn.userResponse}
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 11px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
                        background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
                      }}>
                        {cfg.icon} {cfg.label.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Feedback blocks with reflection textareas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {FEEDBACK_BLOCKS.map(block => (
                      <FeedbackBlock
                        key={block.key}
                        icon={block.icon}
                        title={block.title}
                        content={turn.analysis.feedback[block.key]}
                        colorBg={block.color}
                        colorBorder={block.border}
                        colorText={block.text}
                        placeholder={block.placeholder}
                        value={r[block.key]}
                        onChange={v => setField(turn.turnIndex, block.key, v)}
                      />
                    ))}

                    {/* Alternative response inline */}
                    <div style={{
                      background: 'rgba(99,102,241,0.07)',
                      border: '1px solid rgba(99,102,241,0.22)',
                      borderRadius: '14px',
                      padding: '13px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px' }}>✨</span>
                        <span style={{
                          fontSize: '11px', fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc',
                        }}>
                          Una risposta che apriva
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12.5px', lineHeight: '1.65',
                        color: 'rgba(240,238,255,0.82)', margin: 0, fontStyle: 'italic',
                      }}>
                        &ldquo;{turn.analysis.alternativeResponse}&rdquo;
                      </p>
                      {turn.analysis.whyAlternativeWorks && (
                        <p style={{
                          fontSize: '11.5px', lineHeight: '1.55',
                          color: 'rgba(240,238,255,0.45)', margin: '7px 0 0',
                        }}>
                          {turn.analysis.whyAlternativeWorks}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div style={{ flexShrink: 0, padding: '1.25rem' }}>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handlePrimary}>
            Salva le riflessioni
          </button>
        </div>

      </div>
    )
  }

  // ── SINGLE RESPONSE MODE ────────────────────────────────────
  const r = getRef(0)
  return (
    <div style={{
      height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{ flexShrink: 0, padding: '2rem 1.25rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-ghost" style={{ padding: 0, flexShrink: 0 }} onClick={onBack}>
            <BackArrow />
          </button>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
              La lettura della tua risposta
            </h2>
            <p style={{ fontSize: '11px', color: 'rgba(240,238,255,0.45)', margin: '2px 0 0' }}>
              Un&apos;osservazione precisa, non un giudizio.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback blocks */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '0 1.25rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '1rem' }}>
          {FEEDBACK_BLOCKS.map(block => (
            <FeedbackBlock
              key={block.key}
              icon={block.icon}
              title={block.title}
              content={feedback[block.key]}
              colorBg={block.color}
              colorBorder={block.border}
              colorText={block.text}
              placeholder={block.placeholder}
              value={r[block.key]}
              onChange={v => setField(0, block.key, v)}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '1.25rem' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={onContinue}>
          Vedi una risposta che apre
        </button>
      </div>

    </div>
  )
}
