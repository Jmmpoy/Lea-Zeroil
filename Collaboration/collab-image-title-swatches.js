/**
 * Collaboration : losanges de couleurs dans les titres d'images.
 */
  (function injectImageSlideTitleSwatches() {
    const MAX_SWATCHES = 4;

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
      const text = (raw || "").trim();
      if (!text) return { title: "", colors: [] };
      const parts = text.split("-");
      if (parts.length < 2) return { title: text, colors: [] };
      const last = parts[parts.length - 1].trim().toLowerCase();
      if (!/^[a-z]+(,[a-z]+)*$/.test(last)) return { title: text, colors: [] };
      const colors = last
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_SWATCHES);
      const title = parts.slice(0, -1).join("-").trim();
      return { title, colors };
    }

    function run() {
      if (!document.body.classList.contains("collection-type-blog-basic-grid")) return;
      const container = document.querySelector(".blog-item-content");
      if (!container) return;
      const titles = container.querySelectorAll(".image-slide-title");
      titles.forEach((el) => {
        if (el.querySelector(".image-slide-title__row")) return;
        const raw = (el.textContent || "").trim();
        const { title, colors } = parseTitleAndColors(raw);
        const row = document.createElement("div");
        row.className = "image-slide-title__row";
        const textSpan = document.createElement("span");
        textSpan.className = "image-slide-title__text";
        textSpan.textContent = title || raw;
        row.appendChild(textSpan);
        if (colors.length) {
          const swatches = document.createElement("div");
          swatches.className = "image-slide-title__swatches";
          swatches.setAttribute("aria-hidden", "true");
          colors.forEach((name) => {
            const span = document.createElement("span");
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
    setTimeout(run, 800);
    document.addEventListener("sqs-route-did-change", run);
  })();
