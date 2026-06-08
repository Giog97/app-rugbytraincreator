"""Genera le icone PNG dell'app (rugby ball su campo verde) senza dipendenze esterne.
Encoder PNG minimale basato solo su zlib/struct della libreria standard.
Uso: python tools/generate_icons.py
"""
import zlib
import struct
import os

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")

BG = (18, 78, 43)        # verde campo
BG_DARK = (12, 56, 31)   # verde piu' scuro (gradiente)
CREAM = (245, 241, 230)  # palla
CREAM_EDGE = (214, 206, 188)
SEAM = (52, 37, 20)      # cuciture


def _chunk(typ, data):
    return (struct.pack(">I", len(data)) + typ + data +
            struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff))


def write_png(path, size, pad=1.0):
    w = h = size
    cx, cy = w / 2.0, h / 2.0
    a = w * 0.34 * pad   # semiasse orizzontale palla
    b = h * 0.23 * pad   # semiasse verticale palla
    seam_th = max(2.0, h * 0.013)
    lace_band_x = w * 0.085
    lace_band_y = h * 0.05
    lace_spacing = w * 0.032
    lace_w = max(1.5, w * 0.007)

    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filtro 0
        # gradiente verticale del fondo
        t = y / (h - 1)
        bg = (
            int(BG[0] * (1 - t) + BG_DARK[0] * t),
            int(BG[1] * (1 - t) + BG_DARK[1] * t),
            int(BG[2] * (1 - t) + BG_DARK[2] * t),
        )
        for x in range(w):
            nx = (x - cx) / a
            ny = (y - cy) / b
            d = nx * nx + ny * ny
            if d <= 1.0:
                # cuciture centrali (linea orizzontale lungo l'asse maggiore)
                if abs(y - cy) <= seam_th:
                    raw.extend(SEAM); continue
                # lacci: linea verticale centrale + trattini
                if abs(x - cx) <= lace_w * 1.2 and abs(y - cy) <= lace_band_y:
                    raw.extend(SEAM); continue
                if (abs(x - cx) <= lace_band_x and abs(y - cy) <= lace_band_y and
                        (abs(((x - cx) % lace_spacing)) <= lace_w or
                         abs(((x - cx) % lace_spacing) - lace_spacing) <= lace_w)):
                    raw.extend(SEAM); continue
                if d > 0.9:
                    raw.extend(CREAM_EDGE); continue
                raw.extend(CREAM)
            else:
                raw.extend(bg)

    compressed = zlib.compress(bytes(raw), 9)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)  # 8 bit, RGB
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(_chunk(b"IHDR", ihdr))
        f.write(_chunk(b"IDAT", compressed))
        f.write(_chunk(b"IEND", b""))
    print("scritto", path, f"({size}x{size})")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    write_png(os.path.join(OUT_DIR, "icon-192.png"), 192, pad=1.0)
    write_png(os.path.join(OUT_DIR, "icon-512.png"), 512, pad=1.0)
    write_png(os.path.join(OUT_DIR, "icon-maskable-512.png"), 512, pad=0.78)


if __name__ == "__main__":
    main()
