'use client'

import { ListeningState } from '@/lib/types'

interface ListeningAuraProps {
  state: ListeningState
  nuance?: string
  size?: number
}

const auraConfig: Record<ListeningState, {
  ring1: string
  ring2: string
  ring3: string
  core: string
  glow: string
  label: string
  description: string
  scale: number
}> = {
  difesa: {
    ring1: 'rgba(239, 68, 68, 0.3)',
    ring2: 'rgba(239, 68, 68, 0.15)',
    ring3: 'rgba(239, 68, 68, 0.06)',
    core: 'linear-gradient(135deg, rgba(239,68,68,0.5), rgba(124,58,237,0.3))',
    glow: 'rgba(239, 68, 68, 0.25)',
    label: 'Difesa',
    description: 'Stai proteggendo la tua posizione più che esplorando quella dell\'altro.',
    scale: 0.75,
  },
  risposta: {
    ring1: 'rgba(99, 102, 241, 0.35)',
    ring2: 'rgba(99, 102, 241, 0.18)',
    ring3: 'rgba(99, 102, 241, 0.07)',
    core: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(124,58,237,0.4))',
    glow: 'rgba(99, 102, 241, 0.3)',
    label: 'Risposta',
    description: 'Stai reagendo al contenuto, ma non ancora al vissuto.',
    scale: 0.88,
  },
  curiosità: {
    ring1: 'rgba(168, 85, 247, 0.4)',
    ring2: 'rgba(168, 85, 247, 0.2)',
    ring3: 'rgba(168, 85, 247, 0.08)',
    core: 'linear-gradient(135deg, rgba(168,85,247,0.65), rgba(99,102,241,0.45))',
    glow: 'rgba(168, 85, 247, 0.35)',
    label: 'Curiosità',
    description: 'Stai iniziando a esplorare il mondo dell\'altro.',
    scale: 1.0,
  },
  presenza: {
    ring1: 'rgba(245, 158, 11, 0.4)',
    ring2: 'rgba(168, 85, 247, 0.25)',
    ring3: 'rgba(245, 158, 11, 0.1)',
    core: 'linear-gradient(135deg, rgba(245,158,11,0.6), rgba(168,85,247,0.5))',
    glow: 'rgba(245, 158, 11, 0.3)',
    label: 'Presenza',
    description: 'Stai facendo spazio all\'altro senza sparire tu.',
    scale: 1.12,
  },
}

export default function ListeningAura({ state, nuance, size = 160 }: ListeningAuraProps) {
  const config = auraConfig[state]
  const s = size * config.scale

  return (
    <div className="flex flex-col items-center gap-5">

      {/* Aura visual */}
      <div className="aura-container" style={{ width: size * 1.5, height: size * 1.5 }}>

        {/* Outer ring */}
        <div className="aura-ring aura-ring-3" style={{
          width: s * 1.4,
          height: s * 1.4,
          background: `radial-gradient(ellipse at center, ${config.ring3} 0%, transparent 70%)`,
        }} />

        {/* Mid ring */}
        <div className="aura-ring aura-ring-2" style={{
          width: s * 1.15,
          height: s * 1.15,
          background: `radial-gradient(ellipse at center, ${config.ring2} 0%, transparent 70%)`,
        }} />

        {/* Inner ring */}
        <div className="aura-ring aura-ring-1" style={{
          width: s,
          height: s,
          background: `radial-gradient(ellipse at center, ${config.ring1} 0%, transparent 65%)`,
        }} />

        {/* Core glow */}
        <div style={{
          width: s * 0.55,
          height: s * 0.55,
          borderRadius: '50%',
          background: config.core,
          boxShadow: `0 0 ${s * 0.4}px ${config.glow}, 0 0 ${s * 0.15}px ${config.ring1}`,
          position: 'relative',
          zIndex: 10,
          animation: 'auraBreath1 3.5s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* State label inside */}
          <span className="text-white font-bold tracking-wide"
            style={{ fontSize: Math.max(s * 0.09, 12), textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            {config.label.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* State info */}
      <div className="text-center max-w-xs space-y-2">
        <div className={`state-badge state-badge-${state} mx-auto`}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: state === 'difesa' ? '#ef4444' : state === 'risposta' ? '#6366f1' : state === 'curiosità' ? '#a855f7' : '#f59e0b' }} />
          {config.label}
        </div>

        {nuance && (
          <p className="text-sm font-medium" style={{ color: 'rgba(240,238,255,0.85)' }}>
            {nuance}
          </p>
        )}

        <p className="noi-micro">
          {config.description}
        </p>
      </div>
    </div>
  )
}
