'use client'

import { useEffect, useRef, useState } from 'react'
import { AnalysisResult, Context, ConversationTurn, Scenario } from '@/lib/types'
import { analyzeListeningResponse } from '@/lib/analyzeListeningResponse'
import { archetypeContinuations } from '@/lib/scenarios'
import MiniDashboard from './MiniDashboard'

interface ConversationScreenProps {
  scenario: Scenario
  context: Context
  onComplete: (turns: ConversationTurn[]) => void
  onBack: () => void
}

type Phase = 'typing' | 'analysing' | 'showing' | 'continued' | 'debrief' | 'done'

const MAX_TURNS = 2

const personLabel: Record<Context, string> = {
  lavoro:    'Il collega',
  famiglia:  'Il familiare',
  amicizie:  "L'amico",
  coppia:    'Il partner',
  gruppi:    'La persona',
  vendita:   'Il cliente',
}

export default function ConversationScreen({
  scenario,
  context,
  onComplete,
  onBack,
}: ConversationScreenProps) {
  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [phase, setPhase] = useState<Phase>('typing')
  const bottomRef = useRef<HTMLDivElement>(null)

  const wordCount = currentInput.trim().split(/\s+/).filter(Boolean).length
  const isReady = wordCount >= 3

  // Scroll to bottom after each update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, phase])

  const handleSend = () => {
    if (!isReady) {
      setShowHint(true)
      return
    }

    const appMessage = turns.length === 0
      ? scenario.quote
      : getContinuation(turns[turns.length - 1].analysis)

    const analysis = analyzeListeningResponse(currentInput, scenario, context)
    const newTurn: ConversationTurn = { appMessage, userResponse: currentInput, analysis }

    const newTurns = [...turns, newTurn]
    setTurns(newTurns)
    setCurrentInput('')
    setShowHint(false)

    if (newTurns.length >= MAX_TURNS) {
      setPhase('debrief')
    } else {
      setPhase('continued')
      // Brief pause then return to typing
      setTimeout(() => setPhase('typing'), 600)
    }
  }

  const getContinuation = (analysis: AnalysisResult): string => {
    const cont = archetypeContinuations[scenario.archetype]
    const isOpen = analysis.globalState === 'curiosità' || analysis.globalState === 'presenza'
    return isOpen ? cont.open : cont.closed
  }

  const handleFinish = () => {
    onComplete(turns)
  }

  const person = personLabel[context]
  const lastTurn = turns[turns.length - 1]

  return (
    <div className="screen-enter flex flex-col min-h-dvh safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-8 pb-4 flex-shrink-0">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-base font-bold text-white">Conversazione</h2>
          <p className="text-xs" style={{ color: 'rgba(240,238,255,0.45)' }}>
            {scenario.title}
          </p>
        </div>
      </div>

      {/* Scrollable conversation area */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">

        {/* Context pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,238,255,0.5)' }}>
            {scenario.setup}
          </div>
        </div>

        {/* First app message (scenario quote) */}
        <AppBubble person={person} message={scenario.quote} />

        {/* Rendered turns */}
        {turns.map((turn, i) => (
          <div key={i} className="space-y-3">
            {/* User bubble */}
            <UserBubble message={turn.userResponse} />

            {/* Mini dashboard */}
            <MiniDashboard analysis={turn.analysis} turnNumber={i + 1} />

            {/* App continuation — always shown after each turn's mini-dashboard */}
            <AppBubble
              person={person}
              message={getContinuation(turn.analysis)}
              delay={(i + 1) * 100}
            />
          </div>
        ))}

        {/* Debrief card — alternative response */}
        {phase === 'debrief' && lastTurn && (
          <DebriefCard
            alternativeResponse={lastTurn.analysis.alternativeResponse}
            whyWorks={lastTurn.analysis.whyAlternativeWorks}
            onContinue={handleFinish}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area — hidden during debrief */}
      {phase !== 'debrief' && phase !== 'done' && (
        <div className="flex-shrink-0 px-5 pb-6 pt-3 space-y-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,12,41,0.6)', backdropFilter: 'blur(12px)' }}>

          {showHint && (
            <p className="text-xs text-center py-1 px-3 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' }}>
              Scrivi almeno qualche parola, come risponderesti davvero.
            </p>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              className="noi-textarea flex-1 resize-none"
              style={{ minHeight: '52px', maxHeight: '120px', padding: '12px 14px', lineHeight: 1.5 }}
              placeholder="La tua risposta…"
              value={currentInput}
              rows={2}
              onChange={(e) => {
                setCurrentInput(e.target.value)
                if (showHint) setShowHint(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!isReady}
              className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background: isReady ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                border: '1px solid ' + (isReady ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'),
                opacity: isReady ? 1 : 0.5,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          {/* End conversation — available after turn 1 */}
          {turns.length >= 1 && (
            <button
              className="w-full btn-ghost text-sm"
              style={{ color: 'rgba(240,238,255,0.4)' }}
              onClick={handleFinish}
            >
              Fine conversazione →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

function AppBubble({ person, message, delay = 0 }: { person: string; message: string; delay?: number }) {
  return (
    <div className="screen-enter" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-xs mb-1.5 font-semibold" style={{ color: 'rgba(240,238,255,0.4)' }}>
        {person}
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]"
        style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(168,85,247,0.25)' }}>
        <p className="text-sm leading-relaxed text-white" style={{ fontStyle: 'italic' }}>
          "{message}"
        </p>
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: string }) {
  return (
    <div className="screen-enter flex flex-col items-end">
      <div className="text-xs mb-1.5 font-semibold" style={{ color: 'rgba(240,238,255,0.4)' }}>
        Tu
      </div>
      <div className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.9)' }}>
          {message}
        </p>
      </div>
    </div>
  )
}

function DebriefCard({
  alternativeResponse,
  whyWorks,
  onContinue,
}: {
  alternativeResponse: string
  whyWorks: string
  onContinue: () => void
}) {
  const [showWhy, setShowWhy] = useState(false)

  return (
    <div className="screen-enter space-y-4 pt-2">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
          style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe' }}>
          ✦ Fine della conversazione
        </div>
      </div>

      {/* Alternative response */}
      <div className="glass-card-strong p-5"
        style={{ background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(168,85,247,0.3)' }}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#d8b4fe' }}>
          Una risposta che avrebbe aperto
        </div>
        <p className="text-sm leading-relaxed text-white" style={{ fontStyle: 'italic', lineHeight: 1.8 }}>
          "{alternativeResponse}"
        </p>

        <button
          className="mt-3 text-xs"
          style={{ color: 'rgba(168,85,247,0.7)' }}
          onClick={() => setShowWhy(!showWhy)}
        >
          {showWhy ? 'Nascondi spiegazione' : 'Perché apre? ↓'}
        </button>

        {showWhy && (
          <p className="mt-2 text-xs leading-relaxed screen-enter" style={{ color: 'rgba(240,238,255,0.65)' }}>
            {whyWorks}
          </p>
        )}
      </div>

      <button className="btn-primary w-full" onClick={onContinue}>
        Rifletti su questo allenamento →
      </button>
    </div>
  )
}
