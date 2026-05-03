'use client'

import { Context } from '@/lib/types'
import { contextInfo } from '@/lib/scenarios'

interface ContextSelectorProps {
  selected: Context | null
  onSelect: (ctx: Context) => void
  onConfirm: () => void
  onBack: () => void
}

export default function ContextSelector({
  selected,
  onSelect,
  onConfirm,
  onBack,
}: ContextSelectorProps) {
  return (
    <div className="screen-enter flex flex-col min-h-dvh px-5 py-8 safe-top safe-bottom">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button className="btn-ghost px-0" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Dove vuoi allenarti?</h2>
          <p className="text-sm" style={{ color: 'rgba(240,238,255,0.5)' }}>
            Ogni contesto ti mette davanti a un modo diverso di ascoltare.
          </p>
        </div>
      </div>

      {/* Context grid */}
      <div className="flex-1 grid grid-cols-1 gap-3">
        {contextInfo.map((ctx) => {
          const isSelected = selected === ctx.id
          return (
            <button
              key={ctx.id}
              onClick={() => onSelect(ctx.id)}
              className="text-left transition-all duration-200"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(99,102,241,0.15) 100%)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isSelected ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '1.25rem',
                padding: '1rem 1.25rem',
                boxShadow: isSelected ? '0 0 20px rgba(124,58,237,0.2)' : 'none',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.08)' }}>
                  {ctx.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{ctx.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,238,255,0.6)' }}>
                    {ctx.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="pt-6">
        <button
          className="btn-primary w-full"
          onClick={onConfirm}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
        >
          Genera scenario
        </button>
      </div>
    </div>
  )
}
