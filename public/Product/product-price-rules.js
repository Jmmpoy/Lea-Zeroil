/**
 * Produit : règles de prix (supprimer 'À partir de').
 */
  (function productPriceValueStripPrefix() {
    const PREFIX = /^\s*À partir de\s+/i;

    function run() {
      document.querySelectorAll(".product-price-value").forEach((el) => {
        const text = (el.textContent || "").trim();
        if (!text) return;
        const cleaned = text.replace(PREFIX, "").trim();
        if (cleaned !== text) el.textContent = cleaned;
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 600);
    document.addEventListener("sqs-route-did-change", run);
  })();

  /* Page produit : masquer le prix si 0 ou absent, bouton panier → contact */
  (function productPriceZeroNoPrice() {
    var CONTACT_PATH = "/contact";

    function parsePrice(text) {
      if (!text || typeof text !== "string") return NaN;
      var normalized = text.replace(/\s/g, " ").replace(",", ".").trim();
      var match = normalized.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : NaN;
    }

    function run() {
      var priceBlock = document.getElementById("main-product-price");
      if (!priceBlock) return;

      var priceValueEl = priceBlock.querySelector(".product-price-value");
      var rawText = priceValueEl ? (priceValueEl.textContent || "").trim() : "";
      var num = parsePrice(rawText);
      var noPrice = num === 0 || isNaN(num);

      if (noPrice) {
        priceBlock.style.setProperty("display", "none", "important");

        var btn = document.querySelector(".product-detail .sqs-add-to-cart-button");
        if (btn && !btn.hasAttribute("data-gm-contact-redirect")) {
          btn.setAttribute("data-gm-contact-redirect", "1");
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = CONTACT_PATH;
          }, true);
        }
      } else {
        priceBlock.style.removeProperty("display");
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 600);
    document.addEventListener("sqs-route-did-change", run);
  })();
