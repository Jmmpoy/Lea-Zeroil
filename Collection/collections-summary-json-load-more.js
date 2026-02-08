/**
 * Collections : charger tous les items de la collection via le JSON Squarespace
 * et les injecter dans la grille Summary pour dépasser la limite de 30.
 * Section ciblée : même que collections-filters.js (696abd01e1d862206d905143).
 * À charger après collections-filters.js et collections-excerpt-links.js.
 */
(function () {
  const SECTION_ID = "696abd01e1d862206d905143";
  const COLLECTION_JSON_BASE = "/collections-1?format=json";

  function getSection() {
    return document.querySelector('section[data-section-id="' + SECTION_ID + '"]');
  }

  function getList(section) {
    return section ? section.querySelector(".summary-item-list") : null;
  }

  /**
   * Récupère toutes les pages d'items du JSON.
   */
  async function fetchAllItems() {
    const allItems = [];
    let url = COLLECTION_JSON_BASE;

    while (url) {
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items || [];
      allItems.push.apply(allItems, items);

      const pagination = data.pagination;
      if (!pagination || !pagination.nextPage) break;

      url = pagination.nextPageUrl || null;
      if (url && url.indexOf("format=json") === -1) {
        url = url + (url.indexOf("?") >= 0 ? "&" : "?") + "format=json";
      }
    }

    return allItems;
  }

  /**
   * Normalise "links:" en "link:" dans l'excerpt pour que les scripts existants matchent.
   */
  function normalizeExcerptHtml(html) {
    if (!html) return "";
    return String(html).replace(/\blinks\s*:/gi, "link:");
  }

  /**
   * Construit un nœud .summary-item à partir d'un item JSON.
   * Structure et classes alignées sur le markup natif Squarespace (autogrid).
   */
  function buildSummaryItem(item) {
    const fullUrl = item.fullUrl || "/collections-1/" + (item.urlId || item.id);
    const assetUrl = item.assetUrl || "";
    const imageUrl = assetUrl ? (assetUrl.indexOf("?") >= 0 ? assetUrl + "&format=1000w" : assetUrl + "?format=1000w") : "";
    const title = item.title || "";
    const excerptHtml = normalizeExcerptHtml(item.excerpt || "");

    const wrapper = document.createElement("div");
    wrapper.className =
      "summary-item summary-item-record-type-text sqs-gallery-design-autogrid-slide " +
      "summary-item-has-thumbnail summary-item-has-excerpt summary-item-has-author positioned";
    wrapper.setAttribute("data-type", "image");

    const thumbOuter = document.createElement("div");
    thumbOuter.className = "summary-thumbnail-outer-container";

    const thumbLink = document.createElement("a");
    thumbLink.className = "summary-thumbnail-container sqs-gallery-image-container";
    thumbLink.href = fullUrl;
    thumbLink.setAttribute("data-title", title);
    thumbLink.setAttribute("data-description", "");

    const thumbDiv = document.createElement("div");
    thumbDiv.className = "summary-thumbnail img-wrapper preFade fadeIn";
    thumbDiv.setAttribute("data-animation-role", "image");

    const img = document.createElement("img");
    img.className = "summary-thumbnail-image loaded";
    img.alt = title;
    img.setAttribute("data-src", imageUrl || assetUrl);
    img.setAttribute("data-image", imageUrl || assetUrl);
    img.setAttribute("data-load", "false");
    img.setAttribute("data-image-resolution", "1000w");
    img.src = imageUrl || assetUrl;

    thumbDiv.appendChild(img);
    thumbLink.appendChild(thumbDiv);
    thumbOuter.appendChild(thumbLink);
    wrapper.appendChild(thumbOuter);

    const summaryContent = document.createElement("div");
    summaryContent.className = "summary-content sqs-gallery-meta-container preFade fadeIn";
    summaryContent.setAttribute("data-animation-role", "content");

    function addMetadataContainers(parent, position) {
      const container = document.createElement("div");
      container.className = "summary-metadata-container summary-metadata-container--" + position;
      const primary = document.createElement("div");
      primary.className = "summary-metadata summary-metadata--primary";
      const secondary = document.createElement("div");
      secondary.className = "summary-metadata summary-metadata--secondary";
      container.appendChild(primary);
      container.appendChild(secondary);
      parent.appendChild(container);
    }

    addMetadataContainers(summaryContent, "above-title");

    const titleEl = document.createElement("div");
    titleEl.className = "summary-title";
    const titleLink = document.createElement("a");
    titleLink.className = "summary-title-link";
    titleLink.href = fullUrl;
    titleLink.textContent = title;
    titleEl.appendChild(titleLink);
    summaryContent.appendChild(titleEl);

    addMetadataContainers(summaryContent, "below-title");

    const excerptEl = document.createElement("div");
    excerptEl.className = "summary-excerpt summary-excerpt-only";
    if (excerptHtml) {
      excerptEl.innerHTML = excerptHtml;
    } else {
      const excerptP = document.createElement("p");
      excerptP.setAttribute("style", "white-space: pre-wrap;");
      excerptP.setAttribute("data-rte-preserve-empty", "true");
      excerptP.className = "preFade";
      excerptEl.appendChild(excerptP);
    }
    summaryContent.appendChild(excerptEl);

    addMetadataContainers(summaryContent, "below-content");

    wrapper.appendChild(summaryContent);

    return wrapper;
  }

  /**
   * Applique link / filter / colors sur les items de la section (dont ceux injectés).
   */
  function runExtractionOnSection(section) {
    const items = section.querySelectorAll(".summary-item");
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

    function extractColors(text) {
      if (!text) return [];
      const m = text.match(/colors\s*:\s*([a-z0-9,\s-]+)/i);
      if (!m) return [];
      let line = (m[1].split(/\n/)[0] || "").trim();
      line = line.replace(/\s+links?\s*:.*$/i, "").trim();
      const tokens = line
        .split(",")
        .map(function (s) { return s.trim().toLowerCase(); })
        .filter(Boolean);
      if (tokens.length && /links?$/i.test(tokens[tokens.length - 1])) {
        tokens[tokens.length - 1] = tokens[tokens.length - 1].replace(/links?$/i, "").trim();
        if (!tokens[tokens.length - 1]) tokens.pop();
      }
      return tokens;
    }

    function extractFilter(text) {
      if (!text) return null;
      const m = text.match(/filter\s*:\s*([a-z0-9éèêëàâäùûüîïôöç\s-]+)/i);
      if (!m) return null;
      return m[1].trim().toLowerCase().replace(/\s+/g, " ") || null;
    }

    items.forEach(function (item) {
      const title = item.querySelector(".summary-title");
      const excerptEl =
        item.querySelector(".summary-excerpt") ||
        item.querySelector(".summary-excerpt-only") ||
        item.querySelector(".summary-text");

      if (!excerptEl) return;

      const raw = (excerptEl.textContent || "").trim();

      const filterValue = extractFilter(raw);
      if (filterValue) {
        item.dataset.filter = filterValue;
        excerptEl.innerHTML = (excerptEl.innerHTML || "").replace(/filter\s*:\s*[a-z0-9éèêëàâäùûüîïôöç\s-]+/i, "").trim();
      }

      const linkMatch = raw.match(/link\s*:\s*(\/[^\s\n]+)/i);
      if (linkMatch) {
        let customUrl = linkMatch[1].replace(/^\s+|\s+$/g, "");
        customUrl = customUrl.replace(/(filter|colors)\s*:[^\s\n]*$/i, "").replace(/\s+$/g, "");
        const links = item.querySelectorAll("a[href]");
        links.forEach(function (link) { link.setAttribute("href", customUrl); });
        excerptEl.innerHTML = (excerptEl.innerHTML || "").replace(/link\s*:\s*\/[^\s\n]+/gi, "").trim();
      }

      if (item.querySelector(".gm-swatches")) return;
      if (!title) return;

      const colors = extractColors(raw);
      if (!colors.length) return;

      const wrap = document.createElement("span");
      wrap.className = "gm-swatches";
      wrap.setAttribute("aria-hidden", "true");
      colors.forEach(function (name) {
        const dot = document.createElement("span");
        dot.className = "gm-swatch";
        dot.dataset.color = slugifyColorName(name);
        wrap.appendChild(dot);
      });
      title.appendChild(wrap);
      excerptEl.innerHTML = (excerptEl.innerHTML || "").replace(/colors\s*:\s*[^\n]*/i, "").trim();
    });
  }

  function run() {
    const section = getSection();
    const list = section ? getList(section) : null;
    if (!list) return;

    fetchAllItems()
      .then(function (allItems) {
        const existingCount = list.querySelectorAll(".summary-item").length;
        const toAdd = allItems.slice(existingCount);

        toAdd.forEach(function (itemData) {
          const node = buildSummaryItem(itemData);
          list.appendChild(node);
        });

        if (toAdd.length > 0) {
          runExtractionOnSection(section);
        }
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      run();
      setTimeout(run, 1200);
    });
  } else {
    run();
    setTimeout(run, 1200);
  }

  document.addEventListener("sqs-route-did-change", run);
})();
