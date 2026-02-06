  (function setBlogThemeLuneClass() {
    function run() {
      var path = (window.location.pathname || "").replace(/^\/|\/$/g, "");
      var isGalerie = path.indexOf("galerie-oasis-collections") !== -1;
      var isEvenements = path.indexOf("evenements-post") !== -1;
      if (document.body && (isGalerie || isEvenements)) {
        document.body.classList.add("oasis-blog-theme-lune");
      } else if (document.body) {
        document.body.classList.remove("oasis-blog-theme-lune");
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    document.addEventListener("sqs-route-did-change", run);
  })();

  /* Mobile: click => fullscreen + close button */
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

          <!-- COL 4 - Évènements (aucune redirection au clic) -->
          <div class="oasis-submenu__col">
            <h3 class="oasis-submenu__title">Évènements</h3>
            <ul class="oasis-submenu__list">
              <li><a>Salon des ensembliers</a></li>
              <li><a>Pad Paris 2024</a></li>
              <li><a>Lune Rousse</a></li>
              <li><a>Arjumand's world</a></li>
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

      const trigger = findMenuTrigger();
      if (!trigger) return false;

      const folderItem = trigger.closest('.header-nav-item, .header-menu-nav-item');
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
      var burger = document.querySelector("[class*=\"header-burger\"]");
      if (burger) {
        burger.addEventListener("click", function (e) {
          if (!mqMobile.matches) return;
          e.preventDefault();
          e.stopPropagation();
          openMenu();
        }, true);
      }

      // Empêche le "Menu" de naviguer si c’est un lien vers une page (desktop hover)
      trigger.addEventListener("click", (e) => {
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

  (function initExpoSwap() {
    const root = document.querySelector('[data-expo-swap]');
    if (!root) return;

    const img = root.querySelector('[data-expo-img]');
    const links = Array.from(root.querySelectorAll('[data-expo-list] a[data-img]'));
    if (!img || !links.length) return;

    // Préload
    links.forEach(a => { const i = new Image(); i.src = a.dataset.img; });

    // Transition simple (fade)
    let raf = null;
    function swap(src) {
      if (!src || img.src === src) return;
      cancelAnimationFrame(raf);

      img.style.transition = 'opacity .18s ease';
      img.style.opacity = '0';

      raf = requestAnimationFrame(() => {
        setTimeout(() => {
          img.src = src;
          img.onload = () => { img.style.opacity = '1'; };
        }, 140);
      });
    }

    // Hover desktop
    links.forEach(a => {
      a.addEventListener('mouseenter', () => swap(a.dataset.img));
      a.addEventListener('focus', () => swap(a.dataset.img)); // accessibilité clavier
    });

    // Mobile: swap au touch (sans empêcher le click)
    links.forEach(a => {
      a.addEventListener('touchstart', () => swap(a.dataset.img), { passive: true });
    });
  })();

  (function () {
    const root = document.querySelector('[data-expo-gallery]');
    if (!root) return;

    const tiles = Array.from(root.querySelectorAll('.expo-tile'));
    const lb = root.querySelector('[data-expo-lightbox]');
    const inner = lb?.querySelector('.expo-lightbox__inner');
    const view = lb?.querySelector('[data-expo-view]');
    const captionEl = lb?.querySelector('[data-expo-caption]');
    const countEl = lb?.querySelector('[data-expo-count]');
    const btnClose = lb?.querySelector('.expo-close');
    const btnBack = lb?.querySelector('.expo-back');
    const btnPrev = lb?.querySelector('.expo-prev');
    const btnNext = lb?.querySelector('.expo-next');

    if (!tiles.length || !lb || !view || !captionEl || !countEl) return;

    // Build data
    const items = tiles.map(t => ({
      src: t.getAttribute('data-src'),
      caption: t.getAttribute('data-caption') || ''
    }));

    // preload hi-res
    items.forEach(it => { const i = new Image(); i.src = it.src; });

    let idx = 0;

    function pad2(n) { return String(n).padStart(2, '0'); }

    function render(i) {
      idx = (i + items.length) % items.length;
      const it = items[idx];

      view.style.opacity = '0';
      view.style.transition = 'opacity .18s ease';

      // swap
      view.src = it.src;
      view.onload = () => { view.style.opacity = '1'; };

      captionEl.textContent = it.caption ? it.caption : '—';
      countEl.textContent = `${pad2(idx + 1)}/${pad2(items.length)}`;
    }

    function openAt(i) {
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      render(i);
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    function next() { render(idx + 1); }
    function prev() { render(idx - 1); }

    // Click tile
    tiles.forEach((t, i) => t.addEventListener('click', () => openAt(i)));

    // Controls
    btnClose?.addEventListener('click', close);
    btnBack?.addEventListener('click', close);
    btnNext?.addEventListener('click', next);
    btnPrev?.addEventListener('click', prev);

    // Close when clicking outside inner
    lb.addEventListener('click', (e) => {
      if (inner && !inner.contains(e.target)) close();
    });

    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  })();

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

  document.addEventListener("DOMContentLoaded", function () {

    var NEWSLETTER_FORM_HTML = "<input class=\"news-input\" placeholder=\"Adresse mail\" /><button class=\"news-btn\">OK →</button>";

    function run() {
      var customForm = document.querySelector("footer .newsline");
      if (customForm && customForm.querySelector(".news-success")) {
        customForm.removeAttribute("data-newsletter-sync-bound");
        customForm.innerHTML = NEWSLETTER_FORM_HTML;
      }

      customForm = document.querySelector("footer .newsline");
      var customInput = customForm?.querySelector(".news-input");
      var customButton = customForm?.querySelector(".news-btn");

      var nativeBlock = document.querySelector("footer .sqs-block-newsletter");
      var nativeForm = nativeBlock?.querySelector("form.newsletter-form");
      var nativeInput = nativeForm?.querySelector('input[name="email"], input[type="email"]');
      var nativeButton = nativeForm?.querySelector('button[type="submit"]');

      if (!customForm || !customInput || !nativeForm || !nativeInput || !nativeButton) {
        return;
      }
      if (customForm.hasAttribute("data-newsletter-sync-bound")) {
        return;
      }
      customForm.setAttribute("data-newsletter-sync-bound", "true");

      nativeForm.scrollIntoView = function () { };

      var submittedThisSession = false;

      function syncToNative() {
        nativeInput.value = customInput.value;
      }

      function submitNative() {
        if (!customInput.checkValidity()) {
          customInput.reportValidity();
          return;
        }
        submittedThisSession = true;
        syncToNative();
        nativeButton.click();
      }

      customInput.addEventListener("input", syncToNative);
      customInput.addEventListener("change", syncToNative);

      function showMerci() {
        if (customForm.querySelector(".news-success")) return;
        customForm.innerHTML = "<p class='news-success'>Merci</p>";
      }

      function isSuccessDetected() {
        if (!nativeBlock) return false;
        var submission = nativeBlock.querySelector(".form-submission-html, .form-submission-text");
        if (submission && (submission.innerHTML.trim() !== "" || submission.getAttribute("data-submission-html"))) return true;
        var text = (nativeBlock.innerText || "").toLowerCase();
        return /thank|merci|success|subscribed|inscrit|envoyé/.test(text);
      }

      var observer = new MutationObserver(function () {
        if (submittedThisSession && isSuccessDetected()) {
          showMerci();
          observer.disconnect();
        }
      });
      observer.observe(nativeBlock, { childList: true, subtree: true, characterData: true, attributes: true });

      var polling = false;
      function onCustomSubmit() {
        if (polling) return;
        polling = true;
        var attempts = 0;
        var poll = setInterval(function () {
          attempts++;
          if (submittedThisSession && isSuccessDetected()) {
            clearInterval(poll);
            polling = false;
            showMerci();
            return;
          }
          if (attempts >= 16) {
            clearInterval(poll);
            polling = false;
          }
        }, 500);
      }

      customForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitNative();
        onCustomSubmit();
      });

      if (customButton) {
        customButton.addEventListener("click", function (e) {
          e.preventDefault();
          submitNative();
          onCustomSubmit();
        });
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 800);
    setTimeout(run, 2000);
    document.addEventListener("sqs-route-did-change", run);
    run();
  });