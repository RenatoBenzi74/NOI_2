'use client'

import { useState } from 'react'

interface ReflectionFormProps {
  onSave: (reflection: string) => void
  onBack: () => void
}

const reflectionPrompts = [
  'Quale frase hai scartato troppo presto?',
  'Cosa stavi difendendo mentre rispondevi?',
  'Che cosa poteva essere vero nel punto di vista dell\'altro?',
  'Cosa potresti cogliere che prima ti era invisibile?',
]

export default function ReflectionForm({ onSave, onBack }: ReflectionFormProps) {
  const [reflection, setReflection] = useState('')
  const [activePrompt, setActivePrompt] = useState<number | null>(null)

  const handlePromptClick = (i: number) => {
    setActivePrompt(i)
    if (reflection.trim() === '') {
      setReflection(reflectionPrompts[i] + '\n\n')
    }
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
        <div>
          <h2 className="text-lg font-bold text-white">Il tuo inciampo</h2>
          <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Un momento per te, non per essere valutato.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto">

        {/* Main question */}
        <div className="glass-card p-5"
          style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(168,85,247,0.25)' }}>
          <h3 className="text-lg font-semibold text-white mb-1">
            Quando hai smesso di ascoltare davvero?
          </h3>
          <p className="noi-micro">
            Nessuna risposta giusta. Solo un momento di onestà con te stesso.
          </p>
        </div>

        {/* Prompt suggestions */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(240,238,255,0.4)' }}>
            Domande di supporto — tocca per usarle
          </p>
          {reflectionPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(i)}
              className="w-full text-left p-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: activePrompt === i ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activePrompt === i ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: activePrompt === i ? '#d8b4fe' : 'rgba(240,238,255,0.65)',
              }}
            >
              — {prompt}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1">
          <textarea
            className="noi-textarea w-full"
            style={{ minHeight: '160px' }}
            placeholder="Scrivi qui la tua riflessione…"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>

        <p className="noi-micro text-center">
          Questa riflessione viene salvata solo sul tuo dispositivo.
        </p>
      </div>

      {/* CTAs */}
      <div className="pt-5 flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={() => onSave(reflection)}>
          Salva esperienza
        </button>
        <button className="btn-ghost w-full" onClick={() => onSave('')}>
          Continua senza riflessione
        </button>
      </div>
    </div>
  )
}
