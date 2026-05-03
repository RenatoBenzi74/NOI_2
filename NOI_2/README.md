# Noi² — Allenatore di Ascolto Partecipativo

> "L'ascolto non si interrompe quando l'altro smette di parlare.
> Si interrompe quando tu smetti di essere curioso."

Una palestra relazionale digitale basata sul **Metodo delle Competenze Risonanti (MCR)**.

---

## Cos'è

Noi² Allenatore di Ascolto Partecipativo è una **PWA mobile-first** che aiuta chiunque lavori con le persone a osservare il proprio modo di ascoltare.

Non ti insegna la risposta giusta.
Ti aiuta ad accorgerti di quando hai smesso di ascoltare.

### Come funziona

1. Scegli un contesto relazionale (lavoro, famiglia, amicizie, coppia, gruppi, vendita)
2. Ricevi uno scenario realistico con una frase difficile
3. Rispondi come faresti davvero
4. L'app analizza la tua risposta con il cruscotto Noi²
5. Ricevi un feedback testuale preciso e una risposta partecipativa alternativa
6. Rifletti sull'inciampo e salva l'esperienza

---

## Installazione e sviluppo locale

### Prerequisiti

- Node.js 18+
- npm 9+

### Setup

```bash
# Clona o naviga nella cartella del progetto
cd noi2-ascolto

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:3000`

> Nota: in development, la PWA è disabilitata per evitare conflitti con il service worker.
> Usa `npm run build && npm start` per testare la PWA completa.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Deploy su Vercel

### Metodo 1 — Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Metodo 2 — Deploy via GitHub

1. Pusha il progetto su GitHub
2. Vai su [vercel.com](https://vercel.com) e importa il repository
3. Framework preset: **Next.js** (rilevato automaticamente)
4. Deploy → done

### Configurazione Vercel

Nessuna variabile d'ambiente richiesta per la versione base.

---

## Verifica PWA

### Chrome DevTools

1. Apri l'app in produzione (Vercel URL)
2. DevTools → Application → Service Workers → verifica che sia registrato
3. DevTools → Application → Manifest → verifica i dati
4. Lighthouse → PWA audit → punteggio target: ≥ 90

### Installazione su iPhone

1. Apri l'URL in Safari
2. Tocca l'icona "Condividi"
3. "Aggiungi a schermata Home"
4. L'app si apre in modalità standalone

### Installazione su Android

1. Apri l'URL in Chrome
2. Banner automatico di installazione, oppure
3. Menu Chrome → "Aggiungi a schermata Home"

---

## Architettura

```
/app
  layout.tsx         # Layout globale, metadata PWA, font
  page.tsx           # Orchestratore principale (state + routing)
  globals.css        # Design system, variabili CSS, componenti base

/components
  AppShell.tsx            # Layout wrapper con background orbs
  HomeScreen.tsx          # Schermata iniziale
  ContextSelector.tsx     # Selezione contesto relazionale
  ScenarioCard.tsx        # Visualizzazione scenario
  ResponseInput.tsx       # Input risposta utente
  ListeningDashboard.tsx  # Cruscotto Noi² con aura e indicatori
  ListeningAura.tsx       # Visual centrale animato (stato ascolto)
  IndicatorBar.tsx        # Singolo indicatore con barra animata
  FeedbackPanel.tsx       # Feedback testuale in 4 blocchi
  AlternativeResponse.tsx # Risposta partecipativa alternativa
  ReflectionForm.tsx      # Micro-riflessione finale
  SummaryScreen.tsx       # Riepilogo completo
  HistoryView.tsx         # Storico esperienze

/lib
  types.ts                # Tutti i tipi TypeScript
  scenarios.ts            # Libreria 48 scenari + info contesti
  generateScenario.ts     # Selezione scenario (pronto per AI)
  analyzeListeningResponse.ts  # Motore analisi euristico
  storage.ts              # Utility localStorage (pronto per Supabase)

/public
  manifest.json           # PWA manifest
  icons/                  # Icone app (192×192, 512×512)
```

---

## Il Metodo — Cruscotto Noi²

### 6 Indicatori

| Indicatore | Cosa misura | Direzione |
|---|---|---|
| **Inciampo accolto** | Ti sei lasciato spiazzare? | ↑ positivo |
| **Giudizio sospeso** | Hai evitato di classificare l'altro? | ↑ positivo |
| **Curiosità attiva** | Stai esplorando o rispondendo? | ↑ positivo |
| **Presenza sull'altro** | Sei sull'altro o su di te? | ↑ positivo |
| **Orizzonte aperto** | Allarghi o indirizzi? | ↑ positivo |
| **Impulso a correggere** | Stai aggiustando troppo presto? | ↓ positivo |

### 4 Stati dell'Ascolto

```
Difesa → Risposta → Curiosità → Presenza
```

- **Difesa**: Stai proteggendo la tua posizione più che esplorando quella dell'altro
- **Risposta**: Stai reagendo al contenuto, ma non ancora al vissuto
- **Curiosità**: Stai iniziando a esplorare il mondo dell'altro
- **Presenza**: Stai facendo spazio all'altro senza sparire tu

---

## Scenari — Libreria

48 scenari distribuiti in 6 contesti:

| Contesto | Scenari | Temi principali |
|---|---|---|
| Lavoro | 8 | Esclusione, sfiducia, riconoscimento, conflitto |
| Famiglia | 8 | Copioni, aspettative, distanza emotiva |
| Amicizie | 8 | Delusione, distanza, bisogno mascherato |
| Coppia | 8 | Ascolto mancato, rancori, incomprensioni |
| Gruppi | 8 | Appartenenza, leadership, partecipazione |
| Vendita / Cliente | 8 | Sfiducia, obiezioni, bisogno nascosto |

Ogni scenario appartiene a un **archetipo relazionale** (10 archetipi):
Sfiducia · Accusa indiretta · Delusione · Chiusura · Bisogno nascosto ·
Conflitto di prospettiva · Richiesta mascherata · Resistenza · Silenzio significativo · Frase spiazzante

---

## Tecnologie

- **Next.js 14** con App Router
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **next-pwa** per installabilità PWA
- **localStorage** per salvataggio esperienze

---

## Note sulle migliorie introdotte

Rispetto alle specifiche originali, il team ha introdotto:

1. **Background orbs animati** con keyframe indipendenti per dare profondità e movimento alla UI
2. **Fine grain texture overlay** per calore visivo
3. **Glassmorphism stratificato** — tre livelli (glass-card, glass-card-strong, inline) per gerarchie visive chiare
4. **Nuance testuale dello stato globale** — oltre allo stato binario, l'analisi restituisce una sfumatura più precisa (es. "Risposta gentile ma chiudente")
5. **Comparison toggle** in AlternativeResponse — l'utente può confrontare direttamente la propria risposta con quella partecipativa
6. **Reflection prompts cliccabili** — quattro domande guida usabili come incipit per la riflessione
7. **Word count progressivo** nel campo risposta, con feedback in tempo reale
8. **Contatore giornaliero** nella Home — "Oggi hai fatto X allenamenti"
9. **Stagger animation** sugli indicatori del cruscotto — appaiono in sequenza per un effetto rivelativo
10. **Dati scenario nascosti nella UI** (hiddenTension, possibleTrap, listeningOpportunity) — visibili solo nel feedback, coerente con la filosofia dell'inciampo

---

## Roadmap — Evoluzione futura

### Fase 2 — Autenticazione e cloud

```
Supabase Auth → login con email / Google / Apple
Supabase Database → salvataggio esperienze nel cloud
Dashboard personale → storico completo, trend nel tempo
Multi-device sync → le esperienze seguono l'utente
```

### Fase 3 — AI reale

```
API Claude / OpenAI per:
  - generazione scenari dinamici e contestualizzati
  - analisi linguistica profonda della risposta
  - feedback personalizzato sul singolo pattern
  - suggerimento di percorso di allenamento
```

### Fase 4 — Percorsi progressivi

```
Livelli di competenza (Esploratore → Praticante → Risonante)
Sequenze tematiche (es. "7 giorni di ascolto nel lavoro")
Badge non competitivi basati sulla costanza
```

### Fase 5 — Premium e CRM

```
Stripe per accesso a contesti e percorsi avanzati
Email flows con riflessioni periodiche
Export PDF delle proprie esperienze di allenamento
API per integrazioni con piattaforme LMS
```

### Fase 6 — Versioni verticali

```
Noi² per HR e Manager
Noi² per Vendita
Noi² per Terapisti e Coach
Noi² per Insegnanti
Noi² per Mediatori
```

---

## Struttura dati localStorage

Ogni esperienza salvata ha questa struttura:

```typescript
{
  id: string                    // "exp_1234567890_abc123def"
  timestamp: number             // Unix timestamp
  context: Context              // "lavoro" | "famiglia" | ...
  scenario: Scenario            // Oggetto scenario completo
  userResponse: string          // Risposta testuale dell'utente
  analysis: AnalysisResult      // 6 indicatori + stato + feedback
  reflection: string            // Riflessione libera dell'utente
}
```

---

## Contribuire

Questo progetto è il primo prototipo del sistema Noi².
Per contribuire con nuovi scenari, feedback sul metodo o segnalazioni tecniche,
contatta il team attraverso i canali ufficiali del progetto.

---

*Noi² – Metodo delle Competenze Risonanti*
*"Non ti insegniamo a rispondere meglio. Ti aiutiamo ad accorgerti di quando hai smesso di ascoltare."*
