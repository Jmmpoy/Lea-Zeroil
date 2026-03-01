<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/variables.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/base.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/components.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/header.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/footer.css">


<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Product/product.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Product/productItem.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Homepage/homepage.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Contact/contact.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/About/about.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Collection/collection.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Collaboration/collaboration.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/BlogPage/blogGlobal.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/BlogPage/blogItem.css">
<link rel="stylesheet" href="https://lea-zeroil.vercel.app/Galerie-Oasis/galerie-oasis.css">


<link rel="stylesheet" href="https://cdn.squarify.xyz/cart-slideout/styles.css">
<script defer src="https://cdn.squarify.xyz/cart-slideout/index.js"></script>

<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://assets.squarewebsites.org/lazy-summaries/lazy-summaries.min.js"></script>
<script>
!function(){window.self===window.top||window.top.document.getElementById("lazy-summaries-admin")||function(e,t,s,i,a){if(s.querySelector("#"+t))i&&i(this);else{var n=document.createElement("script");n.src=e+"?cache="+((new Date).getTime()+"").substr(0,8),n.id=t,n.onload=function(){a&&this.remove(),i&&i(this)},s.appendChild(n)}}("https://assets.squarewebsites.org/lazy-summaries/lazy-summaries-admin.js","lazy-summaries-admin",window.top.document.getElementsByTagName("head")[0])}();
</script>



<script src="https://lea-zeroil.vercel.app/Common/common.js"></script>
<script src="https://lea-zeroil.vercel.app/Common/menu.js"></script>
<script src="https://lea-zeroil.vercel.app/Common/theme-toggle.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-gallery-swiper.js"></script>

<script src="https://lea-zeroil.vercel.app/Homepage/homepageSlider.js"></script>


<script src="https://lea-zeroil.vercel.app/BlogPage/blog-theme.js"></script>
<script src="https://lea-zeroil.vercel.app/Oasis/expo-swap.js"></script>
<script src="https://lea-zeroil.vercel.app/Homepage/newsletter.js"></script>

<script src="https://lea-zeroil.vercel.app/BlogPage/blog-item-layout.js"></script>
<script src="https://lea-zeroil.vercel.app/BlogPage/blog-pagination-labels.js"></script>
<script src="https://lea-zeroil.vercel.app/Collaboration/collab-gallery-all-slide.js"></script>
<script src="https://lea-zeroil.vercel.app/Collaboration/collab-image-title-swatches.js"></script>

<script src="https://lea-zeroil.vercel.app/Collection/collections-summary-links.js"></script>
<script src="https://lea-zeroil.vercel.app/Collection/collections-filters.js"></script>
<script src="https://lea-zeroil.vercel.app/Collection/collections-excerpt-links.js"></script>
<script src="https://lea-zeroil.vercel.app/Collection/filterbar-smooth-scroll.js"></script>

<script src="https://lea-zeroil.vercel.app/Contact/form-half-columns.js"></script>
<script src="https://lea-zeroil.vercel.app/Contact/contact-custom-select.js"></script>
<script src="https://lea-zeroil.vercel.app/Contact/contact-phone-normalize.js"></script>



<script src="https://lea-zeroil.vercel.app/Product/product-extra-actions.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-price-rules.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-guide.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-data-render-a.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-data-render-b.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-image-title-swatches.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-gallery-all-slide.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-variant-defaults.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-variant-icon.js"></script>
<script src="https://lea-zeroil.vercel.app/Product/product-variant-dropdown.js"></script>



<script>
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".theme-toggle"); // <= adapte si besoin
  const logoImg = document.querySelector(".header-title-logo img, .header-title-logo .logo-image img");

  if (!btn || !logoImg) return;

  const BORDEAUX = "https://static1.squarespace.com/static/6939b3b7d90b6131b1aeebba/t/698f7663c75fac7748a47014/1771009635162/LOGOTYPE_LEA_ZEROIL_VFINAL_BORDEAUX.png";
  const CREAM = "https://static1.squarespace.com/static/6939b3b7d90b6131b1aeebba/t/698f76631382647efdf0d612/1771009635156/LOGOTYPE_LEA_ZEROIL_VFINAL_CREAM.png";

  const apply = () => {
    const isDark = document.body.classList.contains("dark-mode");
    logoImg.src = isDark ? CREAM : BORDEAUX;
  };

  // Au chargement
  apply();

  // Au clic
  btn.addEventListener("click", () => {
    setTimeout(apply, 0);
  });

});
</script>
<script>
"use strict";

(() => {
  const CART_ROOT_SELECTOR = "#sqs-cart-root";
  const CART_ROOT_CONFIG_SELECTOR = "#sqs-cart-root script[type='application/json']";
  const HEADER_TITLE_SELECTOR = ".squarify-slideout-cart__header__text";
  const CART_QTY_SELECTOR = ".cart-row-qty";
  const CART_VARIANT_SELECTOR = ".cart-row-variant";
  const LOG_PREFIX = "[cart-debug]";
  const DEFAULT_LOCALE = "fr";
  const SUPPORTED_LOCALES = new Set(["en", "fr"]);

  const VARIANT_KEY_MAP = {
    color: "color",
    colour: "color",
    couleur: "color",
    size: "size",
    taille: "size",
  };

  const UI_TRANSLATIONS = {
    en: {
      checkout_cta: "PROCEED TO CHECKOUT",
      color: "Color",
      gift_note: "This order is a gift",
      quantity: "Quantity",
      shipping_note: "Shipping fees will be calculated at the next step",
      size: "Size",
    },
    fr: {
      checkout_cta: "PROCÉDER AU PAIEMENT",
      color: "Coloris",
      gift_note: "Cette commande est un cadeau",
      quantity: "Quant.",
      shipping_note: "Les frais d'envoi seront calculés à l'étape suivante",
      size: "Taille",
    },
  };

  const TITLE_TRANSLATIONS = {
    en: "Shopping Cart",
    fr: "Panier",
  };
  const DEFAULT_COLOR_FALLBACK = "#b57b4f";

  const normalizeLocale = (locale) =>
    locale?.toLowerCase().split("-")[0] || "";

  const logDebug = (...messages) => {
    console.log(LOG_PREFIX, ...messages);
  };

  const getLocaleFromCartConfig = () => {
    const cartConfig = getCartConfig();
    if (!cartConfig) {
      return "";
    }

    return normalizeLocale(
      cartConfig.translationLocale || cartConfig.shopperLanguage || "",
    );
  };

  const getCartConfig = () => {
    const configScript = document.querySelector(CART_ROOT_CONFIG_SELECTOR);
    if (!configScript || !configScript.textContent) {
      return null;
    }

    try {
      return JSON.parse(configScript.textContent);
    } catch (_error) {
      return null;
    }
  };

  const formatEuroFromCents = (amountInCents) => {
    if (typeof amountInCents !== "number") {
      return "";
    }

    return new Intl.NumberFormat("fr-FR", {
      currency: "EUR",
      style: "currency",
    }).format(amountInCents / 100);
  };

  const getCartTotalText = () => {
    const cartConfig = getCartConfig();
    const cart = cartConfig?.cart;
    if (!cart) {
      return "";
    }

    const amountDueValue = cart.amountDue?.value;
    const subtotalValue = cart.subtotal?.value;

    return formatEuroFromCents(amountDueValue) || formatEuroFromCents(subtotalValue);
  };

  const resolveCurrentLocale = (() => {
    let activeLocale = "";

    return () => {
      const htmlLocale = normalizeLocale(document.documentElement.lang || "");
      if (htmlLocale && SUPPORTED_LOCALES.has(htmlLocale)) {
        activeLocale = htmlLocale;
        return activeLocale;
      }

      if (activeLocale) {
        return activeLocale;
      }

      const cartLocale = getLocaleFromCartConfig();
      if (cartLocale && SUPPORTED_LOCALES.has(cartLocale)) {
        activeLocale = cartLocale;
        return activeLocale;
      }

      activeLocale = DEFAULT_LOCALE;
      return activeLocale;
    };
  })();

  const getCurrentLocale = () => resolveCurrentLocale();

  const getTranslation = (key) => {
    const locale = getCurrentLocale();
    return (
      UI_TRANSLATIONS[locale]?.[key] ||
      UI_TRANSLATIONS[DEFAULT_LOCALE][key] ||
      key
    );
  };

  const getTranslatedTitle = () => {
    const locale = getCurrentLocale();
    return (
      TITLE_TRANSLATIONS[locale] ||
      TITLE_TRANSLATIONS[DEFAULT_LOCALE]
    );
  };

  const normalizeVariantKey = (rawKey) => {
    if (!rawKey) return "";
    const normalized = rawKey
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return VARIANT_KEY_MAP[normalized] || normalized;
  };

  const normalizeColorValue = (rawValue) => {
    if (!rawValue || typeof rawValue !== "string") {
      return "";
    }

    return rawValue
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const normalizeColorToken = (rawToken) =>
    normalizeColorValue(rawToken)
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");

  const getDiamondColorMap = (() => {
    let cachedColorMap = null;

    return () => {
      if (cachedColorMap) {
        return cachedColorMap;
      }

      const rootStyles = window.getComputedStyle(document.documentElement);
      const colorMap = {};

      for (let index = 0; index < rootStyles.length; index += 1) {
        const propertyName = rootStyles[index];
        if (!propertyName.startsWith("--diamond-color-")) {
          continue;
        }

        const rawValue = rootStyles.getPropertyValue(propertyName).trim();
        if (!rawValue) {
          continue;
        }

        const token = propertyName.replace("--diamond-color-", "");
        const normalizedToken = normalizeColorToken(token);
        if (normalizedToken) {
          colorMap[normalizedToken] = rawValue;
        }
      }

      cachedColorMap = colorMap;
      logDebug("Nuancier charge depuis :root", Object.keys(colorMap).length);
      return cachedColorMap;
    };
  })();

  const resolveColorValue = (rawValue) => {
    const normalizedColor = normalizeColorToken(rawValue);
    const diamondColorMap = getDiamondColorMap();

    if (diamondColorMap[normalizedColor]) {
      return diamondColorMap[normalizedColor];
    }

    const withoutPrefix = normalizedColor.replace(/^(couleur|color)-/, "");
    if (diamondColorMap[withoutPrefix]) {
      return diamondColorMap[withoutPrefix];
    }

    if (window.CSS?.supports?.("color", rawValue.trim())) {
      return rawValue.trim();
    }

    return diamondColorMap.transparent || DEFAULT_COLOR_FALLBACK;
  };

  const applyTranslatedCartTitle = () => {
    const titleElement = document.querySelector(HEADER_TITLE_SELECTOR);
    if (!titleElement) {
      logDebug("Titre panier introuvable", HEADER_TITLE_SELECTOR);
      return;
    }

    const translatedTitle = getTranslatedTitle();
    if (titleElement.textContent !== translatedTitle) {
      logDebug("Application titre panier", translatedTitle);
      titleElement.textContent = translatedTitle;
      titleElement.setAttribute("aria-label", translatedTitle);
    }
  };

  const decorateVariants = () => {
    const variantElements = document.querySelectorAll(CART_VARIANT_SELECTOR);
    logDebug("Variants trouvés", variantElements.length);

    variantElements.forEach((el) => {
      if (el.dataset.decorated === "1") return;

      const rawText = el.textContent?.trim();
      if (!rawText || !rawText.includes(":")) return;

      const [rawLabel, rawValue] = rawText.split(":");
      const normalizedKey = normalizeVariantKey(rawLabel);
      const translatedLabel = getTranslation(normalizedKey);

      // Construction DOM propre (sans innerHTML reset)
      const labelSpan = document.createElement("span");
      labelSpan.className = "cart-row-variant-label";
      labelSpan.textContent = translatedLabel;

      const valueSpan = document.createElement("span");
      valueSpan.className = "cart-row-variant-value";
      const trimmedValue = rawValue.trim();

      if (normalizedKey === "color" && trimmedValue) {
        const colorDot = document.createElement("span");
        colorDot.className = "cart-row-color-dot";
        colorDot.style.backgroundColor = resolveColorValue(trimmedValue);
        colorDot.setAttribute("aria-hidden", "true");
        valueSpan.appendChild(colorDot);
      }

      valueSpan.appendChild(document.createTextNode(trimmedValue));

      el.replaceChildren(labelSpan, valueSpan);
      el.dataset.decorated = "1";
      logDebug("Variant décoré", {
        label: translatedLabel,
        value: rawValue.trim(),
      });
    });
  };

  const moveQtyIntoVariants = () => {
    const qtyElements = document.querySelectorAll(CART_QTY_SELECTOR);
    logDebug("Qty trouvés", qtyElements.length);

    qtyElements.forEach((qtyElement) => {
      const cartRow = qtyElement.closest(".cart-row");
      if (!cartRow) return;

      const variantsContainer = cartRow.querySelector(".cart-row-variants");
      if (!variantsContainer) return;

      if (qtyElement.parentElement === variantsContainer) return;

      variantsContainer.appendChild(qtyElement);
      logDebug("Déplacement qty vers variants", qtyElement);
    });
  };

  const decorateCartBottom = () => {
    const cartContainer = document.querySelector("#sqs-cart-container");
    if (!cartContainer) {
      return;
    }

    const summaryWrapper =
      cartContainer.querySelector(".cart-summary")?.parentElement || null;

    if (summaryWrapper) {
      let notesContainer = summaryWrapper.querySelector(".cart-extra-notes");
      if (!notesContainer) {
        notesContainer = document.createElement("div");
        notesContainer.className = "cart-extra-notes";
        summaryWrapper.appendChild(notesContainer);
      }

      let giftNote = notesContainer.querySelector(".cart-extra-note--gift");
      if (!giftNote) {
        giftNote = document.createElement("p");
        giftNote.className = "cart-extra-note cart-extra-note--gift";
        notesContainer.appendChild(giftNote);
      }

      let shippingNote = notesContainer.querySelector(
        ".cart-extra-note--shipping",
      );
      if (!shippingNote) {
        shippingNote = document.createElement("p");
        shippingNote.className = "cart-extra-note cart-extra-note--shipping";
        notesContainer.appendChild(shippingNote);
      }

      const translatedGiftNote = getTranslation("gift_note");
      const translatedShippingNote = getTranslation("shipping_note");

      if (giftNote.textContent !== translatedGiftNote) {
        giftNote.textContent = translatedGiftNote;
      }

      if (shippingNote.textContent !== translatedShippingNote) {
        shippingNote.textContent = translatedShippingNote;
      }
    }

    const footer = document.querySelector(".squarify-slideout-cart__footer");
    if (!footer) {
      return;
    }

    const checkoutHref =
      cartContainer
        .querySelector(".cart-checkout-button")
        ?.getAttribute("href")
        ?.trim() || "/commerce/goto-checkout";
    const nativeCheckoutLabel =
      cartContainer.querySelector(".cart-checkout-button")?.textContent?.trim() ||
      getTranslation("checkout_cta");
    const checkoutLabel = nativeCheckoutLabel.toLocaleUpperCase(
      getCurrentLocale(),
    );
    const totalText =
      getCartTotalText() ||
      cartContainer.querySelector(".cart-subtotal-price")?.textContent?.trim() ||
      "";

    let footerCta = footer.querySelector(".cart-footer-cta");
    if (!footerCta) {
      footerCta = document.createElement("a");
      footerCta.className = "cart-footer-cta";
      footerCta.setAttribute("aria-label", nativeCheckoutLabel);

      const labelElement = document.createElement("span");
      labelElement.className = "cart-footer-cta-label";
      labelElement.textContent = checkoutLabel;

      const amountElement = document.createElement("span");
      amountElement.className = "cart-footer-cta-amount";

      footerCta.appendChild(labelElement);
      footerCta.appendChild(amountElement);
      footer.replaceChildren(footerCta);
    }

    if (footerCta.getAttribute("href") !== checkoutHref) {
      footerCta.setAttribute("href", checkoutHref);
    }

    if (footerCta.getAttribute("aria-label") !== nativeCheckoutLabel) {
      footerCta.setAttribute("aria-label", nativeCheckoutLabel);
    }

    const footerLabel = footerCta.querySelector(".cart-footer-cta-label");
    if (footerLabel && footerLabel.textContent !== checkoutLabel) {
      footerLabel.textContent = checkoutLabel;
    }

    const footerAmount = footerCta.querySelector(".cart-footer-cta-amount");
    if (footerAmount && footerAmount.textContent !== totalText) {
      footerAmount.textContent = totalText;
    }
  };

  const runCartDecorations = () => {
    applyTranslatedCartTitle();
    decorateVariants();
    moveQtyIntoVariants();
    decorateQuantities();
    decorateCartBottom();
  };

  const decorateQuantities = () => {
    const qtyElements = document.querySelectorAll(CART_QTY_SELECTOR);
    logDebug("Décoration qty", qtyElements.length);

    qtyElements.forEach((el) => {
      let label = el.querySelector(".cart-row-qty-label");

      if (!label) {
        label = document.createElement("span");
        label.className = "cart-row-qty-label";
        el.prepend(label);
      }

      const translated = getTranslation("quantity");
      if (label.textContent !== translated) {
        label.textContent = translated;
        logDebug("Label qty appliqué", translated);
      }
    });
  };

  const TOTAL_UPDATE_DELAY_MS = 200;

  const attachCartObserver = (cartRoot) => {
    logDebug("Observer attaché sur root panier", cartRoot);

    let scheduled = false;
    let totalUpdateTimeoutId = null;

    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      logDebug("Mutation détectée, cycle planifié");

      if (totalUpdateTimeoutId) {
        clearTimeout(totalUpdateTimeoutId);
        totalUpdateTimeoutId = null;
      }

      requestAnimationFrame(() => {
        logDebug("Cycle observer démarré");
        runCartDecorations();
        scheduled = false;
        logDebug("Cycle observer terminé");

        totalUpdateTimeoutId = setTimeout(() => {
          totalUpdateTimeoutId = null;
          logDebug("Mise à jour différée du total (après suppression/ajout)");
          runCartDecorations();
        }, TOTAL_UPDATE_DELAY_MS);
      });
    });

    observer.observe(cartRoot, {
      childList: true,
      subtree: true,
    });
  };

  // 🔥 Observer limité au panier + bootstrap si le root arrive plus tard
  const initObserver = () => {
    const cartRoot = document.querySelector(CART_ROOT_SELECTOR);
    if (cartRoot) {
      attachCartObserver(cartRoot);
      return;
    }

    logDebug("Root panier introuvable, bootstrap body", CART_ROOT_SELECTOR);
    if (!document.body) {
      logDebug("Body indisponible, impossible d'attacher le bootstrap");
      return;
    }

    const bootstrapObserver = new MutationObserver(() => {
      const detectedRoot = document.querySelector(CART_ROOT_SELECTOR);
      if (!detectedRoot) return;

      logDebug("Root panier détecté par bootstrap", detectedRoot);
      bootstrapObserver.disconnect();
      attachCartObserver(detectedRoot);
      runCartDecorations();
    });

    bootstrapObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // Initialisation sécurisée
  const init = () => {
    logDebug("Init script panier");
    runCartDecorations();
    initObserver();
    logDebug("Init terminé");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
</script>
<script>
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

</script>