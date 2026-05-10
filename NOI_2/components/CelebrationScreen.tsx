'use client'

import { useEffect, useState } from 'react'
import { ListeningState, Context } from '@/lib/types'

interface CelebrationScreenProps {
  globalState: ListeningState
  globalStateNuance?: string
  context: Context
  onNewScenario: () => void
  onChangeContext: () => void
  onViewSummary: () => void
}

const CELEBRATION_CONTENT: Record<'curiosità' | 'presenza', {
  headline: string
  subtitle: string
  body: string
  emoji: string
  color: string
}> = {
  curiosità: {
    headline: 'Stavi ascoltando davvero.',
    subtitle: 'Curiosità attiva rilevata',
    body: 'Hai esplorato invece di rispondere. Hai lasciato spazio alla domanda invece di chiuderla con una soluzione. È esattamente così che si apre un dialogo.',
    emoji: '✦',
    color: 'from-violet-500/30 to-blue-500/30',
  },
  presenza: {
    headline: 'Eri davvero presente.',
    subtitle: 'Presenza Risonante rilevata',
    body: "Hai fatto spazio all'altro senza sparire tu. Hai ascoltato il vissuto, non solo le parole. Questa è la qualità emergente del Metodo — la Presenza Risonante.",
    emoji: '◈',
    color: 'from-emerald-500/30 to-violet-500/30',
  },
}

const CONTEXT_LABELS: Record<string, string> = {
  lavoro: 'Lavoro',
  famiglia: 'Famiglia',
  amicizie: 'Amicizie',
  coppia: 'Coppia',
  gruppi: 'Gruppi',
  vendita: 'Vendita / Cliente',
}

export default function CelebrationScreen({
  globalState,
  globalStateNuance,
  context,
  onNewScenario,
  onChangeContext,
  onViewSummary,
}: CelebrationScreenProps) {
  const [visible, setVisible] = useState(false)
  const [particlesVisible, setParticlesVisible] = useState(false)

  const content =
    globalState === 'presenza' || globalState === 'curiosità'
      ? CELEBRATION_CONTENT[globalState]
      : null

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80)
    const t2 = setTimeout(() => setParticlesVisible(true), 300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (!content) return null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
    >
      <div className="relative flex items-center justify-center mb-8">
        <div
          className={`absolute rounded-full bg-gradient-to-br ${content.color} blur-3xl`}
          style={{
            width: 280,
            height: 280,
            opacity: particlesVisible ? 0.6 : 0,
            transition: 'opacity 1s ease, transform 1.2s ease',
            transform: particlesVisible ? 'scale(1)' : 'scale(0.5)',
          }}
        />
        <div
          className={`absolute rounded-full border-2 ${
            globalState === 'presenza'
              ? 'border-emerald-400/40'
              : 'border-violet-400/40'
          }`}
          style={{
            width: 160,
            height: 160,
            opacity: particlesVisible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
            animation: particlesVisible ? 'spin 12s linear infinite' : 'none',
          }}
        />
        <div
          className={`relative z-10 flex items-center justify-center rounded-full ${
            globalState === 'presenza'
              ? 'bg-gradient-to-br from-emerald-500/20 to-violet-500/20'
              : 'bg-gradient-to-br from-violet-500/20 to-blue-500/20'
          }`}
          style={{
            width: 96,
            height: 96,
            border: `1.5px solid ${
              globalState === 'presenza'
                ? 'rgba(52, 211, 153, 0.4)'
                : 'rgba(167, 139, 250, 0.4)'
            }`,
            opacity: particlesVisible ? 1 : 0,
            transform: particlesVisible ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.6s ease 0.2s',
          }}
        >
          <span style={{ fontSize: 36, opacity: 0.9 }}>{content.emoji}</span>
        </div>
      </div>

      <div
        className="mb-4"
        style={{
          opacity: particlesVisible ? 1 : 0,
          transform: particlesVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
        }}
      >
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase ${
            globalState === 'presenza'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
          }`}
        >
          {content.subtitle}
        </span>
      </div>

      <h1
        className="text-center mb-3"
        style={{
          fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
          fontWeight: 300,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          opacity: particlesVisible ? 1 : 0,
          transform: particlesVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
          maxWidth: 480,
        }}
      >
        {content.headline}
      </h1>

      <p
        className="text-center mb-2"
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          opacity: particlesVisible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.6s',
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        {globalStateNuance || content.body}
      </p>

      {globalStateNuance && (
        <p
          className="text-center mb-2"
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            opacity: particlesVisible ? 0.8 : 0,
            transition: 'opacity 0.5s ease 0.65s',
            maxWidth: 400,
            lineHeight: 1.6,
          }}
        >
          {content.body}
        </p>
      )}

      <div
        className="my-6"
        style={{
          width: 40,
          height: 1,
          background:
            globalState === 'presenza'
              ? 'rgba(52, 211, 153, 0.3)'
              : 'rgba(167, 139, 250, 0.3)',
          opacity: particlesVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.7s',
        }}
      />

      <p
        className="text-center mb-6"
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          opacity: particlesVisible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.75s',
        }}
      >
        Vuoi continuare ad allenarti?
      </p>

      <div
        className="flex flex-col gap-3 w-full"
        style={{
          maxWidth: 360,
          opacity: particlesVisible ? 1 : 0,
          transform: particlesVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease 0.85s, transform 0.5s ease 0.85s',
        }}
      >
        <button
          onClick={onNewScenario}
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center' }}
        >
          Nuovo scenario — {CONTEXT_LABELS[context]}
        </button>

        <button
          onClick={onChangeContext}
          className="btn btn-secondary w-full"
          style={{ justifyContent: 'center' }}
        >
          Cambia contesto
        </button>

        <button
          onClick={onViewSummary}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: '8px',
            textAlign: 'center',
            textDecoration: 'underline',
            textDecorationColor: 'transparent',
            transition: 'color 0.2s, text-decoration-color 0.2s',
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLElement).style.color = 'var(--text-secondary)'
            ;(e.target as HTMLElement).style.textDecorationColor = 'var(--text-muted)'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLElement).style.color = 'var(--text-muted)'
            ;(e.target as HTMLElement).style.textDecorationColor = 'transparent'
          }}
        >
          Vedi il riepilogo completo
        </button>
      </div>
    </div>
  )
  }
