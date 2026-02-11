/**
 * Produit : remplacement du chevron des variantes par un SVG custom.
 */
  /* Remplacer le chevron variant-dropdown par le SVG custom (couleur via currentColor / thème) */
  (function replaceVariantSelectIconSvg() {
    var CHEVRON_SVG = '<svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="gm-variant-chevron"><path d="M0.203125 0.526218L5.27187 6.09538L10.3406 0.526218L10.0645 0.222839L5.27187 5.48862L0.479243 0.222839L0.203125 0.526218Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"/></svg>';

    function run() {
      document.querySelectorAll('.product-variants .variant-select-icon').forEach(function (icon) {
        if (icon.querySelector('.gm-variant-chevron')) return;
        icon.innerHTML = CHEVRON_SVG;
      });
    }
    function schedule() {
      run();
      setTimeout(run, 200);
      setTimeout(run, 500);
      setTimeout(run, 800);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
    else schedule();
    document.addEventListener('sqs-route-did-change', schedule);
  })();
