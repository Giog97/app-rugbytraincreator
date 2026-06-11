/* Catalogo esercizi preconfezionato (sola lettura).
   Si combina con gli esercizi creati dall'utente: in libreria sono mostrati
   entrambi, e il generatore di seduta pesca da tutti e due.
   Ogni esercizio ha uno schema tattico in assets/schemes/<id>.svg
   (generato da tools/generate_schemes.py). L'utente può sempre caricare
   una propria immagine duplicando l'esercizio.
   Campi = struttura fissa di ogni esercizio. */
window.RUGBY = window.RUGBY || {};

function _ex(o) { o.origine = 'catalogo'; o.immagine = 'assets/schemes/' + o.id + '.svg'; return o; }
/* Esercizi estratti dagli appunti del corso dell'allenatore */
function _app(o) { o = _ex(o); o.fonte = 'appunti'; return o; }

RUGBY.CATALOG = [
  /* ===================== ATTIVAZIONE / RISCALDAMENTO ===================== */
  _ex({
    id: 'cat-att-quadrato',
    titolo: 'Riscaldamento a quadrato con palla',
    tema: 'skill', fase: 'attivazione',
    obiettivo: 'Attivare il corpo e la manualità con passaggi in movimento.',
    descrizione: 'Quattro gruppi ai vertici di un quadrato. Si parte in corsa leggera passando la palla al gruppo successivo dopo aver percorso il lato. Si aumenta progressivamente l’intensità della corsa e si introducono passaggi a due mani su entrambi i lati. Inserire skip, calciata e corsa laterale tra una serie e l’altra.',
    durata: 15, giocatori: 'Tutta la squadra', materiale: '4 coni, 2-3 palloni',
    spazio: '20x20 m', varianti: 'Passaggio dietro la schiena, doppio passaggio, cambio di direzione al cono.',
    coaching: 'Mani avanti pronte a ricevere; passaggio davanti al ricevitore; testa alta.'
  }),
  _ex({
    id: 'cat-att-touch',
    titolo: 'Touch rugby di attivazione',
    tema: 'skill', fase: 'attivazione',
    obiettivo: 'Alzare la temperatura corporea e ripassare lettura degli spazi.',
    descrizione: 'Partita di touch 7v7 a campo ridotto. Al touch la palla si gioca a terra con passaggio rapido. Nessun placcaggio. Si gioca a ritmo crescente per 2-3 mini-partite da 3 minuti con breve recupero. Obbligo di sostenere il portatore di palla.',
    durata: 15, giocatori: '12-16', materiale: 'Casacche, 1 pallone',
    spazio: '30x25 m', varianti: 'Touch a 1 o 2 mani; obbligo di 3 passaggi prima di attaccare la linea.',
    coaching: 'Sostegno a profondità corretta; comunicazione; non correre tutti sulla palla.'
  }),
  _ex({
    id: 'cat-att-handling-grid',
    titolo: 'Griglia di manualità',
    tema: 'skill', fase: 'attivazione',
    obiettivo: 'Attivare manualità, comunicazione e visione di gioco.',
    descrizione: 'Griglia di coni 3x3. I giocatori si muovono nello spazio scambiandosi la palla in più direzioni, mantenendo la testa alta ed evitando i contatti. L’allenatore dà richiami (colore o numero) a cui rispondere con un’azione, per stimolare la reattività.',
    durata: 12, giocatori: 'Tutta la squadra', materiale: '9 coni, 3-4 palloni',
    spazio: '15x15 m', varianti: 'Due palloni in gioco; passaggio solo sul lato debole; aggiungere un “cacciatore”.',
    coaching: 'Comunicazione costante; mani pronte; sguardo in alto per leggere lo spazio.'
  }),

  /* ===================== TECNICA INDIVIDUALE ===================== */
  _ex({
    id: 'cat-tec-passaggio',
    titolo: 'Tecnica del passaggio (corto e spin)',
    tema: 'skill', fase: 'tecnica',
    obiettivo: 'Migliorare precisione e velocità di rilascio del passaggio.',
    descrizione: 'A coppie o terzetti su corridoio stretto. Prima passaggi fermi curando impugnatura, rotazione del busto e accompagnamento verso il bersaglio. Poi in camminata e in corsa leggera. Introdurre lo spin pass sul lato debole. Serie da 8-10 passaggi per lato.',
    durata: 15, giocatori: 'Tutta la squadra a coppie', materiale: '1 pallone ogni 2-3 giocatori, coni',
    spazio: 'Corridoi da 8-10 m', varianti: 'Passaggio dopo finta; passaggio al volo; bersaglio fisso (palo/scudo).',
    coaching: 'Palla portata a due mani; spingere con le dita; seguire il bersaglio con le mani.'
  }),
  _ex({
    id: 'cat-tec-placcaggio',
    titolo: 'Tecnica di placcaggio in sicurezza',
    tema: 'difesa', fase: 'tecnica',
    obiettivo: 'Consolidare posizione e sicurezza nel placcaggio.',
    descrizione: 'Lavoro progressivo: dalla posizione in ginocchio, placcaggio su compagno che cammina, curando testa dietro/laterale, spalla sul contatto, braccia che cingono e gambe che spingono. Si passa a placcaggio in piedi a bassa intensità su scudo. Alternare le spalle.',
    durata: 15, giocatori: 'A coppie omogenee per peso', materiale: 'Scudi/sacchi da placcaggio',
    spazio: '10x10 m', varianti: 'Placcaggio laterale; rialzarsi subito e contestare; doppio placcaggio.',
    coaching: 'Testa dalla parte sicura; occhi aperti sul bersaglio (cosce); stringere e accompagnare a terra.'
  }),
  _ex({
    id: 'cat-tec-ruck',
    titolo: 'Tecnica del ruck: pulizia e posizione',
    tema: 'ruck', fase: 'tecnica',
    obiettivo: 'Curare posizione del corpo e ripulita al punto d’incontro.',
    descrizione: 'A gruppi di tre lavoro su posizione bassa, presa e spinta oltre la palla su uno scudo a terra. Sequenza placcatore – portatore – primo sostegno che ripulisce. Si parte lenti per la tecnica, poi si aumenta l’intensità mantenendo la sicurezza.',
    durata: 12, giocatori: 'A gruppi di 3', materiale: 'Scudi/sacchi, palloni',
    spazio: '10x10 m', varianti: 'Due sostegni contro un contendente; partenza da terra; aggiungere il jackal.',
    coaching: 'Schiena piatta, gambe attive; spingere oltre la palla; occhi aperti, niente testa bassa.'
  }),
  _ex({
    id: 'cat-tec-calcio',
    titolo: 'Tecnica di calcio (drop e di liberazione)',
    tema: 'kicking', fase: 'tecnica',
    obiettivo: 'Calciare con precisione per liberare o guadagnare territorio.',
    descrizione: 'A coppie, calci di liberazione dalle mani (punt) e drop su distanze progressive, curando l’impatto sul collo del piede, la stabilità del busto e l’accompagnamento verso il bersaglio. Inserire bersagli a terra o tra i pali.',
    durata: 12, giocatori: 'A coppie', materiale: 'Palloni',
    spazio: 'Metà campo', varianti: 'Calcio a seguire; mira tra i pali; calcio sotto leggera pressione.',
    coaching: 'Palla guidata sul piede; busto stabile; follow-through verso il bersaglio.'
  }),
  _ex({
    id: 'cat-tec-raccolta',
    titolo: 'Raccolta da terra e passaggio del mediano',
    tema: 'skill', fase: 'tecnica',
    obiettivo: 'Velocità ed efficacia del mediano di mischia al punto d’incontro.',
    descrizione: 'Palla a terra a simulare l’uscita dal ruck. Il mediano arriva, posiziona i piedi, raccoglie e passa lungo e teso a destra e a sinistra. Serie cronometrate per stimolare la rapidità. A rotazione su tutti i giocatori.',
    durata: 12, giocatori: 'A gruppi', materiale: 'Palloni, coni',
    spazio: 'Corridoio 10-15 m', varianti: 'Passaggio dopo finta; con un difensore in pressione; box kick alternato.',
    coaching: 'Piedi vicino alla palla; mani avanti; passaggio teso senza caricare il braccio.'
  }),

  /* ===================== SKILL DI REPARTO / SITUAZIONE ===================== */
  _ex({
    id: 'cat-rep-3c2',
    titolo: 'Linea d’attacco 3 contro 2',
    tema: 'attacco', fase: 'reparto',
    obiettivo: 'Fissare il difensore e liberare l’uomo libero.',
    descrizione: 'Su un canale di 15 m, tre attaccanti contro due difensori che partono passivi e diventano semi-attivi. Il portatore deve correre dritto per fissare il primo difensore e passare al momento giusto. Rotazione continua dei ruoli. Conta le mete e gli uomini liberi creati.',
    durata: 20, giocatori: '5 per gruppo (rotazione)', materiale: 'Coni, 1 pallone, casacche',
    spazio: 'Canale 15x20 m', varianti: '4v3; difensori attivi; aggiungere un sostegno per il ruck.',
    coaching: 'Correre dritti per fissare; passaggio davanti; tempo del passaggio (né troppo presto né tardi).'
  }),
  _ex({
    id: 'cat-rep-trequarti',
    titolo: 'Lancio del gioco dei trequarti',
    tema: 'attacco', fase: 'reparto',
    obiettivo: 'Sincronizzare linee di corsa e passaggi della linea arretrata.',
    descrizione: 'La linea dei trequarti esegue combinazioni programmate (semplice, incrocio, salto d’uomo) partendo dal mediano, contro difesa passiva o semi-attiva. Si cura la profondità di partenza, le linee di corsa dritte e il tempo del passaggio. Si alternano le combinazioni a chiamata.',
    durata: 20, giocatori: '7-10', materiale: 'Palloni, coni',
    spazio: 'Metà campo in larghezza', varianti: 'Difesa attiva; combinazione decisa dal n.10; aggiungere l’estremo in entrata.',
    coaching: 'Profondità di partenza; correre dritti; passaggio davanti; tempo della combinazione.'
  }),
  _ex({
    id: 'cat-rep-salita',
    titolo: 'Salita difensiva a reparto',
    tema: 'difesa', fase: 'reparto',
    obiettivo: 'Salire connessi mantenendo la linea e la velocità difensiva.',
    descrizione: 'Reparto di 4-5 difensori parte dalla linea e sale insieme al via dell’allenatore verso scudi tenuti dagli attaccanti. Si lavora sulla partenza simultanea, sul mantenere la spalla interna e sulla comunicazione (“su, su, su”). Placcaggio o tocco controllato sullo scudo.',
    durata: 20, giocatori: '8-10', materiale: 'Scudi, coni',
    spazio: 'Metà larghezza campo', varianti: 'Salita a ventaglio dal raggruppamento; trigger sul passaggio dell’apertura.',
    coaching: 'Partire insieme; non superare il compagno interno; testa su, mani pronte.'
  }),
  _ex({
    id: 'cat-rep-drift',
    titolo: 'Difesa a scivolamento (drift)',
    tema: 'difesa', fase: 'reparto',
    obiettivo: 'Difendere lo spazio scivolando verso l’esterno.',
    descrizione: 'Il reparto difensivo sale e scivola verso la touche seguendo il movimento della palla, spingendo l’attacco verso il margine del campo. Lavoro su scudi o contro attacco semi-attivo, curando la connessione tra i difensori e la copertura dell’esterno.',
    durata: 20, giocatori: '8-10', materiale: 'Scudi, coni',
    spazio: 'Metà campo', varianti: 'Combinare con un placcatore interno (jam); trigger sull’ultimo passaggio.',
    coaching: 'Salire e scivolare insieme; spalla esterna pronta; non aprire buchi all’interno.'
  }),
  _ex({
    id: 'cat-rep-triangolo',
    titolo: 'Triangolo di ricezione (back three)',
    tema: 'contrattacco', fase: 'reparto',
    obiettivo: 'Gestire la palla alta e organizzare la ripartenza.',
    descrizione: 'Estremo e due ali formano un triangolo. L’allenatore calcia alto: chi riceve chiama “mia”, gli altri due si dispongono come sostegno e prima opzione di ripartenza. Dopo la presa, tre passaggi rapidi e attacco dello spazio per 10 m. Curare la comunicazione sotto la palla alta.',
    durata: 20, giocatori: '6-9', materiale: 'Palloni, coni',
    spazio: '30x30 m', varianti: 'Pressione di un inseguitore; ripartenza con calcetto di liberazione.',
    coaching: 'Chiamata forte e precoce; corpo dietro la palla; primo passaggio pulito per uscire dalla pressione.'
  }),
  _ex({
    id: 'cat-rep-touche-salti',
    titolo: 'Allineamento e salti in touche',
    tema: 'touche', fase: 'reparto',
    obiettivo: 'Conquistare con sicurezza la rimessa laterale.',
    descrizione: 'Lavoro sull’allineamento, sui codici di chiamata e sui tempi di sollevamento, alternando salti corti, medi e in coda. Sollevatori e saltatori a rotazione, curando la qualità del lancio del tallonatore e l’atterraggio protetto della palla.',
    durata: 20, giocatori: '7-9', materiale: 'Palloni (eventuale supporto al sollevamento)',
    spazio: 'Zona di touche', varianti: 'Touche a 5 e a 7; sotto pressione di un avversario; touche corta.',
    coaching: 'Tempo del salto; lancio preciso; comunicazione in codice; atterraggio protetto.'
  }),
  _ex({
    id: 'cat-rep-mischia',
    titolo: 'Mischia: posizione e spinta',
    tema: 'mischia', fase: 'reparto',
    obiettivo: 'Posizione corretta e spinta coordinata del pacchetto.',
    descrizione: 'Pacchetto contro macchina o contro un altro pacchetto. Si lavora sull’ingaggio sicuro (crouch – bind – set), sulla posizione della schiena e sulla sincronia della spinta al “via”, introducendo l’uscita controllata del pallone dal n.8.',
    durata: 20, giocatori: '8 (+8)', materiale: 'Macchina da mischia o opposizione',
    spazio: 'Zona dedicata', varianti: 'Mischia a 5; spinta su una sola direzione; uscita rapida del mediano.',
    coaching: 'Schiena piatta; ingaggio sicuro; spinta tutti insieme; il n.8 controlla la palla.'
  }),
  _ex({
    id: 'cat-rep-maul',
    titolo: 'Costruzione del maul da touche',
    tema: 'maul', fase: 'reparto',
    obiettivo: 'Costruire e far avanzare il maul in sicurezza.',
    descrizione: 'Dalla conquista in touche il saltatore viene riportato a terra protetto e si costruisce il maul a 3-4-5 giocatori che avanza compatto, tenendo la palla in coda. Si curano legatura, angolo di avanzamento e protezione del pallone.',
    durata: 20, giocatori: '6-9', materiale: 'Palloni',
    spazio: 'Zona di touche', varianti: 'Maul che cambia angolo; difesa del maul (sack o placcare il portatore).',
    coaching: 'Legarsi forte; palla in coda; avanzare compatti e dritti; comunicazione continua.'
  }),
  _ex({
    id: 'cat-rep-ruck',
    titolo: 'Ruck: contesa e ripulita a reparto',
    tema: 'ruck', fase: 'reparto',
    obiettivo: 'Vincere il punto d’incontro in situazione di reparto.',
    descrizione: 'Sequenze di placcaggio seguito dall’arrivo dei sostegni: primo e secondo uomo ripuliscono oltre la palla mentre un difensore prova a contendere (jackal). Si lavora su priorità, velocità di arrivo e decisione tra contesa e ripulita.',
    durata: 20, giocatori: '8-12', materiale: 'Scudi, palloni',
    spazio: '20x20 m', varianti: '2v1 e 2v2 sulla palla; partenza da placcaggio reale a bassa intensità.',
    coaching: 'Arrivare bassi e veloci; spingere oltre la palla; decidere subito contesa o ripulita.'
  }),
  _ex({
    id: 'cat-rep-boxkick',
    titolo: 'Box kick e pressione (kick-chase)',
    tema: 'kicking', fase: 'reparto',
    obiettivo: 'Liberare con il box kick e organizzare l’inseguimento.',
    descrizione: 'Dal ruck il mediano esegue il box kick mentre la linea di inseguitori sale coordinata per pressare la ricezione avversaria. Si cura l’altezza e la distanza del calcio, la protezione del calciatore e i tempi della salita (restando on-side).',
    durata: 20, giocatori: '8-12', materiale: 'Palloni',
    spazio: 'Metà campo', varianti: 'Contestare la palla alta; box kick più corto e riconquista.',
    coaching: 'Protezione del calciatore; calcio alto e gestibile; inseguitori in linea e on-side.'
  }),
  _ex({
    id: 'cat-sit-attacco2fasi',
    titolo: 'Attacco su 2 fasi con regole',
    tema: 'attacco', fase: 'situazione',
    obiettivo: 'Mantenere continuità e attaccare lo spazio dopo il punto d’incontro.',
    descrizione: 'Attacco 7-8 giocatori contro difesa a numeri pari semi-attiva. Regola: dopo il primo ruck si deve cambiare direzione di gioco; sulla seconda fase si cerca l’uomo libero. Si premia chi gioca veloce e tiene la palla viva. 4-5 ripetizioni poi cambio.',
    durata: 20, giocatori: '14-16', materiale: 'Casacche, palloni, coni',
    spazio: 'Metà campo', varianti: 'Difesa completamente attiva; obbligo di un offload; aggiungere un’opzione di calcio.',
    coaching: 'Velocità di ruck; ripulire il punto d’incontro; testa alta per leggere lo spazio debole.'
  }),
  _ex({
    id: 'cat-sit-pickgo',
    titolo: 'Pick & go e gioco al largo',
    tema: 'attacco', fase: 'situazione',
    obiettivo: 'Avanzare vicino al punto d’incontro e poi cambiare punto di gioco.',
    descrizione: 'L’attacco gioca 2-3 pick & go per fissare la difesa vicino al ruck, poi allarga rapidamente verso lo spazio liberato sull’altro lato. Difesa semi-attiva. Si allena la decisione su quando continuare corto e quando aprire.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Difesa attiva; obbligo di allargare dopo 2 pick; aggiungere un calcetto dietro la difesa.',
    coaching: 'Pick dinamici e bassi; velocità di ruck; riconoscere il momento di allargare.'
  }),
  _ex({
    id: 'cat-sit-canale910',
    titolo: 'Difesa del canale 9-10',
    tema: 'difesa', fase: 'situazione',
    obiettivo: 'Proteggere la zona attorno al raggruppamento e rallentare l’attacco.',
    descrizione: 'Attacco gioca corto attorno al ruck (pick&go e prime punte). La difesa organizza i pilastri ai lati del ruck e il “guardia”, lavorando su tenuta della linea, placcaggio dominante e contesa. Sequenze di 3-4 fasi. Si conta quanti metri concede la difesa.',
    durata: 20, giocatori: '14-16', materiale: 'Casacche, palloni',
    spazio: 'Corridoio centrale 22 m', varianti: 'Aggiungere jackal sul placcaggio; attacco che allarga dopo 2 pick&go.',
    coaching: 'Pilastri bassi e pronti; non farsi spostare; comunicazione su chi prende il portatore.'
  }),
  _ex({
    id: 'cat-sit-difesa-drift',
    titolo: 'Difesa della rimessa e scivolamento',
    tema: 'difesa', fase: 'situazione',
    obiettivo: 'Organizzare la difesa dopo la touche e coprire il largo.',
    descrizione: 'Dalla touche avversaria la difesa si organizza e scivola verso l’esterno per coprire l’ampiezza, gestendo prima il gioco corto o il maul e poi la palla larga ai trequarti. Si cura la rapidità di organizzazione e la connessione tra i difensori.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Con maul difensivo; trigger sul gioco corto; numeri dispari.',
    coaching: 'Organizzarsi in fretta; comunicare; scivolare connessi; spalle esterne.'
  }),
  _ex({
    id: 'cat-sit-contrcalcio',
    titolo: 'Contrattacco da calcio avversario',
    tema: 'contrattacco', fase: 'situazione',
    obiettivo: 'Trasformare un calcio ricevuto in occasione d’attacco.',
    descrizione: 'L’allenatore (o un giocatore) calcia verso il back three. Alla presa, decisione rapida: contrattaccare se c’è spazio, oppure consolidare e ripartire. Il resto della squadra riparte dalla propria metà per dare sostegno e linee di corsa. Lavoro su lettura e supporto.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni, casacche, coni',
    spazio: 'Da 22 m a metà campo', varianti: 'Inseguitori in pressione; regola “primo placcaggio = si consolida”.',
    coaching: 'Decidere presto (contrattacco o no); sostegno veloce e profondo; tenere la palla viva.'
  }),
  _ex({
    id: 'cat-sit-contr-turnover',
    titolo: 'Contrattacco da turnover',
    tema: 'contrattacco', fase: 'situazione',
    obiettivo: 'Ripartire immediatamente dopo un recupero di palla.',
    descrizione: 'Si simula un turnover (pallone rubato al ruck o ricacciato). La squadra che recupera deve contrattaccare subito nello spazio, prima che la difesa avversaria si riorganizzi, con sostegno rapido e profondo. Finestra breve per attaccare, poi si consolida.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Turnover a sorpresa dato dall’allenatore; finestra di 6 secondi per attaccare.',
    coaching: 'Testa alta al recupero; decidere subito; sostenere veloce e profondo.'
  }),
  _ex({
    id: 'cat-sit-touche',
    titolo: 'Touche + lancio del gioco',
    tema: 'touche', fase: 'situazione',
    obiettivo: 'Conquistare la rimessa e lanciare la prima fase pulita.',
    descrizione: 'Allineamento a 5-7 con due combinazioni di salto. Dopo la conquista, il mediano lancia un gioco programmato (gioco corto della maul o palla larga all’apertura). Si lavora su tempi del lancio, comunicazione in codice e qualità della prima fase. Ripetere alternando le combinazioni.',
    durata: 20, giocatori: '9-12', materiale: 'Palloni, eventuale supporto sollevamento',
    spazio: 'Zona di touche, 22 m', varianti: 'Touche corta; opzione maul; difesa della touche avversaria.',
    coaching: 'Lancio preciso; tempo del sollevamento; chiamata chiara; transizione rapida al gioco.'
  }),
  _ex({
    id: 'cat-sit-kick-territorio',
    titolo: 'Kicking game: territorio e ricaccio',
    tema: 'kicking', fase: 'situazione',
    obiettivo: 'Gestire il duello al piede per il territorio.',
    descrizione: 'Due squadre si contendono il campo con calci di territorio e ricacci. Si premia chi guadagna metri e costringe l’avversario nella propria metà. Si curano la gestione della palla alta, la prima ricezione pulita e la copertura del retro del campo.',
    durata: 20, giocatori: '14-18', materiale: 'Palloni',
    spazio: 'Tutto campo ridotto', varianti: 'Obbligo di calciare entro X passaggi; punti per palloni recuperati.',
    coaching: 'Scelta del calcio giusto; copertura del retro; prima ricezione pulita.'
  }),
  _ex({
    id: 'cat-sit-mischia-uscita',
    titolo: 'Uscita da mischia e lancio del gioco',
    tema: 'mischia', fase: 'situazione',
    obiettivo: 'Collegare la conquista in mischia al primo gioco.',
    descrizione: 'Dalla mischia (anche simulata) si lavora sull’uscita pulita del pallone (canale del n.8 o del mediano) e sul gioco programmato a seguire, verso i trequarti o con il n.8 che attacca. Difesa semi-attiva per dare riferimenti.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni',
    spazio: 'Metà campo', varianti: 'Gioco del n.8; palla larga subito; sotto pressione difensiva.',
    coaching: 'Uscita pulita; tempo del mediano; prima fase decisa e dritta.'
  }),
  _ex({
    id: 'cat-sit-maul-gioco',
    titolo: 'Maul offensivo e difesa del maul',
    tema: 'maul', fase: 'situazione',
    obiettivo: 'Avanzare con il maul e saperlo difendere.',
    descrizione: 'Una squadra costruisce e fa avanzare il maul (da touche o con palla in mano); l’altra lo difende restando in piedi e cercando di fermarne legalmente l’avanzamento. Dopo alcune ripetizioni si invertono i ruoli. Si cura anche lo stacco dal maul per giocare.',
    durata: 20, giocatori: '12-16', materiale: 'Palloni',
    spazio: 'Zona 22 m', varianti: 'Staccarsi dal maul e giocare al largo; maul che ruota; sack difensivo.',
    coaching: 'In attacco: compattezza, palla in coda, avanzare dritti. In difesa: restare in piedi e fermare l’avanzamento.'
  }),
  _ex({
    id: 'cat-sit-transizione',
    titolo: 'Transizione attacco-difesa',
    tema: 'transizioni', fase: 'situazione',
    obiettivo: 'Riorganizzarsi rapidamente al cambio di possesso.',
    descrizione: 'Situazione in cui, su segnale, attacco e difesa si invertono: chi attaccava deve organizzare la difesa in pochi secondi e viceversa. Si allena la reattività di reparto e la comunicazione nel ritrovare la linea dopo il cambio.',
    durata: 20, giocatori: '14-18', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Cambio multiplo nella stessa azione; numeri dispari; cambio a sorpresa.',
    coaching: 'Parlare al cambio; ritrovare la linea; i primi a reagire organizzano gli altri.'
  }),

  /* ===================== GIOCO APPLICATO / PARTITA ===================== */
  _ex({
    id: 'cat-gioco-attacco-overload',
    titolo: 'Gioco a campo ridotto - attacco in superiorità',
    tema: 'attacco', fase: 'gioco',
    obiettivo: 'Sfruttare la superiorità numerica e finalizzare.',
    descrizione: 'Partita a campo ridotto con attacco in superiorità (es. 8v6) che ruota ogni 2-3 mete. La squadra in attacco deve segnare giocando veloce e largo; quella in difesa lavora sul recupero. Set di 4-5 minuti poi inversione dei ruoli.',
    durata: 15, giocatori: '12-16', materiale: 'Casacche, palloni, coni',
    spazio: '40x30 m', varianti: 'Superiorità ridotta a +1; bonus meta segnando all’ala.',
    coaching: 'Giocare dove c’è spazio; rapidità di palla; non sprecare la superiorità con fretta.'
  }),
  _ex({
    id: 'cat-gioco-difesa-pari',
    titolo: 'Partita di difesa a numeri pari',
    tema: 'difesa', fase: 'gioco',
    obiettivo: 'Applicare il sistema difensivo sotto pressione di gioco reale.',
    descrizione: 'Partita a tutto campo ridotto a numeri pari con focus difensivo: si premia la difesa che recupera palloni, forza errori o concede meno metri. Conta i “set difensivi” completati senza subire avanzamento. Rotazione e brevi pause per correggere.',
    durata: 15, giocatori: '14-20', materiale: 'Casacche, palloni',
    spazio: 'Metà campo', varianti: 'Bonus per turnover; regola del placcaggio + contesa obbligatoria.',
    coaching: 'Linea connessa; salita decisa; comunicazione costante; pressione sul portatore.'
  }),
  _ex({
    id: 'cat-gioco-transizioni',
    titolo: 'Gioco a transizioni continue',
    tema: 'contrattacco', fase: 'gioco',
    obiettivo: 'Allenare il passaggio rapido tra attacco, difesa e contrattacco.',
    descrizione: 'Due squadre giocano a campo ridotto; al fischio o alla perdita di palla i ruoli si invertono immediatamente. Chi era in difesa, recuperando palla, deve contrattaccare subito nello spazio. Si allena la reattività mentale e il riorganizzarsi in fretta.',
    durata: 15, giocatori: '14-20', materiale: 'Casacche, palloni, coni',
    spazio: '40x35 m', varianti: 'Più palloni in gioco; cambio di palla a sorpresa dall’allenatore.',
    coaching: 'Reagire subito al cambio possesso; testa alta; primo a recuperare lancia il contrattacco.'
  }),
  _ex({
    id: 'cat-gioco-kick-territorio',
    titolo: 'Partita con calci di territorio',
    tema: 'kicking', fase: 'gioco',
    obiettivo: 'Applicare il gioco al piede in partita.',
    descrizione: 'Partita a campo intero ridotto in cui il calcio di territorio è incoraggiato: bonus per i palloni che fanno arretrare l’avversario o che vengono ricacciati dentro i 22. Si gioca la riconquista, la copertura del retro e la gestione della palla alta.',
    durata: 15, giocatori: '14-20', materiale: 'Palloni, casacche',
    spazio: 'Tutto campo ridotto', varianti: 'Zona dove è obbligatorio calciare; punti per ricacci dentro i 22.',
    coaching: 'Scelta tra correre e calciare; copertura del retro; pressione nell’inseguimento.'
  }),
  _ex({
    id: 'cat-gioco-ruck-contesa',
    titolo: 'Partita con contesa obbligatoria',
    tema: 'ruck', fase: 'gioco',
    obiettivo: 'Allenare la lotta sul pallone a terra in contesto di gioco.',
    descrizione: 'Partita in cui su ogni placcaggio è obbligatorio contendere il pallone (jackal) e difenderlo con i sostegni. Si premiano i turnover conquistati in modo legale e la velocità al punto d’incontro. Brevi pause per correggere posizione e tempi.',
    durata: 15, giocatori: '14-20', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Bonus per turnover; limite di sostegni al ruck; placcaggio obbligatorio sotto la vita.',
    coaching: 'Velocità al punto d’incontro; posizione bassa e legale; decidere contesa o ripulita.'
  }),
  _ex({
    id: 'cat-gioco-touche-ripartenze',
    titolo: 'Partita con ripartenze da touche',
    tema: 'touche', fase: 'gioco',
    obiettivo: 'Collegare la rimessa laterale al gioco in partita.',
    descrizione: 'Ogni volta che la palla esce dal campo si riparte da una touche reale. Si allenano conquista, lancio del gioco e continuità dalla rimessa in un contesto di partita, alternando combinazioni corte e palla larga.',
    durata: 15, giocatori: '14-20', materiale: 'Palloni',
    spazio: 'Metà campo', varianti: 'Touche corte/lunghe a chiamata; difesa della touche; opzione maul.',
    coaching: 'Qualità della conquista; prima fase pulita; continuità dopo la rimessa.'
  }),

  /* ===================== DEFATICAMENTO ===================== */
  _ex({
    id: 'cat-def-mobilita',
    titolo: 'Defaticamento e mobilità',
    tema: 'skill', fase: 'defaticamento',
    obiettivo: 'Riportare gradualmente il corpo a riposo e curare la mobilità.',
    descrizione: 'Corsa molto leggera per 3-4 minuti, poi circuito di mobilità articolare e allunghi dei principali gruppi muscolari (anche, ischiocrurali, spalle, collo). Chiusura con respirazione e breve confronto sulla seduta. Momento utile anche per il feedback del gruppo.',
    durata: 5, giocatori: 'Tutta la squadra', materiale: 'Nessuno',
    spazio: 'Libero', varianti: 'Stretching a coppie; mobilità guidata da un giocatore a turno.',
    coaching: 'Movimenti lenti e controllati; respirazione; idratazione; rivedere 1-2 punti chiave della seduta.'
  }),
  _ex({
    id: 'cat-def-core',
    titolo: 'Defaticamento con core e stretching',
    tema: 'skill', fase: 'defaticamento',
    obiettivo: 'Scaricare e rinforzare il core a bassa intensità.',
    descrizione: 'Breve corsa leggera, poi esercizi di core (plank e varianti) a bassa intensità e stretching dei principali gruppi muscolari. Chiusura con respirazione e feedback sulla seduta. Da svolgere con calma, curando la qualità del movimento.',
    durata: 5, giocatori: 'Tutta la squadra', materiale: 'Tappetini (facoltativi)',
    spazio: 'Libero', varianti: 'Core a coppie; mobilità guidata; respirazione finale prolungata.',
    coaching: 'Controllo e respirazione; qualità più che quantità; idratazione.'
  }),

  /* ============================================================
     ESERCIZI DAGLI APPUNTI DEL CORSO (Super Corso CRT + note dal campo)
     fonte: 'appunti' -> mostrati con il badge "Dai tuoi appunti"
  ============================================================ */
  _app({
    id: 'app-att-pi',
    titolo: 'Attivazione al punto d’incontro (P-D-S)',
    tema: 'ruck', fase: 'attivazione',
    obiettivo: 'Preparare il contatto e la ruck in progressione e a bassa intensità.',
    descrizione: 'A terne con ruoli codificati: Portatore, Difensore, Sostegno. Si parte tutti e tre in ginocchio, a livello medio-basso: il portatore va al contatto, il difensore lo contrasta, il sostegno interviene e ripulisce (cleaning). Rotazione continua dei ruoli a ogni ripetizione, alzando gradualmente livello e intensità.',
    durata: 10, giocatori: 'A terne', materiale: '1 pallone ogni 3',
    spazio: '10x10 m per terna', varianti: 'Partenza in piedi a bassa intensità; aggiungere un secondo sostegno; mini-sfida sul recupero.',
    coaching: 'Livello basso e schiena piatta; il contatto si prepara in progressione; ruotare i ruoli così tutti vivono P, D e S.'
  }),
  _app({
    id: 'app-att-ondate',
    titolo: 'Attacco davanti, difesa in superiorità: 2v1 + 3v2 + 5v3',
    tema: 'attacco', fase: 'reparto',
    obiettivo: 'Sfruttare superiorità numeriche crescenti con difensori che si riciclano.',
    descrizione: 'Esercizio per 8 ragazzi su campo a canali (~22 m di larghezza, profondità 5+15 m). I due attaccanti partono dai due pali e giocano il 2v1. Dopo, il primo difensore diventa attaccante e si gioca in 3v2. Dopo, anche i due difensori del 3v2 diventano attaccanti e si gioca il 5v3. Le ondate sono continue: chi difende rientra nell’onda successiva.',
    durata: 15, giocatori: '8', materiale: 'Coni/pali, palloni, casacche',
    spazio: '~22x20 m a canali', varianti: 'Cambiare i rapporti numerici; un giro in più per chi segna; vincolo di passaggi minimi.',
    coaching: 'Correre dritto per fissare; decidere in base al difensore reale, non a memoria; riorganizzarsi subito per l’onda successiva.'
  }),
  _app({
    id: 'app-tec-pass-pressione',
    titolo: 'Passaggio sotto pressione nel corridoio',
    tema: 'skill', fase: 'tecnica',
    obiettivo: 'Passare con qualità leggendo i difensori, senza farsi toccare.',
    descrizione: 'Corridoio con linea di meta. Il portatore ha 2 difensori vicini: uno dietro e uno davanti, entrambi leggermente spostati verso l’interno del campo in modo da lasciare liberi i tre corridoi davanti al portatore. L’azione la decide il portatore, che parte palla in mano quando vuole: deve scegliere il corridoio e il momento del passaggio per mandare in meta il compagno. Obiettivo: fare meta senza essere toccati.',
    durata: 12, giocatori: '4-6 per corridoio', materiale: 'Coni, palloni',
    spazio: 'Corridoio 10-15 m', varianti: 'Evoluzione: aggiungere un secondo difensore per alzare la difficoltà; modulare la distanza tra i difensori che intervengono.',
    coaching: 'Partenza con la palla in asse; leggere il primo difensore; il timing del passaggio decide tutto.'
  }),
  _app({
    id: 'app-sit-salita-vlp',
    titolo: 'Attacco con palla verde-gialla-rossa',
    tema: 'attacco', fase: 'situazione',
    obiettivo: 'Leggere la velocità di uscita del pallone dal punto d’incontro e attaccare di conseguenza.',
    descrizione: 'Esercizio “da Michele Cardinale”: giocano 4 difensori contro 6 attaccanti. L’allenatore simula il punto d’incontro mostrando un pallone colorato: VERDE = palla veloce, GIALLA = media, ROSSA = lenta. Gli attaccanti, schierati in linea, devono riconoscere il colore (non solo ascoltare la chiamata) e attaccare gli spazi sfruttando la velocità di uscita; i difensori si organizzano sul tempo concesso. Obiettivo: fare meta provando gli spazi e sfruttando la velocità di uscita del pallone.',
    durata: 15, giocatori: '10 (6 attaccanti vs 4 difensori)', materiale: 'Palloni di 3 colori (o coni), casacche',
    spazio: 'Metà larghezza campo', varianti: 'Anche l’allenatore si muove e cambia punto d’incontro; chiamate a sorpresa; punti per la lettura corretta.',
    coaching: 'Riconoscere il colore prima di muoversi; palla verde = attacca subito, rossa = riorganizzati; testa alta sempre.'
  }),
  _app({
    id: 'app-att-colori',
    titolo: 'Chiamata a colori per i 3/4',
    tema: 'skill', fase: 'attivazione',
    obiettivo: 'Riconoscere uno stimolo e attaccare lo spazio nel minor tempo possibile.',
    descrizione: 'Skill/handling per i 3/4. Canale con palloni colorati e un giocatore largo sullo spazio. Tre attaccanti partono in fila: l’allenatore chiama un colore (ROSSO o VERDE) e in che fila devono andare; il rispettivo ricevitore riconosce la chiamata e prende la palla prima che tocchi terra. Il giocatore largo si smarca e si fa passare la palla dal primo della fila.',
    durata: 10, giocatori: '4-8', materiale: 'Palloni/coni di 2-3 colori',
    spazio: 'Canale 15-20 m', varianti: 'Chiamare colore + numero; doppia chiamata; aggiungere un difensore passivo.',
    coaching: 'Prima riconoscere, poi agire; comunicare con il largo; qualità del passaggio anche con fretta.'
  }),
  _app({
    id: 'app-tec-tracking',
    titolo: 'Tracking e placcaggio nel canale',
    tema: 'difesa', fase: 'tecnica',
    obiettivo: 'Accompagnare il portatore e mettersi in condizione di fare un placcaggio possibile.',
    descrizione: 'Canale delimitato da coni: il portatore entra cambiando angolo e velocità, il difensore lavora il tracking (seguire il portatore restando in equilibrio, dall’interno verso l’esterno) e finalizza con un placcaggio controllato quando la situazione lo rende possibile. Progressione: camminata, corsa leggera, intensità crescente.',
    durata: 12, giocatori: 'A coppie nel canale', materiale: 'Coni',
    spazio: 'Canale 10x15 m', varianti: 'Doppio canale; portatore con finte libere; finire con contesa sul pallone.',
    coaching: 'Si difende dall’interno verso l’esterno; controllare il ritmo di corsa; il tracking serve a rendere il placcaggio possibile.'
  }),
  _app({
    id: 'app-rep-raddoppio',
    titolo: 'Raddoppio del placcaggio sotto i 2 secondi',
    tema: 'difesa', fase: 'reparto',
    obiettivo: 'Raddoppiare il placcaggio con tempi rapidi: uomo e pallone.',
    descrizione: 'Stazione breve e intensa: il portatore avanza, due difensori devono raddoppiare il placcaggio entro il tempo limite (sotto i 2 secondi) — il primo prende l’uomo, il secondo lavora sul pallone per strapparlo o rallentarne l’utilizzo.',
    durata: 7, giocatori: 'A terne/quartetti in stazione', materiale: 'Palloni, eventuale scudo',
    spazio: '10x10 m', varianti: 'Conteggio ad alta voce; punti per ogni pallone strappato; portatore con sostegno.',
    coaching: 'Primo placcatore basso e dominante; il secondo va sul pallone; massimo 2 giocatori sul pallone.'
  }),
  _app({
    id: 'app-tec-jackal',
    titolo: '1v1 jackal sul pallone a terra',
    tema: 'ruck', fase: 'tecnica',
    obiettivo: 'Contendere il pallone a terra in modo rapido e legale.',
    descrizione: 'Stazione 1 contro 1: portatore a terra con il pallone presentato, il difensore arriva e lavora il jackal (posizione bassa, appoggi solidi, mani sul pallone) mentre un sostegno d’attacco arriva a ripulire. Vince chi conquista o protegge il pallone. Rotazione continua.',
    durata: 7, giocatori: 'A terne in stazione', materiale: 'Palloni',
    spazio: '8x8 m', varianti: 'Sostegno in ritardo variabile; 2v1 sulla palla; partenze da posizioni diverse.',
    coaching: 'Arrivare prima del sostegno; posizione bassa e legale (restare sui propri appoggi); decidere subito: contesa o riorganizzarsi.'
  }),
  _app({
    id: 'app-tec-canali-portatore',
    titolo: 'Canali del portatore: dentro, fuori, debordo',
    tema: 'attacco', fase: 'tecnica',
    obiettivo: 'Scegliere il giusto piano di contatto per non farsi prendere.',
    descrizione: 'Tre corridoi affiancati, in ciascuno un difensore (passivo poi attivo). Il portatore affronta il difensore scegliendo il canale: DENTRO (attacca l’interno), FUORI (attacca l’esterno) o DEBORDO (lo aggira). L’obiettivo è la capacità di non farsi prendere scegliendo i giusti piani del contatto.',
    durata: 12, giocatori: 'A coppie sui corridoi', materiale: 'Coni',
    spazio: '3 corridoi da 5x12 m', varianti: 'Canale a chiamata; difensore che varia la salita; punto bonus se il portatore resta in piedi.',
    coaching: 'Guardare il difensore, non il canale; cambio di ritmo sul punto debole; proteggere il pallone nel contatto.'
  }),
  _app({
    id: 'app-rep-trezone',
    titolo: 'Tre zone: profondità e angoli di corsa',
    tema: 'attacco', fase: 'reparto',
    obiettivo: 'Scegliere dove attaccare e regolare profondità e angolo di ricezione.',
    descrizione: 'Tre zone affiancate (1 rossa, 2 gialla, 3 verde) con difensori in cima. La palla parte dalla fonte (ruck/mischia simulata): la linea d’attacco decide quale zona attaccare e di conseguenza quanto stare profonda e con quale angolo correre a ricevere. L’idea guida: “dove voglio attaccare, quindi quanto devo stare profondo”.',
    durata: 15, giocatori: '6-10', materiale: 'Coni di 3 colori, palloni',
    spazio: '30x20 m', varianti: 'Zona a chiamata dell’allenatore o del 10; difensori attivi; vincolo di attaccare zone diverse in sequenza.',
    coaching: 'Prima la decisione, poi la corsa; profondità = tempo per accelerare; ricevere lanciati, mai da fermi.'
  }),
  _app({
    id: 'app-sit-mischia-3pos',
    titolo: 'Difesa da mischia su 3 posizioni: frattura e pendolo',
    tema: 'difesa', fase: 'situazione',
    obiettivo: 'Difendere la prima fase da mischia gestendo frattura e spazio largo.',
    descrizione: 'Lavoro di reparto (~25’): mischia in 3 zone di campo diverse (sinistra, centro, destra) per variare gli spazi da difendere. L’attacco lancia il gioco con 3 giocatori di mischia + il 9 e i trasporti; la difesa cura il collegamento tra mischia e linea (la frattura) e la copertura larga con il pendolo (estremo e ali a triangolo allargato). L’allenatore alterna le consegne di lancio (A/B/C) per stimolare la lettura.',
    durata: 25, giocatori: '12-18 divisi in 2 gruppi omogenei', materiale: 'Palloni, casacche',
    spazio: 'Metà campo', varianti: 'Prima 2 canali di linea per lavorare la frattura, poi inserire gli altri (by-step); stessa logica da touche (zona 1, 2, 3).',
    coaching: 'Chiudere la frattura velocemente; riferimenti semplici; il pendolo copre il largo e il profondo; comunicazione costante.'
  }),
  _app({
    id: 'app-tec-tipi-calcio',
    titolo: 'Tipi di calcio: grubber, chip, punt e spiral',
    tema: 'kicking', fase: 'tecnica',
    obiettivo: 'Padroneggiare i diversi calci tattici e scegliere quello giusto.',
    descrizione: 'Stazioni tecniche sui calci: GRUBBER (palla leggermente inclinata indietro, colpire la parte alta, palla rasoterra), CHIP (palla verticale, colpire la punta, a scavalcare il difensore), PUNT (palla rilasciata sull’asse della gamba) e SPIRAL (palla rilasciata all’esterno del ginocchio, testa ferma, gamba estesa in linea col bersaglio). Chiudere con presa al volo, raccolta e stop del pallone con il piede.',
    durata: 15, giocatori: 'A coppie/terne', materiale: 'Palloni, coni bersaglio',
    spazio: 'Metà campo', varianti: 'Bersagli a punti; calcio dopo passaggio; sotto pressione leggera di un difensore.',
    coaching: 'Palla in due mani sotto la vita; occhi sul pallone e testa ferma; estensione completa verso il bersaglio; segui il calcio (kick-chase).'
  }),
  _app({
    id: 'app-tec-prop-mischia',
    titolo: 'Propedeutica della mischia: da 1v1 alla mischia ordinata',
    tema: 'mischia', fase: 'tecnica',
    obiettivo: 'Apprendere posizione, legature e spinta in un percorso graduale e sicuro.',
    descrizione: 'Progressione: 1v1 (postura, ingaggio sicuro, spinta), poi 1+1 v 1+1 e 2v2 curando le legature, aggiungendo giocatori per gradi fino alla mischia ordinata completa con sequenza di costruzione (tallonatore → piloni → seconde → terze → n.8) e ingaggio a comando. Adattare il numero di giocatori all’età e al vissuto.',
    durata: 15, giocatori: 'Dal 1v1 al pacchetto completo', materiale: 'Eventuale macchina/scudi',
    spazio: 'Zona dedicata', varianti: 'Solo prima linea; mischia a 5; lavorare la respirazione su “basso-lega-via”.',
    coaching: 'Schiena dritta e angoli corretti (gamba-coscia ~90-100°); legature solide; peso sulle punte; prevenire = posizione corretta prima dell’intensità.'
  }),
  _app({
    id: 'app-rep-breakdown3s',
    titolo: 'Breakdown veloce: palla giocabile sotto i 3 secondi',
    tema: 'ruck', fase: 'reparto',
    obiettivo: 'Velocizzare il punto d’incontro: contatto, pulizia e utilizzo rapidissimi.',
    descrizione: 'Dispositivo continuo: 1 portatore contro 1 placcatore, con recupero e sostegni che arrivano a ripulire. La regola guida (dagli appunti al Benetton): l’attacco deve rendere la palla giocabile sotto i 3 secondi; la difesa prova a tenerla ferma oltre. La pulizia va fatta quando i giocatori sono ancora in piedi. Inserire sempre competizione.',
    durata: 15, giocatori: '6-10 per dispositivo', materiale: 'Palloni, casacche',
    spazio: '15x15 m', varianti: 'Cronometrare ogni ruck ad alta voce; punti alla difesa se supera i 3 secondi; aggiungere il jackal.',
    coaching: 'Tutto parte dal portatore: se lavora bene servono meno sostegni; sostegni pochi ma efficaci; la velocità di pulizia fa la differenza.'
  }),

  /* ---- dalla cartella "spunti allenamenti da sistemare" ---- */
  _app({
    id: 'app-sit-3v2p1-colori',
    titolo: 'Riconoscere la situazione: 3v2+1 a colori',
    tema: 'attacco', fase: 'situazione',
    obiettivo: 'Riconoscere dove si apre lo spazio e attaccarlo prima che la difesa si ricomponga.',
    descrizione: 'Esercizio per 6 ragazzi. Gli attaccanti si passano il pallone; i difensori hanno un colore ciascuno. Al via, l’allenatore chiama uno dei colori: quel difensore deve correre a toccare il cuscino/cono dietro di sé prima di rientrare in gioco. Gli attaccanti devono spostare la palla nello spazio lasciato libero e giocare il 3v2+1 prima che il difensore rientri.',
    durata: 12, giocatori: '6', materiale: 'Coni/cuscini, casacche colorate, 1 pallone',
    spazio: '~15x20 m', varianti: 'Due colori chiamati in sequenza; il difensore rientra da posizioni diverse; limite di tempo per segnare.',
    coaching: 'Riconoscere la situazione e DOVE è lo spazio; palla veloce verso il lato debole; attaccare prima del rientro.'
  }),
  _app({
    id: 'app-rep-ruck-scelta',
    titolo: 'Ruck d’incontro: la scelta del sostegno',
    tema: 'ruck', fase: 'reparto',
    obiettivo: 'Insegnare al primo sostegno a leggere il portatore e scegliere la corsa giusta.',
    descrizione: 'Esercizio per 4 ragazzi in un campo 5x5: palla a terra di lato al gruppo, l’allenatore avvia con un passaggio e il portatore sfida il primo difensore. Il sostegno d’attacco legge: se il portatore è AVANZANTE va dritto e veloce sul pallone per giocarlo subito; se il portatore è BATTUTO dal placcaggio, gira più largo e profondo (sul cuscino lontano) per ricevere o ripulire in sicurezza. Il sostegno difensivo gira sempre sul primo cuscino.',
    durata: 12, giocatori: '4 per dispositivo', materiale: 'Cuscini/coni, 1 pallone',
    spazio: '5x5 m', varianti: 'Doppio sostegno; vietato comunicare a voce (solo lettura); aggiungere la contesa del difensore.',
    coaching: 'Leggere il portatore, non seguire a memoria; avanzante = pallone subito; battuto = giro e profondità.'
  }),
  _app({
    id: 'app-tec-portatore-grassi',
    titolo: 'Lavoro del portatore (da Paolo Grassi)',
    tema: 'attacco', fase: 'tecnica',
    obiettivo: 'Curare la sfida 1v1 del portatore e la trasformazione in sostegno dopo il contatto.',
    descrizione: 'Tre attaccanti si passano il pallone camminando. Al via dell’allenatore, chi ha la palla la passa e chi l’ha passata riceve il ritorno e sfida D1 per fare meta; il portatore placcato lascia la palla a terra, si rialza subito e fa il sostegno. Obiettivo: meta. Evoluzione: 6 attaccanti in fila che si passano la palla, 2 scudi sfalsati davanti e 4 difensori dietro; al via la palla va all’allenatore che la ridà a un attaccante: deve attaccare passando in mezzo agli scudi e poi giocare contro i difensori, con gli altri che seguono come sostegni.',
    durata: 12, giocatori: '4-10', materiale: 'Scudi, palloni, coni',
    spazio: '15x20 m', varianti: 'Variare l’angolo di sfida; difensori da semi-attivi ad attivi; vincolo di offload.',
    coaching: 'Sfida decisa e dritta; dopo il placcaggio rialzarsi subito (palla viva); il sostegno arriva sempre.'
  }),
  _app({
    id: 'app-att-10pass',
    titolo: 'Gioco dei 10 passaggi',
    tema: 'skill', fase: 'attivazione',
    obiettivo: 'Attivare mani, smarcamento e comunicazione sotto pressione leggera.',
    descrizione: 'Gioco di possesso: la squadra in attacco deve completare 10 passaggi consecutivi per fare punto, mentre gli avversari provano a intercettare (senza placcaggio). Si gioca anche a 3 squadre (G1 vs G2 vs G3) in turni da 3 minuti: chi perde palla esce, entra la squadra che aspettava. Variante: 5v3 con passaggi in tutte le direzioni.',
    durata: 10, giocatori: '8-15', materiale: 'Casacche, 1 pallone',
    spazio: '15x15 / 20x20 m', varianti: 'Passaggi solo in ritardo; limite di 2 secondi col pallone in mano; conteggio ad alta voce.',
    coaching: 'Muoversi per dare sempre 2 opzioni al portatore; comunicare; mani pronte e passaggi tesi.'
  }),
  _app({
    id: 'app-rep-vertice',
    titolo: 'Vertice: sfida e continuità 2v1',
    tema: 'attacco', fase: 'reparto',
    obiettivo: 'Fissare il difensore al vertice e giocare il 2v1 con continuità.',
    descrizione: 'Esercizio a vertice in serie da 3x4 minuti: il portatore attacca il cono-vertice, dove trova il difensore; lo fissa con la corsa e gioca il 2v1 con il compagno (push pass o spin). Dopo la prima sfida si continua l’azione (continuità) verso il secondo vertice. Rotazione continua dei ruoli.',
    durata: 12, giocatori: '3-6 per dispositivo', materiale: 'Coni, palloni',
    spazio: '15x15 m', varianti: 'Push pass obbligato; doppio vertice in sequenza; difensore da passivo ad attivo.',
    coaching: 'Correre AL vertice, non verso il compagno; fissare prima di passare; sostegno alla giusta profondità.'
  }),
  _app({
    id: 'app-tec-rombo-pi',
    titolo: 'Rombo: placcaggio, recupero e punto d’incontro',
    tema: 'difesa', fase: 'tecnica',
    obiettivo: 'Allenare placcaggio e recupero in circuito, poi la lotta al punto d’incontro.',
    descrizione: 'Circuito a rombo con 4 scudi ai vertici: si gira il rombo eseguendo a ogni vertice placcaggio + recupero (rialzarsi subito), in serie da 2-3 minuti. A seguire il lavoro si trasforma in punto d’incontro: 1+1 contro 1+1 (portatore con sostegno contro placcatore con contendente), serie da 5 minuti x4, propedeutica del placcaggio inclusa.',
    durata: 15, giocatori: 'A gruppi di 4-8', materiale: '4 scudi, palloni',
    spazio: '10x10 m', varianti: 'Cesto/cesting 1+1+1; senso di rotazione invertito; contesa libera sul pallone.',
    coaching: 'Placcaggio basso e rialzata immediata; nel P.I. arriva primo chi vince; qualità anche con la fatica.'
  }),
  _app({
    id: 'app-gioco-partita-dif',
    titolo: 'Partita difensiva: intervento, muro e salita',
    tema: 'difesa', fase: 'gioco',
    obiettivo: 'Applicare in partita i tre momenti della difesa: intervento, muro, salita.',
    descrizione: 'Partita condizionata con focus totale sulla difesa (es. difesa in superiorità: 9 contro 5+1): si lavora la qualità dell’intervento (placcaggio), la costruzione del muro dopo il punto d’incontro e la salita insieme. L’attacco gioca per muovere la difesa; la difesa viene premiata per recuperi, muri ricomposti e salite coordinate.',
    durata: 15, giocatori: '12-18', materiale: 'Casacche, palloni',
    spazio: 'Metà campo', varianti: 'Ridurre la superiorità difensiva fino alla parità; bonus per turnover; attacco con regole (es. solo gioco corto).',
    coaching: 'Intervento + muro + salita come un’unica catena; parlare sempre; dopo ogni placcaggio ricomporsi subito.'
  })
];
