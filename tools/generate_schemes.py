"""Genera gli schemi tattici degli esercizi come file SVG (assets/schemes/<id>.svg).
Nessuna dipendenza esterna. Eseguire:  python tools/generate_schemes.py

Convenzioni grafiche:
  - cerchio BLU  = attaccante / propria squadra
  - cerchio ROSSO = difensore / avversario
  - triangolo AMBRA = cono
  - freccia piena = corsa ; freccia tratteggiata = passaggio ; punteggiata = calcio
"""
import os

W, H = 400, 250
PLAY_H = 214  # altezza area di gioco (sotto c'e' la legenda)

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "schemes")

BLU = "#2563eb"
ROSSO = "#dc2626"
GRIGIO = "#64748b"
AMBRA = "#f59e0b"
SCURO = "#0f172a"

DEFS = (
    '<defs>'
    '<marker id="ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#0f172a"/></marker>'
    '<marker id="ahw" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#ffffff"/></marker>'
    '<clipPath id="pc"><rect x="0" y="0" width="400" height="214" rx="14"/></clipPath>'
    '</defs>'
)


def nf(v):
    return ("%g" % round(float(v), 1))


def esc(t):
    return str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ---------- primitive ----------
def pitch(tint=None):
    s = ['<g clip-path="url(#pc)">', '<rect x="0" y="0" width="400" height="214" fill="#1f7a44"/>']
    x = 0
    i = 0
    while x < W:
        if i % 2 == 0:
            s.append('<rect x="%d" y="0" width="34" height="214" fill="#249150" opacity="0.55"/>' % x)
        x += 34
        i += 1
    if tint:
        s.append('<rect x="0" y="0" width="400" height="214" fill="%s" opacity="0.10"/>' % tint)
    s.append('</g>')
    s.append('<rect x="8" y="8" width="384" height="198" rx="9" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2"/>')
    return "".join(s)


def player(x, y, team="A", label=""):
    fill = BLU if team == "A" else (ROSSO if team == "B" else GRIGIO)
    t = ''
    if label:
        t = '<text x="%s" y="%s" font-size="9" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">%s</text>' % (nf(x), nf(y + 3.3), esc(label))
    return '<circle cx="%s" cy="%s" r="9" fill="%s" stroke="#fff" stroke-width="1.6"/>%s' % (nf(x), nf(y), fill, t)


def bag(x, y):
    return '<rect x="%s" y="%s" width="14" height="20" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="1.2"/>' % (nf(x - 7), nf(y - 10))


def cone(x, y):
    return '<path d="M%s,%s L%s,%s L%s,%s Z" fill="%s" stroke="#b45309" stroke-width="1"/>' % (nf(x), nf(y - 9), nf(x + 6), nf(y + 5), nf(x - 6), nf(y + 5), AMBRA)


def ball(x, y):
    return ('<g><ellipse cx="%s" cy="%s" rx="6" ry="4.2" fill="#f5f1e6" stroke="#5b3a1a" stroke-width="1.2"/>'
            '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#5b3a1a" stroke-width="1"/></g>') % (nf(x), nf(y), nf(x - 4), nf(y), nf(x + 4), nf(y))


def arrow(x1, y1, x2, y2, kind="run", white=False):
    dash = {"run": "", "pass": 'stroke-dasharray="7 5"', "kick": 'stroke-dasharray="2 6"'}[kind]
    col = "#ffffff" if white else SCURO
    mk = "ahw" if white else "ah"
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3" %s marker-end="url(#%s)" stroke-linecap="round"/>' % (
        nf(x1), nf(y1), nf(x2), nf(y2), col, dash, mk)


def curve(x1, y1, x2, y2, bend=-34, kind="kick"):
    mx, my = (x1 + x2) / 2.0, (y1 + y2) / 2.0 + bend
    dash = 'stroke-dasharray="2 6"' if kind == "kick" else ('stroke-dasharray="7 5"' if kind == "pass" else "")
    return '<path d="M%s,%s Q%s,%s %s,%s" fill="none" stroke="%s" stroke-width="3" %s marker-end="url(#ah)"/>' % (
        nf(x1), nf(y1), nf(mx), nf(my), nf(x2), nf(y2), SCURO, dash)


def zone(x, y, w, h, color="#ffffff", op=0.12):
    return '<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="%s" fill-opacity="%s" stroke="%s" stroke-opacity="0.6" stroke-dasharray="5 4"/>' % (
        nf(x), nf(y), nf(w), nf(h), color, op, color)


def vline(x, color="#ffffff", op=0.6, dash=False):
    d = 'stroke-dasharray="6 6"' if dash else ''
    return '<line x1="%s" y1="14" x2="%s" y2="200" stroke="%s" stroke-opacity="%s" stroke-width="2.5" %s/>' % (nf(x), nf(x), color, op, d)


def label(x, y, text, size=11, color="#fff", anchor="start"):
    return ('<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" font-weight="600" '
            'font-family="system-ui,sans-serif" paint-order="stroke" stroke="#0f172a" stroke-width="2.4" stroke-opacity="0.35" stroke-linejoin="round">%s</text>') % (
        nf(x), nf(y), size, color, anchor, esc(text))


def row(xs, y, team, labels=None):
    out = []
    for i, x in enumerate(xs):
        out.append(player(x, y, team, labels[i] if labels else ""))
    return "".join(out)


def legend(kick=False):
    y = 233
    p = ['<rect x="0" y="214" width="400" height="36" fill="#0f172a"/>']
    items = [("dot", BLU, "Attacco"), ("dot", ROSSO, "Difesa"), ("run", None, "Corsa"), ("pass", None, "Passaggio"), ("cone", None, "Cono")]
    if kick:
        items.append(("kick", None, "Calcio"))
    x = 12
    for sym, col, txt in items:
        if sym == "dot":
            p.append('<circle cx="%s" cy="%s" r="6" fill="%s" stroke="#fff" stroke-width="1"/>' % (nf(x), nf(y - 4), col)); x += 12
        elif sym == "cone":
            p.append('<path d="M%s,%s L%s,%s L%s,%s Z" fill="%s"/>' % (nf(x), nf(y - 10), nf(x + 5), nf(y + 0), nf(x - 5), nf(y + 0), AMBRA)); x += 9
        elif sym == "run":
            p.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="2.6" marker-end="url(#ahw)"/>' % (nf(x - 6), nf(y - 4), nf(x + 9), nf(y - 4))); x += 13
        elif sym == "pass":
            p.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="2.6" stroke-dasharray="5 4" marker-end="url(#ahw)"/>' % (nf(x - 6), nf(y - 4), nf(x + 9), nf(y - 4))); x += 13
        elif sym == "kick":
            p.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="2.6" stroke-dasharray="2 5" marker-end="url(#ahw)"/>' % (nf(x - 6), nf(y - 4), nf(x + 9), nf(y - 4))); x += 13
        p.append('<text x="%s" y="%s" font-size="10" fill="#fff" font-family="system-ui,sans-serif">%s</text>' % (nf(x + 2), nf(y), txt))
        x += 12 + len(txt) * 5.8
    return "".join(p)


def doc(inner, kick=False, tint=None):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250" role="img">'
            + DEFS + pitch(tint) + inner + legend(kick) + '</svg>')


# ---------- template ----------
def square_warmup():
    cs = [(95, 55), (305, 55), (305, 165), (95, 165)]
    s = [cone(*c) for c in cs]
    s += [player(95, 55, "A"), player(305, 55, "A"), player(305, 165, "A"), player(95, 165, "A")]
    s.append(arrow(108, 55, 292, 55, "pass"))
    s.append(arrow(305, 68, 305, 152, "run"))
    s.append(arrow(292, 165, 108, 165, "pass"))
    s.append(arrow(95, 152, 95, 68, "run"))
    s.append(ball(120, 55))
    s.append(label(200, 30, "Giro a quadrato: corsa + passaggi", 11, "#fff", "middle"))
    return doc("".join(s))


def grid_handling():
    s = []
    for gx in (110, 200, 290):
        for gy in (60, 110, 160):
            s.append(cone(gx, gy))
    s.append(player(110, 160, "A")); s.append(ball(122, 160))
    s.append(player(200, 110, "A")); s.append(player(290, 60, "A")); s.append(player(200, 160, "A"))
    s.append(arrow(122, 158, 190, 118, "pass"))
    s.append(arrow(210, 105, 280, 66, "pass"))
    s.append(arrow(200, 148, 200, 124, "run"))
    s.append(label(200, 30, "Griglia di manualità: passaggi in più direzioni", 10.5, "#fff", "middle"))
    return doc("".join(s))


def game_grid(tint, caption=""):
    s = [vline(45), vline(355)]
    s += [player(120, 80, "A"), player(150, 130, "A"), player(110, 170, "A"), player(175, 105, "A")]
    s += [player(250, 90, "B"), player(285, 140, "B"), player(245, 175, "B"), player(290, 105, "B")]
    s.append(player(195, 120, "A")); s.append(ball(208, 120))
    s.append(arrow(208, 118, 248, 100, "pass"))
    s.append(arrow(150, 142, 165, 175, "run"))
    s.append(label(45, 200, "META", 9, "#fff", "middle"))
    s.append(label(355, 200, "META", 9, "#fff", "middle"))
    if caption:
        s.append(label(200, 30, caption, 10.5, "#fff", "middle"))
    return doc("".join(s), tint=tint)


def passing_channel():
    s = []
    for cx in range(70, 341, 68):
        s.append(cone(cx, 62)); s.append(cone(cx, 168))
    pts = [(85, 150), (155, 128), (225, 106), (295, 84)]
    for i, (x, y) in enumerate(pts):
        s.append(player(x, y, "A"))
    s.append(ball(98, 150))
    for i in range(len(pts) - 1):
        s.append(arrow(pts[i][0] + 12, pts[i][1] - 4, pts[i + 1][0] - 12, pts[i + 1][1] + 4, "pass"))
    s.append(arrow(85, 138, 85, 112, "run"))
    s.append(label(200, 32, "Linea di passaggio in avanzamento", 11, "#fff", "middle"))
    return doc("".join(s))


def scrumhalf_pass():
    s = []
    s.append(ball(110, 120))
    s.append(player(128, 132, "A", "9"))
    s.append(player(235, 110, "A", "10"))
    s.append(player(310, 95, "A"))
    s.append(curve(120, 122, 224, 110, -22, "pass"))
    s.append(arrow(247, 107, 300, 97, "pass"))
    s.append(label(200, 32, "Raccolta da terra e passaggio del mediano", 10.5, "#fff", "middle"))
    return doc("".join(s))


def tackle_tech():
    s = []
    for (yb, ttl) in [(95, None), (160, None)]:
        s.append(bag(170, yb))
        s.append(player(120, yb, "A")); s.append(ball(132, yb))
        s.append(arrow(134, yb, 158, yb, "run"))
    s.append(label(200, 32, "Tecnica di placcaggio sullo scudo", 11, "#fff", "middle"))
    return doc("".join(s))


def n_vs_m(n, m, tint):
    s = []
    for cx in range(70, 341, 90):
        s.append(cone(cx, 58)); s.append(cone(cx, 170))
    ax = [90, 150, 210, 270][:n]
    ay = [156, 134, 112, 92][:n]
    for i in range(n):
        s.append(player(ax[i], ay[i], "A"))
    s.append(ball(ax[0] + 12, ay[0]))
    dx = [180, 235, 285][:m]
    dy = [128, 104, 96][:m]
    for i in range(m):
        s.append(player(dx[i], dy[i], "B"))
        s.append(arrow(dx[i], dy[i] + 12, dx[i], dy[i] + 30, "run"))
    s.append(arrow(ax[0] + 12, ay[0] - 6, dx[0] - 16, dy[0] + 14, "run"))
    s.append(arrow(ax[1] + 10, ay[1] - 6, ax[2] - 12, ay[2] + 6, "pass"))
    s.append(label(200, 32, "%d contro %d: fissa e libera l'uomo" % (n, m), 11, "#fff", "middle"))
    return doc("".join(s), tint=tint)


def defensive_line(drift=False, tint=ROSSO):
    s = []
    xs = [80, 145, 210, 275, 335]
    for x in xs:
        s.append(player(x, 70, "A")); s.append(player(x, 155, "B"))
    s.append(ball(80 - 12, 70))
    for x in xs:
        if drift:
            s.append(arrow(x, 144, x + 26, 88, "run"))
        else:
            s.append(arrow(x, 144, x, 90, "run"))
    s.append(label(200, 32, "Salita difensiva " + ("a scivolamento (drift)" if drift else "in linea"), 10.5, "#fff", "middle"))
    return doc("".join(s), tint="#1d4ed8")


def back_three(kick=True):
    s = []
    s.append(player(200, 150, "A", "15"))
    s.append(player(120, 120, "A", "11"))
    s.append(player(285, 118, "A", "14"))
    if kick:
        s.append(curve(200, 30, 200, 140, -10, "kick"))
        s.append(player(200, 40, "B"))
        s.append(ball(214, 150))
    s.append(arrow(190, 142, 132, 126, "pass"))
    s.append(arrow(122, 108, 130, 80, "run"))
    s.append(label(200, 205, "Triangolo di ricezione e ripartenza", 10.5, "#fff", "middle"))
    return doc("".join(s), kick=kick)


def lineout():
    s = [vline(52, "#fff", 0.85)]
    xs = [115, 160, 205, 250]
    for x in xs:
        s.append(player(x, 120, "A"))
        s.append(player(x, 175, "B"))
    s.append(player(182, 72, "A"))         # saltatore
    s.append(ball(182, 62))
    s.append(arrow(160, 110, 178, 84, "run"))
    s.append(arrow(205, 110, 188, 84, "run"))
    s.append(player(52, 120, "A", "2"))    # lanciatore
    s.append(curve(64, 116, 180, 70, -26, "pass"))
    s.append(player(150, 150, "A", "9"))
    s.append(label(200, 200, "Touche: salto e conquista", 10.5, "#fff", "middle"))
    return doc("".join(s))


def scrum(exit=False):
    s = []
    # pacchetto blu (spinge a destra) e rosso (spinge a sinistra), si incontrano a x=200
    blu = [(178, 80), (178, 110), (178, 140), (158, 95), (158, 125), (138, 80), (138, 110), (138, 140)]
    ros = [(222, 80), (222, 110), (222, 140), (242, 95), (242, 125), (262, 80), (262, 110), (262, 140)]
    for (x, y) in blu:
        s.append(player(x, y, "A"))
    for (x, y) in ros:
        s.append(player(x, y, "B"))
    s.append(ball(200, 112))
    s.append(player(150, 165, "A", "9"))
    if exit:
        s.append(arrow(140, 140, 95, 165, "run"))
        s.append(arrow(162, 162, 220, 150, "pass"))
        s.append(player(245, 150, "A", "10"))
        s.append(label(200, 32, "Uscita da mischia e lancio del gioco", 10.5, "#fff", "middle"))
    else:
        s.append(arrow(220, 175, 200, 158, "pass"))
        s.append(label(200, 32, "Mischia: posizione e spinta", 11, "#fff", "middle"))
    return doc("".join(s))


def maul(defence=False):
    s = []
    s.append(player(205, 95, "B")); s.append(player(205, 130, "B"))
    s.append(player(178, 95, "A")); s.append(player(178, 130, "A")); s.append(player(158, 112, "A"))
    s.append(ball(150, 112))
    s.append(arrow(195, 112, 255, 112, "run"))
    cap = "Maul: difesa e contesa" if defence else "Maul: costruzione e avanzamento"
    s.append(label(200, 36, cap, 11, "#fff", "middle"))
    return doc("".join(s))


def ruck_contest():
    s = []
    s.append('<ellipse cx="200" cy="120" rx="16" ry="9" fill="%s" stroke="#fff" stroke-width="1.6"/>' % BLU)  # portatore a terra
    s.append(player(224, 110, "B"))   # placcatore
    s.append(ball(196, 120))
    s.append(player(150, 150, "A")); s.append(arrow(162, 142, 188, 126, "run"))
    s.append(player(150, 90, "A")); s.append(arrow(162, 98, 188, 114, "run"))
    s.append(player(248, 120, "B")); s.append(arrow(240, 120, 214, 120, "run"))  # jackal contende
    s.append(label(200, 36, "Ruck: ripulita e contesa del pallone", 10.5, "#fff", "middle"))
    return doc("".join(s))


def channel_defence():
    s = []
    s.append('<ellipse cx="200" cy="120" rx="15" ry="9" fill="%s" stroke="#fff" stroke-width="1.4"/>' % BLU)
    s.append(ball(200, 120))
    s.append(player(168, 118, "B")); s.append(player(232, 118, "B"))   # pilastri
    s.append(player(200, 92, "B", "G"))                                 # guardia
    s.append(player(200, 158, "A")); s.append(arrow(200, 148, 200, 132, "run"))
    s.append(player(150, 170, "A", "9"))
    s.append(label(200, 36, "Difesa del canale 9-10: pilastri e guardia", 10, "#fff", "middle"))
    return doc("".join(s))


def box_kick_chase():
    s = []
    s.append('<ellipse cx="92" cy="140" rx="20" ry="11" fill="%s" stroke="#fff" stroke-width="1.4" opacity="0.9"/>' % BLU)
    s.append(player(116, 152, "A", "9"))
    s.append(curve(122, 146, 305, 72, -52, "kick"))
    s.append(player(150, 120, "A")); s.append(arrow(162, 116, 250, 90, "run"))
    s.append(player(185, 150, "A")); s.append(arrow(197, 146, 275, 100, "run"))
    s.append(player(312, 78, "B")); s.append(ball(305, 66))
    s.append(label(200, 200, "Box kick e pressione (kick-chase)", 10.5, "#fff", "middle"))
    return doc("".join(s), kick=True)


def transition_game(tint):
    s = [vline(45), vline(355)]
    s += [player(135, 95, "A"), player(175, 150, "A"), player(150, 175, "B"), player(205, 100, "B")]
    s.append(player(200, 130, "A")); s.append(ball(213, 130))
    s.append(arrow(213, 128, 300, 110, "run"))      # attacca a destra
    s.append(arrow(150, 120, 80, 140, "run"))       # contrattacco opposto
    s.append('<text x="200" y="60" font-size="16" fill="#fff" text-anchor="middle">⟳</text>')
    s.append(label(200, 36, "Transizione al cambio di possesso", 10.5, "#fff", "middle"))
    return doc("".join(s), tint=tint)


def territory_kick():
    s = [vline(150, "#fff", 0.5, True), vline(270, "#fff", 0.5, True)]
    s.append(zone(8, 14, 134, 186, "#22c55e", 0.10))
    s.append(player(105, 120, "A", "10")); s.append(ball(105, 132))
    s.append(curve(112, 126, 330, 70, -60, "kick"))
    s.append(player(150, 100, "A")); s.append(arrow(162, 96, 250, 78, "run"))
    s.append(player(338, 80, "B"))
    s.append(label(75, 200, "difesa", 9, "#fff", "middle"))
    s.append(label(330, 200, "territorio", 9, "#fff", "middle"))
    s.append(label(200, 32, "Kicking game: guadagnare territorio", 10.5, "#fff", "middle"))
    return doc("".join(s), kick=True)


def backs_move():
    s = []
    s += [player(90, 150, "A", "10"), player(150, 130, "A", "12"), player(215, 112, "A", "13"), player(285, 95, "A", "11")]
    s.append(ball(103, 150))
    s.append(arrow(102, 146, 138, 134, "pass"))
    s.append(arrow(162, 126, 203, 116, "pass"))
    s.append(arrow(170, 145, 205, 130, "run"))   # incrocio/linea che taglia
    for x in [110, 175, 240, 305]:
        s.append(player(x, 65, "B"))
    s.append(label(200, 200, "Lancio del gioco dei trequarti", 10.5, "#fff", "middle"))
    return doc("".join(s))


def attack_phase():
    s = []
    s.append('<ellipse cx="105" cy="120" rx="17" ry="9" fill="%s" stroke="#fff" stroke-width="1.4"/>' % BLU)
    s.append(ball(105, 120))
    s.append(player(130, 138, "A", "9"))
    s.append(player(185, 120, "A", "10"))
    s.append(player(245, 108, "A"))
    s.append(player(305, 98, "A"))
    s.append(curve(120, 124, 176, 120, -16, "pass"))
    s.append(arrow(196, 116, 238, 110, "pass"))
    s.append(arrow(258, 104, 300, 96, "pass"))
    for x in [185, 245, 305]:
        s.append(player(x, 62, "B"))
    s.append(arrow(245, 96, 268, 74, "run"))
    s.append(label(200, 200, "Attacco su più fasi: gioca largo", 10.5, "#fff", "middle"))
    return doc("".join(s))


def pick_and_go():
    s = []
    s.append('<ellipse cx="150" cy="120" rx="17" ry="9" fill="%s" stroke="#fff" stroke-width="1.4"/>' % BLU)
    s.append(ball(150, 120))
    s.append(player(175, 135, "A", "9"))
    s.append(player(200, 150, "A")); s.append(arrow(200, 140, 200, 110, "run"))   # pick crash
    s.append(player(150, 165, "A")); s.append(arrow(160, 158, 178, 135, "run"))
    for x in [175, 225]:
        s.append(player(x, 92, "B"))
    s.append(player(260, 120, "A")); s.append(arrow(218, 132, 250, 122, "pass"))
    s.append(label(200, 36, "Pick & go vicino al punto d'incontro", 10.5, "#fff", "middle"))
    return doc("".join(s))


def kick_tech():
    s = []
    s.append(player(120, 150, "A", "10")); s.append(ball(120, 164))
    s.append(curve(127, 158, 320, 95, -55, "kick"))
    # pali
    s.append('<line x1="312" y1="60" x2="312" y2="120" stroke="#fff" stroke-width="3"/>')
    s.append('<line x1="338" y1="60" x2="338" y2="120" stroke="#fff" stroke-width="3"/>')
    s.append('<line x1="312" y1="84" x2="338" y2="84" stroke="#fff" stroke-width="3"/>')
    s.append(label(200, 32, "Tecnica di calcio: drop e di liberazione", 10.5, "#fff", "middle"))
    return doc("".join(s), kick=True)


def cooldown():
    s = []
    for x in [80, 150, 220, 290]:
        s.append(player(x, 120, "A"))
        s.append('<line x1="%s" y1="111" x2="%s" y2="96" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' % (nf(x), nf(x)))
    s.append('<path d="M60,175 Q120,160 180,175 T300,175 T340,170" fill="none" stroke="#0f172a" stroke-width="3" stroke-dasharray="7 6"/>')
    s.append(label(200, 36, "Defaticamento: corsa leggera e mobilità", 10.5, "#fff", "middle"))
    return doc("".join(s))


# ---------- schemi degli esercizi estratti dagli appunti del corso ----------
def waves_attack():
    """Attacco a ondate su 3 canali: 2v1 -> 3v2 -> 5v3 (8 ragazzi, i difensori si riciclano)."""
    s = [vline(140, "#fff", 0.5, True), vline(260, "#fff", 0.5, True)]
    conf = [("2v1", 2, 1), ("3v2", 3, 2), ("5v3", 5, 3)]
    xs = [(20, 140), (140, 260), (260, 380)]
    for i, (x0, x1) in enumerate(xs):
        cx = (x0 + x1) / 2
        lab, na, nd = conf[i]
        s.append(label(cx, 30, lab, 11, "#fff", "middle"))
        step_a = min(26, 96 // max(1, na - 1)) if na > 1 else 0
        for j in range(na):
            s.append(player(cx - step_a * (na - 1) / 2 + step_a * j, 170, "A"))
        for j in range(nd):
            s.append(player(cx - 26 * (nd - 1) / 2 + 26 * j, 80, "B"))
        s.append(arrow(cx - 18, 158, cx - 14, 110, "run"))
        s.append(arrow(cx - 8, 166, cx + 14, 162, "pass"))
    s.append(ball(50, 170))
    return doc("".join(s))


def pi_activation():
    """Attivazione punto d'incontro a terne P-D-S, partenza in ginocchio."""
    s = []
    for gx in (105, 295):
        s.append(player(gx - 28, 130, "A", "P"))
        s.append(ball(gx - 40, 130))
        s.append(player(gx + 6, 112, "B", "D"))
        s.append(player(gx - 36, 168, "A", "S"))
        s.append(arrow(gx - 22, 122, gx - 4, 116, "run"))
        s.append(arrow(gx - 30, 158, gx - 6, 128, "run"))
        s.append('<path d="M%s,%s a14,7 0 1,0 0.1,0" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 3"/>' % (nf(gx - 14), nf(126)))
    s.append(label(200, 36, "Terne P-D-S: rotazione dei ruoli, partenza in ginocchio", 10, "#fff", "middle"))
    return doc("".join(s))


def pass_pressure():
    """Passaggio sotto pressione nel corridoio."""
    s = [vline(120, "#fff", 0.6), vline(330, "#fff", 0.6)]
    s.append(label(108, 110, "META", 8.5, "#fff", "middle"))
    s.append('<rect x="112" y="14" width="6" height="186" fill="#fff" opacity="0.25"/>')
    s.append(player(190, 150, "A")); s.append(ball(178, 150))
    s.append(player(232, 96, "B")); s.append(arrow(232, 108, 214, 134, "run"))
    s.append(player(262, 170, "B")); s.append(arrow(252, 164, 214, 156, "run"))
    s.append(player(282, 120, "A"))
    s.append(arrow(196, 142, 272, 122, "pass"))
    s.append(arrow(282, 110, 250, 70, "run"))
    s.append(label(200, 36, "Passare prima della pressione: leggere il 1° difensore", 10, "#fff", "middle"))
    return doc("".join(s))


def def_speed_choice():
    """Attacco con palla verde-gialla-rossa: l'allenatore simula la velocità del P.I."""
    s = []
    # allenatore con i 3 palloni colorati (verde=veloce, gialla=media, rossa=lenta)
    s.append(player(60, 120, "C", "All."))
    for i, col in enumerate(("#16a34a", "#f59e0b", "#dc2626")):
        s.append('<ellipse cx="%s" cy="%s" rx="7" ry="5" fill="%s" stroke="#fff" stroke-width="1.2"/>' % (nf(88), nf(96 + i * 16), col))
    s.append(label(120, 88, "verde=veloce", 7.5, "#fff", "start"))
    s.append(label(120, 104, "gialla=media", 7.5, "#fff", "start"))
    s.append(label(120, 120, "rossa=lenta", 7.5, "#fff", "start"))
    for i, x in enumerate((150, 200, 250, 300)):
        s.append(player(x, 70, "B"))
    for i, x in enumerate((140, 180, 220, 260, 300, 340)):
        s.append(player(x, 170, "A"))
    s.append(arrow(150, 158, 196, 110, "run"))
    s.append(arrow(190, 166, 246, 162, "pass"))
    s.append(label(200, 36, "Leggi il colore del pallone: è la velocità di uscita dal P.I.", 9.5, "#fff", "middle"))
    return doc("".join(s))


def color_call():
    """Chiamata a colori per i 3/4."""
    s = []
    cols = [("#dc2626", 150), ("#16a34a", 200), ("#2563eb", 250)]
    for c, x in cols:
        s.append('<circle cx="%s" cy="98" r="7" fill="%s" stroke="#fff" stroke-width="1.4"/>' % (nf(x), c))
    for i, x in enumerate((120, 96, 72)):
        s.append(player(x, 160, "A"))
    s.append(arrow(132, 154, 188, 110, "run"))
    s.append(player(330, 150, "A"))
    s.append(arrow(206, 104, 318, 142, "pass"))
    s.append(arrow(330, 138, 348, 110, "run"))
    s.append(label(200, 36, "L'allenatore chiama il colore: riconosci, prendi, servi il largo", 9.5, "#fff", "middle"))
    return doc("".join(s))


def tracking_channel():
    """Tracking e placcaggio nel canale."""
    s = [vline(150, "#fff", 0.55), vline(250, "#fff", 0.55)]
    for y in (50, 105, 160):
        s.append(cone(150, y)); s.append(cone(250, y))
    s.append(player(200, 60, "A")); s.append(ball(212, 60))
    s.append('<path d="M200,72 q-18,22 0,44 q16,20 0,40" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>')
    s.append(player(200, 186, "B"))
    s.append('<path d="M200,174 q-12,-16 2,-34" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>')
    s.append(label(200, 30, "Tracking nel canale: accompagna e scegli il momento", 10, "#fff", "middle"))
    return doc("".join(s))


def double_tackle():
    """Raddoppio del placcaggio sotto i 2 secondi."""
    s = []
    s.append(player(200, 95, "A")); s.append(ball(213, 95))
    s.append(player(150, 165, "B")); s.append(arrow(158, 156, 190, 110, "run"))
    s.append(player(250, 165, "B")); s.append(arrow(242, 156, 210, 110, "run"))
    s.append('<circle cx="305" cy="70' + '" r="20" fill="#0f172a" opacity="0.85"/>')
    s.append('<text x="305" y="75" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">&lt;2s</text>')
    s.append(label(200, 36, "Raddoppio: uomo e pallone, entro 2 secondi", 10.5, "#fff", "middle"))
    return doc("".join(s))


def jackal_1v1():
    """1v1 jackal sul pallone a terra."""
    s = []
    s.append('<ellipse cx="200" cy="130" rx="16" ry="9" fill="%s" stroke="#fff" stroke-width="1.5"/>' % BLU)
    s.append(ball(200, 118))
    s.append(player(238, 104, "B"))
    s.append(arrow(230, 112, 210, 120, "run"))
    s.append(player(152, 160, "A"))
    s.append(arrow(162, 152, 188, 132, "run"))
    s.append(label(200, 36, "Jackal: mani sul pallone, posizione bassa e legale", 10.5, "#fff", "middle"))
    return doc("".join(s))


def carrier_lanes():
    """Canali del portatore: dentro / fuori / debordo."""
    s = [vline(140, "#fff", 0.5, True), vline(260, "#fff", 0.5, True)]
    titles = ["DENTRO", "FUORI", "DEBORDO"]
    for i, (x0, x1) in enumerate([(20, 140), (140, 260), (260, 380)]):
        cx = (x0 + x1) / 2
        s.append(player(cx, 80, "B"))
        s.append(player(cx - 6, 170, "A"))
        if i == 0:
            s.append('<path d="M%s,160 q-16,-30 -4,-62" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>' % nf(cx - 6))
        elif i == 1:
            s.append('<path d="M%s,160 q22,-30 14,-58" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>' % nf(cx - 6))
        else:
            s.append('<path d="M%s,160 q40,-26 28,-78" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>' % nf(cx - 6))
        s.append(label(cx, 42, titles[i], 9.5, "#fff", "middle"))
    return doc("".join(s))


def three_zones():
    """Tre zone: profondità e angoli di corsa."""
    s = []
    zones = [("#dc2626", 20, 140, "1"), ("#f59e0b", 140, 260, "2"), ("#16a34a", 260, 380, "3")]
    for c, x0, x1, t in zones:
        s.append('<rect x="%s" y="40" width="%s" height="50" fill="%s" opacity="0.28"/>' % (nf(x0), nf(x1 - x0), c))
        s.append(label((x0 + x1) / 2, 70, t, 13, "#fff", "middle"))
        s.append(player((x0 + x1) / 2, 52, "B"))
    s.append('<path d="M40,140 L70,140 L55,118 Z" fill="#94a3b8" stroke="#fff" stroke-width="1.4"/>')
    s.append(label(55, 158, "fonte", 8.5, "#fff", "middle"))
    s.append(player(150, 175, "A")); s.append(ball(138, 175))
    s.append(arrow(70, 136, 134, 168, "pass"))
    s.append(arrow(158, 166, 196, 100, "run"))
    s.append(label(200, 30, "Scegli DOVE attaccare: da lì profondità e angolo", 10, "#fff", "middle"))
    return doc("".join(s))


def scrum_def_zones():
    """Difesa da mischia: frattura e pendolo su 3 posizioni."""
    s = []
    blu = [(60, 120), (60, 142), (76, 110), (76, 131), (76, 152), (92, 120), (92, 142)]
    for x, y in blu:
        s.append('<circle cx="%s" cy="%s" r="6" fill="%s" stroke="#fff" stroke-width="1.2"/>' % (nf(x), nf(y), BLU))
    for x, y in [(108, 120), (108, 142), (124, 110), (124, 131), (124, 152), (140, 120), (140, 142)]:
        s.append('<circle cx="%s" cy="%s" r="6" fill="%s" stroke="#fff" stroke-width="1.2"/>' % (nf(x), nf(y), ROSSO))
    for x in (170, 215, 260, 305, 345):
        s.append(player(x, 90, "B"))
    s.append('<rect x="148" y="100" width="36" height="26" rx="6" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-dasharray="4 4"/>')
    s.append(label(166, 142, "frattura", 8.5, "#fff", "middle"))
    s.append(player(330, 170, "B", "15"))
    s.append(arrow(318, 170, 250, 176, "run"))
    s.append(arrow(342, 164, 368, 130, "run"))
    s.append(label(330, 196, "pendolo", 8.5, "#fff", "middle"))
    s.append(label(200, 30, "Chiudere la frattura, coprire il largo con il pendolo", 10, "#fff", "middle"))
    return doc("".join(s), tint="#1d4ed8")


def kick_types():
    """Tipi di calcio: grubber, chip, punt, spiral."""
    s = [player(80, 160, "A"), ball(80, 174)]
    s.append('<path d="M92,172 q40,8 80,2 q30,-4 60,4" fill="none" stroke="#0f172a" stroke-width="3" stroke-dasharray="2 6" marker-end="url(#ah)"/>')
    s.append(label(160, 196, "grubber", 8.5, "#fff", "middle"))
    s.append(curve(92, 162, 190, 120, -34, "kick"))
    s.append(label(165, 96, "chip", 8.5, "#fff", "middle"))
    s.append(curve(92, 156, 310, 70, -64, "kick"))
    s.append(label(300, 52, "punt / spiral", 8.5, "#fff", "middle"))
    s.append(player(225, 130, "B"))
    s.append(label(200, 30, "Scegliere il calcio giusto per lo spazio giusto", 10, "#fff", "middle"))
    return doc("".join(s), kick=True)


def scrum_progression():
    """Propedeutica mischia: da 1v1 alla mischia ordinata."""
    s = []
    s.append(player(70, 100, "A")); s.append(player(98, 100, "B"))
    s.append(label(84, 132, "1v1", 9, "#fff", "middle"))
    for dx, dy in [(0, -12), (0, 12)]:
        s.append(player(160 + dx, 100 + dy, "A")); s.append(player(192 + dx, 100 + dy, "B"))
    s.append(label(176, 140, "2v2", 9, "#fff", "middle"))
    blu = [(280, 86), (280, 104), (280, 122), (266, 95), (266, 113), (252, 86), (252, 104), (252, 122)]
    ros = [(304, 86), (304, 104), (304, 122), (318, 95), (318, 113), (332, 86), (332, 104), (332, 122)]
    for x, y in blu:
        s.append('<circle cx="%s" cy="%s" r="5.4" fill="%s" stroke="#fff" stroke-width="1.1"/>' % (nf(x), nf(y), BLU))
    for x, y in ros:
        s.append('<circle cx="%s" cy="%s" r="5.4" fill="%s" stroke="#fff" stroke-width="1.1"/>' % (nf(x), nf(y), ROSSO))
    s.append(label(292, 150, "mischia ordinata", 8.5, "#fff", "middle"))
    s.append(arrow(112, 100, 140, 100, "run"))
    s.append(arrow(212, 100, 238, 100, "run"))
    s.append(label(200, 36, "Postura e legature: aggiungi giocatori per gradi", 10, "#fff", "middle"))
    return doc("".join(s))


def fast_breakdown():
    """Breakdown veloce: portatore + placcatore + sostegni, < 3 secondi."""
    s = []
    s.append('<ellipse cx="190" cy="120" rx="16" ry="9" fill="%s" stroke="#fff" stroke-width="1.5"/>' % BLU)
    s.append(ball(190, 120))
    s.append(player(222, 106, "B"))
    s.append(player(130, 156, "A")); s.append(arrow(140, 148, 174, 130, "run"))
    s.append(player(140, 86, "A")); s.append(arrow(150, 92, 176, 108, "run"))
    s.append('<circle cx="310" cy="70" r="20" fill="#0f172a" opacity="0.85"/>')
    s.append('<text x="310" y="75" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">&lt;3s</text>')
    s.append(label(200, 36, "Pulizia in piedi, pochi ma efficaci: palla sotto i 3 secondi", 9.5, "#fff", "middle"))
    return doc("".join(s))


def recognize_3v2p1():
    """Riconoscere la situazione: 3v2+1 a colori (un difensore esce al richiamo)."""
    s = []
    s.append(player(70, 150, "A")); s.append(player(120, 165, "A")); s.append(player(170, 150, "A"))
    s.append(ball(95, 158))
    s.append(arrow(82, 150, 108, 160, "pass"))
    cols = ["#dc2626", "#2563eb", "#16a34a"]
    for i, x in enumerate((140, 210, 280)):
        s.append('<circle cx="%s" cy="%s" r="9" fill="%s" stroke="#fff" stroke-width="1.6"/>' % (nf(x), nf(82), cols[i]))
    s.append(cone(330, 50))
    s.append('<path d="M218,74 q40,-26 100,-22" fill="none" stroke="#0f172a" stroke-width="2.6" stroke-dasharray="5 4" marker-end="url(#ah)"/>')
    s.append(label(300, 92, "il chiamato tocca il cono", 8, "#fff", "middle"))
    s.append(arrow(178, 142, 215, 102, "run"))
    s.append(label(200, 30, "Al colore chiamato un difensore esce: attacca lo spazio (3v2+1)", 9, "#fff", "middle"))
    return doc("".join(s))


def ruck_support_choice():
    """Ruck d'incontro: la scelta del sostegno (avanzante o battuto)."""
    s = [zone(40, 60, 130, 120, "#ffffff", 0.08)]
    s.append(player(105, 120, "A")); s.append(ball(118, 120))
    s.append(player(105, 75, "B"))
    s.append(arrow(105, 87, 105, 106, "run"))
    s.append(player(60, 165, "A", "S"))
    s.append(arrow(68, 156, 96, 132, "run"))
    s.append(label(70, 188, "avanzante: vai sul pallone", 8, "#fff", "start"))
    s.append(player(250, 120, "A")); s.append(ball(263, 120))
    s.append(player(250, 78, "B"))
    s.append('<ellipse cx="250" cy="112" rx="15" ry="8" fill="%s" stroke="#fff" stroke-width="1.2" opacity="0.7"/>' % BLU)
    s.append(player(215, 168, "A", "S"))
    s.append('<path d="M224,160 q36,4 52,-28" fill="none" stroke="#0f172a" stroke-width="3" marker-end="url(#ah)"/>')
    s.append(cone(330, 150))
    s.append(label(268, 190, "battuto: giro più largo", 8, "#fff", "start"))
    s.append(label(200, 30, "Il sostegno legge il portatore e sceglie la corsa", 9.5, "#fff", "middle"))
    return doc("".join(s))


def carrier_grassi():
    """Lavoro del portatore (da Paolo Grassi): passa e sfida il difensore."""
    s = []
    s.append(player(80, 150, "A")); s.append(player(130, 170, "A")); s.append(player(180, 150, "A"))
    s.append(ball(105, 160))
    s.append(arrow(92, 152, 118, 164, "pass"))
    s.append(arrow(142, 164, 168, 154, "pass"))
    s.append(arrow(186, 140, 230, 92, "run"))
    s.append(player(245, 78, "B", "D1"))
    s.append(vline(330, "#fff", 0.6))
    s.append(label(345, 110, "META", 8.5, "#fff", "middle"))
    s.append(arrow(258, 70, 312, 60, "run"))
    s.append(label(200, 30, "Chi passa sfida subito D1; il placcato si rialza e sostiene", 9, "#fff", "middle"))
    return doc("".join(s))


def ten_passes():
    """Gioco dei 10 passaggi."""
    s = []
    pos = [(110, 90), (170, 60), (250, 80), (300, 130), (240, 170), (150, 160)]
    for i, (x, y) in enumerate(pos):
        s.append(player(x, y, "A"))
    s.append(player(195, 120, "B")); s.append(player(230, 125, "B"))
    s.append(ball(122, 90))
    s.append(arrow(122, 86, 158, 66, "pass"))
    s.append(arrow(182, 62, 238, 76, "pass"))
    s.append(arrow(258, 88, 292, 120, "pass"))
    s.append('<circle cx="330" cy="60" r="20" fill="#0f172a" opacity="0.85"/>')
    s.append('<text x="330" y="65" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">x10</text>')
    s.append(label(200, 200, "10 passaggi consecutivi = punto (anche a 3 squadre)", 9.5, "#fff", "middle"))
    return doc("".join(s))


def vertex_2v1():
    """Vertice: sfida e continuità 2v1."""
    s = [cone(200, 110)]
    s.append(player(120, 170, "A")); s.append(ball(133, 170))
    s.append(player(170, 185, "A"))
    s.append(arrow(128, 160, 188, 122, "run"))
    s.append(arrow(208, 104, 252, 84, "run"))
    s.append(player(280, 70, "B"))
    s.append(arrow(182, 178, 240, 130, "run"))
    s.append(arrow(254, 96, 268, 118, "pass"))
    s.append(player(290, 130, "A"))
    s.append(label(200, 36, "Attacca il vertice, fissa il difensore, gioca il 2v1", 10, "#fff", "middle"))
    return doc("".join(s))


def rombo_pi():
    """Rombo: placcaggio e recupero con scudi + punto d'incontro."""
    s = []
    pts = [(200, 50), (290, 115), (200, 180), (110, 115)]
    for i, (x, y) in enumerate(pts):
        s.append(bag(x, y))
    s.append('<path d="M200,62 L278,108" fill="none" stroke="#0f172a" stroke-width="2.4" marker-end="url(#ah)"/>')
    s.append('<path d="M286,127 L212,172" fill="none" stroke="#0f172a" stroke-width="2.4" marker-end="url(#ah)"/>')
    s.append('<path d="M188,172 L118,127" fill="none" stroke="#0f172a" stroke-width="2.4" marker-end="url(#ah)"/>')
    s.append('<path d="M114,103 L188,58" fill="none" stroke="#0f172a" stroke-width="2.4" marker-end="url(#ah)"/>')
    s.append(player(200, 115, "A")); s.append(ball(200, 103))
    s.append(player(232, 130, "B"))
    s.append(label(200, 205, "Giro del rombo: placcaggio e recupero, poi P.I. 1+1 vs 1+1", 9, "#fff", "middle"))
    return doc("".join(s))


def defensive_game():
    """Partita difensiva: intervento, muro e salita."""
    s = [vline(45), vline(355)]
    for i, x in enumerate((120, 165, 210, 255, 300)):
        s.append(player(x, 110, "B"))
        s.append(arrow(x, 122, x, 142, "run"))
    s.append(player(140, 180, "A")); s.append(ball(153, 180))
    s.append(player(190, 188, "A")); s.append(player(245, 182, "A"))
    s.append(label(212, 100, "muro + salita insieme", 8.5, "#fff", "middle"))
    s.append(label(200, 36, "Partita a tema difesa: intervento, muro, salita", 10, "#fff", "middle"))
    return doc("".join(s), tint="#1d4ed8")


# ---------- mappatura id esercizio -> schema ----------
SCHEMES = {
    "cat-att-quadrato": square_warmup,
    "cat-att-touch": lambda: game_grid("#65a30d", "Touch a campo ridotto"),
    "cat-att-handling-grid": grid_handling,
    "cat-tec-passaggio": passing_channel,
    "cat-tec-placcaggio": tackle_tech,
    "cat-tec-ruck": ruck_contest,
    "cat-tec-calcio": kick_tech,
    "cat-tec-raccolta": scrumhalf_pass,
    "cat-rep-3c2": lambda: n_vs_m(3, 2, "#d62828"),
    "cat-rep-salita": lambda: defensive_line(False),
    "cat-rep-triangolo": lambda: back_three(True),
    "cat-rep-trequarti": backs_move,
    "cat-rep-drift": lambda: defensive_line(True),
    "cat-rep-touche-salti": lineout,
    "cat-rep-mischia": lambda: scrum(False),
    "cat-rep-maul": lambda: maul(False),
    "cat-rep-ruck": ruck_contest,
    "cat-rep-boxkick": box_kick_chase,
    "cat-sit-attacco2fasi": attack_phase,
    "cat-sit-pickgo": pick_and_go,
    "cat-sit-canale910": channel_defence,
    "cat-sit-difesa-drift": lambda: defensive_line(True),
    "cat-sit-contrcalcio": lambda: back_three(True),
    "cat-sit-contr-turnover": lambda: transition_game("#ea580c"),
    "cat-sit-touche": lineout,
    "cat-sit-kick-territorio": territory_kick,
    "cat-sit-mischia-uscita": lambda: scrum(True),
    "cat-sit-maul-gioco": lambda: maul(True),
    "cat-sit-transizione": lambda: transition_game("#c026d3"),
    "cat-gioco-attacco-overload": lambda: game_grid("#d62828", "Attacco in superiorità numerica"),
    "cat-gioco-difesa-pari": lambda: game_grid("#1d4ed8", "Difesa a numeri pari"),
    "cat-gioco-transizioni": lambda: transition_game("#ea580c"),
    "cat-gioco-kick-territorio": territory_kick,
    "cat-gioco-ruck-contesa": lambda: game_grid("#b45309", "Partita con contesa sul placcaggio"),
    "cat-gioco-touche-ripartenze": lambda: game_grid("#7c3aed", "Partita con ripartenze da touche"),
    "cat-def-mobilita": cooldown,
    "cat-def-core": cooldown,
    # esercizi dagli appunti del corso
    "app-att-ondate": waves_attack,
    "app-att-pi": pi_activation,
    "app-tec-pass-pressione": pass_pressure,
    "app-sit-salita-vlp": def_speed_choice,
    "app-att-colori": color_call,
    "app-tec-tracking": tracking_channel,
    "app-rep-raddoppio": double_tackle,
    "app-tec-jackal": jackal_1v1,
    "app-tec-canali-portatore": carrier_lanes,
    "app-rep-trezone": three_zones,
    "app-sit-mischia-3pos": scrum_def_zones,
    "app-tec-tipi-calcio": kick_types,
    "app-tec-prop-mischia": scrum_progression,
    "app-rep-breakdown3s": fast_breakdown,
    # esercizi dalla cartella "spunti allenamenti da sistemare"
    "app-sit-3v2p1-colori": recognize_3v2p1,
    "app-rep-ruck-scelta": ruck_support_choice,
    "app-tec-portatore-grassi": carrier_grassi,
    "app-att-10pass": ten_passes,
    "app-rep-vertice": vertex_2v1,
    "app-tec-rombo-pi": rombo_pi,
    "app-gioco-partita-dif": defensive_game,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for ex_id, fn in SCHEMES.items():
        svg = fn()
        with open(os.path.join(OUT, ex_id + ".svg"), "w", encoding="utf-8") as f:
            f.write(svg)
    print("Generati %d schemi in %s" % (len(SCHEMES), OUT))


if __name__ == "__main__":
    main()
