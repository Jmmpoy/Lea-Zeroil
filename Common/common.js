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

  /* Page Galerie Oasis (/galerie-oasis) : fond jaune sur toute la page (body + footer) */
  (function setGalerieOasisPage() {
    /** Dans l'éditeur Squarespace le site est dans une iframe : cibler son body, sinon le body courant. */
    function getSiteBody() {
      var iframe = document.getElementById("sqs-site-frame");
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        return iframe.contentDocument.body;
      }
      return document.body;
    }

    function getSitePath() {
      var iframe = document.getElementById("sqs-site-frame");
      if (iframe && iframe.contentWindow && iframe.contentWindow.location) {
        return (iframe.contentWindow.location.pathname || "").replace(/^\/|\/$/g, "");
      }
      return (window.location.pathname || "").replace(/^\/|\/$/g, "");
    }

    function run() {
      var path = getSitePath();
      var isGalerieOasisPage = path === "galerie-oasis" || path.indexOf("galerie-oasis") === 0;
      var body = getSiteBody();
      if (body) {
        body.classList.toggle("galerie-oasis-page", isGalerieOasisPage);
        body.classList.toggle("oasis-footer-force-dark", isGalerieOasisPage);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    document.addEventListener("sqs-route-did-change", run);
    /* Quand l'iframe de prévisualisation charge (éditeur Squarespace), réappliquer */
    var iframe = document.getElementById("sqs-site-frame");
    if (iframe) {
      iframe.addEventListener("load", run);
    }
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