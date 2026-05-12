'use client'

import { getTodayCount } from '@/lib/storage'
import { useEffect, useState } from 'react'

interface HomeScreenProps {
  onStart: () => void
  onHistory: () => void
}

export default function HomeScreen({ onStart, onHistory }: HomeScreenProps) {
  const [todayCount, setTodayCount] = useState(0)

  useEffect(() => {
    setTodayCount(getTodayCount())
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-dvh px-6 py-12 safe-top safe-bottom">

      {/* Logo / Brand */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 relative"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(99,102,241,0.2) 100%)', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 40px rgba(124,58,237,0.2)' }}>
          {/* Aura centrale piccola */}
          <div className="absolute inset-2 rounded-2xl"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)', animation: 'auraBreath1 3s ease-in-out infinite' }} />
          <span className="relative text-3xl font-bold tracking-tight text-white">Noi²</span>
        </div>

        <div className="noi-micro mb-2 tracking-widest uppercase">Metodo delle Competenze Risonanti</div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="noi-title">
          Allenatore di<br />
          <span style={{ background: 'linear-gradient(90deg, #a855f7, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ascolto Partecipativo
          </span>
        </h1>

        <p className="noi-subtitle">
          Allenati ad ascoltare prima di rispondere.
        </p>

        <div className="glass-card p-6 text-left space-y-3">
          <p className="noi-body">
            Ogni risposta può aprire uno spazio o chiuderlo.
            Questa esperienza non ti insegna la frase giusta.
          </p>
          <p className="noi-body">
            Ti aiuta ad accorgerti di cosa fai mentre ascolti.
          </p>
        </div>

        <p className="noi-micro">
          Non devi essere bravo.<br />
          Devi essere disposto a osservarti.
        </p>

        {/* Today counter */}
        {todayCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#d8b4fe' }}>
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Oggi hai già fatto {todayCount} allenament{todayCount === 1 ? 'o' : 'i'}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <button className="btn-primary w-full text-lg py-4" onClick={onStart}>
            Inizia l&apos;allenamento
          </button>
          <button className="btn-ghost w-full" onClick={onHistory}>
            Guarda il tuo storico
          </button>
        </div>
      </div>

      {/* Bottom quote */}
      <div className="mt-12 text-center max-w-xs">
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,238,255,0.3)', fontStyle: 'italic' }}>
          "L&apos;ascolto non si interrompe quando l&apos;altro smette di parlare.
          Si interrompe quando tu smetti di essere curioso."
        </p>
      </div>
    </div>
  )
}
