/**
 * Blog Theme - Thème Lune
 * 
 * Applique automatiquement la classe CSS "oasis-blog-theme-lune" sur le body
 * lorsque l'utilisateur visite les pages de la galerie Oasis ou des événements.
 * 
 * Pages concernées :
 * - /galerie-oasis-collections/*
 * - /evenements-post/*
 * 
 * Fonctionnalités :
 * - Détection automatique de l'URL
 * - Application/retrait dynamique de la classe selon la page
 * - Compatible avec la navigation AJAX de Squarespace (sqs-route-did-change)
 * 
 * Usage : Charger ce script sur toutes les pages du site
 */
(function setBlogThemeLuneClass() {
  function run() {
    var path = (window.location.pathname || "").replace(/^\/|\/$/g, "");
    var isGalerie = path.indexOf("galerie-oasis-collections") !== -1;
    var isEvenements = path.indexOf("evenements-post") !== -1;
    if (document.body && (isGalerie || isEvenements)) {
      document.body.classList.add("oasis-blog-theme-lune");
    } else if (document.body) {
      document.body.classList.remove("oasis-blog-theme-lune");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  document.addEventListener("sqs-route-did-change", run);
})();
