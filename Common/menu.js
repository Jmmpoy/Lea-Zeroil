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
 * - Galerie Oasis (Tapistelar, Siroco, Mirages)
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
              <li><a href="/galerie-oasis-collections/tapistelar">Tapistelar</a></li>
              <li><a>Siroco</a></li>
              <li><a>Mirages</a></li>
            </ul>
          </div>

          <!-- COL 4 - Évènements -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Évènements</h3>
            <ul class="oasis-submenu__list">
              <li><a href="/evenements-post/salon-des-ensembliers">Salon des ensembliers</a></li>
              <li><a href="/evenements-post/pad-paris-2024">Pad Paris 2024</a></li>
              <li><a href="/evenements-post/lune-rousse">Lune Rousse</a></li>
              <li><a href="/evenements-post/arjumand">Arjumand's world</a></li>
              <li><a href="/evenements-post/modern-metier">Modern Metier</a></li>
            </ul>
          </div>

          <!-- COL 5 -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Catalogue</h3>
            <ul class="oasis-submenu__list">
              <li>
                <a href="#">
                  <span class="oasis-submenu__diamond" aria-hidden="true"></span>Catalogue français
                </a>
              </li>
              <li>
                <a href="#">
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

    function openMenu() {
      if (open) return;
      open = true;
      overlay.classList.add("is-open");
      var headerMenu = document.querySelector(".header-menu");
      if (headerMenu) headerMenu.classList.add("oasis-header-menu-hidden");

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
      document.body.classList.remove("oasis-submenu-lock");
      overlay.setAttribute("aria-modal", "false");
      var headerMenu = document.querySelector(".header-menu");
      if (headerMenu) headerMenu.classList.remove("oasis-header-menu-hidden");
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

    // Mobile : clic sur le burger → afficher notre overlay et masquer le menu Squarespace (.header-menu)
    if (burgerTrigger && burgerTrigger !== trigger) {
      burgerTrigger.addEventListener("click", function (e) {
        if (!mqMobile.matches) return;
        e.preventDefault();
        e.stopPropagation();
        openMenu();
      }, true);
    }

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
