// Globale Seiten-Daten. Ueberall als {{ site.xxx }} verfuegbar.
module.exports = {
  // === HIER ANPASSEN ===
  // Die Basis-URL deiner veroeffentlichten Seite OHNE Pfad-Anteil.
  // Beispiel GitHub Pages:  https://demkadse.github.io
  // Beispiel eigene Domain: https://nytheria.de
  url: "https://thehighprotein.github.io",

  // Pfad-Praefix muss zum pathPrefix in .eleventy.js passen.
  // Bei eigener Domain bzw. <user>.github.io-Repo: "" (leer).
  pathPrefix: "/nytheria",

  name: "Liber Argenteus",
  tagline: "Chroniken der Grafschaft Nytheria",
  // Akzentfarbe als Fallback, falls eine Seite keine eigene definiert.
  accent: "#9aa7b8",
  themeColor: "#0a0d12",
  lang: "de",
};
