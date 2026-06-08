/* Configurazione di base dell'app: temi, fasi di default, costanti.
   Caricato come script classico: espone tutto su window.RUGBY */
window.RUGBY = window.RUGBY || {};

RUGBY.VERSION = '1.0.0';
RUGBY.TARGET_MINUTES = 90; // durata standard seduta (1h30)

/* Temi / macro-fasi del gioco. id usato per filtrare gli esercizi. */
RUGBY.THEMES = [
  { id: 'attacco',      nome: 'Attacco',            colore: '#d62828' },
  { id: 'difesa',       nome: 'Difesa',             colore: '#1d4ed8' },
  { id: 'contrattacco', nome: 'Contrattacco',       colore: '#ea580c' },
  { id: 'touche',       nome: 'Touche',             colore: '#7c3aed' },
  { id: 'mischia',      nome: 'Mischia',            colore: '#475569' },
  { id: 'ruck',         nome: 'Ruck / Breakdown',   colore: '#b45309' },
  { id: 'maul',         nome: 'Maul',               colore: '#0f766e' },
  { id: 'kicking',      nome: 'Kicking game',       colore: '#0891b2' },
  { id: 'transizioni',  nome: 'Transizioni',        colore: '#c026d3' },
  { id: 'skill',        nome: 'Skill individuali',  colore: '#65a30d' },
];

/* Fasi di default della seduta. Sono CONFIGURABILI dall'utente
   (nome + minuti, aggiungi/rimuovi) ma questi sono i valori iniziali.
   tematica:true => la fase va riempita con esercizi del tema scelto;
   tematica:false => fase "neutra" (riscaldamento, tecnica, defaticamento). */
RUGBY.DEFAULT_PHASES = [
  { id: 'attivazione',   nome: 'Attivazione / riscaldamento',     minuti: 15, tematica: false },
  { id: 'tecnica',       nome: 'Tecnica individuale',             minuti: 15, tematica: false },
  { id: 'reparto',       nome: 'Skill di reparto / situazione',   minuti: 20, tematica: true  },
  { id: 'situazione',    nome: 'Situazione a tema',               minuti: 20, tematica: true  },
  { id: 'gioco',         nome: 'Gioco applicato / partita',       minuti: 15, tematica: true  },
  { id: 'defaticamento', nome: 'Defaticamento',                   minuti: 5,  tematica: false },
];

/* Helper di lookup */
RUGBY.themeById = function (id) {
  return RUGBY.THEMES.find(function (t) { return t.id === id; }) || null;
};
RUGBY.themeName = function (id) {
  var t = RUGBY.themeById(id);
  return t ? t.nome : (id || '—');
};
RUGBY.themeColor = function (id) {
  var t = RUGBY.themeById(id);
  return t ? t.colore : '#64748b';
};
