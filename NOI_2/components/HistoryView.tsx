'use client'

import { SavedExperience } from '@/lib/types'
import { contextInfo } from '@/lib/scenarios'
import { formatTimestamp } from '@/lib/storage'

interface HistoryViewProps {
  experiences: SavedExperience[]
  onClose: () => void
  onClear: () => void
}

const stateColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  difesa: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#fca5a5', dot: '#ef4444' },
  risposta: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#a5b4fc', dot: '#6366f1' },
  curiosità: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', text: '#d8b4fe', dot: '#a855f7' },
  presenza: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d', dot: '#f59e0b' },
}

const stateLabels: Record<string, string> = {
  difesa: 'Difesa',
  risposta: 'Risposta',
  curiosità: 'Curiosità',
  presenza: 'Presenza',
}

export default function HistoryView({ experiences, onClose, onClear }: HistoryViewProps) {
  const isEmpty = experiences.length === 0

  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="btn-ghost px-0" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">Storico allenamenti</h2>
            <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>
              {isEmpty ? 'Nessun allenamento ancora' : `${experiences.length} esperien${experiences.length === 1 ? 'za' : 'ze'} salvat${experiences.length === 1 ? 'a' : 'e'}`}
            </p>
          </div>
        </div>

        {!isEmpty && (
          <button
            className="text-xs px-3 py-1.5 rounded-full transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
            onClick={onClear}
          >
            Cancella tutto
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              🌀
            </div>
            <div>
              <p className="text-white font-medium mb-1">Nessun allenamento ancora</p>
              <p className="noi-micro">
                Le tue esperienze appariranno qui dopo il primo allenamento.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, index) => {
              const ctx = contextInfo.find((c) => c.id === exp.context)
              const stateColor = stateColors[exp.analysis.globalState]

              return (
                <div
                  key={exp.id}
                  className="glass-card p-4 space-y-3"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">{ctx?.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{exp.scenario.title}</p>
                        <p className="text-xs" style={{ color: 'rgba(240,238,255,0.4)' }}>
                          {ctx?.label} · {formatTimestamp(exp.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: stateColor.bg, border: `1px solid ${stateColor.border}`, color: stateColor.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: stateColor.dot }} />
                        {stateLabels[exp.analysis.globalState]}
                      </span>
                    </div>
                  </div>

                  {/* Mini scores */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Curiosità', value: exp.analysis.activeCuriosity },
                      { label: 'Presenza', value: exp.analysis.presenceOnOther },
                      { label: 'Correttivo', value: exp.analysis.correctiveImpulse, inverse: true },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="text-xs mb-0.5" style={{ color: 'rgba(240,238,255,0.4)' }}>{item.label}</div>
                        <div className="text-sm font-bold" style={{
                          color: item.inverse
                            ? item.value >= 60 ? '#fca5a5' : item.value >= 40 ? '#fcd34d' : '#86efac'
                            : '#d8b4fe',
                        }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reflection snippet */}
                  {exp.reflection && (
                    <div className="pt-2 border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.5)', fontStyle: 'italic' }}>
                        "{exp.reflection.substring(0, 120)}{exp.reflection.length > 120 ? '…' : ''}"
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="pt-5">
        <button className="btn-primary w-full" onClick={onClose}>
          Torna all&apos;allenamento
        </button>
      </div>
    </div>
  )
}
