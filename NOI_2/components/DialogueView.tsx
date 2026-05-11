'use client'

// ============================================================
// NOI² – DialogueView v2
// Chat fluida — nessun click intermedio, dialogo continuo
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { Scenario, Context, DialogueTurn, DialogueEndReason, AnalysisResult } from '@/lib/types'
import { analyzeListeningResponse } from '@/lib/analyzeListeningResponse'
import { MAX_TURNS, getOtherPersonMessage, getEndReason, getEndMessage } from '@/lib/dialogueEngine'

// ============================================================
// Types
// ============================================================

interface DialogueViewProps {
  scenario: Scenario
  context: Context
  onDialogueComplete: (turns: DialogueTurn[], endReason: DialogueEndReason) => void
  onBack: () => void
}

type ChatMessage =
  | { role: 'other'; text: string }
  | { role: 'user'; text: string; analysis: AnalysisResult }

type Phase = 'typing' | 'processing' | 'replying' | 'ended'

// ============================================================
// Style helpers
// ============================================================

const STATE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  difesa: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', text: '#fca5a5', dot: '#ef4444' },
  risposta: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)', text: '#fdba74', dot: '#f97316' },
  curiosità: { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', text: '#c4b5fd', dot: '#a78bfa' },
  presenza: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', text: '#6ee7b7', dot: '#34d399' },
}

const STATE_LABELS: Record<string, string> = {
  difesa: 'Difesa',
  risposta: 'Risposta',
  curiosità: 'Curiosità',
  presenza: 'Presenza',
}

// ============================================================
// Sub-components
// ============================================================

function StateBadge({ state }: { state: string }) {
  const colors = STATE_COLORS[state] || STATE_COLORS['risposta']
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '100px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
      {STATE_LABELS[state] || state}
    </span>
  )
}

function OtherBubble({ text, label, animate }: { text: string; label: string; animate: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.35rem',
        animation: animate ? 'bubbleIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
        opacity: animate ? 0 : 1,
      }}
    >
      <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.4)', paddingLeft: '0.25rem', fontWeight: 500 }}>
        {label}
      </span>
      <div
        className="glass-card"
        style={{
          maxWidth: '85%',
          padding: '0.9rem 1.1rem',
          borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
          background: 'rgba(255,255,255,0.07)',
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#f0eeff', fontStyle: 'italic', margin: 0 }}>
          &ldquo;{text}&rdquo;
        </p>
      </div>
    </div>
  )
}

function UserBubble({ text, analysis }: { text: string; analysis: AnalysisResult }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.4rem',
        animation: 'bubbleInRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '0.9rem 1.1rem',
          borderRadius: '1.25rem 1.25rem 0.25rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(79,70,229,0.2) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}
      >
        <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#f0eeff', margin: 0 }}>{text}</p>
      </div>
      <StateBadge state={analysis.globalState} />
    </div>
  )
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem' }}>
      <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.4)', paddingLeft: '0.25rem', fontWeight: 500 }}>
        {label}
      </span>
      <div
        className="glass-card"
        style={{
          padding: '0.85rem 1.1rem',
          borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
          background: 'rgba(255,255,255,0.07)',
          borderColor: 'rgba(255,255,255,0.12)',
          display: 'flex',
          gap: '0.4rem',
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'rgba(167,139,250,0.7)',
              display: 'inline-block',
              animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Main component
// ============================================================

export default function DialogueView({ scenario, context, onDialogueComplete, onBack }: DialogueViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'other', text: scenario.quote },
  ])
  const [turns, setTurns] = useState<DialogueTurn[]>([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const [userInput, setUserInput] = useState('')
  const [endReason, setEndReason] = useState<DialogueEndReason | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom whenever messages or phase changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, phase])

  // Focus textarea when typing phase
  useEffect(() => {
    if (phase === 'typing') {
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [phase])

  const wordCount = userInput.trim() === '' ? 0 : userInput.trim().split(/\s+/).length
  const canSubmit = wordCount >= 3 && phase === 'typing'

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return

    const inputSnapshot = userInput
    setPhase('processing')

    // Small delay to show processing state
    setTimeout(() => {
      const analysis = analyzeListeningResponse(inputSnapshot, scenario, context)

      // Find the last "other" message in the conversation as the current message
      const lastOtherMsg = [...messages].reverse().find(m => m.role === 'other')?.text ?? scenario.quote

      const newTurn: DialogueTurn = {
        turnIndex,
        otherPersonMessage: lastOtherMsg,
        userResponse: inputSnapshot,
        analysis,
      }
      const updatedTurns = [...turns, newTurn]

      // Add user bubble immediately
      setMessages(prev => [...prev, { role: 'user', text: inputSnapshot, analysis }])
      setTurns(updatedTurns)
      setUserInput('')

      // Show typing indicator
      setPhase('replying')

      // After typing delay, add other person's response
      setTimeout(() => {
        const nextTurnIndex = turnIndex + 1
        const nextMsg = getOtherPersonMessage(scenario, nextTurnIndex, updatedTurns)
        const reason = getEndReason(updatedTurns, turnIndex)

        // Always show the other person's next message (even when ending)
        if (nextMsg) {
          setMessages(prev => [...prev, { role: 'other', text: nextMsg }])
        }

        if (reason) {
          setEndReason(reason)
          setTimeout(() => setPhase('ended'), 500)
        } else {
          setTurnIndex(nextTurnIndex)
          setPhase('typing')
        }
      }, 1400)
    }, 600)
  }, [canSubmit, userInput, scenario, context, turnIndex, turns, messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleComplete = useCallback(() => {
    if (endReason) onDialogueComplete(turns, endReason)
  }, [turns, endReason, onDialogueComplete])

  const endMsg = endReason ? getEndMessage(endReason) : null
  const progressDots = Math.min(turns.length, MAX_TURNS)

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Inline animations */}
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateX(-14px) translateY(6px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes bubbleInRight {
          from { opacity: 0; transform: translateX(14px) translateY(6px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          background: 'rgba(26,23,64,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0.875rem 1.25rem 0.75rem',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Back button */}
          <button
            onClick={onBack}
            className="btn-ghost"
            style={{ padding: '0.4rem 0.6rem', flexShrink: 0 }}
            aria-label="Indietro"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.45)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {scenario.title}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.7)', fontWeight: 500 }}>
              Scambio {Math.min(turnIndex + 1, MAX_TURNS)} / {MAX_TURNS}
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {Array.from({ length: MAX_TURNS }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i < progressDots
                    ? 'rgba(124,58,237,0.8)'
                    : i === progressDots
                    ? 'rgba(167,139,250,0.4)'
                    : 'rgba(255,255,255,0.12)',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem 0.5rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {messages.map((msg, i) =>
            msg.role === 'other' ? (
              <OtherBubble key={i} text={msg.text} label={scenario.title} animate={i > 0} />
            ) : (
              <UserBubble key={i} text={msg.text} analysis={(msg as { role: 'user'; text: string; analysis: AnalysisResult }).analysis} />
            )
          )}

          {/* Typing indicator */}
          {phase === 'replying' && <TypingIndicator label={scenario.title} />}

          {/* End card */}
          {phase === 'ended' && endMsg && (
            <div
              className="glass-card-strong"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                animation: 'fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                {endReason === 'resolved' ? '✦' : endReason === 'closed' ? '◌' : '◇'}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff', marginBottom: '0.5rem' }}>
                {endMsg.title}
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'rgba(240,238,255,0.7)', marginBottom: '1.25rem' }}>
                {endMsg.body}
              </p>
              <button className="btn-primary" onClick={handleComplete} style={{ width: '100%' }}>
                Esplora cosa è successo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

          <div ref={chatEndRef} style={{ height: '0.5rem' }} />
        </div>
      </div>

      {/* ── Input footer ── */}
      {phase !== 'ended' && (
        <div
          style={{
            flexShrink: 0,
            background: 'rgba(26,23,64,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '0.875rem 1.25rem',
            paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {phase === 'typing' ? (
              <div style={{ position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  className="noi-textarea"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrivi come risponderesti… Invio per inviare"
                  rows={3}
                  style={{ minHeight: '80px', paddingRight: '3.5rem', resize: 'none' }}
                />

                {/* Send button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    bottom: '0.75rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: canSubmit
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    cursor: canSubmit ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  aria-label="Invia risposta"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={canSubmit ? 'white' : 'rgba(255,255,255,0.3)'}
                    strokeWidth="2.5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>

                {/* Word count */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.6rem',
                    left: '1rem',
                    fontSize: '0.7rem',
                    color: wordCount < 3 ? 'rgba(240,238,255,0.25)' : 'rgba(240,238,255,0.4)',
                  }}
                >
                  {wordCount < 3 ? `${wordCount}/3 parole min` : `${wordCount} parole`}
                </span>
              </div>
            ) : (
              /* Processing / replying — subtle pulsing */
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem',
                  opacity: 0.4,
                }}
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'rgba(167,139,250,0.8)',
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
