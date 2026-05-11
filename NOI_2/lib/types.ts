// ============================================================
// NOI² – Allenatore di Ascolto Partecipativo
// Types & Interfaces
// ============================================================

export type Context =
  | 'lavoro'
  | 'famiglia'
  | 'amicizie'
  | 'coppia'
  | 'gruppi'
  | 'vendita'

export type Archetype =
  | 'sfiducia'
  | 'accusa_indiretta'
  | 'delusione'
  | 'chiusura'
  | 'bisogno_nascosto'
  | 'conflitto_prospettiva'
  | 'richiesta_mascherata'
  | 'resistenza'
  | 'silenzio_significativo'
  | 'frase_spiazzante'

export type ListeningState = 'difesa' | 'risposta' | 'curiosità' | 'presenza'

export interface Scenario {
  id: string
  context: Context
  archetype: Archetype
  title: string
  setup: string
  quote: string
  hiddenTension: string
  possibleTrap: string
  listeningOpportunity: string
  followUpOpening: string
  followUpClosing: string
  withdrawalMessage: string
}

export interface ContextInfo {
  id: Context
  label: string
  description: string
  tension: string
  emoji: string
}

export interface IndicatorScores {
  stumbleAccepted: number
  judgmentSuspended: number
  activeCuriosity: number
  presenceOnOther: number
  openHorizon: number
  correctiveImpulse: number
}

export interface FeedbackBlocks {
  closure: string
  opening: string
  unheard: string
  horizon: string
}

export interface AnalysisResult extends IndicatorScores {
  globalState: ListeningState
  globalStateNuance?: string
  feedback: FeedbackBlocks
  alternativeResponse: string
  whyAlternativeWorks: string
}

export interface DialogueTurn {
  turnIndex: number
  otherPersonMessage: string
  userResponse: string
  analysis: AnalysisResult
}

export type DialogueEndReason = 'resolved' | 'closed' | 'timeout'

export interface SavedExperience {
  id: string
  timestamp: number
  context: Context
  scenario: Scenario
  userResponse: string
  analysis: AnalysisResult
  reflection: string
  dialogueTurns?: DialogueTurn[]
  dialogueEndReason?: DialogueEndReason
}

export type AppScreen =
  | 'home'
  | 'context'
  | 'scenario'
  | 'response'
  | 'dashboard'
  | 'feedback'
  | 'alternative'
  | 'reflection'
  | 'celebration'
  | 'summary'
  | 'history'
  | 'dialogue'
  | 'dialogue_end'

export interface AppState {
  screen: AppScreen
  selectedContext: Context | null
  currentScenario: Scenario | null
  userResponse: string
  analysisResult: AnalysisResult | null
  reflection: string
  savedExperiences: SavedExperience[]
  }
