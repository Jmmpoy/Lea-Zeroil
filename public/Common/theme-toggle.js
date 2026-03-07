/**
 * Theme Toggle - Bascule thème clair/sombre
 * 
 * Gère le système de bascule entre le thème clair et sombre du site.
 * Permet aux utilisateurs de choisir leur préférence qui est sauvegardée
 * dans le localStorage pour être conservée entre les sessions.
 * 
 * Fonctionnalités :
 * - Bascule entre thème clair ("bright") et sombre ("dark")
 * - Sauvegarde de la préférence dans localStorage
 * - Application automatique du thème sauvegardé au chargement
 * - Mise à jour des sections avec attribut [data-section-theme]
 * - Marquage automatique de l'élément de navigation de la page courante
 * - Compatible avec la navigation AJAX de Squarespace
 * - Swap du logo header (bordeaux / crème) selon le thème
 * - Thème forcé par URL : certaines pages appliquent un thème par défaut sans écraser le localStorage
 * 
 * Classes CSS gérées :
 * - white, white-bold, light, light-bold
 * - bright-inverse, bright
 * - dark, dark-bold, black, black-bold
 * 
 * Structure HTML requise :
 * - Bouton thème sombre : #dark-mode-toggle
 * - Bouton thème clair : #light-mode-toggle
 * - Sections avec thème : section[data-section-theme]
 * - Liens de navigation : .header-nav-item a[href] ou button[data-href]
 * 
 * Usage : Charger sur toutes les pages nécessitant le toggle de thème
 */
(function () {
  const lightTheme = "bright";
  const darkTheme = "dark";

  const headerLogoUrls = {
    bordeaux: "https://static1.squarespace.com/static/6939b3b7d90b6131b1aeebba/t/698f7663c75fac7748a47014/1771009635162/LOGOTYPE_LEA_ZEROIL_VFINAL_BORDEAUX.png",
    cream: "https://static1.squarespace.com/static/6939b3b7d90b6131b1aeebba/t/698f76631382647efdf0d612/1771009635156/LOGOTYPE_LEA_ZEROIL_VFINAL_CREAM.png"
  };

  /** Page collaboration : swap d’images (light ↔ dark) selon le thème */
  const collaborationImageSwaps = [
    {
      lightSrc: "https://images.squarespace-cdn.com/content/v1/6939b3b7d90b6131b1aeebba/95ab0526-5e6e-426b-b068-808ee20f072c/Line.png",
      darkSrc: "https://static1.squarespace.com/static/6939b3b7d90b6131b1aeebba/t/69a82090f7aa1c60ba6e923c/1772626064470/frise-blanche.png"
    }
  ];

  const themeClasses = [
    "white", "white-bold", "light", "light-bold",
    "bright-inverse", "bright",
    "dark", "dark-bold", "black", "black-bold"
  ];

  /**
   * Thème forcé par URL (pattern = préfixe ou égalité du path).
   * Si une entrée matche, ce thème est appliqué sans persister dans localStorage.
   */
  const forceThemeByPath = [
    { pattern: "galerie-oasis-collections", theme: "dark" },
    { pattern: "galerie-oasis", theme: "dark" },
    { pattern: "collaborations", theme: "dark" },
    // { pattern: "", theme: "dark" } //homepage
  ];

  function getForcedTheme(path) {
    if (path === undefined || path === null) return null;
    for (var i = 0; i < forceThemeByPath.length; i++) {
      var entry = forceThemeByPath[i];
      if (path === entry.pattern) return entry.theme;
      if (entry.pattern.length > 0 && path.indexOf(entry.pattern) === 0) return entry.theme;
    }
    return null;
  }

  function applySectionTheme(theme) {
    const sections = document.querySelectorAll("section[data-section-theme]");
    sections.forEach(section => {
      themeClasses.forEach(cls => section.classList.remove(cls));
      section.classList.add(theme);
      section.setAttribute("data-section-theme", theme);
    });
  }

  /** Applique le thème (body, localStorage, sections, logo) sans dépendre des boutons. */
  function applyTheme(isDark, persist) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      if (persist !== false) localStorage.setItem("theme", "dark");
      applySectionTheme(darkTheme);
    } else {
      document.body.classList.remove("dark-mode");
      if (persist !== false) localStorage.setItem("theme", "light");
      applySectionTheme(lightTheme);
    }
    updateHeaderLogo();
    updateCollaborationImages(isDark);
  }

  /** Génère un srcset au format Squarespace (?format=Nw Nw) */
  function buildSrcset(baseUrl) {
    var widths = [100, 300, 500, 750, 1000, 1500, 2500];
    return widths.map(function (w) { return baseUrl + "?format=" + w + "w " + w + "w"; }).join(", ");
  }

  function updateCollaborationImages(isDark) {
    var isCollaborationPage =
      document.body.classList.contains("collection-type-blog-basic-grid") &&
      !document.body.classList.contains("oasis-blog-theme-lune");
    if (!isCollaborationPage) return;

    var lineBlockSelector = [
      ".fe-block-24fd8965aefa836b01c5",
      ".fe-block-68fd3b5d4242179c0097",
      ".fe-block-e7feb16e039e5862ebea",
      ".fe-block-275aada142cb0fa91333",
      ".fe-block-b5a2b7071c2909022ee7"
    ].map(function (c) { return c + " .fluid-image-container img"; }).join(", ");
    var imgs = document.querySelectorAll(lineBlockSelector);
    imgs.forEach(function (img) {
      var src = img.src || img.getAttribute("src") || img.getAttribute("data-src") || "";
      collaborationImageSwaps.forEach(function (swap) {
        var matchLight = src.indexOf(swap.lightSrc) !== -1;
        var matchDark = src.indexOf(swap.darkSrc) !== -1;
        if (matchLight && isDark) {
          img.dataset.lightSrc = img.dataset.lightSrc || src;
          img.src = swap.darkSrc;
          img.setAttribute("data-image", swap.darkSrc);
          if (img.hasAttribute("data-src")) img.setAttribute("data-src", swap.darkSrc);
          img.setAttribute("srcset", buildSrcset(swap.darkSrc));
          return;
        }
        if (matchDark && !isDark) {
          var light = img.dataset.lightSrc || swap.lightSrc;
          img.src = light;
          img.setAttribute("data-image", light);
          if (img.hasAttribute("data-src")) img.setAttribute("data-src", light);
          img.setAttribute("srcset", buildSrcset(light));
        }
      });
    });
  }

  function updateHeaderLogo() {
    const imgs = document.querySelectorAll(".header-announcement-bar-wrapper .header-title img, .header-announcement-bar-wrapper .header-title-logo img");
    if (!imgs.length) return;
    const isCollaborationPage =
      document.body.classList.contains("collection-type-blog-basic-grid") &&
      !document.body.classList.contains("oasis-blog-theme-lune");
    const isGalerieOasisPage = document.body.classList.contains("galerie-oasis-page");
    const useCreamLogo = document.body.classList.contains("dark-mode") || isCollaborationPage || isGalerieOasisPage;
    const src = useCreamLogo ? headerLogoUrls.cream : headerLogoUrls.bordeaux;
    imgs.forEach(function (img) { img.src = src; });
  }

  function markCurrentNavItem() {
    const currentPath = window.location.pathname.replace(/\/$/, '');

    document.querySelectorAll(".header-nav-item a[href]").forEach(link => {
      const linkPath = link.getAttribute("href").replace(/\/$/, '');
      if (linkPath === currentPath) link.classList.add("is-current-page");
      else link.classList.remove("is-current-page");
    });

    document.querySelectorAll(".header-nav-item button[data-href]").forEach(button => {
      const buttonPath = button.getAttribute("data-href").replace(/\/$/, '');
      if (buttonPath === currentPath) button.classList.add("is-current-page");
      else button.classList.remove("is-current-page");
    });
  }

  function initThemeToggle() {
    var path = (window.location.pathname || "").replace(/^\/|\/$/g, "");
    var forcedTheme = getForcedTheme(path);
    if (path === "") {
      var savedTheme = localStorage.getItem("theme");
      applyTheme(savedTheme === "dark", false);
      localStorage.removeItem("theme");
    } else if (forcedTheme === "dark") {
      applyTheme(true, true);
    } else if (forcedTheme === "light") {
      applyTheme(false, false);
      localStorage.removeItem("theme");
    } else {
      var savedTheme = localStorage.getItem("theme");
      applyTheme(savedTheme === "dark", true);
    }

    const darkBtn = document.getElementById("dark-mode-toggle");
    const lightBtn = document.getElementById("light-mode-toggle");
    if (!darkBtn || !lightBtn) return;

    function setActive(isDark) {
      darkBtn.classList.toggle("is-active", isDark);
      lightBtn.classList.toggle("is-active", !isDark);
    }

    function enableDark(persist) {
      applyTheme(true, persist);
      setActive(true);
    }

    function disableDark(persist) {
      applyTheme(false, persist);
      setActive(false);
    }

    setActive(document.body.classList.contains("dark-mode"));

    darkBtn.addEventListener("click", function () { enableDark(true); });
    lightBtn.addEventListener("click", function () { disableDark(true); });
  }

  function run() {
    initThemeToggle();
    updateHeaderLogo();
    updateCollaborationImages(document.body.classList.contains("dark-mode"));
    markCurrentNavItem();
    /* Second passage après injection des classes (ex. galerie-oasis-page par common.js) */
    setTimeout(updateHeaderLogo, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  document.addEventListener("sqs-route-did-change", run);
})();
