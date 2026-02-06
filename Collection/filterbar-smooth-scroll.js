/**
 * UI : scroll doux pour la barre de filtres.
 */
  (function () {
    const GRID_SECTION_ID = "696abd01e1d862206d905143";

    function initFilter() {
      const gridSection = document.querySelector(`section[data-section-id="${GRID_SECTION_ID}"]`);
      const filterBar = document.querySelector("[data-gm-filter]");
      if (!gridSection || !filterBar) return;

      const filterLinks = filterBar.querySelectorAll(".gm-filterbar__item");

      function applyFilter(value) {
        const listEl = gridSection.querySelector(".summary-item-list");
        const items = gridSection.querySelectorAll(".summary-item");
        const isAll = !value || value === "all";
        const visible = [];
        items.forEach(item => {
          const itemFilter = (item.dataset.filter || "").trim();
          const match = isAll || itemFilter === value;
          item.classList.toggle("gm-filter-hidden", !match);
          if (match) visible.push({ title: (item.querySelector(".summary-title-link") || item.querySelector(".summary-title"))?.textContent?.trim() || "", filter: itemFilter || "(aucun)" });
        });
        if (listEl) listEl.classList.toggle("gm-filter-active", !isAll);
        filterLinks.forEach(link => {
          const href = (link.getAttribute("href") || "").trim();
          const linkValue = href.slice(1).toLowerCase();
          link.classList.toggle("is-active", isAll ? linkValue === "all" : linkValue === value);
        });
      }

      filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const href = (this.getAttribute("href") || "").trim();
          const value = href.slice(1).toLowerCase();
          applyFilter(value);
        });
      });

      const items = gridSection.querySelectorAll(".summary-item");
      applyFilter("all");

      // Appliquer le filtre depuis le hash (ex. /collections#luminaires) après extraction des data-filter (800 ms)
      const hash = (window.location.hash || "").replace(/^#/, "").trim().toLowerCase();
      if (hash) {
        setTimeout(function () {
          applyFilter(hash);
        }, 1000);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(initFilter, 300);
      });
    } else {
      setTimeout(initFilter, 300);
    }
  })();
