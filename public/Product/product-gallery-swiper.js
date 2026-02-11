/**
 * Page produit : initialisation du carousel Swiper de la galerie.
 */
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
