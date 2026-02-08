/**
 * Home : appliquer les liens custom depuis l'excerpt et nettoyer le texte.
 */
(function () {
  var GALLERY_SECTION_ID = "6987c22136d357787cec839b";

  function applyExcerptLinks() {
    var section = document.querySelector('section[data-section-id="' + GALLERY_SECTION_ID + '"]');
    if (!section) return;

    section.querySelectorAll('.summary-item').forEach(function (item) {
      var excerpt =
        item.querySelector('.summary-excerpt') ||
        item.querySelector('.summary-excerpt-only') ||
        item.querySelector('.summary-text');
      if (!excerpt) return;

      var rawText = (excerpt.textContent || '').trim();
      if (!rawText) return;

      var m = rawText.match(/link\s*:\s*(\/[^\s\n]+)/i);
      if (!m) return;

      var customUrl = m[1].replace(/^\s+|\s+$/g, '');

      // Appliquer l’URL à tous les liens de l’item
      var links = item.querySelectorAll('a[href]');
      links.forEach(function (link) {
        link.setAttribute('href', customUrl);
      });

      // Si le conteneur miniature est un <a>
      var thumbContainer = item.querySelector('.summary-thumbnail-container');
      if (thumbContainer && thumbContainer.tagName === 'A') {
        thumbContainer.setAttribute('href', customUrl);
      }
      var thumbOuter = item.querySelector('.summary-thumbnail-outer-container');
      if (thumbOuter && thumbOuter.tagName === 'A') {
        thumbOuter.setAttribute('href', customUrl);
      }

      // Nettoyage visuel : retirer "link: ..."
      var ps = [].slice.call(excerpt.querySelectorAll('p'));
      if (ps.length) {
        ps.forEach(function (p) {
          var t = (p.textContent || '');
          if (/^\s*link\s*:\s*\/[^\s]+\s*$/i.test(t.trim())) {
            p.textContent = '';
          } else {
            p.textContent = t.replace(/(?:^|\n)\s*link\s*:\s*\/[^\s]+\s*(?:$|\n)?/ig, '').trim();
          }
        });
        var stillHasText = ps.some(function (p) { return (p.textContent || '').trim().length > 0; });
        if (!stillHasText) excerpt.style.display = 'none';
      } else {
        var cleaned = rawText.replace(/(?:^|\n)\s*link\s*:\s*\/[^\s]+\s*(?:$|\n)?/ig, '').trim();
        if (!cleaned) excerpt.style.display = 'none';
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyExcerptLinks);
  } else {
    applyExcerptLinks();
  }
  document.addEventListener("sqs-route-did-change", applyExcerptLinks);
})();