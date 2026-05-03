'use client'

import { useState } from 'react'
import { Scenario } from '@/lib/types'

interface ResponseInputProps {
  scenario: Scenario
  initialValue: string
  onSubmit: (response: string) => void
  onBack: () => void
}

export default function ResponseInput({
  scenario,
  initialValue,
  onSubmit,
  onBack,
}: ResponseInputProps) {
  const [text, setText] = useState(initialValue)
  const [showHint, setShowHint] = useState(false)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const isReady = wordCount >= 5

  const handleSubmit = () => {
    if (!isReady) {
      setShowHint(true)
      return
    }
    onSubmit(text)
  }

  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white">La tua risposta</h2>
      </div>

      <div className="flex-1 flex flex-col gap-5">

        {/* Scenario recap */}
        <div className="glass-card p-4"
          style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(168,85,247,0.2)' }}>
          <div className="noi-micro mb-2 uppercase tracking-wider">Scenario · {scenario.title}</div>
          <blockquote className="noi-quote text-base">
            "{scenario.quote}"
          </blockquote>
        </div>

        {/* Prompt */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Come risponderesti?</h3>
          <p className="noi-micro">
            Non cercare la risposta perfetta. Rispondi come faresti davvero.
          </p>
        </div>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            className="noi-textarea w-full"
            style={{ minHeight: '200px', height: '100%' }}
            placeholder="Scrivi qui la tua risposta, come se la persona fosse davanti a te…"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (showHint) setShowHint(false)
            }}
            autoFocus
          />
          {/* Word count */}
          {text.length > 0 && (
            <div className="absolute bottom-4 right-4 text-xs"
              style={{ color: 'rgba(240,238,255,0.3)' }}>
              {wordCount} {wordCount === 1 ? 'parola' : 'parole'}
            </div>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="text-sm py-2 px-4 rounded-xl text-center animate-fade-in"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' }}>
            Prova a scrivere almeno una risposta reale, come se la persona fosse davanti a te.
          </div>
        )}

        {/* Progress bar */}
        {text.length > 0 && (
          <div className="space-y-1">
            <div className="indicator-track">
              <div
                className="indicator-fill"
                style={{
                  width: `${Math.min((wordCount / 20) * 100, 100)}%`,
                  background: isReady
                    ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                    : 'linear-gradient(90deg, #4338ca, #6366f1)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p className="noi-micro text-right">
              {isReady ? 'Pronto per l\'analisi' : 'Continua a scrivere…'}
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="pt-5">
        <button
          className="btn-primary w-full"
          onClick={handleSubmit}
          style={{ opacity: isReady ? 1 : 0.6 }}
        >
          Osserva il mio ascolto
        </button>
      </div>
    </div>
  )
}
