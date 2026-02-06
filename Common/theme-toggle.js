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

  const themeClasses = [
    "white", "white-bold", "light", "light-bold",
    "bright-inverse", "bright",
    "dark", "dark-bold", "black", "black-bold"
  ];

  function applySectionTheme(theme) {
    const sections = document.querySelectorAll("section[data-section-theme]");
    sections.forEach(section => {
      themeClasses.forEach(cls => section.classList.remove(cls));
      section.classList.add(theme);
      section.setAttribute("data-section-theme", theme);
    });
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
    const darkBtn = document.getElementById("dark-mode-toggle");
    const lightBtn = document.getElementById("light-mode-toggle");
    if (!darkBtn || !lightBtn) return;

    function setActive(isDark) {
      darkBtn.classList.toggle("is-active", isDark);
      lightBtn.classList.toggle("is-active", !isDark);
    }

    function enableDark() {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      setActive(true);
      applySectionTheme(darkTheme);
    }

    function disableDark() {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      setActive(false);
      applySectionTheme(lightTheme);
    }

    darkBtn.addEventListener("click", enableDark);
    lightBtn.addEventListener("click", disableDark);

    const savedTheme = localStorage.getItem("theme");
    savedTheme === "dark" ? enableDark() : disableDark();
  }

  function run() {
    initThemeToggle();
    markCurrentNavItem();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  document.addEventListener("sqs-route-did-change", run);
})();
