'use client'

import { AnalysisResult, Context, Scenario } from '@/lib/types'
import { contextInfo } from '@/lib/scenarios'
import ListeningAura from './ListeningAura'

interface SummaryScreenProps {
  context: Context
  scenario: Scenario
  userResponse: string
  analysis: AnalysisResult
  reflection: string
  onRestart: () => void
  onChangeContext: () => void
  onHistory: () => void
}

export default function SummaryScreen({
  context,
  scenario,
  userResponse,
  analysis,
  reflection,
  onRestart,
  onChangeContext,
  onHistory,
}: SummaryScreenProps) {
  const ctx = contextInfo.find((c) => c.id === context)

  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Allenamento completato</span>
        </div>
        <h2 className="text-xl font-bold text-white">Riepilogo</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">

        {/* Aura summary */}
        <div className="glass-card p-5 flex justify-center">
          <ListeningAura state={analysis.globalState} nuance={analysis.globalStateNuance} size={120} />
        </div>

        {/* Context + scenario */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>{ctx?.emoji}</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(240,238,255,0.5)' }}>
              {ctx?.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-white">{scenario.title}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(240,238,255,0.55)', fontStyle: 'italic' }}>
            "{scenario.quote}"
          </p>
        </div>

        {/* Scores grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Inciampo accolto', value: analysis.stumbleAccepted, inverse: false },
            { label: 'Giudizio sospeso', value: analysis.judgmentSuspended, inverse: false },
            { label: 'Curiosità attiva', value: analysis.activeCuriosity, inverse: false },
            { label: 'Presenza sull\'altro', value: analysis.presenceOnOther, inverse: false },
            { label: 'Orizzonte aperto', value: analysis.openHorizon, inverse: false },
            { label: 'Impulso correttivo', value: analysis.correctiveImpulse, inverse: true },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(240,238,255,0.45)' }}>{item.label}</div>
              <div className="text-lg font-bold" style={{
                color: item.inverse
                  ? item.value >= 60 ? '#fca5a5' : item.value >= 40 ? '#fcd34d' : '#86efac'
                  : item.value >= 60 ? '#d8b4fe' : item.value >= 40 ? '#a5b4fc' : '#93c5fd',
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback snippet */}
        <div className="glass-card p-4"
          style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.2)' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#d8b4fe' }}>
            Sintesi
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.8)' }}>
            {analysis.feedback.horizon}
          </p>
        </div>

        {/* Alternative response snippet */}
        <div className="p-4 rounded-2xl"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#d8b4fe' }}>
            Una risposta che apre
          </div>
          <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(240,238,255,0.75)' }}>
            "{analysis.alternativeResponse}"
          </p>
        </div>

        {/* Reflection */}
        {reflection && (
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#fcd34d' }}>
              La tua riflessione
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.7)' }}>
              {reflection}
            </p>
          </div>
        )}

        {/* Closing quote */}
        <div className="text-center py-4">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.45)', fontStyle: 'italic' }}>
            "L&apos;ascolto non si interrompe quando l&apos;altro smette di parlare.<br />
            Si interrompe quando tu smetti di essere curioso."
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-5 flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={onRestart}>
          Allenati ancora
        </button>
        <button className="btn-secondary w-full" onClick={onChangeContext}>
          Cambia contesto
        </button>
        <button className="btn-ghost w-full" onClick={onHistory}>
          Vedi storico
        </button>
      </div>
    </div>
  )
}
