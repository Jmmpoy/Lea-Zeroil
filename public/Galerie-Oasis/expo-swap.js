/**
 * Galerie Oasis - Échange d'images au survol
 * 
 * Permet de changer dynamiquement l'image principale lorsqu'on survole les liens
 * dans une liste d'exposition. Utilisé pour les pages d'exposition où plusieurs
 * images sont associées à différents liens.
 * 
 * Fonctionnalités :
 * - Préchargement automatique de toutes les images pour une transition fluide
 * - Transition en fondu (fade) de 180ms pour un effet visuel élégant
 * - Desktop : Activation au survol (mouseenter) et au focus clavier (accessibilité)
 * - Mobile : Activation au touchstart (sans empêcher le clic)
 * - Utilise requestAnimationFrame pour des performances optimales
 * 
 * Structure HTML requise :
 * - Conteneur : [data-expo-swap]
 * - Image principale : [data-expo-img]
 * - Liste de liens : [data-expo-list] a[data-img] (attribut data-img contient l'URL)
 * 
 * Exemple :
 * <div data-expo-swap>
 *   <img data-expo-img src="image-principale.jpg" />
 *   <div data-expo-list>
 *     <a data-img="image-1.jpg">Lien 1</a>
 *     <a data-img="image-2.jpg">Lien 2</a>
 *   </div>
 * </div>
 * 
 * Usage : Charger uniquement sur les pages contenant [data-expo-swap]
 */
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
