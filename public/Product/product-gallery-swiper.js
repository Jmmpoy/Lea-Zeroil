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
