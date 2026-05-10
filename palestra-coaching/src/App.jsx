import { useState, useRef, useEffect } from "react";

const CHARACTERS = {
  1: {
    id: 1, name: "Marco Ferretti", age: 41, role: "Responsabile Commerciale",
    context: "PMI manifatturiera, team di 7 persone",
    levelLabel: "Collaborativo", levelNum: 1,
    levelColor: "#5a9c6e", levelBg: "rgba(90,156,110,0.1)",
    teaser: "Viene di sua iniziativa. Ha un tema chiaro. O almeno così sembra.",
    openingMessage: "Ciao! Allora... ecco, io sono qui perché vorrei migliorare come leader. Ho un team di sette persone e sento che qualcosa non funziona. Non so se è un problema mio o loro, forse tutte e due le cose... Comunque, da dove si comincia?",
    systemPrompt: `Sei Marco Ferretti, 41 anni, responsabile commerciale di una PMI manifatturiera. Sei venuto al coaching di tua iniziativa per migliorare come leader del tuo team di sette persone.

PERSONALITÀ E STILE: Sei aperto, disponibile, parli facilmente. Hai una tendenza profonda a cercare conferme e validazione dall'interlocutore. Spesso ti auto-rispondi: poni un problema e poi subito proponi tu stesso una soluzione. Usi frasi come "secondo te faccio bene a…", "pensi che sia giusto…", "ha senso quello che dico?". Tono amichevole, a tratti ansioso.

OBIETTIVO DICHIARATO: Migliorare la leadership con il team.
BISOGNO NASCOSTO: Hai paura di non essere all'altezza del ruolo. Non ti senti ancora un vero leader e cerchi qualcuno che ti dica che stai facendo le cose giuste. Il tema del team è reale, ma è anche uno schermo.

INSIDIE CHE INCARNI NATURALMENTE (inseriscile nel flusso in modo spontaneo):
- Chiedi al coach cosa ne pensa, cosa farebbe lui al tuo posto
- Porti 2-3 problemi insieme invece di stare su uno
- Ti auto-rispondi prima che il coach abbia potuto esplorare
- Hai un momento di auto-critica intensa ("sono proprio un pessimo leader") che invita all'incoraggiamento vuoto
- A un certo punto presenti una decisione già presa chiedendo conferma

COME REAGISCI: domande aperte e ascolto genuino → ti apri e vai in profondità. Consigli o conferme → diventi più dipendente. Coach che parla troppo → ti adatti ma perdi il filo. Domande chiuse o guidate → rispondi brevemente e torni in superficie.

Rispondi sempre in italiano. 2-5 frasi realistiche. Reagisci a quello che il coach ha DAVVERO scritto.`
  },
  2: {
    id: 2, name: "Chiara Monti", age: 47, role: "Titolare d'azienda",
    context: "Ceramiche artigianali, 18 anni di attività",
    levelLabel: "Ambivalente", levelNum: 2,
    levelColor: "#c4903a", levelBg: "rgba(196,144,58,0.1)",
    teaser: "Porta un problema concreto. Ma i problemi concreti non hanno sempre risposte concrete.",
    openingMessage: "Allora. Ho preso questo appuntamento perché mi hanno detto che il coaching serve per queste cose. Io ho un problema concreto: delego e poi finisco sempre a rifare tutto io. Non è che non mi fidi dei miei... però. Ecco. Volevo capire se c'è un metodo.",
    systemPrompt: `Sei Chiara Monti, 47 anni, titolare di una piccola azienda artigianale che produce ceramiche artistiche, fondata 18 anni fa quasi da zero. Sei venuta al coaching perché "devi imparare a delegare".

PERSONALITÀ E STILE: Concreta, pratica, sintetica. Tendi a minimizzare le emozioni — quando ne emerge una, la segui subito con "comunque non è una cosa grave" o "be', vabbè". Ti contraddici senza accorgertene. Cambi argomento quando ti avvicini a qualcosa di doloroso. A volte secca e diretta, a volte vaga.

OBIETTIVO DICHIARATO: Imparare a delegare, smettere di fare tutto da sola.
BISOGNO NASCOSTO: Stai seriamente valutando se vendere o chiudere l'azienda. Non riesci a dirlo perché ti sembra un tradimento verso te stessa e verso chi hai assunto. L'azienda è tua figlia in senso quasi letterale.

INSIDIE CHE INCARNI NATURALMENTE:
- La delega è il sintomo, non il tema. Se il coach la tratta come problema tecnico, rimani in superficie.
- Ti contraddici: "voglio mollare responsabilità" e poi "non mi fido di nessuno come me"
- Porti emozioni significative e le minimizzi subito
- Chiedi un consiglio tecnico-gestionale concreto (come se il coach fosse un consulente)
- Hai un momento di pausa dove sembri sul punto di dire qualcosa di importante — ma non lo dici, a meno che il coach non crei lo spazio giusto

COME REAGISCI: ascolto genuino e domande che notano le contraddizioni → lentamente ti avvicini al tema vero. Trattamento tecnico della delega → rimani in superficie. Domande sul futuro desiderato → crisi costruttiva. Consigli operativi → soddisfatta ma poi chiusa. Coach che ignora le emozioni → le seppellisci.

Non rivelare il bisogno nascosto troppo presto. Solo se il coaching è davvero efficace.

Rispondi in italiano. 2-5 frasi. Reagisci esattamente a quello che il coach ha detto.`
  },
  3: {
    id: 3, name: "Roberto Sanchez", age: 54, role: "Direttore Operativo",
    context: "Azienda manifatturiera, 200 dipendenti",
    levelLabel: "Resistente", levelNum: 3,
    levelColor: "#c45a3a", levelBg: "rgba(196,90,58,0.1)",
    teaser: "Non voleva venire. Non sa cosa vuole. O forse lo sa, e per questo è qui.",
    openingMessage: "Senta, glielo dico subito così non perdiamo tempo. Io non so bene perché sono qui. L'HR mi ha detto che 'potrebbe essermi utile'. Non so cosa vogliono che cambi. Forse che sorrida di più. Quindi — lei cosa propone?",
    systemPrompt: `Sei Roberto Sanchez, 54 anni, direttore operativo di un'azienda manifatturiera con 200 dipendenti. Sei stato "invitato" dall'HR a fare coaching. Non è stata una tua scelta.

PERSONALITÀ E STILE: Diretto, a volte tagliente, molto intelligente. Usi l'ironia come distanza. Testi il coach: vuoi capire se è qualcuno con cui vale la pena stare. Alterni momenti di apertura inaspettata a chiusure brusche. Non mostri le emozioni facilmente — ma quando emergono sono intense.

OBIETTIVO DICHIARATO: Nessuno. "Me l'hanno chiesto loro."
BISOGNO NASCOSTO: Trent'anni in azienda. Hai dato tutto. Adesso senti un vuoto che non riesci a nominare. Non è burnout — è più profondo. Ti stai chiedendo se valeva la pena e se quello che hai costruito è davvero tuo. Hai paura che se ti fermi a pensarci davvero, non ti piacerà quello che trovi.

INSIDIE CHE INCARNI NATURALMENTE:
- Neghi di avere obiettivi e sfidi il coach a "dirti cosa devi volere"
- Attacchi il metodo del coaching ("roba per manager americani degli anni '90")
- A un certo punto chiedi direttamente "ma lei cosa farebbe al mio posto?"
- Hai un momento di apertura vera e poi lo sminuisci subito
- Porti una storia su qualcuno del tuo team con carica emotiva e poi dici "comunque non è questo il punto"
- Cambi argomento quando ti avvicini al vuoto
- Testi i limiti: "lei è pagata per ascoltarmi, no? Allora ascolti."

COME REAGISCI: coach che non si difende → inizi a rispettarlo. Coach che si difende o giustifica → smetti. Consigli → "lo sapevo già", chiusura. Silenzio retto con presenza → qualcosa si muove. Osservazione vera senza giudizio → apertura autentica. Obiettivo forzato → resistenza aumenta.

Rispondi in italiano. 2-6 frasi. Piena coerenza di personaggio. Reagisci precisamente a quello che il coach dice.`
  }
};

const PROMPT_IMMEDIATO = `Sei Renato, supervisore di coaching con certificazione ICF PCC e quindici anni di esperienza nella supervisione di sessioni.

Stai osservando una sessione in corso. Ricevi la trascrizione completa e devi dare feedback formativo sull'ultima risposta del coach.

COME DAI FEEDBACK:
- 2-4 frasi precise e specifiche su quello che il coach ha scritto davvero
- Collega l'osservazione alle competenze ICF quando pertinente: Presenza piena, Ascolto attivo (notare oltre le parole, emozioni, segnali non detti), Domande evocative (aperte, non guidate, non suggestive), Fiducia e sicurezza relazionale, Accordo di sessione, Facilitare la crescita e l'autonomia del coachee
- Tono: caldo, diretto, formativo — da supervisore a professionista in crescita
- Niente "bravo" o "ottimo" generici
- Se c'è una trappola in cui il coach è caduto: nominala chiaramente senza giudicare
- Se qualcosa ha funzionato: di' esattamente perché ha funzionato in questo contesto
- Usa la seconda persona: "Quando hai detto…", "Qui stai…", "In questo passaggio…"

TRAPPOLE POSSIBILI (nomina solo quella rilevante al momento): dare consigli o soluzioni invece di esplorare / domande chiuse o suggestive / parlare troppo o riempire i silenzi / validare senza esplorare / assumere l'obiettivo del coachee / non notare il bisogno sotto le parole / difendersi quando il coachee provoca / passare sopra alle emozioni / due domande in una / razionalizzare al posto del coachee.

Rispondi in italiano. Massimo 4 frasi. Sii chirurgico e specifico.`;

const PROMPT_DEBRIEFING = `Sei Renato, supervisore di coaching con certificazione ICF PCC e quindici anni di esperienza. Hai osservato l'intera sessione. Scrivi un debriefing formativo completo rivolto al coach.

USA QUESTA STRUTTURA ESATTA (titoli in grassetto con **):

**Lettura generale**
Come è andata la sessione nel complesso? Qual è il pattern principale che hai notato nel modo di fare coaching? 3-4 frasi oneste.

**Momenti chiave**
Identifica 3-5 momenti specifici. Per ciascuno: cita le parole reali usate (coach o coachee), di' cosa è successo e perché conta per la crescita del coach. Includi sia momenti efficaci sia momenti critici.

**Competenze ICF**
Elenca le competenze ICF emerse in questa sessione — quelle ben presidiate e quelle da sviluppare. Per ciascuna una frase concreta su come si è manifestata.

**La trappola principale**
Una sola — la più significativa o ricorrente. Spiegala con precisione: cosa l'ha attivata, cosa ha prodotto nella relazione.

**Domande per la riflessione**
3 domande aperte che il coach può portarsi via. Domande che aprono, non che chiudono.

Tono: formativo, onesto, umano. Non elogiativo e non punitivo. Scrivi in italiano. Usa la seconda persona (tu).`;

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong style="color:#f0e6d3;display:block;margin:22px 0 8px;font-size:14px;letter-spacing:0.02em;font-family:\'Playfair Display\',serif;">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n/g, '<br/>');
}

export default function PalestraCoaching() {
  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [feedbackMode, setFeedbackMode] = useState('immediate');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debriefing, setDebriefing] = useState('');
  const [debriefingLoading, setDebriefingLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, debriefing, isLoading]);

  const character = selectedLevel ? CHARACTERS[selectedLevel] : null;
  const coachTurns = messages.filter(m => m.role === 'coach').length;

  const startSession = () => {
    if (!selectedLevel) return;
    setMessages([{ id: 'open', role: 'coachee', content: CHARACTERS[selectedLevel].openingMessage }]);
    setPhase('session');
    setTimeout(() => textareaRef.current?.focus(), 300);
  };

  const buildConvMessages = (msgs) => {
    const result = [{ role: 'user', content: '[Inizio sessione]' }];
    for (const m of msgs) {
      if (m.role === 'coachee') result.push({ role: 'assistant', content: m.content });
      else if (m.role === 'coach') result.push({ role: 'user', content: m.content });
    }
    return result;
  };

  const transcript = (msgs) =>
    msgs.map(m => `${m.role === 'coach' ? 'COACH' : character?.name}: ${m.content}`).join('\n\n');

  const callClaude = async (system, userContent) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: userContent }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || '';
  };

  const callCoachee = async (msgs) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: character.systemPrompt,
        messages: buildConvMessages(msgs)
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || '';
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    setIsLoading(true);
    const coachMsg = { id: Date.now(), role: 'coach', content: text, feedback: null };
    const updated = [...messages, coachMsg];
    setMessages(updated);
    try {
      const [coacheeReply, feedbackReply] = await Promise.all([
        callCoachee(updated),
        feedbackMode === 'immediate'
          ? callClaude(PROMPT_IMMEDIATO, `Trascrizione sessione:\n\n${transcript(updated)}\n\nDai feedback sull'ultima risposta del coach.`)
          : Promise.resolve(null)
      ]);
      setMessages(prev => {
        const next = [...prev];
        const lastCoachIdx = next.map(m => m.role).lastIndexOf('coach');
        if (lastCoachIdx >= 0 && feedbackReply) {
          next[lastCoachIdx] = { ...next[lastCoachIdx], feedback: feedbackReply };
        }
        next.push({ id: Date.now() + 1, role: 'coachee', content: coacheeReply });
        return next;
      });
    } catch {
      setMessages(prev => [...prev, { id: 'err-' + Date.now(), role: 'error', content: 'Errore di connessione. Riprova.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleEndSession = async () => {
    setPhase('debriefing');
    setDebriefingLoading(true);
    try {
      const result = await callClaude(PROMPT_DEBRIEFING, `Trascrizione completa della sessione:\n\n${transcript(messages)}\n\nScrivi il debriefing finale.`);
      setDebriefing(result);
    } catch {
      setDebriefing('Errore nel caricamento del debriefing. Riprova.');
    } finally {
      setDebriefingLoading(false);
    }
  };

  const reset = () => {
    setPhase('setup'); setSelectedLevel(null); setMessages([]);
    setInputValue(''); setDebriefing(''); setFeedbackMode('immediate'); setIsLoading(false);
  };

  const C = {
    bg: '#0e0c0a', surface: '#141210', card: '#1c1914', cardHover: '#221f19',
    border: '#2e2820', borderLight: '#3a3228',
    text: '#f0e6d3', textSec: '#8a7a68', textDim: '#504438',
    accent: '#c4903a', accentDim: 'rgba(196,144,58,0.12)', accentBorder: 'rgba(196,144,58,0.28)',
    feedbackBg: '#131008', feedbackBorder: 'rgba(196,144,58,0.22)',
    coacheeBg: '#191614', coachBg: '#211d16',
  };
  const FD = "'Playfair Display', Georgia, serif";
  const FB = "'DM Sans', system-ui, sans-serif";

  const G = `
    @keyframes blink{0%,80%,100%{opacity:.25;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    textarea:focus{outline:none;border-color:#3a3228 !important;}
    textarea::placeholder{color:#504438;}
    *{box-sizing:border-box;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:#3a3228;border-radius:2px;}
  `;

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FB }}>
      <style>{G}</style>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent }} />
        <span style={{ fontFamily: FD, fontSize: 13, letterSpacing: '0.07em', color: C.textSec }}>PALESTRA COACHING — Noi²</span>
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '52px 24px 80px' }}>
        <div style={{ marginBottom: 50 }}>
          <h1 style={{ fontFamily: FD, fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 14px', lineHeight: 1.25 }}>
            Scegli la tua sessione
          </h1>
          <p style={{ color: C.textSec, fontSize: 14, margin: 0, lineHeight: 1.75 }}>
            Ogni coachee porta un tema, uno stile, alcune insidie distribuite nella sessione.<br />
            Non ti diciamo quali. Scoprile mentre fai coaching.
          </p>
        </div>

        <div style={{ marginBottom: 34 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: C.textDim, textTransform: 'uppercase', marginBottom: 14 }}>01 — Il coachee</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map(lv => {
              const ch = CHARACTERS[lv];
              const sel = selectedLevel === lv;
              return (
                <div key={lv} onClick={() => setSelectedLevel(lv)} style={{
                  border: `1px solid ${sel ? ch.levelColor : C.border}`, borderRadius: 10,
                  padding: '18px 22px', cursor: 'pointer',
                  background: sel ? ch.levelBg : C.card, transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', gap: 18,
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 7, flexShrink: 0,
                    background: `${ch.levelColor}18`, border: `1px solid ${ch.levelColor}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: ch.levelColor, fontFamily: FD, fontSize: 17, fontWeight: 600 }}>{lv}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                      <span style={{ fontFamily: FD, fontSize: 16, color: C.text }}>{ch.name}</span>
                      <span style={{ fontSize: 12, color: C.textSec }}>{ch.age} anni · {ch.role}</span>
                      <span style={{
                        marginLeft: 'auto', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: ch.levelColor, background: `${ch.levelColor}15`,
                        padding: '2px 8px', borderRadius: 3, border: `1px solid ${ch.levelColor}28`, flexShrink: 0,
                      }}>{ch.levelLabel}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.textSec, fontStyle: 'italic' }}>"{ch.teaser}"</div>
                  </div>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${sel ? ch.levelColor : C.borderLight}`,
                    background: sel ? ch.levelColor : 'transparent', transition: 'all 0.18s',
                  }} />
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 34 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: C.textDim, textTransform: 'uppercase', marginBottom: 14 }}>02 — Modalità feedback</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { value: 'immediate', label: 'Feedback immediato', desc: 'Renato commenta dopo ogni tua risposta' },
              { value: 'final', label: 'Solo al debriefing', desc: 'Vivi la sessione intera, poi ricevi tutto' },
            ].map(opt => {
              const active = feedbackMode === opt.value;
              return (
                <div key={opt.value} onClick={() => setFeedbackMode(opt.value)} style={{
                  flex: 1, border: `1px solid ${active ? C.accent : C.border}`, borderRadius: 10,
                  padding: '15px 18px', cursor: 'pointer',
                  background: active ? C.accentDim : C.card, transition: 'all 0.18s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{
                      width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${active ? C.accent : C.borderLight}`,
                      background: active ? C.accent : 'transparent', transition: 'all 0.18s',
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: active ? C.text : C.textSec }}>{opt.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textSec, paddingLeft: 21 }}>{opt.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={startSession} disabled={!selectedLevel} style={{
          width: '100%', padding: '15px',
          background: selectedLevel ? C.accent : C.card,
          border: `1px solid ${selectedLevel ? C.accent : C.border}`,
          borderRadius: 10, color: selectedLevel ? '#0e0c0a' : C.textDim,
          fontSize: 14, fontWeight: 600, fontFamily: FB,
          cursor: selectedLevel ? 'pointer' : 'not-allowed', transition: 'all 0.18s', letterSpacing: '0.02em',
        }}>
          {selectedLevel ? `Inizia la sessione con ${CHARACTERS[selectedLevel].name} →` : 'Seleziona un coachee per continuare'}
        </button>
      </div>
    </div>
  );

  // ── DEBRIEFING ─────────────────────────────────────────────────────────────
  if (phase === 'debriefing') return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FB }}>
      <style>{G}</style>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '15px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent }} />
          <span style={{ fontFamily: FD, fontSize: 13, letterSpacing: '0.07em', color: C.textSec }}>DEBRIEFING — {character?.name}</span>
        </div>
        <button onClick={reset} style={{ fontSize: 12, color: C.textSec, background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 13px', cursor: 'pointer', fontFamily: FB }}>
          Nuova sessione
        </button>
      </div>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '44px 24px 80px' }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: character?.levelBg, border: `1px solid ${character?.levelColor}28`,
            borderRadius: 5, padding: '3px 11px', marginBottom: 14,
          }}>
            <span style={{ color: character?.levelColor, fontSize: 8 }}>●</span>
            <span style={{ color: character?.levelColor, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{character?.levelLabel}</span>
          </div>
          <h1 style={{ fontFamily: FD, fontSize: 24, fontWeight: 400, margin: '0 0 5px', color: C.text }}>Sessione con {character?.name}</h1>
          <p style={{ color: C.textSec, fontSize: 13, margin: 0 }}>
            {coachTurns} {coachTurns === 1 ? 'intervento' : 'interventi'} da coach · {messages.length} scambi totali
          </p>
        </div>
        {debriefingLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ color: C.textSec, fontSize: 14, marginBottom: 8 }}>Renato sta leggendo l'intera sessione…</div>
            <div style={{ color: C.textDim, fontSize: 12 }}>può richiedere qualche secondo</div>
          </div>
        ) : (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '32px 36px',
            fontSize: 14, lineHeight: 1.8, color: C.textSec,
            animation: 'fadeIn 0.4s ease',
          }} dangerouslySetInnerHTML={{ __html: renderMarkdown(debriefing) }} />
        )}
      </div>
    </div>
  );

  // ── SESSIONE ───────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, color: C.text, fontFamily: FB }}>
      <style>{G}</style>

      {/* Topbar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '11px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: character?.levelBg, border: `1px solid ${character?.levelColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: character?.levelColor, fontFamily: FD, fontSize: 13, fontWeight: 600 }}>{character?.levelNum}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FD, lineHeight: 1.2 }}>{character?.name}</div>
              <div style={{ fontSize: 10, color: C.textSec }}>{character?.role} · {character?.context}</div>
            </div>
          </div>
          <div style={{ width: 1, height: 20, background: C.border }} />
          <div style={{ fontSize: 11, color: C.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: feedbackMode === 'immediate' ? C.accent : C.textDim, display: 'inline-block' }} />
            {feedbackMode === 'immediate' ? 'Feedback immediato' : 'Feedback a fine sessione'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>{coachTurns} {coachTurns === 1 ? 'turno' : 'turni'}</span>
          {coachTurns >= 4 && (
            <button onClick={handleEndSession} style={{ fontSize: 12, color: C.accent, background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: 6, padding: '5px 13px', cursor: 'pointer', fontFamily: FB }}>
              Fine sessione →
            </button>
          )}
          <button onClick={reset} style={{ fontSize: 12, color: C.textSec, background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 13px', cursor: 'pointer', fontFamily: FB }}>✕</button>
        </div>
      </div>

      {/* Messaggi */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {messages.map((msg, idx) => {
            if (msg.role === 'coachee') return (
              <div key={msg.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '84%', animation: 'fadeIn 0.25s ease' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 18, background: character?.levelBg, border: `1px solid ${character?.levelColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, color: character?.levelColor, fontWeight: 700 }}>{character?.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, marginLeft: 1 }}>{character?.name}</div>
                  <div style={{ background: C.coacheeBg, border: `1px solid ${C.border}`, borderRadius: '3px 12px 12px 12px', padding: '11px 15px', fontSize: 14, lineHeight: 1.7, color: C.text }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
            if (msg.role === 'coach') return (
              <div key={msg.id || idx} style={{ alignSelf: 'flex-end', maxWidth: '84%', animation: 'fadeIn 0.25s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, textAlign: 'right', marginRight: 1 }}>tu (coach)</div>
                    <div style={{ background: C.coachBg, border: `1px solid ${C.borderLight}`, borderRadius: '12px 3px 12px 12px', padding: '11px 15px', fontSize: 14, lineHeight: 1.7, color: C.text }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
                {msg.feedback && (
                  <div style={{ background: C.feedbackBg, border: `1px solid ${C.feedbackBorder}`, borderRadius: 8, padding: '11px 15px', marginTop: 6, animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                      <span style={{ color: C.accent, fontSize: 8 }}>◆</span>
                      <span style={{ fontSize: 9, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Renato · supervisore ICF</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#d4b27a', lineHeight: 1.7 }}>{msg.feedback}</div>
                  </div>
                )}
              </div>
            );
            if (msg.role === 'error') return (
              <div key={msg.id || idx} style={{ textAlign: 'center', fontSize: 12, color: '#c45a3a', padding: '6px 0' }}>{msg.content}</div>
            );
            return null;
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '84%', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 18, background: character?.levelBg, border: `1px solid ${character?.levelColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: character?.levelColor, fontWeight: 700 }}>{character?.name[0]}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, marginLeft: 1 }}>{character?.name}</div>
                <div style={{ background: C.coacheeBg, border: `1px solid ${C.border}`, borderRadius: '3px 12px 12px 12px', padding: '13px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.textSec, animation: `blink 1.3s ease-in-out ${i * 0.22}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 20px', flexShrink: 0, background: C.surface }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Scrivi la tua risposta da coach… (Invio per inviare · Shift+Invio per andare a capo)"
            rows={2}
            disabled={isLoading}
            style={{ flex: 1, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 8, color: C.text, fontFamily: FB, fontSize: 14, padding: '11px 15px', resize: 'none', lineHeight: 1.55 }}
          />
          <button onClick={handleSend} disabled={isLoading || !inputValue.trim()} style={{
            padding: '11px 18px',
            background: inputValue.trim() && !isLoading ? C.accent : C.card,
            border: `1px solid ${inputValue.trim() && !isLoading ? C.accent : C.border}`,
            borderRadius: 8, color: inputValue.trim() && !isLoading ? '#0e0c0a' : C.textDim,
            fontSize: 17, cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.18s', lineHeight: 1, flexShrink: 0,
          }}>→</button>
        </div>
        <div style={{ maxWidth: 640, margin: '5px auto 0', fontSize: 10, color: C.textDim, textAlign: 'right' }}>
          {coachTurns < 4
            ? `"Fine sessione" disponibile tra ${4 - coachTurns} ${4 - coachTurns === 1 ? 'turno' : 'turni'}`
            : 'Puoi concludere la sessione quando sei pronto'}
        </div>
      </div>
    </div>
  );
}
