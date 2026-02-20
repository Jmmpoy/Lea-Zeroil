/**
 * Menu Overlay
 * 
 * Gère l'affichage et l'interaction du menu de navigation principal avec sous-menu.
 * Remplace le comportement par défaut de Squarespace pour offrir une expérience
 * personnalisée sur desktop (hover) et mobile (fullscreen avec bouton de fermeture).
 * 
 * Fonctionnalités :
 * - Desktop : Affichage au survol (hover) avec fermeture automatique après 120ms
 * - Mobile : Affichage en plein écran avec bouton de fermeture (×)
 * - Gestion des interactions : clic, clavier (Escape), clic extérieur
 * - Synchronisation avec le menu burger Squarespace sur mobile
 * - Retry automatique si le header n'est pas encore chargé (Squarespace AJAX)
 * 
 * Structure du menu :
 * - Collections (Luminaires, Tables, Assises, etc.)
 * - Collaborations (Silva Paris, La faïencerie de Gien, etc.)
 * - Galerie Oasis (Siroco, Mirages)
 * - Évènements (Salon des ensembliers, Pad Paris 2024, etc.)
 * - Catalogue (Français, Anglais)
 * 
 * Usage : Charger ce script sur toutes les pages nécessitant la navigation
 */
(function bootOasisSubmenu(retries = 30) {
  const mqMobile = window.matchMedia("(max-width: 767px)");

  function findMenuTrigger() {
    // 1) Header nav (desktop)
    const candidates = Array.from(document.querySelectorAll(
      '.header-nav-item a, .header-nav-item button, .header-menu-nav-item a, .header-menu-nav-item button'
    ));

    // cherche un item dont le texte est "Menu"
    const el = candidates.find(x => (x.textContent || "").trim().toLowerCase() === "menu");
    return el || null;
  }

  function findBurgerTrigger() {
    const candidates = Array.from(document.querySelectorAll(
      ".header-burger-btn, [class*=\"header-burger\"], [class*=\"burger\"]"
    ));

    return candidates[0] || null;
  }

  function buildOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "oasis-submenu";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "false");
    overlay.setAttribute("aria-label", "Sous-menu");

    overlay.innerHTML = `
      <button class="oasis-submenu__close" type="button" aria-label="Fermer">×</button>
		
      <div class="oasis-submenu__inner">
        <div class="oasis-submenu__grid">

          <!-- COL 1 - Collections (page /collections) -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Collections</h3>
            <ul class="oasis-submenu__list">
              <li><a href="/collections#all">All</a></li>
              <li><a href="/collections#luminaires">Luminaires</a></li>
              <li><a href="/collections#tables">Tables</a></li>
              <li><a href="/collections#assises">Assises</a></li>
              <li><a href="/collections#textile-tapis">Textile & Tapis</a></li>
              <li><a href="/collections#decoration">Décoration</a></li>
            </ul>
          </div>

          <!-- COL 2 - Collaborations (page /collaborations) -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Collaborations</h3>
            <ul class="oasis-submenu__list">
              <li><a href="/collaborations#all">All</a></li>
              <li><a href="/collaborations-post/silva">Silva</a></li>
              <li><a href="/collaborations-post/silvaparis">Silva Paris</a></li>
              <li><a href="/collaborations-post/la-faiencerie-de-gien-x-la-zeroil">La faïencerie de Gien</a></li>
              <li><a href="/collaborations-post/modernmetierxleazeroil">Modern Metier</a></li>
              <li><a href="/collaborations-post/toutlemondebochard">Toulemonde Bochart</a></li>
              <li><a href="/collaborations-post/nobilis">Nobilis</a></li>
            </ul>
          </div>

          <!-- COL 3 - Galerie Oasis -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Galerie Oasis</h3>
            <ul class="oasis-submenu__list">
            <li><a href="/galerie-oasis">La Galerie Oasis</a></li>
              <li><a href="/galerie-oasis-collections/sirocco">Sirocco</a></li>
              <li><a href="/galerie-oasis-collections/mirages">Mirages</a></li>
            </ul>
          </div>

          <!-- COL 4 - Évènements -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Évènements</h3>
            <ul class="oasis-submenu__list">
              <li><a href="/evenements-post/salon-des-ensembliers">Salon des ensembliers</a></li>
              <li><a href="/evenements-post/lune-rousse">Lune Rousse</a></li>
            </ul>
          </div>

          <!-- COL 5 -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Catalogue</h3>
            <ul class="oasis-submenu__list">
              <li>
                <a href="https://goby-sawfish-66kt.squarespace.com/s/LZ_catalogue_FR_compressed.pdf">
                  <span class="oasis-submenu__diamond" aria-hidden="true"></span>Catalogue français
                </a>
              </li>
              <li>
                <a href="https://goby-sawfish-66kt.squarespace.com/s/LZ_catalogue_EN_11zon.pdf">
                  <span class="oasis-submenu__diamond" aria-hidden="true"></span>Catalogue anglais
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function init() {

    const menuTrigger = findMenuTrigger();
    const burgerTrigger = findBurgerTrigger();
    const trigger = menuTrigger || burgerTrigger;
    const isMenuTrigger = !!menuTrigger;

    if (!trigger) return false;

    const folderItem = menuTrigger?.closest('.header-nav-item, .header-menu-nav-item');
    folderItem?.classList.add('oasis-menu-folder');

    // évite double init (nav ajax) + ferme si déjà ouvert
    const existing = document.querySelector(".oasis-submenu");
    if (existing) {
      existing.classList.remove("is-open");
      existing.setAttribute("aria-modal", "false");
      document.body.classList.remove("oasis-submenu-lock");
      return true;
    }

    const overlay = buildOverlay();
    const closeBtn = overlay.querySelector(".oasis-submenu__close");

    let open = false;
    let closeTimer = null;
    let headerMenuObserver = null;

    function hideHeaderMenu() {
      const headerMenu = document.querySelector(".header-menu");
      if (!headerMenu) return;
      headerMenu.classList.add("oasis-header-menu-hidden");
      headerMenu.style.display = "none";
      headerMenu.style.visibility = "hidden";
    }

    function showHeaderMenu() {
      const headerMenu = document.querySelector(".header-menu");
      if (!headerMenu) return;
      headerMenu.classList.remove("oasis-header-menu-hidden");
      headerMenu.style.removeProperty("display");
      headerMenu.style.removeProperty("visibility");
    }

    function openMenu() {
      if (open) return;
      open = true;
      overlay.classList.add("is-open");
      document.body.classList.add("oasis-submenu-open");
      hideHeaderMenu();

      if (!headerMenuObserver) {
        headerMenuObserver = new MutationObserver(() => {
          if (!open) return;
          hideHeaderMenu();
        });
        headerMenuObserver.observe(document.body, { childList: true, subtree: true });
      }

      if (mqMobile.matches) {
        document.body.classList.add("oasis-submenu-lock");
        overlay.setAttribute("aria-modal", "true");
      } else {
        document.body.classList.remove("oasis-submenu-lock");
        overlay.setAttribute("aria-modal", "false");
      }
    }

    function closeMenu() {
      if (!open) return;
      open = false;
      overlay.classList.remove("is-open");
      document.body.classList.remove("oasis-submenu-open");
      document.body.classList.remove("oasis-submenu-lock");
      overlay.setAttribute("aria-modal", "false");
      showHeaderMenu();
      headerMenuObserver?.disconnect();
      headerMenuObserver = null;
    }

    function scheduleClose(ms) {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeMenu, ms);
    }

    // --- Desktop: hover
    function bindDesktopHover() {
      if (!isMenuTrigger) return;
      // trigger hover
      trigger.addEventListener("mouseenter", () => { clearTimeout(closeTimer); openMenu(); });
      trigger.addEventListener("mouseleave", () => scheduleClose(120));

      // overlay hover
      overlay.addEventListener("mouseenter", () => clearTimeout(closeTimer));
      overlay.addEventListener("mouseleave", () => scheduleClose(120));
    }

    // --- Mobile: click fullscreen
    function bindMobileClick() {
      if (!isMenuTrigger) return;
      trigger.addEventListener("click", (e) => {
        if (!mqMobile.matches) return; // desktop ignore click (hover gère)
        e.preventDefault();
        open ? closeMenu() : openMenu();
      });

      closeBtn.addEventListener("click", closeMenu);

      // close on link click (mobile)
      overlay.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a && mqMobile.matches) closeMenu();
      });
    }

    // --- Mobile: clic burger (capture pour bloquer le natif)
    function bindBurgerClick() {
      const burgerSelector = ".header-burger-btn, .header-burger, [class*=\"header-burger\"], [class*=\"burger\"]";

      const isBurgerTarget = (target) => {
        return !!target.closest(burgerSelector);
      };

      const blockNative = (e) => {
        if (!mqMobile.matches) return;
        if (!isBurgerTarget(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      };

      const handleBurgerClick = (e) => {
        if (!mqMobile.matches) return;
        if (!isBurgerTarget(e.target)) return;
        blockNative(e);
        open ? closeMenu() : openMenu();
      };

      document.addEventListener("click", handleBurgerClick, true);
      document.addEventListener("pointerdown", blockNative, true);
      document.addEventListener("touchstart", blockNative, true);
    }

    // Close on click outside (desktop)
    document.addEventListener("click", (e) => {
      if (mqMobile.matches) return;
      if (!open) return;
      const inside = overlay.contains(e.target) || trigger.contains(e.target);
      if (!inside) closeMenu();
    });

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Re-sync on breakpoint change
    mqMobile.addEventListener?.("change", () => {
      // si on passe desktop<->mobile, on ferme pour éviter états bizarres
      closeMenu();
    });

    bindDesktopHover();
    bindMobileClick();
    bindBurgerClick();

    // Empêche le "Menu" de naviguer si c'est un lien vers une page (desktop hover)
    if (isMenuTrigger) trigger.addEventListener("click", (e) => {
      if (!mqMobile.matches) {
        // sur desktop, click ne doit pas naviguer (sinon hover inutile)
        e.preventDefault();
        open ? closeMenu() : openMenu();
      }
    });

    return true;
  }

  // init now
  if (init()) return;

  

  // retry (Squarespace injecte parfois le header après)
  if (retries > 0) return setTimeout(() => bootOasisSubmenu(retries - 1), 250);
})();
