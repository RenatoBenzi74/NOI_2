// ============================================================
// NOIÂ² â Motore di Analisi dell'Ascolto
// Versione euristica â architettura pronta per API AI reale
//
// FUTURA INTEGRAZIONE AI:
// Sostituire il corpo di analyzeListeningResponse() con:
// const response = await fetch('/api/analyze', {
//   method: 'POST',
//   body: JSON.stringify({ response, scenario, context })
// })
// return await response.json() as AnalysisResult
// ============================================================

import { Scenario, Context, AnalysisResult, ListeningState, FeedbackBlocks } from './types'

// ============================================================
// SEGNALI DI APERTURA â aumentano i punteggi positivi
// ============================================================

const CURIOSITY_SIGNALS = [
  /\bmi aiuti a capire\b/i,
  /\bcosa intendi\b/i,
  /\bcosa vuoi dire\b/i,
  /\bquando hai avuto questa sensazione\b/i,
  /\braccontami\b/i,
  /\bche cosa ti ha fatto pensare\b/i,
  /\bcosa ti fa dire\b/i,
  /\bda quanto tempo\b/i,
  /\bcosa ti servirebbe\b/i,
  /\bpuoi dirmi di piÃ¹\b/i,
  /\bdimmi di piÃ¹\b/i,
  /\bdimmi\b/i,
  /\bcome mai\b/i,
  /\bcosa significa per te\b/i,
  /\bcosa ti aspettavi\b/i,
  /\bcosa ti ha colpito\b/i,
  /\bcome ti sei sentit[oa]\b/i,
  /\bcosa sta succedendo\b/i,
  /\bin che senso\b/i,
  /\bhm[m]?,?\b/i,
  /\bcurioso[/a]?\b/i,
  /\bprova a spiegarmi\b/i,
  /\bspiegami\b/i,
  /\bcosa hai provato\b/i,
  /\bcosa provi\b/i,
  /\bcosa ti ha portato\b/i,
  /\bcome Ã¨ andata\b/i,
  /\be poi\b/i,
  /\baiutami a capire\b/i,
  /\bcosa ti manca\b/i,
  /\"cosa Ã¨ successo\b/i,
  /\bmi interessa\b/i,
  /\bparlami\b/i,
  /\bcosa c'Ã¨ dietro\b/i,
  /\bvorresti raccontare\b/i,
  /\bposso chiederti\b/i,
  /\bcosa ti sta\b/i,
  /\bcosa ti pesa\b/i,
  /\bcosa ti blocca\b/i,
  /\bcosa hai vissuto\b/i,
  /\bcom'Ã¨ stato\b/i,
  /\bcosa ne pensi\b/i,
  /\bcosa ti aspetti\b/i,
]

const PRESENCE_SIGNALS = [
  /\bmi sembra che\b/i,
  /\bsento che per te\b/i,
  /\bmi colpisce\b/i,
  /\bimmagino che\b/i,
  /\bse ho capito\b/i,
  /\bper te Ã¨ importante\b/i,
  /\bstai vivendo\b/i,
  /\bstai sentendo\b/i,
  /\bstai attraversando\b/i,
  /\bla tua fatica\b/i,
  /\bla tua delusione\b/i,
  /\bla tua frustrazione\b/i,
  /\bla tua stanchezza\b/i,
  /\bil tuo dolore\b/i,
  /\bla tua paura\b/i,
  /\bti capisco\b/i,
  /\bha senso\b/i,
  /\bÃ¨ comprensibile\b/i,
  /\bÃ¨ normale sentirsi\b/i,
  /\bvedo che\b/i,
  /\bpercepisco\b/i,
  /\bnon Ã¨ facile\b/i,
  /\bdev'essere\b/i,
  /\bdeve essere\b/i,
  /\bti sento\b/i,
  /\bsento quanto\b/i,
  /\bcapisco cosa\b/i,
  /\bci sei davvero\b/i,
  /\bti sto ascoltando\b/i,
  /\bti ascolto\b/i,
  /\bcosa provi tu\b/i,
  /\bquanto deve essere\b/i,
  /\bÃ¨ importante per te\b/i,
  /\blo sento\"/i,
  /\bha colpito\"/i,
]

const JUDGMENT_SUSPENDED_POSITIVE = [
  /\bforse\b/i,
  /\bpotrebbe essere\b/i,
  /\bsembra\b/i,
  /\bmi chiedo\b/i,
  /\bpotrei sbagliarmi\b/i,
  /\bnon sono sicuro\"/i,
  /\bpotrebbe darsi\b/i,
  /\bÃ¨ possibile che\b/i,
  /\bse non sbaglio\b/i,
]

const OPEN_HORIZON_SIGNALS = [
  /\bcosa vorresti\b/i,
  /\bcosa ti servirebbe\b/i,
  /\bcome immagini\b/i,
  /\bcome sarebbe\b/i,
  /\bcosa cambierebbe\b/i,
  /\bse potessi\b/i,
  /\bcosa pensi\b/i,
  /\bcosa senti\b/i,
  /\bcome la vedi\b/i,
  /\"apriamo\"/i,
  /\bpotremmo\b/i,
  /\bpossiamo esplorare\b/i,
]

// ============================================================
// SEGNALI DI CHIUSURA â aumentano l'impulso a correggere
// ============================================================

const CORRECTIVE_SIGNALS = [
  /\bdevi\b/i,
  /\bbisogna\b/i,
  /\bti spiego\b/i,
  /\bnon C¨ vero\b/i,
  /\bnon Ã¨ cosÃ¬\b/i,
  /\bsecondo me sbagli\b/i,
  /\bdovresti\b/i,
  /\bfai cosÃ¬\b/i,
  /\bla soluzione Ã¨\b/i,
  /\bin realtÃ \b/i,
  /\bma no dai\b/i,
  /\bnon farne un dramma\b/i,
  /\bcalmati\b/i,
  /\bnon Ã¨ un problema\b/i,
  /\bnon preoccuparti\b/i,
  /\btranquillo[/a]?\b/i,
  /\bstai esagerando\"/i,
  /\bÃ¨ semplice\b/i,
  /\bbasta cosÃ¬\b/i,
  /\bdevi solo\b/i,
  /\bnon C¨ niente\b/i,
  /\bguarda che\b/i,
  /\bricorda che\b/i,
  /\bsai bene che\b/i,
  /\bti assicuro\b/i,
  /\bgiuro\"/i,
  /\bti prometto\b/i,
]

const DEFENSE_SIGNALS = [
  /\bsÃ¬ perÃ²\b/i,
  /\bsÃ¬, perÃ²\b/i,
  /\bcapisci che\b/i,
  /\"capisce che\b/i,
  /\bho sempre fatto\"/i,
  /\bnon Ã¨ colpa mia\b/i,
  /\bnon dipende da me\b/i,
  /\bÃ¨ un malinteso\"/i,
  /\bintendevo dire\b/i,
  /\bnon intendevo\b/i,
  /\bla realtÃ  Ã¨ che\b/i,
  /\bla veritÃ  Ã¨ che\b/i,
]

const JUDGMENT_NEGATIVE = [
  /\bstai esagerando\"/i,
  /\bnon ha senso\b/i,
  /\bsei troppo\b/i,
  /\bnon dovresti\b/i,
  /\bsbagliato[/a]?\b/i,
  /\berrato[/a]?\"/i,
  /\bimmaginazione\b/i,
  /\bparanoia\b/i,
  /\btroppo sensibil[ei]\b/i,
  /\bnon C¨ giusto che\b/i,
]

// ============================================================
// Funzione principale di conteggio
// ============================================================

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => {
    const matches = text.match(new RegExp(pattern.source, 'gi'))
    return count + (matches ? matches.length : 0)
  }, 0)
}

function hasQuestion(text: string): boolean {
  return text.includes('?')
}

function questionCount(text: string): number {
  return (text.match(/\?/g) || []).length
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length
}

function hasOpenQuestion(text: string): boolean {
  const openQuestionWords = /\b(cosa|come|quando|perchÃ©|per quale|in quale|quale|quanto|dove|chi|da dove|da quando|da quanto)\b/i
  return text.includes('?') && openQuestionWords.test(text)
}

// ============================================================
// CALCOLO INDICATORI
// ============================================================

function calcActiveCuriosity(text: string): number {
  const curiosityMatches = countMatches(text, CURIOSITY_SIGNALS)
  const openQuestions = hasOpenQuestion(text) ? Math.min(questionCount(text), 3) : 0
  const base = Math.min(curiosityMatches * 18 + openQuestions * 25, 90)
  // Bonus per domande multiple
  const bonus = questionCount(text) > 1 ? 8 : 0
  return Math.min(base + bonus, 100)
}

function calcPresenceOnOther(text: string): number {
  const presenceMatches = countMatches(text, PRESENCE_SIGNALS)
  const base = Math.min(presenceMatches * 20, 85)
  // PenalitÃ  se ci sono molti segnali di difesa (sposta su di sÃ©)
  const defenseCount = countMatches(text, DEFENSE_SIGNALS)
  const penalty = defenseCount * 10
  return Math.max(base - penalty, 0)
}

function calcJudgmentSuspended(text: string): number {
  const positive = countMatches(text, JUDGMENT_SUSPENDED_POSITIVE)
  const negative = countMatches(text, JUDGMENT_NEGATIVE)
  const corrective = countMatches(text, CORRECTIVE_SIGNALS)

  // Se non ci sono giudizi negativi o segnali correttivi, il punteggio Ã¨ giÃ  alto
  const base = negative === 0 && corrective === 0 ? 65 : 35
  const boost = Math.min(positive * 8, 30)
  const penalty = negative * 15 + corrective * 8
  return Math.max(Math.min(base + boost - penalty, 100), 0)
}

function calcOpenHorizon(text: string): number {
  const horizonMatches = countMatches(text, OPEN_HORIZON_SIGNALS)
  const openQuestions = hasOpenQuestion(text) ? 1 : 0
  const base = Math.min(horizonMatches * 18 + openQuestions * 12, 85)
  const corrective = countMatches(text, CORRECTIVE_SIGNALS)
  const penalty = corrective * 10
  return Math.max(base - penalty, 0)
}

function calcCorrectiveImpulse(text: string): number {
  const corrective = countMatches(text, CORRECTIVE_SIGNALS)
  const defense = countMatches(text, DEFENSE_SIGNALS)
  const negative = countMatches(text, JUDGMENT_NEGATIVE)
  const base = Math.min((corrective * 18) + (defense * 12) + (negative * 10), 100)
  // Leggero baseline â tutti abbiamo un minimo di impulso correttivo
  return Math.max(base, 10)
}

function calcStumbleAccepted(
  text: string,
  curiosity: number,
  presence: number,
  corrective: number
): number {
  // L'inciampo accolto emerge dalla combinazione di apertura e bassa chiusura
  const avgOpen = (curiosity + presence) / 2
  const closurePenalty = corrective * 0.4
  const base = avgOpen - closurePenalty
  return Math.max(Math.min(Math.round(base), 100), 0)
}

// ============================================================
// CALCOLO STATO GLOBALE
// ============================================================

function calcGlobalState(
  activeCuriosity: number,
  presenceOnOther: number,
  judgmentSuspended: number,
  openHorizon: number,
  correctiveImpulse: number
): { state: ListeningState; nuance: string } {
  const openAvg = (activeCuriosity + presenceOnOther + openHorizon) / 3

  // DIFESA
  if (correctiveImpulse >= 60 && activeCuriosity <= 30) {
    if (presenceOnOther > 40) {
      return { state: 'difesa', nuance: 'Risposta gentile ma chiudente' }
    }
    return { state: 'difesa', nuance: 'Stai proteggendo il tuo spazio piÃ¹ che esplorando quello dell\'altro' }
  }

  // PRESENZA
  if (activeCuriosity >= 60 && presenceOnOther >= 55 && openHorizon >= 50 && correctiveImpulse <= 35) {
    if (openHorizon < 60) {
      return { state: 'presenza', nuance: 'Buona presenza, ma poco orizzonte' }
    }
    return { state: 'presenza', nuance: 'Stai facendo spazio all\'altro senza sparire tu' }
  }

  // CURIOSITÃ
  if (activeCuriosity >= 20 && judgmentSuspended >= 40) {
    if (correctiveImpulse >= 40) {
      return { state: 'curiositÃ ', nuance: 'CuriositÃ  presente ma ancora molto controllo' }
    }
    return { state: 'curiositÃ ', nuance: 'Stai iniziando a esplorare il mondo dell\'altro' }
  }

  // RISPOSTA con sfumature
  if (openAvg >= 30) {
    if (presenceOnOther >= 45) {
      return { state: 'risposta', nuance: 'Ascolto aperto con lieve impulso risolutivo' }
    }
    return { state: 'risposta', nuance: 'Stai reagendo al contenuto, ma non ancora al vissuto' }
  }

  return { state: 'risposta', nuance: 'Risposta educata ma ancora distante dal vissuto' }
}

// ============================================================
// GENERAZIONE FEEDBACK
// ============================================================

function generateFeedback(
  text: string,
  scenario: Scenario,
  state: ListeningState,
  activeCuriosity: number,
  presenceOnOther: number,
  correctiveImpulse: number,
  judgmentSuspended: number
): FeedbackBlocks {
  const corrective = countMatches(text, CORRECTIVE_SIGNALS)
  const hasQ = hasQuestion(text)
  const presenceSignals = countMatches(text, PRESENCE_SIGNALS)

  // BLOCCO 1: Dove ti stai chiudendo
  let closure = ''
  if (corrective > 2) {
    closure = `La tua risposta contiene piÃ¹ di una spinta a sistemare o a spiegare. Questo Ã¨ comprensibile â Ã¨ istintivo voler dare sollievo o chiarezza. Ma in questo momento stai rispondendo alla superficie, non al nodo piÃ¹ profondo: ${scenario.hiddenTension.toLowerCase()}.`
  } else if (state === 'difesa') {
    closure = `Qui stai difendendo la tua posizione con gentilezza, ma stai difendendo. La frase dell'altro ha toccato qualcosa che ti ha messo sulla difensiva, e la tua risposta prova a riportare equilibrio prima di aver davvero esplorato cosa stava dicendo.`
  } else if (corrective > 0) {
    closure = `C'Ã¨ un passaggio in cui la tua risposta prova a sistemare troppo presto. ${scenario.possibleTrap}. Non Ã¨ sbagliato, Ã¨ umano â ma rischia di chiudere lo spazio prima di averlo aperto.`
  } else {
    closure = `La tua risposta non chiude in modo evidente. Potresti perÃ² sostare ancora un secondo in piÃ¹ su ciÃ² che l'altro sta vivendo prima di offrire qualsiasi prospettiva.`
  }

  // BLOCCO 2: Dove si intravede apertura
  let opening = ''
  if (presenceSignals > 0 && hasQ) {
    opening = `C'Ã¨ un momento in cui inizi ad ascoltare davvero: quando riconosci qualcosa del vissuto dell'altro e poni una domanda aperta. Quel gesto â anche piccolo â crea uno spazio reale.`
  } else if (hasQ) {
    opening = `Il fatto che tu faccia una domanda Ã¨ giÃ  un segnale di apertura. L'ascolto partecipativo nasce dall'intenzione di esplorare, e quella domanda mostra che sei orientato in quella direzione.`
  } else if (presenceSignals > 0) {
    opening = `Riconosci qualcosa del vissuto dell'altro. Questo Ã¨ giÃ  un primo passo significativo â molte risposte saltano completamente il piano emotivo.`
  } else {
    opening = `La tua risposta non Ã¨ chiusa del tutto. C'Ã¨ un tono di cura che si intravede, anche se non Ã¨ ancora arrivato al centro di ciÃ² che l'altro stava cercando di dire.`
  }

  // BLOCCO 3: Cosa non hai ancora ascoltato
  let unheard = ''
  unheard = `Quello che non hai ancora raggiunto Ã¨ questo: ${scenario.hiddenTension}. L'altro non sta solo dicendo quello che sembra dire. Sta cercando di comunicare qualcosa di piÃ¹ profondo, che non ha ancora trovato le parole giuste. L'opportunitÃ  era: ${scenario.listeningOpportunity}.`

  // BLOCCO 4: Come potresti aprire l'orizzonte
  let horizon = ''
  if (activeCuriosity < 30) {
    horizon = `Potresti provare a fare una sola domanda aperta â non per trovare una soluzione, ma per capire davvero cosa stava cercando di dire. A volte basta un "mi aiuti a capire meglio cosa intendi" per aprire uno spazio che prima era chiuso.`
  } else if (presenceOnOther < 40) {
    horizon = `Prima di rispondere, potresti nominare ciÃ² che hai sentito nel tono dell'altro. Non per analizzarlo, ma per mostrargli che l'hai visto. Un riconoscimento â anche semplice â puÃ² aprire molto piÃ¹ di una risposta ben costruita.`
  } else {
    horizon = `Hai giÃ  gli strumenti. Il passo successivo Ã¨ rallentare ancora un po'. L'orizzonte si apre quando non si ha fretta di arrivare alla risposta, ma si dÃ  spazio alla domanda.`
  }

  return { closure, opening, unheard, horizon }
}

// ============================================================
// GENERAZIONE RISPOSTA ALTERNATIVA
// ============================================================

function generateAlternativeResponse(scenario: Scenario): string {
  const { archetype, hiddenTension, listeningOpportunity, quote } = scenario

  const templates: Record<string, string[]> = {
    sfiducia: [
      `Mi colpisce quello che dici. Sembra che non sia solo una questione di questa decisione specifica â c'Ã¨ qualcosa che senti mancare da un po'. Quando hai avuto per la prima volta questa sensazione?`,
      `Quella frase mi rimane. Quando dici "${quote.substring(0, 30)}..." â cosa ti ha fatto arrivare a pensarla? Cosa Ã¨ successo?`,
    ],
    accusa_indiretta: [
      `Ho sentito qualcosa di importante in quello che hai detto. Sembra che ci sia una stanchezza che va oltre questo momento. Cosa hai vissuto che ti ha portato a questa sensazione?`,
      `Mi fermo su quello che hai detto. Non voglio rispondere prima di capire davvero cosa c'Ã¨ dentro. In quale momento hai sentito che non ti stavo considerando abbastanza?`,
    ],
    delusione: [
      `Mi colpisce quella parola â "pensavo". Ci tenevi davvero a questo. Cosa significava per te?`,
      `Sento il peso di quella delusione. Non voglio minimizzarla. Cosa ti aspettavi che non Ã¨ arrivato?`,
    ],
    chiusura: [
      `Non voglio insistere. Resto qui perÃ². E quando vuoi, sono pronto ad ascoltarti davvero.`,
      `Va bene. Non premo. Ma voglio che tu sappia che quello che dici conta per me. Quando ti va.`,
    ],
    bisogno_nascosto: [
      `Aspetta un secondo. Sento che c'Ã¨ qualcosa di piÃ¹ grande dentro a quello che stai dicendo. Cosa si porta dietro quel "ogni volta"?`,
      `Mi fermo qui. Non Ã¨ solo questo episodio, giusto? Da dove viene questa sensazione?`,
    ],
    conflitto_prospettiva: [
      `Capisco che le vediamo in modo molto diverso. Voglio capire la tua prospettiva meglio. Cosa ha reso le cose cosÃ¬ pesanti per te?`,
      `Per me Ã¨ importante capire come la vivi tu, non solo difendere come la vedo io. Cosa si Ã¨ inceppato nella tua esperienza?`,
    ],
    richiesta_mascherata: [
      `Mi sembra che ci sia qualcosa di piÃ¹ in quello che dici. Non so se ho capito bene â cosa stai cercando in questo momento?`,
      `Ho come l'impressione che stai portando qualcosa. Sono qui. Di cosa hai bisogno davvero?`,
    ],
    resistenza: [
      `Non voglio convincerti. Voglio capire cosa hai investito nel modo precedente â cosa rischi di perdere in questo cambiamento?`,
      `Ha senso che tu resista se c'Ã¨ qualcosa di importante che senti a rischio. Cosa cambierebbe per te?`,
    ],
    silenzio_significativo: [
      `Non ti forzo a parlare. Ma mi interessa quello che non stai dicendo. Cosa c'Ã¨ sotto quel silenzio?`,
      `Quel silenzio mi dice qualcosa. Non so cosa â e preferirei non indovinare. Me lo dici tu?`,
    ],
    frase_spiazzante: [
      `Quella frase mi ha fermato. Ha detto qualcosa di vero. Raccontami di piÃ¹ â cosa ti ha fatto pensare questo?`,
      `Mi colpisce. Non voglio reagire subito. Aiutami a capire quando hai avuto questa sensazione per la prima volta.`,
    ],
  }

  const options = templates[archetype] || [
    `Mi colpisce quello che dici. Sembra che ci sia qualcosa di importante che non abbiamo ancora nominato. Mi aiuti a capire cosa sta succedendo davvero per te?`,
  ]

  return options[Math.floor(Math.random() * options.length)]
}

function generateWhyAlternativeWorks(
  state: ListeningState,
  scenario: Scenario
): string {
  const parts = [
    `Questa risposta non contraddice, non convince e non rassicura troppo in fretta.`,
  ]

  if (state === 'difesa') {
    parts.push(`A differenza della tua, non parte da una posizione da difendere.`)
  }

  parts.push(
    `Prima riconosce il vissuto â ${scenario.hiddenTension.toLowerCase()} â e poi apre uno spazio di esplorazione con una domanda che non chiude, ma invita.`
  )
  parts.push(
    `L'obiettivo non Ã¨ trovare la risposta giusta, ma creare le condizioni perchÃ© l'altro possa dire di piÃ¹.`
  )

  return parts.join(' ')
}

// ============================================================
// FUNZIONE PRINCIPALE
// ============================================================

export function analyzeListeningResponse(
  response: string,
  scenario: Scenario,
  _context: Context
): AnalysisResult {
  const text = response.toLowerCase()

  // Calcola indicatori
  const activeCuriosity = calcActiveCuriosity(text)
  const presenceOnOther = calcPresenceOnOther(text)
  const judgmentSuspended = calcJudgmentSuspended(text)
  const openHorizon = calcOpenHorizon(text)
  const correctiveImpulse = calcCorrectiveImpulse(text)
  const stumbleAccepted = calcStumbleAccepted(
    text,
    activeCuriosity,
    presenceOnOther,
    correctiveImpulse
  )

  // Calcola stato globale
  const { state: globalState, nuance: globalStateNuance } = calcGlobalState(
    activeCuriosity,
    presenceOnOther,
    judgmentSuspended,
    openHorizon,
    correctiveImpulse
  )

  // Genera feedback
  const feedback = generateFeedback(
    text,
    scenario,
    globalState,
    activeCuriosity,
    presenceOnOther,
    correctiveImpulse,
    judgmentSuspended
  )

  // Genera risposta alternativa
  const alternativeResponse = generateAlternativeResponse(scenario)
  const whyAlternativeWorks = generateWhyAlternativeWorks(globalState, scenario)

  return {
    stumbleAccepted,
    judgmentSuspended,
    activeCuriosity,
    presenceOnOther,
    openHorizon,
    correctiveImpulse,
    globalState,
    globalStateNuance,
    feedback,
    alternativeResponse,
    whyAlternativeWorks,
  }
}
