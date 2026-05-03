'use client'

import { useState } from 'react'

interface AlternativeResponseProps {
  userResponse: string
  alternativeResponse: string
  whyAlternativeWorks: string
  onContinue: () => void
  onBack: () => void
}

export default function AlternativeResponse({
  userResponse,
  alternativeResponse,
  whyAlternativeWorks,
  onContinue,
  onBack,
}: AlternativeResponseProps) {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Una risposta che apre</h2>
          <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Non la risposta giusta. Una risposta più partecipativa.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto">

        {/* Alternative response */}
        <div className="glass-card-strong p-6"
          style={{ background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(168,85,247,0.3)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(168,85,247,0.3)' }}>
              ✦
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#d8b4fe' }}>
              Risposta partecipativa
            </span>
          </div>

          <p className="text-base leading-relaxed text-white" style={{ fontStyle: 'italic', lineHeight: 1.8 }}>
            "{alternativeResponse}"
          </p>
        </div>

        {/* Why it works */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">💡</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#fcd34d' }}>
              Perché questa risposta apre
            </span>
          </div>
          <p className="noi-body text-sm leading-relaxed">
            {whyAlternativeWorks}
          </p>
        </div>

        {/* Toggle comparison */}
        <button
          className="w-full btn-secondary text-sm"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Nascondi confronto' : 'Confronta con la tua risposta'}
          <svg
            width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: showComparison ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Comparison */}
        {showComparison && (
          <div className="space-y-3 screen-enter">
            <div className="p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(240,238,255,0.4)' }}>
                La tua risposta
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.7)' }}>
                "{userResponse}"
              </p>
            </div>

            <div className="flex items-center gap-2 px-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
              <span className="text-xs" style={{ color: 'rgba(168,85,247,0.6)' }}>vs</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.2)' }} />
            </div>

            <div className="p-4 rounded-2xl"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#d8b4fe' }}>
                Risposta partecipativa
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.85)', fontStyle: 'italic' }}>
                "{alternativeResponse}"
              </p>
            </div>
          </div>
        )}

        {/* Reflection prompt */}
        <div className="text-center py-3">
          <p className="noi-micro">
            Leggi la risposta. Senti la differenza?<br />
            Dove ti sei avvicinato? Dove ti sei allontanato?
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-5">
        <button className="btn-primary w-full" onClick={onContinue}>
          Il mio inciampo
        </button>
      </div>
    </div>
  )
}
