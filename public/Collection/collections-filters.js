/**
 * Collections : extraction des couleurs/filtres et filtrage des items.
 */
  (function () {
    const SECTION_ID = "696abd01e1d862206d905143";

    function runExtraction() {
      const section = document.querySelector(`section[data-section-id="${SECTION_ID}"]`);
      if (!section) return;
      const items = section.querySelectorAll(".summary-item");
      if (!items.length) return;

      function extractColors(text) {
        if (!text) return [];
        const m = text.match(/colors\s*:\s*([a-z0-9,\s-]+)/i);
        if (!m) return [];
        // Première ligne uniquement (évite de mélanger filter:, link:, etc.)
        let line = (m[1].split(/\n/)[0] || "").trim();
        // Enlever " link:..." / " links:..." si présent (même sans \n dans le texte)
        line = line.replace(/\s+links?\s*:.*$/i, "").trim();
        const tokens = line
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        // Dernier token : retirer le suffixe "link"/"links" (ex. roselinks → rose, orlinks → or)
        if (tokens.length && /links?$/i.test(tokens[tokens.length - 1])) {
          tokens[tokens.length - 1] = tokens[tokens.length - 1].replace(/links?$/i, "").trim();
          if (!tokens[tokens.length - 1]) tokens.pop();
        }
        return tokens;
      }

      // Alias : formes sans tiret (ex. jaunepaille) → slug canonique (jaune-paille) pour matcher les variables CSS
      const COLOR_SLUG_ALIASES = {
        jaunepaille: "jaune-paille",
        brunterre: "brun-terre",
        roseetrusque: "rose-etrusque",
        vieuxrose: "vieux-rose",
        vertfonce: "vert-fonce",
        vertclair: "vert-clair",
        vertprairie: "vert-prairie",
        vertgazon: "vert-gazon",
        vertkaki: "vert-kaki",
        jauneclair: "jaune-clair",
        rosepale: "rose-pale",
        rosefonce: "rose-fonce",
        roseterre: "rose-terre",
        rosebrunterre: "rose-brun-terre",
        bordeauxfonce: "bordeaux-fonce",
        brunboisbrule: "brun-bois-brule",
        rosepalebrunterre: "rose-pale-brun-terre",
      };

      function slugifyColorName(s) {
        const slug =
          String(s ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "rouge";
        return COLOR_SLUG_ALIASES[slug] ?? slug;
      }

      function extractFilter(text) {
        if (!text) return null;
        const m = text.match(/filter\s*:\s*([a-z0-9éèêëàâäùûüîïôöç\s-]+)/i);
        if (!m) return null;
        return m[1].trim().toLowerCase().replace(/\s+/g, " ") || null;
      }

      const itemsWithFilter = [];
      items.forEach(item => {
        const title = item.querySelector(".summary-title");
        // Lire le conteneur excerpt (tous les <p>) pour avoir "filter:assises" même dans un 2e paragraphe
        const excerptEl =
          item.querySelector(".summary-excerpt") ||
          item.querySelector(".summary-text") ||
          item.querySelector(".summary-excerpt p") ||
          item.querySelector(".summary-text p");

        if (!excerptEl) return;

        const raw = (excerptEl.textContent || "").trim();

        // 1) Filtre : extraire filter:xxx (ex. filter:assises), mettre sur l'item, retirer de l'excerpt
        const filterValue = extractFilter(raw);
        if (filterValue) {
          item.dataset.filter = filterValue;
          const titleText = (item.querySelector(".summary-title-link") || title).textContent || "";
          itemsWithFilter.push({ title: titleText.trim(), filter: filterValue });
          excerptEl.innerHTML = excerptEl.innerHTML.replace(/filter\s*:\s*[a-z0-9éèêëàâäùûüîïôöç\s-]+/i, "").trim();
        }

        // 1b) Lien boutique : extraire link:/boutique/p/xxx (s'arrêter avant filter: ou colors:)
        const linkMatch = raw.match(/link\s*:\s*(\/[^\s\n]+)/i);
        if (linkMatch) {
          let customUrl = linkMatch[1].replace(/^\s+|\s+$/g, "");
          // Retirer toute partie "filter:..." ou "colors:..." collée à la fin de l'URL
          customUrl = customUrl.replace(/(filter|colors)\s*:[^\s\n]*$/i, "").replace(/\s+$/g, "");
          const links = item.querySelectorAll("a[href]");
          links.forEach((link) => link.setAttribute("href", customUrl));
          excerptEl.innerHTML = excerptEl.innerHTML.replace(/link\s*:\s*\/[^\s\n]+/gi, "").trim();
        }

        // 2) Pastilles (swatches) : inchangé, uniquement si pas déjà présents
        if (item.querySelector(".gm-swatches")) return;
        if (!title) return;

        const colors = extractColors(raw);
        if (!colors.length) return;

        const wrap = document.createElement("span");
        wrap.className = "gm-swatches";
        wrap.setAttribute("aria-hidden", "true");

        colors.forEach(name => {
          const dot = document.createElement("span");
          dot.className = "gm-swatch";
          dot.dataset.color = slugifyColorName(name);
          wrap.appendChild(dot);
        });

        title.appendChild(wrap);
        excerptEl.innerHTML = excerptEl.innerHTML.replace(/colors\s*:\s*[^\n]*/i, "").trim();
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        runExtraction();
        setTimeout(runExtraction, 800);
      });
    } else {
      runExtraction();
      setTimeout(runExtraction, 800);
    }
  })();
