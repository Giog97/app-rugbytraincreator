/* ===== Rugby Train Creator — logica applicazione (vanilla JS) =====
   Dipende da: config.js (RUGBY.*), db.js (RUGBY.DB), catalog.js (RUGBY.CATALOG) */
(function () {
  'use strict';
  var DB = RUGBY.DB;

  /* ---------- Stato ---------- */
  var state = {
    view: 'home',
    phases: null,           // configurazione fasi (da settings o default)
    userExercises: [],      // esercizi creati dall'utente
    sessions: [],           // sedute salvate
    // contesti temporanei
    detailId: null,
    detailFrom: 'library',
    playFilter: '',
    playDetailId: null,
    form: null,             // esercizio in modifica/creazione
    formImage: null,        // dataURL immagine corrente nel form
    libFilter: { tema: '', fase: '', q: '' },
    gen: null,              // stato generatore
    session: null,          // seduta in costruzione/visualizzazione
    sessionIsNew: false,
    picker: null            // { fIdx, all }
  };

  var installEvent = null; // beforeinstallprompt

  /* ---------- Helper ---------- */
  function by(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function uid(p) { return (p || 'id') + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36); }
  function todayISO() {
    var d = new Date(); var m = d.getMonth() + 1, g = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (g < 10 ? '0' : '') + g;
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-'); if (p.length !== 3) return iso;
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  function toast(msg) {
    var t = by('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------- Dati ---------- */
  function defaultPhases() {
    return RUGBY.DEFAULT_PHASES.map(function (p) {
      return { id: p.id, nome: p.nome, minuti: p.minuti, tematica: p.tematica };
    });
  }
  function allExercises() { return RUGBY.CATALOG.concat(state.userExercises); }
  function getExercise(id) {
    var all = allExercises();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function phasesTotal(phases) {
    return phases.reduce(function (s, p) { return s + (Number(p.minuti) || 0); }, 0);
  }

  /* Stazioni/gruppi: ogni fase della seduta ha f.gruppi (>=1) e f.stazioni
     (array di array di esercizi, uno per gruppo). Le sedute salvate prima
     di questa versione avevano f.esercizi piatto: qui vengono migrate. */
  function ensureStazioni(f) {
    if (!f.stazioni) { f.stazioni = [f.esercizi || []]; delete f.esercizi; }
    if (!f.gruppi || f.gruppi < 1) f.gruppi = f.stazioni.length || 1;
    while (f.stazioni.length < f.gruppi) f.stazioni.push([]);
    if (f.stazioni.length > f.gruppi) f.gruppi = f.stazioni.length;
    /* rotazione=true (default): i gruppi girano su tutte le stazioni (circuito);
       rotazione=false: ogni gruppo resta sul proprio lavoro (es. reparti separati) */
    if (f.rotazione === undefined) f.rotazione = true;
  }
  function grpLetter(i) { return String.fromCharCode(65 + i); } // A, B, C…
  function normalizeSession(s) {
    if (s && s.fasi) s.fasi.forEach(ensureStazioni);
    return s;
  }
  function sessionExCount(s) {
    return (s.fasi || []).reduce(function (a, f) {
      var st = f.stazioni || [f.esercizi || []];
      return a + st.reduce(function (x, arr) { return x + arr.length; }, 0);
    }, 0);
  }
  /* minuti per stazione: minuti della fase divisi per i gruppi */
  function stationMinutes(f) {
    var g = f.gruppi || 1;
    var m = Number(f.minuti) || 0;
    if (g <= 1) return null;
    var per = m / g;
    return { val: Math.round(per), esatto: m % g === 0 };
  }

  /* ragazzi per gruppo (testo nella testata della stazione) */
  function perRagazziText(f) {
    var s = state.session;
    var n = Number(s && s.ragazzi) || 0;
    var g = f.gruppi || 1;
    if (!n || g <= 1) return '';
    return ' · ≈' + Math.round(n / g) + ' ragazzi';
  }

  /* Nota di coinvolgimento: confronta i ragazzi disponibili (per gruppo)
     con quanti ne prevede l'esercizio. Tutti devono essere sempre coinvolti:
     se ce ne sono di più/meno, suggerisce come adattare. */
  function fitNoteContent(exId, fase) {
    var s = state.session;
    var n = Number(s && s.ragazzi) || 0;
    if (!n) return { cls: '', text: '' };
    var g = (fase && fase.gruppi) || 1;
    var per = g > 1 ? Math.round(n / g) : n;
    var ex = getExercise(exId);
    if (!ex) return { cls: '', text: '' };
    var f = RUGBY.fitGiocatori(ex.giocatori, per);
    if (!f) return { cls: '', text: '' };
    var chi = g > 1 ? per + ' per gruppo' : per + ' ragazzi';
    if (f.tipo === 'flex') return { cls: 'ok', text: '👥 ok: si adatta ai tuoi ' + chi };
    if (f.tipo === 'ok') return { cls: 'ok', text: '👥 ok per i tuoi ' + chi };
    if (f.tipo === 'piu') return { cls: 'warn', text: '👥 Hai ' + chi + ', l’esercizio ne prevede max ' + f.range.max + ' (+' + f.diff + '): allarga il dispositivo (un canale/stazione in più) o prevedi brevi rotazioni — più coinvolti = meno pause necessarie.' };
    return { cls: 'warn', text: '👥 Hai ' + chi + ', l’esercizio ne prevede almeno ' + f.range.min + ' (-' + f.diff + '): riduci spazi o numeri (es. un difensore in meno) per tenere tutti attivi.' };
  }

  /* aggiorna le note giocatori senza ridisegnare (per non perdere il focus) */
  function updatePlayerFits() {
    var s = state.session;
    if (!s) return;
    document.querySelectorAll('#view-root .fit-note').forEach(function (el) {
      var fi = Number(el.getAttribute('data-f'));
      var note = fitNoteContent(el.getAttribute('data-ex'), s.fasi[fi]);
      el.className = 'fit-note ' + note.cls;
      el.textContent = note.text;
    });
    document.querySelectorAll('#view-root .per-ragazzi').forEach(function (el) {
      var fi = Number(el.getAttribute('data-f'));
      el.textContent = perRagazziText(s.fasi[fi]);
    });
  }

  function load() {
    return DB.getSetting('phases').then(function (ph) {
      state.phases = (ph && ph.length) ? ph : defaultPhases();
      return DB.getAll('exercises');
    }).then(function (ex) {
      state.userExercises = ex || [];
      return DB.getAll('sessions');
    }).then(function (ss) {
      ss = ss || [];
      ss.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
      state.sessions = ss;
    });
  }

  /* ---------- Immagini ---------- */
  function fileToDataURL(file, maxSize, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.width, h = img.height;
        var scale = Math.min(1, maxSize / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality || 0.82));
      };
      img.onerror = function () { reject(new Error('Immagine non valida')); };
      img.src = url;
    });
  }

  /* ===================================================================
     RENDER
  =================================================================== */
  function render() {
    var root = by('view-root');
    var html = '';
    switch (state.view) {
      case 'home': html = viewHome(); break;
      case 'library': html = viewLibrary(); break;
      case 'detail': html = viewDetail(); break;
      case 'form': html = viewForm(); break;
      case 'generate': html = viewGenerate(); break;
      case 'session': html = viewSession(); break;
      case 'sessions': html = viewSessions(); break;
      case 'plays': html = viewPlays(); break;
      case 'playDetail': html = viewPlayDetail(); break;
      case 'tips': html = viewTips(); break;
      case 'settings': html = viewSettings(); break;
      default: html = viewHome();
    }
    root.innerHTML = html;
    if (state.picker) root.insertAdjacentHTML('beforeend', renderPicker());
    renderNav();
    window.scrollTo(0, 0);
  }

  function renderNav() {
    var items = [
      { v: 'home', ic: '🏠', l: 'Home' },
      { v: 'library', ic: '📚', l: 'Libreria' },
      { v: 'generate', ic: '✨', l: 'Genera' },
      { v: 'sessions', ic: '🗂️', l: 'Sedute' },
      { v: 'plays', ic: '📋', l: 'Giocate' },
      { v: 'tips', ic: '💡', l: 'Spunti' }
    ];
    var active = state.view;
    if (active === 'detail' || active === 'form') active = 'library';
    if (active === 'playDetail') active = 'plays';
    by('nav-root').innerHTML = items.map(function (it) {
      return '<button data-action="nav:' + it.v + '" class="' + (active === it.v ? 'active' : '') + '">' +
        '<span class="ic">' + it.ic + '</span>' + it.l + '</button>';
    }).join('');
  }

  /* ---------- HOME ---------- */
  function viewHome() {
    var nEx = allExercises().length;
    var nMine = state.userExercises.length;
    var nSess = state.sessions.length;
    return '<div class="view">' +
      '<div class="stat-row">' +
        '<div class="stat"><div class="n">' + nEx + '</div><div class="l">Esercizi</div></div>' +
        '<div class="stat"><div class="n">' + nMine + '</div><div class="l">Tuoi</div></div>' +
        '<div class="stat"><div class="n">' + nSess + '</div><div class="l">Sedute</div></div>' +
      '</div>' +
      '<div class="tiles">' +
        '<div class="tile full" data-action="nav:generate">' +
          '<div class="ic">✨</div><div class="t">Crea una seduta</div>' +
          '<div class="d">Scegli un tema e genera un allenamento da 1h30 pronto da modificare.</div></div>' +
        '<div class="tile" data-action="nav:library"><div class="ic">📚</div><div class="t">Libreria</div><div class="d">Esercizi pronti + i tuoi</div></div>' +
        '<div class="tile" data-action="ex:new"><div class="ic">➕</div><div class="t">Nuovo esercizio</div><div class="d">Aggiungi un esercizio</div></div>' +
        '<div class="tile" data-action="nav:sessions"><div class="ic">🗂️</div><div class="t">Le mie sedute</div><div class="d">Allenamenti salvati</div></div>' +
        '<div class="tile" data-action="nav:plays"><div class="ic">📋</div><div class="t">Schemi giocate</div><div class="d">Giocate 3/4 e mischia</div></div>' +
        '<div class="tile" data-action="nav:tips"><div class="ic">💡</div><div class="t">Spunti per allenare</div><div class="d">Il meglio del corso</div></div>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="hint">💡 Ogni seduta segue la tua struttura di fasi e punta a <strong>90 minuti</strong> totali. ' +
      'Puoi cambiare fasi e minuti in <strong>Opzioni</strong> (es. più gioco o più tecnica).</div>' +
    '</div>';
  }

  /* ---------- LIBRERIA ---------- */
  function themeChips(selected, action) {
    var chips = '<span class="chip ' + (!selected ? 'active' : '') + '" data-action="' + action + '" data-val="">Tutti</span>';
    chips += RUGBY.THEMES.map(function (t) {
      return '<span class="chip ' + (selected === t.id ? 'active' : '') + '" data-action="' + action + '" data-val="' + t.id + '">' + esc(t.nome) + '</span>';
    }).join('');
    return chips;
  }
  function phaseChips(selected, action) {
    var chips = '<span class="chip ' + (!selected ? 'active' : '') + '" data-action="' + action + '" data-val="">Tutte le fasi</span>';
    chips += state.phases.map(function (p) {
      return '<span class="chip ' + (selected === p.id ? 'active' : '') + '" data-action="' + action + '" data-val="' + esc(p.id) + '">' + esc(p.nome) + '</span>';
    }).join('');
    return chips;
  }

  function filteredExercises() {
    var f = state.libFilter;
    var q = (f.q || '').toLowerCase().trim();
    return allExercises().filter(function (e) {
      if (f.tema && e.tema !== f.tema) return false;
      if (f.fase && e.fase !== f.fase) return false;
      if (q) {
        var hay = (e.titolo + ' ' + (e.obiettivo || '') + ' ' + (e.descrizione || '')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function exerciseCard(e) {
    var phase = state.phases.find(function (p) { return p.id === e.fase; });
    var img = e.immagine
      ? '<img class="ex-thumb" src="' + e.immagine + '" alt="schema">'
      : '<div class="ex-noimg">Nessuno schema — tocca per aggiungerlo</div>';
    return '<div class="card click ex-card" data-action="ex:open" data-id="' + esc(e.id) + '">' +
      '<div class="top"><div class="grow"><h3>' + esc(e.titolo) + '</h3>' +
        '<span class="badge" style="background:' + RUGBY.themeColor(e.tema) + '">' + esc(RUGBY.themeName(e.tema)) + '</span> ' +
        (e.origine === 'catalogo' ? (e.fonte === 'appunti' ? '<span class="badge soft">📓 Dai tuoi appunti</span>' : '<span class="badge soft">Catalogo</span>') : '<span class="badge soft">Mio</span>') +
      '</div></div>' +
      '<div class="ex-meta"><span>⏱️ ' + (e.durata || '?') + ' min</span><span>👥 ' + esc(e.giocatori || '—') + '</span>' +
        (phase ? '<span>🏉 ' + esc(phase.nome) + '</span>' : '') + '</div>' +
      img +
    '</div>';
  }

  function libraryListHTML() {
    var list = filteredExercises();
    if (!list.length) {
      return '<div class="empty"><div class="big">🔍</div>Nessun esercizio trovato.<br>Prova a cambiare filtri o creane uno nuovo.</div>';
    }
    return list.map(exerciseCard).join('');
  }

  function viewLibrary() {
    return '<div class="view">' +
      '<div class="row between"><h2 class="section-title">Libreria esercizi</h2>' +
        '<button class="btn primary sm" data-action="ex:new">➕ Nuovo</button></div>' +
      '<input type="search" placeholder="Cerca esercizio…" value="' + esc(state.libFilter.q) + '" data-role="lib-search">' +
      '<div class="spacer"></div>' +
      '<div class="chips">' + themeChips(state.libFilter.tema, 'lib:tema') + '</div>' +
      '<div class="chips">' + phaseChips(state.libFilter.fase, 'lib:fase') + '</div>' +
      '<div class="spacer"></div>' +
      '<div id="lib-list">' + libraryListHTML() + '</div>' +
    '</div>';
  }

  /* ---------- DETTAGLIO ESERCIZIO ---------- */
  function viewDetail() {
    var e = getExercise(state.detailId);
    if (!e) return '<div class="view"><div class="empty">Esercizio non trovato.</div></div>';
    var phase = state.phases.find(function (p) { return p.id === e.fase; });
    var isMine = e.origine !== 'catalogo';

    function block(title, val) {
      if (!val) return '';
      return '<div class="detail-block"><h4>' + title + '</h4><p>' + esc(val) + '</p></div>';
    }

    var actions = isMine
      ? '<button class="btn" data-action="ex:edit" data-id="' + esc(e.id) + '">✏️ Modifica</button>' +
        '<button class="btn danger" data-action="ex:delete" data-id="' + esc(e.id) + '">🗑️ Elimina</button>'
      : '<button class="btn" data-action="ex:duplicate" data-id="' + esc(e.id) + '">📋 Duplica per modificare</button>';

    return '<div class="view">' +
      '<span class="back-link" data-action="back:detail">← Indietro</span>' +
      '<div class="card">' +
        '<h2 class="section-title" style="margin-bottom:8px">' + esc(e.titolo) + '</h2>' +
        '<div class="row"><span class="badge" style="background:' + RUGBY.themeColor(e.tema) + '">' + esc(RUGBY.themeName(e.tema)) + '</span>' +
          (phase ? '<span class="badge soft">' + esc(phase.nome) + '</span>' : '') +
          '<span class="badge soft">' + (e.origine === 'catalogo' ? (e.fonte === 'appunti' ? '📓 Dai tuoi appunti' : 'Catalogo') : 'Mio') + '</span></div>' +
        '<div class="spacer"></div>' +
        (e.immagine ? '<img class="detail-img" src="' + e.immagine + '" alt="schema esercizio">' :
          '<div class="ex-noimg" style="aspect-ratio:16/9">Nessuno schema visivo caricato</div>') +
        '<div class="spacer"></div>' +
        '<div class="kv">' +
          '<div><div class="k">Durata</div><div class="v">' + (e.durata || '?') + ' min</div></div>' +
          '<div><div class="k">Giocatori</div><div class="v">' + esc(e.giocatori || '—') + '</div></div>' +
          '<div><div class="k">Materiale</div><div class="v">' + esc(e.materiale || '—') + '</div></div>' +
          '<div><div class="k">Spazio</div><div class="v">' + esc(e.spazio || '—') + '</div></div>' +
        '</div>' +
        '<hr class="hr">' +
        block('Obiettivo', e.obiettivo) +
        block('Descrizione', e.descrizione) +
        block('Varianti / progressioni', e.varianti) +
        block('Punti di coaching', e.coaching) +
        '<div class="row">' + actions + '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- FORM ESERCIZIO ---------- */
  function viewForm() {
    var e = state.form || {};
    var isEdit = !!e.id;
    function opt(val, label, sel) { return '<option value="' + esc(val) + '"' + (sel === val ? ' selected' : '') + '>' + esc(label) + '</option>'; }
    var temaOpts = RUGBY.THEMES.map(function (t) { return opt(t.id, t.nome, e.tema); }).join('');
    var faseOpts = state.phases.map(function (p) { return opt(p.id, p.nome, e.fase); }).join('');

    var imgArea = state.formImage
      ? '<img class="detail-img" id="f-img-preview" src="' + state.formImage + '" alt="anteprima"><button type="button" class="btn danger sm" data-action="ex:img-remove">Rimuovi immagine</button>'
      : '<div class="ex-noimg" id="f-img-preview" style="aspect-ratio:16/9">Nessuna immagine</div>';

    return '<div class="view">' +
      '<span class="back-link" data-action="back:form">← Annulla</span>' +
      '<h2 class="section-title">' + (isEdit ? 'Modifica esercizio' : 'Nuovo esercizio') + '</h2>' +
      '<div class="card">' +
        fld('Titolo <span class="req">*</span>', '<input id="f-titolo" value="' + esc(e.titolo) + '" placeholder="Es. Linea d’attacco 3 contro 2">') +
        '<div class="field-2">' +
          fld('Tema / macro-fase', '<select id="f-tema">' + temaOpts + '</select>') +
          fld('Fase della seduta', '<select id="f-fase">' + faseOpts + '</select>') +
        '</div>' +
        fld('Obiettivo', '<textarea id="f-obiettivo" placeholder="Cosa allena questo esercizio">' + esc(e.obiettivo) + '</textarea>') +
        fld('Descrizione a parole', '<textarea id="f-descrizione" style="min-height:120px" placeholder="Spiegazione dell’esercizio, svolgimento, regole…">' + esc(e.descrizione) + '</textarea>') +
        '<div class="field-2">' +
          fld('Durata (min)', '<input id="f-durata" type="number" min="1" max="60" value="' + esc(e.durata || '') + '">') +
          fld('N° giocatori', '<input id="f-giocatori" value="' + esc(e.giocatori) + '" placeholder="Es. 12-15">') +
        '</div>' +
        '<div class="field-2">' +
          fld('Materiale', '<input id="f-materiale" value="' + esc(e.materiale) + '" placeholder="Coni, palloni, scudi…">') +
          fld('Spazio / dimensioni', '<input id="f-spazio" value="' + esc(e.spazio) + '" placeholder="Es. 30x20 m">') +
        '</div>' +
        fld('Varianti / progressioni', '<textarea id="f-varianti">' + esc(e.varianti) + '</textarea>') +
        fld('Punti di coaching', '<textarea id="f-coaching">' + esc(e.coaching) + '</textarea>') +
        '<label class="field"><span>Schema visivo (immagine)</span>' +
          imgArea +
          '<div class="spacer"></div>' +
          '<input type="file" accept="image/*" data-role="ex-image"></label>' +
        '<div class="spacer"></div>' +
        '<div class="row"><button class="btn primary grow" data-action="ex:save">💾 Salva esercizio</button>' +
          '<button class="btn ghost" data-action="back:form">Annulla</button></div>' +
      '</div>' +
    '</div>';
  }
  function fld(label, control) { return '<label class="field"><span>' + label + '</span>' + control + '</label>'; }

  /* ---------- GENERATORE ---------- */
  function initGen() {
    state.gen = {
      tema: 'attacco',
      nome: '',
      data: todayISO(),
      ragazzi: '',
      phases: state.phases.map(function (p) { return { id: p.id, nome: p.nome, minuti: p.minuti, tematica: p.tematica }; })
    };
  }
  function viewGenerate() {
    if (!state.gen) initGen();
    var g = state.gen;
    var tot = phasesTotal(g.phases);
    var phaseRows = g.phases.map(function (p, i) {
      return '<div class="row between" style="margin-bottom:8px">' +
        '<div class="grow"><strong>' + esc(p.nome) + '</strong>' + (p.tematica ? ' <span class="badge soft">a tema</span>' : '') + '</div>' +
        '<input type="number" min="0" max="60" style="width:84px" value="' + (p.minuti) + '" data-role="gen-min" data-idx="' + i + '"> <span class="muted">min</span>' +
      '</div>';
    }).join('');

    return '<div class="view">' +
      '<h2 class="section-title">Crea una seduta</h2>' +
      '<div class="card">' +
        '<label class="field"><span>Tema principale della seduta</span></label>' +
        '<div class="chips">' + RUGBY.THEMES.map(function (t) {
          return '<span class="chip ' + (g.tema === t.id ? 'active' : '') + '" data-action="gen:tema" data-val="' + t.id + '">' + esc(t.nome) + '</span>';
        }).join('') + '</div>' +
        '<div class="spacer"></div>' +
        '<div class="field-2">' +
          fld('Nome seduta', '<input id="g-nome" value="' + esc(g.nome) + '" placeholder="Es. ' + esc(RUGBY.themeName(g.tema)) + ' – settimana 1" data-role="gen-nome">') +
          fld('Data', '<input id="g-data" type="date" value="' + esc(g.data) + '" data-role="gen-data">') +
        '</div>' +
        fld('N° ragazzi disponibili (facoltativo)', '<input id="g-ragazzi" type="number" min="2" max="60" value="' + esc(g.ragazzi) + '" placeholder="Es. 18" data-role="gen-ragazzi">') +
        '<p class="muted" style="font-size:.78rem;margin:2px 0 0">Se lo indichi, scelgo gli esercizi più adatti al numero e ti segnalo dove servono piccoli adattamenti per <strong>coinvolgere sempre tutti</strong>.</p>' +
      '</div>' +
      '<div class="card">' +
        '<div class="row between"><strong>Durata delle fasi</strong><button class="btn sm ghost" data-action="gen:reset-min">↺ Default</button></div>' +
        '<p class="muted" style="font-size:.8rem;margin:6px 0 12px">Regola i minuti per dare più spazio al gioco o alla tecnica. Le fasi “a tema” vengono riempite con esercizi di <strong>' + esc(RUGBY.themeName(g.tema)) + '</strong>.</p>' +
        phaseRows +
        '<div class="total-bar ' + (tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn') + '" style="position:static;margin-top:10px">' +
          '<span>Totale</span><strong>' + tot + ' / ' + RUGBY.TARGET_MINUTES + ' min</strong></div>' +
      '</div>' +
      '<button class="btn primary block" data-action="gen:run">✨ Genera seduta</button>' +
      '<div class="spacer"></div>' +
      '<div class="hint">Verrà creata una bozza con un esercizio per fase, che potrai modificare, sostituire o ampliare prima di salvare.</div>' +
    '</div>';
  }

  function candidatesForPhase(phase, tema) {
    var pool = allExercises().filter(function (e) { return e.fase === phase.id; });
    if (phase.tematica && tema) {
      var themed = pool.filter(function (e) { return e.tema === tema; });
      if (themed.length) return themed;
    }
    return pool;
  }
  function pick(arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }
  function slotFrom(e) { return e ? { id: e.id, titolo: e.titolo, tema: e.tema, fase: e.fase } : null; }

  /* Scelta pesata sul numero di ragazzi: preferisce gli esercizi che
     coinvolgono tutti (o sono adattabili), altrimenti quello più vicino. */
  function pickForPlayers(cands, n) {
    if (!n || !cands.length) return pick(cands);
    var scored = cands.map(function (e) {
      var f = RUGBY.fitGiocatori(e.giocatori, n);
      var score = (!f || f.tipo === 'ok' || f.tipo === 'flex') ? 0 : f.diff;
      return { e: e, score: score };
    });
    var best = scored.reduce(function (m, x) { return Math.min(m, x.score); }, Infinity);
    return pick(scored.filter(function (x) { return x.score === best; }).map(function (x) { return x.e; }));
  }

  function generateSession() {
    var g = state.gen;
    var n = Number(g.ragazzi) || 0;
    var fasi = g.phases.map(function (p) {
      var chosen = pickForPlayers(candidatesForPhase(p, g.tema), n);
      return {
        id: p.id, nome: p.nome, minuti: Number(p.minuti) || 0, tematica: p.tematica,
        gruppi: 1, stazioni: [chosen ? [slotFrom(chosen)] : []]
      };
    });
    return {
      id: uid('sess'),
      nome: g.nome || (RUGBY.themeName(g.tema) + ' – ' + fmtDate(g.data)),
      data: g.data, tema: g.tema, ragazzi: n || null, createdAt: Date.now(), note: '', fasi: fasi
    };
  }

  /* ---------- SEDUTA (costruttore/visualizzatore) ---------- */
  function viewSession() {
    var s = state.session;
    if (!s) return '<div class="view"><div class="empty">Nessuna seduta.</div></div>';
    var tot = phasesTotal(s.fasi);
    var cls = tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn';

    s.fasi.forEach(ensureStazioni);

    function slotHTML(slot, i, gi, j) {
      var ex = getExercise(slot.id);
      var title = ex ? ex.titolo : (slot.titolo + ' (non più in libreria)');
      var note = fitNoteContent(slot.id, s.fasi[i]);
      return '<div class="slot">' +
        '<div class="s-main">' +
          '<div class="s-title">' + esc(title) + '</div>' +
          '<div class="s-sub"><span class="badge" style="background:' + RUGBY.themeColor(slot.tema) + ';font-size:.66rem">' + esc(RUGBY.themeName(slot.tema)) + '</span>' +
          (ex ? ' · ' + esc(ex.giocatori || '') : '') + '</div>' +
          '<div class="fit-note ' + note.cls + '" data-ex="' + esc(slot.id) + '" data-f="' + i + '">' + esc(note.text) + '</div>' +
        '</div>' +
        (ex ? '<button class="btn sm ghost no-print" data-action="sess:view-ex" data-id="' + esc(slot.id) + '">👁️</button>' : '') +
        '<button class="btn sm ghost no-print" data-action="sess:swap" data-f="' + i + '" data-g="' + gi + '" data-j="' + j + '">🔁</button>' +
        '<button class="btn sm ghost no-print" data-action="sess:remove" data-f="' + i + '" data-g="' + gi + '" data-j="' + j + '">✕</button>' +
      '</div>';
    }

    var phasesHTML = s.fasi.map(function (f, i) {
      var g = f.gruppi || 1;
      var rot = f.rotazione !== false;
      var perMin = stationMinutes(f);

      function stationHTML(arr, gi) {
        var slots = arr.length
          ? arr.map(function (slot, j) { return slotHTML(slot, i, gi, j); }).join('')
          : '<div class="slot empty">Nessun esercizio</div>';
        var headLabel = rot ? '🔁 Stazione ' + (gi + 1) : '🏉 Gruppo ' + grpLetter(gi);
        var headMin = (g > 1 && perMin)
          ? (rot ? (perMin.esatto ? '' : '~') + perMin.val + ' min' : (Number(f.minuti) || 0) + ' min')
          : '';
        return '<div class="station">' +
          (g > 1 ? '<div class="station-head"><span>' + headLabel + '<span class="per-ragazzi" data-f="' + i + '">' + perRagazziText(f) + '</span></span>' +
            '<span class="min">' + headMin + '</span></div>' : '') +
          slots +
          '<button class="btn sm ghost no-print" data-action="sess:add" data-f="' + i + '" data-g="' + gi + '">➕ Aggiungi</button>' +
        '</div>';
      }

      var body;
      if (g > 1) {
        var lettere = [];
        for (var li = 0; li < g; li++) lettere.push(grpLetter(li));
        var hint = rot
          ? '🔁 I gruppi (' + lettere.join(', ') + ') <strong>ruotano su ' + g + ' stazioni</strong>: ogni stazione dura ' + (perMin.esatto ? '' : '~') + perMin.val + ' min e tutti i ragazzi fanno tutti gli esercizi.'
          : '🧩 ' + g + ' gruppi <strong>in parallelo senza rotazione</strong>: ognuno resta sul proprio lavoro per ' + (Number(f.minuti) || 0) + ' min (es. reparti separati).';
        body = '<div class="row no-print" style="gap:6px;margin:0 0 8px">' +
            '<span class="chip ' + (rot ? 'active' : '') + '" data-action="sess:mode" data-f="' + i + '" data-rot="1">🔁 Stazioni in rotazione</span>' +
            '<span class="chip ' + (!rot ? 'active' : '') + '" data-action="sess:mode" data-f="' + i + '" data-rot="0">🧩 Gruppi separati</span>' +
          '</div>' +
          '<div class="rotation-hint">' + hint + '</div>' +
          '<div class="stations g' + Math.min(g, 6) + '">' + f.stazioni.map(stationHTML).join('') + '</div>';
      } else {
        body = stationHTML(f.stazioni[0], 0);
      }

      var grpOpts = '';
      for (var n = 1; n <= 6; n++) {
        grpOpts += '<option value="' + n + '"' + (g === n ? ' selected' : '') + '>' + (n === 1 ? '1 gruppo' : n + ' gruppi') + '</option>';
      }

      return '<div class="phase">' +
        '<div class="ph-head"><span class="ph-num">' + (i + 1) + '</span>' +
          '<span class="ph-title">' + esc(f.nome) + '</span>' +
          '<div class="ph-controls no-print">' +
            '<input type="number" min="0" max="60" style="width:66px" value="' + f.minuti + '" data-role="sess-min" data-idx="' + i + '" title="Minuti della fase">' +
            '<select data-role="sess-gruppi" data-idx="' + i + '" title="Dividi in gruppi">' + grpOpts + '</select>' +
          '</div>' +
          '<span class="ph-min" style="display:none">' + f.minuti + ' min' + (g > 1 ? ' · ' + g + ' gruppi' : '') + '</span>' +
        '</div>' +
        '<div class="ph-body">' + body + '</div>' +
      '</div>';
    }).join('');

    return '<div class="view">' +
      '<span class="back-link no-print" data-action="' + (state.sessionIsNew ? 'nav:generate' : 'nav:sessions') + '">← Indietro</span>' +
      '<div class="card">' +
        '<input style="font-size:1.1rem;font-weight:700;border:none;padding:4px 0" value="' + esc(s.nome) + '" data-role="sess-nome">' +
        '<div class="row" style="margin-top:6px;align-items:center"><span class="badge" style="background:' + RUGBY.themeColor(s.tema) + '">Tema: ' + esc(RUGBY.themeName(s.tema)) + '</span>' +
          '<span class="badge soft">📅 ' + esc(fmtDate(s.data)) + '</span>' +
          '<span class="badge soft ragazzi-badge">👥 <input type="number" min="0" max="60" value="' + (s.ragazzi || '') + '" placeholder="n°" data-role="sess-ragazzi" class="no-print"> ragazzi</span></div>' +
      '</div>' +
      phasesHTML +
      '<div class="total-bar ' + cls + '"><span>Totale seduta</span><strong>' + tot + ' / ' + RUGBY.TARGET_MINUTES + ' min</strong></div>' +
      '<div class="spacer"></div>' +
      '<div class="row no-print">' +
        '<button class="btn primary grow" data-action="sess:save">💾 Salva seduta (+ PDF)</button>' +
        '<button class="btn accent" data-action="sess:share">📤 Condividi</button>' +
        '<button class="btn" data-action="sess:print" title="Stampa">🖨️</button>' +
        (state.sessionIsNew ? '' : '<button class="btn danger" data-action="sess:delete" data-id="' + esc(s.id) + '">🗑️</button>') +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div class="hint no-print">💾 <strong>Salva</strong> archivia la seduta nell’app e scarica il <strong>PDF completo</strong> (schemi, descrizioni e punti di coaching di ogni esercizio). 📤 <strong>Condividi</strong> apre il menu del telefono per inviarlo ad es. su WhatsApp.</div>' +
    '</div>';
  }

  function renderPicker() {
    var p = state.picker;
    var f = state.session.fasi[p.fIdx];
    var phaseCfg = { id: f.id, tematica: f.tematica };
    var grpLabel = (f.gruppi || 1) > 1
      ? (f.rotazione !== false ? ' · Stazione ' + (p.gIdx + 1) : ' · Gruppo ' + grpLetter(p.gIdx))
      : '';
    var cands = p.all ? allExercises() : candidatesForPhase(phaseCfg, state.session.tema);
    var listHTML = cands.length ? cands.map(function (e) {
      return '<div class="card click" data-action="pick:choose" data-id="' + esc(e.id) + '">' +
        '<strong>' + esc(e.titolo) + '</strong><br>' +
        '<span class="badge" style="background:' + RUGBY.themeColor(e.tema) + ';font-size:.66rem">' + esc(RUGBY.themeName(e.tema)) + '</span> ' +
        '<span class="muted" style="font-size:.78rem">' + (e.durata || '?') + ' min · ' + esc(e.giocatori || '') + '</span></div>';
    }).join('') : '<div class="empty">Nessun esercizio per questa fase.</div>';

    return '<div class="picker-overlay" style="position:fixed;inset:0;z-index:60;background:rgba(15,23,42,.5);display:flex;align-items:flex-end;justify-content:center" data-action="pick:close-bg">' +
      '<div style="background:#fff;width:100%;max-width:880px;max-height:84vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px" data-stop="1">' +
        '<div class="row between"><h3 style="margin:0">Scegli esercizio — ' + esc(f.nome) + esc(grpLabel) + '</h3>' +
          '<button class="btn sm ghost" data-action="pick:close">✕</button></div>' +
        '<div class="spacer"></div>' +
        '<div class="row"><button class="btn sm ' + (p.all ? '' : 'primary') + '" data-action="pick:filt" data-all="0">Consigliati</button>' +
          '<button class="btn sm ' + (p.all ? 'primary' : '') + '" data-action="pick:filt" data-all="1">Tutta la libreria</button></div>' +
        '<div class="spacer"></div>' + listHTML +
      '</div></div>';
  }

  /* ---------- SEDUTE SALVATE ---------- */
  function viewSessions() {
    if (!state.sessions.length) {
      return '<div class="view"><h2 class="section-title">Le mie sedute</h2>' +
        '<div class="empty"><div class="big">🗂️</div>Nessuna seduta salvata.<br>' +
        '<button class="btn primary" style="margin-top:12px" data-action="nav:generate">✨ Crea la prima seduta</button></div></div>';
    }
    var cards = state.sessions.map(function (s) {
      var tot = phasesTotal(s.fasi);
      var nEx = sessionExCount(s);
      return '<div class="card click" data-action="sess:open" data-id="' + esc(s.id) + '">' +
        '<div class="row between"><strong>' + esc(s.nome) + '</strong>' +
          '<span class="badge" style="background:' + RUGBY.themeColor(s.tema) + '">' + esc(RUGBY.themeName(s.tema)) + '</span></div>' +
        '<div class="ex-meta"><span>📅 ' + esc(fmtDate(s.data)) + '</span><span>⏱️ ' + tot + ' min</span><span>🏉 ' + nEx + ' esercizi</span>' + (s.ragazzi ? '<span>👥 ' + s.ragazzi + '</span>' : '') + '</div>' +
      '</div>';
    }).join('');
    return '<div class="view"><div class="row between"><h2 class="section-title">Le mie sedute</h2>' +
      '<button class="btn primary sm" data-action="nav:generate">✨ Nuova</button></div>' + cards + '</div>';
  }

  /* ---------- GIOCATE ---------- */
  function playTypeName(t) { return t === 'mischia' ? 'Mischia' : '3/4'; }
  function playTypeColor(t) { return t === 'mischia' ? '#7c3aed' : '#2563eb'; }

  function playsLegend() {
    return '<div class="legend-box">' +
      '<span class="li"><span class="dot" style="background:#2563eb"></span> 3/4</span>' +
      '<span class="li"><span class="dot" style="background:#7c3aed"></span> Mischia</span>' +
      '<span class="li"><span class="sw" style="background:#16a34a"></span> Passaggio</span>' +
      '<span class="li"><span class="sw" style="background:#e11d48"></span> Corsa</span>' +
      '<span class="li"><span class="sw" style="background:#f59e0b"></span> Calcio</span>' +
      '<span class="li"><span class="dot" style="background:#0f172a"></span> Difesa/opzioni</span>' +
    '</div>';
  }

  function viewPlays() {
    var f = state.playFilter;
    var plays = (RUGBY.PLAYS || []).filter(function (p) { return !f || p.tipo === f; });
    var chips = '<div class="chips">' +
      '<span class="chip ' + (!f ? 'active' : '') + '" data-action="play:filt" data-val="">Tutte</span>' +
      '<span class="chip ' + (f === 'trequarti' ? 'active' : '') + '" data-action="play:filt" data-val="trequarti">Giocate 3/4</span>' +
      '<span class="chip ' + (f === 'mischia' ? 'active' : '') + '" data-action="play:filt" data-val="mischia">Giocate mischia</span>' +
    '</div>';
    var cards = plays.length ? plays.map(function (p) {
      return '<div class="card click play-card" data-action="play:open" data-id="' + esc(p.id) + '">' +
        '<div class="row between"><h3>' + esc(p.nome) + '</h3>' +
          '<span class="badge" style="background:' + playTypeColor(p.tipo) + '">' + playTypeName(p.tipo) + '</span></div>' +
        '<div class="ex-meta"><span>🏁 ' + esc(p.situazione) + '</span></div>' +
        (p.immagine ? '<img class="play-img" src="' + p.immagine + '" alt="schema giocata" loading="lazy">' : '') +
      '</div>';
    }).join('') : '<div class="empty"><div class="big">📋</div>Nessuna giocata in questa categoria.</div>';

    return '<div class="view">' +
      '<h2 class="section-title">Schemi giocate</h2>' +
      '<p class="muted" style="font-size:.85rem;margin:0 0 12px">Le giocate della squadra, classificate per reparto. Il principio: dare al portatore più opzioni possibili per mettere la difesa nel dubbio.</p>' +
      playsLegend() + chips + '<div class="spacer"></div>' + cards +
    '</div>';
  }

  function viewPlayDetail() {
    var p = (RUGBY.PLAYS || []).find(function (x) { return x.id === state.playDetailId; });
    if (!p) return '<div class="view"><div class="empty">Giocata non trovata.</div></div>';
    function block(t, v) { return v ? '<div class="detail-block"><h4>' + t + '</h4><p>' + esc(v) + '</p></div>' : ''; }
    return '<div class="view">' +
      '<span class="back-link" data-action="nav:plays">← Tutte le giocate</span>' +
      '<div class="card">' +
        '<div class="row between"><h2 class="section-title" style="margin:0">' + esc(p.nome) + '</h2>' +
          '<span class="badge" style="background:' + playTypeColor(p.tipo) + '">' + playTypeName(p.tipo) + '</span></div>' +
        '<div class="spacer"></div>' +
        (p.immagine ? '<img class="detail-img" src="' + p.immagine + '" alt="schema giocata">' : '') +
        playsLegend() +
        '<div class="kv">' +
          '<div><div class="k">Situazione</div><div class="v">' + esc(p.situazione) + '</div></div>' +
          '<div><div class="k">Reparto</div><div class="v">' + playTypeName(p.tipo) + '</div></div>' +
        '</div>' +
        '<hr class="hr">' +
        block('Movimenti', p.descrizione) +
        block('Quando usarla', p.quando) +
        block('Punti chiave', p.punti) +
      '</div>' +
    '</div>';
  }

  /* ---------- SPUNTI PER ALLENARE ---------- */
  function viewTips() {
    var groups = (RUGBY.TIPS || []).map(function (g, i) {
      var items = g.punti.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('');
      var quote = g.citazione ? '<div class="tip-quote">' + esc(g.citazione) + '</div>' : '';
      return '<div class="tip-group"><details' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="ic">' + g.icona + '</span> ' + esc(g.titolo) + '<span class="arr">›</span></summary>' +
        '<div class="tip-body">' + quote + '<ul>' + items + '</ul></div>' +
      '</details></div>';
    }).join('');
    return '<div class="view">' +
      '<h2 class="section-title">Spunti per allenare</h2>' +
      '<p class="muted" style="font-size:.85rem;margin:0 0 14px">Il riassunto degli appunti del corso allenatori: i principi essenziali per allenare bene e costruire un allenamento ottimale.</p>' +
      groups +
    '</div>';
  }

  /* ---------- IMPOSTAZIONI ---------- */
  function viewSettings() {
    var tot = phasesTotal(state.phases);
    var rows = state.phases.map(function (p, i) {
      return '<div class="card" style="padding:10px">' +
        '<div class="row" style="align-items:center">' +
          '<input class="grow" value="' + esc(p.nome) + '" data-role="set-nome" data-idx="' + i + '">' +
          '<input type="number" min="0" max="60" style="width:74px" value="' + p.minuti + '" data-role="set-min" data-idx="' + i + '">' +
          '<button class="btn sm danger" data-action="set:remove" data-idx="' + i + '">✕</button>' +
        '</div>' +
        '<label class="row" style="margin-top:8px;align-items:center;gap:6px;font-size:.82rem;color:var(--testo-soft)">' +
          '<input type="checkbox" style="width:auto" ' + (p.tematica ? 'checked' : '') + ' data-role="set-tema" data-idx="' + i + '"> Fase “a tema” (riempita con esercizi del tema scelto)</label>' +
      '</div>';
    }).join('');

    var canInstall = !!installEvent;
    return '<div class="view">' +
      '<h2 class="section-title">Opzioni</h2>' +

      '<h3 style="margin:6px 0">Struttura della seduta</h3>' +
      '<p class="muted" style="font-size:.82rem;margin:0 0 12px">Queste fasi sono il modello di ogni nuova seduta. Modifica nomi e minuti, aggiungi o togli fasi.</p>' +
      rows +
      '<button class="btn sm" data-action="set:add">➕ Aggiungi fase</button>' +
      '<div class="total-bar ' + (tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn') + '" style="position:static;margin-top:12px"><span>Totale modello</span><strong>' + tot + ' / ' + RUGBY.TARGET_MINUTES + ' min</strong></div>' +
      '<div class="spacer"></div>' +
      '<div class="row"><button class="btn primary grow" data-action="set:save">💾 Salva struttura</button>' +
        '<button class="btn ghost" data-action="set:reset">↺ Ripristina default</button></div>' +

      '<hr class="hr">' +
      '<h3 style="margin:6px 0">Dati & backup</h3>' +
      '<p class="muted" style="font-size:.82rem;margin:0 0 10px">I dati sono salvati solo su questo dispositivo. Esporta per fare un backup o spostarli su un altro dispositivo.</p>' +
      '<div class="row"><button class="btn" data-action="data:export">⬇️ Esporta dati</button>' +
        '<button class="btn" data-action="data:import">⬆️ Importa dati</button></div>' +
      '<input type="file" accept="application/json" id="import-file" style="display:none" data-role="import-file">' +

      '<hr class="hr">' +
      '<h3 style="margin:6px 0">App</h3>' +
      (canInstall ? '<button class="btn accent block" data-action="app:install">📲 Installa app sul dispositivo</button><div class="spacer"></div>' :
        '<div class="hint">Per installarla sul telefono: aprila nel browser e usa “Aggiungi a schermata Home” (o l’icona di installazione nella barra degli indirizzi sul PC).</div>') +
      '<div class="spacer"></div>' +
      '<p class="center muted" style="font-size:.75rem">Rugby Train Creator v' + RUGBY.VERSION + '</p>' +
    '</div>';
  }

  /* ===================================================================
     AZIONI (click delegati)
  =================================================================== */
  function readForm() {
    return {
      titolo: by('f-titolo').value.trim(),
      tema: by('f-tema').value,
      fase: by('f-fase').value,
      obiettivo: by('f-obiettivo').value.trim(),
      descrizione: by('f-descrizione').value.trim(),
      durata: Number(by('f-durata').value) || null,
      giocatori: by('f-giocatori').value.trim(),
      materiale: by('f-materiale').value.trim(),
      spazio: by('f-spazio').value.trim(),
      varianti: by('f-varianti').value.trim(),
      coaching: by('f-coaching').value.trim()
    };
  }

  function onClick(ev) {
    var t = ev.target.closest('[data-action]');
    // chiusura picker cliccando sullo sfondo
    if (!t) return;
    var action = t.getAttribute('data-action');
    var id = t.getAttribute('data-id');

    // navigazione
    if (action.indexOf('nav:') === 0) { go(action.slice(4)); return; }

    switch (action) {
      /* esercizi */
      case 'ex:new': state.form = blankExercise(); state.formImage = null; go('form'); break;
      case 'ex:open': state.detailId = id; state.detailFrom = state.view; go('detail'); break;
      case 'ex:edit': {
        var e = getExercise(id); state.form = Object.assign({}, e); state.formImage = e.immagine || null; go('form'); break;
      }
      case 'ex:duplicate': {
        var src = getExercise(id);
        state.form = Object.assign({}, src, { id: null, titolo: src.titolo + ' (copia)', origine: 'utente' });
        state.formImage = src.immagine || null; go('form'); break;
      }
      case 'ex:delete': confirmDelete(id); break;
      case 'ex:save': saveExercise(); break;
      case 'ex:img-remove': state.formImage = null; render(); break;
      case 'back:detail': go(state.detailFrom === 'session' ? 'session' : 'library'); break;
      case 'back:form': go(state.form && state.form.id ? 'detail' : 'library'); break;

      /* libreria filtri */
      case 'lib:tema': state.libFilter.tema = t.getAttribute('data-val'); render(); break;
      case 'lib:fase': state.libFilter.fase = t.getAttribute('data-val'); render(); break;

      /* giocate */
      case 'play:filt': state.playFilter = t.getAttribute('data-val'); render(); break;
      case 'play:open': state.playDetailId = id; go('playDetail'); break;

      /* generatore */
      case 'gen:tema': state.gen.tema = t.getAttribute('data-val'); render(); break;
      case 'gen:reset-min': state.gen.phases = state.phases.map(function (p) { return { id: p.id, nome: p.nome, minuti: p.minuti, tematica: p.tematica }; }); render(); break;
      case 'gen:run': state.session = generateSession(); state.sessionIsNew = true; go('session'); break;

      /* seduta */
      case 'sess:open': openSession(id); break;
      case 'sess:save': saveSession(t); break;
      case 'sess:share': shareSession(t); break;
      case 'sess:delete': deleteSession(id); break;
      case 'sess:print': window.print(); break;
      case 'sess:view-ex': state.detailId = id; state.detailFrom = 'session'; go('detail'); break;
      case 'sess:mode': {
        var fm = state.session.fasi[Number(t.getAttribute('data-f'))];
        fm.rotazione = t.getAttribute('data-rot') === '1';
        render(); break;
      }
      case 'sess:add': state.picker = { fIdx: Number(t.getAttribute('data-f')), gIdx: Number(t.getAttribute('data-g')) || 0, mode: 'add', all: false }; render(); break;
      case 'sess:swap': state.picker = { fIdx: Number(t.getAttribute('data-f')), gIdx: Number(t.getAttribute('data-g')) || 0, jIdx: Number(t.getAttribute('data-j')), mode: 'swap', all: false }; render(); break;
      case 'sess:remove': removeSlot(Number(t.getAttribute('data-f')), Number(t.getAttribute('data-g')) || 0, Number(t.getAttribute('data-j'))); break;

      /* picker */
      case 'pick:close': case 'pick:close-bg': if (action === 'pick:close' || !ev.target.closest('[data-stop]')) { state.picker = null; render(); } break;
      case 'pick:filt': state.picker.all = t.getAttribute('data-all') === '1'; render(); break;
      case 'pick:choose': pickChoose(id); break;

      /* impostazioni */
      case 'set:add': state.phases.push({ id: uid('fase'), nome: 'Nuova fase', minuti: 10, tematica: false }); render(); break;
      case 'set:remove': state.phases.splice(Number(t.getAttribute('data-idx')), 1); render(); break;
      case 'set:save': DB.setSetting('phases', state.phases).then(function () { toast('Struttura salvata ✓'); }); break;
      case 'set:reset': state.phases = defaultPhases(); DB.setSetting('phases', state.phases); render(); toast('Ripristinata struttura di default'); break;
      case 'data:export': exportData(); break;
      case 'data:import': by('import-file').click(); break;
      case 'app:install': doInstall(); break;
    }
  }

  function onInput(ev) {
    var t = ev.target;
    var role = t.getAttribute('data-role');
    if (!role) return;
    var idx = Number(t.getAttribute('data-idx'));
    switch (role) {
      case 'lib-search':
        state.libFilter.q = t.value;
        var box = by('lib-list'); if (box) box.innerHTML = libraryListHTML();
        break;
      case 'ex-image': handleImage(t.files && t.files[0]); break;
      case 'gen-nome': state.gen.nome = t.value; break;
      case 'gen-data': state.gen.data = t.value; break;
      case 'gen-ragazzi': state.gen.ragazzi = t.value; break;
      case 'gen-min': state.gen.phases[idx].minuti = Number(t.value) || 0; updateGenTotal(); break;
      case 'sess-min': state.session.fasi[idx].minuti = Number(t.value) || 0; updateSessTotal(); updateStationMins(idx); break;
      case 'sess-gruppi': setPhaseGroups(idx, Number(t.value) || 1); break;
      case 'sess-nome': state.session.nome = t.value; break;
      case 'sess-ragazzi': state.session.ragazzi = Number(t.value) || null; updatePlayerFits(); break;
      case 'set-nome': state.phases[idx].nome = t.value; break;
      case 'set-min': state.phases[idx].minuti = Number(t.value) || 0; updateSetTotal(); break;
      case 'set-tema': state.phases[idx].tematica = t.checked; break;
      case 'import-file': if (t.files && t.files[0]) importData(t.files[0]); break;
    }
  }

  function updateGenTotal() {
    var tot = phasesTotal(state.gen.phases);
    var bar = document.querySelector('#view-root .total-bar');
    if (bar) { bar.querySelector('strong').textContent = tot + ' / ' + RUGBY.TARGET_MINUTES + ' min'; bar.className = 'total-bar ' + (tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn'); bar.style.position = 'static'; }
  }
  function updateSessTotal() {
    var tot = phasesTotal(state.session.fasi);
    var bar = document.querySelector('#view-root .total-bar');
    if (bar) { bar.querySelector('strong').textContent = tot + ' / ' + RUGBY.TARGET_MINUTES + ' min'; bar.className = 'total-bar ' + (tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn'); }
  }
  /* aggiorna i minuti per stazione mostrati quando cambiano i minuti della fase */
  function updateStationMins(idx) {
    var f = state.session.fasi[idx];
    if (!f || (f.gruppi || 1) <= 1) return;
    var rot = f.rotazione !== false;
    var per = stationMinutes(f);
    var phases = document.querySelectorAll('#view-root .phase');
    var ph = phases[idx];
    if (!ph || !per) return;
    var chipTxt = rot ? (per.esatto ? '' : '~') + per.val + ' min' : (Number(f.minuti) || 0) + ' min';
    ph.querySelectorAll('.station-head .min').forEach(function (el) { el.textContent = chipTxt; });
    var hint = ph.querySelector('.rotation-hint');
    if (hint) {
      var lettere = [];
      for (var li = 0; li < f.gruppi; li++) lettere.push(grpLetter(li));
      hint.innerHTML = rot
        ? '🔁 I gruppi (' + lettere.join(', ') + ') <strong>ruotano su ' + f.gruppi + ' stazioni</strong>: ogni stazione dura ' + (per.esatto ? '' : '~') + per.val + ' min e tutti i ragazzi fanno tutti gli esercizi.'
        : '🧩 ' + f.gruppi + ' gruppi <strong>in parallelo senza rotazione</strong>: ognuno resta sul proprio lavoro per ' + (Number(f.minuti) || 0) + ' min (es. reparti separati).';
    }
  }
  /* cambia il numero di gruppi di una fase: se diminuisce, gli esercizi
     delle stazioni in eccesso vengono accodati all'ultima stazione rimasta */
  function setPhaseGroups(idx, n) {
    var f = state.session.fasi[idx];
    if (!f) return;
    n = Math.max(1, Math.min(6, n));
    ensureStazioni(f);
    if (n < f.stazioni.length) {
      var extra = f.stazioni.slice(n).reduce(function (a, b) { return a.concat(b); }, []);
      f.stazioni = f.stazioni.slice(0, n);
      f.stazioni[n - 1] = f.stazioni[n - 1].concat(extra);
    } else {
      while (f.stazioni.length < n) f.stazioni.push([]);
    }
    f.gruppi = n;
    render();
  }
  function updateSetTotal() {
    var tot = phasesTotal(state.phases);
    var bar = document.querySelector('#view-root .total-bar');
    if (bar) { bar.querySelector('strong').textContent = tot + ' / ' + RUGBY.TARGET_MINUTES + ' min'; bar.className = 'total-bar ' + (tot === RUGBY.TARGET_MINUTES ? 'ok' : 'warn'); bar.style.position = 'static'; }
  }

  /* ---------- operazioni esercizio ---------- */
  function blankExercise() {
    return { id: null, titolo: '', tema: 'attacco', fase: state.phases[0] ? state.phases[0].id : 'attivazione',
      obiettivo: '', descrizione: '', durata: '', giocatori: '', materiale: '', spazio: '', varianti: '', coaching: '', origine: 'utente' };
  }
  function handleImage(file) {
    if (!file) return;
    fileToDataURL(file, 1400, 0.82).then(function (d) { state.formImage = d; render(); })
      .catch(function () { toast('Impossibile leggere l’immagine'); });
  }
  function saveExercise() {
    var data = readForm();
    if (!data.titolo) { toast('Inserisci almeno il titolo'); return; }
    var ex = Object.assign({}, state.form, data, { immagine: state.formImage || null, origine: 'utente' });
    if (!ex.id) ex.id = uid('ex');
    ex.updatedAt = Date.now();
    DB.put('exercises', ex).then(function () {
      var i = state.userExercises.findIndex(function (x) { return x.id === ex.id; });
      if (i >= 0) state.userExercises[i] = ex; else state.userExercises.push(ex);
      state.detailId = ex.id; state.detailFrom = 'library';
      toast('Esercizio salvato ✓'); go('detail');
    });
  }
  function confirmDelete(id) {
    if (!window.confirm('Eliminare questo esercizio? L’azione non è reversibile.')) return;
    DB.delete('exercises', id).then(function () {
      state.userExercises = state.userExercises.filter(function (x) { return x.id !== id; });
      toast('Esercizio eliminato'); go('library');
    });
  }

  /* ---------- operazioni seduta ---------- */
  function openSession(id) {
    var s = state.sessions.find(function (x) { return x.id === id; });
    if (!s) return;
    state.session = normalizeSession(JSON.parse(JSON.stringify(s)));
    state.sessionIsNew = false; go('session');
  }
  function saveSession(btn) {
    var s = normalizeSession(state.session);
    if (btn) btn.disabled = true;
    DB.put('sessions', s).then(function () {
      var i = state.sessions.findIndex(function (x) { return x.id === s.id; });
      if (i >= 0) state.sessions[i] = s; else state.sessions.unshift(s);
      state.sessionIsNew = false;
      toast('Seduta salvata ✓ — sto creando il PDF…');
      // genera e scarica il PDF completo della seduta
      return RUGBY.PDF.download(s, getExercise).then(function (fname) {
        toast('PDF scaricato: ' + fname + ' ✓');
      }).catch(function () {
        toast('Seduta salvata, ma non sono riuscito a creare il PDF');
      });
    }).then(function () { go('sessions'); })
      .catch(function () { if (btn) btn.disabled = false; toast('Errore nel salvataggio'); });
  }

  function shareSession(btn) {
    var s = state.session;
    if (!s) return;
    if (btn) btn.disabled = true;
    toast('Sto preparando il PDF da condividere…');
    RUGBY.PDF.share(s, getExercise).then(function (esito) {
      if (btn) btn.disabled = false;
      if (esito === 'shared') toast('Condiviso ✓');
      else if (esito === 'downloaded') toast('Qui non posso aprire la condivisione: PDF scaricato, allegalo tu (es. su WhatsApp)');
      // 'cancelled': l'utente ha chiuso il menu, nessun messaggio
    }).catch(function () {
      if (btn) btn.disabled = false;
      toast('Non sono riuscito a creare il PDF');
    });
  }
  function deleteSession(id) {
    if (!window.confirm('Eliminare questa seduta?')) return;
    DB.delete('sessions', id).then(function () {
      state.sessions = state.sessions.filter(function (x) { return x.id !== id; });
      toast('Seduta eliminata'); go('sessions');
    });
  }
  function removeSlot(f, g, j) {
    var fase = state.session.fasi[f];
    ensureStazioni(fase);
    fase.stazioni[g].splice(j, 1);
    render();
  }
  function pickChoose(exId) {
    var ex = getExercise(exId); if (!ex) return;
    var p = state.picker; var f = state.session.fasi[p.fIdx];
    ensureStazioni(f);
    var arr = f.stazioni[p.gIdx] || f.stazioni[0];
    if (p.mode === 'swap') arr[p.jIdx] = slotFrom(ex); else arr.push(slotFrom(ex));
    state.picker = null; render();
  }

  /* ---------- export / import ---------- */
  function exportData() {
    var payload = { app: 'rugbytraincreator', version: RUGBY.VERSION, exportedAt: new Date().toISOString(),
      phases: state.phases, exercises: state.userExercises, sessions: state.sessions };
    download('rugbytrain-backup-' + todayISO() + '.json', JSON.stringify(payload, null, 2));
    toast('Backup esportato ✓');
  }
  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (!data || data.app !== 'rugbytraincreator') throw new Error('file');
        if (!window.confirm('Importare i dati dal backup? Gli esercizi e le sedute con lo stesso identificativo verranno sovrascritti.')) return;
        var chain = Promise.resolve();
        (data.exercises || []).forEach(function (ex) { chain = chain.then(function () { return DB.put('exercises', ex); }); });
        (data.sessions || []).forEach(function (ss) { chain = chain.then(function () { return DB.put('sessions', ss); }); });
        if (data.phases) chain = chain.then(function () { return DB.setSetting('phases', data.phases); });
        chain.then(load).then(function () { toast('Dati importati ✓'); go('settings'); });
      } catch (e) { toast('File di backup non valido'); }
    };
    r.readAsText(file);
  }

  /* ---------- install PWA ---------- */
  function doInstall() {
    if (!installEvent) { toast('Installazione non disponibile qui'); return; }
    installEvent.prompt();
    installEvent.userChoice.then(function () { installEvent = null; render(); });
  }

  /* ---------- routing ---------- */
  function go(view) {
    if (view === 'generate' && !state.gen) initGen();
    if (view === 'library') { /* keep filters */ }
    state.view = view; state.picker = null; render();
  }

  /* ===================================================================
     INIT
  =================================================================== */
  function init() {
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onInput);
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); installEvent = e;
      if (state.view === 'settings') render();
    });
    load().then(function () { render(); }).catch(function (err) {
      by('view-root').innerHTML = '<div class="empty">Errore di avvio: ' + esc(err.message) + '</div>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
