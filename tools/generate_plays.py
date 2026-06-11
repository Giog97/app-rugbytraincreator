"""Genera i diagrammi delle GIOCATE come SVG (assets/plays/<id>.svg).
Legenda colori = quella dei playbook dell'allenatore (U16/U17):
  verde = passaggio | rosa = linea di corsa | giallo = calcio
  blu = giocatore dei 3/4 | viola = giocatore della mischia | nero = difesa/opzioni
Eseguire:  python tools/generate_plays.py
"""
import os

W, H = 400, 250
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "plays")

PASS = "#16a34a"
RUN = "#e11d48"
KICK = "#f59e0b"
BLU = "#2563eb"
VIOLA = "#7c3aed"
NERO = "#0f172a"


def nf(v):
    return ("%g" % round(float(v), 1))


def esc(t):
    return str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def marker(mid, color):
    return ('<marker id="%s" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" '
            'markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="%s"/></marker>') % (mid, color)


DEFS = ('<defs>' + marker("ap", PASS) + marker("ar", RUN) + marker("ak", KICK) +
        marker("an", NERO) + marker("aw", "#ffffff") +
        '<clipPath id="pc"><rect x="0" y="0" width="400" height="214" rx="14"/></clipPath></defs>')


def pitch():
    s = ['<g clip-path="url(#pc)">', '<rect x="0" y="0" width="400" height="214" fill="#1f7a44"/>']
    x = 0
    i = 0
    while x < W:
        if i % 2 == 0:
            s.append('<rect x="%d" y="0" width="34" height="214" fill="#249150" opacity="0.55"/>' % x)
        x += 34
        i += 1
    s.append('</g>')
    s.append('<rect x="8" y="8" width="384" height="198" rx="9" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2"/>')
    return "".join(s)


def legend():
    y = 233
    p = ['<rect x="0" y="214" width="400" height="36" fill="#0f172a"/>']
    items = [("dot", BLU, "3/4"), ("dot", VIOLA, "Mischia"), ("arr", PASS, "Passaggio"),
             ("arr", RUN, "Corsa"), ("arr", KICK, "Calcio"), ("dot", "#475569", "Difesa")]
    x = 12
    for sym, col, txt in items:
        if sym == "dot":
            p.append('<circle cx="%s" cy="%s" r="5.5" fill="%s" stroke="#fff" stroke-width="1"/>' % (nf(x), nf(y - 4), col))
            x += 10
        else:
            p.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2.6" marker-end="url(#aw)"/>' % (nf(x - 5), nf(y - 4), nf(x + 8), nf(y - 4), col))
            x += 12
        p.append('<text x="%s" y="%s" font-size="9.5" fill="#fff" font-family="system-ui,sans-serif">%s</text>' % (nf(x + 2), nf(y), txt))
        x += 10 + len(txt) * 5.4
    return "".join(p)


def doc(inner):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250" role="img">'
            + DEFS + pitch() + inner + legend() + '</svg>')


def player(x, y, label="", kind="b"):
    fill = {"b": BLU, "m": VIOLA, "d": NERO}[kind]
    t = ''
    if label:
        size = 8.6 if len(str(label)) < 3 else 7
        t = ('<text x="%s" y="%s" font-size="%s" font-weight="700" fill="#fff" text-anchor="middle" '
             'font-family="system-ui,sans-serif">%s</text>') % (nf(x), nf(y + 3), size, esc(label))
    return '<circle cx="%s" cy="%s" r="8.6" fill="%s" stroke="#fff" stroke-width="1.5"/>%s' % (nf(x), nf(y), fill, t)


def opt(x, y):
    """Marcatore di opzione (cerchietto) accanto al giocatore."""
    return ('<circle cx="%s" cy="%s" r="4" fill="#fff" stroke="%s" stroke-width="1.6"/>'
            '<circle cx="%s" cy="%s" r="1.3" fill="%s"/>') % (nf(x + 10), nf(y - 10), NERO, nf(x + 10), nf(y - 10), NERO)


def arrow(x1, y1, x2, y2, color=RUN, width=2.8):
    mk = {PASS: "ap", RUN: "ar", KICK: "ak", NERO: "an"}.get(color, "an")
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" '
            'marker-end="url(#%s)" stroke-linecap="round"/>') % (nf(x1), nf(y1), nf(x2), nf(y2), color, width, mk)


def curve(x1, y1, x2, y2, bend=-30, color=KICK, width=2.8):
    mk = {PASS: "ap", RUN: "ar", KICK: "ak", NERO: "an"}.get(color, "an")
    mx, my = (x1 + x2) / 2.0, (y1 + y2) / 2.0 + bend
    return ('<path d="M%s,%s Q%s,%s %s,%s" fill="none" stroke="%s" stroke-width="%s" '
            'marker-end="url(#%s)" stroke-linecap="round"/>') % (nf(x1), nf(y1), nf(mx), nf(my), nf(x2), nf(y2), color, width, mk)


def label(x, y, text, size=10.5, color="#fff", anchor="middle", bold=True):
    w = "700" if bold else "500"
    return ('<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" font-weight="%s" '
            'font-family="system-ui,sans-serif" paint-order="stroke" stroke="#0f172a" stroke-width="2.2" '
            'stroke-opacity="0.4" stroke-linejoin="round">%s</text>') % (nf(x), nf(y), size, color, anchor, w, esc(text))


def ruck(x, y):
    return ('<ellipse cx="%s" cy="%s" rx="17" ry="9" fill="#64748b" stroke="#fff" stroke-width="1.4" opacity="0.9"/>'
            + label(x, y - 14, "RUCK", 9)) % (nf(x), nf(y))


def scrum(x, y):
    s = []
    for dx, dy in [(-9, -7), (0, -7), (9, -7), (-5, 2), (5, 2), (-9, 11), (0, 11), (9, 11)]:
        s.append('<circle cx="%s" cy="%s" r="4.6" fill="%s" stroke="#fff" stroke-width="1"/>' % (nf(x + dx), nf(y + dy), VIOLA))
    s.append(label(x, y - 16, "MISCHIA", 9))
    return "".join(s)


def touche(x=36):
    return ('<line x1="%s" y1="16" x2="%s" y2="198" stroke="#ffffff" stroke-width="2.6" stroke-dasharray="7 6" stroke-opacity="0.9"/>'
            % (nf(x), nf(x))) + label(x + 2, 28, "TOUCHE", 8.5, "#fff", "start")


def dline(xs, y=66, labels=None):
    s = []
    for i, x in enumerate(xs):
        s.append(player(x, y, labels[i] if labels else "D", "d"))
    return "".join(s)


def darrow(x, y, kind="down"):
    if kind == "down":
        return arrow(x, y + 11, x, y + 30, NERO, 2.2)
    if kind == "in":
        return arrow(x, y + 11, x - 18, y + 26, NERO, 2.2)
    if kind == "doubt":
        return arrow(x - 4, y + 11, x - 16, y + 26, NERO, 2) + arrow(x + 4, y + 11, x + 16, y + 26, NERO, 2)
    return ""


# ============================ GIOCATE MISCHIA ============================

def pod(x, y):
    """Pod di 3 avanti: centrale avanzato."""
    s = [player(x, y - 12, "A", "m"), player(x - 16, y + 4, "A", "m"), player(x + 16, y + 4, "A", "m")]
    s.append(arrow(x, y - 22, x, y - 44, RUN))                       # sfida
    s.append(arrow(x + 5, y - 10, x + 14, y - 2, PASS, 2.2))          # basket interna
    return "".join(s)


def play_viola():
    s = [ruck(95, 130), player(118, 144, "9", "b")]
    s.append(opt(118, 144))
    s.append(arrow(128, 138, 175, 112, PASS))          # 9 -> pod
    s.append(pod(195, 110))
    s.append(arrow(126, 152, 218, 162, PASS))          # 9 -> play in asse
    s.append(player(238, 162, "", "b"))
    s.append(label(238, 182, "PLAY", 9.5))
    s.append(label(200, 32, "Viola — 9 al pod (sfida/basket) o al play in asse", 9.5))
    return doc("".join(s))


def play_rossa():
    s = [ruck(80, 135), player(103, 148, "9", "b")]
    s.append(arrow(113, 143, 142, 132, PASS))          # 9 -> 10
    s.append(player(155, 128, "10", "b")); s.append(opt(155, 128))
    s.append(arrow(165, 120, 198, 104, PASS))          # 10 -> pod
    s.append(pod(220, 102))
    s.append(arrow(163, 136, 268, 158, PASS))          # 10 -> play
    s.append(player(288, 158, "", "b"))
    s.append(label(288, 178, "PLAY", 9.5))
    s.append(label(200, 32, "Rossa (U17: Parigi) — 10 al pod o al play dietro", 9.5))
    return doc("".join(s))


def play_basket():
    s = [label(80, 80, "VIOLA o ROSSA", 9, RUN)]
    s.append(arrow(82, 88, 130, 102, PASS))
    s.append(pod(155, 108))
    s.append(opt(155, 96))
    s.append(arrow(160, 110, 208, 142, PASS))          # centrale -> play
    s.append(player(228, 146, "", "b")); s.append(opt(228, 146))
    s.append(label(228, 166, "PLAY", 9.5))
    s.append(arrow(238, 140, 280, 116, PASS))          # play -> 13 penetrante
    s.append(player(296, 110, "13", "b"))
    s.append(arrow(296, 99, 296, 78, RUN))
    s.append(arrow(238, 150, 312, 158, PASS))          # play -> 15
    s.append(player(330, 158, "15", "b"))
    s.append(arrow(336, 148, 352, 122, RUN))
    s.append(label(200, 32, "Basket — uscita dal pod: penetrante (13) o play (15)", 9.5))
    return doc("".join(s))


def play_pizza():
    s = []
    s.append('<line x1="14" y1="38" x2="386" y2="38" stroke="#fff" stroke-width="3"/>')
    s.append(label(36, 30, "META", 9))
    s.append('<line x1="190" y1="30" x2="190" y2="46" stroke="#fff" stroke-width="3"/>')
    s.append('<line x1="215" y1="30" x2="215" y2="46" stroke="#fff" stroke-width="3"/>')
    s.append(label(202, 24, "PALI", 8))
    s.append('<path d="M22,55 L22,120" stroke="#fff" stroke-width="1.6" fill="none"/>')
    s.append(label(30, 92, "10/15 m", 8, "#fff", "start"))
    s.append(player(210, 150, "9", "b")); s.append(opt(210, 150))
    s.append(arrow(210, 140, 210, 122, PASS, 2.4))
    # gruppo avanti
    for dx, dy in [(-14, 0), (14, 0), (-8, 18), (18, 18)]:
        s.append(player(210 + dx, 95 + dy, "A", "m"))
    s.append(player(168, 108, "A", "m"))
    s.append(label(150, 128, "PLAY", 8.5))
    s.append(arrow(210, 82, 210, 52, RUN, 4))           # carica centrale
    s.append(arrow(182, 90, 172, 56, RUN, 2.4))
    s.append(arrow(238, 90, 248, 56, RUN, 2.4))
    s.append(player(80, 152, "12", "b")); s.append(player(96, 172, "A", "m"))
    s.append(player(330, 150, "A", "m")); s.append(player(356, 150, "14", "b"))
    s.append(label(200, 200, "Pizza — punizione veloce vicino alla meta: cariche davanti ai pali", 8.6))
    return doc("".join(s))


def play_freccia():
    s = [scrum(72, 120)]
    s.append(player(96, 138, "9", "b"))
    s.append(player(108, 108, "8", "m")); s.append(opt(108, 108))
    s.append(arrow(118, 102, 152, 86, RUN))             # 8 si stacca
    s.append(arrow(120, 112, 182, 118, PASS, 2.4))      # 8 -> penetrante (1° centro)
    s.append(player(200, 118, "12", "b"))
    s.append(arrow(200, 107, 200, 84, RUN))
    s.append(arrow(118, 118, 158, 152, PASS, 2.4))      # 8 -> play (apertura)
    s.append(player(176, 156, "10", "b")); s.append(opt(176, 156))
    s.append(label(176, 176, "PLAY", 8.5))
    s.append(arrow(186, 150, 248, 122, PASS, 2.4))      # 10 -> 13 penetrante
    s.append(player(266, 116, "13", "b"))
    s.append(arrow(266, 105, 266, 82, RUN))
    s.append(arrow(186, 160, 300, 162, PASS, 2.4))      # 10 -> 15 play
    s.append(player(320, 160, "15", "b"))
    s.append(arrow(327, 150, 344, 124, RUN))
    s.append(label(200, 32, "Freccia — l'8 si stacca: penetrante o play, due ondate", 9.5))
    return doc("".join(s))


# ============================ GIOCATE 3/4 ============================

def play_australia():
    s = [ruck(70, 130), player(92, 144, "9", "b")]
    s.append(arrow(102, 138, 128, 146, PASS))
    s.append(player(142, 150, "10", "b"))
    s.append(dline([150, 200, 250, 300, 345], 70))
    s.append(curve(150, 142, 350, 96, -66, KICK, 3.2))  # calcio-passaggio
    s.append(player(358, 158, "14", "b"))
    s.append(arrow(358, 147, 356, 112, RUN))
    s.append(player(186, 162, "12", "b")); s.append(player(232, 170, "13", "b")); s.append(player(280, 178, "15", "b"))
    s.append(label(200, 32, "Australia — calcio-passaggio del 10 sull'ala opposta", 9.5))
    return doc("".join(s))


def play_bar_open_elite():
    s = [touche(), player(58, 128, "9", "b")]
    s.append(arrow(68, 124, 96, 132, PASS))
    s.append(player(112, 136, "10", "b")); s.append(opt(112, 136))
    s.append(arrow(122, 130, 152, 122, PASS))
    s.append(player(168, 118, "12", "b")); s.append(opt(168, 118))
    # opzioni dal 12
    s.append(player(108, 178, "11", "b"))
    s.append(arrow(114, 170, 146, 104, RUN))            # 11 interno
    s.append(player(232, 122, "13", "b"))
    s.append(arrow(232, 111, 232, 86, RUN))             # 13 alto
    s.append(player(216, 168, "15", "b"))
    s.append(arrow(224, 160, 252, 132, RUN))            # 15 dietro al 13
    s.append(player(348, 130, "14", "b"))
    s.append(arrow(348, 119, 348, 94, RUN))
    s.append(dline([120, 175, 235, 300], 60, ["10", "12", "13", "14"]))
    s.append(darrow(120, 60, "down")); s.append(darrow(175, 60, "in")); s.append(darrow(235, 60, "in")); s.append(darrow(300, 60, "down"))
    s.append(label(210, 32, "Bar Open Élite — catena di opzioni 10-12: 11 dentro, 13 alto, 15 dietro", 8.6))
    return doc("".join(s))


def play_open_bar():
    s = [touche(), player(58, 128, "9", "b")]
    s.append(curve(68, 124, 158, 116, -18, PASS, 3))     # 9 -> 12 (salta il 10)
    s.append(player(174, 112, "12", "b")); s.append(opt(174, 112))
    s.append(player(116, 142, "10", "b"))
    s.append(curve(126, 146, 212, 132, 26, RUN, 2.4))    # 10 gira fuori dal 12
    s.append(player(104, 180, "11", "b"))
    s.append(arrow(110, 172, 148, 100, RUN))             # 11 interno
    s.append(arrow(184, 106, 222, 126, PASS, 2.4))       # 12 -> 10 in uscita
    s.append(player(238, 130, "10", "b")); s.append(opt(238, 130))
    s.append(player(284, 112, "13", "b"))
    s.append(arrow(284, 101, 284, 78, RUN))              # 13 alto (tempo sul 10)
    s.append(player(300, 168, "15", "b"))
    s.append(arrow(308, 160, 332, 130, RUN))             # 15 dietro al 13
    s.append(player(362, 138, "14", "b"))
    s.append(arrow(362, 127, 362, 102, RUN))
    s.append(dline([130, 190, 250, 320], 56))
    s.append(darrow(130, 56, "down")); s.append(darrow(190, 56, "doubt")); s.append(darrow(250, 56, "doubt")); s.append(darrow(320, 56, "down"))
    s.append(label(206, 32, "Open Bar — palla al 12, il 10 gira al largo da secondo play", 9))
    return doc("".join(s))


def play_ventidue():
    s = [scrum(60, 130)]
    s.append(player(86, 146, "9", "b")); s.append(player(74, 108, "8", "m"))
    s.append(arrow(96, 141, 122, 138, PASS))
    s.append(player(138, 136, "10", "b")); s.append(opt(138, 136))
    s.append(arrow(146, 128, 192, 100, RUN))             # 10 taglia per la X
    s.append(player(206, 122, "12", "b"))
    s.append(arrow(198, 114, 158, 92, RUN))              # 12 incrocia (X)
    s.append(player(244, 116, "13", "b"))
    s.append(arrow(244, 105, 244, 80, RUN))              # 13 penetrante all'altezza
    s.append(player(228, 170, "15", "b"))
    s.append(arrow(236, 162, 272, 128, RUN))             # 15 play dietro al 13
    s.append(player(120, 184, "11", "b"))
    s.append(arrow(126, 176, 150, 116, RUN))             # 11 interno di tutti
    s.append(player(354, 142, "14", "b"))
    s.append(arrow(354, 131, 354, 106, RUN))
    s.append(dline([140, 200, 258, 322], 56))
    s.append(darrow(140, 56, "down")); s.append(darrow(200, 56, "doubt")); s.append(darrow(258, 56, "doubt")); s.append(darrow(322, 56, "in"))
    s.append(label(204, 32, "22 (ex Berna) — X tra 10 e 12, 13 penetrante, 15 play dietro", 9))
    return doc("".join(s))


def play_malpa():
    s = []
    s.append('<line x1="20" y1="92" x2="380" y2="92" stroke="#0f172a" stroke-width="2.6" stroke-dasharray="9 6"/>')
    s.append(label(200, 86, "LINEA DI GIOCO", 8.5))
    s.append(player(272, 162, "10", "b")); s.append(opt(272, 162))
    s.append(curve(266, 154, 176, 64, -52, KICK, 3.2))   # up-and-under
    s.append(player(120, 166, "15", "b"))
    s.append(arrow(124, 156, 162, 84, RUN, 3))           # 15 sale a recuperare
    s.append(player(196, 178, "12", "b")); s.append(arrow(199, 168, 206, 120, RUN, 2))
    s.append(player(330, 176, "13", "b")); s.append(arrow(327, 166, 312, 120, RUN, 2))
    s.append(label(200, 200, "Malpa — up-and-under chiamato: chi copre (10/15) fa salire l'altro", 8.6))
    return doc("".join(s))


def bands():
    s = []
    s.append('<line x1="14" y1="96" x2="386" y2="96" stroke="%s" stroke-width="2.6"/>' % KICK)
    s.append(label(370, 90, "L1", 8.5, "#fff", "end"))
    s.append('<line x1="14" y1="62" x2="386" y2="62" stroke="%s" stroke-width="2.6"/>' % PASS)
    s.append(label(370, 56, "L2", 8.5, "#fff", "end"))
    s.append('<line x1="14" y1="30" x2="386" y2="30" stroke="%s" stroke-width="2.6"/>' % RUN)
    s.append(label(370, 24, "L3", 8.5, "#fff", "end"))
    return "".join(s)


def play_melbourne(source="ruck"):
    s = [bands()]
    s.append(dline([120, 178, 240, 312], 86, ["D", "12", "13", "D"]))
    s.append(player(200, 22, "15", "d"))
    if source == "ruck":
        s.append(ruck(64, 158)); s.append(player(88, 170, "9", "b"))
        s.append(arrow(98, 165, 126, 158, PASS))
        cap = "Melbourne — calcetto in L2 tra il 12 e il 13 avversari"
    else:
        s.append(touche()); s.append(player(58, 158, "9", "b"))
        s.append(arrow(68, 154, 124, 156, PASS))
        cap = "Pesaro — da touche: calcetto in L2 tra i centri avversari"
    s.append(player(142, 156, "10", "b"))
    s.append(curve(148, 148, 210, 72, -48, KICK, 3.2))   # calcetto in L2
    s.append(player(188, 178, "12", "b"))
    s.append(arrow(191, 168, 204, 92, RUN, 2.6))         # 12 recupera
    s.append(player(282, 168, "15", "b"))
    s.append(arrow(276, 158, 228, 88, RUN, 2.6))         # 15 recupera
    s.append(player(238, 186, "13", "b")); s.append(player(346, 178, "14", "b"))
    s.append(label(200, 205, cap, 8.8))
    return doc("".join(s))


def play_peneplay():
    s = [label(60, 96, "P.I.", 9.5)]
    s.append('<ellipse cx="60" cy="110" rx="15" ry="8" fill="#64748b" stroke="#fff" stroke-width="1.3" opacity="0.9"/>')
    s.append(player(84, 126, "9", "b"))
    s.append(arrow(94, 121, 122, 126, PASS))
    s.append(player(138, 128, "10", "b")); s.append(opt(138, 128))
    s.append(dline([168, 240], 62))
    s.append(darrow(168, 62, "down")); s.append(darrow(240, 62, "doubt"))
    s.append(arrow(146, 120, 196, 92, PASS, 2.6))        # opzione corta nell'intervallo
    s.append(player(212, 110, "12", "b"))
    s.append(arrow(214, 99, 220, 80, RUN))               # 12 penetrante
    s.append(arrow(146, 134, 224, 150, PASS, 2.6))       # opzione play dietro
    s.append(player(70, 182, "11", "b"))
    s.append(arrow(78, 178, 226, 158, RUN, 2.4))         # 11 lanciato da dietro
    s.append(player(300, 130, "13", "b")); s.append(arrow(300, 119, 300, 96, RUN, 2))
    s.append(player(352, 148, "15", "b"))
    s.append(label(204, 32, "Pene-Play — sempre due opzioni: penetrante nell'intervallo o play dietro", 8.4))
    return doc("".join(s))


def play_doppio():
    s = [touche(), player(58, 128, "9", "b")]
    s.append(arrow(68, 124, 100, 132, PASS))
    s.append(player(116, 136, "10", "b"))
    s.append(arrow(127, 136, 158, 132, RUN, 2.2))        # corto sul 12
    s.append(player(174, 130, "12", "b"))
    s.append(arrow(177, 120, 186, 102, RUN))             # 12 sale al punto d'opzione
    s.append(opt(182, 104))
    s.append(curve(196, 98, 256, 110, 22, PASS, 2.6))    # rilascio fuori
    s.append(player(272, 114, "13", "b"))
    s.append(arrow(300, 170, 278, 128, RUN, 2.4))        # 13 lanciato da dietro-destra
    s.append(player(96, 188, "11", "b"))
    s.append(arrow(106, 186, 252, 146, RUN, 2.4))        # 11 in giro
    s.append(player(322, 156, "15", "b")); s.append(player(362, 138, "14", "b"))
    s.append(dline([126, 184, 244, 312], 56))
    s.append(darrow(126, 56, "down")); s.append(darrow(184, 56, "down")); s.append(darrow(244, 56, "doubt")); s.append(darrow(312, 56, "in"))
    s.append(label(204, 32, "Doppio — corto sul 12 e rilascio dietro per il 13 lanciato, 11 in giro", 8.4))
    return doc("".join(s))


def play_tripla():
    s = [touche(), player(58, 128, "9", "b")]
    s.append(curve(68, 122, 176, 102, -22, PASS, 3))     # lancio lungo al punto sopra il 12
    s.append(player(116, 140, "10", "b"))
    s.append(arrow(126, 136, 158, 128, RUN, 2.2))        # 10 converge sul 12
    s.append(player(174, 126, "12", "b")); s.append(opt(174, 126))
    s.append(curve(186, 116, 252, 110, 18, PASS, 2.6))   # rilascio fuori
    s.append(player(268, 112, "13", "b"))
    s.append(arrow(298, 168, 274, 126, RUN, 2.4))
    s.append(player(96, 188, "11", "b"))
    s.append(arrow(106, 186, 250, 148, RUN, 2.4))
    s.append(player(320, 158, "15", "b")); s.append(player(360, 140, "14", "b"))
    s.append(dline([126, 184, 244, 312], 56))
    s.append(darrow(126, 56, "down")); s.append(darrow(184, 56, "down")); s.append(darrow(244, 56, "doubt")); s.append(darrow(312, 56, "in"))
    s.append(label(204, 32, "Tripla — come il Doppio ma con il lancio lungo del 9 sul 12", 8.8))
    return doc("".join(s))


def play_balsamo():
    s = [scrum(58, 128)]
    s.append(player(84, 144, "9", "b")); s.append(player(72, 106, "8", "m"))
    s.append(arrow(82, 102, 136, 106, PASS, 2.6))        # lancio dall'8 al punto d'opzione
    s.append(opt(146, 112))
    s.append(player(150, 132, "10", "b"))
    s.append(arrow(150, 121, 152, 108, RUN, 2.2))        # 10 sale sul punto
    s.append(player(106, 176, "12", "b"))
    s.append(arrow(114, 170, 144, 122, RUN))             # 12 taglia dentro
    s.append(player(212, 130, "13", "b"))
    s.append(arrow(212, 119, 212, 92, RUN))              # 13 dritto fuori
    s.append(player(196, 180, "15", "b"))
    s.append(arrow(206, 174, 248, 138, RUN))             # 15 gira fuori dal 13
    s.append(player(310, 182, "11", "b"))
    s.append(player(352, 142, "14", "b")); s.append(arrow(352, 131, 352, 108, RUN, 2))
    s.append(dline([150, 208, 268, 326], 56))
    s.append(darrow(150, 56, "down")); s.append(darrow(208, 56, "down")); s.append(darrow(268, 56, "doubt")); s.append(darrow(326, 56, "doubt"))
    s.append(label(204, 32, "Balsamo — da mischia: 12 dentro, 13 dritto, 15 fuori sul punto del 10", 8.4))
    return doc("".join(s))


def play_libano():
    s = [touche(), player(58, 128, "9", "b")]
    s.append(arrow(68, 124, 98, 130, PASS))
    s.append(player(114, 132, "10", "b"))
    s.append(arrow(124, 128, 152, 122, PASS, 2.4))       # corto sul 12
    s.append(player(168, 118, "12", "b"))
    s.append(arrow(168, 107, 168, 84, RUN))              # 12 penetrante
    s.append(player(86, 186, "11", "b"))
    s.append(arrow(96, 184, 212, 122, RUN, 2.4))         # 11 gira fuori dal 12
    s.append(player(258, 124, "13", "b"))
    s.append(arrow(258, 113, 258, 90, RUN))
    s.append(player(316, 160, "15", "b")); s.append(player(358, 142, "14", "b"))
    s.append(dline([120, 176, 236, 300], 56))
    s.append(darrow(120, 56, "down")); s.append(darrow(176, 56, "down")); s.append(darrow(236, 56, "doubt")); s.append(darrow(300, 56, "down"))
    s.append(label(204, 32, "Libano — corto sul 12 penetrante, l'11 gira come uomo in più", 8.8))
    return doc("".join(s))


def play_gori():
    s = [player(70, 140, "9", "b")]
    s.append(arrow(80, 135, 108, 138, PASS))
    s.append(player(124, 140, "10", "b"))
    s.append(arrow(134, 134, 162, 126, PASS))
    s.append(player(178, 122, "12", "b")); s.append(opt(178, 122))
    s.append(arrow(180, 111, 188, 88, RUN, 3))           # 12 attacca alto
    s.append(player(240, 118, "13", "b"))
    s.append(arrow(242, 107, 250, 84, RUN, 3))           # 13 attacca alto
    s.append(curve(188, 114, 286, 64, -34, KICK, 2.6))   # opzione piede dietro la linea
    s.append(dline([130, 190, 252, 316], 56))
    s.append(darrow(190, 56, "down")); s.append(darrow(252, 56, "down"))
    s.append(player(320, 150, "15", "b")); s.append(player(362, 132, "14", "b"))
    s.append(label(204, 32, "Gori — i due centri attaccano alti, con opzione piede", 9.2))
    return doc("".join(s))


PLAYS = {
    "viola": play_viola,
    "rossa": play_rossa,
    "basket": play_basket,
    "pizza": play_pizza,
    "freccia": play_freccia,
    "australia": play_australia,
    "bar-open-elite": play_bar_open_elite,
    "open-bar": play_open_bar,
    "ventidue": play_ventidue,
    "malpa": play_malpa,
    "melbourne": lambda: play_melbourne("ruck"),
    "pesaro": lambda: play_melbourne("touche"),
    "pene-play": play_peneplay,
    "doppio": play_doppio,
    "tripla": play_tripla,
    "balsamo": play_balsamo,
    "libano": play_libano,
    "gori": play_gori,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for pid, fn in PLAYS.items():
        with open(os.path.join(OUT, pid + ".svg"), "w", encoding="utf-8") as f:
            f.write(fn())
    print("Generati %d diagrammi giocate in %s" % (len(PLAYS), OUT))


if __name__ == "__main__":
    main()
