/**
 * Collaboration : ajout du slide 'All' dans la galerie.
 */
  (function injectCollabGalleryAllSlide() {
    function run() {
      const isCollabPage = document.body.classList.contains("collection-type-blog-basic-grid");
      if (!isCollabPage) return;

      const galleries = document.querySelectorAll(".blog-item-content .sqs-block-gallery .sqs-gallery-design-grid");
      const lastGallery = galleries[galleries.length - 1];
      if (!lastGallery || lastGallery.querySelector(".gallery-all-slide__link")) return;

      const slide = document.createElement("div");
      slide.className = "slide sqs-gallery-design-grid-slide preFade fadeIn collab-gallery-all-slide";
      slide.setAttribute("data-type", "custom");

      const marginWrapper = document.createElement("div");
      marginWrapper.className = "margin-wrapper";

      const link = document.createElement("a");
      link.href = "/collections";
      link.className = "gallery-all-slide__link content-fill";
      link.setAttribute("aria-label", "Voir tout");
      link.textContent = "All";

      marginWrapper.appendChild(link);
      slide.appendChild(marginWrapper);
      lastGallery.appendChild(slide);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 800);
    document.addEventListener("sqs-route-did-change", run);
  })();
