/**
 * Blog item : libellés personnalisés pour la pagination prev/next.
 */
  (function itemPaginationPrevNextLabels() {
    const CUSTOM_CLASS = "item-pagination-label-custom";

    function getLabelsFromPath() {
      var path = (typeof window.location.pathname === "string" ? window.location.pathname : "") || "";
      if (path.indexOf("/evenements-post/") !== -1) {
        return { prev: "Voir l'évènement précédent", next: "Voir l'évènement suivant" };
      }
      if (path.indexOf("/galerie-oasis-collections") !== -1) {
        return { prev: "Voir l'exposition précédente", next: "Voir l'exposition suivante" };
      }
      return { prev: "Voir la collaboration précédente", next: "Voir la collaboration suivante" };
    }

    function run() {
      if (!document.body.classList.contains("collection-type-blog-basic-grid")) return;
      const section = document.querySelector("#itemPagination, .item-pagination.item-pagination--prev-next");
      if (!section) return;

      const linkPrev = section.querySelector(".item-pagination-link--prev");
      const linkNext = section.querySelector(".item-pagination-link--next");
      const labels = getLabelsFromPath();

      function injectOrUpdateLabel(link, text) {
        if (!link) return;
        var existing = link.querySelector("." + CUSTOM_CLASS);
        if (existing) {
          existing.textContent = text;
          return;
        }
        const wrapper = link.querySelector(".pagination-title-wrapper");
        const span = document.createElement("span");
        span.className = CUSTOM_CLASS;
        span.setAttribute("aria-hidden", "true");
        span.textContent = text;
        const icon = link.querySelector(".item-pagination-icon");
        if (icon && wrapper) {
          link.insertBefore(span, wrapper);
        } else if (icon) {
          link.insertBefore(span, icon.nextSibling);
        } else {
          link.appendChild(span);
        }
        if (wrapper) wrapper.remove();
      }

      if (linkPrev) injectOrUpdateLabel(linkPrev, labels.prev);
      if (linkNext) injectOrUpdateLabel(linkNext, labels.next);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 400);
    document.addEventListener("sqs-route-did-change", run);
  })();
