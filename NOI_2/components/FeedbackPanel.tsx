'use client'

import { FeedbackBlocks } from '@/lib/types'

interface FeedbackPanelProps {
  feedback: FeedbackBlocks
  onContinue: () => void
  onBack: () => void
}

interface FeedbackBlockProps {
  title: string
  content: string
  color: string
  borderColor: string
  textColor: string
  icon: string
  delay?: number
}

function FeedbackBlock({ title, content, color, borderColor, textColor, icon, delay = 0 }: FeedbackBlockProps) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: color,
        border: `1px solid ${borderColor}`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: textColor }}>
          {title}
        </span>
      </div>
      <p className="noi-body text-sm leading-relaxed">
        {content}
      </p>
    </div>
  )
}

export default function FeedbackPanel({ feedback, onContinue, onBack }: FeedbackPanelProps) {
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
          <h2 className="text-lg font-bold text-white">La lettura della tua risposta</h2>
          <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Un'osservazione precisa, non un giudizio.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">

        <FeedbackBlock
          title="Dove ti stai chiudendo"
          content={feedback.closure}
          color="rgba(239,68,68,0.08)"
          borderColor="rgba(239,68,68,0.2)"
          textColor="#fca5a5"
          icon="🔒"
          delay={50}
        />

        <FeedbackBlock
          title="Dove si intravede apertura"
          content={feedback.opening}
          color="rgba(34,197,94,0.08)"
          borderColor="rgba(34,197,94,0.2)"
          textColor="#86efac"
          icon="🌿"
          delay={150}
        />

        <FeedbackBlock
          title="Cosa non hai ancora ascoltato"
          content={feedback.unheard}
          color="rgba(168,85,247,0.08)"
          borderColor="rgba(168,85,247,0.2)"
          textColor="#d8b4fe"
          icon="👂"
          delay={250}
        />

        <FeedbackBlock
          title="Come potresti aprire l'orizzonte"
          content={feedback.horizon}
          color="rgba(245,158,11,0.08)"
          borderColor="rgba(245,158,11,0.2)"
          textColor="#fcd34d"
          icon="🔭"
          delay={350}
        />
      </div>

      {/* CTA */}
      <div className="pt-5">
        <button className="btn-primary w-full" onClick={onContinue}>
          Vedi una risposta che apre
        </button>
      </div>
    </div>
  )
}
