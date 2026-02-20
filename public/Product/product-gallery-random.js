/**
 * Produit : randomisation des 3 premières images de la 2e galerie (ProductItem-additional).
 * Affiche 3 images différentes parmi 9 à chaque rechargement ; le slide « All » reste inchangé.
 */
(function () {
  var RANDOM_GALLERY = [
    { title: "Bougeoir mural", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/25059981-7a6e-4196-aaa6-5b92b40cd63b/MIRAGES-56.jpg?format=1500w", redirectUrl: "/boutique/p/bougeoir-mural-grand" },
    { title: "APPLIQUE ORSAY", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/077f395b-ce8c-4576-9ddc-be79050da851/MIRAGES-45.jpg?format=1500w", redirectUrl: "/boutique/p/applique-orsay" },
    { title: "Stool Primo", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/1769021598576-A7VRGFB93WGRAV8BVCR1/LZ_primo_paille_tournesol_10.jpg?format=1500w", redirectUrl: "/boutique/p/primopailletournesol" },
    { title: "Applique Saba", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/7db411c8-ae2f-477c-bbb7-50630ffd69ef/LeaZeroilxGien_%C2%A9AdelSlimaneFecih24.jpg?format=2500w", redirectUrl: "/boutique/p/appliquesaba" },
    { title: "Table Erba", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/84ba56f5-449d-4143-83f3-85a631074783/LUNEROUSSE-21.JPG?format=2500w", redirectUrl: "/boutique/p/tablebasseerba" },
    { title: "Guéridon Supernova", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/d935fa7e-9a9b-434f-8602-f7bd080a6e66/LUNEROUSSE-13.JPG?format=2500w", redirectUrl: "/boutique/p/gueridonsupernovarose" },
    { title: "Nauzami Chair", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/33061c62-67b4-437e-9bcc-7f16a4685fd2/Capture+d%E2%80%99e%CC%81cran+2026-02-20+a%CC%80+11.14.34.png?format=2500w", redirectUrl: "/boutique/p/rfnrea4f4tcupaj04urq4yzf91zbnn" },
    { title: "Guéridon Serpent", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/d7423815-3aba-4f7c-8314-3a05ddc5f65e/MIRAGES-100.jpg?format=2500w", redirectUrl: "/boutique/p/gueridonserpent" },
    { title: "Stool Primo Paille Vigne", imageUrl: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/0ddf4978-3093-4298-a4b6-4e9e7b7159f1/LUNEROUSSE-1.JPG?format=1500w", redirectUrl: "/boutique/p/stoolprimopaillevigne" },
  ];

  function pickRandomIndices(count, max) {
    var indices = [];
    var pool = [];
    for (var i = 0; i < max; i++) pool.push(i);
    for (var j = 0; j < count && pool.length; j++) {
      var idx = Math.floor(Math.random() * pool.length);
      indices.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return indices;
  }

  function run() {
    var container = document.querySelector(".ProductItem-additional");
    if (!container) return;
    var block3 = container.querySelector(".sqs-layout .sqs-row .sqs-col-12 > *:nth-child(3)");
    if (!block3) return;
    var gallery = block3.querySelector(".sqs-block-content .sqs-gallery-container .sqs-gallery");
    if (!gallery) return;

    var allSlides = gallery.querySelectorAll(".slide");
    var contentSlides = [];
    for (var s = 0; s < allSlides.length; s++) {
      if (allSlides[s].classList.contains("collab-gallery-all-slide")) break;
      contentSlides.push(allSlides[s]);
    }
    if (contentSlides.length < 3) return;

    var indices = pickRandomIndices(3, RANDOM_GALLERY.length);
    for (var i = 0; i < 3; i++) {
      var item = RANDOM_GALLERY[indices[i]];
      var slide = contentSlides[i];
      var href = item.redirectUrl && !item.redirectUrl.startsWith("/") ? "/" + item.redirectUrl : item.redirectUrl;

      var img = slide.querySelector("img");
      if (img) img.src = item.imageUrl;

      var link = slide.querySelector(".margin-wrapper a[href]") || slide.querySelector("a[href]");
      if (link) link.href = href;

      var titleText = slide.querySelector(".image-slide-title__text");
      var titleBlock = slide.querySelector(".image-slide-title");
      if (titleText) {
        titleText.textContent = item.title;
      } else if (titleBlock) {
        titleBlock.textContent = item.title;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  setTimeout(run, 600);
  setTimeout(run, 1200);
  document.addEventListener("sqs-route-did-change", run);
})();
