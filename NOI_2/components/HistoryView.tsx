'use client'

import { useState } from 'react'
import { SavedExperience } from '@/lib/types'
import { contextInfo } from '@/lib/scenarios'
import { formatTimestamp } from '@/lib/storage'

interface HistoryViewProps {
  experiences: SavedExperience[]
  onClose: () => void
  onClear: () => void
}

const stateColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  difesa:    { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   text: '#fca5a5', dot: '#ef4444' },
  risposta:  { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)',  text: '#a5b4fc', dot: '#6366f1' },
  curiosità: { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)', text: '#d8b4fe', dot: '#a855f7' },
  presenza:  { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', text: '#fcd34d', dot: '#f59e0b' },
}

const stateLabels: Record<string, string> = {
  difesa: 'Difesa', risposta: 'Risposta', curiosità: 'Curiosità', presenza: 'Presenza',
}

export default function HistoryView({ experiences, onClose, onClear }: HistoryViewProps) {
  const isEmpty = experiences.length === 0
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
              <p className="noi-micro">Le tue esperienze appariranno qui dopo il primo allenamento.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, index) => {
              const ctx = contextInfo.find((c) => c.id === exp.context)
              const stateColor = stateColors[exp.analysis.globalState]
              const isExpanded = expandedId === exp.id
              const hasTurns = exp.dialogueTurns && exp.dialogueTurns.length > 0

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
                      { label: 'Curiosità', value: exp.analysis.activeCuriosity, inverse: false },
                      { label: 'Presenza', value: exp.analysis.presenceOnOther, inverse: false },
                      { label: 'Correttivo', value: exp.analysis.correctiveImpulse, inverse: true },
                    ].map((item) => {
                      const isGood = item.inverse ? item.value < 35 : item.value >= 60
                      const isMed  = item.inverse ? item.value < 60 : item.value >= 30
                      const color  = isGood ? (item.inverse ? '#86efac' : '#d8b4fe') : isMed ? '#fcd34d' : (item.inverse ? '#fca5a5' : '#93c5fd')
                      const lbl    = isGood ? (item.inverse ? 'Basso' : 'Alta') : isMed ? 'Media' : (item.inverse ? 'Alto' : 'Bassa')
                      const barPct = item.inverse ? (100 - item.value) : item.value
                      return (
                        <div key={item.label}>
                          <div className="text-xs mb-1" style={{ color: 'rgba(240,238,255,0.4)' }}>{item.label}</div>
                          <div className="rounded-full mb-1" style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
                            <div className="rounded-full h-full" style={{ width: barPct + '%', background: color, opacity: 0.8 }} />
                          </div>
                          <div className="text-xs font-semibold" style={{ color }}>{lbl}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Reflection snippet */}
                  {exp.reflection && (
                    <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.5)', fontStyle: 'italic' }}>
                        &ldquo;{exp.reflection.substring(0, 120)}{exp.reflection.length > 120 ? '…' : ''}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Expand button */}
                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs transition-all"
                    style={{
                      background: isExpanded ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isExpanded ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      color: isExpanded ? '#d8b4fe' : 'rgba(240,238,255,0.45)',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  >
                    <span>{isExpanded ? 'Chiudi dialogo' : hasTurns ? 'Rivedi il dialogo' : 'Rivedi risposta'}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dialogo espanso */}
                  {isExpanded && (
                    <div className="space-y-4 pt-1">
                      {hasTurns ? (
                        exp.dialogueTurns!.map((turn, ti) => {
                          const tColor = stateColors[turn.analysis.globalState]
                          return (
                            <div key={ti} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                <span className="text-xs" style={{ color: 'rgba(240,238,255,0.3)' }}>Scambio {ti + 1}</span>
                                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                              </div>
                              <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>👤</div>
                                <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(240,238,255,0.6)', fontStyle: 'italic' }}>
                                  &ldquo;{turn.otherPersonMessage}&rdquo;
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>🎙</div>
                                <p className="text-xs leading-relaxed flex-1 text-white">{turn.userResponse}</p>
                              </div>
                              <div className="flex items-center gap-2 pl-8">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                                  style={{ background: tColor.bg, border: `1px solid ${tColor.border}`, color: tColor.text }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tColor.dot }} />
                                  {stateLabels[turn.analysis.globalState]}
                                </span>
                                {turn.analysis.globalStateNuance && (
                                  <span className="text-xs" style={{ color: 'rgba(240,238,255,0.4)' }}>{turn.analysis.globalStateNuance}</span>
                                )}
                              </div>
                              {turn.analysis.alternativeResponse && (
                                <div className="ml-8 p-3 rounded-xl"
                                  style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                  <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(168,85,247,0.8)' }}>✦ Come potevi rispondere</div>
                                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.65)', fontStyle: 'italic' }}>
                                    &ldquo;{turn.analysis.alternativeResponse}&rdquo;
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>👤</div>
                            <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(240,238,255,0.6)', fontStyle: 'italic' }}>
                              &ldquo;{exp.scenario.quote}&rdquo;
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>🎙</div>
                            <p className="text-xs leading-relaxed flex-1 text-white">{exp.userResponse}</p>
                          </div>
                          {exp.analysis.alternativeResponse && (
                            <div className="ml-8 p-3 rounded-xl"
                              style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)' }}>
                              <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(168,85,247,0.8)' }}>✦ Come potevi rispondere</div>
                              <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.65)', fontStyle: 'italic' }}>
                                &ldquo;{exp.analysis.alternativeResponse}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      )}
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