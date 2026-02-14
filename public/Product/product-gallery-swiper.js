/**
 * Product gallery native autoplay helper.
 * Works with Squarespace native product gallery controls.
 */
(function initNativeProductGalleryAutoplay() {
  var INTERVAL_MS = 4500;
  var INIT_FLAG = "data-product-gallery-autoplay-init";

  function setup(container) {
    if (!container || container.getAttribute(INIT_FLAG) === "1") return;

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
