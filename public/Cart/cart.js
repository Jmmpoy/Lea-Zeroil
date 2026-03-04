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
      back_to_site: "Back to site",
      checkout_cta: "PROCEED TO CHECKOUT",
      color: "Color",
      gift_note: "This order is a gift",
      quantity: "Quantity",
      shipping_note: "Shipping fees will be calculated at the next step",
      size: "Size",
    },
    fr: {
      back_to_site: "Retourner sur le site",
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

    const isEmpty = cartContainer.querySelector(".empty-message") !== null;

    const checkoutHref = isEmpty
      ? "#"
      : (cartContainer
          .querySelector(".cart-checkout-button")
          ?.getAttribute("href")
          ?.trim() || "/commerce/goto-checkout");
    const nativeCheckoutLabel = isEmpty
      ? getTranslation("back_to_site")
      : (cartContainer.querySelector(".cart-checkout-button")?.textContent?.trim() ||
        getTranslation("checkout_cta"));
    const checkoutLabel = isEmpty
      ? nativeCheckoutLabel.toUpperCase()
      : nativeCheckoutLabel.toLocaleUpperCase(getCurrentLocale());
    const totalText = isEmpty
      ? ""
      : (getCartTotalText() ||
        cartContainer.querySelector(".cart-subtotal-price")?.textContent?.trim() ||
        "");

    let footerCta = footer.querySelector(".cart-footer-cta");
    if (!footerCta) {
      footerCta = document.createElement("a");
      footerCta.className = "cart-footer-cta";

      const labelElement = document.createElement("span");
      labelElement.className = "cart-footer-cta-label";

      const amountElement = document.createElement("span");
      amountElement.className = "cart-footer-cta-amount";

      footerCta.appendChild(labelElement);
      footerCta.appendChild(amountElement);
      footer.replaceChildren(footerCta);
    }

    footerCta.setAttribute("aria-label", nativeCheckoutLabel);
    if (footerCta.getAttribute("href") !== checkoutHref) {
      footerCta.setAttribute("href", checkoutHref);
    }

    const footerLabel = footerCta.querySelector(".cart-footer-cta-label");
    if (footerLabel && footerLabel.textContent !== checkoutLabel) {
      footerLabel.textContent = checkoutLabel;
    }

    const footerAmount = footerCta.querySelector(".cart-footer-cta-amount");
    if (footerAmount && footerAmount.textContent !== totalText) {
      footerAmount.textContent = totalText;
    }

    if (isEmpty) {
      const closeSlideout = (e) => {
        e.preventDefault();
        const wrapper = document.querySelector(".squarify-slideout-cart-wrapper");
        if (wrapper) {
          wrapper.classList.remove("squarify-slideout-cart-wrapper--open");
        }
        const cart = footer.closest(".squarify-slideout-cart");
        if (cart) {
          cart.classList.remove("squarify-slideout-cart--open");
        }
      };
      footer.onclick = closeSlideout;
    } else {
      footer.onclick = null;
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

  const SLIDEOUT_OPEN_CLASS = "squarify-slideout-cart--open";

  const attachSlideoutOpenObserver = (slideout) => {
    let scheduled = false;

    const observer = new MutationObserver(() => {
      if (!slideout.classList.contains(SLIDEOUT_OPEN_CLASS)) return;
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        runCartDecorations();
        scheduled = false;
      });
    });

    observer.observe(slideout, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  const attachCartObserver = (cartRoot) => {
    logDebug("Observer attaché sur root panier", cartRoot);

    const slideout = cartRoot.closest(".squarify-slideout-cart");
    if (slideout) {
      attachSlideoutOpenObserver(slideout);
    }

    let scheduled = false;

    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      logDebug("Mutation détectée, cycle planifié");

      requestAnimationFrame(() => {
        logDebug("Cycle observer démarré");
        runCartDecorations();
        scheduled = false;
        logDebug("Cycle observer terminé");
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