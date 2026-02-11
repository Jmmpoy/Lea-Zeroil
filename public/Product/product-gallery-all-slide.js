/**
 * Produit : ajout du slide 'All' dans la galerie secondaire.
 */
  /* Page produit – 4e slide « All » bordeaux sur la 2e galerie (même logique que page collaboration) */
  (function injectProductPageGalleryAllSlide() {
    function run() {
      var container = document.querySelector(".ProductItem-additional");
      if (!container) return;
      var block3 = container.querySelector(".sqs-layout .sqs-row .sqs-col-12 > *:nth-child(3)");
      if (!block3) return;
      var gallery = block3.querySelector(".sqs-block-content .sqs-gallery-container .sqs-gallery");
      if (!gallery || gallery.querySelector(".gallery-all-slide__link")) return;

      var slide = document.createElement("div");
      slide.className = "slide sqs-gallery-design-grid-slide preFade fadeIn collab-gallery-all-slide";
      slide.setAttribute("data-type", "custom");

      var marginWrapper = document.createElement("div");
      marginWrapper.className = "margin-wrapper";

      var link = document.createElement("a");
      link.href = "/collections";
      link.className = "gallery-all-slide__link content-fill";
      link.setAttribute("aria-label", "Voir tout");
      link.textContent = "All";

      marginWrapper.appendChild(link);
      slide.appendChild(marginWrapper);
      gallery.appendChild(slide);
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
