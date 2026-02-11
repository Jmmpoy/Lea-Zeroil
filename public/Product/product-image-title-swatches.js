/**
 * Produit : losanges de couleurs dans les titres d'images.
 */
  /* Page produit : même logique que page collaboration – Titre-couleur1,couleur2 → losanges (.image-slide-title) */
  (function injectProductPageImageSlideTitleSwatches() {
    var MAX_SWATCHES = 4;

    function slugifyColor(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "red";
    }

    function parseTitleAndColors(raw) {
      var text = (raw || "").trim();
      if (!text) return { title: "", colors: [] };
      var parts = text.split("-");
      if (parts.length < 2) return { title: text, colors: [] };
      var last = parts[parts.length - 1].trim().toLowerCase();
      if (!/^[a-z]+(,[a-z]+)*$/.test(last)) return { title: text, colors: [] };
      var colors = last
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .slice(0, MAX_SWATCHES);
      var title = parts.slice(0, -1).join("-").trim();
      return { title: title, colors: colors };
    }

    function run() {
      var container = document.querySelector(".ProductItem-additional");
      if (!container) return;
      var titles = container.querySelectorAll(".image-slide-title");
      titles.forEach(function (el) {
        if (el.querySelector(".image-slide-title__row")) return;
        var raw = (el.textContent || "").trim();
        var parsed = parseTitleAndColors(raw);
        var title = parsed.title;
        var colors = parsed.colors;
        var row = document.createElement("div");
        row.className = "image-slide-title__row";
        var textSpan = document.createElement("span");
        textSpan.className = "image-slide-title__text";
        textSpan.textContent = title || raw;
        row.appendChild(textSpan);
        if (colors.length) {
          var swatches = document.createElement("div");
          swatches.className = "image-slide-title__swatches";
          swatches.setAttribute("aria-hidden", "true");
          colors.forEach(function (name) {
            var span = document.createElement("span");
            span.className = "oasis-color__swatch";
            span.setAttribute("data-color", slugifyColor(name));
            span.setAttribute("aria-hidden", "true");
            swatches.appendChild(span);
          });
          row.appendChild(swatches);
        }
        el.textContent = "";
        el.appendChild(row);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 400);
    setTimeout(run, 1000);
    document.addEventListener("sqs-route-did-change", run);
  })();
