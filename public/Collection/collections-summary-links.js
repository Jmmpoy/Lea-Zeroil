/**
 * Collections : forcer les liens des summary items vers /collections.
 */
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
