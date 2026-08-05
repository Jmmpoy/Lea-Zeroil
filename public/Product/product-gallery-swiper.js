/**
 * Product gallery native autoplay helper.
 * Works with Squarespace native product gallery controls.
 */
(function initNativeProductGalleryAutoplay() {
  var INTERVAL_MS = 4500;
  var INIT_FLAG = "data-product-gallery-autoplay-init";

  function isEditMode() {
    return document.body && (
      document.body.classList.contains("sqs-edit-mode-active") ||
      document.body.classList.contains("sqs-is-page-editing")
    );
  }

  function setup(container) {
    if (!container || container.getAttribute(INIT_FLAG) === "1") return;
    if (isEditMode()) return;

    var nextBtn = container.querySelector('[data-product-gallery="next"]');
    var thumbnailButtons = Array.from(
      container.querySelectorAll(".product-gallery-thumbnails-item")
    );
    if (!nextBtn || !thumbnailButtons.length) return;

    var timer = null;
    var isPaused = false;
    var resumeTimeoutId = null;
    var RESUME_DELAY_MS = 2000;

    function goToFirst() {
      if (!thumbnailButtons.length) return;
      thumbnailButtons[0].click();
    }

    function goNext() {
      var isDisabled =
        nextBtn.disabled ||
        nextBtn.getAttribute("aria-disabled") === "true" ||
        nextBtn.classList.contains("disabled") ||
        nextBtn.classList.contains("swiper-button-disabled");

      if (isDisabled) {
        goToFirst();
        return;
      }
      nextBtn.click();
    }

    function tick() {
      if (isPaused) return;
      goNext();
    }

    function start() {
      if (timer) return;
      timer = window.setInterval(tick, INTERVAL_MS);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    container.addEventListener("mouseenter", function () {
      isPaused = true;
    });
    container.addEventListener("mouseleave", function () {
      isPaused = false;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    // API pour le swipe tactile (product-gallery-swipe) : pause immédiate au toucher,
    // reprise avec minuteur remis à zéro après un délai (évite un saut auto juste après un swipe manuel).
    container.__galleryAutoplay = {
      pause: function () {
        isPaused = true;
        if (resumeTimeoutId) {
          window.clearTimeout(resumeTimeoutId);
          resumeTimeoutId = null;
        }
      },
      resumeAfterDelay: function () {
        if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);
        resumeTimeoutId = window.setTimeout(function () {
          resumeTimeoutId = null;
          stop();
          isPaused = false;
          start();
        }, RESUME_DELAY_MS);
      }
    };

    container.setAttribute(INIT_FLAG, "1");
    start();
  }

  function run() {
    var galleries = document.querySelectorAll(
      '.product-gallery[data-product-gallery="container"]'
    );
    galleries.forEach(setup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", run);
  document.addEventListener("sqs-route-did-change", function () {
    setTimeout(run, 80);
  });
})();

/**
 * Product gallery: navigation par swipe tactile (mobile).
 * Remplace les petits carrés de miniatures (masqués en CSS sous 900px)
 * en déclenchant les boutons natifs prev/next déjà présents dans le DOM.
 */
(function initProductGallerySwipe() {
  var SWIPE_THRESHOLD_PX = 40;
  var TRANSITION_LOCK_MS = 350; // couvre le fondu mobile (0.28s) + marge
  var INIT_FLAG = "data-product-gallery-swipe-init";

  function setup(container) {
    if (!container || container.getAttribute(INIT_FLAG) === "1") return;

    var track = container.querySelector('[data-product-gallery="slides"]');
    var nextBtn = container.querySelector('[data-product-gallery="next"]');
    var prevBtn = container.querySelector('[data-product-gallery="prev"]');
    if (!track || !nextBtn || !prevBtn) return;

    var startX = 0;
    var startY = 0;
    var tracking = false;
    var lastNavAt = 0;

    track.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      if (container.__galleryAutoplay) container.__galleryAutoplay.pause();
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      if (container.__galleryAutoplay) container.__galleryAutoplay.resumeAfterDelay();
      if (!tracking) return;
      tracking = false;
      var touch = e.changedTouches && e.changedTouches[0];
      if (!touch) return;
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;

      // Anti-spam : ignore un nouveau swipe tant que la transition précédente n'est pas finie
      var now = Date.now();
      if (now - lastNavAt < TRANSITION_LOCK_MS) return;
      lastNavAt = now;

      if (dx < 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    }, { passive: true });

    container.setAttribute(INIT_FLAG, "1");
  }

  function run() {
    var galleries = document.querySelectorAll(
      '.product-gallery[data-product-gallery="container"]'
    );
    galleries.forEach(setup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", run);
  document.addEventListener("sqs-route-did-change", function () {
    setTimeout(run, 80);
  });
})();

/**
 * Product gallery : couleur des losanges indicateurs adaptée à la luminance
 * de l'image affichée (crème sur photo sombre, bordeaux sur photo claire).
 * Échantillonne uniquement la bande gauche de l'image (là où les losanges
 * sont superposés), pas l'image entière.
 */
(function initProductGalleryIndicatorColor() {
  var SAMPLE_STRIP_RATIO = 0.10; // correspond à la largeur de .product-gallery-scroll (10%)
  var DARK_LUMINANCE_THRESHOLD = 128;
  var INIT_FLAG = "data-product-gallery-color-init";
  var colorCache = new Map();

  function relativeLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function sampleIsDark(url, callback) {
    if (colorCache.has(url)) {
      callback(colorCache.get(url));
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        var stripWidth = Math.max(1, Math.round(img.naturalWidth * SAMPLE_STRIP_RATIO));
        var canvas = document.createElement("canvas");
        canvas.width = 8;
        canvas.height = 24;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, stripWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        var total = 0;
        var count = 0;
        for (var i = 0; i < data.length; i += 4) {
          total += relativeLuminance(data[i], data[i + 1], data[i + 2]);
          count++;
        }
        var isDark = count > 0 && total / count < DARK_LUMINANCE_THRESHOLD;
        colorCache.set(url, isDark);
        callback(isDark);
      } catch (e) {
        callback(null); // repli : ne touche pas aux variables CSS (garde le rendu par défaut)
      }
    };
    img.onerror = function () {
      callback(null);
    };
    img.src = url + (url.indexOf("?") !== -1 ? "&" : "?") + "format=100w";
  }

  function getSelectedSlideImage(container) {
    var selected =
      container.querySelector(".product-gallery-slides-item.selected") ||
      container.querySelector(".product-gallery-slides-item:first-of-type");
    return selected ? selected.querySelector(".product-gallery-slides-item-image") : null;
  }

  function applyColorForCurrentSlide(container) {
    var slideImg = getSelectedSlideImage(container);
    if (!slideImg) return;
    var url = slideImg.getAttribute("data-image") || slideImg.getAttribute("data-src");
    if (!url) return;

    sampleIsDark(url, function (isDark) {
      if (isDark === null) return;
      if (isDark) {
        container.style.setProperty("--thumb-color", "var(--oasis-cream-35)");
        container.style.setProperty("--thumb-color-active", "var(--oasis-cream)");
      } else {
        container.style.setProperty("--thumb-color", "var(--oasis-bordeaux-55)");
        container.style.setProperty("--thumb-color-active", "var(--oasis-bordeaux)");
      }
    });
  }

  function setup(container) {
    if (!container || container.getAttribute(INIT_FLAG) === "1") return;
    var slidesRoot = container.querySelector('[data-product-gallery="slides"]');
    if (!slidesRoot) return;

    applyColorForCurrentSlide(container);

    var observer = new MutationObserver(function () {
      applyColorForCurrentSlide(container);
    });
    observer.observe(slidesRoot, { attributes: true, attributeFilter: ["class"], subtree: true });

    container.setAttribute(INIT_FLAG, "1");
  }

  function run() {
    var galleries = document.querySelectorAll(
      '.product-gallery[data-product-gallery="container"]'
    );
    galleries.forEach(setup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", run);
  document.addEventListener("sqs-route-did-change", function () {
    setTimeout(run, 80);
  });
})();
