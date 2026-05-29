const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // --- Statische Assets unveraendert kopieren -----------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // README-Dateien in assets/ nicht als Seiten rendern
  eleventyConfig.ignores.add("src/assets/**/*.md");

  // --- Markdown: ueberschriften bekommen automatisch eine id --------------
  // Dadurch funktionieren Anker-Links wie  .../lyra/#prolog
  const md = markdownIt({ html: true, typographer: true }).use(
    markdownItAnchor,
    {
      slugify: (s) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[\s]+/g, "-")
          .replace(/[äÄ]/g, "ae")
          .replace(/[öÖ]/g, "oe")
          .replace(/[üÜ]/g, "ue")
          .replace(/ß/g, "ss")
          .replace(/[^a-z0-9-]/g, ""),
      permalink: markdownItAnchor.permalink.headerLink(),
    }
  );
  eleventyConfig.setLibrary("md", md);

  // --- Filter: absolute URL fuer Open-Graph-Bilder ------------------------
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try {
      return new URL(path, base).toString();
    } catch (e) {
      return path;
    }
  });

  // --- Filter: Sammlung nach (verschachteltem) Attribut filtern -----------
  // Beispiel: collections.gruppierung | filterBy("data.grafschaft", slug)
  eleventyConfig.addFilter("filterBy", (arr, path, value) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => {
      const v = String(path).split(".").reduce((o, k) => (o == null ? o : o[k]), item);
      return v === value;
    });
  });

  return {
    // WICHTIG fuer GitHub Pages Projektseiten:
    // Repo "charsheet_sh" -> Seite liegt unter /charsheet_sh/
    // Bei eigener Domain oder <user>.github.io-Repo: auf "/" setzen.
    pathPrefix: "/nytheria/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
