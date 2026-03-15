/**
 * Navigue automatiquement vers la slide de la galerie produit
 * correspondant à la couleur sélectionnée.
 * Repose sur l'attribut alt des images (ex. alt="thèbes-blanc").
 * Compare par segment exact : "blanc" match "thèbes-blanc" mais pas "thèbes-sable".
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

  function altMatchesColor(alt, color) {
    var segments = normalize(alt).split(/[\s\-_]+/);
    var target = normalize(color);
    for (var i = 0; i < segments.length; i++) {
      if (segments[i] === target) return true;
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
      if (!img || !img.alt) continue;
      if (altMatchesColor(img.alt, colorName)) {
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
