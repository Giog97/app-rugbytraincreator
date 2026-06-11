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
  { id: 'gioco',         nome: 'Gioco applicato / partita',       minuti: 20, tematica: true  },
];

/* ---- Numero giocatori: lettura del campo "giocatori" degli esercizi ----
   Restituisce {min,max} se il testo indica un numero/intervallo preciso,
   oppure null se l'esercizio è "flessibile" (tutta la squadra, a coppie,
   per gruppo/dispositivo/corridoio: si adatta a qualsiasi numero). */
RUGBY.parseGiocatori = function (txt) {
  var s = String(txt || '').toLowerCase();
  if (!s.trim()) return null;
  if (/squadra|tutti|coppi|tern|gruppo|gruppi|dispositiv|corridoio|canale|stazion|piacere|vogliamo|quanti/.test(s)) return null;
  var nums = s.match(/\d+/g);
  if (!nums) return null;
  var a = parseInt(nums[0], 10);
  var b = nums.length > 1 ? parseInt(nums[1], 10) : a;
  if (a > 40 || a < 2) return null;
  var min = Math.min(a, b), max = Math.max(a, b);
  if (max > 40) max = min;
  return { min: min, max: max };
};

/* Confronta i ragazzi disponibili (n) con l'esercizio.
   tipo: 'flex' (si adatta) | 'ok' (n nell'intervallo) | 'piu' | 'meno' */
RUGBY.fitGiocatori = function (txt, n) {
  n = Number(n) || 0;
  if (n <= 0) return null;
  var r = RUGBY.parseGiocatori(txt);
  if (!r) return { tipo: 'flex' };
  if (n >= r.min && n <= r.max) return { tipo: 'ok', range: r };
  if (n > r.max) return { tipo: 'piu', diff: n - r.max, range: r };
  return { tipo: 'meno', diff: r.min - n, range: r };
};

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
