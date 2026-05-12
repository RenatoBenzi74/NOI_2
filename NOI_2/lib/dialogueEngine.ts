// ============================================================
// NOI² – Dialogue Engine
// Gestisce la logica del dialogo multi-turno
// ============================================================

import { Scenario, DialogueTurn, DialogueEndReason, AnalysisResult } from './types'

export const MIN_TURNS = 3   // minimo scambi prima di poter chiudere
export const MAX_TURNS = 6   // massimo scambi (poi timeout)
export const RESOLUTION_STATES = ['curiosità', 'presenza']

/**
 * Restituisce il messaggio dell'altra persona per il turno corrente.
 * turnIndex=0 → scenario.quote
 * turnIndex≥1 → followUpOpening o followUpClosing basandosi sull'analisi precedente
 * Due risposte consecutive scarse dopo il minimo → withdrawalMessage
 */
export function getOtherPersonMessage(
  scenario: Scenario,
  turnIndex: number,
  previousTurns: DialogueTurn[]
): string | null {
  // Primo turno: usa la citazione originale dello scenario
  if (turnIndex === 0) {
    return scenario.quote
  }

  const lastTurn = previousTurns[previousTurns.length - 1]

  // Se non c'è un'analisi precedente, usa il followUpClosing come fallback
  if (!lastTurn) {
    return scenario.followUpClosing
  }

  const lastIsGood = RESOLUTION_STATES.includes(lastTurn.analysis.globalState)

  // Due risposte consecutive scarse (da turno 2 in poi) → withdrawalMessage
  if (turnIndex >= 2 && !lastIsGood) {
    const prevTurn = previousTurns[previousTurns.length - 2]
    const prevIsAlsoBad = prevTurn && !RESOLUTION_STATES.includes(prevTurn.analysis.globalState)
    if (prevIsAlsoBad) {
      return scenario.withdrawalMessage
    }
  }

  return lastIsGood ? scenario.followUpOpening : scenario.followUpClosing
}

/**
 * Determina se il dialogo deve finire dopo questo turno.
 * Restituisce la ragione o null se il dialogo continua.
 * - Prima del minimo (MIN_TURNS): mai chiudere
 * - Resolved: ultimo turno è curiosità/presenza
 * - Closed: due turni consecutivi di difesa
 * - Timeout: raggiunto MAX_TURNS senza resolved o closed
 */
export function getEndReason(
  turns: DialogueTurn[],
  currentTurnIndex: number
): DialogueEndReason | null {
  if (turns.length === 0) return null

  // Minimo MIN_TURNS battute: nessuna chiusura anticipata
  if (turns.length < MIN_TURNS) return null

  const lastTurn = turns[turns.length - 1]

  // Resolved: ultimo turno ha globalState 'curiosità' o 'presenza'
  if (RESOLUTION_STATES.includes(lastTurn.analysis.globalState)) {
    return 'resolved'
  }

  // Closed: due turni consecutivi con globalState 'difesa'
  if (turns.length >= 2) {
    const prevTurn = turns[turns.length - 2]
    if (
      lastTurn.analysis.globalState === 'difesa' &&
      prevTurn.analysis.globalState === 'difesa'
    ) {
      return 'closed'
    }
  }

  // Timeout: raggiunto MAX_TURNS senza resolved o closed
  if (currentTurnIndex >= MAX_TURNS - 1) {
    return 'timeout'
  }

  return null
}

/**
 * Restituisce la migliore analisi tra tutti i turni (il punteggio più alto).
 * Il punteggio si basa sull'indice dello stato globale.
 */
export function getBestAnalysis(turns: DialogueTurn[]): AnalysisResult | null {
  if (turns.length === 0) return null

  const stateRanking: Record<string, number> = {
    difesa: 0,
    risposta: 1,
    curiosità: 2,
    presenza: 3,
  }

  return turns.reduce((best, turn) => {
    const bestScore = stateRanking[best.analysis.globalState] ?? 0
    const currentScore = stateRanking[turn.analysis.globalState] ?? 0
    return currentScore > bestScore ? turn : best
  }).analysis
}

/**
 * Messaggio finale da mostrare basato sulla ragione di chiusura.
 */
export function getEndMessage(endReason: DialogueEndReason): {
  title: string
  body: string
} {
  switch (endReason) {
    case 'resolved':
      return {
        title: 'Il dialogo si è aperto',
        body: "Il tuo ascolto ha creato uno spazio sicuro. L'altra persona si è sentita vista e ha potuto andare più in profondità. Questo è quello che rende un dialogo reale.",
      }
    case 'closed':
      return {
        title: 'Il dialogo si è chiuso',
        body: "L'altra persona ha scelto di ritirarsi. Quando l'ascolto non crea abbastanza spazio di sicurezza, chi parla preferisce chiudersi. Non è un fallimento — è un segnale su dove c'è ancora da crescere.",
      }
    case 'timeout':
      return {
        title: 'Il dialogo è finito',
        body: "Hai attraversato il dialogo completo. L'altra persona non si è del tutto chiusa, ma non si è nemmeno aperta pienamente. Esplorare il feedback ti aiuterà a capire cosa ha funzionato e cosa potresti portare più in profondità.",
      }
  }
}
