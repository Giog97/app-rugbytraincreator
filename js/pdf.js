/* Generazione PDF della seduta + condivisione (Web Share API).
   Dipende da js/vendor/jspdf.umd.min.js (window.jspdf.jsPDF).
   Espone RUGBY.PDF.download(session, resolveEx) e RUGBY.PDF.share(session, resolveEx):
   resolveEx(id) -> oggetto esercizio completo oppure null. */
window.RUGBY = window.RUGBY || {};

RUGBY.PDF = (function () {
  'use strict';

  /* colori */
  var VERDE = [20, 83, 45];
  var SCURO = [15, 23, 42];
  var GRIGIO = [100, 116, 139];
  var LINEA = [226, 232, 240];

  var MARGIN = 14;
  var PAGE_W = 210, PAGE_H = 297;
  var CONTENT_W = PAGE_W - MARGIN * 2;
  var BOTTOM = 282;          // limite contenuto (sotto c'è il piè di pagina)
  var IMG_W = 88, IMG_H = 55; // proporzione 1.6 come gli schemi 400x250

  /* jsPDF usa font standard (WinAnsi): sostituisco i caratteri fuori set */
  function tx(s) {
    return String(s == null ? '' : s)
      .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—]/g, '-').replace(/…/g, '...')
      .replace(/·/g, '-').replace(/→/g, '->').replace(/←/g, '<-')
      .replace(/✓/g, 'ok').replace(/⚠/g, '!').replace(/[«»]/g, '"');
  }

  function slug(s) {
    return String(s || 'seduta').toLowerCase()
      .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
      .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'seduta';
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : GRIGIO;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var p = String(iso).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }

  /* Rasterizza un'immagine (SVG del catalogo o dataURL utente) in JPEG
     dentro un riquadro 1200x750 su fondo bianco, preservando le proporzioni. */
  function rasterize(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var img = new Image();
      var t = setTimeout(function () { resolve(null); }, 8000);
      img.onload = function () {
        clearTimeout(t);
        try {
          var W = 1200, H = 750;
          var c = document.createElement('canvas');
          c.width = W; c.height = H;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
          var iw = img.naturalWidth || 400, ih = img.naturalHeight || 250;
          var r = Math.min(W / iw, H / ih);
          var w = iw * r, h = ih * r;
          ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
          resolve(c.toDataURL('image/jpeg', 0.85));
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { clearTimeout(t); resolve(null); };
      img.src = src;
    });
  }

  /* ---------- costruzione del documento ---------- */
  function build(session, resolveEx) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      return Promise.reject(new Error('Libreria PDF non caricata'));
    }
    // risolvi gli esercizi e prepara le immagini
    // (compatibile sia con f.stazioni — gruppi in parallelo — sia col vecchio f.esercizi)
    function stazioniDi(f) { return f.stazioni || [f.esercizi || []]; }
    var entries = [];
    (session.fasi || []).forEach(function (f, fi) {
      stazioniDi(f).forEach(function (arr, gi) {
        arr.forEach(function (slot) {
          var ex = resolveEx ? resolveEx(slot.id) : null;
          entries.push({ fi: fi, gi: gi, slot: slot, ex: ex, img: null });
        });
      });
    });

    return Promise.all(entries.map(function (en) {
      var src = en.ex ? en.ex.immagine : null;
      return rasterize(src).then(function (jpeg) { en.img = jpeg; });
    })).then(function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
      var y;

      function setFill(rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
      function setText(rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }
      function setDraw(rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }

      function newPage() { doc.addPage(); y = MARGIN + 2; }
      function ensure(h) { if (y + h > BOTTOM) newPage(); }

      /* scrive un paragrafo con a-capo e cambio pagina sicuro */
      function paragraph(label, text, size) {
        if (!text) return;
        size = size || 9.5;
        var lh = size * 0.45;
        ensure(lh * 2 + 4);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7.6);
        setText(GRIGIO);
        doc.text(tx(label).toUpperCase(), MARGIN, y);
        y += 3.6;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(size);
        setText(SCURO);
        var lines = doc.splitTextToSize(tx(text), CONTENT_W);
        for (var i = 0; i < lines.length; i++) {
          ensure(lh);
          doc.text(lines[i], MARGIN, y);
          y += lh;
        }
        y += 2.2;
      }

      /* ===== intestazione (pagina 1) ===== */
      setFill(VERDE);
      doc.rect(0, 0, PAGE_W, 34, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('RUGBY TRAIN CREATOR', MARGIN, 9);
      doc.setFontSize(17);
      var titolo = doc.splitTextToSize(tx(session.nome || 'Seduta di allenamento'), CONTENT_W);
      doc.text(titolo[0], MARGIN, 18);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
      var tot = (session.fasi || []).reduce(function (a, f) { return a + (Number(f.minuti) || 0); }, 0);
      var nEx = entries.length;
      var temaNome = RUGBY.themeName(session.tema);
      doc.text(tx('Data: ' + fmtDate(session.data) + '   -   Tema: ' + temaNome +
        '   -   Durata: ' + tot + ' min   -   Esercizi: ' + nEx), MARGIN, 26);
      y = 42;

      /* ===== note seduta (se presenti) ===== */
      if (session.note) paragraph('Note', session.note);

      /* ===== fasi ed esercizi ===== */
      (session.fasi || []).forEach(function (f, fi) {
        ensure(16);
        var stz = stazioniDi(f);
        var gruppi = f.gruppi && f.gruppi > 1 ? f.gruppi : (stz.length > 1 ? stz.length : 1);
        var perMin = gruppi > 1 ? Math.round((Number(f.minuti) || 0) / gruppi) : 0;
        var perEsatto = gruppi > 1 && (Number(f.minuti) || 0) % gruppi === 0;

        // intestazione di fase
        setFill([241, 245, 244]);
        doc.roundedRect(MARGIN, y - 5, CONTENT_W, 9.5, 1.5, 1.5, 'F');
        setFill(VERDE);
        doc.rect(MARGIN, y - 5, 3, 9.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
        setText(SCURO);
        doc.text(tx('FASE ' + (fi + 1) + ' - ' + (f.nome || '')), MARGIN + 6, y + 1);
        setText(VERDE);
        var minTxt = (Number(f.minuti) || 0) + ' min';
        if (gruppi > 1) minTxt += ' - ' + gruppi + ' gruppi da ' + (perEsatto ? '' : '~') + perMin + "'";
        doc.text(tx(minTxt), PAGE_W - MARGIN - 2, y + 1, { align: 'right' });
        y += 11;

        if (gruppi > 1) {
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5);
          setText(GRIGIO);
          ensure(5);
          doc.text(tx('Squadra divisa in ' + gruppi + ' gruppi in parallelo, rotazione ogni ' + (perEsatto ? '' : '~') + perMin + ' minuti.'), MARGIN, y);
          y += 6;
        }

        var totSlots = stz.reduce(function (a, arr) { return a + arr.length; }, 0);
        if (!totSlots) {
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9);
          setText(GRIGIO);
          ensure(6);
          doc.text(tx('Nessun esercizio assegnato a questa fase.'), MARGIN, y);
          y += 8;
        }

        stz.forEach(function (arr, gi) {
        // sottotitolo del gruppo/stazione
        if (gruppi > 1 && arr.length) {
          ensure(9);
          setFill([233, 243, 238]);
          doc.roundedRect(MARGIN, y - 4, 60, 7, 1.2, 1.2, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
          setText(VERDE);
          doc.text(tx('GRUPPO ' + (gi + 1) + '  -  ' + (perEsatto ? '' : '~') + perMin + ' min'), MARGIN + 3, y + 1);
          y += 8;
        }

        arr.forEach(function (slot) {
          var en = entries.find(function (x) { return x.slot === slot; });
          var ex = en && en.ex;

          // blocco minimo: titolo + eventuale immagine
          ensure(en && en.img ? IMG_H + 22 : 22);

          // titolo esercizio
          doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
          setText(SCURO);
          doc.text(tx(ex ? ex.titolo : (slot.titolo + ' (non più in libreria)')), MARGIN, y);
          y += 5.2;

          // riga tema + dati rapidi
          var temaCol = hexToRgb(RUGBY.themeColor(slot.tema));
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
          setText(temaCol);
          var temaTxt = tx(RUGBY.themeName(slot.tema)).toUpperCase();
          doc.text(temaTxt, MARGIN, y);
          if (ex) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
            setText(GRIGIO);
            var meta = [];
            if (ex.durata) meta.push(ex.durata + ' min');
            if (ex.giocatori) meta.push('Giocatori: ' + ex.giocatori);
            if (ex.spazio) meta.push('Spazio: ' + ex.spazio);
            doc.text(tx('   |   ' + meta.join('  -  ')), MARGIN + doc.getTextWidth(temaTxt), y);
          }
          y += 4.6;

          if (ex) {
            // immagine dello schema
            if (en.img) {
              ensure(IMG_H + 4);
              doc.addImage(en.img, 'JPEG', MARGIN, y, IMG_W, IMG_H);
              setDraw(LINEA);
              doc.rect(MARGIN, y, IMG_W, IMG_H, 'S');
              // materiale a destra dell'immagine
              if (ex.materiale) {
                doc.setFont('helvetica', 'bold'); doc.setFontSize(7.6);
                setText(GRIGIO);
                doc.text('MATERIALE', MARGIN + IMG_W + 6, y + 4);
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
                setText(SCURO);
                var mlines = doc.splitTextToSize(tx(ex.materiale), CONTENT_W - IMG_W - 8);
                doc.text(mlines.slice(0, 4), MARGIN + IMG_W + 6, y + 9);
              }
              if (ex.obiettivo) {
                var oy = y + (ex.materiale ? 24 : 4);
                doc.setFont('helvetica', 'bold'); doc.setFontSize(7.6);
                setText(GRIGIO);
                doc.text('OBIETTIVO', MARGIN + IMG_W + 6, oy);
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
                setText(SCURO);
                var olines = doc.splitTextToSize(tx(ex.obiettivo), CONTENT_W - IMG_W - 8);
                doc.text(olines.slice(0, 6), MARGIN + IMG_W + 6, oy + 5);
              }
              y += IMG_H + 5;
            } else if (ex.obiettivo) {
              paragraph('Obiettivo', ex.obiettivo);
            }
            // materiale (se non già scritto accanto all'immagine)
            if (!en.img && ex.materiale) paragraph('Materiale', ex.materiale);

            paragraph('Descrizione', ex.descrizione);
            paragraph('Varianti / progressioni', ex.varianti);
            paragraph('Punti di coaching', ex.coaching);
          }

          // separatore
          ensure(5);
          setDraw(LINEA);
          doc.line(MARGIN, y, PAGE_W - MARGIN, y);
          y += 6;
        });
        });
      });

      /* ===== piè di pagina su tutte le pagine ===== */
      var pages = doc.getNumberOfPages();
      for (var p = 1; p <= pages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
        setText(GRIGIO);
        doc.text(tx('Rugby Train Creator  -  ' + (session.nome || '')), MARGIN, 291);
        doc.text('Pagina ' + p + ' di ' + pages, PAGE_W - MARGIN, 291, { align: 'right' });
      }

      var filename = 'seduta-' + slug(session.nome) + '.pdf';
      return { blob: doc.output('blob'), filename: filename };
    });
  }

  /* ---------- API ---------- */
  function download(session, resolveEx) {
    return build(session, resolveEx).then(function (out) {
      var url = URL.createObjectURL(out.blob);
      var a = document.createElement('a');
      a.href = url; a.download = out.filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return out.filename;
    });
  }

  function share(session, resolveEx) {
    return build(session, resolveEx).then(function (out) {
      var file;
      try { file = new File([out.blob], out.filename, { type: 'application/pdf' }); }
      catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        return navigator.share({
          files: [file],
          title: session.nome || 'Seduta di allenamento',
          text: 'Seduta di allenamento: ' + (session.nome || '')
        }).then(function () { return 'shared'; })
          .catch(function (err) {
            if (err && err.name === 'AbortError') return 'cancelled';
            // condivisione fallita: ripiega sul download
            return download(session, resolveEx).then(function () { return 'downloaded'; });
          });
      }
      // dispositivo senza condivisione file (es. PC): scarica il PDF
      var url = URL.createObjectURL(out.blob);
      var a = document.createElement('a');
      a.href = url; a.download = out.filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return 'downloaded';
    });
  }

  return { build: build, download: download, share: share };
})();
