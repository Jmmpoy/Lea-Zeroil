/**
 * Homepage – Slider Goodmoods (Swiper)
 * Cible : [data-gm-slider] sur la page d'accueil
 * Dépendance : Swiper (swiper-bundle.min.js) chargé avant ce script
 */
(function initGoodmoodsSwiper() {
  function run() {
    const sliders = document.querySelectorAll("[data-gm-slider]");
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
      if (slider.swiper) return;

      new window.Swiper(slider, {
        slidesPerView: 2,
        spaceBetween: 48,
        speed: 400,
        grabCursor: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: slider.querySelector(".swiper-pagination"),
          clickable: true,
        },
        breakpoints: {
          0: {
            spaceBetween: 24,
          },
          768: {
            spaceBetween: 48,
          },
        },
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  document.addEventListener("sqs-route-did-change", run);
})();
