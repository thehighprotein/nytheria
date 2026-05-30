/* ============================================================
   Liber Argenteus — Interaktion
   Modals · Hintergrundmusik · Scroll-Reveal
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sicherer localStorage-Zugriff (Privatmodus etc.) ---------- */
  var store = {
    get: function (k) {
      try { return window.localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) {}
    },
  };

  /* ----------------------------- Modals --------------------------- */
  function openModal(el) {
    if (el) { el.classList.add("is-open"); el.setAttribute("aria-hidden", "false"); }
  }
  function closeModal(el) {
    if (el) { el.classList.remove("is-open"); el.setAttribute("aria-hidden", "true"); }
  }

  document.querySelectorAll("[data-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(document.getElementById(btn.getAttribute("data-modal")));
    });
  });

  document.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeModal(el.closest(".modal"));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });

  /* -------------------------- Hintergrundmusik -------------------- */
  var KEY = "liber-argenteus-musik";
  var audio = document.getElementById("bg-music");
  var toggle = document.getElementById("music-toggle");
  var consent = document.getElementById("modal-musik");

  function reflect(isOn) {
    if (toggle) toggle.setAttribute("aria-pressed", isOn ? "true" : "false");
  }

  function play() {
    if (!audio) return;
    var p = audio.play();
    if (p && p.catch) {
      p.then(function () { reflect(true); })
       .catch(function () { reflect(false); }); // fehlende Datei / Autoplay
    } else {
      reflect(true);
    }
  }
  function pause() {
    if (audio) audio.pause();
    reflect(false);
  }

  // Toggle-Knopf in der Topbar
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-pressed") === "true") {
        pause();
        store.set(KEY, "off");
      } else {
        play();
        store.set(KEY, "on");
      }
    });
  }

  // Einwilligungs-Dialog beim ersten Besuch
  var choice = store.get(KEY);
  if (choice === "on") {
    play();
  } else if (choice === "off") {
    reflect(false);
  } else if (consent) {
    openModal(consent);
    var yes = document.getElementById("music-yes");
    var no = document.getElementById("music-no");
    if (yes) yes.addEventListener("click", function () {
      store.set(KEY, "on"); closeModal(consent); play();
    });
    if (no) no.addEventListener("click", function () {
      store.set(KEY, "off"); closeModal(consent); reflect(false);
    });
  }

  /* ----------------------- Kapitel als Tabs ----------------------- */
  // Wandelt die Kapitel-Navigation einer Charakterseite in Tabs um:
  // Ein Klick zeigt nur das gewaehlte Kapitel. Ohne JS bleibt alles
  // als normale Abfolge sichtbar (die Kapitel werden erst hier gebildet).
  (function () {
    var prose = document.querySelector(".stage .prose");
    var nav = document.querySelector(".stage .chapter-nav");
    if (!prose || !nav) return;
    var tabs = [].slice.call(nav.querySelectorAll("a"));
    if (!tabs.length) return;

    var nodes = [].slice.call(prose.childNodes);
    var sections = {};
    var order = [];
    var current = null;
    var lead = document.createElement("div");

    nodes.forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === "H2" && node.id) {
        current = document.createElement("section");
        current.className = "chapter";
        current.setAttribute("data-chapter", node.id);
        sections[node.id] = current;
        order.push(node.id);
        current.appendChild(node);
      } else if (current) {
        current.appendChild(node);
      } else {
        lead.appendChild(node); // evtl. Text vor dem ersten Kapitel
      }
    });

    if (!order.length) return; // keine H2-Kapitel -> unveraendert lassen

    prose.innerHTML = "";
    if (lead.childNodes.length) prose.appendChild(lead);
    order.forEach(function (id) { prose.appendChild(sections[id]); });

    function activate(id) {
      order.forEach(function (cid) {
        sections[cid].classList.toggle("is-active", cid === id);
      });
      tabs.forEach(function (t) {
        var tid = (t.getAttribute("href") || "").replace(/^#/, "");
        var on = tid === id;
        t.classList.toggle("is-active", on);
        if (on) { t.setAttribute("aria-current", "true"); }
        else { t.removeAttribute("aria-current"); }
      });
      if (window.history && history.replaceState) {
        history.replaceState(null, "", "#" + id);
      }
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function (e) {
        var tid = (t.getAttribute("href") || "").replace(/^#/, "");
        if (sections[tid]) { e.preventDefault(); activate(tid); }
      });
    });

    var initial = (location.hash || "").replace(/^#/, "");
    if (!sections[initial]) initial = order[0];
    activate(initial);
  })();

  /* --------------------------- Scroll-Reveal ---------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
