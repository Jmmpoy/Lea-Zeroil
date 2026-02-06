/**
 * Produit : dropdown custom des variantes avec swatches.
 */
  /* Dropdown custom pour variant-dropdown : liste avec fond thème, Presicav 10px, séparateurs */
  (function enhanceVariantDropdown() {
    var LIST_CLASS = 'gm-variant-dropdown-list';
    var TRIGGER_CLASS = 'gm-variant-dropdown-trigger';
    var ENHANCED_CLASS = 'gm-variant-dropdown-enhanced';

    /* Options uniques par texte affiché (première occurrence conservée) */
    function getUniqueOptions(select) {
      var seen = {};
      var out = [];
      for (var i = 0; i < select.options.length; i++) {
        var opt = select.options[i];
        var val = (opt.value || '').trim();
        if (!val) continue;
        var text = (opt.textContent || '').trim();
        if (seen[text]) continue;
        seen[text] = true;
        out.push(opt);
      }
      return out;
    }

    /* Options à afficher dans la liste = uniques, sans l’option actuellement sélectionnée */
    function getListOptions(select, uniqueOptions) {
      return uniqueOptions.filter(function (opt) { return opt.value !== select.value; });
    }

    function slugifyVariantColor(s) {
      return String(s ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'blanc';
    }

    function run() {
      document.querySelectorAll('.product-variants .variant-select-wrapper.variant-dropdown').forEach(function (wrapper) {
        if (wrapper.classList.contains(ENHANCED_CLASS)) return;
        if (wrapper.classList.contains('gm-single-option')) return;
        var sel = wrapper.querySelector('.variant-select');
        if (!sel || !sel.options || !sel.options.length) return;

        var uniqueOptions = getUniqueOptions(sel);
        if (uniqueOptions.length <= 1) return;

        wrapper.classList.add(ENHANCED_CLASS);

        var root = document.documentElement;
        var selectedSwatch = document.createElement('span');
        selectedSwatch.className = 'gm-variant-dropdown-selected-swatch';
        selectedSwatch.setAttribute('aria-hidden', 'true');
        wrapper.insertBefore(selectedSwatch, wrapper.firstChild);

        function updateSelectedSwatch() {
          var val = (sel.value || '').trim();
          if (!val) {
            selectedSwatch.style.background = '';
            selectedSwatch.removeAttribute('data-color');
            return;
          }
          var slug = slugifyVariantColor(val);
          selectedSwatch.setAttribute('data-color', slug);
          var colorVar = getComputedStyle(root).getPropertyValue('--diamond-color-' + slug).trim();
          selectedSwatch.style.background = colorVar || '';
        }
        updateSelectedSwatch();
        sel.addEventListener('change', updateSelectedSwatch);

        var trigger = document.createElement('div');
        trigger.className = TRIGGER_CLASS;
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        var list = document.createElement('ul');
        list.className = LIST_CLASS;
        list.setAttribute('role', 'listbox');

        function fillList() {
          list.innerHTML = '';
          var toShow = getListOptions(sel, uniqueOptions);
          var root = document.documentElement;
          toShow.forEach(function (opt) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = LIST_CLASS + '__opt';
            btn.setAttribute('role', 'option');
            btn.setAttribute('data-value', opt.value);
            var slug = slugifyVariantColor(opt.value);
            var swatch = document.createElement('span');
            swatch.className = LIST_CLASS + '__swatch';
            swatch.setAttribute('data-color', slug);
            swatch.setAttribute('aria-hidden', 'true');
            var colorVar = getComputedStyle(root).getPropertyValue('--diamond-color-' + slug).trim();
            if (colorVar) swatch.style.background = colorVar;
            var label = document.createElement('span');
            label.className = LIST_CLASS + '__label';
            label.textContent = (opt.textContent || opt.value || '').trim();
            btn.appendChild(swatch);
            btn.appendChild(label);
            li.appendChild(btn);
            list.appendChild(li);
          });
          list.querySelectorAll('.' + LIST_CLASS + '__opt').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              sel.value = btn.getAttribute('data-value');
              sel.dispatchEvent(new Event('change', { bubbles: true }));
              close();
            });
          });
        }

        wrapper.appendChild(trigger);
        wrapper.appendChild(list);
        fillList();

        function open() {
          fillList();
          list.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }

        function close() {
          list.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          list.classList.contains('is-open') ? close() : open();
        });

        document.addEventListener('click', function (e) {
          if (!wrapper.contains(e.target)) close();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') close();
        });
      });
    }

    function schedule() {
      run();
      setTimeout(run, 200);
      setTimeout(run, 500);
      setTimeout(run, 800);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
    else schedule();
    document.addEventListener('sqs-route-did-change', schedule);
  })();
