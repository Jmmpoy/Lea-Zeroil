/**
 * Produit : popup/guide d'entretien (contenu et interactions).
 */
  (function () {
    const GUIDE_HTML = `
    <div class="gm-guide__inner">
      <h2 class="gm-guide__title">Guide entretien</h2>

      <div class="gm-guide__content">
        <div class="gm-guide__row">
          <h3 class="gm-guide__colTitle">Soin</h3>
          <div class="gm-guide__colText">
            <p><strong>Céramique et verre</strong><br>
            Les surfaces en céramique et en verre requièrent un entretien régulier à l'aide d'un chiffon humidifié d'eau claire tiède, jamais chaude, ou avec un produit spécifiquement formulé pour ces matériaux. Après chaque nettoyage, il est essentiel de sécher puis de lustrer les surfaces à l'aide d'un chiffon doux en microfibre afin d'en préserver l'éclat. L'utilisation de produits abrasifs, corrosifs, acides ou alcalins est strictement déconseillée, tout comme celle d'outils durs ou pointus, susceptibles d'altérer durablement les surfaces.</p>
            <p style="margin-top: 40px;"><strong>Bois et fer</strong><br>
            Le bois et le fer nécessitent un entretien et un dépoussiérage réguliers à l'aide d'un chiffon doux. Pour le nettoyage, il est recommandé d'utiliser un chiffon légèrement humidifié, puis de sécher immédiatement afin de préserver la matière et sa patine. Le bois pourra être nourri ponctuellement avec un soin adapté à son essence. Les éléments en fer doivent être protégés de l'humidité et nettoyés sans agents agressifs. Toute exposition prolongée à l'eau, à la chaleur ou aux chocs est à éviter.</p>
          </div>
        </div>
      </div>
    </div>
  `;

    function ensureGuidePanel() {
      if (document.querySelector('.gm-guide')) return;

      const panel = document.createElement('div');
      panel.className = 'gm-guide';
      panel.innerHTML = `
      <div class="gm-guide__overlay" data-close-guide></div>
      <aside class="gm-guide__panel" role="dialog" aria-modal="true">
        ${GUIDE_HTML}
      </aside>
    `;
      document.body.appendChild(panel);
    }

    function openGuide() {
      ensureGuidePanel();
      const guide = document.querySelector('.gm-guide');
      /* Forcer un reflow pour que le navigateur peigne l’état fermé avant d’ajouter .is-open, sinon la transition ne s’exécute pas au premier ouverture */
      void guide.offsetHeight;
      guide.classList.add('is-open');
      document.documentElement.classList.add('gm-lock');
      document.body.classList.add('gm-lock');
    }

    function closeGuide() {
      const guide = document.querySelector('.gm-guide');
      if (!guide) return;
      guide.classList.remove('is-open');
      document.documentElement.classList.remove('gm-lock');
      document.body.classList.remove('gm-lock');
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="open-guide"]')) {
        e.preventDefault();
        openGuide();
        return;
      }
      if (e.target.matches('[data-close-guide]')) closeGuide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeGuide();
    });
  })();
