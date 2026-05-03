'use client'

import { useEffect, useState } from 'react'

interface IndicatorBarProps {
  name: string
  value: number
  description: string
  interpretation: string
  isInverse?: boolean
  color?: string
  delay?: number
}

function getBarColor(value: number, isInverse: boolean): string {
  if (isInverse) {
    if (value >= 70) return 'linear-gradient(90deg, #ef4444, #dc2626)'
    if (value >= 45) return 'linear-gradient(90deg, #f59e0b, #d97706)'
    return 'linear-gradient(90deg, #22c55e, #16a34a)'
  }
  if (value >= 70) return 'linear-gradient(90deg, #7c3aed, #a855f7)'
  if (value >= 45) return 'linear-gradient(90deg, #4338ca, #6366f1)'
  return 'linear-gradient(90deg, #1e3a8a, #3b82f6)'
}

function getValueLabel(value: number, isInverse: boolean): string {
  if (isInverse) {
    if (value >= 70) return 'Alto — attenzione'
    if (value >= 45) return 'Moderato'
    return 'Basso — buon segno'
  }
  if (value >= 70) return 'Elevato'
  if (value >= 45) return 'Presente'
  return 'Ancora basso'
}

export default function IndicatorBar({
  name,
  value,
  description,
  interpretation,
  isInverse = false,
  delay = 0,
}: IndicatorBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      setAnimatedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  const color = getBarColor(value, isInverse)
  const label = getValueLabel(value, isInverse)

  return (
    <div className={`space-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

      {/* Name and value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isInverse && value >= 55 && (
            <span className="text-amber-400 text-xs">⚠</span>
          )}
          <span className="text-sm font-semibold text-white">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: isInverse
                ? value >= 70 ? 'rgba(239,68,68,0.15)' : value >= 45 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.12)'
                : value >= 70 ? 'rgba(168,85,247,0.15)' : value >= 45 ? 'rgba(99,102,241,0.15)' : 'rgba(30,58,138,0.2)',
              color: isInverse
                ? value >= 70 ? '#fca5a5' : value >= 45 ? '#fcd34d' : '#86efac'
                : value >= 70 ? '#d8b4fe' : value >= 45 ? '#a5b4fc' : '#93c5fd',
            }}>
            {label}
          </span>
          <span className="text-sm font-bold" style={{
            color: isInverse
              ? value >= 70 ? '#fca5a5' : value >= 45 ? '#fcd34d' : '#86efac'
              : '#d8b4fe',
          }}>
            {value}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs" style={{ color: 'rgba(240,238,255,0.5)' }}>{description}</p>

      {/* Bar track */}
      <div className="indicator-track">
        <div
          className="indicator-fill"
          style={{
            width: `${animatedValue}%`,
            background: color,
            transition: `width 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>

      {/* Interpretation */}
      {interpretation && (
        <p className="text-xs leading-relaxed"
          style={{ color: 'rgba(240,238,255,0.65)', fontStyle: 'italic' }}>
          {interpretation}
        </p>
      )}
    </div>
  )
}
