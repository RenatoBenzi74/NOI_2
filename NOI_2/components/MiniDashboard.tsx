'use client'

import { AnalysisResult } from '@/lib/types'

interface MiniDashboardProps {
  analysis: AnalysisResult
  turnNumber: number
}

const stateConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  difesa:    { label: 'Difesa',    color: '#fca5a5', bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.3)' },
  risposta:  { label: 'Risposta', color: '#a5b4fc', bg: 'rgba(99,102,241,0.12)',   border: 'rgba(99,102,241,0.3)' },
  curiosità: { label: 'Curiosità',color: '#d8b4fe', bg: 'rgba(168,85,247,0.12)',   border: 'rgba(168,85,247,0.3)' },
  presenza:  { label: 'Presenza', color: '#fcd34d', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.3)' },
}

const stateInterpretation: Record<string, string> = {
  difesa:    'Stai proteggendo la tua posizione invece di esplorare.',
  risposta:  'Stai reagendo al contenuto, non all\'esperienza dell\'altro.',
  curiosità: 'Stai cercando di capire. Il dialogo è aperto.',
  presenza:  'Stai facendo spazio all\'altro rimanendo presente.',
}

export default function MiniDashboard({ analysis, turnNumber }: MiniDashboardProps) {
  const state = stateConfig[analysis.globalState]

  const indicators = [
    { label: 'Curiosità', value: analysis.activeCuriosity, inverse: false },
    { label: 'Presenza', value: analysis.presenceOnOther, inverse: false },
    { label: 'Correttivo', value: analysis.correctiveImpulse, inverse: true },
  ]

  return (
    <div
      className="screen-enter rounded-2xl p-4 space-y-3"
      style={{
        background: state.bg,
        border: `1px solid ${state.border}`,
        animationDelay: `${turnNumber * 80}ms`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(240,238,255,0.45)' }}>
          Turno {turnNumber}
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: state.bg, border: `1px solid ${state.border}`, color: state.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
          {state.label}
        </span>
      </div>

      {/* Interpretation */}
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.65)', fontStyle: 'italic' }}>
        {stateInterpretation[analysis.globalState]}
      </p>

      {/* 3 compact indicators */}
      <div className="space-y-2">
        {indicators.map((ind) => {
          const pct = ind.value
          const barColor = ind.inverse
            ? ind.value >= 60 ? '#fca5a5' : ind.value >= 40 ? '#fcd34d' : '#86efac'
            : ind.value >= 60 ? '#d8b4fe' : ind.value >= 40 ? '#a5b4fc' : '#93c5fd'

          return (
            <div key={ind.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>{ind.label}</span>
                <span className="text-xs font-bold" style={{ color: barColor }}>{ind.value}</span>
              </div>
              <div className="indicator-track" style={{ height: '4px' }}>
                <div
                  className="indicator-fill"
                  style={{
                    width: `${pct}%`,
                    background: barColor,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
