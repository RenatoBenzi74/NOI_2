// ============================================================
// NOI² – Generatore di Scenari
// Prima versione: selezione da libreria interna
// Architettura pronta per sostituzione con API AI (Claude / OpenAI)
// ============================================================

import { Context, Scenario } from './types'
import { scenarios } from './scenarios'

/**
 * Genera (o seleziona) uno scenario per il contesto dato.
 * In questa versione seleziona casualmente dalla libreria locale.
 *
 * FUTURA INTEGRAZIONE AI:
 * Sostituire il corpo con una chiamata API:
 * const response = await fetch('/api/generate-scenario', { method: 'POST', body: JSON.stringify({ context, previousIds }) })
 * return await response.json()
 */
export function generateScenario(
  context: Context,
  excludeIds: string[] = []
): Scenario {
  const pool = scenarios.filter(
    (s) => s.context === context && !excludeIds.includes(s.id)
  )

  if (pool.length === 0) {
    // Se tutti gli scenari del contesto sono stati usati, ricomincia
    const fallback = scenarios.filter((s) => s.context === context)
    return fallback[Math.floor(Math.random() * fallback.length)]
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Restituisce tutti gli scenari di un contesto
 */
export function getScenariosByContext(context: Context): Scenario[] {
  return scenarios.filter((s) => s.context === context)
}

/**
 * Restituisce uno scenario per ID
 */
export function getScenarioById(id: string): Scenario | null {
  return scenarios.find((s) => s.id === id) ?? null
}
