'use client'

import { Scenario } from '@/lib/types'
import { contextInfo } from '@/lib/scenarios'

interface ScenarioCardProps {
  scenario: Scenario
  onProceed: () => void
  onRegenerate: () => void
  onBack: () => void
}

const archetypeLabels: Record<string, string> = {
  sfiducia: 'Sfiducia',
  accusa_indiretta: 'Accusa indiretta',
  delusione: 'Delusione',
  chiusura: 'Chiusura',
  bisogno_nascosto: 'Bisogno nascosto',
  conflitto_prospettiva: 'Conflitto di prospettiva',
  richiesta_mascherata: 'Richiesta mascherata',
  resistenza: 'Resistenza',
  silenzio_significativo: 'Silenzio significativo',
  frase_spiazzante: 'Frase spiazzante',
}

export default function ScenarioCard({
  scenario,
  onProceed,
  onRegenerate,
  onBack,
}: ScenarioCardProps) {
  const ctx = contextInfo.find((c) => c.id === scenario.context)

  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">{ctx?.emoji}</span>
          <span className="text-sm font-medium" style={{ color: 'rgba(240,238,255,0.6)' }}>{ctx?.label}</span>
        </div>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col gap-5">

        {/* Archetype badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe' }}>
            {archetypeLabels[scenario.archetype]}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white leading-tight">
          {scenario.title}
        </h2>

        {/* Setup */}
        <div className="glass-card p-5">
          <p className="noi-body leading-relaxed">
            {scenario.setup}
          </p>
        </div>

        {/* Quote — the triggering phrase */}
        <div className="glass-card p-5"
          style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(168,85,247,0.25)' }}>
          <div className="noi-micro mb-3 uppercase tracking-wider">Quello che senti:</div>
          <blockquote className="noi-quote">
            "{scenario.quote}"
          </blockquote>
        </div>

        {/* Prompt */}
        <div className="text-center py-2">
          <p className="text-base font-medium text-white opacity-90">
            Come risponderesti?
          </p>
          <p className="noi-micro mt-1">
            Prenditi un momento prima di andare avanti.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-5 flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={onProceed}>
          Scrivi la mia risposta
        </button>
        <button className="btn-secondary w-full" onClick={onRegenerate}>
          Genera un altro scenario
        </button>
      </div>
    </div>
  )
}
