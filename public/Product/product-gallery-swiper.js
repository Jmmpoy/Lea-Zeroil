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

    track.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var touch = e.changedTouches && e.changedTouches[0];
      if (!touch) return;
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
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
