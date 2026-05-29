#!/usr/bin/env python3
"""Erzeugt stimmungsvolle Platzhalter-Bilder (PNG) fuer das Starter-Template."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUT = "src/assets/img"
os.makedirs(OUT, exist_ok=True)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

BG = (10, 13, 18)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def font(path, size):
    return ImageFont.truetype(path, size)


def radial_glow(size, accent, strength=0.42):
    """Weicher radialer Schimmer in der Akzentfarbe."""
    w, h = size
    glow = Image.new("RGB", size, BG)
    px = glow.load()
    cx, cy = w / 2, h * 0.42
    maxd = (max(w, h)) * 0.62
    ar, ag, ab = accent
    for y in range(h):
        for x in range(0, w, 2):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = max(0.0, 1.0 - d / maxd) ** 2 * strength
            r = int(BG[0] + (ar - BG[0]) * t)
            g = int(BG[1] + (ag - BG[1]) * t)
            b = int(BG[2] + (ab - BG[2]) * t)
            px[x, y] = (r, g, b)
            if x + 1 < w:
                px[x + 1, y] = (r, g, b)
    return glow.filter(ImageFilter.GaussianBlur(6))


def vignette(img):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([-w * 0.25, -h * 0.25, w * 1.25, h * 1.25], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) // 6))
    dark = Image.new("RGB", (w, h), BG)
    return Image.composite(img, dark, mask)


def make(name, size, accent_hex, glyph, label, sub=""):
    accent = hex_rgb(accent_hex)
    w, h = size
    img = radial_glow(size, accent)
    img = vignette(img)
    d = ImageDraw.Draw(img)

    # feiner Doppelrahmen
    m = max(int(min(w, h) * 0.045), 22)
    line = tuple(int(c * 0.5 + 30) for c in accent)
    d.rectangle([m, m, w - m, h - m], outline=line, width=2)
    d.rectangle([m + 9, m + 9, w - m - 9, h - m - 9],
                outline=tuple(int(c * 0.35 + 14) for c in accent), width=1)

    # grosse Initiale / Glyphe
    gsize = int(min(w, h) * 0.46)
    gf = font(SERIF_BOLD, gsize)
    bbox = d.textbbox((0, 0), glyph, font=gf)
    gw, gh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    gx = (w - gw) / 2 - bbox[0]
    gy = h * 0.40 - gh / 2 - bbox[1]
    d.text((gx + 3, gy + 4), glyph, font=gf, fill=(0, 0, 0))
    d.text((gx, gy), glyph, font=gf,
           fill=tuple(min(255, c + 70) for c in accent))

    # Label
    lf = font(SERIF, max(int(min(w, h) * 0.052), 24))
    lb = d.textbbox((0, 0), label, font=lf)
    d.text(((w - (lb[2] - lb[0])) / 2, h * 0.66), label, font=lf,
           fill=(228, 224, 214))

    # Zierglyphe
    sf = font(SERIF, max(int(min(w, h) * 0.03), 14))
    star = "\u25C6"
    sb = d.textbbox((0, 0), star, font=sf)
    d.text(((w - (sb[2] - sb[0])) / 2, h * 0.745), star, font=sf,
           fill=tuple(min(255, c + 40) for c in accent))

    # Unterzeile
    if sub:
        uf = font(SERIF, max(int(min(w, h) * 0.032), 15))
        ub = d.textbbox((0, 0), sub, font=uf)
        d.text(((w - (ub[2] - ub[0])) / 2, h * 0.80), sub, font=uf,
               fill=(120, 116, 107))

    # Hinweis
    hf = font(SERIF, max(int(min(w, h) * 0.026), 13))
    hint = "PLATZHALTER"
    hb = d.textbbox((0, 0), hint, font=hf)
    d.text(((w - (hb[2] - hb[0])) / 2, h - m - 34), hint, font=hf,
           fill=(86, 83, 76))

    img.save(os.path.join(OUT, name), "PNG")
    print("  ", name)


SILVER = "#9fb6cc"
COPPER = "#c98a5e"
STEEL = "#9aa7b8"

print("Erzeuge Platzhalter-Bilder ...")
# Banner (breit)
make("og-default.png", (1200, 630), STEEL, "\u25C6", "Liber Argenteus",
     "Chroniken der Grafschaft Nytheria")
make("banner-nytheria.png", (1600, 900), STEEL, "N", "Nytheria",
     "Grafschaft im Schatten der Silberberge")
make("banner-caerdor-ithil.png", (1600, 900), SILVER, "C", "Caerdor Ithil",
     "Orden der Silberwacht")
make("banner-russklingen.png", (1600, 900), COPPER, "R", "Ru\u00dfklingen",
     "Bande aus dem Aschewald")

# Portraits (3:4)
portraits = [
    ("aurelia.png", SILVER, "A", "Aurelia von Caerdor"),
    ("theron.png", SILVER, "T", "Theron Ithilen"),
    ("maelis.png", SILVER, "M", "Maelis Dunring"),
    ("corin.png", SILVER, "C", "Corin Hallaran"),
    ("bran.png", COPPER, "B", "Bran Ru\u00dfklinge"),
    ("edda.png", COPPER, "E", "Edda Aschehand"),
]
for name, acc, glyph, label in portraits:
    make(name, (1200, 1600), acc, glyph, label)

# Galerie (quadratisch)
for i, txt in enumerate(["Silberkapelle", "Schwurklinge", "Auf der Wacht"], 1):
    make("galerie-%02d.png" % i, (800, 800), SILVER, "\u25C6", txt)

print("Fertig.")
