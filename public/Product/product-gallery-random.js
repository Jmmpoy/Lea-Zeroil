/**
 * Produit : section « Vous pourriez également aimer » (suggestionsGallery).
 * Créée de A à Z en JS : titre + 3 images aléatoires + bloc « All ».
 * Injectée comme enfant de .product-detail, après ProductItem-additional.
 */
(function () {
  var SECTION_TITLE = "Vous pourriez également aimer";
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
    var productDetail = document.querySelector(".product-detail");
    if (!productDetail) return;
    if (document.getElementById("suggestionsGallery")) return;

    var productItemAdditional = productDetail.querySelector(".ProductItem-additional");
    var section = document.createElement("section");
    section.id = "suggestionsGallery";
    section.className = "suggestionsGallery";

    var titleEl = document.createElement("h2");
    titleEl.className = "suggestionsGallery__title";
    titleEl.textContent = SECTION_TITLE;

    var grid = document.createElement("div");
    grid.className = "suggestionsGallery__grid";

    var indices = pickRandomIndices(3, RANDOM_GALLERY.length);
    for (var i = 0; i < 3; i++) {
      var item = RANDOM_GALLERY[indices[i]];
      var href = item.redirectUrl && !item.redirectUrl.startsWith("/") ? "/" + item.redirectUrl : item.redirectUrl;

      var link = document.createElement("a");
      link.href = href;
      link.className = "suggestionsGallery__item";
      link.setAttribute("aria-label", item.title);

      var imgWrap = document.createElement("div");
      imgWrap.className = "suggestionsGallery__item-image-wrap";
      var img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;
      imgWrap.appendChild(img);

      var titleSpan = document.createElement("span");
      titleSpan.className = "suggestionsGallery__item-title";
      titleSpan.textContent = item.title;

      link.appendChild(imgWrap);
      link.appendChild(titleSpan);
      grid.appendChild(link);
    }

    var allLink = document.createElement("a");
    allLink.href = "/collections";
    allLink.className = "suggestionsGallery__all";
    allLink.setAttribute("aria-label", "Voir tout");
    allLink.textContent = "All";
    grid.appendChild(allLink);

    section.appendChild(titleEl);
    section.appendChild(grid);

    if (productItemAdditional && productItemAdditional.nextSibling) {
      productDetail.insertBefore(section, productItemAdditional.nextSibling);
    } else {
      productDetail.appendChild(section);
    }
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
