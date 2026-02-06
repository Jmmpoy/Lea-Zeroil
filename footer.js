<script src="https://cdn.commoninja.com/sdk/latest/commonninja.js" defer></script>
<div class="commonninja_component pid-0c54ac61-e503-4390-9055-f39e23383385"></div>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Jmmpoy/Lea-Zeroil@main/homepageSlider.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Jmmpoy/Lea-Zeroil@main/Homepage/homepage.css">

<script>
  /* Blog item : injecter Block ID et classes panneau texte (remplace nth-child en CSS) */
  (function injectBlogItemIdsAndClasses() {
    var BLOCK_IDS = ["blog-title-photos", "blog-gallery-photos", "blog-title-collection", "blog-gallery-collection"];
    var TEXT_CLASSES = ["collab-header", "collab-legend", "collab-label-desc", "collab-content-desc", "collab-label-artisans", "collab-content-artisans", "collab-button"];

    function run() {
      if (!document.body || !document.body.classList.contains("collection-type-blog-basic-grid")) return;

      var col = document.querySelector(".blog-item-content .sqs-layout .row .col.sqs-col-12");
      if (col) {
        var blocks = Array.from(col.children);
        if (blocks.length >= 6) {
          BLOCK_IDS.forEach(function (id, i) {
            var block = blocks[i + 2];
            if (block && !block.id) block.id = id;
          });
        }
      }

      var htmlContent = document.querySelector(".blog-item-content .sqs-block-html .sqs-html-content");
      if (htmlContent) {
        var directChildren = Array.from(htmlContent.children).filter(function (el) {
          return el.tagName === "P" || el.tagName === "A" || el.tagName === "DIV";
        }).slice(0, 7);
        if (directChildren.length < 7) {
          directChildren = Array.from(htmlContent.querySelectorAll("p, a")).slice(0, 7);
        }
        directChildren.forEach(function (el, i) {
          if (TEXT_CLASSES[i]) el.classList.add(TEXT_CLASSES[i]);
        });
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    document.addEventListener("sqs-route-did-change", run);
  })();
</script>
<script>
  /* Galerie produit : Swiper pour le carousel d’images */
  (function initProductGallerySwiper() {
    var WRAPPER_CLASS = 'swiper-wrapper';
    var INIT_FLAG = 'data-product-gallery-swiper-init';
    var isMobile = function () {
      return window.matchMedia('(max-width: 900px)').matches;
    };

    function run() {
      var container = document.querySelector('.product-gallery[data-product-gallery="container"]');
      var slidesEl = container && container.querySelector('.product-gallery-slides');

      if (!slidesEl || slidesEl.getAttribute(INIT_FLAG)) return;

      var items = Array.from(slidesEl.querySelectorAll('.product-gallery-slides-item'));

      // Au moins 3 slides requis (sinon retry via setTimeout)
      if (items.length < 3) return;

      var _mobile = isMobile();
      // Mobile : n'init qu'après chargement complet (images, layout) pour éviter grille à 3 slides
      if (_mobile && document.readyState !== 'complete') {
        return; // run() sera rappelé au window.load
      }
      var _rect = container ? container.getBoundingClientRect() : null;
      var _containerWidth = _rect ? _rect.width : 0;
      // Mobile : ne pas init si le conteneur est trop étroit (grilles vides, seulement 3 slides calculées)
      var MIN_WIDTH_MOBILE = 250;
      if (_mobile && _containerWidth > 0 && _containerWidth < MIN_WIDTH_MOBILE) return;

      // Créer wrapper
      var wrapper = document.createElement('div');
      wrapper.className = WRAPPER_CLASS;
      items.forEach(function (item) {
        wrapper.appendChild(item);
      });
      slidesEl.insertBefore(wrapper, slidesEl.firstChild);

      // 🔥 Ne définir le flag d'init qu'après avoir VRAIMENT tout initialisé
      slidesEl.setAttribute(INIT_FLAG, '1');

      var prevEl = container.querySelector('[data-product-gallery="prev"]');
      var nextEl = container.querySelector('[data-product-gallery="next"]');
      var indicatorEl = container.querySelector('[data-product-gallery="indicator"]');
      var thumbItems = Array.from(container.querySelectorAll('.product-gallery-thumbnails-item'));

      function updateIndicator(swiper) {
        if (!indicatorEl) return;
        indicatorEl.textContent = (swiper.realIndex + 1) + ' / ' + swiper.slides.length;
      }

      function updateThumbnails(swiper) {
        thumbItems.forEach(function (btn, i) {
          btn.setAttribute('aria-current', i === swiper.realIndex ? 'true' : 'false');
        });
      }

      // ⚠️ Forcer le layout complet AVANT Swiper
      if (_mobile) {
        var slideWidthPx = container.offsetWidth || 360; // fallback raisonnable
        wrapper.style.display = 'flex';
        wrapper.style.width = (slideWidthPx * items.length) + 'px';
        items.forEach(function (slide) {
          slide.style.minWidth = slideWidthPx + 'px';
          slide.style.width = slideWidthPx + 'px';
          slide.style.flexShrink = '0';
        });
      }
      var swiper = new Swiper(slidesEl, {
        slideClass: 'product-gallery-slides-item',
        wrapperClass: WRAPPER_CLASS,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 400,
        loop: false,
        grabCursor: true,
        observer: true,
        observeSlideChildren: true,
        // Comme Goodmoods : breakpoints pour recalc responsive + base sur le conteneur (mobile)
        breakpointsBase: 'container',
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 0
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0
          }
        },
        navigation: prevEl && nextEl ? {
          prevEl: prevEl,
          nextEl: nextEl
        } : {},
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        on: {
          init: function (s) {
            updateIndicator(s);
            updateThumbnails(s);
            // Recalcul après chargement layout/images (fix mobile : grilles vides à l'init, seulement 3 slides)
            function doUpdate() {
              if (s && s.update) s.update();
              updateIndicator(s);
              updateThumbnails(s);
            }
            var delayFirst = isMobile() ? 500 : 300;
            setTimeout(doUpdate, delayFirst);
            if (isMobile()) {
              if (document.readyState !== 'complete') {
                window.addEventListener('load', doUpdate);
              }
              setTimeout(doUpdate, 1000);
              setTimeout(doUpdate, 2000);
            }
          },
          slideChange: function (s) {
            updateIndicator(s);
            updateThumbnails(s);
          }
        }
      });

      thumbItems.forEach(function (btn, index) {
        btn.addEventListener('click', function () {
          swiper.slideTo(index);
        });
      });

      var slideArea = slidesEl.querySelector('.swiper-wrapper');
      if (slideArea) {
        slideArea.addEventListener('click', function () {
          swiper.slideNext();
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }

    // ⏱ Tentatives retardées
    setTimeout(run, 600);
    setTimeout(run, 1500);
    setTimeout(run, 3000);

    // Mobile : init galerie après chargement complet (évite grille partielle à 3 slides)
    window.addEventListener('load', run);

    document.addEventListener('sqs-route-did-change', run);
  })();
</script>

<script>
  /* OASIS Submenu – Squarespace 7.1
     - Desktop: hover (Menu) + close click outside
     - Mobile: click => fullscreen + close button
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
</script>

<script>
  (function () {
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
</script>

<script>
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
</script>

<script>
  (function () {
    const SECTION_ID = '696a54d6ef67ef6cf6befe25';
    const TARGET_URL = '/collections';

    const section = document.querySelector(`section[data-section-id="${SECTION_ID}"]`);
    if (!section) return;

    // Tous les liens potentiels dans les summary items
    const links = section.querySelectorAll(
      '.summary-item a'
    );

    links.forEach(link => {
      link.setAttribute('href', TARGET_URL);
      link.removeAttribute('target'); // sécurité: même onglet
    });
  })();
</script>

<script>
  (function () {
    const SECTION_ID = "696abd01e1d862206d905143";

    function runExtraction() {
      const section = document.querySelector(`section[data-section-id="${SECTION_ID}"]`);
      if (!section) return;
      const items = section.querySelectorAll(".summary-item");
      if (!items.length) return;

      function extractColors(text) {
        if (!text) return [];
        const m = text.match(/colors\s*:\s*([a-z0-9,\s-]+)/i);
        if (!m) return [];
        // Première ligne uniquement (évite de mélanger filter:, link:, etc.)
        let line = (m[1].split(/\n/)[0] || "").trim();
        // Enlever " link:..." / " links:..." si présent (même sans \n dans le texte)
        line = line.replace(/\s+links?\s*:.*$/i, "").trim();
        const tokens = line
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        // Dernier token : retirer le suffixe "link"/"links" (ex. roselinks → rose, orlinks → or)
        if (tokens.length && /links?$/i.test(tokens[tokens.length - 1])) {
          tokens[tokens.length - 1] = tokens[tokens.length - 1].replace(/links?$/i, "").trim();
          if (!tokens[tokens.length - 1]) tokens.pop();
        }
        return tokens;
      }

      // Alias : formes sans tiret (ex. jaunepaille) → slug canonique (jaune-paille) pour matcher les variables CSS
      const COLOR_SLUG_ALIASES = {
        jaunepaille: "jaune-paille",
        brunterre: "brun-terre",
        roseetrusque: "rose-etrusque",
        vieuxrose: "vieux-rose",
        vertfonce: "vert-fonce",
        vertclair: "vert-clair",
        vertprairie: "vert-prairie",
        vertgazon: "vert-gazon",
        vertkaki: "vert-kaki",
        jauneclair: "jaune-clair",
        rosepale: "rose-pale",
        rosefonce: "rose-fonce",
        roseterre: "rose-terre",
        rosebrunterre: "rose-brun-terre",
        bordeauxfonce: "bordeaux-fonce",
        brunboisbrule: "brun-bois-brule",
        rosepalebrunterre: "rose-pale-brun-terre",
      };

      function slugifyColorName(s) {
        const slug =
          String(s ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "rouge";
        return COLOR_SLUG_ALIASES[slug] ?? slug;
      }

      function extractFilter(text) {
        if (!text) return null;
        const m = text.match(/filter\s*:\s*([a-z0-9éèêëàâäùûüîïôöç\s-]+)/i);
        if (!m) return null;
        return m[1].trim().toLowerCase().replace(/\s+/g, " ") || null;
      }

      const itemsWithFilter = [];
      items.forEach(item => {
        const title = item.querySelector(".summary-title");
        // Lire le conteneur excerpt (tous les <p>) pour avoir "filter:assises" même dans un 2e paragraphe
        const excerptEl =
          item.querySelector(".summary-excerpt") ||
          item.querySelector(".summary-text") ||
          item.querySelector(".summary-excerpt p") ||
          item.querySelector(".summary-text p");

        if (!excerptEl) return;

        const raw = (excerptEl.textContent || "").trim();

        // 1) Filtre : extraire filter:xxx (ex. filter:assises), mettre sur l'item, retirer de l'excerpt
        const filterValue = extractFilter(raw);
        if (filterValue) {
          item.dataset.filter = filterValue;
          const titleText = (item.querySelector(".summary-title-link") || title).textContent || "";
          itemsWithFilter.push({ title: titleText.trim(), filter: filterValue });
          excerptEl.innerHTML = excerptEl.innerHTML.replace(/filter\s*:\s*[a-z0-9éèêëàâäùûüîïôöç\s-]+/i, "").trim();
        }

        // 1b) Lien boutique : extraire link:/boutique/p/xxx (s'arrêter avant filter: ou colors:)
        const linkMatch = raw.match(/link\s*:\s*(\/[^\s\n]+)/i);
        if (linkMatch) {
          let customUrl = linkMatch[1].replace(/^\s+|\s+$/g, "");
          // Retirer toute partie "filter:..." ou "colors:..." collée à la fin de l'URL
          customUrl = customUrl.replace(/(filter|colors)\s*:[^\s\n]*$/i, "").replace(/\s+$/g, "");
          const links = item.querySelectorAll("a[href]");
          links.forEach((link) => link.setAttribute("href", customUrl));
          excerptEl.innerHTML = excerptEl.innerHTML.replace(/link\s*:\s*\/[^\s\n]+/gi, "").trim();
        }

        // 2) Pastilles (swatches) : inchangé, uniquement si pas déjà présents
        if (item.querySelector(".gm-swatches")) return;
        if (!title) return;

        const colors = extractColors(raw);
        if (!colors.length) return;

        const wrap = document.createElement("span");
        wrap.className = "gm-swatches";
        wrap.setAttribute("aria-hidden", "true");

        colors.forEach(name => {
          const dot = document.createElement("span");
          dot.className = "gm-swatch";
          dot.dataset.color = slugifyColorName(name);
          wrap.appendChild(dot);
        });

        title.appendChild(wrap);
        excerptEl.innerHTML = excerptEl.innerHTML.replace(/colors\s*:\s*[^\n]*/i, "").trim();
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        runExtraction();
        setTimeout(runExtraction, 800);
      });
    } else {
      runExtraction();
      setTimeout(runExtraction, 800);
    }
  })();
</script>

<script>
  (function () {
    const GRID_SECTION_ID = "696abd01e1d862206d905143";

    function initFilter() {
      const gridSection = document.querySelector(`section[data-section-id="${GRID_SECTION_ID}"]`);
      const filterBar = document.querySelector("[data-gm-filter]");
      if (!gridSection || !filterBar) return;

      const filterLinks = filterBar.querySelectorAll(".gm-filterbar__item");

      function applyFilter(value) {
        const listEl = gridSection.querySelector(".summary-item-list");
        const items = gridSection.querySelectorAll(".summary-item");
        const isAll = !value || value === "all";
        const visible = [];
        items.forEach(item => {
          const itemFilter = (item.dataset.filter || "").trim();
          const match = isAll || itemFilter === value;
          item.classList.toggle("gm-filter-hidden", !match);
          if (match) visible.push({ title: (item.querySelector(".summary-title-link") || item.querySelector(".summary-title"))?.textContent?.trim() || "", filter: itemFilter || "(aucun)" });
        });
        if (listEl) listEl.classList.toggle("gm-filter-active", !isAll);
        filterLinks.forEach(link => {
          const href = (link.getAttribute("href") || "").trim();
          const linkValue = href.slice(1).toLowerCase();
          link.classList.toggle("is-active", isAll ? linkValue === "all" : linkValue === value);
        });
      }

      filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const href = (this.getAttribute("href") || "").trim();
          const value = href.slice(1).toLowerCase();
          applyFilter(value);
        });
      });

      const items = gridSection.querySelectorAll(".summary-item");
      applyFilter("all");

      // Appliquer le filtre depuis le hash (ex. /collections#luminaires) après extraction des data-filter (800 ms)
      const hash = (window.location.hash || "").replace(/^#/, "").trim().toLowerCase();
      if (hash) {
        setTimeout(function () {
          applyFilter(hash);
        }, 1000);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(initFilter, 300);
      });
    } else {
      setTimeout(initFilter, 300);
    }
  })();
</script>


<script>
  (function () {
    var COLLECTIONS_SECTION_ID = "696abd01e1d862206d905143";

    function applyExcerptLinks() {
      var section = document.querySelector('section[data-section-id="' + COLLECTIONS_SECTION_ID + '"]');
      if (!section) return;

      section.querySelectorAll('.summary-item').forEach(function (item) {
        var excerpt = item.querySelector('.summary-excerpt') || item.querySelector('.summary-excerpt-only') || item.querySelector('.summary-text');
        if (!excerpt) return;
        var rawText = (excerpt.textContent || '').trim();
        if (!rawText) return;
        var m = rawText.match(/link\s*:\s*(\/[^\s\n]+)/i);
        if (!m) return;

        var customUrl = m[1].replace(/^\s+|\s+$/g, '');

        // Appliquer l’URL à tous les liens de l’item (miniature, titre, etc.)
        var links = item.querySelectorAll('a[href]');
        links.forEach(function (link) {
          link.setAttribute('href', customUrl);
        });

        // Si le conteneur miniature est lui-même un <a> (Squarespace varie)
        var thumbContainer = item.querySelector('.summary-thumbnail-container');
        if (thumbContainer && thumbContainer.tagName === 'A') {
          thumbContainer.setAttribute('href', customUrl);
        }
        var thumbOuter = item.querySelector('.summary-thumbnail-outer-container');
        if (thumbOuter && thumbOuter.tagName === 'A') {
          thumbOuter.setAttribute('href', customUrl);
        }

        // --- Nettoyage visuel : retire la ligne "link:..." de l'excerpt ---
        var ps = [].slice.call(excerpt.querySelectorAll('p'));
        if (ps.length) {
          ps.forEach(function (p) {
            var t = (p.textContent || '');
            if (/^\s*link\s*:\s*\/[^\s]+\s*$/i.test(t.trim())) {
              p.textContent = '';
            } else {
              p.textContent = t.replace(/(?:^|\n)\s*link\s*:\s*\/[^\s]+\s*(?:$|\n)?/ig, '').trim();
            }
          });
          var stillHasText = ps.some(function (p) { return (p.textContent || '').trim().length > 0; });
          if (!stillHasText) excerpt.style.display = 'none';
        } else {
          var cleaned = rawText.replace(/(?:^|\n)\s*link\s*:\s*\/[^\s]+\s*(?:$|\n)?/ig, '').trim();
          if (!cleaned) excerpt.style.display = 'none';
        }
      });
    }

  })();
</script>

<script>
  (function () {
    "use strict";

    const MARKER = "@product-data";

    function normalizeKey(k) {
      return (k || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
    }

    function escapeHtml(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function slugifyToken(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function capFirst(s) {
      const t = String(s ?? "").trim();
      return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
    }

    function parsePayload(raw) {
      const lines = raw
        .split("\n")
        .map((l) => l.replace(/\r/g, ""))
        .filter((l) => l.trim() !== "");

      const markerIdx = lines.findIndex((l) => l.trim() === MARKER);
      if (markerIdx === -1) return null;

      const contentLines = lines.slice(markerIdx + 1);

      const data = { materiaux: "", fabrication: "", colors: [], dimensions: [] };

      let i = 0;
      while (i < contentLines.length) {
        const line = contentLines[i].trim();

        if (/^dimensions\s*:/i.test(line)) {
          i++;
          while (i < contentLines.length) {
            const l = contentLines[i].trim();
            if (!l) { i++; continue; }
            if (/^(materiaux|matériaux|materials|fabrication|colors|colour|couleurs)\s*:/i.test(l)) break;
            const m = l.match(/^-+\s*(.+)$/);
            data.dimensions.push((m && m[1] ? m[1] : l).trim());
            i++;
          }
          continue;
        }

        const kv = line.match(/^([^:]+)\s*:\s*(.*)$/);
        if (kv) {
          const key = normalizeKey(kv[1]);
          const val = (kv[2] || "").trim();

          if (key === "materiaux" || key === "materiaux" || key === "materials") {
            data.materiaux = val;
          } else if (key === "fabrication") {
            data.fabrication = val;
          } else if (key === "colors" || key === "couleurs" || key === "colour") {
            data.colors = val.split(",").map((c) => c.trim()).filter(Boolean);
          } else if (key === "dimensions") {
            if (val) data.dimensions.push(val);
          }
        }

        i++;
      }

      const ok = data.materiaux || data.fabrication || data.colors.length || data.dimensions.length;
      return ok ? data : null;
    }

    function buildRow(label, headHtml, opts) {
      const expanded = !!opts?.expanded;
      const collapsible = !!opts?.collapsible;

      if (!collapsible) {
        return `
        <div class="oasis-spec__row">
          <div class="oasis-spec__label">${escapeHtml(label)}</div>
          <div class="oasis-spec__value">${headHtml}</div>
        </div>
      `;
      }

      return `
      <div class="oasis-spec__row oasis-spec__row--collapsible" data-expanded="${expanded ? "true" : "false"}">
        <button class="oasis-spec__head" type="button" aria-expanded="${expanded ? "true" : "false"}">
          <span class="oasis-spec__label">${escapeHtml(label)}</span>
          <span class="oasis-spec__value">${headHtml}</span>
          <span class="oasis-spec__icon" aria-hidden="true"></span>
        </button>
        <div class="oasis-spec__panel" ${expanded ? "" : "hidden"}></div>
      </div>
    `;
    }

    function buildColorsList(colors, selectedName) {
      const selectedToken = slugifyToken(selectedName || "");
      return `
    <div class="oasis-colors" role="list">
      ${colors.map((name) => {
        const token = slugifyToken(name);
        const isSelected = token === selectedToken;
        return `
          <button type="button" class="oasis-color" data-color-name="${escapeHtml(name)}" data-color-token="${escapeHtml(token)}" ${isSelected ? 'data-selected="1"' : ''}>
            <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
            <span class="oasis-color__name">${escapeHtml(name.toUpperCase())}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
    }

    function buildDimsList(dimensions) {
      return `
      <div class="oasis-dims">
        ${dimensions.map((d) => `<div class="oasis-dim__line">${escapeHtml(d)}</div>`).join("")}
      </div>
    `;
    }

    function renderComponent(data) {
      const parts = [];

      if (data.materiaux) {
        parts.push(buildRow("Matériaux", `<span class="oasis-inline">${escapeHtml(data.materiaux)}</span>`, { collapsible: false }));
      }

      if (data.dimensions.length) {
        const head = `<span class="oasis-inline">${escapeHtml(data.dimensions[0])}</span>`;
        parts.push(buildRow("Taille", head, { collapsible: true, expanded: false }));
      }

      if (data.colors.length) {
        const first = data.colors[0];
        const token = slugifyToken(first);

        const head = `
        <span class="oasis-inline oasis-inline--color">
          <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
          <span class="oasis-inline__name">${escapeHtml(first.toUpperCase())}</span>
        </span>
      `;

        // ✅ NO DUPLICATE: panel shows colors without the first item
        const rest = data.colors.slice(1);
        parts.push(buildRow("Coloris", head, { collapsible: true, expanded: false, panelHtml: buildColorsList(rest) }));
      }

      if (data.fabrication) {
        parts.push(buildRow("Fabrication", `<span class="oasis-inline">${escapeHtml(data.fabrication)}</span>`, { collapsible: false }));
      }

      return `<div class="oasis-spec" data-oasis-spec>${parts.join("")}</div>`;
    }

    function bind(scope, data) {
      // Insert panels after rendering (so we can conditionally skip first color)
      const rows = scope.querySelectorAll(".oasis-spec__row--collapsible");
      rows.forEach((row) => {
        const label = row.querySelector(".oasis-spec__label")?.textContent?.trim()?.toLowerCase() || "";
        const panel = row.querySelector(".oasis-spec__panel");
        if (!panel) return;

        if (label.startsWith("taille")) {
          const restDims = data.dimensions.slice(1);
          panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildDimsList(restDims)}</div>`;
        }
        if (label.startsWith("coloris")) {
          const rest = data.colors.slice(1);
          panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildColorsList(rest)}</div>`;
        }

        const btn = row.querySelector(".oasis-spec__head");
        btn?.addEventListener("click", () => {
          const expanded = row.getAttribute("data-expanded") === "true";
          const next = !expanded;
          row.setAttribute("data-expanded", next ? "true" : "false");
          btn.setAttribute("aria-expanded", next ? "true" : "false");
          if (next) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });
      });
    }

    function mountAll() {
      const blocks = document.querySelectorAll(".sqs-block");
      blocks.forEach((block) => {
        if (block.classList.contains("oasis-spec-mounted")) return;
        const text = (block.textContent || "").trim();
        if (!text.includes(MARKER)) return;

        const data = parsePayload(text);
        if (!data) return;

        const content = block.querySelector(".sqs-block-content") || block;
        content.innerHTML = renderComponent(data);
        block.classList.add("oasis-spec-mounted");

        const scope = block.querySelector("[data-oasis-spec]");
        if (scope) bind(scope, data);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountAll);
    } else {
      mountAll();
    }

    const obs = new MutationObserver(() => mountAll());
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();
</script>
<script>
  (function () {
    "use strict";

    // --- Helpers
    function normalize(s) {
      return (s || "").replace(/\s+/g, " ").trim();
    }

    // Extrait le texte overlay depuis une description
    // Format conseillé: "Hover: Ton texte"
    // Si pas de "Hover:", on prend tout.
    function extractHoverText(raw) {
      raw = normalize(raw);
      if (!raw) return "";
      const m = raw.match(/(?:^|\n)\s*hover\s*:\s*(.+)$/i);
      return normalize(m ? m[1] : raw);
    }

    function buildOverlay(text) {
      const overlay = document.createElement("div");
      overlay.className = "gm-hover-overlay";

      const t = document.createElement("div");
      t.className = "gm-hover-overlay__text";
      t.textContent = text;

      overlay.appendChild(t);
      return overlay;
    }

    // Essaie de trouver une "description" exploitable dans le markup existant
    function getDescriptionFromItem(item) {
      // 1) figcaption (caption visible) – parfois c’est là
      const cap = item.querySelector(".gallery-caption-content");
      const capText = cap ? normalize(cap.textContent) : "";

      // 2) attributs sur img
      const img = item.querySelector("img");
      const alt = img ? normalize(img.getAttribute("alt")) : "";
      const aria = img ? normalize(img.getAttribute("aria-label")) : "";
      const dataDesc = img ? normalize(img.getAttribute("data-description")) : "";

      // 3) attributs sur figure (parfois)
      const figDesc = normalize(item.getAttribute("data-description"));

      // On retourne la "meilleure" source dispo (priorité à data-description)
      return dataDesc || figDesc || aria || alt || capText || "";
    }

    // Détecte la galerie cible :
    // - Une gallery-grid
    // - Qui a au moins un caption qui commence par "Matière"
    function findMatiereGalleries() {
      const grids = Array.from(document.querySelectorAll(".gallery-grid[data-controller='GalleryGrid']"));
      return grids.filter(grid => {
        const caps = Array.from(grid.querySelectorAll(".gallery-caption-content"));
        return caps.some(c => /^mati[eè]re\b/i.test(normalize(c.textContent)));
      });
    }

    function enhanceGrid(grid) {
      // Marqueur pour le CSS
      grid.setAttribute("data-gm-matiere", "1");

      const items = Array.from(grid.querySelectorAll("figure.gallery-grid-item"));
      items.forEach(item => {
        const wrapper = item.querySelector(".gallery-grid-item-wrapper");
        if (!wrapper) return;

        // évite double-injection
        if (wrapper.querySelector(".gm-hover-overlay")) return;

        const raw = getDescriptionFromItem(item);
        const hoverText = extractHoverText(raw);

        // Si rien à afficher => on ne met pas d’overlay
        if (!hoverText) return;

        wrapper.appendChild(buildOverlay(hoverText));
      });
    }

    function run() {
      findMatiereGalleries().forEach(enhanceGrid);
    }

    // 1er run
    document.addEventListener("DOMContentLoaded", run);

    // Squarespace recharge parfois dynamiquement : on observe
    const mo = new MutationObserver(() => run());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();
</script>
<script>
  (function () {
    "use strict";

    const MARKER = "@product-data";

    // ---------- Helpers ----------
    function normalizeKey(k) {
      return (k || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
    }

    function escapeHtml(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function slugifyToken(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // ---------- Parse payload from a Text Block ----------
    // Format attendu:
    // @product-data
    // materiaux: ...
    // fabrication: ...
    // colors: blanc, lin, rose
    // dimensions:
    // - 80 x 60 x 40
    // - autre ligne...
    function parsePayload(raw) {
      const lines = raw
        .split("\n")
        .map((l) => l.replace(/\r/g, ""))
        .filter((l) => l.trim() !== "");

      const markerIdx = lines.findIndex((l) => l.trim() === MARKER);
      if (markerIdx === -1) return null;

      const contentLines = lines.slice(markerIdx + 1);

      const data = { materiaux: "", fabrication: "", colors: [], dimensions: [] };

      let i = 0;
      while (i < contentLines.length) {
        const line = contentLines[i].trim();

        if (/^dimensions\s*:/i.test(line)) {
          i++;
          while (i < contentLines.length) {
            const l = contentLines[i].trim();
            if (!l) { i++; continue; }
            if (/^(materiaux|matériaux|materials|fabrication|colors|colour|couleurs)\s*:/i.test(l)) break;
            const m = l.match(/^-+\s*(.+)$/);
            data.dimensions.push((m && m[1] ? m[1] : l).trim());
            i++;
          }
          continue;
        }

        const kv = line.match(/^([^:]+)\s*:\s*(.*)$/);
        if (kv) {
          const key = normalizeKey(kv[1]);
          const val = (kv[2] || "").trim();

          if (key === "materiaux" || key === "materiaux" || key === "materials") {
            data.materiaux = val;
          } else if (key === "fabrication") {
            data.fabrication = val;
          } else if (key === "colors" || key === "couleurs" || key === "colour") {
            data.colors = val.split(",").map((c) => c.trim()).filter(Boolean);
          } else if (key === "dimensions") {
            if (val) data.dimensions.push(val);
          }
        }

        i++;
      }

      const ok = data.materiaux || data.fabrication || data.colors.length || data.dimensions.length;
      return ok ? data : null;
    }

    // ---------- Render blocks ----------
    function buildRow(label, headHtml, opts) {
      const expanded = !!opts?.expanded;
      const collapsible = !!opts?.collapsible;

      if (!collapsible) {
        return `
        <div class="oasis-spec__row">
          <div class="oasis-spec__label">${escapeHtml(label)}</div>
          <div class="oasis-spec__value">${headHtml}</div>
        </div>
      `;
      }

      return `
      <div class="oasis-spec__row oasis-spec__row--collapsible" data-expanded="${expanded ? "true" : "false"}">
        <button class="oasis-spec__head" type="button" aria-expanded="${expanded ? "true" : "false"}">
          <span class="oasis-spec__label">${escapeHtml(label)}</span>
          <span class="oasis-spec__value">${headHtml}</span>
          <span class="oasis-spec__icon" aria-hidden="true"></span>
        </button>
        <div class="oasis-spec__panel" ${expanded ? "" : "hidden"}></div>
      </div>
    `;
    }

    // ✅ MODIF: items cliquables (button) + sélection possible
    function buildColorsList(colors, selectedName) {
      const selectedToken = slugifyToken(selectedName || "");
      return `
      <div class="oasis-colors" role="list">
        ${colors.map((name) => {
        const token = slugifyToken(name);
        const isSelected = token === selectedToken;
        return `
            <button type="button"
              class="oasis-color"
              data-color-name="${escapeHtml(name)}"
              data-color-token="${escapeHtml(token)}"
              ${isSelected ? 'data-selected="1"' : ""}>
              <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
              <span class="oasis-color__name">${escapeHtml(String(name).toUpperCase())}</span>
            </button>
          `;
      }).join("")}
      </div>
    `;
    }

    function buildDimsList(dimensions) {
      return `
      <div class="oasis-dims">
        ${dimensions.map((d) => `<div class="oasis-dim__line">${escapeHtml(d)}</div>`).join("")}
      </div>
    `;
    }

    function renderComponent(data) {
      const parts = [];

      if (data.materiaux) {
        parts.push(buildRow("Matériaux", `<span class="oasis-inline">${escapeHtml(data.materiaux)}</span>`, { collapsible: false }));
      }

      if (data.dimensions.length) {
        const head = `<span class="oasis-inline">${escapeHtml(data.dimensions[0])}</span>`;
        // ✅ (optionnel) par défaut fermé aussi
        parts.push(buildRow("Taille", head, { collapsible: true, expanded: false }));
      }

      if (data.colors.length) {
        const first = data.colors[0];
        const token = slugifyToken(first);

        const head = `
        <span class="oasis-inline oasis-inline--color">
          <span class="oasis-color__swatch" data-color="${escapeHtml(token)}" aria-hidden="true"></span>
          <span class="oasis-inline__name">${escapeHtml(String(first).toUpperCase())}</span>
        </span>
      `;

        // ✅ MODIF: par défaut fermé (expanded:false)
        parts.push(buildRow("Coloris", head, { collapsible: true, expanded: false }));
      }

      if (data.fabrication) {
        parts.push(buildRow("Fabrication", `<span class="oasis-inline">${escapeHtml(data.fabrication)}</span>`, { collapsible: false }));
      }

      return `<div class="oasis-spec" data-oasis-spec>${parts.join("")}</div>`;
    }

    // ---------- Bind interactions ----------
    function bind(scope, data) {
      const rows = scope.querySelectorAll(".oasis-spec__row--collapsible");

      rows.forEach((row) => {
        const label = row.querySelector(".oasis-spec__label")?.textContent?.trim()?.toLowerCase() || "";
        const panel = row.querySelector(".oasis-spec__panel");
        if (!panel) return;

        // rename: btn -> btnHead
        const btnHead = row.querySelector(".oasis-spec__head");

        // Collapse toggle
        btnHead?.addEventListener("click", () => {
          const expanded = row.getAttribute("data-expanded") === "true";
          const next = !expanded;
          row.setAttribute("data-expanded", next ? "true" : "false");
          btnHead.setAttribute("aria-expanded", next ? "true" : "false");
          if (next) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });

        // --- Taille panel content
        if (label.startsWith("taille")) {
          const restDims = data.dimensions.slice(1);
          panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildDimsList(restDims)}</div>`;
        }

        // --- Coloris panel content + selection/reorder
        if (label.startsWith("coloris")) {
          let selectedColor = data.colors[0] || "";

          function updateHeadSelected(name) {
            const token = slugifyToken(name);
            const headSwatch = row.querySelector(".oasis-inline--color .oasis-color__swatch");
            const headName = row.querySelector(".oasis-inline--color .oasis-inline__name");
            if (headSwatch) headSwatch.setAttribute("data-color", token);
            if (headName) headName.textContent = String(name).toUpperCase();
          }

          function renderColorsPanel() {
            if (!data.colors.length) return;

            const ordered = [
              selectedColor,
              ...data.colors.filter(c => c !== selectedColor),
            ].filter(Boolean);

            panel.innerHTML = `<div class="oasis-spec__panel-inner">${buildColorsList(ordered, selectedColor)}</div>`;

            panel.querySelectorAll(".oasis-color").forEach((btn) => {
              btn.addEventListener("click", () => {
                const name = btn.getAttribute("data-color-name") || "";
                if (!name) return;

                selectedColor = name;
                updateHeadSelected(selectedColor);

                // re-render to put selected first
                renderColorsPanel();

                // Optionnel: refermer après sélection
                // row.setAttribute("data-expanded", "false");
                // btnHead.setAttribute("aria-expanded", "false");
                // panel.setAttribute("hidden", "");
              });
            });
          }

          // initial
          updateHeadSelected(selectedColor);
          renderColorsPanel();
        }
      });
    }

    // ---------- Mount in Squarespace ----------
    function mountAll() {
      const blocks = document.querySelectorAll(".sqs-block");
      blocks.forEach((block) => {
        if (block.classList.contains("oasis-spec-mounted")) return;

        const text = (block.textContent || "").trim();
        if (!text.includes(MARKER)) return;

        const data = parsePayload(text);
        if (!data) return;

        const content = block.querySelector(".sqs-block-content") || block;
        content.innerHTML = renderComponent(data);
        block.classList.add("oasis-spec-mounted");

        const scope = block.querySelector("[data-oasis-spec]");
        if (scope) bind(scope, data);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountAll);
    } else {
      mountAll();
    }

    // Re-render on Squarespace AJAX / dynamic injections
    const obs = new MutationObserver(() => mountAll());
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();
</script>


<script>
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.querySelector('[data-gm-filter]');
    if (!bar) return;

    const rail = bar.querySelector('.gm-filterbar__rail');
    const OFFSET = 120;

    function smoothScrollTo(target) {
      const y = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    bar.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);

      if (!target) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      bar.querySelectorAll(".gm-filterbar__item").forEach(el => el.classList.remove("is-active"));
      link.classList.add("is-active");

      // ✅ scroll page
      smoothScrollTo(target);

      // ✅ recentrage uniquement dans le rail (pas sur la page)
      if (rail && window.matchMedia("(max-width: 767px)").matches) {
        const left = link.offsetLeft - (rail.clientWidth / 2) + (link.clientWidth / 2);
        rail.scrollTo({ left, behavior: "smooth" });
      }
    }, true);
  });
</script>
<script>
  (function () {
    const root = document.querySelector('#block-b1e685acbb8ad735c7a3');
    if (!root) return;

    const items = Array.from(root.querySelectorAll('.field-list > *'));

    function norm(s) {
      return (s || "").toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function getTitle(el) {
      const t1 = el.querySelector('.title span');
      if (t1 && t1.textContent) return t1.textContent;
      const t2 = el.querySelector('label.title span');
      if (t2 && t2.textContent) return t2.textContent;
      return "";
    }

    items.forEach(el => {
      const title = norm(getTitle(el));

      // half columns
      if (title.includes('telephone') || title.includes('e-mail') || title.includes('email')) {
        el.setAttribute('data-gm-col', 'half');
      }
    });
  })();
</script>
<script>
  (function () {
    document.querySelectorAll(".product-add-to-cart").forEach(el => {
      if (el.querySelector(".product-extra-actions")) return;

      const wrap = document.createElement("div");
      wrap.className = "product-extra-actions";
      wrap.innerHTML = `
      <a class="product-extra-btn product-extra-btn--download"
   download>
  Fiche technique
</a>
      <button class="product-extra-btn" href="/lien-guide-entretien" type="button" data-action="open-guide">Voir le guide d’entretien</button>
    `;
      el.appendChild(wrap);
    });
  })();
</script>
<script>
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
</script>
<script>
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
</script>
<script>
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
</script>
<script>
  (function () {
    const GUIDE_HTML = `
    <div class="gm-guide__inner">
      <h2 class="gm-guide__title">Guide entretien</h2>

      <div class="gm-guide__content">
        <div class="gm-guide__row">
          <h3 class="gm-guide__colTitle">Soin</h3>
          <div class="gm-guide__colText">
            <p><strong>Céramique et verre</strong><br>
            Les surfaces en céramique et en verre requièrent un entretien régulier à l'aide d'un chiffon humidifié d'eau claire tiède, jamais chaude, ou avec un produit spécifiquement formulé pour ces matériaux. Après chaque nettoyage, il est essentiel de sécher puis de lustrer les surfaces à l'aide d'un chiffon doux en microfibre afin d'en préserver l'éclat. L'utilisation de produits abrasifs, corrosifs, acides ou alcalins est strictement déconseillée, tout comme celle d'outils durs ou pointus, susceptibles d'altérer durablement les surfaces.</p>
            <p style="margin-top: 40px;"><strong>Bois et fer</strong><br>
            Le bois et le fer nécessitent un entretien et un dépoussiérage réguliers à l'aide d'un chiffon doux. Pour le nettoyage, il est recommandé d'utiliser un chiffon légèrement humidifié, puis de sécher immédiatement afin de préserver la matière et sa patine. Le bois pourra être nourri ponctuellement avec un soin adapté à son essence. Les éléments en fer doivent être protégés de l'humidité et nettoyés sans agents agressifs. Toute exposition prolongée à l'eau, à la chaleur ou aux chocs est à éviter.</p>
          </div>
        </div>
      </div>
    </div>
  `;

    function ensureGuidePanel() {
      if (document.querySelector('.gm-guide')) return;

      const panel = document.createElement('div');
      panel.className = 'gm-guide';
      panel.innerHTML = `
      <div class="gm-guide__overlay" data-close-guide></div>
      <aside class="gm-guide__panel" role="dialog" aria-modal="true">
        ${GUIDE_HTML}
      </aside>
    `;
      document.body.appendChild(panel);
    }

    function openGuide() {
      ensureGuidePanel();
      const guide = document.querySelector('.gm-guide');
      /* Forcer un reflow pour que le navigateur peigne l’état fermé avant d’ajouter .is-open, sinon la transition ne s’exécute pas au premier ouverture */
      void guide.offsetHeight;
      guide.classList.add('is-open');
      document.documentElement.classList.add('gm-lock');
      document.body.classList.add('gm-lock');
    }

    function closeGuide() {
      const guide = document.querySelector('.gm-guide');
      if (!guide) return;
      guide.classList.remove('is-open');
      document.documentElement.classList.remove('gm-lock');
      document.body.classList.remove('gm-lock');
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="open-guide"]')) {
        e.preventDefault();
        openGuide();
        return;
      }
      if (e.target.matches('[data-close-guide]')) closeGuide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeGuide();
    });
  })();
</script>
<script>
  (function initCustomSelect(retry = 30) {
    const SECTION_ID = "6955321ea3ec302437387bc9";
    const root = document.querySelector(`section[data-section-id="${SECTION_ID}"]`);
    if (!root) {
      if (retry > 0) return setTimeout(() => initCustomSelect(retry - 1), 250);
      return;
    }

    function enhanceSelect(wrapper) {
      if (!wrapper || wrapper.classList.contains("gm-enhanced")) return;

      const nativeSelect = wrapper.querySelector("select");
      if (!nativeSelect) return;

      wrapper.classList.add("gm-enhanced");

      const options = Array.from(nativeSelect.querySelectorAll("option"))
        .filter(opt => !opt.disabled);

      const selectedText = nativeSelect.options[nativeSelect.selectedIndex]?.textContent || "";

      const custom = document.createElement("div");
      custom.className = "gm-select";
      custom.innerHTML = `
      <button type="button" class="gm-select__btn" aria-haspopup="listbox" aria-expanded="false">
        <span class="gm-select__value">${selectedText}</span>
        <span class="gm-select__chev" aria-hidden="true">
          <svg class="gm-chevron" width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3398 5.79202L5.27110.222858L0.202363 5.79202L0.478481 6.0954L5.27110.829616L10.0637 6.0954L10.3398 5.79202Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"></path>
          </svg>
        </span>
      </button>
      <ul class="gm-select__list" role="listbox">
        ${options.map(opt => `<li><button type="button" class="gm-select__opt">${opt.textContent}</button></li>`).join("")}
      </ul>
    `;

      wrapper.appendChild(custom);

      const btn = custom.querySelector(".gm-select__btn");
      const list = custom.querySelector(".gm-select__list");
      const value = custom.querySelector(".gm-select__value");

      function open() {
        custom.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }

      function close() {
        custom.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", () => {
        custom.classList.contains("is-open") ? close() : open();
      });

      list.querySelectorAll(".gm-select__opt").forEach((optBtn, idx) => {
        optBtn.addEventListener("click", () => {
          nativeSelect.selectedIndex = idx;
          nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
          value.textContent = optBtn.textContent;
          close();
        });
      });

      document.addEventListener("click", (e) => {
        if (!custom.contains(e.target)) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    function run() {
      root.querySelectorAll(".form-item.field.select").forEach(enhanceSelect);
    }

    run();

    const mo = new MutationObserver(run);
    mo.observe(root, { childList: true, subtree: true });
  })();
</script>
<script>
  (function contactPhoneStripSpaces() {
    var SECTION_ID = "6955321ea3ec302437387bc9";

    function run() {
      var section = document.querySelector('section[data-section-id="' + SECTION_ID + '"]');
      if (!section) return;
      var phoneInput = document.getElementById("phone-80707149-7f86-4f64-b478-24cfc009ea55-input-field");
      if (!phoneInput) return;

      function stripSpaces() {
        var start = phoneInput.selectionStart;
        var end = phoneInput.selectionEnd;
        var value = phoneInput.value;
        var cleaned = value.replace(/\s/g, "");
        if (cleaned === value) return;
        phoneInput.value = cleaned;
        var diff = value.length - cleaned.length;
        var newStart = Math.max(0, start - (value.slice(0, start).length - value.slice(0, start).replace(/\s/g, "").length));
        var newEnd = Math.max(newStart, end - diff);
        phoneInput.setSelectionRange(newStart, newEnd);
      }

      if (!phoneInput.hasAttribute("data-gm-phone-strip")) {
        phoneInput.setAttribute("data-gm-phone-strip", "1");
        phoneInput.addEventListener("input", stripSpaces);
        phoneInput.addEventListener("paste", function () {
          setTimeout(stripSpaces, 0);
        });
        if (phoneInput.value) stripSpaces();
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 500);
    document.addEventListener("sqs-route-did-change", run);
  })();
</script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    var darkBtn = document.getElementById("dark-mode-toggle");
    var lightBtn = document.getElementById("light-mode-toggle");
    if (!darkBtn || !lightBtn) return;

    var setActive = function (isDark) {
      if (isDark) {
        darkBtn.classList.add("is-active");
        lightBtn.classList.remove("is-active");
      } else {
        lightBtn.classList.add("is-active");
        darkBtn.classList.remove("is-active");
      }
    };

    var enableDark = function () {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      setActive(true);
    };

    var disableDark = function () {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      setActive(false);
    };

    darkBtn.addEventListener("click", enableDark);
    lightBtn.addEventListener("click", disableDark);

    if (localStorage.getItem("theme") === "dark") {
      enableDark();
    } else {
      disableDark();
    }
  });
</script>
<script>
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
</script>
<script>

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
</script>

<script>
  (function injectCollabGalleryAllSlide() {
    function run() {
      const isCollabPage = document.body.classList.contains("collection-type-blog-basic-grid");
      if (!isCollabPage) return;

      const galleries = document.querySelectorAll(".blog-item-content .sqs-block-gallery .sqs-gallery-design-grid");
      const lastGallery = galleries[galleries.length - 1];
      if (!lastGallery || lastGallery.querySelector(".gallery-all-slide__link")) return;

      const slide = document.createElement("div");
      slide.className = "slide sqs-gallery-design-grid-slide preFade fadeIn collab-gallery-all-slide";
      slide.setAttribute("data-type", "custom");

      const marginWrapper = document.createElement("div");
      marginWrapper.className = "margin-wrapper";

      const link = document.createElement("a");
      link.href = "/collections";
      link.className = "gallery-all-slide__link content-fill";
      link.setAttribute("aria-label", "Voir tout");
      link.textContent = "All";

      marginWrapper.appendChild(link);
      slide.appendChild(marginWrapper);
      lastGallery.appendChild(slide);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 800);
    document.addEventListener("sqs-route-did-change", run);
  })();
</script>
<script>
  (function injectImageSlideTitleSwatches() {
    const MAX_SWATCHES = 4;

    function slugifyColor(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "red";
    }

    function parseTitleAndColors(raw) {
      const text = (raw || "").trim();
      if (!text) return { title: "", colors: [] };
      const parts = text.split("-");
      if (parts.length < 2) return { title: text, colors: [] };
      const last = parts[parts.length - 1].trim().toLowerCase();
      if (!/^[a-z]+(,[a-z]+)*$/.test(last)) return { title: text, colors: [] };
      const colors = last
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_SWATCHES);
      const title = parts.slice(0, -1).join("-").trim();
      return { title, colors };
    }

    function run() {
      if (!document.body.classList.contains("collection-type-blog-basic-grid")) return;
      const container = document.querySelector(".blog-item-content");
      if (!container) return;
      const titles = container.querySelectorAll(".image-slide-title");
      titles.forEach((el) => {
        if (el.querySelector(".image-slide-title__row")) return;
        const raw = (el.textContent || "").trim();
        const { title, colors } = parseTitleAndColors(raw);
        const row = document.createElement("div");
        row.className = "image-slide-title__row";
        const textSpan = document.createElement("span");
        textSpan.className = "image-slide-title__text";
        textSpan.textContent = title || raw;
        row.appendChild(textSpan);
        if (colors.length) {
          const swatches = document.createElement("div");
          swatches.className = "image-slide-title__swatches";
          swatches.setAttribute("aria-hidden", "true");
          colors.forEach((name) => {
            const span = document.createElement("span");
            span.className = "oasis-color__swatch";
            span.setAttribute("data-color", slugifyColor(name));
            span.setAttribute("aria-hidden", "true");
            swatches.appendChild(span);
          });
          row.appendChild(swatches);
        }
        el.textContent = "";
        el.appendChild(row);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 800);
    document.addEventListener("sqs-route-did-change", run);
  })();
</script>
<script>
  /* Page produit : même logique que page collaboration – Titre-couleur1,couleur2 → losanges (.image-slide-title) */
  (function injectProductPageImageSlideTitleSwatches() {
    var MAX_SWATCHES = 4;

    function slugifyColor(s) {
      return String(s ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "red";
    }

    function parseTitleAndColors(raw) {
      var text = (raw || "").trim();
      if (!text) return { title: "", colors: [] };
      var parts = text.split("-");
      if (parts.length < 2) return { title: text, colors: [] };
      var last = parts[parts.length - 1].trim().toLowerCase();
      if (!/^[a-z]+(,[a-z]+)*$/.test(last)) return { title: text, colors: [] };
      var colors = last
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .slice(0, MAX_SWATCHES);
      var title = parts.slice(0, -1).join("-").trim();
      return { title: title, colors: colors };
    }

    function run() {
      var container = document.querySelector(".ProductItem-additional");
      if (!container) return;
      var titles = container.querySelectorAll(".image-slide-title");
      titles.forEach(function (el) {
        if (el.querySelector(".image-slide-title__row")) return;
        var raw = (el.textContent || "").trim();
        var parsed = parseTitleAndColors(raw);
        var title = parsed.title;
        var colors = parsed.colors;
        var row = document.createElement("div");
        row.className = "image-slide-title__row";
        var textSpan = document.createElement("span");
        textSpan.className = "image-slide-title__text";
        textSpan.textContent = title || raw;
        row.appendChild(textSpan);
        if (colors.length) {
          var swatches = document.createElement("div");
          swatches.className = "image-slide-title__swatches";
          swatches.setAttribute("aria-hidden", "true");
          colors.forEach(function (name) {
            var span = document.createElement("span");
            span.className = "oasis-color__swatch";
            span.setAttribute("data-color", slugifyColor(name));
            span.setAttribute("aria-hidden", "true");
            swatches.appendChild(span);
          });
          row.appendChild(swatches);
        }
        el.textContent = "";
        el.appendChild(row);
      });
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
<script>
  /* Page produit – 4e slide « All » bordeaux sur la 2e galerie (même logique que page collaboration) */
  (function injectProductPageGalleryAllSlide() {
    function run() {
      var container = document.querySelector(".ProductItem-additional");
      if (!container) return;
      var block3 = container.querySelector(".sqs-layout .sqs-row .sqs-col-12 > *:nth-child(3)");
      if (!block3) return;
      var gallery = block3.querySelector(".sqs-block-content .sqs-gallery-container .sqs-gallery");
      if (!gallery || gallery.querySelector(".gallery-all-slide__link")) return;

      var slide = document.createElement("div");
      slide.className = "slide sqs-gallery-design-grid-slide preFade fadeIn collab-gallery-all-slide";
      slide.setAttribute("data-type", "custom");

      var marginWrapper = document.createElement("div");
      marginWrapper.className = "margin-wrapper";

      var link = document.createElement("a");
      link.href = "/collections";
      link.className = "gallery-all-slide__link content-fill";
      link.setAttribute("aria-label", "Voir tout");
      link.textContent = "All";

      marginWrapper.appendChild(link);
      slide.appendChild(marginWrapper);
      gallery.appendChild(slide);
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
<script>
  (function itemPaginationPrevNextLabels() {
    const CUSTOM_CLASS = "item-pagination-label-custom";

    function getLabelsFromPath() {
      var path = (typeof window.location.pathname === "string" ? window.location.pathname : "") || "";
      if (path.indexOf("/evenements-post/") !== -1) {
        return { prev: "Voir l'évènement précédent", next: "Voir l'évènement suivant" };
      }
      if (path.indexOf("/galerie-oasis-collections") !== -1) {
        return { prev: "Voir l'exposition précédente", next: "Voir l'exposition suivante" };
      }
      return { prev: "Voir la collaboration précédente", next: "Voir la collaboration suivante" };
    }

    function run() {
      if (!document.body.classList.contains("collection-type-blog-basic-grid")) return;
      const section = document.querySelector("#itemPagination, .item-pagination.item-pagination--prev-next");
      if (!section) return;

      const linkPrev = section.querySelector(".item-pagination-link--prev");
      const linkNext = section.querySelector(".item-pagination-link--next");
      const labels = getLabelsFromPath();

      function injectOrUpdateLabel(link, text) {
        if (!link) return;
        var existing = link.querySelector("." + CUSTOM_CLASS);
        if (existing) {
          existing.textContent = text;
          return;
        }
        const wrapper = link.querySelector(".pagination-title-wrapper");
        const span = document.createElement("span");
        span.className = CUSTOM_CLASS;
        span.setAttribute("aria-hidden", "true");
        span.textContent = text;
        const icon = link.querySelector(".item-pagination-icon");
        if (icon && wrapper) {
          link.insertBefore(span, wrapper);
        } else if (icon) {
          link.insertBefore(span, icon.nextSibling);
        } else {
          link.appendChild(span);
        }
        if (wrapper) wrapper.remove();
      }

      if (linkPrev) injectOrUpdateLabel(linkPrev, labels.prev);
      if (linkNext) injectOrUpdateLabel(linkNext, labels.next);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    setTimeout(run, 400);
    document.addEventListener("sqs-route-did-change", run);
  })();
</script>
<script>
  /* Sélectionner par défaut la première option réelle (non placeholder) des selects variants */
  (function selectFirstVariantOption() {
    var SINGLE_OPTION_CLASS = 'gm-single-option';

    function countOptionsWithValue(select) {
      return Array.from(select.options).filter(function (opt) { return (opt.value || '').trim() !== ''; }).length;
    }

    function markSingleOptionSelects() {
      var fieldListSelectors = '.field-list .variant-option select, .field-list .product-variant-option select, .field-list .field select';
      var pdpSelectors = '.product-detail .product-variants .variant-dropdown select';
      var otherSelectors = '.variant-select, select[name^="variant-option-"]';
      document.querySelectorAll(pdpSelectors + ', ' + fieldListSelectors + ', ' + otherSelectors).forEach(function (sel) {
        var wrapper = sel.closest('.variant-dropdown') || sel.closest('.variant-option') || sel.closest('.product-variant-option') || sel.closest('.field') || sel.closest('.variant-select-wrapper') || sel.parentElement;
        if (!wrapper) return;
        var n = countOptionsWithValue(sel);
        if (n === 1) {
          wrapper.classList.add(SINGLE_OPTION_CLASS);
        } else {
          wrapper.classList.remove(SINGLE_OPTION_CLASS);
        }
      });
    }

    function run() {
      // Sélection par défaut uniquement si une seule option réelle (ex. Taille "Petite") ; si options > 1, ne pas présélectionner
      var tailleBlock = document.querySelector('.field-list .variant-option[data-variant-option-name="Taille"]');
      if (!tailleBlock) {
        tailleBlock = document.querySelector('.field-list .variant-option.form-item.select[data-variant-option-name="Taille"]');
      }
      if (tailleBlock) {
        var tailleSelect = tailleBlock.querySelector('select');
        if (tailleSelect && countOptionsWithValue(tailleSelect) === 1) {
          var firstWithValue = Array.from(tailleSelect.options).find(function (opt) { return (opt.value || '').trim() !== ''; });
          if (firstWithValue) {
            tailleSelect.value = firstWithValue.value;
            tailleSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
      document.querySelectorAll('.variant-select, select[name^="variant-option-"]').forEach(function (sel) {
        if (countOptionsWithValue(sel) !== 1) return;
        var firstWithValue = Array.from(sel.options).find(function (opt) { return (opt.value || '').trim() !== ''; });
        if (firstWithValue) {
          sel.value = firstWithValue.value;
        }
      });
      markSingleOptionSelects();
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
</script>
<script>
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
</script>
<script>
  /* Dropdown custom pour variant-dropdown : liste avec fond thème, Presicav 10px, séparateurs */
  (function enhanceVariantDropdown() {
    var LIST_CLASS = 'gm-variant-dropdown-list';
    var TRIGGER_CLASS = 'gm-variant-dropdown-trigger';
    var ENHANCED_CLASS = 'gm-variant-dropdown-enhanced';

    /* Options uniques par texte affiché (première occurrence conservée) */
    function getUniqueOptions(select) {
      var seen = {};
      var out = [];
      for (var i = 0; i < select.options.length; i++) {
        var opt = select.options[i];
        var val = (opt.value || '').trim();
        if (!val) continue;
        var text = (opt.textContent || '').trim();
        if (seen[text]) continue;
        seen[text] = true;
        out.push(opt);
      }
      return out;
    }

    /* Options à afficher dans la liste = uniques, sans l’option actuellement sélectionnée */
    function getListOptions(select, uniqueOptions) {
      return uniqueOptions.filter(function (opt) { return opt.value !== select.value; });
    }

    function slugifyVariantColor(s) {
      return String(s ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'blanc';
    }

    function run() {
      document.querySelectorAll('.product-variants .variant-select-wrapper.variant-dropdown').forEach(function (wrapper) {
        if (wrapper.classList.contains(ENHANCED_CLASS)) return;
        if (wrapper.classList.contains('gm-single-option')) return;
        var sel = wrapper.querySelector('.variant-select');
        if (!sel || !sel.options || !sel.options.length) return;

        var uniqueOptions = getUniqueOptions(sel);
        if (uniqueOptions.length <= 1) return;

        wrapper.classList.add(ENHANCED_CLASS);

        var root = document.documentElement;
        var selectedSwatch = document.createElement('span');
        selectedSwatch.className = 'gm-variant-dropdown-selected-swatch';
        selectedSwatch.setAttribute('aria-hidden', 'true');
        wrapper.insertBefore(selectedSwatch, wrapper.firstChild);

        function updateSelectedSwatch() {
          var val = (sel.value || '').trim();
          if (!val) {
            selectedSwatch.style.background = '';
            selectedSwatch.removeAttribute('data-color');
            return;
          }
          var slug = slugifyVariantColor(val);
          selectedSwatch.setAttribute('data-color', slug);
          var colorVar = getComputedStyle(root).getPropertyValue('--diamond-color-' + slug).trim();
          selectedSwatch.style.background = colorVar || '';
        }
        updateSelectedSwatch();
        sel.addEventListener('change', updateSelectedSwatch);

        var trigger = document.createElement('div');
        trigger.className = TRIGGER_CLASS;
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        var list = document.createElement('ul');
        list.className = LIST_CLASS;
        list.setAttribute('role', 'listbox');

        function fillList() {
          list.innerHTML = '';
          var toShow = getListOptions(sel, uniqueOptions);
          var root = document.documentElement;
          toShow.forEach(function (opt) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = LIST_CLASS + '__opt';
            btn.setAttribute('role', 'option');
            btn.setAttribute('data-value', opt.value);
            var slug = slugifyVariantColor(opt.value);
            var swatch = document.createElement('span');
            swatch.className = LIST_CLASS + '__swatch';
            swatch.setAttribute('data-color', slug);
            swatch.setAttribute('aria-hidden', 'true');
            var colorVar = getComputedStyle(root).getPropertyValue('--diamond-color-' + slug).trim();
            if (colorVar) swatch.style.background = colorVar;
            var label = document.createElement('span');
            label.className = LIST_CLASS + '__label';
            label.textContent = (opt.textContent || opt.value || '').trim();
            btn.appendChild(swatch);
            btn.appendChild(label);
            li.appendChild(btn);
            list.appendChild(li);
          });
          list.querySelectorAll('.' + LIST_CLASS + '__opt').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              sel.value = btn.getAttribute('data-value');
              sel.dispatchEvent(new Event('change', { bubbles: true }));
              close();
            });
          });
        }

        wrapper.appendChild(trigger);
        wrapper.appendChild(list);
        fillList();

        function open() {
          fillList();
          list.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }

        function close() {
          list.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          list.classList.contains('is-open') ? close() : open();
        });

        document.addEventListener('click', function (e) {
          if (!wrapper.contains(e.target)) close();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') close();
        });
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
</script>