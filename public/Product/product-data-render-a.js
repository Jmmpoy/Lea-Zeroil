/**
 * Produit : rendu des blocs @product-data (instance 1).
 */
  (function () {
    "use strict";

    const MARKER = "@product-data";

    function normalizeKey(k) {
      return (k || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
    }

    function escapeHtml(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function slugifyToken(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function capFirst(s) {
      const t = String(s ?? "").trim();
      return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
    }

    function parsePayload(raw) {
      const lines = raw
        .split("\n")
        .map((l) => l.replace(/\r/g, ""))
        .filter((l) => l.trim() !== "");

      const markerIdx = lines.findIndex((l) => l.trim() === MARKER);
      if (markerIdx === -1) return null;

      const contentLines = lines.slice(markerIdx + 1);

      const data = { materiaux: "", fabrication: "", colors: [], dimensions: [] };

      let i = 0;
      while (i < contentLines.length) {
        const line = contentLines[i].trim();

        if (/^dimensions\s*:/i.test(line)) {
          i++;
          while (i < contentLines.length) {
            const l = contentLines[i].trim();
            if (!l) { i++; continue; }
            if (/^(materiaux|matériaux|materials|fabrication|colors|colour|couleurs)\s*:/i.test(l)) break;
            const m = l.match(/^-+\s*(.+)$/);
            data.dimensions.push((m && m[1] ? m[1] : l).trim());
            i++;
          }
          continue;
        }

        const kv = line.match(/^([^:]+)\s*:\s*(.*)$/);
        if (kv) {
          const key = normalizeKey(kv[1]);
          const val = (kv[2] || "").trim();

          if (key === "materiaux" || key === "materiaux" || key === "materials") {
            data.materiaux = val;
          } else if (key === "fabrication") {
            data.fabrication = val;
          } else if (key === "colors" || key === "couleurs" || key === "colour") {
            data.colors = val.split(",").map((c) => c.trim()).filter(Boolean);
          } else if (key === "dimensions") {
            if (val) data.dimensions.push(val);
          }
        }

        i++;
      }

      const ok = data.materiaux || data.fabrication || data.colors.length || data.dimensions.length;
      return ok ? data : null;
    }

    function buildRow(label, headHtml, opts) {
      const expanded = !!opts?.expanded;
      const collapsible = !!opts?.collapsible;

      if (!collapsible) {
        return `
        <div class="oasis-spec__row">
          <div class="oasis-spec__label">${escapeHtml(label)}</div>
          <div class="oasis-spec__value">${headHtml}</div>
        </div>
      `;
      }

      return `
      <div class="oasis-spec__row oasis-spec__row--collapsible" data-expanded="${expanded ? "true" : "false"}">
        <button class="oasis-spec__head" type="button" aria-expanded="${expanded ? "true" : "false"}">
          <span class="oasis-spec__label">${escapeHtml(label)}</span>
          <span class="oasis-spec__value">${headHtml}</span>
          <span class="oasis-spec__icon" aria-hidden="true"></span>
        </button>
        <div class="oasis-spec__panel" ${expanded ? "" : "hidden"}></div>
      </div>
    `;
    }

    function buildColorsList(colors, selectedName) {
      const selectedToken = slugifyToken(selectedName || "");
      return `
    <div class="oasis-colors" role="list">
      ${colors.map((name) => {
        const token = slugifyToken(name);
        const isSelected = token === selectedToken;
        return `
          <button type="button" class="oasis-color" data-color-name="${escapeHtml(name)}" data-color-token="${escapeHtml(token)}" ${isSelected ? 'data-selected="1"' : ''}>
            <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
            <span class="oasis-color__name">${escapeHtml(name.toUpperCase())}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
    }

    function buildDimsList(dimensions) {
      return `
      <div class="oasis-dims">
        ${dimensions.map((d) => `<div class="oasis-dim__line">${escapeHtml(d)}</div>`).join("")}
      </div>
    `;
    }

    function renderComponent(data) {
      const parts = [];

      if (data.materiaux) {
        parts.push(buildRow("Matériaux", `<span class="oasis-inline">${escapeHtml(data.materiaux)}</span>`, { collapsible: false }));
      }

      if (data.dimensions.length) {
        const head = `<span class="oasis-inline">${escapeHtml(data.dimensions[0])}</span>`;
        parts.push(buildRow("Taille", head, { collapsible: true, expanded: false }));
      }

      if (data.colors.length) {
        const first = data.colors[0];
        const token = slugifyToken(first);

        const head = `
        <span class="oasis-inline oasis-inline--color">
          <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
          <span class="oasis-inline__name">${escapeHtml(first.toUpperCase())}</span>
        </span>
      `;

        // ✅ NO DUPLICATE: panel shows colors without the first item
        const rest = data.colors.slice(1);
        parts.push(buildRow("Coloris", head, { collapsible: true, expanded: false, panelHtml: buildColorsList(rest) }));
      }

      if (data.fabrication) {
        parts.push(buildRow("Fabrication", `<span class="oasis-inline">${escapeHtml(data.fabrication)}</span>`, { collapsible: false }));
      }

      return `<div class="oasis-spec" data-oasis-spec>${parts.join("")}</div>`;
    }

    function bind(scope, data) {
      // Insert panels after rendering (so we can conditionally skip first color)
      const rows = scope.querySelectorAll(".oasis-spec__row--collapsible");
      rows.forEach((row) => {
        const label = row.querySelector(".oasis-spec__label")?.textContent?.trim()?.toLowerCase() || "";
        const panel = row.querySelector(".oasis-spec__panel");
        if (!panel) return;

        if (label.startsWith("taille")) {
          const restDims = data.dimensions.slice(1);
          panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildDimsList(restDims)}</div>`;
        }
        if (label.startsWith("coloris")) {
          const rest = data.colors.slice(1);
          panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildColorsList(rest)}</div>`;
        }

        const btn = row.querySelector(".oasis-spec__head");
        btn?.addEventListener("click", () => {
          const expanded = row.getAttribute("data-expanded") === "true";
          const next = !expanded;
          row.setAttribute("data-expanded", next ? "true" : "false");
          btn.setAttribute("aria-expanded", next ? "true" : "false");
          if (next) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });
      });
    }

    function mountAll() {
      const blocks = document.querySelectorAll(".sqs-block");
      blocks.forEach((block) => {
        if (block.classList.contains("oasis-spec-mounted")) return;
        const text = (block.textContent || "").trim();
        if (!text.includes(MARKER)) return;

        const data = parsePayload(text);
        if (!data) return;

        const content = block.querySelector(".sqs-block-content") || block;
        content.innerHTML = renderComponent(data);
        block.classList.add("oasis-spec-mounted");

        const scope = block.querySelector("[data-oasis-spec]");
        if (scope) bind(scope, data);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountAll);
    } else {
      mountAll();
    }

    const obs = new MutationObserver(() => mountAll());
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();
