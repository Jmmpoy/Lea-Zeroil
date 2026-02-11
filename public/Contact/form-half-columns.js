/**
 * Formulaire : demi-colonnes sur champs spécifiques (block list).
 */
  (function () {
    const root = document.querySelector('#block-b1e685acbb8ad735c7a3');
    if (!root) return;

    const items = Array.from(root.querySelectorAll('.field-list > *'));

    function norm(s) {
      return (s || "").toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function getTitle(el) {
      const t1 = el.querySelector('.title span');
      if (t1 && t1.textContent) return t1.textContent;
      const t2 = el.querySelector('label.title span');
      if (t2 && t2.textContent) return t2.textContent;
      return "";
    }

    items.forEach(el => {
      const title = norm(getTitle(el));

      // half columns
      if (title.includes('telephone') || title.includes('e-mail') || title.includes('email')) {
        el.setAttribute('data-gm-col', 'half');
      }
    });
  })();
