'use client'

import { useEffect, useRef, useState } from 'react'
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

  // Dettatura vocale (Web Speech API del browser: gratuita, nessun costo API)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<any>(null)
  const baseTextRef = useRef('')

  useEffect(() => {
    const w = window as any
    setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition))
    return () => recognitionRef.current?.abort()
  }, [])

  const stopVoice = () => {
    recognitionRef.current?.stop()
  }

  const startVoice = () => {
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) return
    setVoiceError('')
    baseTextRef.current = text
    const rec = new SR()
    rec.lang = 'it-IT'
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (event: any) => {
      let finals = ''
      let interimChunk = ''
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) finals += r[0].transcript
        else interimChunk += r[0].transcript
      }
      const base = baseTextRef.current
      const sep = base && !/\s$/.test(base) && finals ? ' ' : ''
      setText(base + sep + finals.trimStart())
      setInterim(interimChunk)
      if (showHint) setShowHint(false)
    }
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setVoiceError('Per rispondere a voce devi consentire l\'accesso al microfono.')
      } else if (e.error === 'no-speech') {
        setVoiceError('Non ho sentito nulla. Riprova avvicinandoti al microfono.')
      } else if (e.error !== 'aborted') {
        setVoiceError('La dettatura si è interrotta. Puoi riprovare o scrivere.')
      }
    }
    rec.onend = () => {
      setListening(false)
      setInterim('')
    }

    recognitionRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const isReady = wordCount >= 5

  const handleSubmit = () => {
    if (!isReady) {
      setShowHint(true)
      return
    }
    if (listening) stopVoice()
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
            style={{ minHeight: '200px', height: '100%', paddingBottom: voiceSupported ? '3.5rem' : undefined }}
            placeholder="Scrivi o detta qui la tua risposta, come se la persona fosse davanti a te…"
            value={listening && interim ? (text ? text + ' ' : '') + interim : text}
            onChange={(e) => {
              if (listening) stopVoice()
              setText(e.target.value)
              if (showHint) setShowHint(false)
            }}
            autoFocus
          />
          {/* Microfono: rispondi a voce */}
          {voiceSupported && (
            <button
              type="button"
              onClick={listening ? stopVoice : startVoice}
              aria-label={listening ? 'Ferma la dettatura' : 'Rispondi a voce'}
              className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full px-3 py-2 text-sm"
              style={{
                background: listening ? 'rgba(239,68,68,0.18)' : 'rgba(124,58,237,0.18)',
                border: listening ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(168,85,247,0.35)',
                color: listening ? '#fca5a5' : '#e9d5ff',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
              </svg>
              {listening ? 'Ti ascolto… tocca per fermare' : 'Rispondi a voce'}
            </button>
          )}
          {/* Word count */}
          {text.length > 0 && (
            <div className="absolute bottom-4 right-4 text-xs"
              style={{ color: 'rgba(240,238,255,0.3)' }}>
              {wordCount} {wordCount === 1 ? 'parola' : 'parole'}
            </div>
          )}
        </div>

        {voiceError && (
          <div className="text-sm py-2 px-4 rounded-xl text-center animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
            {voiceError}
          </div>
        )}

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
