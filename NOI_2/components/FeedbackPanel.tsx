'use client'

// ============================================================
// NOI² – FeedbackPanel v4
// Dialogue mode: exchanges → 6 indicators → unified reflection
// Single-response mode: 4 blocks with optional reflection textareas
// ============================================================

import { useState } from 'react'
import { FeedbackBlocks, DialogueTurn, AnalysisResult, ListeningState } from '@/lib/types'

interface FeedbackPanelProps {
  feedback: FeedbackBlocks             // best/aggregated feedback
  bestAnalysis?: AnalysisResult        // full best analysis (for alt response + scores)
  turns?: DialogueTurn[]               // dialogue mode: full history
  onContinue: () => void               // single-response: go to alternative
  onSave?: (reflection: string) => void // dialogue mode: save & go to summary
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
    title: 'Dove ti sei chiuso',
    icon: '🔒',
    color: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    text: '#fca5a5',
    placeholder: 'Cosa noti in questo pattern…',
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
    title: "Come aprire l'orizzonte",
    icon: '🔭',
    color: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    text: '#fcd34d',
    placeholder: 'La prossima volta…',
  },
]

// ── 6 indicators config ────────────────────────────────────────

type IndicatorKey = 'stumbleAccepted' | 'judgmentSuspended' | 'activeCuriosity' | 'presenceOnOther' | 'openHorizon' | 'correctiveImpulse'

const INDICATORS: {
  key: IndicatorKey
  name: string
  question: string
  isInverse: boolean
  getInterpretation: (v: number) => string
}[] = [
  {
    key: 'stumbleAccepted',
    name: 'Inciampo accolto',
    question: 'Ti sei lasciato spiazzare dalla frase?',
    isInverse: false,
    getInterpretation: (v) =>
      v >= 65 ? 'Hai lasciato che le parole ti raggiungessero davvero, senza neutralizzarle subito.'
      : v >= 40 ? "Hai in parte accolto ciò che ti ha spiazzato, ma in parte l'hai gestito rapidamente."
      : 'La risposta mostra che hai elaborato l'inciampo in modo rapido, senza lasciarti toccare.',
  },
  {
    key: 'judgmentSuspended',
    name: 'Giudizio sospeso',
    question: 'Hai evitato di classificare o correggere?',
    isInverse: false,
    getInterpretation: (v) =>
      v >= 65 ? 'Non hai etichettato l'altro né la situazione. Hai mantenuto lo spazio aperto.'
      : v >= 40 ? 'Qualche classificazione implicita è emersa, anche se non dominante.'
      : 'La risposta contiene giudizi o valutazioni sottili che chiudono lo spazio all'altro.',
  },
  {
    key: 'activeCuriosity',
    name: 'Curiosità attiva',
    question: 'Stai esplorando o stai già rispondendo?',
    isInverse: false,
    getInterpretation: (v) =>
      v >= 65 ? "Stai esplorando il mondo dell'altro invece di concludere o spiegare."
      : v >= 40 ? 'C'è un inizio di esplorazione, ma la risposta tende ancora verso la conclusione.'
      : 'La risposta è più orientata a rispondere e risolvere che a capire cosa sta succedendo.',
  },
  {
    key: 'presenceOnOther',
    name: "Presenza sull'altro",
    question: "La tua attenzione è sull'altro o su di te?",
    isInverse: false,
    getInterpretation: (v) =>
      v >= 65 ? "La tua attenzione è sul vissuto dell'altro, non sulla tua posizione o reazione."
      : v >= 40 ? 'Sei in parte sull'altro, in parte ancora sulla tua prospettiva.'
      : 'La risposta è centrata principalmente su di te, sulla situazione o sulla tua valutazione.',
  },
  {
    key: 'openHorizon',
    name: 'Orizzonte aperto',
    question: 'Allarghi il campo o indichi la via?',
    isInverse: false,
    getInterpretation: (v) =>
      v >= 65 ? 'Stai allargando il campo di possibilità, non restringendolo verso una soluzione.'
      : v >= 40 ? 'C'è qualche apertura, ma la risposta tende anche a indicare una direzione.'
      : 'La risposta tende a indicare, spiegare o risolvere — chiude più che aprire.',
  },
  {
    key: 'correctiveImpulse',
    name: 'Impulso a correggere',
    question: 'Stai aggiustando prima ancora di ascoltare?',
    isInverse: true,
    getInterpretation: (v) =>
      v >= 65 ? 'La risposta prova a sistemare la situazione prima di aver davvero capito cosa sente l'altro.'
      : v >= 40 ? 'C'è qualche spinta a risolvere o spiegare, ma non è dominante.'
      : 'Stai resistendo all'impulso di sistemare — un segnale positivo di ascolto genuino.',
  },
]

// ── Types ─────────────────────────────────────────────────────

type Reflection = { closure: string; opening: string; unheard: string; horizon: string }

function emptyReflection(): Reflection {
  return { closure: '', opening: '', unheard: '', horizon: '' }
}

// ── Shared sub-components ─────────────────────────────────────

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1.5rem 0 1.1rem' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(240,238,255,0.1)' }} />
      <span style={{
        fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'rgba(240,238,255,0.35)', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(240,238,255,0.1)' }} />
    </div>
  )
}

function ScoreBar({ value, isInverse }: { value: number; isInverse: boolean }) {
  const effectiveValue = isInverse ? 100 - value : value
  const color = effectiveValue >= 65 ? '#6ee7b7' : effectiveValue >= 40 ? '#fcd34d' : '#fca5a5'
  return (
    <div style={{
      width: '100%', height: 4, borderRadius: 2,
      background: 'rgba(240,238,255,0.08)',
      marginTop: 5, overflow: 'hidden',
    }}>
      <div style={{
        width: `${value}%`, height: '100%', borderRadius: 2,
        background: color, transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

function IndicatorRow({ indicator, value }: { indicator: typeof INDICATORS[0]; value: number }) {
  const effectiveValue = indicator.isInverse ? 100 - value : value
  const scoreColor = effectiveValue >= 65 ? '#6ee7b7' : effectiveValue >= 40 ? '#fcd34d' : '#fca5a5'
  const interpretation = indicator.getInterpretation(value)
  return (
    <div style={{
      background: 'rgba(240,238,255,0.03)',
      border: '1px solid rgba(240,238,255,0.07)',
      borderRadius: '12px',
      padding: '11px 13px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(240,238,255,0.88)' }}>
          {indicator.name}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: scoreColor, flexShrink: 0, marginLeft: 8 }}>
          {value}
        </span>
      </div>
      <div style={{ fontSize: '10.5px', color: 'rgba(240,238,255,0.4)', marginBottom: 5 }}>
        {indicator.question}
      </div>
      <ScoreBar value={value} isInverse={indicator.isInverse} />
      <p style={{
        fontSize: '11.5px', lineHeight: '1.55',
        color: 'rgba(240,238,255,0.62)',
        margin: '7px 0 0',
      }}>
        {interpretation}
      </p>
    </div>
  )
}

function ReflectionTextarea({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder: string
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
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(240,238,255,0.28)' }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(240,238,255,0.1)' }}
    />
  )
}

function FeedbackBlock({
  icon, title, content, colorBg, colorBorder, colorText,
  placeholder, value, onChange,
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
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: colorText }}>
            {title}
          </span>
        </div>
        <p style={{ fontSize: '12.5px', lineHeight: '1.65', color: 'rgba(240,238,255,0.78)', margin: 0 }}>
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
  feedback, bestAnalysis, turns, onContinue, onSave, onBack,
}: FeedbackPanelProps) {
  const [reflection, setReflection] = useState<Reflection>(emptyReflection())

  const setField = (field: keyof Reflection, value: string) => {
    setReflection(prev => ({ ...prev, [field]: value }))
  }

  const buildReflectionText = (): string => {
    return [
      reflection.closure  && `Chiusura: ${reflection.closure}`,
      reflection.opening  && `Apertura: ${reflection.opening}`,
      reflection.unheard  && `Non ascoltato: ${reflection.unheard}`,
      reflection.horizon  && `Orizzonte: ${reflection.horizon}`,
    ].filter(Boolean).join('\n\n')
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
      <div style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '2rem 1.25rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: 0, flexShrink: 0 }} onClick={onBack}>
              <BackArrow />
            </button>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                Come hai ascoltato
              </h2>
              <p style={{ fontSize: '11px', color: 'rgba(240,238,255,0.45)', margin: '2px 0 0' }}>
                {turns.length} scambi · riflessione opzionale
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>

          {/* Compact exchange list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '0.5rem' }}>
            {turns.map((turn, i) => {
              const cfg = STATE_CONFIG[turn.analysis.globalState]
              return (
                <div key={turn.turnIndex}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(240,238,255,0.07)',
                      border: '1px solid rgba(240,238,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700, color: 'rgba(240,238,255,0.45)',
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'rgba(240,238,255,0.06)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px' }}>
                    <div style={{
                      maxWidth: '85%',
                      background: 'rgba(240,238,255,0.06)',
                      border: '1px solid rgba(240,238,255,0.1)',
                      borderRadius: '14px 14px 14px 3px',
                      padding: '8px 12px',
                      fontSize: '12.5px', lineHeight: '1.55',
                      color: 'rgba(240,238,255,0.75)',
                      fontStyle: 'italic',
                    }}>
                      {turn.otherPersonMessage}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                    <div style={{
                      maxWidth: '85%',
                      background: 'rgba(100,80,220,0.2)',
                      border: '1px solid rgba(140,120,255,0.25)',
                      borderRadius: '14px 14px 3px 14px',
                      padding: '8px 12px',
                      fontSize: '12.5px', lineHeight: '1.55',
                      color: 'rgba(240,238,255,0.88)',
                    }}>
                      {turn.userResponse}
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 10px', borderRadius: '20px',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
                    }}>
                      {cfg.icon} {cfg.label.toUpperCase()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 6 indicators section */}
          {bestAnalysis && (
            <>
              <Divider label="I 6 indicatori del tuo ascolto" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.5rem' }}>
                {INDICATORS.map(ind => (
                  <IndicatorRow
                    key={ind.key}
                    indicator={ind}
                    value={bestAnalysis[ind.key] as number}
                  />
                ))}
              </div>
            </>
          )}

          {/* Unified reflection */}
          <Divider label="Riflessione complessiva" />

          {/* 4 unified feedback blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
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
                value={reflection[block.key]}
                onChange={v => setField(block.key, v)}
              />
            ))}

            {bestAnalysis?.alternativeResponse && (
              <div style={{
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '14px',
                padding: '13px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px' }}>✨</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc' }}>
                    Una risposta che apriva
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', lineHeight: '1.65', color: 'rgba(240,238,255,0.82)', margin: 0, fontStyle: 'italic' }}>
                  &ldquo;{bestAnalysis.alternativeResponse}&rdquo;
                </p>
                {bestAnalysis.whyAlternativeWorks && (
                  <p style={{ fontSize: '11.5px', lineHeight: '1.55', color: 'rgba(240,238,255,0.45)', margin: '6px 0 0' }}>
                    {bestAnalysis.whyAlternativeWorks}
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ height: '0.5rem' }} />
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
  return (
    <div style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

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

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
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
              value={reflection[block.key]}
              onChange={v => setField(block.key, v)}
            />
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '1.25rem' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={onContinue}>
          Vedi una risposta che apre
        </button>
      </div>

    </div>
  )
}
