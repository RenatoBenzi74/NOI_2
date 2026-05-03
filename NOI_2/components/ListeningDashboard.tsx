'use client'

import { AnalysisResult } from '@/lib/types'
import ListeningAura from './ListeningAura'
import IndicatorBar from './IndicatorBar'

interface ListeningDashboardProps {
  analysis: AnalysisResult
  onContinue: () => void
  onBack: () => void
}

function getInterpretation(name: string, value: number, isInverse: boolean): string {
  if (name === 'Inciampo accolto') {
    if (value >= 65) return 'Hai lasciato che la frase ti raggiungesse davvero.'
    if (value >= 40) return 'Hai in parte accolto l\'inciampo, ma non del tutto.'
    return 'Hai neutralizzato abbastanza in fretta ciò che ti ha spiazzato.'
  }
  if (name === 'Giudizio sospeso') {
    if (value >= 65) return 'Hai evitato di classificare o correggere l\'altro.'
    if (value >= 40) return 'Qualche classificazione implicita è emersa.'
    return 'La tua risposta contiene giudizi o etichette, anche sottili.'
  }
  if (name === 'Curiosità attiva') {
    if (value >= 65) return 'Stai esplorando invece di concludere.'
    if (value >= 40) return 'C\'è un inizio di esplorazione, ma non è ancora dominante.'
    return 'La risposta è più orientata a rispondere che a capire.'
  }
  if (name === 'Presenza sull\'altro') {
    if (value >= 65) return 'La tua attenzione è sul vissuto dell\'altro, non sul tuo.'
    if (value >= 40) return 'Sei in parte sull\'altro, in parte ancora su di te.'
    return 'La risposta è centrata principalmente su di te o sulla situazione.'
  }
  if (name === 'Orizzonte aperto') {
    if (value >= 65) return 'Stai allargando il campo, non indicando la via.'
    if (value >= 40) return 'C\'è qualche apertura, ma la risposta tende a chiudere.'
    return 'La risposta tende a indicare, non ad aprire.'
  }
  if (name === 'Impulso a correggere') {
    if (value >= 65) return 'La tua risposta prova a sistemare prima di ascoltare.'
    if (value >= 40) return 'C\'è qualche spinta a risolvere o spiegare.'
    return 'Stai resistendo all\'impulso di sistemare — ottimo segnale.'
  }
  return ''
}

export default function ListeningDashboard({ analysis, onContinue, onBack }: ListeningDashboardProps) {
  const indicators = [
    {
      name: 'Inciampo accolto',
      value: analysis.stumbleAccepted,
      description: 'Ti sei lasciato spiazzare?',
      isInverse: false,
      delay: 100,
    },
    {
      name: 'Giudizio sospeso',
      value: analysis.judgmentSuspended,
      description: 'Hai evitato di classificare l\'altro?',
      isInverse: false,
      delay: 200,
    },
    {
      name: 'Curiosità attiva',
      value: analysis.activeCuriosity,
      description: 'Stai esplorando o stai rispondendo?',
      isInverse: false,
      delay: 300,
    },
    {
      name: 'Presenza sull\'altro',
      value: analysis.presenceOnOther,
      description: 'Sei sull\'altro o su di te?',
      isInverse: false,
      delay: 400,
    },
    {
      name: 'Orizzonte aperto',
      value: analysis.openHorizon,
      description: 'Allarghi o indirizzi?',
      isInverse: false,
      delay: 500,
    },
    {
      name: 'Impulso a correggere',
      value: analysis.correctiveImpulse,
      description: 'Stai aggiustando troppo presto?',
      isInverse: true,
      delay: 600,
    },
  ]

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
          <h2 className="text-lg font-bold text-white">Cosa sta succedendo nel tuo ascolto</h2>
          <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Non valutiamo se hai ragione. Osserviamo se apri o chiudi lo spazio.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto">

        {/* Aura centrale */}
        <div className="flex justify-center py-4">
          <ListeningAura
            state={analysis.globalState}
            nuance={analysis.globalStateNuance}
            size={150}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(240,238,255,0.3)' }}>i tuoi indicatori</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Indicators */}
        <div className="glass-card p-5 space-y-6">
          {indicators.map((ind) => (
            <IndicatorBar
              key={ind.name}
              name={ind.name}
              value={ind.value}
              description={ind.description}
              interpretation={getInterpretation(ind.name, ind.value, ind.isInverse)}
              isInverse={ind.isInverse}
              delay={ind.delay}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-5">
        <button className="btn-primary w-full" onClick={onContinue}>
          Leggi la lettura completa
        </button>
      </div>
    </div>
  )
}
