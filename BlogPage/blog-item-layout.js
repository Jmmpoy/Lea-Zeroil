/**
 * Blog item : injection d'IDs et classes pour la mise en page.
 */
  /* Blog item : injecter Block ID et classes panneau texte (remplace nth-child en CSS) */
  (function injectBlogItemIdsAndClasses() {
    var BLOCK_IDS = ["blog-title-photos", "blog-gallery-photos", "blog-title-collection", "blog-gallery-collection"];
    var TEXT_CLASSES = ["collab-header", "collab-legend", "collab-label-desc", "collab-content-desc", "collab-label-artisans", "collab-content-artisans", "collab-button"];

    function run() {
      if (!document.body || !document.body.classList.contains("collection-type-blog-basic-grid")) return;

      var col = document.querySelector(".blog-item-content .sqs-layout .row .col.sqs-col-12");
      if (col) {
        var blocks = Array.from(col.children);
        if (blocks.length >= 6) {
          BLOCK_IDS.forEach(function (id, i) {
            var block = blocks[i + 2];
            if (block && !block.id) block.id = id;
          });
        }
      }

      var htmlContent = document.querySelector(".blog-item-content .sqs-block-html .sqs-html-content");
      if (htmlContent) {
        var directChildren = Array.from(htmlContent.children).filter(function (el) {
          return el.tagName === "P" || el.tagName === "A" || el.tagName === "DIV";
        }).slice(0, 7);
        if (directChildren.length < 7) {
          directChildren = Array.from(htmlContent.querySelectorAll("p, a")).slice(0, 7);
        }
        directChildren.forEach(function (el, i) {
          if (TEXT_CLASSES[i]) el.classList.add(TEXT_CLASSES[i]);
        });
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    document.addEventListener("sqs-route-did-change", run);
  })();
