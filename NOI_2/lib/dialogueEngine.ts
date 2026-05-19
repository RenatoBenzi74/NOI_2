// ============================================================
// NOI² – Dialogue Engine
// Gestisce la logica del dialogo multi-turno
// ============================================================

import { Scenario, DialogueTurn, DialogueEndReason, AnalysisResult, Archetype } from './types'

export const MIN_TURNS = 3   // minimo scambi prima di poter chiudere
export const MAX_TURNS = 6   // massimo scambi (poi timeout)
export const RESOLUTION_STATES = ['curiosità', 'presenza']

// ============================================================
// POOL REATTIVO PER ARCHETIPO
// Usato dal turno 2 in poi per evitare ripetizioni
// ============================================================

const ARCHETYPE_FOLLOW_UPS: Record<Archetype, { opening: string[]; closing: string[] }> = {
  sfiducia: {
    opening: [
      'Non me lo aspettavo. Che qualcuno si fermasse davvero. Di solito si risponde in fretta e si va avanti.',
      'È da molto che non lo dico ad alta voce. Ma sì, è esattamente così che mi sento.',
      'Non so se sai quanto fa differenza, quello che hai appena fatto.',
    ],
    closing: [
      'Vabbè. Forse non è il momento giusto per parlarne.',
      'Lascia stare. È già troppo.',
    ],
  },
  accusa_indiretta: {
    opening: [
      'Forse ho detto troppo. O forse non abbastanza. Ma almeno ti sei fermato.',
      'Non volevo che diventasse una cosa così grossa. Ma quando me lo chiedi così, sì, c\'è qualcosa.',
      'Sento che stai cercando di capire davvero. Non solo di spiegare.',
    ],
    closing: [
      'Forse era solo sfogo. Lascia perdere.',
      'Non ha senso andare avanti se non ci capiamo.',
    ],
  },
  delusione: {
    opening: [
      'Non è solo questa volta. C\'era qualcosa che mi aspettavo e non è arrivato. E non sapevo nemmeno di aspettarmelo così tanto.',
      'Mi aiuta che tu lo abbia notato. La delusione fa meno male quando qualcuno la vede.',
      'Sì. Ecco. È esattamente quello che non riuscivo a dire prima.',
    ],
    closing: [
      'Non c\'è niente da aggiungere, davvero.',
      'Lascia stare. Non voglio trasformarla in una discussione.',
    ],
  },
  chiusura: {
    opening: [
      'Non volevo parlarne. Ma forse ne avevo bisogno.',
      'È strano. Di solito tengo queste cose per me. Ma in qualche modo riesci a farmi continuare.',
      'Non è facile dirlo. Ma sì — c\'è qualcosa che non ho ancora detto.',
    ],
    closing: [
      'Non riesco ad andare avanti. Non adesso.',
      'Preferisco fermarmi qui.',
    ],
  },
  bisogno_nascosto: {
    opening: [
      'Non sapevo nemmeno io cosa volevo. Adesso inizia a prendere forma.',
      'C\'è qualcosa sotto che non ho nominato ancora. Dammi un secondo.',
      'Stai toccando qualcosa di più grande. Forse è quello il punto.',
    ],
    closing: [
      'Non sono sicuro di volerlo dire ad alta voce.',
      'Lascia perdere. Non so nemmeno io cosa voglio.',
    ],
  },
  conflitto_prospettiva: {
    opening: [
      'Non mi aspettavo che tu potessi vedere la cosa dal mio punto di vista. Magari ci siamo fraintesi.',
      'Forse stiamo dicendo la stessa cosa in modo diverso. O forse no. Ma almeno stiamo parlando.',
      'Quello che dici ha senso. Anche se la vedo ancora diversamente.',
    ],
    closing: [
      'La vediamo in modo troppo diverso. Non so se si può trovare un punto comune.',
      'Ho detto quello che penso. Non mi sembra che cambi qualcosa.',
    ],
  },
  richiesta_mascherata: {
    opening: [
      'Forse stavo aspettando che qualcuno me lo chiedesse. E tu l\'hai fatto.',
      'Non so esattamente cosa chiedo. Ma sento che c\'è qualcosa. E tu l\'hai sentito anche tu.',
      'Hai ragione. C\'è una domanda sotto. Solo che non l\'ho mai formulata bene.',
    ],
    closing: [
      'Lascia stare. Non era importante.',
      'Forse non sono pronto a dirlo.',
    ],
  },
  resistenza: {
    opening: [
      'Non mi aspettavo che tu volessi capire cosa c\'è dietro la mia resistenza. Di solito si insiste e basta.',
      'Hai ragione che c\'è qualcosa che voglio proteggere. Solo che non l\'avevo formulato così.',
      'Non è la prima volta che cambiano le cose senza chiedere. E ogni volta è lo stesso.',
    ],
    closing: [
      'Ho già detto quello che penso. Non cambio idea.',
      'Non ha senso continuare.',
    ],
  },
  silenzio_significativo: {
    opening: [
      'Non sono abituato a parlare di queste cose. Ma tu hai aspettato. E questo fa differenza.',
      'Il silenzio era più semplice. Ma qualcosa vuole uscire. Non so ancora cosa.',
      'Ecco. Sei rimasto lì. Non molti lo fanno.',
    ],
    closing: [
      'Preferisco il silenzio. Almeno non sbaglio.',
      'Non riesco a trovare le parole giuste.',
    ],
  },
  frase_spiazzante: {
    opening: [
      'L\'ho detto senza pensarci. Poi è rimasta lì. Forse perché era vera.',
      'Non me lo aspettavo che ti fermasse. Ma sono contento che l\'abbia fatto.',
      'Sì, quella frase l\'ho detta da qualche parte precisa. Se vuoi, ti spiego.',
    ],
    closing: [
      'Forse non avrei dovuto dirlo. Lascia stare.',
      'Non so cosa volevo dire. Forse niente.',
    ],
  },
}

// ============================================================
// MICRO-FEEDBACK — una riga calda dopo ogni risposta utente
// ============================================================

export const MICRO_FEEDBACK: Record<string, string[]> = {
  difesa: [
    'Stai rispondendo... più a te stesso che a lui.',
    "C'è una spinta a sistemare. Lui lo sente.",
    'Stai difendendo qualcosa prima ancora di capire cosa.',
  ],
  risposta: [
    "Hai risposto alla parola. Ma c'è ancora qualcosa sotto.",
    'Stai nella conversazione. Non ancora nel vissuto.',
    "Un passo dentro. Potresti andare ancora un po' piu' in fondo.",
  ],
  curiosita: [
    'Stai aprendo uno spazio. Il personaggio lo sente.',
    'Bene — stai esplorando invece di concludere.',
    'Quella domanda ha aperto qualcosa. Aspetta la risposta davvero.',
  ],
  presenza: [
    'Sei davvero lì con lui. Questo cambia tutto.',
    'Lo stai ascoltando — non solo sentendo. Si vede.',
    'Presenza vera. Il dialogo può andare in profondità.',
  ],
}

/**
 * Restituisce il testo del micro-feedback per uno stato di ascolto.
 * Usa turnIndex per variare il messaggio e non ripetere.
 */
export function getMicroFeedback(state: string, turnIndex: number): string {
  // normalizza 'curiosità' → 'curiosita' per la chiave
  const key = state === 'curiosità' ? 'curiosita' : state
  const pool = MICRO_FEEDBACK[key] ?? MICRO_FEEDBACK['risposta']
  return pool[turnIndex % pool.length]
}

// ============================================================
// LOGICA DEL DIALOGO
// ============================================================

/**
 * Restituisce il messaggio dell'altra persona per il turno corrente.
 * turnIndex=0  → scenario.quote
 * turnIndex=1  → followUpOpening o followUpClosing
 * turnIndex≥2  → pool archetype-specifico (evita ripetizioni)
 * 2 risposte consecutive scarse → withdrawalMessage
 */
export function getOtherPersonMessage(
  scenario: Scenario,
  turnIndex: number,
  previousTurns: DialogueTurn[]
): string | null {
  if (turnIndex === 0) {
    return scenario.quote
  }

  const lastTurn = previousTurns[previousTurns.length - 1]
  if (!lastTurn) {
    return scenario.followUpClosing
  }

  const lastIsGood = RESOLUTION_STATES.includes(lastTurn.analysis.globalState)

  // Due risposte consecutive scarse → withdrawalMessage
  if (turnIndex >= 2 && !lastIsGood) {
    const prevTurn = previousTurns[previousTurns.length - 2]
    const prevIsAlsoBad = prevTurn && !RESOLUTION_STATES.includes(prevTurn.analysis.globalState)
    if (prevIsAlsoBad) {
      return scenario.withdrawalMessage
    }
  }

  // Turno 1: usa i follow-up statici dello scenario
  if (turnIndex === 1) {
    return lastIsGood ? scenario.followUpOpening : scenario.followUpClosing
  }

  // Turno 2+: usa il pool reattivo per archetipo
  const pool = ARCHETYPE_FOLLOW_UPS[scenario.archetype]
  if (pool) {
    const messages = lastIsGood ? pool.opening : pool.closing
    const index = (turnIndex - 2) % messages.length
    return messages[index]
  }

  return lastIsGood ? scenario.followUpOpening : scenario.followUpClosing
}

/**
 * Determina se il dialogo deve finire dopo questo turno.
 */
export function getEndReason(
  turns: DialogueTurn[],
  currentTurnIndex: number
): DialogueEndReason | null {
  if (turns.length === 0) return null
  if (turns.length < MIN_TURNS) return null

  const lastTurn = turns[turns.length - 1]

  if (RESOLUTION_STATES.includes(lastTurn.analysis.globalState)) {
    return 'resolved'
  }

  if (turns.length >= 2) {
    const prevTurn = turns[turns.length - 2]
    if (
      !RESOLUTION_STATES.includes(lastTurn.analysis.globalState) &&
      !RESOLUTION_STATES.includes(prevTurn.analysis.globalState)
    ) {
      return 'closed'
    }
  }

  if (currentTurnIndex >= MAX_TURNS - 1) {
    return 'timeout'
  }

  return null
}

/**
 * Restituisce la migliore analisi tra tutti i turni.
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
