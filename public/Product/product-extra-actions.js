/**
 * Produit : actions supplémentaires (fiche technique, guide d'entretien).
 */
  (function () {
    document.querySelectorAll(".product-add-to-cart").forEach(el => {
      if (el.querySelector(".product-extra-actions")) return;

      const wrap = document.createElement("div");
      wrap.className = "product-extra-actions";
      wrap.innerHTML = `
      <a class="product-extra-btn product-extra-btn--download"
   >
  Fiche technique
</a>
      <button class="product-extra-btn" href="/lien-guide-entretien" type="button" data-action="open-guide">Voir le guide d’entretien</button>
    `;
      el.appendChild(wrap);
    });
  })();

  /* Page produit : récupérer l'href du bouton Squarespace (.sqs-col-12 [data-sqsp-block="button"] a) et l'appliquer au lien .product-extra-btn--download (Fiche technique), puis masquer la source */
  (function productPageCol12ButtonToDownloadHref() {
    function run() {
      var sourceLink = document.querySelector('.sqs-col-12 [data-sqsp-block="button"] a');
      var targetLink = document.querySelector(".product-extra-btn--download");
      if (!sourceLink || !targetLink) return;
      var href = sourceLink.getAttribute("href");
      if (href) {
        targetLink.setAttribute("href", href);
        sourceLink.style.display = "none";
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 400);
    document.addEventListener("sqs-route-did-change", run);
  })();
