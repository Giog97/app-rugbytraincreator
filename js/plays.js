/* Schemi giocate della squadra — estratti dai playbook dell'allenatore:
   "Giocate 3/4 Florentia Rugby U17" e "Giocate U16 stagione 2023/2024".
   tipo: 'trequarti' | 'mischia'
   Diagrammi in assets/plays/<id>.svg (tools/generate_plays.py) con la
   legenda colori dei playbook: verde=passaggio, rosa=corsa, giallo=calcio,
   blu=giocatore dei 3/4, viola=giocatore della mischia, nero=difesa/opzioni. */
window.RUGBY = window.RUGBY || {};

function _pl(o) { o.immagine = 'assets/plays/' + o.id + '.svg'; return o; }

RUGBY.PLAYS = [
  /* ===================== GIOCATE CON LA MISCHIA (pod / avanti) ===================== */
  _pl({
    id: 'viola', nome: 'Viola', tipo: 'mischia',
    situazione: 'Dopo una ruck',
    descrizione: 'Il 9 può passare: a un pod di 3 giocatori di mischia, che può sfidare o fare una basket; oppure a un play in asse dietro al pod.',
    quando: 'Giocata che TUTTI devono conoscere. Dopo una ruck, per riorganizzare l’attacco con gli avanti davanti e un play dietro. Gioca direttamente il 9.',
    punti: 'Pod compatto con il centrale avanzato; il play sta in asse dietro al pod; chi porta decide in base alla difesa (sfida o basket).'
  }),
  _pl({
    id: 'rossa', nome: 'Rossa (U17: Parigi)', tipo: 'mischia',
    situazione: 'Dopo una ruck',
    descrizione: 'Il 9 passa al 10. Il 10 può passare: a un pod di 3 giocatori di mischia, che può sfidare o fare una basket; oppure a un play (un 3/4 qualsiasi) che gioca fuori.',
    quando: 'Giocata che TUTTI devono conoscere. Come la Viola ma con un passaggio in più: la palla passa dal 10, che sceglie pod o play.',
    punti: 'Differenza chiave con la Viola: gioca il 10, non il 9. Il pod fissa la difesa, il play attacca lo spazio fuori.'
  }),
  _pl({
    id: 'basket', nome: 'Basket', tipo: 'mischia',
    situazione: 'Continuazione di Viola o Rossa',
    descrizione: 'Dopo una Viola o una Rossa, il giocatore centrale del pod passa la palla a un play (un giocatore con buone mani, di solito un 3/4) che gioca la palla fuori. Il play può passare: a un penetrante (il 13) o al play del penetrante (il 15).',
    quando: 'Seconda onda dell’attacco con i pod: la palla esce dal pod e va al largo con doppia opzione.',
    punti: 'Il play va scelto tra chi ha buone mani; il 13 penetra, il 15 gira dietro/fuori al 13: doppia opzione per mettere in dubbio la difesa.'
  }),
  _pl({
    id: 'pizza', nome: 'Pizza', tipo: 'mischia',
    situazione: 'Calcio di punizione vicino alla meta avversaria',
    descrizione: 'Punizione battuta veloce a 10/15 m dalla meta, davanti ai pali: il 9 innesca le cariche ravvicinate del gruppo di avanti, con un play inserito. Se la difesa si stringe, opzioni larghe: il 12 a sinistra e il 14 a destra.',
    quando: 'Da calcio di punizione vicino alla linea di meta avversaria, per sfruttare la velocità di battuta prima che la difesa si organizzi.',
    punti: 'Battere veloce; cariche compatte e basse davanti ai pali; tenere vive le opzioni larghe se la difesa si chiude in mezzo.'
  }),
  _pl({
    id: 'freccia', nome: 'Freccia', tipo: 'mischia',
    situazione: 'Da mischia',
    descrizione: 'L’otto si stacca dalla mischia con due opzioni: penetrante (il primo centro) o play (l’apertura). Il play ha a sua volta altre due opzioni: penetrante (il secondo centro) o play (l’estremo).',
    quando: 'Lancio del gioco da mischia con l’8 protagonista: due ondate di opzioni a catena.',
    punti: 'L’8 legge il fianco della mischia; ogni portatore ha sempre due opzioni (penetrante o play): è la difesa a scegliere, e a sbagliare.'
  }),

  /* ===================== GIOCATE DEI 3/4 ===================== */
  _pl({
    id: 'australia', nome: 'Australia', tipo: 'trequarti',
    situazione: 'Dopo una ruck',
    descrizione: 'Il 9 passa al 10. Il 10 effettua un calcio-passaggio a chi è in posizione di ala dalla parte opposta.',
    quando: 'Dopo una ruck, quando la difesa è schierata e stretta: si scavalca tutta la linea per servire l’ala opposta.',
    punti: 'Calcio teso e preciso sull’ala; l’ala parte sul tempo del calcio; gli altri risalgono a sostegno.'
  }),
  _pl({
    id: 'bar-open-elite', nome: 'Bar Open Élite', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Il 9 passa al 10. Il 10 può sfidare o passare al 12, che a sua volta può sfidare o passare a: l’11 che attacca l’interno, il 13 che attacca alto, il 15 dietro al 13. Il 15 può anche mettersi in posizione di play dietro al 12.',
    quando: 'Da touche, per mettere in dubbio la salita difensiva con una catena di opzioni sul primo e secondo ricevitore.',
    punti: 'Ogni portatore ha più opzioni reali: la scelta dipende da come salgono i difensori; corse decise per fissare.'
  }),
  _pl({
    id: 'open-bar', nome: 'Open Bar', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Il 9 passa direttamente al 12 (saltando il 10). Il 12 può sfidare o passare a: l’11 che attacca l’interno, oppure il 10 che è girato al largo e può sfidare o passare al 13 che attacca alto o al 15 dietro al 13.',
    quando: 'Variante speculare della Bar Open Élite: palla diretta al 12 con il 10 che gira fuori da secondo play.',
    punti: 'Nota dal playbook: il 13 prende il tempo sul 10 e il 14 prende il tempo sul 13. Il giro del 10 deve partire subito.'
  }),
  _pl({
    id: 'ventidue', nome: '22 (ex Berna)', tipo: 'trequarti',
    situazione: 'Da mischia (in tutti i punti del campo)',
    descrizione: 'Il 9 passa al 10. Il 10 taglia per fare una X con il 12 e può: sfidare, passare al 12 sull’incrocio, passare al 13 che fa il penetrante all’altezza, o passare al 15 che fa il play dietro al 13. L’ala dalla chiusa è il jolly: non coinvolta direttamente, fa il sostegno a ogni opzione.',
    quando: 'Da ogni mischia: incrocio al centro con ventaglio di opzioni dietro.',
    punti: 'Dal playbook: l’11 fa l’interno di tutti; il 12 passa vicino al 10, non profondo; il 15 prende la palla dietro il 13; dopo la X il 13 è alto, all’altezza del 10; il 14 prende il tempo dal 13 o dal 15 in base alla situazione.'
  }),
  _pl({
    id: 'malpa', nome: 'Malpa', tipo: 'trequarti',
    situazione: 'Duello al piede / gioco aperto',
    descrizione: 'Dopo una serie di calci da una parte all’altra tra le due squadre, chi la chiama esegue un up-and-under con tutta la linea dei 3/4 che sale a mettere pressione.',
    quando: 'Per uscire dal duello di calci trasformandolo in pressione organizzata e riconquista.',
    punti: 'Di solito a coprire dietro ci sono il 10 e il 15: uno dei due chiama la giocata per far salire l’altro a recuperare il pallone.'
  }),
  _pl({
    id: 'melbourne', nome: 'Melbourne', tipo: 'trequarti',
    situazione: 'Da touche o dopo una ruck',
    descrizione: 'Il 9 passa al 10. Il 10 effettua un calcetto a scavalcare in zona L2, tra il 12 e il 13 avversari. Il 12 e il 15 salgono per recuperare il pallone.',
    quando: 'Quando la zona dietro la linea difensiva (L2) non è coperta: si attacca lo spazio con il piede e recupero programmato.',
    punti: 'Avvertenza dal playbook: se il 9 avversario copre bene L2 meglio non calciare — dobbiamo essere sicuri di poter recuperare il pallone.'
  }),
  _pl({
    id: 'pesaro', nome: 'Pesaro', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Versione da touche della Melbourne: il 9 passa al 10, che calcia un calcetto oltre la linea (in L2) esattamente tra il 12 e il 13 avversari; i compagni salgono organizzati al recupero mentre l’11 scivola dietro a coprire il fondo.',
    quando: 'Da touche, quando i centri avversari salgono forte e lo spazio alle loro spalle resta libero.',
    punti: 'Recupero organizzato (12-13-15 sulle corsie); chi calcia ripiega; copertura ridisegnata dietro con l’11.'
  }),
  _pl({
    id: 'pene-play', nome: 'Pene-Play', tipo: 'trequarti',
    situazione: 'Nel gioco (da punto d’incontro) o da touche',
    descrizione: 'Penetrante + play: il 9 passa al 10, che ha sempre due opzioni: il passaggio corto al penetrante che attacca l’intervallo tra i due difensori, oppure il passaggio più profondo al play dietro (con l’11 o il 12 che arrivano lanciati).',
    quando: 'Struttura-base riutilizzabile ovunque: nel gioco aperto da un punto d’incontro o come lancio da touche.',
    punti: 'Le due opzioni devono essere entrambe vere: penetrante che attacca forte l’intervallo, play lanciato dietro. Decide il portatore leggendo il primo difensore.'
  }),
  _pl({
    id: 'doppio', nome: 'Doppio', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Il 9 passa al 10, palla corta sul 12 che sale al punto d’opzione; da lì rilascio dietro per il 13 che arriva lanciato dall’esterno, mentre l’11 fa il giro completo come uomo in più.',
    quando: 'Da touche, per attaccare due volte lo stesso intervallo: prima con il corto, poi con il rilascio sul 13 lanciato.',
    punti: 'Il 13 parte profondo e arriva sul punto già in velocità; il giro dell’11 dà sempre un’opzione in più; il 15 e il 14 tengono larga la difesa.'
  }),
  _pl({
    id: 'tripla', nome: 'Tripla', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Come il Doppio, ma il primo passaggio del 9 è lungo, direttamente sul punto d’opzione sopra il 12; il 10 converge sul 12 e la palla esce dietro per il 13 lanciato, con l’11 in giro.',
    quando: 'Variante del Doppio per accelerare il gioco: un tempo di passaggio in meno.',
    punti: 'Il nome indica i tre uomini coinvolti prima del rilascio; servono mani sicure sul lancio lungo del 9.'
  }),
  _pl({
    id: 'balsamo', nome: 'Balsamo', tipo: 'trequarti',
    situazione: 'Da mischia',
    descrizione: 'Dalla mischia la palla esce dall’8/9 con un lancio sul punto d’opzione dove sale il 10. Attorno a quel punto convergono tre linee di corsa: il 12 taglia dentro, il 13 attacca dritto subito fuori, il 15 arriva da dietro e gira all’esterno del 13. Il 14 sale largo.',
    quando: 'Da mischia, per mettere i difensori esterni davanti a tre scelte simultanee.',
    punti: 'Le tre corse devono arrivare insieme sul punto: dentro (12), dritto (13), fuori (15). I difensori esterni vengono messi in dubbio dalle linee convergenti/divergenti.'
  }),
  _pl({
    id: 'libano', nome: 'Libano', tipo: 'trequarti',
    situazione: 'Da touche',
    descrizione: 'Il 9 passa al 10, scambio corto sul 12 che sale dritto da penetrante; l’11 parte da dietro, percorre tutta la larghezza alle spalle di 10 e 12 e sbuca all’esterno del 12 come uomo in più immediato. Il 13 sale dritto più al largo.',
    quando: 'Da touche, per scaricare il dubbio sul terzo difensore: corto dentro o uomo in più fuori.',
    punti: 'Il giro dell’11 è il cuore della giocata: deve essere nascosto e arrivare in velocità; il 12 penetrante deve impegnare davvero la difesa.'
  }),
  _pl({
    id: 'gori', nome: 'Gori', tipo: 'trequarti',
    situazione: 'In preparazione (dal playbook: "ancora da aggiungere")',
    descrizione: 'I due centri attaccano alti, con l’opzione piede dietro la linea se la difesa sale forte.',
    quando: 'Contro difese che salgono aggressive sui centri.',
    punti: 'Giocata annotata nel playbook come da completare: definire chi calcia e chi recupera.'
  })
];
