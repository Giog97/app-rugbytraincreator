# 🏉 Rugby Train Creator

App per **creare allenamenti di rugby da zero** per categorie **U16–U18**.
Ogni seduta ha un **tema** (attacco, difesa, contrattacco, touche, mischia, ruck, maul, kicking…), segue una **struttura di fasi configurabile** e punta sempre a **1h30 (90 minuti)** totali.

Ogni esercizio ha sempre la **stessa struttura**: titolo, tema, fase, obiettivo, **descrizione a parole**, durata, giocatori, materiale, spazio, **schema visivo (immagine)**, varianti e punti di coaching.

---

## ▶️ Avviare l'app sul PC

**Modo facile:** doppio clic su **`avvia.bat`** → si apre il browser su `http://localhost:8000`.

**Modo manuale:** apri il Prompt dei comandi nella cartella e lancia:

```
python -m http.server 8000
```

poi vai su `http://localhost:8000`.

> Suggerimento: apri sempre l'app tramite `http://localhost:8000` (non con doppio clic su `index.html`), così funzionano salvataggio dati, modalità offline e installazione.

---

## 📲 Usarla come app sul telefono

L'app è una **PWA** (si installa come un'app normale). Per usarla sul telefono serve un indirizzo web (https). Due strade:

1. **Pubblicazione gratuita (consigliata):** carica la cartella su un hosting statico gratuito
   (es. **Netlify Drop** — trascini la cartella su netlify.com/drop — oppure **GitHub Pages**).
   Otterrai un link https da aprire sul telefono.
2. Sul telefono apri il link → menu del browser → **“Aggiungi a schermata Home”**.
   Da quel momento l'app sta tra le tue app, si apre a tutto schermo e funziona offline.

Sul PC (Chrome/Edge) appare un'icona di **installazione** nella barra degli indirizzi, oppure usa
il pulsante **“Installa app”** dentro *Opzioni*.

---

## 🧭 Come funziona

- **Home** – scorciatoie e riepilogo.
- **Libreria** – tutti gli esercizi: quelli **del catalogo** (già pronti) + i **tuoi**. Filtra per tema/fase, cerca, apri il dettaglio, crea o modifica esercizi e **carica l'immagine** dello schema.
- **Genera** – scegli il **tema**, regola i **minuti delle fasi** (più gioco o più tecnica) e crea una **bozza di seduta** già compilata, da modificare.
- **Sedute** – le sedute salvate; aprile, modificale, **stampale o salvale in PDF** (pulsante Stampa).
- **Opzioni** – **struttura delle fasi** (nomi, minuti, aggiungi/togli, “a tema”), **backup** (esporta/importa) e installazione.

I **dati sono salvati solo su questo dispositivo** (IndexedDB del browser). Usa **Esporta dati** in *Opzioni* per fare un backup o spostarli altrove.

---

## 🗂️ Struttura dei file

```
index.html              guscio dell'app
manifest.webmanifest    configurazione PWA (installazione)
sw.js                   service worker (uso offline)
avvia.bat               avvio rapido su Windows
css/styles.css          stile
js/config.js            temi e fasi di default (modificabili)
js/db.js                salvataggio dati (IndexedDB)
js/catalog.js           catalogo esercizi preconfezionato
js/app.js               logica e schermate
icons/                  icone dell'app
assets/schemes/         schemi tattici degli esercizi (SVG)
tools/generate_icons.py script che genera le icone
tools/generate_schemes.py script che genera gli schemi tattici
```

## 🎽 Schemi tattici degli esercizi

Ogni esercizio del catalogo ha uno **schema tattico** in `assets/schemes/<id>.svg`,
generato automaticamente. Per rigenerarli (dopo aver modificato lo script):

```
python tools/generate_schemes.py
```

Legenda degli schemi: **cerchio blu** = attacco/propria squadra · **cerchio rosso** =
difesa/avversari · **triangolo ambra** = cono · freccia piena = corsa · freccia
tratteggiata = passaggio · freccia punteggiata = calcio.
Per i tuoi esercizi puoi sempre **caricare una tua immagine** (o duplicare un esercizio del catalogo e sostituire lo schema).

## 🎨 Struttura di default della seduta (modificabile)

| # | Fase | Minuti |
|---|------|--------|
| 1 | Attivazione / riscaldamento | 15 |
| 2 | Tecnica individuale | 15 |
| 3 | Skill di reparto / situazione | 20 |
| 4 | Situazione a tema | 20 |
| 5 | Gioco applicato / partita | 15 |
| 6 | Defaticamento | 5 |
| | **Totale** | **90** |
