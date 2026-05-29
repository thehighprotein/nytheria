# Liber Argenteus — Charsheet Starter

Ein **Static-Site-Generator-Template** (Eleventy) fuer atmosphaerische
Charakter- und Lore-Seiten. Struktur in drei Ebenen:

```
Grafschaft  ->  Gruppierung  ->  Charakter
 Nytheria        Caerdor Ithil    Aurelia, Theron, Maelis, Corin
                 Rußklingen       Bran, Edda
```

Du pflegst nur Markdown-Dateien — Layout, Design, Navigation, Galerie,
Musik-Umschalter und die Discord-Vorschau-Tags entstehen automatisch.

---

## 1. Voraussetzungen

- [Node.js](https://nodejs.org/) Version 18 oder neuer
- Ein GitHub-Konto (fuer die Veroeffentlichung)

## 2. Lokal starten

```bash
npm install        # einmalig: Abhaengigkeiten installieren
npm start          # Vorschau-Server auf http://localhost:8080
```

Der Server laedt bei jeder Aenderung automatisch neu.

```bash
npm run build      # erzeugt die fertige Seite im Ordner _site/
```

## 3. Auf GitHub Pages veroeffentlichen

1. Repository auf GitHub anlegen und den Projektordner pushen.
2. Im Repo: **Settings -> Pages -> Build and deployment -> Source**
   auf **"GitHub Actions"** stellen.
3. Bei jedem Push auf `main` baut der Workflow `.github/workflows/deploy.yml`
   die Seite automatisch und veroeffentlicht sie.

### Wichtig: Pfad anpassen

GitHub Pages legt Projektseiten unter `/<repo-name>/` ab. Zwei Stellen
muessen zum Repo-Namen passen:

| Datei                | Wert         | Beispiel (Repo "charsheet_sh") |
|----------------------|--------------|--------------------------------|
| `.eleventy.js`       | `pathPrefix` | `"/charsheet_sh/"`             |
| `src/_data/site.js`  | `pathPrefix` | `"/charsheet_sh"`              |
| `src/_data/site.js`  | `url`        | `"https://<user>.github.io"`   |

Bei einer **eigenen Domain** oder einem `<user>.github.io`-Repo:
`pathPrefix` auf `"/"` bzw. `""` setzen und `url` auf die Domain.

---

## 4. Inhalte pflegen

### Neuen Charakter anlegen

Lege eine `.md`-Datei im Ordner der Gruppierung an, z. B.
`src/nytheria/caerdor-ithil/neuer-held.md`:

```markdown
---
layout: layouts/charakter.njk
tags: charakter
ordnung: 5
name: Neuer Held
untertitel: Knappe der Wacht
beschreibung: Kurztext fuer die Discord-Vorschau.
bild: /assets/img/neuer-held.png
---

## Prolog
...
## Herkunft
...
## Wesen
...
## Verbindungen
...
```

- `ordnung` steuert die Reihenfolge in der Uebersicht.
- Die Zuordnung zur Gruppierung kommt automatisch aus der Datei
  `caerdor-ithil.json` im selben Ordner — nichts weiter noetig.
- Die `##`-Ueberschriften erzeugen Anker-Links wie `.../neuer-held/#prolog`.
  Eigene Kapitel? Im Frontmatter `kapitel` setzen (siehe unten).

### Neue Gruppierung anlegen

1. Ordner anlegen: `src/nytheria/<name>/`
2. Darin eine `<name>.json` (Daten-Datei) wie `caerdor-ithil.json`:
   ```json
   {
     "gruppierung": "<name>",
     "gruppierungName": "Anzeigename",
     "gruppierungUrl": "/nytheria/<name>/",
     "accent": "#c98a5e"
   }
   ```
3. Eine `index.md` mit `layout: layouts/gruppierung.njk` und `tags: gruppierung`.

### Neue Grafschaft anlegen

Analog: Ordner unter `src/`, eine Daten-`.json` mit `grafschaftName`/`grafschaftUrl`
und eine `index.md` mit `layout: layouts/grafschaft.njk`, `tags: grafschaft`.

### Eigene Kapitel pro Charakter

```yaml
kapitel:
  - { id: prolog, titel: Prolog }
  - { id: das-erwachen, titel: Das Erwachen }
```

Die `id` muss zur Ueberschrift passen (Umlaute werden zu ae/oe/ue/ss,
Leerzeichen zu Bindestrich, alles klein).

### Galerie

Optionales Frontmatter-Feld auf jeder Seite:

```yaml
galerie:
  - { src: /assets/img/bild-1.png, text: Bildunterschrift }
```

---

## 5. Bilder & Akzentfarbe

- Bilder gehoeren nach `src/assets/img/`. Im Frontmatter mit fuehrendem
  Slash referenzieren: `bild: /assets/img/datei.png`.
- **Discord-Vorschau:** Verwende fuer `bild` PNG oder JPG (kein SVG —
  Discord rendert SVG-Vorschauen nicht zuverlaessig). Gut sichtbar ist
  ein Querformat um 1200x630.
- `accent` (Hex-Farbe) faerbt Akzente, Hover-Effekte und den farbigen
  Balken der Discord-Karte. Pro Charakter, Gruppierung oder Grafschaft
  setzbar.
- Die mitgelieferten Bilder in `src/assets/img/` sind **Platzhalter** —
  ersetze sie durch eigene. Neu erzeugen lassen sie sich mit
  `python3 make_placeholders.py` (benoetigt Python + Pillow).

## 6. Hintergrundmusik

Lege deinen Track als `src/assets/audio/theme.mp3` ab (oder pro Seite per
Frontmatter `musik: /assets/audio/anderer-track.mp3`). Beim ersten Besuch
fragt die Seite nach Einwilligung; die Wahl wird im Browser gemerkt.
Verwende nur Musik, an der du die Rechte besitzt.

## 7. Discord-Verknuepfung

Jede Seite enthaelt automatisch Open-Graph-Tags. Sobald jemand einen Link
in Discord postet, erscheint eine Vorschaukarte mit Titel, Kurztext und
Bild. Voraussetzung: `url` in `src/_data/site.js` korrekt gesetzt und das
`bild` als absolut erreichbares PNG/JPG.

Hinweis: Discord speichert Vorschauen zwischen. Aenderst du Bild oder Text,
kann die alte Karte noch eine Weile erscheinen.

---

## Projektstruktur

```
.eleventy.js                 Konfiguration (pathPrefix, Markdown)
src/
  _data/site.js              globale Daten (url, Name, Farben)
  _includes/
    layouts/                 base / grafschaft / gruppierung / charakter
    partials/                head (Open Graph) / topbar / modals
  assets/
    css/style.css            das gesamte Design
    js/main.js               Modals, Musik, Scroll-Effekte
    img/                     Platzhalter-Bilder (ersetzen!)
    audio/                   Musik-Track hier ablegen
  index.njk                  Auswahlseite
  nytheria/                  Grafschaft mit Gruppierungen & Charakteren
make_placeholders.py         erzeugt die Platzhalter-Bilder neu
.github/workflows/deploy.yml automatischer Build & Deploy
```
