'use client'

// ============================================================
// NOI² – DialogueView
// Componente centrale per il dialogo multi-turno
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { Scenario, Context, DialogueTurn, DialogueEndReason, AnalysisResult } from '@/lib/types'
import { analyzeListeningResponse } from '@/lib/analyzeListeningResponse'
import {
  MAX_TURNS,
  getOtherPersonMessage,
  getEndReason,
  getEndMessage,
} from '@/lib/dialogueEngine'

// ============================================================
// Types
// ============================================================

interface DialogueViewProps {
  scenario: Scenario
  context: Context
  onDialogueComplete: (turns: DialogueTurn[], endReason: DialogueEndReason) => void
  onBack: () => void
}

type Phase = 'reading' | 'typing' | 'processing' | 'reply_shown' | 'ended'

// ============================================================
// Helpers
// ============================================================

const STATE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  difesa: {
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.35)',
    text: '#fca5a5',
    dot: '#ef4444',
  },
  risposta: {
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    text: '#fdba74',
    dot: '#f97316',
  },
  curiosità: {
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.35)',
    text: '#c4b5fd',
    dot: '#a78bfa',
  },
  presenza: {
    bg: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.35)',
    text: '#6ee7b7',
    dot: '#34d399',
  },
}

const STATE_LABELS: Record<string, string> = {
  difesa: 'Difesa',
  risposta: 'Risposta',
  curiosità: 'Curiosità',
  presenza: 'Presenza',
}

function StateBadge({ state }: { state: string }) {
  const colors = STATE_COLORS[state] || STATE_COLORS['risposta']
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.3rem 0.85rem',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: colors.dot,
          flexShrink: 0,
        }}
      />
      {STATE_LABELS[state] || state}
    </span>
  )
}

// ============================================================
// Message bubbles
// ============================================================

function OtherPersonBubble({
  message,
  label,
  animate,
}: {
  message: string
  label: string
  animate: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.4rem',
        animation: animate ? 'bubbleIn 0.45s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
        opacity: animate ? 0 : 1,
      }}
    >
      <span
        style={{
          fontSize: '0.72rem',
          color: 'rgba(240,238,255,0.4)',
          paddingLeft: '0.25rem',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <div
        className="glass-card"
        style={{
          maxWidth: '82%',
          padding: '1rem 1.25rem',
          borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
          background: 'rgba(255,255,255,0.07)',
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#f0eeff',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          &ldquo;{message}&rdquo;
        </p>
      </div>
    </div>
  )
}

function UserBubble({
  message,
  analysis,
}: {
  message: string
  analysis: AnalysisResult
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.4rem',
        animation: 'bubbleInRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '1rem 1.25rem',
          borderRadius: '1.25rem 1.25rem 0.25rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(79,70,229,0.2) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}
      >
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: '#f0eeff',
            margin: 0,
          }}
        >
          {message}
        </p>
      </div>
      <StateBadge state={analysis.globalState} />
    </div>
  )
}

// ============================================================
// Main component
// ============================================================

export default function DialogueView({
  scenario,
  context,
  onDialogueComplete,
  onBack,
}: DialogueViewProps) {
  const [turns, setTurns] = useState<DialogueTurn[]>([])
  const [currentMessage, setCurrentMessage] = useState<string>(scenario.quote)
  const [turnIndex, setTurnIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('reading')
  const [userInput, setUserInput] = useState('')
  const [endReason, setEndReason] = useState<DialogueEndReason | null>(null)
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null)
  const [showContinue, setShowContinue] = useState(false)
  const [animateMessage, setAnimateMessage] = useState(true)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, phase, currentMessage])

  useEffect(() => {
    if (phase === 'typing') {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [phase])

  const wordCount = userInput.trim() === '' ? 0 : userInput.trim().split(/\s+/).length

  const handleStartTyping = useCallback(() => {
    setPhase('typing')
    setAnimateMessage(false)
  }, [])

  const handleSubmitResponse = useCallback(() => {
    if (userInput.trim().length < 3) return
    setPhase('processing')
    setTimeout(() => {
      const analysis = analyzeListeningResponse(userInput, scenario, context)
      const newTurn: DialogueTurn = {
        turnIndex,
        otherPersonMessage: currentMessage,
        userResponse: userInput,
        analysis,
      }
      const updatedTurns = [...turns, newTurn]
      setTurns(updatedTurns)
      setLastAnalysis(analysis)
      const reason = getEndReason(updatedTurns, turnIndex)
      if (reason) {
        setEndReason(reason)
        setPhase('ended')
      } else {
        setPhase('reply_shown')
        setTimeout(() => setShowContinue(true), 2000)
      }
    }, 900)
  }, [userInput, scenario, context, turnIndex, currentMessage, turns])

  const handleContinue = useCallback(() => {
    const nextIndex = turnIndex + 1
    const nextMsg = getOtherPersonMessage(scenario, nextIndex, turns)
    if (!nextMsg) {
      setEndReason('timeout')
      setPhase('ended')
      return
    }
    setTurnIndex(nextIndex)
    setCurrentMessage(nextMsg)
    setUserInput('')
    setShowContinue(false)
    setAnimateMessage(true)
    setPhase('reading')
  }, [turnIndex, scenario, turns])

  const handleComplete = useCallback(() => {
    if (endReason) onDialogueComplete(turns, endReason)
  }, [turns, endReason, onDialogueComplete])

  const endMsg = endReason ? getEndMessage(endReason) : null
  const progressValue = (turnIndex / MAX_TURNS) * 100

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateX(-16px) translateY(8px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes bubbleInRight {
          from { opacity: 0; transform: translateX(16px) translateY(8px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes pulse-soft { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(26,23,64,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.875rem 1.25rem 0' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} className="btn-ghost" style={{ padding: '0.4rem 0.6rem', flexShrink: 0 }} aria-label="Indietro">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.45)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{scenario.title}</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.7)', fontWeight: 500 }}>Scambio {Math.min(turnIndex + 1, MAX_TURNS)} / {MAX_TURNS}</p>
          </div>
        </div>
        <div style={{ maxWidth: '640px', margin: '0.625rem auto 0' }}>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressValue}%`, background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', borderRadius: '100px', transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
        <div style={{ maxWidth: '640px', margin: '0.5rem auto 0.75rem', display: 'flex', gap: '0.4rem' }}>
          {Array.from({ length: MAX_TURNS }, (_, i) => (
            <div key={i} style={{ height: '4px', flex: 1, borderRadius: '100px', background: i < turnIndex ? 'rgba(124,58,237,0.7)' : i === turnIndex ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {turns.map((turn, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <OtherPersonBubble message={turn.otherPersonMessage} label={scenario.title} animate={false} />
              <UserBubble message={turn.userResponse} analysis={turn.analysis} />
            </div>
          ))}
          {phase !== 'ended' && (
            <OtherPersonBubble message={currentMessage} label={scenario.title} animate={animateMessage} />
          )}
          {phase === 'ended' && endMsg && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <OtherPersonBubble message={currentMessage} label={scenario.title} animate={false} />
              <div className="glass-card-strong" style={{ padding: '1.5rem', textAlign: 'center', animation: 'bubbleIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {endReason === 'resolved' ? '✦' : endReason === 'closed' ? '◌' : '◇'}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f0eeff', marginBottom: '0.6rem' }}>{endMsg.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(240,238,255,0.7)', marginBottom: '1.5rem' }}>{endMsg.body}</p>
                <button className="btn-primary" onClick={handleComplete} style={{ width: '100%' }}>
                  Esplora cosa è successo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      {phase !== 'ended' && (
        <div style={{ position: 'sticky', bottom: 0, background: 'rgba(26,23,64,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {phase === 'reading' && (
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleStartTyping}>
                Rispondi
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            )}
            {phase === 'typing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <textarea
                    ref={textareaRef}
                    className="noi-textarea"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Come risponderesti in questo momento?"
                    rows={4}
                    style={{ minHeight: '100px' }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitResponse() }}
                  />
                  <span style={{ position: 'absolute', bottom: '0.75rem', right: '1rem', fontSize: '0.75rem', color: wordCount < 5 ? 'rgba(240,238,255,0.3)' : 'rgba(240,238,255,0.5)' }}>
                    {wordCount} {wordCount === 1 ? 'parola' : 'parole'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-secondary" onClick={() => setPhase('reading')} style={{ flexShrink: 0 }}>Indietro</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmitResponse} disabled={userInput.trim().length < 3}>
                    Invia
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </button>
                </div>
              </div>
            )}
            {phase === 'processing' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.875rem', color: 'rgba(240,238,255,0.6)', fontSize: '0.9rem' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(167,139,250,0.3)', borderTopColor: '#a78bfa', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                Analizzando la tua risposta...
              </div>
            )}
            {phase === 'reply_shown' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {lastAnalysis && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.5)' }}>Stato ascolto:</span>
                    <StateBadge state={lastAnalysis.globalState} />
                  </div>
                )}
                {showContinue && turnIndex < MAX_TURNS - 1 && (
                  <button className="btn-primary" style={{ width: '100%' }} onClick={handleContinue}>
                    Continua il dialogo
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                )}
                {!showContinue && (
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(240,238,255,0.3)', animation: 'pulse-soft 1.5s ease-in-out infinite' }}>...</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
  }
