// Berechnet kurze Hashes der statischen Assets fuer Cache-Busting.
// Die Version aendert sich nur, wenn sich der Dateiinhalt aendert.
const fs = require("fs");
const crypto = require("crypto");

function version(file) {
  try {
    const inhalt = fs.readFileSync(file);
    return crypto.createHash("md5").update(inhalt).digest("hex").slice(0, 8);
  } catch (e) {
    return "0";
  }
}

module.exports = {
  cssVersion: version("src/assets/css/style.css"),
  jsVersion: version("src/assets/js/main.js"),
};
