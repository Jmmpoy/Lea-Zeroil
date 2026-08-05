/**
 * Navigue automatiquement vers la slide de la galerie produit
 * correspondant à la couleur sélectionnée.
 * Repose sur l'attribut alt des images ET, en repli, sur le nom de fichier
 * (ex. data-image=".../PRIMO-PACK-MONTAGE-LUNE.png") : en pratique l'alt est
 * souvent vide côté Squarespace alors que le nom de fichier contient la couleur.
 * Compare par segment exact ; pour une couleur à plusieurs mots ("Terre brulée"),
 * un seul mot qui matche un segment suffit (le nom de fichier abrège parfois).
 */
(function initVariantSlideSync() {
  var INIT_FLAG = "data-variant-slide-sync-init";

  function normalize(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getImageSegments(img) {
    var alt = img.alt || "";
    var src = img.getAttribute("data-image") || img.getAttribute("data-src") || "";
    var filename = src.split("/").pop().split("?")[0].replace(/\.[a-z0-9]+$/i, "");
    return normalize(alt + " " + filename).split(/[\s\-_+.]+/).filter(Boolean);
  }

  function altMatchesColor(img, color) {
    var segments = getImageSegments(img);
    var words = normalize(color).split(/\s+/).filter(Boolean);
    for (var w = 0; w < words.length; w++) {
      if (segments.indexOf(words[w]) !== -1) return true;
    }
    return false;
  }

  function goToColorSlide(colorName) {
    if (!colorName) return;

    var slides = document.querySelectorAll(".product-gallery-slides-item");
    var thumbnails = document.querySelectorAll(".product-gallery-thumbnails-item");
    if (!slides.length || !thumbnails.length) return;

    for (var i = 0; i < slides.length; i++) {
      var img = slides[i].querySelector(".product-gallery-slides-item-image");
      if (!img) continue;
      if (altMatchesColor(img, colorName)) {
        if (thumbnails[i]) thumbnails[i].click();
        return;
      }
    }
  }

  function setup() {
    var fieldset = document.querySelector('fieldset[data-variant-option-name="Couleur"]');
    if (!fieldset || fieldset.getAttribute(INIT_FLAG) === "1") return;

    var sel = fieldset.querySelector(".variant-select");
    if (!sel) return;

    var slides = document.querySelectorAll(".product-gallery-slides-item");
    var thumbnails = document.querySelectorAll(".product-gallery-thumbnails-item");
    if (!slides.length || !thumbnails.length) return;

    sel.addEventListener("change", function () {
      goToColorSlide(sel.value);
    });

    fieldset.setAttribute(INIT_FLAG, "1");

    if (sel.value) goToColorSlide(sel.value);
  }

  function schedule() {
    setup();
    setTimeout(setup, 300);
    setTimeout(setup, 600);
    setTimeout(setup, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }

  window.addEventListener("load", schedule);
  document.addEventListener("sqs-route-did-change", function () {
    setTimeout(schedule, 100);
  });
})();
