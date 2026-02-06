/**
 * Gallery Lightbox - Galerie avec lightbox
 * 
 * Crée une galerie d'images interactive avec lightbox (fenêtre modale) pour
 * afficher les images en grand format. Permet de naviguer entre les images
 * avec les flèches du clavier, les boutons de navigation, ou en cliquant
 * sur les tuiles de la galerie.
 * 
 * Fonctionnalités :
 * - Préchargement des images haute résolution pour un affichage instantané
 * - Navigation au clavier : Flèches gauche/droite, Escape pour fermer
 * - Navigation avec boutons : Précédent, Suivant, Fermer, Retour
 * - Compteur d'images (ex: "03/12")
 * - Légendes d'images dynamiques
 * - Fermeture en cliquant à l'extérieur de l'image
 * - Transition en fondu pour le changement d'image
 * - Verrouillage du scroll de la page quand la lightbox est ouverte
 * 
 * Structure HTML requise :
 * - Conteneur : [data-expo-gallery]
 * - Tuiles cliquables : .expo-tile[data-src="url-image"][data-caption="Légende"]
 * - Lightbox : [data-expo-lightbox]
 *   - Image : [data-expo-view]
 *   - Légende : [data-expo-caption]
 *   - Compteur : [data-expo-count]
 *   - Boutons : .expo-close, .expo-back, .expo-prev, .expo-next
 * 
 * Usage : Charger uniquement sur les pages contenant [data-expo-gallery]
 */
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
