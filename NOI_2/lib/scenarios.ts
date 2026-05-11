// ============================================================
// NOI² – Libreria Scenari Relazionali
// 48 scenari distribuiti in 6 contesti (8 per contesto)
// Ogni scenario appartiene a un archetipo relazionale
// ============================================================

import { Archetype, Scenario } from './types'

export const scenarios: Scenario[] = [

  // ============================================================
  // LAVORO (8 scenari)
  // ============================================================

  {
    id: 'lavoro_01',
    context: 'lavoro',
    archetype: 'sfiducia',
    title: 'La riunione inutile',
    setup: 'Durante una riunione di progetto, una collega che di solito partecipa poco si lascia sfuggire una frase a bassa voce.',
    quote: 'Tanto qui decidono sempre gli stessi. A cosa serve che io dica la mia?',
    hiddenTension: 'Senso di esclusione e sfiducia nella possibilità di incidere davvero sul gruppo',
    possibleTrap: 'Rassicurare, spiegare che non è vero, difendere il gruppo o riportare subito al compito',
    listeningOpportunity: 'Esplorare quando e come la persona ha percepito di non avere spazio reale',
  },

  {
    id: 'lavoro_02',
    context: 'lavoro',
    archetype: 'richiesta_mascherata',
    title: 'Me la cavo sempre da solo',
    setup: 'Un collega con cui lavori spesso, in pausa caffè, dice quasi senza guardarti.',
    quote: 'Alla fine mi arrangio sempre da solo. Non ha senso aspettarsi supporto dagli altri.',
    hiddenTension: 'Bisogno di riconoscimento e stanchezza da un supporto percepito come assente',
    possibleTrap: 'Difendersi, giustificarsi, elencare le volte in cui si è aiutato',
    listeningOpportunity: 'Esplorare cosa si aspettava e in quale momento si è sentito lasciato solo',
  },

  {
    id: 'lavoro_03',
    context: 'lavoro',
    archetype: 'accusa_indiretta',
    title: 'Le priorità degli altri',
    setup: 'Stai discutendo con un collega di una scadenza slittata. A un certo punto lui dice.',
    quote: 'Vabbè, tanto tu queste cose le capisci sempre dopo. Quando ormai il danno è fatto.',
    hiddenTension: 'Frustrazione accumulata e sensazione che il proprio lavoro non sia valorizzato o considerato',
    possibleTrap: 'Difendersi spiegando le proprie ragioni, contrattaccare, razionalizzare',
    listeningOpportunity: 'Esplorare cosa è successo davvero e perché si sente non considerato',
  },

  {
    id: 'lavoro_04',
    context: 'lavoro',
    archetype: 'bisogno_nascosto',
    title: 'Non è per quella riunione',
    setup: "Un'amica al lavoro viene da te dopo una discussione in team. Dice che si è stufata della riunione, ma qualcosa nella sua voce è diverso.",
    quote: 'Non è per quella riunione. È che ogni volta succede uguale. Ogni. Volta.',
    hiddenTension: 'Senso di invisibilità ricorrente, fatica che si accumula senza essere vista',
    possibleTrap: 'Analizzare il problema pratico, dare soluzioni, normalizzare dicendo che è normale',
    listeningOpportunity: 'Esplorare cosa significa quel "ogni volta", cosa porta dentro di sé',
  },

  {
    id: 'lavoro_05',
    context: 'lavoro',
    archetype: 'resistenza',
    title: 'Funzionava già prima',
    setup: 'Stai presentando una nuova procedura al team. Un collega esperto, dopo averti ascoltato in silenzio, risponde.',
    quote: 'Non vedo perché dovremmo cambiare. Funzionava già prima. Queste novità creano solo confusione.',
    hiddenTension: 'Paura di perdere competenza, identità o controllo in un cambiamento non scelto',
    possibleTrap: 'Spiegare perché il nuovo metodo è meglio, convincere con dati, sminuire le obiezioni',
    listeningOpportunity: 'Esplorare cosa teme di perdere nel cambiamento e cosa valeva per lui del vecchio modo',
  },

  {
    id: 'lavoro_06',
    context: 'lavoro',
    archetype: 'delusione',
    title: 'Pensavo fossi diverso',
    setup: 'Hai dovuto comunicare a un collaboratore che il progetto su cui lavorava è stato bloccato dalla direzione. Dopo un momento di silenzio lui dice.',
    quote: "Pensavo che almeno tu ti fossi battuto per questo. Forse mi aspettavo troppo.",
    hiddenTension: 'Delusione verso una figura di riferimento che si credeva alleata',
    possibleTrap: 'Giustificarsi spiegando i vincoli, minimizzare la sua delusione, passare subito alle soluzioni',
    listeningOpportunity: 'Riconoscere il peso di quella aspettativa e esplorare cosa rappresentava per lui quel progetto',
  },

  {
    id: 'lavoro_07',
    context: 'lavoro',
    archetype: 'silenzio_significativo',
    title: 'Fate voi',
    setup: 'In una riunione lunga e faticosa, stai chiedendo al gruppo di decidere su un punto importante. Una persona del team, solitamente propositiva, risponde.',
    quote: 'Va bene. Fate voi. Tanto avete già deciso.',
    hiddenTension: 'Disinvestimento, sensazione che la propria voce non cambi nulla',
    possibleTrap: 'Ignorare il sottotesto, procedere con la riunione, chiedere conferma formale',
    listeningOpportunity: 'Fermarsi sul "già deciso" e esplorare quando ha avuto questa sensazione',
  },

  {
    id: 'lavoro_08',
    context: 'lavoro',
    archetype: 'frase_spiazzante',
    title: 'Stai ascoltando?',
    setup: 'Stai in una conversazione intensa con un collega. A un certo punto si ferma e ti guarda.',
    quote: 'Con te non so mai se sto parlando davvero o se sto solo aspettando il mio turno.',
    hiddenTension: 'Bisogno di essere ascoltato davvero, non solo sentito',
    possibleTrap: 'Difendersi dicendo che stava ascoltando, razionalizzare, risentirsi',
    listeningOpportunity: 'Raccogliere quella frase come un invito a capire dove si è persa la connessione',
  },

  // ============================================================
  // FAMIGLIA (8 scenari)
  // ============================================================

  {
    id: 'famiglia_01',
    context: 'famiglia',
    archetype: 'chiusura',
    title: 'Lascia stare',
    setup: "Tuo figlio adolescente torna a casa visibilmente giù. Provi ad aprire la conversazione. Dopo un po' risponde.",
    quote: 'Lascia stare. Non importa. Tanto non capiresti.',
    hiddenTension: 'Bisogno di connessione nascosto dietro la chiusura, timore del giudizio',
    possibleTrap: 'Insistere, rassicurare che capirebbe, offendersi, spiegare quanto ci tiene',
    listeningOpportunity: 'Stare nella porta aperta senza forzarla, riconoscere la distanza senza ampliarla',
  },

  {
    id: 'famiglia_02',
    context: 'famiglia',
    archetype: 'accusa_indiretta',
    title: 'Come sempre',
    setup: 'Sei in cucina con tua sorella. State parlando di un problema della famiglia. A un certo punto dice.',
    quote: 'Come al solito tocca a me pensarci. Voi fate finta di niente e io rimango a gestire tutto.',
    hiddenTension: 'Stanchezza da carico non riconosciuto, bisogno di essere visto in quello che porta',
    possibleTrap: 'Difendersi, elencare le proprie responsabilità, smontare la sua percezione',
    listeningOpportunity: 'Riconoscere quanto pesa quel carico prima di qualsiasi altra cosa',
  },

  {
    id: 'famiglia_03',
    context: 'famiglia',
    archetype: 'bisogno_nascosto',
    title: 'Non ti serve niente',
    setup: 'Tua madre ti chiama e parla di cose di casa per venti minuti. Alla fine, quasi come un inciso, dice.',
    quote: 'No, non ti serve niente da me. Ce la fate benissimo da soli.',
    hiddenTension: 'Senso di essere diventata superflua, bisogno di sentirsi ancora necessaria',
    possibleTrap: 'Rassicurarla rapidamente dicendo che non è vero, passare ad altro, non cogliere il sottotesto',
    listeningOpportunity: 'Esplorare cosa sta vivendo in quel momento nella sua vita, cosa le manca davvero',
  },

  {
    id: 'famiglia_04',
    context: 'famiglia',
    archetype: 'conflitto_prospettiva',
    title: 'Due famiglie diverse',
    setup: 'Stai discutendo con il tuo partner di come gestire le feste con le rispettive famiglie. La tensione è alta.',
    quote: 'Per te la famiglia viene sempre prima. Per me invece viene prima noi. Non è mai uguale.',
    hiddenTension: 'Senso che la coppia venga messa sempre in secondo piano rispetto alle famiglie di origine',
    possibleTrap: 'Difendere la propria famiglia, spiegare che non è giusto come la vede, discutere dei fatti',
    listeningOpportunity: 'Esplorare cosa vuol dire "noi" per il partner e quando ha avuto la sensazione che venisse dopo',
  },

  {
    id: 'famiglia_05',
    context: 'famiglia',
    archetype: 'delusione',
    title: 'Non eri così',
    setup: 'Tuo padre, in un momento di confronto raro, dice qualcosa di inaspettato.',
    quote: 'Una volta parlavi con me di tutto. Adesso sembra che ci sia un muro.',
    hiddenTension: 'Nostalgia di una relazione che sente perduta, paura di non essere più vicini',
    possibleTrap: 'Spiegare perché è cambiato, giustificare la distanza con il lavoro o il tempo',
    listeningOpportunity: 'Stare in quella sensazione con lui senza spiegarla via, esplorare quando è cominciata',
  },

  {
    id: 'famiglia_06',
    context: 'famiglia',
    archetype: 'sfiducia',
    title: 'Non cambierà niente',
    setup: 'Stai cercando di parlare con tuo fratello di un problema ricorrente in famiglia. Lui ti interrompe.',
    quote: 'Inutile parlarne. Non cambierà niente come sempre. Questa famiglia è fatta così.',
    hiddenTension: 'Stanchezza da tentativi falliti, rassegnazione come protezione dalla delusione',
    possibleTrap: 'Contraddirlo, convincerlo che questa volta sarà diverso, elencare argomenti',
    listeningOpportunity: 'Esplorare quante volte si è aspettato un cambiamento che non è arrivato',
  },

  {
    id: 'famiglia_07',
    context: 'famiglia',
    archetype: 'richiesta_mascherata',
    title: 'Voi non avete bisogno',
    setup: 'Sei in visita dai tuoi genitori anziani. Tua madre, mentre prepara il caffè, dice quasi tra sé.',
    quote: 'Non è che avete bisogno di venire così spesso. Siamo in gamba anche da soli.',
    hiddenTension: 'Solitudine e bisogno di presenza mascherati da autonomia',
    possibleTrap: 'Prendere la frase alla lettera, rassicurarla che stanno bene, parlare di logistica',
    listeningOpportunity: 'Cogliere cosa c\'è sotto quella dichiarazione di autonomia e stare in quel spazio',
  },

  {
    id: 'famiglia_08',
    context: 'famiglia',
    archetype: 'frase_spiazzante',
    title: 'Quando ci sei davvero',
    setup: "Tuo figlio, con una franchezza disarmante, ti dice qualcosa mentre state guardando la TV insieme.",
    quote: 'Papà, tu ci sei sempre, ma a volte sembra che tu sia altrove. Come se pensassi ad altro.',
    hiddenTension: 'Bisogno di presenza piena, non solo fisica',
    possibleTrap: 'Difendersi, spiegare quanto si lavora, sentirsi attaccato',
    listeningOpportunity: 'Riconoscere quella osservazione come un dono e chiedergli di più',
  },

  // ============================================================
  // AMICIZIE (8 scenari)
  // ============================================================

  {
    id: 'amicizie_01',
    context: 'amicizie',
    archetype: 'delusione',
    title: 'Ti aspettavo',
    setup: 'Un amico con cui non ti senti da un po\' ti scrive. Non per aggiornarsi, ma con questa frase.',
    quote: 'Pensavo fossi diverso. Credevo che almeno tu ti facessi vivo.',
    hiddenTension: 'Delusione da assenza percepita, bisogno di sentirsi importante per l\'amico',
    possibleTrap: 'Giustificarsi con gli impegni, spiegare perché non ha scritto, ribaltare la questione',
    listeningOpportunity: 'Riconoscere il peso di quella attesa senza difendersi',
  },

  {
    id: 'amicizie_02',
    context: 'amicizie',
    archetype: 'chiusura',
    title: 'Non ha importanza',
    setup: "Sei con un'amica a cena. Provi a chiederle come sta davvero. Dopo un attimo di silenzio dice.",
    quote: 'Sto bene. Non ha importanza. Parliamo d\'altro.',
    hiddenTension: 'Dolore nascosto che non si sente abbastanza al sicuro per uscire',
    possibleTrap: 'Rispettare troppo presto il confine senza lasciare uno spazio aperto',
    listeningOpportunity: 'Stare vicino senza insistere, lasciare una porta aperta senza forzarla',
  },

  {
    id: 'amicizie_03',
    context: 'amicizie',
    archetype: 'bisogno_nascosto',
    title: 'Sto bene, dai',
    setup: 'Un amico che sta attraversando un periodo difficile (lavoro, relazione) risponde alle tue domande sempre in modo dismissivo. Oggi però aggiunge.',
    quote: 'Sto bene. Dai, a te non interessa veramente come sto. Lo chiedi per abitudine.',
    hiddenTension: 'Solitudine profonda, sensazione che nessuno sia davvero presente',
    possibleTrap: 'Sentirsi offesi, difendersi, dimostrare che si è interessati elencando le volte passate',
    listeningOpportunity: 'Riconoscere quella accusa come un grido mascherato e restare in ascolto',
  },

  {
    id: 'amicizie_04',
    context: 'amicizie',
    archetype: 'conflitto_prospettiva',
    title: 'Punti di vista',
    setup: 'State discutendo di una situazione che ha coinvolto entrambi — un malinteso con un amico comune. A un certo punto lui dice.',
    quote: 'Per te era una cosa di poco conto. Per me invece è stata una ferita vera.',
    hiddenTension: 'Sensazione che la propria sofferenza sia stata sminuita o non vista',
    possibleTrap: 'Spiegare che non era sua intenzione, minimizzare, razionalizzare cosa è successo',
    listeningOpportunity: 'Accogliere quella differenza di vissuto senza negarla, esplorare cosa ha ferito davvero',
  },

  {
    id: 'amicizie_05',
    context: 'amicizie',
    archetype: 'accusa_indiretta',
    title: 'Sei cambiato',
    setup: "Un vecchio amico che vedi meno spesso, nel mezzo di una serata normale, ti dice con un sorriso ambiguo.",
    quote: 'Sei cambiato, sai. Non so se in meglio o in peggio. Ma sei diverso.',
    hiddenTension: 'Nostalgia dell\'amicizia passata, possibile senso di abbandono o distanza',
    possibleTrap: 'Difendersi spiegando i propri cambiamenti, chiudersi, rispondere con ironia',
    listeningOpportunity: 'Esplorare cosa sente cambiato in lui, cosa stava bene prima e cosa manca ora',
  },

  {
    id: 'amicizie_06',
    context: 'amicizie',
    archetype: 'sfiducia',
    title: 'Tanto poi passi ad altro',
    setup: "Stai cercando di supportare un'amica in un momento difficile. Lei ti ascolta, poi dice.",
    quote: 'Grazie. Ma tanto poi passi ad altro. Tutti lo fanno alla fine.',
    hiddenTension: 'Ferita da abbandoni passati che ora proietta sul presente',
    possibleTrap: 'Prometterle che non succederà, difendersi, insistere sul proprio interesse',
    listeningOpportunity: 'Esplorare da dove viene quella aspettativa di abbandono, cosa ha vissuto prima',
  },

  {
    id: 'amicizie_07',
    context: 'amicizie',
    archetype: 'silenzio_significativo',
    title: 'Sì, certo',
    setup: 'Hai organizzato qualcosa con un gruppo di amici. Uno di loro, quando lo informi, risponde in modo piatto.',
    quote: 'Sì, certo. Vengo se posso. Non so ancora.',
    hiddenTension: 'Possibile distanza, senso di esclusione pregressa, o semplice disinvestimento nel gruppo',
    possibleTrap: 'Ignorare il tono, prendere la risposta alla lettera, procedere senza fermarsi',
    listeningOpportunity: 'Cogliere il non detto e aprire uno spazio per parlare davvero',
  },

  {
    id: 'amicizie_08',
    context: 'amicizie',
    archetype: 'richiesta_mascherata',
    title: 'Non voglio disturbare',
    setup: 'Un amico che sa che stai attraversando un periodo intenso ti scrive di punto in bianco.',
    quote: 'Niente, non volevo disturbarti. Stai bene tu? Poi se hai tempo parliamo.',
    hiddenTension: 'Bisogno di connessione e presenza mascherato da considerazione per l\'altro',
    possibleTrap: 'Rispondere con un messaggio veloce e rimandare, prendere la frase alla lettera',
    listeningOpportunity: 'Cogliere che non stava scrivendo per te, stava cercando te',
  },

  // ============================================================
  // COPPIA (8 scenari)
  // ============================================================

  {
    id: 'coppia_01',
    context: 'coppia',
    archetype: 'richiesta_mascherata',
    title: 'Non voglio niente',
    setup: 'Dopo una giornata pesante, il tuo partner risponde a monosillabi. Quando chiedi cosa vuole per cena, dice.',
    quote: 'Non voglio niente. Fai tu. Non mi importa.',
    hiddenTension: 'Bisogno di essere visto e di presenza, non di cibo',
    possibleTrap: 'Rispondere al contenuto letterale, decidere per conto proprio, ignorare il tono',
    listeningOpportunity: 'Riconoscere che dietro "non voglio niente" c\'è qualcosa che chiede attenzione',
  },

  {
    id: 'coppia_02',
    context: 'coppia',
    archetype: 'accusa_indiretta',
    title: 'Quanto ti conosco',
    setup: 'Stai raccontando al tuo partner una scelta che hai fatto. Lui o lei ti ascolta, poi dice.',
    quote: 'Sì, certo. Tanto fai sempre quello che vuoi. Non è la prima volta.',
    hiddenTension: 'Frustrazione accumulata per sentirsi escluso o non considerato nelle scelte',
    possibleTrap: 'Difendersi, elencare le volte in cui lo si è coinvolto, far diventare una discussione',
    listeningOpportunity: 'Esplorare quando ha avuto questa sensazione e cosa significa per lui/lei',
  },

  {
    id: 'coppia_03',
    context: 'coppia',
    archetype: 'delusione',
    title: 'Pensavo mi capisse',
    setup: "Avete appena avuto una discussione e stai cercando di fare pace. Il tuo partner dice con voce stanca.",
    quote: 'Pensavo che dopo tutti questi anni mi capissi davvero. A volte mi sembra di no.',
    hiddenTension: 'Dolore da incomprensione sentita come cronica, non solo episodica',
    possibleTrap: 'Difendersi, riportare episodi positivi, razionalizzare',
    listeningOpportunity: 'Stare in quel dolore con lui/lei senza uscirne troppo presto',
  },

  {
    id: 'coppia_04',
    context: 'coppia',
    archetype: 'bisogno_nascosto',
    title: 'Non importa',
    setup: "Hai dimenticato qualcosa che per lui/lei era importante. Quando te ne accorgi e ti scusi, risponde.",
    quote: 'Non importa. Non è mai importante quello che dico.',
    hiddenTension: 'Sensazione di essere sistematicamente messo in secondo piano',
    possibleTrap: 'Difendersi elencando le attenzioni passate, minimizzare l\'episodio',
    listeningOpportunity: 'Riconoscere il pattern che lui/lei sta descrivendo, non solo l\'episodio singolo',
  },

  {
    id: 'coppia_05',
    context: 'coppia',
    archetype: 'chiusura',
    title: 'Inutile parlare',
    setup: 'Proponi di parlare di una questione che si trascina da tempo. Il partner risponde.',
    quote: 'A cosa serve parlarne? Parliamo, parliamo, ma poi non cambia mai niente.',
    hiddenTension: 'Stanchezza da conversazioni che sembrano girare in tondo senza esito',
    possibleTrap: 'Convincerlo/la che questa volta sarà diverso, insistere sul dialogo come soluzione',
    listeningOpportunity: 'Riconoscere la sua stanchezza prima di aprire la conversazione che hai in mente',
  },

  {
    id: 'coppia_06',
    context: 'coppia',
    archetype: 'conflitto_prospettiva',
    title: 'Due versioni',
    setup: 'State rielaborando un litigio passato. Ogni volta sembra che ricordiate la stessa scena in modo opposto.',
    quote: 'Per te era solo una discussione. Per me era la goccia che ha fatto traboccare il vaso.',
    hiddenTension: 'Disallineamento nella percezione del peso relazionale degli eventi',
    possibleTrap: 'Cercare di stabilire chi ha ragione sulla versione dei fatti',
    listeningOpportunity: 'Esplorare cosa ha reso quella goccia così pesante per lui/lei',
  },

  {
    id: 'coppia_07',
    context: 'coppia',
    archetype: 'frase_spiazzante',
    title: 'Sei presente?',
    setup: "Una sera tranquilla a casa. Il tuo partner ti guarda e dice qualcosa di inatteso.",
    quote: 'A volte mi chiedo se sei qui con me o se stai solo aspettando che finisca la giornata.',
    hiddenTension: 'Bisogno di presenza piena, connessione emotiva, non solo convivenza',
    possibleTrap: 'Difendersi, elencare le cose fatte insieme, non cogliere la profondità della domanda',
    listeningOpportunity: 'Raccogliere quella domanda come un invito a guardarsi e a stare davvero lì',
  },

  {
    id: 'coppia_08',
    context: 'coppia',
    archetype: 'sfiducia',
    title: 'Ci ho creduto troppo',
    setup: 'State parlando di una promessa non mantenuta. Lui/lei dice con tono basso.',
    quote: 'Forse ci ho creduto troppo. Non dovevo aspettarmi così tanto.',
    hiddenTension: 'Protezione da una delusione che si vuole evitare abbassando le aspettative',
    possibleTrap: 'Promettere di fare meglio, difendersi, portare argomenti razionali',
    listeningOpportunity: 'Stare in quella frase con lui/lei, esplorare cosa aveva creduto e cosa ha perso',
  },

  // ============================================================
  // GRUPPI (8 scenari)
  // ============================================================

  {
    id: 'gruppi_01',
    context: 'gruppi',
    archetype: 'sfiducia',
    title: 'Il gruppo non esiste',
    setup: 'Sei nel mezzo di una sessione di lavoro di gruppo. Una persona che di solito partecipa prende la parola inaspettatamente.',
    quote: 'Ma siamo davvero un gruppo? O siamo solo persone che stanno nella stessa stanza fingendo di collaborare?',
    hiddenTension: 'Senso che il gruppo non sia reale, che la collaborazione sia di facciata',
    possibleTrap: 'Difendere il gruppo, spiegare i risultati ottenuti, razionalizzare il senso di appartenenza',
    listeningOpportunity: 'Esplorare quando ha avuto questa sensazione e cosa si aspettava da un gruppo vero',
  },

  {
    id: 'gruppi_02',
    context: 'gruppi',
    archetype: 'accusa_indiretta',
    title: 'Si sa già chi decide',
    setup: "Stai facilitando un momento decisionale nel gruppo. Una persona prima di esprimere il suo parere dice.",
    quote: 'Posso dire la mia? Tanto poi decidete voi che avete più peso.',
    hiddenTension: 'Percezione di una gerarchia informale che esclude le voci meno potenti',
    possibleTrap: 'Difendere il processo decisionale, spiegare che tutti contano uguale',
    listeningOpportunity: 'Esplorare quando si è sentita meno ascoltata e in quale dinamica si è vissuta come esclusa',
  },

  {
    id: 'gruppi_03',
    context: 'gruppi',
    archetype: 'chiusura',
    title: 'Non mi interessa più',
    setup: 'Stai cercando di coinvolgere un membro del gruppo su un tema importante. Risponde.',
    quote: 'Fate voi. Non mi interessa più come va a finire.',
    hiddenTension: 'Disinvestimento da un gruppo che non ha saputo tenerla/lo dentro',
    possibleTrap: 'Ignorare, prendere la risposta alla lettera, procedere senza fermarsi sul significato',
    listeningOpportunity: 'Fermarsi su quel "più" — quando ha smesso di interessargli e perché',
  },

  {
    id: 'gruppi_04',
    context: 'gruppi',
    archetype: 'bisogno_nascosto',
    title: 'Nessuno si accorge',
    setup: 'Dopo una sessione di lavoro intensa, un membro del gruppo ti ferma da solo e dice.',
    quote: 'Non lo so. Ho la sensazione che il mio contributo passi sempre inosservato. Forse non è il mio posto.',
    hiddenTension: 'Bisogno di riconoscimento e appartenenza che non trova risposta nel gruppo',
    possibleTrap: 'Elencare i contributi che ha dato, rassicurarlo che vale, risolvere con complimenti',
    listeningOpportunity: 'Esplorare come si è sentito nelle dinamiche del gruppo, non valutarne il contributo',
  },

  {
    id: 'gruppi_05',
    context: 'gruppi',
    archetype: 'conflitto_prospettiva',
    title: 'Due culture',
    setup: 'Nel gruppo si è aperta una discussione su come lavorare. Due persone hanno visioni opposte e la tensione sale.',
    quote: 'Per voi questo è collaborare. Per me è solo confusione senza direzione.',
    hiddenTension: 'Diversità di valori e stili di lavoro vissuta come incompatibilità',
    possibleTrap: 'Difendere il metodo del gruppo, spiegare i vantaggi, scegliere un lato',
    listeningOpportunity: 'Esplorare cosa significa "direzione" per chi parla e cosa teme nella confusione',
  },

  {
    id: 'gruppi_06',
    context: 'gruppi',
    archetype: 'resistenza',
    title: 'Non cambiamo rotta',
    setup: 'Stai proponendo al gruppo di cambiare approccio a un progetto. Una persona risponde.',
    quote: 'No. Abbiamo già deciso in un certo modo. Non mi sembra giusto rimettere tutto in discussione ora.',
    hiddenTension: 'Bisogno di stabilità e prevedibilità, paura del caos relazionale del cambiamento',
    possibleTrap: 'Spiegare perché il nuovo approccio è meglio, soverchiare con argomenti',
    listeningOpportunity: 'Esplorare cosa ha investito nel percorso precedente e cosa rischia di perdere',
  },

  {
    id: 'gruppi_07',
    context: 'gruppi',
    archetype: 'delusione',
    title: 'Non è il gruppo che speravo',
    setup: 'Un membro storico del gruppo, in un momento informale, si apre.',
    quote: 'Quando ho cominciato pensavo che questo gruppo fosse diverso. Pensavo che ci ascoltassimo di più.',
    hiddenTension: 'Delusione da un ideale di gruppo che non si è realizzato',
    possibleTrap: 'Difendere il gruppo, elencare i risultati, minimizzare l\'aspettativa come ingenua',
    listeningOpportunity: 'Esplorare che tipo di gruppo si immaginava e dove ha sentito la differenza',
  },

  {
    id: 'gruppi_08',
    context: 'gruppi',
    archetype: 'silenzio_significativo',
    title: 'Non dico niente',
    setup: 'Stai facilitando un confronto aperto nel gruppo. Noti che una persona non parla mai. Quando le dai la parola, dice.',
    quote: 'No, grazie. Preferisco ascoltare. Tanto ho già capito com\'è andata.',
    hiddenTension: 'Ritiro come forma di autodifesa, sensazione che lo spazio non sia sicuro',
    possibleTrap: 'Forzare la partecipazione, rassicurare in modo generico, ignorare il ritiro',
    listeningOpportunity: 'Esplorare con delicatezza cosa intende con "ho già capito com\'è andata"',
  },

  // ============================================================
  // VENDITA / CLIENTE (8 scenari)
  // ============================================================

  {
    id: 'vendita_01',
    context: 'vendita',
    archetype: 'sfiducia',
    title: 'Non mi fido',
    setup: 'Stai presentando una proposta a un potenziale cliente. Dopo aver ascoltato tutto, con calma, dice.',
    quote: 'Ho sentito queste promesse già altre volte. Poi alla fine i risultati non ci sono stati.',
    hiddenTension: 'Sfiducia costruita da esperienze passate deludenti con altri fornitori',
    possibleTrap: 'Difendere la propria azienda, spiegare perché loro sono diversi, caricare di garanzie',
    listeningOpportunity: 'Esplorare cosa è successo nelle esperienze precedenti, cosa ha deluso davvero',
  },

  {
    id: 'vendita_02',
    context: 'vendita',
    archetype: 'resistenza',
    title: 'Troppo caro',
    setup: "Hai presentato un preventivo. Il cliente risponde quasi immediatamente.",
    quote: 'È troppo caro. Ho visto offerte simili a metà del prezzo.',
    hiddenTension: 'Possibile paura di sbagliare scelta, difficoltà a percepire il valore differenziale',
    possibleTrap: 'Giustificare il prezzo, sminuire il competitor, fare subito uno sconto',
    listeningOpportunity: 'Esplorare cosa ha visto nelle altre offerte e cosa teme di perdere o di pagare troppo',
  },

  {
    id: 'vendita_03',
    context: 'vendita',
    archetype: 'chiusura',
    title: 'Non sono pronto',
    setup: 'Stai per chiudere una trattativa. Il cliente, che sembrava convinto, improvvisamente si ritrae.',
    quote: 'Aspetta. Non sono pronto. Devo ancora pensarci. Non so.',
    hiddenTension: 'Paura di prendere una decisione sbagliata, bisogno di rassicurazione non ancora dato',
    possibleTrap: 'Spingere, portare argomenti, chiedere direttamente cosa blocca con tono tecnico',
    listeningOpportunity: 'Esplorare cosa non è ancora chiaro per lui e cosa lo farebbe sentire pronto',
  },

  {
    id: 'vendita_04',
    context: 'vendita',
    archetype: 'bisogno_nascosto',
    title: 'Non è il prodotto',
    setup: 'Un cliente esistente ti contatta dicendo di voler cambiare fornitore. Ti spiega i motivi tecnici, ma qualcosa non torna.',
    quote: 'Non è una questione di prodotto. Non so come spiegarti. È una questione di come ci sentiamo trattati.',
    hiddenTension: 'Bisogno di relazione e riconoscimento che non si sente soddisfatto',
    possibleTrap: 'Rispondere al problema tecnico, offrire upgrade, giustificare il servizio passato',
    listeningOpportunity: 'Esplorare in quali momenti si è sentito non visto o non considerato come cliente',
  },

  {
    id: 'vendita_05',
    context: 'vendita',
    archetype: 'accusa_indiretta',
    title: 'Solo quando servite voi',
    setup: 'Un cliente di lunga data, durante un incontro di review, dice con tono controllato.',
    quote: 'Vi fate vivi quando avete qualcosa da vendere. Quando abbiamo un problema, invece, si aspetta.',
    hiddenTension: 'Sensazione di essere usato come cliente senza una relazione vera',
    possibleTrap: 'Difendere il servizio, citare ticket gestiti, spiegare i processi interni',
    listeningOpportunity: 'Riconoscere il pattern che descrive e esplorare cosa avrebbe voluto di diverso',
  },

  {
    id: 'vendita_06',
    context: 'vendita',
    archetype: 'conflitto_prospettiva',
    title: 'Visioni diverse',
    setup: 'Stai cercando di allinearti con un cliente su come misurare il successo di un progetto. La discussione si inceppa.',
    quote: 'Per voi il successo è fare le cose in tempo. Per noi il successo è che cambino davvero le cose.',
    hiddenTension: 'Disallineamento tra aspettativa di cambiamento reale e logica di delivery',
    possibleTrap: 'Difendere il metodo di lavoro, spiegare la propria metrica, proporre un compromesso tecnico',
    listeningOpportunity: 'Esplorare cosa significa "cambiare le cose davvero" per il cliente e cosa teme non cambi',
  },

  {
    id: 'vendita_07',
    context: 'vendita',
    archetype: 'delusione',
    title: 'Non è quello che avevo in mente',
    setup: 'Hai consegnato un lavoro. Il cliente, dopo averlo visto, dice con tono deluso.',
    quote: 'Non è quello che avevo in mente. Non so spiegarti perché, ma non è quello.',
    hiddenTension: 'Gap tra aspettativa implicita non espressa e risultato consegnato',
    possibleTrap: 'Difendere il lavoro fatto, citare il brief, chiedere cosa non va in modo tecnico',
    listeningOpportunity: 'Esplorare cosa aveva in mente, anche se non lo sa dire, con domande aperte',
  },

  {
    id: 'vendita_08',
    context: 'vendita',
    archetype: 'richiesta_mascherata',
    title: 'Volete solo vendere',
    setup: 'Un prospect che stai seguendo da settimane, proprio quando sembrava vicino alla decisione, dice.',
    quote: 'Alla fine voi volete solo vendere. Chi mi garantisce che pensate davvero al mio problema?',
    hiddenTension: 'Bisogno di sentirsi visto come persona con un problema reale, non come opportunità commerciale',
    possibleTrap: 'Difendersi dichiarando di avere a cuore il cliente, elencare referenze',
    listeningOpportunity: 'Riconoscere che quella domanda è legittima ed esplorare quale problema sente ancora inascoltato',
  },
]

// ============================================================
// Informazioni sui contesti
// ============================================================

export const contextInfo = [
  {
    id: 'lavoro' as const,
    label: 'Lavoro',
    description: 'Quando ruoli, aspettative e frustrazioni non dette rendono difficile ascoltare davvero.',
    tension: 'Esclusione, riconoscimento mancato, sfiducia, riunioni, collaborazione',
    emoji: '💼',
  },
  {
    id: 'famiglia' as const,
    label: 'Famiglia',
    description: 'Quando il legame è forte, ma proprio per questo la risposta arriva troppo presto.',
    tension: 'Aspettative, vecchi copioni, autonomia, distanza emotiva, giudizio',
    emoji: '🏡',
  },
  {
    id: 'amicizie' as const,
    label: 'Amicizie',
    description: 'Quando dietro una frase leggera può esserci una distanza che si sta creando.',
    tension: 'Sentirsi trascurati, distanza, delusione nascosta, bisogno di presenza',
    emoji: '🤝',
  },
  {
    id: 'coppia' as const,
    label: 'Coppia',
    description: 'Quando la conversazione ripete copioni conosciuti e ascoltare diventa difficile.',
    tension: 'Ascolto mancato, rancori ricorrenti, bisogno di essere visti, incomprensioni',
    emoji: '💑',
  },
  {
    id: 'gruppi' as const,
    label: 'Gruppi',
    description: 'Quando più voci cercano spazio e qualcuno smette di sentirsi visto.',
    tension: 'Partecipazione, leadership, esclusione, clima, conflitto sotterraneo',
    emoji: '👥',
  },
  {
    id: 'vendita' as const,
    label: 'Vendita / Cliente',
    description: 'Quando dietro un\'obiezione può esserci un bisogno che non è ancora stato detto.',
    tension: 'Sfiducia, obiezione economica, bisogno nascosto, resistenza alla proposta',
    emoji: '🤝',
  },
]

// ============================================================
// Continuazioni per archetipo
// "closed" = l'altro se si è sentito non ascoltato (difesa/risposta)
// "open"   = l'altro se si è sentito ascoltato (curiosità/presenza)
// ============================================================

export const archetypeContinuations: Record<Archetype, { closed: string; open: string }> = {
  sfiducia: {
    closed: 'Vedi? È esattamente questo che intendo. Non cambia mai niente.',
    open: '…non me lo aspettavo. Di solito nessuno se ne accorge davvero.',
  },
  accusa_indiretta: {
    closed: 'Lascia stare. È inutile parlarne.',
    open: 'Forse ho esagerato. Ma è una cosa che mi porto dietro da un po\'.',
  },
  delusione: {
    closed: 'Non importa. Avrei dovuto saperlo già.',
    open: 'Che strano sentirsi ascoltati su questo. Non ci ero abituato.',
  },
  chiusura: {
    closed: 'Ok, ho capito. Non ne parliamo più.',
    open: 'Non lo so neanche io esattamente cosa voglio. Ma grazie per non insistere.',
  },
  bisogno_nascosto: {
    closed: 'Niente, non preoccuparti. Stavo solo pensando ad alta voce.',
    open: 'Sì, è più o meno quello. Non riuscivo a dirlo in modo diretto.',
  },
  conflitto_prospettiva: {
    closed: 'Vabbè, la vediamo diversamente. Pazienza.',
    open: 'Ok, capisco il tuo punto. Anche se ancora non sono del tutto d\'accordo.',
  },
  richiesta_mascherata: {
    closed: 'No no, me la cavo da solo. Non serve niente.',
    open: 'In realtà ci sarebbe una cosa. Ma non sapevo come chiederla.',
  },
  resistenza: {
    closed: 'Ognuno fa come vuole. Io resto sul mio.',
    open: 'Forse hai ragione che ho reagito così perché non mi è stato chiesto prima.',
  },
  silenzio_significativo: {
    closed: '…',
    open: 'Non pensavo che qualcuno se ne accorgesse.',
  },
  frase_spiazzante: {
    closed: 'Niente, dimentica. Stavo parlando troppo.',
    open: 'Sì, è una cosa strana da dire. Ma è quello che sento davvero.',
  },
}
